"use client";

import React, { useState, useEffect, useRef } from "react";

const ValidatedEditor: React.FC<{
	value: string;
	onChange: (value: string) => void;
	language: string;
	placeholder?: string;
	disabled?: boolean;
	height?: string;
}> = ({
	value,
	onChange,
	language,
	placeholder,
	disabled = false,
	height = "300px",
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const preRef = useRef<HTMLPreElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);

	useEffect(() => {
		if (document.querySelector("script[data-prismjs]")) {
			setIsLoaded(true);
			return;
		}

		const linkEl = document.createElement("link");
		linkEl.rel = "stylesheet";
		linkEl.href =
			"https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css";
		document.head.appendChild(linkEl);

		const styleEl = document.createElement("style");
		styleEl.textContent = `
      .prism-editor-pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        color: #e2e8f0;
      }
      .prism-editor-pre.placeholder {
        color: #64748b;
      }
      .editor-container:focus-within {
        border-color: #a855f7;
        box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
      }
      .editor-container.has-error {
        border-color: #ef4444;
      }
      .editor-container.has-error:focus-within {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
      }
      .validation-error {
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 3px solid #ef4444;
        padding: 8px 12px;
        font-size: 12px;
        color: #fca5a5;
        margin-top: 8px;
        border-radius: 0 4px 4px 0;
      }
      .error-line {
        background-color: rgba(239, 68, 68, 0.2);
        display: inline-block;
        width: 100%;
      }
    `;
		document.head.appendChild(styleEl);

		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js";
		script.setAttribute("data-prismjs", "true");
		script.onload = () => {
			const languages = ["javascript", "json", "xml", "css", "markup"];

			const loadLanguage = (index: number) => {
				if (index >= languages.length) {
					setIsLoaded(true);
					highlightCode();
					return;
				}

				const lang = languages[index];
				const langScript = document.createElement("script");
				langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
				langScript.onload = () => loadLanguage(index + 1);
				document.head.appendChild(langScript);
			};

			loadLanguage(0);
		};

		document.head.appendChild(script);
	}, []);

	useEffect(() => {
		if (language === "json" && value.trim()) {
			try {
				JSON.parse(value);
				setValidationError(null);
			} catch (error) {
				if (error instanceof Error) {
					setValidationError(error.message);
				} else {
					setValidationError("Invalid JSON");
				}
			}
		} else {
			setValidationError(null);
		}
	}, [value, language]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (disabled) return;

		if (e.key === "Tab") {
			e.preventDefault();
			const start = e.currentTarget.selectionStart;
			const end = e.currentTarget.selectionEnd;

			const newValue = value.substring(0, start) + "  " + value.substring(end);
			onChange(newValue);

			setTimeout(() => {
				if (textareaRef.current) {
					textareaRef.current.selectionStart =
						textareaRef.current.selectionEnd = start + 2;
				}
			}, 0);
		}

		if (language === "json" && e.key === "F" && e.ctrlKey && e.shiftKey) {
			e.preventDefault();
			try {
				const parsed = JSON.parse(value);
				const formatted = JSON.stringify(parsed, null, 2);
				onChange(formatted);
			} catch (e) {}
		}
	};

	const getPrismLanguage = () => {
		switch (language) {
			case "json":
				return "json";
			case "javascript":
				return "javascript";
			case "xml":
				return "xml";
			case "html":
				return "markup";
			case "css":
				return "css";
			default:
				return "markup";
		}
	};

	const getErrorLineNumber = (): number | null => {
		if (!validationError) return null;

		const lineMatch = validationError.match(/line\s+(\d+)/i);
		if (lineMatch && lineMatch[1]) {
			return parseInt(lineMatch[1], 10);
		}

		const posMatch = validationError.match(/position\s+(\d+)/i);
		if (posMatch && posMatch[1]) {
			const position = parseInt(posMatch[1], 10);
			let line = 1;
			for (let i = 0; i < position && i < value.length; i++) {
				if (value[i] === "\n") line++;
			}
			return line;
		}

		return null;
	};

	const highlightCode = () => {
		if (!isLoaded || !preRef.current || !window.Prism) return;

		const prismLang = getPrismLanguage();
		let highlighted = value
			? window.Prism.highlight(
					value,
					window.Prism.languages[prismLang] || window.Prism.languages.markup,
					prismLang
			  )
			: placeholder || "";

		const errorLine = getErrorLineNumber();
		if (errorLine !== null) {
			const lines = highlighted.split("\n");
			if (errorLine > 0 && errorLine <= lines.length) {
				lines[errorLine - 1] = `<span class="error-line">${
					lines[errorLine - 1]
				}</span>`;
			}
			highlighted = lines.join("\n");
		}

		preRef.current.innerHTML = highlighted;

		if (!value && preRef.current) {
			preRef.current.classList.add("placeholder");
		} else if (preRef.current) {
			preRef.current.classList.remove("placeholder");
		}
	};

	useEffect(() => {
		highlightCode();
	}, [value, language, isLoaded, validationError]);

	const handleScroll = () => {
		if (preRef.current && textareaRef.current) {
			preRef.current.scrollTop = textareaRef.current.scrollTop;
			preRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	};

	return (
		<div className="relative">
			<div
				className={`editor-container relative rounded-xl border border-slate-600/50 overflow-hidden bg-slate-900 ${
					validationError ? "has-error" : ""
				} ${disabled ? "opacity-50" : ""}`}
				style={{ height }}
			>
				<textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					onScroll={handleScroll}
					disabled={disabled}
					spellCheck="false"
					className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm resize-none outline-none"
					style={{ caretColor: "#a855f7" }}
				/>
				<pre
					ref={preRef}
					className="prism-editor-pre absolute inset-0 w-full h-full p-4 m-0 font-mono text-sm overflow-auto pointer-events-none"
				>
					{!isLoaded && (value || placeholder || "")}
				</pre>
			</div>

			{validationError && !disabled && (
				<div className="validation-error">
					<div className="font-bold">Error:</div>
					<div>{validationError}</div>
				</div>
			)}

			{disabled && (
				<div className="absolute inset-0 bg-slate-900/50 rounded-xl flex items-center justify-center">
					<span className="text-slate-400 text-sm font-medium">
						Code editor is disabled for this HTTP method
					</span>
				</div>
			)}
		</div>
	);
};

declare global {
	interface Window {
		Prism: any;
	}
}

const HTTP_METHODS = [
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"PATCH",
	"HEAD",
	"OPTIONS",
] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

const AUTH_TYPES = {
	none: "None",
	basic: "Basic Auth",
	bearer: "Bearer Token",
} as const;
type AuthType = keyof typeof AUTH_TYPES;

interface KeyValueItem {
	id: string;
	key: string;
	value: string;
	enabled: boolean;
}

interface AuthConfig {
	type: AuthType;
	basicUser?: string;
	basicPass?: string;
	bearerToken?: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const validateUrl = (url: string): { isValid: boolean; error?: string } => {
	if (!url.trim()) return { isValid: true };

	const trimmedUrl = url.trim();

	if (/[<>"\s]/.test(trimmedUrl)) {
		return { isValid: false, error: "URL contains invalid characters" };
	}

	const hasProtocol = /^https?:\/\//.test(trimmedUrl);
	let testUrl = trimmedUrl;

	if (!hasProtocol) {
		testUrl = "https://" + trimmedUrl;
	}

	try {
		const urlObj = new URL(testUrl);

		if (!["http:", "https:"].includes(urlObj.protocol)) {
			return { isValid: false, error: "Protocol must be http or https" };
		}

		const hostname = urlObj.hostname;
		if (!hostname || hostname.length === 0) {
			return { isValid: false, error: "Missing hostname" };
		}

		if (
			hostname.includes("..") ||
			hostname.startsWith(".") ||
			hostname.endsWith(".")
		) {
			return { isValid: false, error: "Invalid hostname format" };
		}

		if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
			return { isValid: false, error: "Hostname contains invalid characters" };
		}

		if (hostname !== "localhost" && !hostname.includes(".")) {
			return { isValid: false, error: "Hostname must contain a domain" };
		}

		if (hostname !== "localhost") {
			const parts = hostname.split(".");
			const tld = parts[parts.length - 1];
			if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
				return { isValid: false, error: "Invalid top-level domain" };
			}
		}

		if (!hasProtocol) {
			if (trimmedUrl.includes(",")) {
				return {
					isValid: false,
					error: "Invalid character: comma should be dot",
				};
			}

			if (trimmedUrl.includes("..")) {
				return { isValid: false, error: "Invalid hostname format" };
			}
		}

		return { isValid: true };
	} catch (error) {
		if (trimmedUrl.includes(",")) {
			return {
				isValid: false,
				error: "Invalid character: comma should be dot",
			};
		}
		if (trimmedUrl.includes(" ")) {
			return { isValid: false, error: "URLs cannot contain spaces" };
		}
		return { isValid: false, error: "Invalid URL format" };
	}
};

const buildUrl = (baseUrl: string, queryParams: KeyValueItem[]): string => {
	if (!baseUrl.trim()) return "";
	try {
		let fullBaseUrl = baseUrl;
		if (!/^[^:]+:\/\//.test(baseUrl)) {
			fullBaseUrl = "https://" + baseUrl;
		}

		const url = new URL(fullBaseUrl);

		const existingSearchParams = new URLSearchParams(url.search);
		queryParams
			.filter((p) => p.enabled && p.key)
			.forEach((param) => {
				existingSearchParams.append(param.key, param.value);
			});
		url.search = existingSearchParams.toString();

		let finalUrl = url.toString();
		if (!/^[^:]+:\/\//.test(baseUrl) && finalUrl.startsWith("https://")) {
			finalUrl = finalUrl.substring(8);
		}
		return finalUrl;
	} catch (error) {
		let queryString = queryParams
			.filter((p) => p.enabled && p.key)
			.map(
				(param) =>
					`${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
			)
			.join("&");

		if (!queryString) return baseUrl;

		if (baseUrl.includes("?")) {
			return baseUrl.endsWith("?")
				? baseUrl + queryString
				: baseUrl + "&" + queryString;
		} else {
			return baseUrl + "?" + queryString;
		}
	}
};

const generateCurlCommand = (
	method: HttpMethod,
	fullUrl: string,
	headers: KeyValueItem[],
	body: string,
	authConfig: AuthConfig
): string => {
	if (!fullUrl.trim()) return "Enter a URL to see the cURL command.";

	const quotedUrl = `'${fullUrl.replace(/'/g, "'\\''")}'`;
	let curl = `curl --location --request ${method} ${quotedUrl}`;

	headers
		.filter((h) => h.enabled && h.key)
		.forEach((header) => {
			curl += ` \\\n  --header '${header.key.replace(
				/'/g,
				"'\\''"
			)}: ${header.value.replace(/'/g, "'\\''")}'`;
		});

	switch (authConfig.type) {
		case "basic":
			if (authConfig.basicUser || authConfig.basicPass) {
				const user = authConfig.basicUser?.replace(/'/g, "'\\''") || "";
				const pass = authConfig.basicPass?.replace(/'/g, "'\\''") || "";
				curl += ` \\\n  --user '${user}:${pass}'`;
			}
			break;
		case "bearer":
			if (authConfig.bearerToken) {
				curl += ` \\\n  --header 'Authorization: Bearer ${authConfig.bearerToken.replace(
					/'/g,
					"'\\''"
				)}'`;
			}
			break;
	}

	if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
		let processedBody = body;
		const contentTypeHeader = headers.find(
			(h) => h.enabled && h.key.toLowerCase() === "content-type"
		);
		if (
			contentTypeHeader &&
			contentTypeHeader.value.toLowerCase().includes("application/json")
		) {
			try {
				const parsedJson = JSON.parse(body);
				processedBody = JSON.stringify(parsedJson, null, 2);
			} catch (e) {}
		}
		curl += ` \\\n  --data-raw '${processedBody.replace(/'/g, "'\\''")}'`;
	}

	return curl;
};

const MethodBadge: React.FC<{ method: HttpMethod }> = ({ method }) => {
	const getMethodStyles = (method: HttpMethod) => {
		switch (method) {
			case "GET":
				return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
			case "POST":
				return "bg-blue-500/20 text-blue-400 border-blue-500/30";
			case "PUT":
				return "bg-amber-500/20 text-amber-400 border-amber-500/30";
			case "DELETE":
				return "bg-red-500/20 text-red-400 border-red-500/30";
			case "PATCH":
				return "bg-purple-500/20 text-purple-400 border-purple-500/30";
			default:
				return "bg-gray-500/20 text-gray-400 border-gray-500/30";
		}
	};

	return (
		<span
			className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getMethodStyles(
				method
			)}`}
		>
			{method}
		</span>
	);
};

const MethodSelector: React.FC<{
	method: HttpMethod;
	onChange: (method: HttpMethod) => void;
}> = ({ method, onChange }) => {
	return (
		<div className="relative">
			<select
				value={method}
				onChange={(e) => onChange(e.target.value as HttpMethod)}
				className="w-full pl-16 sm:pl-24 pr-8 sm:pr-12 py-3 sm:py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl sm:rounded-2xl text-slate-200 transition-all duration-300 hover:border-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer font-bold text-base sm:text-lg"
				style={{
					backgroundImage: "none",
					colorScheme: "dark",
				}}
			>
				{HTTP_METHODS.map((methodOption) => (
					<option
						key={methodOption}
						value={methodOption}
						className="bg-slate-800 text-slate-200 py-2 px-4 hover:bg-slate-700"
						style={{ backgroundColor: "#1e293b", color: "#e2e8f0" }}
					>
						{methodOption}
					</option>
				))}
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
				<span className="text-slate-400 text-xs sm:text-sm">▼</span>
			</div>
			<div className="absolute inset-y-0 left-2 sm:left-3 flex items-center pointer-events-none">
				<div className="scale-75 sm:scale-100">
					<MethodBadge method={method} />
				</div>
			</div>
		</div>
	);
};

const AuthTypeSelector: React.FC<{
	authType: AuthType;
	onChange: (authType: AuthType) => void;
}> = ({ authType, onChange }) => {
	const getAuthIcon = (type: AuthType) => {
		switch (type) {
			case "none":
				return "🚫";
			case "basic":
				return "👤";
			case "bearer":
				return "🎫";
			default:
				return "🔐";
		}
	};

	return (
		<div className="relative">
			<select
				value={authType}
				onChange={(e) => onChange(e.target.value as AuthType)}
				className="w-full pl-12 sm:pl-16 pr-8 sm:pr-12 py-3 sm:py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl sm:rounded-2xl text-slate-200 transition-all duration-300 hover:border-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer font-semibold text-base sm:text-lg"
				style={{
					backgroundImage: "none",
					colorScheme: "dark",
				}}
			>
				{Object.entries(AUTH_TYPES).map(([key, label]) => (
					<option
						key={key}
						value={key}
						className="bg-slate-800 text-slate-200 py-2 px-4 hover:bg-slate-700"
						style={{ backgroundColor: "#1e293b", color: "#e2e8f0" }}
					>
						{label}
					</option>
				))}
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
				<span className="text-slate-400 text-xs sm:text-sm">▼</span>
			</div>
			<div className="absolute inset-y-0 left-3 sm:left-4 flex items-center pointer-events-none">
				<span className="text-base sm:text-lg">{getAuthIcon(authType)}</span>
			</div>
		</div>
	);
};

interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	isOpenInitially?: boolean;
	icon?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
	title,
	children,
	isOpenInitially = false,
	icon = "⚙️",
}) => {
	const [isOpen, setIsOpen] = useState(isOpenInitially);

	return (
		<div className="group relative">
			<div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
			<div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl shadow-xl">
				<div
					className="flex justify-between items-center cursor-pointer p-8 hover:bg-slate-800/30 transition-all duration-300 group"
					onClick={() => setIsOpen(!isOpen)}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
					}}
				>
					<div className="flex items-center space-x-4">
						<span className="text-2xl filter drop-shadow-lg">{icon}</span>
						<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
							{title}
						</h2>
					</div>
					<div className="flex items-center space-x-3">
						<div
							className={`w-2 h-2 rounded-full transition-all duration-300 ${
								isOpen
									? "bg-green-400 shadow-green-400/50 shadow-lg"
									: "bg-slate-600"
							}`}
						></div>
						<span
							className={`text-purple-400 text-xl transition-all duration-500 transform ${
								isOpen ? "rotate-90 scale-110" : ""
							} group-hover:text-pink-400`}
						>
							▶
						</span>
					</div>
				</div>
				<div
					className={`transition-all duration-500 ease-in-out ${
						isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
					} overflow-hidden`}
				>
					<div className="px-8 pb-8 pt-4 border-t border-slate-700/30">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

interface KeyValueListEditorProps {
	items: KeyValueItem[];
	setItems: React.Dispatch<React.SetStateAction<KeyValueItem[]>>;
	itemTypeLabel: string;
	isDraggable?: boolean;
}

const KeyValueListEditor: React.FC<KeyValueListEditorProps> = ({
	items,
	setItems,
	itemTypeLabel,
	isDraggable = false,
}) => {
	const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
	const dragItemNode = useRef<HTMLDivElement | null>(null);
	const dragOverItemNode = useRef<HTMLDivElement | null>(null);

	const handleAddItem = () => {
		setItems([
			...items,
			{ id: generateId(), key: "", value: "", enabled: true },
		]);
	};

	const handleItemChange = (
		id: string,
		field: keyof Omit<KeyValueItem, "id">,
		value: string | boolean
	) => {
		setItems(
			items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const handleRemoveItem = (id: string) => {
		setItems(items.filter((item) => item.id !== id));
	};

	const handleDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		item: KeyValueItem
	) => {
		if (!isDraggable) return;
		dragItemNode.current = e.currentTarget;
		e.dataTransfer.setData("text/plain", item.id);
		setDraggedItemId(item.id);
		requestAnimationFrame(() => {
			if (dragItemNode.current) {
				dragItemNode.current.style.cursor = "grabbing";
			}
		});
	};

	const handleDragEnter = (
		e: React.DragEvent<HTMLDivElement>,
		targetItem: KeyValueItem
	) => {
		if (
			!isDraggable ||
			!dragItemNode.current ||
			dragItemNode.current === e.currentTarget
		)
			return;
		dragOverItemNode.current = e.currentTarget;
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		if (!isDraggable) return;
		e.preventDefault();
		if (dragItemNode.current && dragItemNode.current !== e.currentTarget) {
		}
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		targetItem: KeyValueItem
	) => {
		if (!isDraggable || !draggedItemId) return;
		e.preventDefault();

		const currentDraggedItemId = e.dataTransfer.getData("text/plain");
		if (!currentDraggedItemId) return;

		const draggedItemIndex = items.findIndex(
			(item) => item.id === currentDraggedItemId
		);
		let targetItemIndex = items.findIndex((item) => item.id === targetItem.id);

		if (
			draggedItemIndex === -1 ||
			targetItemIndex === -1 ||
			draggedItemIndex === targetItemIndex
		) {
			setDraggedItemId(null);
			return;
		}

		const newItems = [...items];
		const [draggedActualItem] = newItems.splice(draggedItemIndex, 1);

		if (draggedItemIndex < targetItemIndex) {
		}

		newItems.splice(targetItemIndex, 0, draggedActualItem);

		setItems(newItems);
		setDraggedItemId(null);
		dragItemNode.current = null;
		dragOverItemNode.current = null;
	};

	const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
		if (dragItemNode.current) {
			dragItemNode.current.style.cursor = "grab";
		}
		setDraggedItemId(null);
		dragItemNode.current = null;
		dragOverItemNode.current = null;
	};

	return (
		<div className="space-y-4">
			{items.length === 0 ? (
				<div className="text-center py-12 px-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
					<div className="text-4xl mb-4 opacity-50">📝</div>
					<p className="text-slate-500 text-lg mb-4">
						No {itemTypeLabel.toLowerCase()}s yet
					</p>
					<p className="text-slate-600 text-sm">
						Click the button below to add your first{" "}
						{itemTypeLabel.toLowerCase()}
					</p>
				</div>
			) : (
				items.map((item, index) => (
					<div
						key={item.id}
						className={`group relative transition-all duration-300 ${
							draggedItemId === item.id
								? "scale-105 rotate-1 z-10"
								: "hover:scale-[1.02]"
						}`}
						draggable={isDraggable}
						onDragStart={
							isDraggable ? (e) => handleDragStart(e, item) : undefined
						}
						onDragEnter={
							isDraggable ? (e) => handleDragEnter(e, item) : undefined
						}
						onDragOver={isDraggable ? handleDragOver : undefined}
						onDrop={isDraggable ? (e) => handleDrop(e, item) : undefined}
						onDragEnd={isDraggable ? handleDragEnd : undefined}
					>
						<div
							className={`p-3 sm:p-4 lg:p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 transition-all duration-300 ${
								draggedItemId === item.id
									? "shadow-xl shadow-purple-500/15 border-purple-500/50 bg-slate-800/70"
									: "hover:border-slate-600/70 hover:shadow-lg hover:bg-slate-800/60"
							}`}
						>
							<div className="block sm:hidden space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<div className="flex items-center justify-center text-slate-500 font-mono text-xs font-semibold w-6 h-6 bg-slate-700/50 rounded-full">
											{index + 1}
										</div>
										{isDraggable && (
											<div
												className={`flex space-x-0.5 transition-all duration-200 ${
													draggedItemId === item.id
														? "text-purple-400 cursor-grabbing"
														: "text-slate-500 cursor-grab hover:text-purple-400"
												}`}
											>
												<div className="w-0.5 h-3 bg-current rounded-full"></div>
												<div className="w-0.5 h-3 bg-current rounded-full"></div>
												<div className="w-0.5 h-3 bg-current rounded-full"></div>
											</div>
										)}
									</div>

									<div className="flex items-center space-x-2">
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												className="sr-only peer"
												checked={item.enabled}
												onChange={(e) =>
													handleItemChange(item.id, "enabled", e.target.checked)
												}
											/>
											<div className="relative w-8 h-4 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
										</label>

										<button
											className="w-8 h-8 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center text-sm"
											onClick={() => handleRemoveItem(item.id)}
											title={`Remove this ${itemTypeLabel.toLowerCase()}`}
										>
											✕
										</button>
									</div>
								</div>

								<div className="space-y-2">
									<input
										type="text"
										placeholder="Key"
										className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-slate-500 text-sm"
										value={item.key}
										onChange={(e) =>
											handleItemChange(item.id, "key", e.target.value)
										}
									/>
									<input
										type="text"
										placeholder="Value"
										className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-slate-500 text-sm"
										value={item.value}
										onChange={(e) =>
											handleItemChange(item.id, "value", e.target.value)
										}
									/>
								</div>
							</div>

							<div className="hidden sm:flex items-center gap-4">
								<div className="flex items-center justify-center text-slate-500 font-mono text-sm font-semibold min-w-8">
									{String(index + 1).padStart(2, "0")}
								</div>

								{isDraggable && (
									<div
										className={`flex flex-col space-y-1 transition-all duration-200 ${
											draggedItemId === item.id
												? "text-purple-400 cursor-grabbing"
												: "text-slate-500 cursor-grab hover:text-purple-400"
										}`}
									>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
										<div className="w-1 h-1 bg-current rounded-full"></div>
									</div>
								)}

								<div className="flex items-center">
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											className="sr-only peer"
											checked={item.enabled}
											onChange={(e) =>
												handleItemChange(item.id, "enabled", e.target.checked)
											}
										/>
										<div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
										<span className="ml-3 text-sm font-medium text-slate-400">
											{item.enabled ? "Enabled" : "Disabled"}
										</span>
									</label>
								</div>

								<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="relative">
										<input
											type="text"
											placeholder="Key"
											className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-slate-500"
											value={item.key}
											onChange={(e) =>
												handleItemChange(item.id, "key", e.target.value)
											}
										/>
									</div>

									<div className="relative">
										<input
											type="text"
											placeholder="Value"
											className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 hover:border-slate-500"
											value={item.value}
											onChange={(e) =>
												handleItemChange(item.id, "value", e.target.value)
											}
										/>
									</div>
								</div>

								<button
									className="relative group/btn overflow-hidden px-4 py-3 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-red-500/40"
									onClick={() => handleRemoveItem(item.id)}
									title={`Remove this ${itemTypeLabel.toLowerCase()}`}
								>
									<div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
									<span className="relative z-10 font-semibold">✕</span>
								</button>
							</div>
						</div>
					</div>
				))
			)}

			<div className="flex justify-center">
				<button
					className="relative px-8 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30 flex items-center space-x-3"
					onClick={handleAddItem}
				>
					<div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
						<span className="text-sm font-bold">+</span>
					</div>
					<span>Add {itemTypeLabel}</span>
				</button>
			</div>
		</div>
	);
};

const CollapsibleCurlCommand: React.FC<{
	curlCommand: string;
	onCopy: () => void;
	copyFeedback: string;
	className?: string;
}> = ({ curlCommand, onCopy, copyFeedback, className = "" }) => {
	const [foldedSections, setFoldedSections] = useState<Set<string>>(new Set());

	const toggleFold = (section: string) => {
		const newFolded = new Set(foldedSections);
		if (newFolded.has(section)) {
			newFolded.delete(section);
		} else {
			newFolded.add(section);
		}
		setFoldedSections(newFolded);
	};

	const formatCurlWithFolding = (curl: string) => {
		if (!curl || curl === "Enter a URL to see the cURL command.") {
			return <span className="text-slate-500 italic">{curl}</span>;
		}

		const lines = curl.split("\n");
		const result: React.ReactElement[] = [];
		let currentSection = "";
		let sectionLines: string[] = [];

		const addSection = (
			section: string,
			lines: string[],
			canFold: boolean = true
		) => {
			const isFolded = foldedSections.has(section);
			const sectionKey = `${section}-${lines.length}`;

			if (canFold && lines.length > 1) {
				result.push(
					<div key={sectionKey} className="relative">
						<button
							onClick={() => toggleFold(section)}
							className="absolute -left-4 top-0 w-3 h-3 text-xs text-slate-500 hover:text-purple-400 transition-colors duration-200 flex items-center justify-center"
							title={isFolded ? "Expand" : "Collapse"}
						>
							{isFolded ? "▶" : "▼"}
						</button>
						<div>
							<span className="text-cyan-400">{lines[0]}</span>
							{!isFolded &&
								lines.slice(1).map((line, idx) => (
									<div key={idx}>
										<span className="text-slate-300">{line}</span>
									</div>
								))}
							{isFolded && lines.length > 1 && (
								<span className="text-slate-500 italic ml-2">
									... {lines.length - 1} more lines
								</span>
							)}
						</div>
					</div>
				);
			} else {
				lines.forEach((line, idx) => {
					result.push(
						<div key={`${sectionKey}-${idx}`}>
							<span className={idx === 0 ? "text-cyan-400" : "text-slate-300"}>
								{line}
							</span>
						</div>
					);
				});
			}
		};

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.includes("curl --location --request")) {
				if (sectionLines.length > 0) {
					addSection(currentSection, sectionLines);
					sectionLines = [];
				}
				currentSection = "request";
				sectionLines = [line];
			} else if (line.includes("--header")) {
				if (currentSection !== "headers") {
					if (sectionLines.length > 0) {
						addSection(currentSection, sectionLines);
					}
					currentSection = "headers";
					sectionLines = [line];
				} else {
					sectionLines.push(line);
				}
			} else if (line.includes("--user")) {
				if (sectionLines.length > 0) {
					addSection(currentSection, sectionLines);
				}
				currentSection = "auth";
				sectionLines = [line];
			} else if (line.includes("--data-raw")) {
				if (sectionLines.length > 0) {
					addSection(currentSection, sectionLines);
				}
				currentSection = "body";
				sectionLines = [line];
			} else {
				sectionLines.push(line);
			}
		}

		if (sectionLines.length > 0) {
			addSection(currentSection, sectionLines);
		}

		return result;
	};

	return (
		<div className={`relative ${className}`}>
			<div className="bg-slate-950/80 text-slate-300 p-6 pr-20 rounded-2xl font-mono text-xs leading-relaxed overflow-y-auto max-h-72 border border-slate-800 shadow-inner">
				<div className="pl-4">{formatCurlWithFolding(curlCommand)}</div>
			</div>
			<div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
				<button
					className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border ${
						copyFeedback === "Copied!"
							? "bg-green-600/80 hover:bg-green-600 text-green-100 border-green-500/50"
							: copyFeedback === "Failed to copy"
							? "bg-red-600/80 hover:bg-red-600 text-red-100 border-red-500/50"
							: "bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700/50 hover:border-slate-600"
					}`}
					onClick={onCopy}
					title="Copy to clipboard"
				>
					{copyFeedback === "Copied!"
						? "✓ Copied!"
						: copyFeedback === "Failed to copy"
						? "✗ Failed"
						: "📋 Copy"}
				</button>
			</div>
		</div>
	);
};

const LanguageSelector: React.FC<{
	language: string;
	onChange: (language: string) => void;
	disabled?: boolean;
}> = ({ language, onChange, disabled = false }) => {
	const languages = [
		{ value: "json", label: "JSON", icon: "{}" },
		{ value: "xml", label: "XML", icon: "<>" },
		{ value: "javascript", label: "JavaScript", icon: "JS" },
		{ value: "html", label: "HTML", icon: "<>" },
		{ value: "css", label: "CSS", icon: "🎨" },
		{ value: "plaintext", label: "Plain Text", icon: "📝" },
	];

	return (
		<div className="flex items-center space-x-2">
			<span className="text-sm font-medium text-slate-400">Language:</span>
			<select
				value={language}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				className="px-3 py-1.5 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-200 text-sm transition-all duration-200 hover:border-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				style={{
					backgroundImage: "none",
					colorScheme: "dark",
				}}
			>
				{languages.map((lang) => (
					<option
						key={lang.value}
						value={lang.value}
						style={{ backgroundColor: "#1e293b", color: "#e2e8f0" }}
					>
						{lang.icon} {lang.label}
					</option>
				))}
			</select>
		</div>
	);
};

const ApiRequestBuilderApp: React.FC = () => {
	const [method, setMethod] = useState<HttpMethod>("GET");
	const [baseUrl, setBaseUrl] = useState<string>("");
	const [queryParams, setQueryParams] = useState<KeyValueItem[]>([]);
	const [headers, setHeaders] = useState<KeyValueItem[]>([
		{
			id: generateId(),
			key: "Content-Type",
			value: "application/json",
			enabled: true,
		},
	]);
	const [body, setBody] = useState<string>("");
	const [bodyLanguage, setBodyLanguage] = useState<string>("json");
	const [authConfig, setAuthConfig] = useState<AuthConfig>({ type: "none" });
	const [copyFeedback, setCopyFeedback] = useState<string>("");
	const [urlValidation, setUrlValidation] = useState<{
		isValid: boolean;
		error?: string;
	}>({ isValid: true });

	const [fullUrl, setFullUrl] = useState<string>("");
	const [curlCommand, setCurlCommand] = useState<string>("");

	useEffect(() => {
		const validation = validateUrl(baseUrl);
		setUrlValidation(validation);
		const newFullUrl = buildUrl(baseUrl, queryParams);
		setFullUrl(newFullUrl);
	}, [baseUrl, queryParams]);

	useEffect(() => {
		const newCurlCommand = generateCurlCommand(
			method,
			fullUrl,
			headers,
			body,
			authConfig
		);
		setCurlCommand(newCurlCommand);
	}, [method, fullUrl, headers, body, authConfig]);

	const handleAuthChange = <K extends keyof AuthConfig>(
		field: K,
		value: AuthConfig[K]
	) => {
		setAuthConfig((prev) => ({ ...prev, [field]: value }));
	};

	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(curlCommand);
			setCopyFeedback("Copied!");
			setTimeout(() => setCopyFeedback(""), 2000);
		} catch (err) {
			setCopyFeedback("Failed to copy");
			setTimeout(() => setCopyFeedback(""), 2000);
		}
	};

	const isBodyDisabled = !(
		method === "POST" ||
		method === "PUT" ||
		method === "PATCH"
	);

	return (
		<>
			<link
				href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
				rel="stylesheet"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
				rel="stylesheet"
			/>

			<div className="min-h-screen bg-slate-950 text-slate-100 font-['Outfit']">
				<div className="absolute inset-0 opacity-20">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_70%)]"></div>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(219,39,119,0.03),transparent_70%)]"></div>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03),transparent_70%)]"></div>
				</div>

				<div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 max-w-7xl">
					<header className="text-center mb-12 sm:mb-16 lg:mb-20">
						<div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/30 mb-6 sm:mb-8">
							<span className="text-2xl sm:text-3xl">🚀</span>
						</div>
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight px-4">
							<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
								API Request Builder
							</span>
						</h1>
						<p className="text-lg sm:text-xl lg:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed px-4">
							Craft{" "}
							<span className="text-purple-400 font-semibold">
								perfect API requests
							</span>{" "}
							with our modern visual interface
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-6">
							<div className="flex items-center space-x-2 text-slate-500">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium">Live Preview</span>
							</div>
							<div className="hidden sm:block w-px h-4 bg-slate-700"></div>
							<div className="flex items-center space-x-2 text-slate-500">
								<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium">
									Auto cURL Generation
								</span>
							</div>
						</div>
					</header>

					<main className="space-y-12">
						<div className="group relative">
							<div className="absolute -inset-1 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-500"></div>
							<div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl shadow-xl p-10">
								<div className="flex items-center space-x-4 mb-8">
									<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
										<span className="text-2xl">⚡</span>
									</div>
									<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
										Request Configuration
									</h2>
								</div>

								<div className="space-y-6 sm:space-y-8">
									<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
										<div className="lg:col-span-1">
											<label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
												Method
											</label>
											<MethodSelector method={method} onChange={setMethod} />
										</div>

										<div className="lg:col-span-3 space-y-3 sm:space-y-4">
											<label
												htmlFor="base-url"
												className="block text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2"
											>
												<span>Endpoint URL</span>
												{!urlValidation.isValid && (
													<span className="text-red-400 text-xs">
														⚠️ Invalid URL
													</span>
												)}
												{urlValidation.isValid && baseUrl.trim() && (
													<span className="text-green-400 text-xs">
														✓ Valid
													</span>
												)}
											</label>
											<div className="relative">
												<input
													id="base-url"
													type="text"
													className={`w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-800/60 border rounded-xl sm:rounded-2xl text-slate-200 placeholder-slate-500 transition-all duration-300 hover:border-slate-500 text-base sm:text-lg font-mono ${
														!urlValidation.isValid
															? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
															: "border-slate-600/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
													}`}
													placeholder="api.example.com/v1/users"
													value={baseUrl}
													onChange={(e) => setBaseUrl(e.target.value)}
												/>
												{!urlValidation.isValid && urlValidation.error && (
													<div className="absolute -bottom-6 left-0 text-xs text-red-400 bg-red-900/20 px-3 py-1 rounded-lg border border-red-500/30">
														{urlValidation.error}
													</div>
												)}
											</div>
										</div>
									</div>

									<div className="space-y-3 sm:space-y-4">
										<label className="block text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
											<span>🔗</span>
											<span>Full URL Preview</span>
										</label>
										<div className="relative">
											<div className="p-4 sm:p-6 bg-slate-900/60 border border-slate-700/50 rounded-xl sm:rounded-2xl font-mono text-sm sm:text-lg transition-all duration-300 hover:border-cyan-500/30 min-h-12 sm:min-h-16 flex items-center">
												{fullUrl ? (
													<span className="text-cyan-400 break-all leading-relaxed">
														{fullUrl}
													</span>
												) : (
													<span className="text-slate-500 italic text-sm sm:text-base">
														Enter an endpoint URL to see the full URL preview
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<CollapsibleSection
							title="Query Parameters"
							isOpenInitially={true}
							icon="🔍"
						>
							<KeyValueListEditor
								items={queryParams}
								setItems={setQueryParams}
								itemTypeLabel="Parameter"
								isDraggable={true}
							/>
						</CollapsibleSection>

						<CollapsibleSection title="Headers" icon="📋">
							<KeyValueListEditor
								items={headers}
								setItems={setHeaders}
								itemTypeLabel="Header"
								isDraggable={true}
							/>
						</CollapsibleSection>

						<CollapsibleSection title="Request Body" icon="📄">
							<div className="space-y-3 sm:space-y-4">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
									<label
										htmlFor="request-body"
										className="block text-sm font-bold text-slate-300 uppercase tracking-wider"
									>
										Request Body
									</label>
									<LanguageSelector
										language={bodyLanguage}
										onChange={setBodyLanguage}
										disabled={isBodyDisabled}
									/>
								</div>

								<ValidatedEditor
									value={body}
									onChange={setBody}
									language={bodyLanguage}
									disabled={isBodyDisabled}
									height="300px"
									placeholder={
										isBodyDisabled
											? "Request body is not applicable for this HTTP method"
											: `Enter your ${bodyLanguage.toUpperCase()} request body here...`
									}
								/>

								{!isBodyDisabled && bodyLanguage === "json" && (
									<div className="flex items-center space-x-2 text-sm text-slate-500">
										<span className="text-green-400">✓</span>
										<span>
											JSON will be automatically formatted and validated
										</span>
									</div>
								)}

								{!isBodyDisabled && (
									<div className="flex flex-wrap gap-2 text-xs text-slate-500">
										<span className="flex items-center space-x-1">
											<span className="w-2 h-2 bg-purple-400 rounded-full"></span>
											<span>Syntax highlighting</span>
										</span>
										<span className="flex items-center space-x-1">
											<span className="w-2 h-2 bg-blue-400 rounded-full"></span>
											<span>Code folding</span>
										</span>
										<span className="flex items-center space-x-1">
											<span className="w-2 h-2 bg-green-400 rounded-full"></span>
											<span>Auto-formatting</span>
										</span>
									</div>
								)}
							</div>
						</CollapsibleSection>

						<CollapsibleSection title="Authentication" icon="🔐">
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
										Authentication Type
									</label>
									<AuthTypeSelector
										authType={authConfig.type}
										onChange={(newType) => {
											setAuthConfig({
												type: newType,
												basicUser:
													newType === "basic" ? authConfig.basicUser : "",
												basicPass:
													newType === "basic" ? authConfig.basicPass : "",
												bearerToken:
													newType === "bearer" ? authConfig.bearerToken : "",
											});
										}}
									/>
								</div>

								{authConfig.type === "basic" && (
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-4">
										<div className="space-y-3">
											<label
												htmlFor="basic-user"
												className="block text-sm font-bold text-slate-300 uppercase tracking-wider"
											>
												👤 Username
											</label>
											<div className="relative">
												<input
													id="basic-user"
													type="text"
													className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl sm:rounded-2xl text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-500 text-base sm:text-lg"
													placeholder="Enter username"
													value={authConfig.basicUser || ""}
													onChange={(e) =>
														handleAuthChange("basicUser", e.target.value)
													}
												/>
											</div>
										</div>
										<div className="space-y-3">
											<label
												htmlFor="basic-pass"
												className="block text-sm font-bold text-slate-300 uppercase tracking-wider"
											>
												🔒 Password
											</label>
											<div className="relative">
												<input
													id="basic-pass"
													type="password"
													className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl sm:rounded-2xl text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-500 text-base sm:text-lg"
													placeholder="Enter password"
													value={authConfig.basicPass || ""}
													onChange={(e) =>
														handleAuthChange("basicPass", e.target.value)
													}
												/>
											</div>
										</div>
									</div>
								)}

								{authConfig.type === "bearer" && (
									<div className="pt-4">
										<label
											htmlFor="bearer-token"
											className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider"
										>
											🎫 Bearer Token
										</label>
										<div className="relative">
											<input
												id="bearer-token"
												type="text"
												placeholder="Enter your bearer token"
												className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-800/60 border border-slate-600/50 rounded-xl sm:rounded-2xl text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-500 text-base sm:text-lg font-mono"
												value={authConfig.bearerToken || ""}
												onChange={(e) =>
													handleAuthChange("bearerToken", e.target.value)
												}
											/>
										</div>
									</div>
								)}
							</div>
						</CollapsibleSection>
					</main>

					<div className="block lg:hidden mt-12 group relative">
						<div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
						<div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-xl overflow-hidden">
							<div className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
											<span className="text-base sm:text-lg">⚡</span>
										</div>
										<h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
											cURL Command
										</h3>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
										<span className="text-xs text-slate-500 font-medium">
											LIVE
										</span>
									</div>
								</div>
								<CollapsibleCurlCommand
									curlCommand={curlCommand}
									onCopy={handleCopyToClipboard}
									copyFeedback={copyFeedback}
									className="sm:max-h-64"
								/>
							</div>
						</div>
					</div>

					<div className="hidden lg:block fixed bottom-8 right-8 w-[450px] max-h-[500px] group z-[50]">
						<div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
						<div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-xl overflow-hidden">
							<div className="p-8">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
											<span className="text-lg">⚡</span>
										</div>
										<h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
											cURL Command
										</h3>
									</div>
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
										<span className="text-xs text-slate-500 font-medium">
											LIVE
										</span>
									</div>
								</div>
								<CollapsibleCurlCommand
									curlCommand={curlCommand}
									onCopy={handleCopyToClipboard}
									copyFeedback={copyFeedback}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<footer className="relative mt-20 pb-8">
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

					<div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-16">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
							{/* Column 1: About */}
							<div className="space-y-6">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
										<span className="text-lg">🚀</span>
									</div>
									<h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
										API Request Builder
									</h3>
								</div>
								<p className="text-slate-400 leading-relaxed text-sm">
									A modern, intuitive tool for crafting and testing API
									requests. Build, validate, and export your API calls with
									ease.
								</p>
								<div className="flex space-x-4">
									<div className="flex items-center space-x-2 text-slate-500 text-xs">
										<div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
										<span>Live Validation</span>
									</div>
									<div className="flex items-center space-x-2 text-slate-500 text-xs">
										<div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
										<span>Real-time Preview</span>
									</div>
								</div>
							</div>

							{/* Column 2: Features */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-slate-300">
									Features
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
									<div className="flex items-center space-x-3 text-slate-400 text-sm">
										<div className="w-5 h-5 rounded-lg bg-slate-800/50 flex items-center justify-center text-xs">
											🔍
										</div>
										<span>Drag & Drop Parameters</span>
									</div>
									<div className="flex items-center space-x-3 text-slate-400 text-sm">
										<div className="w-5 h-5 rounded-lg bg-slate-800/50 flex items-center justify-center text-xs">
											✨
										</div>
										<span>Syntax Highlighting</span>
									</div>
									<div className="flex items-center space-x-3 text-slate-400 text-sm">
										<div className="w-5 h-5 rounded-lg bg-slate-800/50 flex items-center justify-center text-xs">
											📋
										</div>
										<span>cURL Export</span>
									</div>
									<div className="flex items-center space-x-3 text-slate-400 text-sm">
										<div className="w-5 h-5 rounded-lg bg-slate-800/50 flex items-center justify-center text-xs">
											🔐
										</div>
										<span>Authentication Support</span>
									</div>
								</div>
							</div>
						</div>

						{/* Bottom Border */}
						<div className="mt-12 pt-8 border-t border-slate-800/50">
							<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
								<div className="flex items-center space-x-6 text-slate-500 text-sm">
									<span>Built with React & TypeScript</span>
									<div className="w-px h-4 bg-slate-700"></div>
									<span>Modern Web Technologies</span>
								</div>
								<div className="flex items-center space-x-2 text-slate-500 text-sm">
									<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
									<span>Status: Online</span>
								</div>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default ApiRequestBuilderApp;
