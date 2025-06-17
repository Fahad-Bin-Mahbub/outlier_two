"use client";
import nlp from "compromise";
import {
	ArrowLeft,
	Book,
	Bookmark,
	ChevronRight,
	ChevronUp,
	Edit,
	Eye,
	FileEdit,
	FileText,
	Lightbulb,
	Maximize2,
	Menu,
	Moon,
	Plus,
	Save,
	Sparkles,
	Split,
	Sun,
	Trash2,
	X,
} from "lucide-react";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";

// Type definitions
type Section = {
	id: string;
	name: string;
	content: any; // Editor.js data
	color?: string;
};

// Extend GrammarIssue to include block and position info
type GrammarIssue = {
	type: string;
	text: string;
	index: number; // Global text index (approximate)
	blockIndex?: number; // Index of the block containing the issue
	startInBlock?: number; // Start index within the block's text
	endInBlock?: number; // End index within the block's text
	suggestion?: string;
};

type WritingTip = {
	id: number;
	title: string;
	description: string;
	category: "grammar" | "style" | "structure" | "clarity";
};

type Theme = "light" | "dark";

// Editor.js Tools Configuration
const EDITOR_JS_TOOLS = {
	paragraph: {
		class: require("@editorjs/paragraph"),
		inlineToolbar: true,
	},
	header: {
		class: require("@editorjs/header"),
		inlineToolbar: true,
		config: {
			placeholder: "Enter a header",
			levels: [1, 2, 3, 4, 5, 6],
			defaultLevel: 3,
		},
	},
	list: {
		class: require("@editorjs/list"),
		inlineToolbar: true,
		config: {
			defaultStyle: "unordered",
		},
	},
	checklist: {
		class: require("@editorjs/checklist"),
		inlineToolbar: true,
	},
	quote: {
		class: require("@editorjs/quote"),
		inlineToolbar: true,
		config: {
			quotePlaceholder: "Enter a quote",
			captionPlaceholder: "Quote's author",
		},
	},
	marker: {
		class: require("@editorjs/marker"),
		shortcut: "CMD+SHIFT+M",
	},
	code: {
		class: require("@editorjs/code"),
		config: {
			placeholder: "Enter code",
		},
	},
	delimiter: require("@editorjs/delimiter"),
	inlineCode: {
		class: require("@editorjs/inline-code"),
		shortcut: "CMD+SHIFT+C",
	},
	image: {
		class: require("@editorjs/image"),
		config: {
			uploader: {
				uploadByFile(file: File) {
					// This is a mock implementation
					return new Promise((resolve) => {
						const reader = new FileReader();
						reader.onload = (event) => {
							resolve({
								success: 1,
								file: {
									url: event.target?.result,
								},
							});
						};
						reader.readAsDataURL(file);
					});
				},
			},
		},
	},
	table: {
		class: require("@editorjs/table"),
		inlineToolbar: true,
		config: {
			rows: 2,
			cols: 3,
		},
	},
	underline: require("@editorjs/underline"),
};

// Hardcoded writing tips
const writingTips: WritingTip[] = [
	{
		id: 1,
		title: "Use active voice",
		description:
			"Active voice makes your writing more direct and engaging. Instead of 'The ball was thrown by John,' write 'John threw the ball.'",
		category: "style",
	},
	{
		id: 2,
		title: "Avoid adverb overuse",
		description:
			"Replace adverbs with stronger verbs. Instead of 'walked quickly,' use 'rushed' or 'hurried.'",
		category: "style",
	},
	{
		id: 3,
		title: "Vary sentence length",
		description:
			"Mix short and long sentences to create rhythm. Short sentences add punch. Longer sentences can develop complex ideas and create flow between concepts.",
		category: "structure",
	},
	{
		id: 4,
		title: "Eliminate filler words",
		description:
			"Words like 'very,' 'really,' and 'just' often add no value. Remove them to make your writing more concise.",
		category: "clarity",
	},
	{
		id: 5,
		title: "Use specific nouns",
		description:
			"Replace general nouns with specific ones. Instead of 'dog,' use 'beagle' or 'terrier' if appropriate.",
		category: "clarity",
	},
	{
		id: 6,
		title: "Watch for homophone errors",
		description:
			"Common mistakes include their/there/they're, your/you're, its/it's, and affect/effect.",
		category: "grammar",
	},
	{
		id: 7,
		title: "Avoid clichés",
		description:
			"Phrases like 'at the end of the day' or 'think outside the box' weaken your writing. Create fresh expressions instead.",
		category: "style",
	},
	{
		id: 8,
		title: "Use parallel structure",
		description:
			"When listing items or actions, keep the grammatical form consistent: 'She likes swimming, hiking, and camping' (not 'swimming, to hike, and camps').",
		category: "grammar",
	},
	{
		id: 9,
		title: "Eliminate redundancies",
		description:
			"Phrases like 'past history,' 'advance planning,' or 'basic fundamentals' contain unnecessary words.",
		category: "clarity",
	},
	{
		id: 10,
		title: "Read aloud",
		description:
			"Reading your work aloud helps identify awkward phrasing, run-on sentences, and other issues that eyes might miss.",
		category: "structure",
	},
];

// Common grammar errors to detect
const commonGrammarErrors = [
	{
		pattern: /\b(its|it's)\b/gi,
		check: (match: string, context: string) => {
			const lowerMatch = match.toLowerCase();
			const matchIndex = context.indexOf(match); // Get the index within the context
			const prevFewChars = context
				.substring(Math.max(0, matchIndex - 10), matchIndex)
				.trim();
			const nextFewChars = context
				.substring(matchIndex + match.length, matchIndex + match.length + 15)
				.trim();

			if (lowerMatch === "its") {
				// Check if it should be "it's" (it is/it has)
				if (
					/^(a|the|been|not|very|so|too|quite|just|also|still|always|never|now|time|\s*)$/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'it's' (it is/it has)?",
						suggestion: "it's",
					};
				}
			} else if (lowerMatch === "it's") {
				// Check if it should be "its" (possessive)
				if (
					/\b(the|a|an)\s*$/i.test(prevFewChars) ||
					/^(own|way|name|color|size|shape|form|role|part|time|place)/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'its' (possessive)?",
						suggestion: "its",
					};
				}
			}
			return { error: false };
		},
	},
	{
		pattern: /\b(your|you're)\b/gi,
		check: (match: string, context: string) => {
			const lowerMatch = match.toLowerCase();
			const matchIndex = context.indexOf(match);
			const prevFewChars = context
				.substring(Math.max(0, matchIndex - 10), matchIndex)
				.trim();
			const nextFewChars = context
				.substring(matchIndex + match.length, matchIndex + match.length + 20)
				.trim(); // Increased window

			if (lowerMatch === "your") {
				// Check if it should be "you're" (you are)
				if (
					/^(not|going|welcome|invited|the one|supposed|allowed|able|right|wrong|\s*)$/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'you're' (you are)?",
						suggestion: "you're",
					};
				}
			} else if (lowerMatch === "you're") {
				// Check if it should be "your" (possessive)
				if (
					/\b(the|a|an)\s*$/i.test(prevFewChars) ||
					/^(house|car|dog|cat|book|name|phone|friend|family|job|work|own)/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'your' (possessive)?",
						suggestion: "your",
					};
				}
			}
			return { error: false };
		},
	},
	{
		pattern: /\b(there|their|they're)\b/gi,
		check: (match: string, context: string) => {
			const lowerMatch = match.toLowerCase();
			const matchIndex = context.indexOf(match);
			const prevFewChars = context
				.substring(Math.max(0, matchIndex - 10), matchIndex)
				.trim();
			const nextFewChars = context
				.substring(matchIndex + match.length, matchIndex + match.length + 20)
				.trim(); // Increased window

			if (lowerMatch === "there") {
				// Check if it should be "their" (possessive)
				if (
					/\b(the|a|an)\s*$/i.test(prevFewChars) ||
					/^(house|car|dog|cat|book|name|phone|friend|family|job|work|own)/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'their' (possessive)?",
						suggestion: "their",
					};
				}
				// Check if it should be "they're" (they are) - Less reliable check, consider context
				if (
					/^(not|going|welcome|invited|the ones|supposed|allowed|able|right|wrong|\s*)$/i.test(
						nextFewChars
					)
				) {
					// This is a weaker signal, might require more context
					// Adding a check to avoid suggesting "they're" if "there" is likely correct
					if (
						!(
							/here|is|are|was|were/.test(prevFewChars) ||
							/house|car/.test(nextFewChars)
						)
					) {
						return {
							error: true,
							message: "Did you mean 'they're' (they are)?",
							suggestion: "they're",
						};
					}
				}
			} else if (lowerMatch === "their") {
				// Check if it should be "they're" (they are)
				if (
					/^(not|going|welcome|invited|the ones|supposed|allowed|able|right|wrong|\s*)$/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'they're' (they are)?",
						suggestion: "they're",
					};
				}
			} else if (lowerMatch === "they're") {
				// Check if it should be "their" (possessive)
				if (
					/\b(the|a|an)\s*$/i.test(prevFewChars) ||
					/^(house|car|dog|cat|book|name|phone|friend|family|job|work|own)/i.test(
						nextFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'their' (possessive)?",
						suggestion: "their",
					};
				}
			}
			return { error: false };
		},
	},
	{
		pattern: /\b(affect|effect)\b/gi,
		check: (match: string, context: string) => {
			const lowerMatch = match.toLowerCase();
			const matchIndex = context.indexOf(match);
			const prevFewChars = context
				.substring(Math.max(0, matchIndex - 15), matchIndex)
				.trim();
			const nextFewChars = context
				.substring(matchIndex + match.length, matchIndex + match.length + 10)
				.trim();

			if (lowerMatch === "affect") {
				// Check if it should be "effect" (noun)
				if (/\b(the|an|this|that|side|no|any)\s*$/i.test(prevFewChars)) {
					return {
						error: true,
						message: "Did you mean 'effect' (noun)?",
						suggestion: "effect",
					};
				}
			} else if (lowerMatch === "effect") {
				// Check if it should be "affect" (verb)
				if (
					/\b(will|would|could|should|may|might|can|to|doesn't|does|did)\s*$/i.test(
						prevFewChars
					) ||
					(/^(s|ed|ing|\s*)$/i.test(nextFewChars) &&
						!/^(the|an|this|that|side|no|any)\s*$/i.test(prevFewChars))
				) {
					return {
						error: true,
						message: "Did you mean 'affect' (verb)?",
						suggestion: "affect",
					};
				}
			}
			return { error: false };
		},
	},
	{
		pattern: /\b(than|then)\b/gi,
		check: (match: string, context: string) => {
			const lowerMatch = match.toLowerCase();
			const matchIndex = context.indexOf(match);
			const prevFewChars = context
				.substring(Math.max(0, matchIndex - 15), matchIndex)
				.trim();
			const nextFewChars = context
				.substring(matchIndex + match.length, matchIndex + match.length + 20)
				.trim(); // Increased window

			if (lowerMatch === "than") {
				// Check if it should be "then" (time/sequence)
				if (
					/^(he|she|it|they|we|I|you|the|a|an|this|that|these|those)\s+(went|said|did|tried|began)/i.test(
						nextFewChars
					) ||
					/^\s*[,;.]/.test(nextFewChars)
				) {
					return {
						error: true,
						message: "Did you mean 'then' (time/sequence)?",
						suggestion: "then",
					};
				}
			} else if (lowerMatch === "then") {
				// Check if it should be "than" (comparison)
				if (
					/\b(more|less|better|worse|greater|smaller|higher|lower|rather|other)\s*$/i.test(
						prevFewChars
					)
				) {
					return {
						error: true,
						message: "Did you mean 'than' (comparison)?",
						suggestion: "than",
					};
				}
			}
			return { error: false };
		},
	},
];

// List of common clichés
const cliches = [
	"at the end of the day",
	"think outside the box",
	"needle in a haystack",
	"in this day and age",
	"in the nick of time",
	"bite the bullet",
	"dead as a doornail",
	"easy as pie",
	"every cloud has a silver lining",
	"few and far between",
	"in the same boat",
	"it's not rocket science",
	"let the cat out of the bag",
	"like a kid in a candy store",
	"make hay while the sun shines",
	"method to my madness",
	"once in a blue moon",
	"play your cards right",
	"raining cats and dogs",
	"read between the lines",
	"smooth as silk",
	"speak of the devil",
	"the calm before the storm",
	"the last straw",
	"without a shadow of a doubt",
	"writing on the wall",
	"you can't have your cake and eat it too",
	"easier said than done",
	"actions speak louder than words",
	"barking up the wrong tree",
];

// List of commonly overused words
const overusedWords = [
	"very",
	"really",
	"just",
	"quite",
	"basically",
	"literally",
	"actually",
	"simply",
	"perhaps",
	"definitely",
	"totally",
	"absolutely",
	"essentially",
	"completely",
	"honestly",
	"obviously",
	"probably",
	"virtually",
	"certainly",
];

// Section colors for tabs
const sectionColors = [
	"bg-gradient-to-r from-violet-500 to-purple-500",
	"bg-gradient-to-r from-blue-500 to-cyan-500",
	"bg-gradient-to-r from-emerald-500 to-green-500",
	"bg-gradient-to-r from-amber-500 to-yellow-500",
	"bg-gradient-to-r from-rose-500 to-pink-500",
	"bg-gradient-to-r from-fuchsia-500 to-purple-500",
	"bg-gradient-to-r from-sky-500 to-indigo-500",
	"bg-gradient-to-r from-lime-500 to-emerald-500",
	"bg-gradient-to-r from-orange-500 to-amber-500",
	"bg-gradient-to-r from-red-500 to-rose-500",
];

// Initialize React Editor.js
const ReactEditorJS = createReactEditorJS();

// Initialize Writing Assistant Application
const WritingAssistant = () => {
	// State for sections management
	const [sections, setSections] = useState<Section[]>([
		{
			id: "1",
			name: "Chapter 1",
			content: { blocks: [] },
			color: sectionColors[0],
		},
		{
			id: "2",
			name: "Chapter 2",
			content: { blocks: [] },
			color: sectionColors[1],
		},
	]);
	const [currentSectionId, setCurrentSectionId] = useState<string>("1");
	const [editorKey, setEditorKey] = useState<number>(Date.now()); // Used to force re-render the editor

	// State for UI modes
	const [theme, setTheme] = useState<Theme>("dark");
	const [distractionFree, setDistractionFree] = useState<boolean>(false);
	const [splitScreen, setSplitScreen] = useState<boolean>(false);
	const [previewMode, setPreviewMode] = useState<boolean>(false);
	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
	const [analysisOpen, setAnalysisOpen] = useState<boolean>(true);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [currentTip, setCurrentTip] = useState<WritingTip | null>(null);

	// State for thesaurus
	const [selectedWord, setSelectedWord] = useState<string>("");
	const [synonyms, setSynonyms] = useState<string[]>([]);
	const [thesaurusLoading, setThesaurusLoading] = useState<boolean>(false);
	const [thesaurusError, setThesaurusError] = useState<string | null>(null);

	// State for grammar checking
	const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
	const [wordCount, setWordCount] = useState<number>(0);

	// Refs
	const editorRef = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const analyzeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const editorInstanceRef = useRef<any>(null);

	// Check if device is mobile
	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
			// Close sidebar by default on mobile
			if (window.innerWidth < 768 && sidebarOpen) {
				setSidebarOpen(false);
			}
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => window.removeEventListener("resize", checkIfMobile);
	}, [sidebarOpen]);

	// Show random writing tip on load
	useEffect(() => {
		const randomTip =
			writingTips[Math.floor(Math.random() * writingTips.length)];
		setCurrentTip(randomTip);

		// Change tip every 30 seconds
		const interval = setInterval(() => {
			const newTip =
				writingTips[Math.floor(Math.random() * writingTips.length)];
			setCurrentTip(newTip);
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	// Find current section
	const currentSection = useMemo(() => {
		return (
			sections.find((section) => section.id === currentSectionId) || sections[0]
		);
	}, [sections, currentSectionId]);

	// Handle editor initialization
	const handleEditorInitialize = useCallback((instance: any) => {
		editorInstanceRef.current = instance;
	}, []);

	// Switch to a different section
	const handleSectionChange = (id: string) => {
		if (id === currentSectionId) return;

		// First save the current section content
		handleEditorChange()
			.then(() => {
				setCurrentSectionId(id);
				// Force re-render of editor with new key
				setEditorKey(Date.now());

				// Close sidebar on mobile after selection
				if (isMobile) {
					setSidebarOpen(false);
				}
			})
			.catch((err) => {
				console.error("Error saving current section:", err);
				// Still switch section even if saving fails
				setCurrentSectionId(id);
				setEditorKey(Date.now());
				if (isMobile) setSidebarOpen(false);
			});
	};

	// Handle editor content change
	const handleEditorChange = useCallback(async () => {
		if (!editorInstanceRef.current) return Promise.resolve();

		try {
			const savedData = await editorInstanceRef.current.save();

			// Update the content of the current section
			setSections((prevSections) =>
				prevSections.map((section) =>
					section.id === currentSectionId
						? { ...section, content: savedData }
						: section
				)
			);

			// Count words in all blocks
			let totalWords = 0;
			if (savedData.blocks) {
				savedData.blocks.forEach((block: any) => {
					if (block.type === "paragraph" || block.type === "header") {
						const text = block.data.text || "";
						const words = text.split(/\s+/).filter(Boolean);
						totalWords += words.length;
					}
				});
			}
			setWordCount(totalWords);

			// Debounce grammar analysis
			if (analyzeTimeoutRef.current) {
				clearTimeout(analyzeTimeoutRef.current);
			}

			setIsAnalyzing(true);
			analyzeTimeoutRef.current = setTimeout(() => {
				analyzeText(savedData);
				setIsAnalyzing(false);
			}, 500);

			return Promise.resolve();
		} catch (error) {
			console.error("Editor save error:", error);
			return Promise.reject(error);
		}
	}, [currentSectionId]);

	// Analyze text for grammar issues and return position data
	const analyzeText = (editorData: any) => {
		if (!editorData || !editorData.blocks || editorData.blocks.length === 0) {
			setGrammarIssues([]);
			return;
		}

		const issues: GrammarIssue[] = [];
		let overallTextIndex = 0; // To keep track of the index across all blocks

		editorData.blocks.forEach((block: any, blockIndex: number) => {
			let blockText = "";
			// Only analyze text-based blocks
			if (
				block.type === "paragraph" ||
				block.type === "header" ||
				block.type === "quote" ||
				block.type === "list"
			) {
				// Extract text depending on the block type
				if (block.type === "list" && Array.isArray(block.data.items)) {
					blockText = block.data.items.join(" ") + " "; // Join list items with a space
				} else if (block.type === "quote") {
					blockText = (block.data.text || "") + " "; // Quote text
					if (block.data.caption) blockText += (block.data.caption || "") + " "; // Quote caption
				} else {
					blockText = (block.data.text || "") + " ";
				}
			} else {
				// For non-text blocks (like images, code, table), just increment the index
				// This is a simplified approach, ideally their content would be handled
				overallTextIndex += 1; // Account for separator between blocks
				return;
			}

			// --- Grammar Errors ---
			commonGrammarErrors.forEach((errorCheck) => {
				const matches = blockText.matchAll(errorCheck.pattern);
				for (const match of matches) {
					const matchText = match[0];
					const matchIndexInBlock = match.index || 0;

					const result = errorCheck.check(matchText, blockText);
					if (result.error) {
						issues.push({
							type: "Grammar error",
							text: matchText,
							index: overallTextIndex + matchIndexInBlock, // Approximate overall index
							blockIndex: blockIndex,
							startInBlock: matchIndexInBlock,
							endInBlock: matchIndexInBlock + matchText.length,
							suggestion: result.suggestion, // Use the suggestion from the check
						});
					}
				}
			});

			// --- Long Sentences --- (Simplified detection within blocks)
			const sentences = blockText.match(/[^.!?]+[.!?]+/g) || [];
			sentences.forEach((sentence) => {
				const words = sentence.split(/\s+/).filter(Boolean);
				if (words.length > 20) {
					const sentenceIndexInBlock = blockText.indexOf(sentence);
					if (sentenceIndexInBlock !== -1) {
						issues.push({
							type: "Long sentence",
							text: sentence.trim(),
							index: overallTextIndex + sentenceIndexInBlock,
							blockIndex: blockIndex,
							startInBlock: sentenceIndexInBlock,
							endInBlock: sentenceIndexInBlock + sentence.length,
							suggestion: "Consider breaking this into smaller sentences.",
						});
					}
				}
			});

			// --- Passive Voice --- (Simplified detection within blocks)
			const passiveRegex =
				/\b(?:am|is|are|was|were|be|been|being)\s+(\w+ed|built|done|made|put|sent|sold)\b/gi;
			const passiveMatches = blockText.matchAll(passiveRegex);
			for (const match of passiveMatches) {
				const matchText = match[0];
				const matchIndexInBlock = match.index || 0;
				issues.push({
					type: "Passive voice",
					text: matchText,
					index: overallTextIndex + matchIndexInBlock,
					blockIndex: blockIndex,
					startInBlock: matchIndexInBlock,
					endInBlock: matchIndexInBlock + matchText.length,
					suggestion: "Consider using active voice instead.",
				});
			}

			// --- Overused words within blocks ---
			const wordsInBlock = blockText.toLowerCase().split(/\s+/).filter(Boolean);
			const wordCountsInBlock: Record<string, number> = {};
			wordsInBlock.forEach((word) => {
				if (word.length > 3) {
					wordCountsInBlock[word] = (wordCountsInBlock[word] || 0) + 1;
				}
			});

			overusedWords.forEach((word) => {
				if (wordCountsInBlock[word] && wordCountsInBlock[word] >= 2) {
					// Check occurrence within the block
					const regex = new RegExp(`\\b${word}\\b`, "gi");
					const matches = blockText.matchAll(regex);
					for (const match of matches) {
						const matchText = match[0];
						const matchIndexInBlock = match.index || 0;
						issues.push({
							type: "Overused word",
							text: matchText,
							index: overallTextIndex + matchIndexInBlock,
							blockIndex: blockIndex,
							startInBlock: matchIndexInBlock,
							endInBlock: matchIndexInBlock + matchText.length,
							suggestion: `The word "${matchText}" might be overused.`,
						});
					}
				}
			});

			// --- Repeated words in proximity within a block ---
			let prevWord = "";
			wordsInBlock.forEach((word, wordIdx) => {
				if (
					word.length > 3 &&
					word !== prevWord &&
					blockText.includes(`${prevWord} ${word}`)
				) {
					// Simple check for immediate repetition, requires more sophisticated logic for true proximity
					const repetitionIndexInBlock = blockText.indexOf(
						`${prevWord} ${word}`
					);
					if (repetitionIndexInBlock !== -1) {
						issues.push({
							type: "Repeated word",
							text: `${prevWord} ${word}`,
							index: overallTextIndex + repetitionIndexInBlock,
							blockIndex: blockIndex,
							startInBlock: repetitionIndexInBlock,
							endInBlock:
								repetitionIndexInBlock + prevWord.length + 1 + word.length,
							suggestion: `Consider using a synonym for one of the words.`,
						});
					}
				}
				prevWord = word;
			});

			// --- Adverb overuse within a block ---
			const adverbRegex = /\b\w+ly\b/gi;
			const adverbsInBlock = blockText.match(adverbRegex) || [];
			if (
				wordsInBlock.length > 5 &&
				adverbsInBlock.length / wordsInBlock.length > 0.1 &&
				adverbsInBlock.length > 1
			) {
				// Check ratio within the block
				issues.push({
					type: "Adverb overuse",
					text: "Block contains many adverbs",
					index: overallTextIndex, // Start of the block
					blockIndex: blockIndex,
					startInBlock: 0,
					endInBlock: blockText.length,
					suggestion: "Consider using stronger verbs in this section.",
				});
			}

			// --- Clichés within blocks ---
			cliches.forEach((cliche) => {
				const clicheIndexInBlock = blockText
					.toLowerCase()
					.indexOf(cliche.toLowerCase());
				if (clicheIndexInBlock !== -1) {
					issues.push({
						type: "Cliché",
						text: cliche,
						index: overallTextIndex + clicheIndexInBlock,
						blockIndex: blockIndex,
						startInBlock: clicheIndexInBlock,
						endInBlock: clicheIndexInBlock + cliche.length,
						suggestion: `"${cliche}" is a cliché. Consider a more original expression.`,
					});
				}
			});

			// --- Sentence variety (simple block-level check) ---
			// A more thorough check needs to consider sentences spanning blocks.
			const blockSentences = blockText.match(/[^.!?]+[.!?]+/g) || [];
			if (blockSentences.length > 3) {
				// Only check if block has multiple sentences
				const sentenceLengths = blockSentences.map(
					(s) => s.split(/\s+/).filter(Boolean).length
				);
				let similarLengths = 0;
				for (let i = 1; i < sentenceLengths.length; i++) {
					const diff = Math.abs(sentenceLengths[i] - sentenceLengths[i - 1]);
					if (diff <= 3 && sentenceLengths[i] > 5) {
						similarLengths++;
					}
				}
				if (similarLengths >= 2) {
					// If at least 2 pairs of adjacent sentences have similar length
					issues.push({
						type: "Sentence variety",
						text: "Similar sentence lengths in block",
						index: overallTextIndex, // Start of the block
						blockIndex: blockIndex,
						startInBlock: 0,
						endInBlock: blockText.length,
						suggestion: "Consider varying sentence lengths in this paragraph.",
					});
				}
			}

			overallTextIndex += blockText.length;
		});

		// Sort issues by their index
		issues.sort((a, b) => a.index - b.index);

		// Limit the number of issues shown (optional, but good for performance/UI)
		setGrammarIssues(issues.slice(0, 10)); // Show up to 10 issues
	};

	// Handle word selection for thesaurus lookup
	const handleWordSelect = useCallback(() => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed) {
			setSelectedWord("");
			setSynonyms([]);
			return;
		}

		const word = selection.toString().trim().toLowerCase();

		if (word && /^[a-z'-]+$/i.test(word)) {
			// Allow hyphens and apostrophes for words like "state-of-the-art" or "it's" (though the latter is a grammar issue)
			setSelectedWord(word);
			lookupSynonyms(word);
		} else {
			setSelectedWord("");
			setSynonyms([]);
		}
	}, []);

	// Look up synonyms for the selected word using compromise.js and

	// Hardcoded thesaurus
	const hardcodedThesaurus: Record<string, string[]> = {
		big: [
			"large",
			"enormous",
			"huge",
			"gigantic",
			"vast",
			"immense",
			"substantial",
			"massive",
			"colossal",
		],
		small: [
			"tiny",
			"little",
			"miniature",
			"minute",
			"petite",
			"compact",
			"diminutive",
			"microscopic",
		],
		good: [
			"excellent",
			"fine",
			"superior",
			"wonderful",
			"marvelous",
			"quality",
			"exceptional",
			"outstanding",
		],
		bad: [
			"poor",
			"inferior",
			"defective",
			"deficient",
			"imperfect",
			"inadequate",
			"unacceptable",
		],
		happy: [
			"joyful",
			"delighted",
			"pleased",
			"glad",
			"cheerful",
			"content",
			"jubilant",
			"elated",
		],
		sad: [
			"unhappy",
			"sorrowful",
			"dejected",
			"miserable",
			"gloomy",
			"downcast",
			"melancholy",
		],
		beautiful: [
			"attractive",
			"pretty",
			"lovely",
			"gorgeous",
			"stunning",
			"handsome",
			"elegant",
		],
		ugly: [
			"unattractive",
			"unsightly",
			"hideous",
			"plain",
			"homely",
			"grotesque",
			"repulsive",
		],
		fast: [
			"quick",
			"rapid",
			"swift",
			"speedy",
			"hasty",
			"expeditious",
			"prompt",
		],
		slow: [
			"sluggish",
			"unhurried",
			"leisurely",
			"gradual",
			"plodding",
			"crawling",
			"dawdling",
		],
		run: ["sprint", "dash", "jog", "race", "bolt"],
		walk: ["stroll", "stride", "saunter", "hike", "trek"],
		eat: ["consume", "devour", "dine", "feast", "ingest"],
		see: ["view", "observe", "witness", "spot", "notice"],
		make: ["create", "produce", "form", "construct", "build"],
		go: ["move", "travel", "proceed", "advance", "depart"],
		say: ["state", "tell", "express", "declare", "mention"],
		think: ["believe", "consider", "contemplate", "reflect", "ponder"],
		find: ["discover", "locate", "uncover", "detect", "encounter"],
		give: ["provide", "offer", "donate", "present", "supply"],
		house: ["home", "residence", "dwelling", "abode", "domicile"],
		car: ["vehicle", "automobile", "ride", "sedan", "transport"],
		dog: ["canine", "hound", "pooch", "mutt", "pup"],
		book: ["novel", "publication", "tome", "volume", "text"],
		friend: ["companion", "ally", "comrade", "buddy", "pal"],
		work: ["labor", "job", "occupation", "employment", "profession"],
		time: ["period", "era", "age", "epoch", "duration"],
		person: ["individual", "human", "soul", "mortal", "being"],
		day: ["date", "period", "occasion", "time", "moment"],
		way: ["method", "manner", "means", "mode", "approach"],
	};

	// Look up synonyms for the selected word using compromise.js and hardcoded values
	const lookupSynonyms = useCallback(async (word: string) => {
		if (!word) return;

		setThesaurusLoading(true);
		setThesaurusError(null);
		setSynonyms([]); // Clear previous synonyms

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			let foundSynonyms: string[] = [];

			// First, try hardcoded thesaurus
			if (hardcodedThesaurus[word]) {
				foundSynonyms = hardcodedThesaurus[word];
			} else {
				// Fallback to compromise (basic usage)
				const doc = nlp(word);
				// compromise's .synonyms() is experimental and often returns empty,
				// but we can try more targeted approaches if needed based on part of speech
			}

			if (foundSynonyms.length > 0) {
				setSynonyms(foundSynonyms);
			} else {
				setThesaurusError(`No synonyms found for "${word}".`);
			}
		} catch (error) {
			console.error("Thesaurus error:", error);
			setThesaurusError("Couldn't fetch synonyms.");
			setSynonyms([]);
		} finally {
			setThesaurusLoading(false);
		}
	}, []);

	// Replace selected word with synonym (Conceptual - Requires Editor.js API)
	const applySynonym = async (synonym: string) => {
		if (!editorInstanceRef.current || !selectedWord) return;

		// ### CONCEPTUAL IMPLEMENTATION ###
		// This part is highly dependent on Editor.js internal workings and API.
		// A robust implementation would involve:
		// 1. Getting the current Selection (using Editor.js API if available, or standard DOM).
		// 2. Identifying the specific block and the text range within that block that corresponds to the selection.
		// 3. Using Editor.js API to update the block's content by replacing the selected text with the synonym.
		// 4. Handling potential inline formatting within the selected text.

		alert(
			`Conceptual: In a full implementation, "${selectedWord}" would be replaced with "${synonym}".\n\nThis requires direct manipulation of Editor.js blocks and is complex.`
		);

		// Example (simplified and likely not production-ready):
		//  try {
		//      const { block, start, end } = await getSelectionLocationInEditor(); // Requires custom logic
		//      if (block && block.data && (block.type === "paragraph" || block.type === "header")) {
		//          let blockText = block.data.text || "";
		//          const newBlockText = blockText.substring(0, start) + synonym + blockText.substring(end);
		//          await editorInstanceRef.current.blocks.update(block.id, { ...block.data, text: newBlockText });
		//          handleEditorChange(); // Re-analyze after change
		//      }
		//  } catch (error) {
		//      console.error("Error applying synonym:", error);
		//      alert("Could not apply synonym. Feature not fully implemented.");
		//  }

		// Clear the selected word and synonyms after attempting application
		setSelectedWord("");
		setSynonyms([]);
	};

	// Apply a grammar suggestion (Conceptual - Requires Editor.js API)
	const applySuggestion = async (issue: GrammarIssue) => {
		if (
			!editorInstanceRef.current ||
			issue.blockIndex === undefined ||
			issue.suggestion === undefined
		)
			return;

		// ### CONCEPTUAL IMPLEMENTATION ###
		// Similar to applySynonym, this requires precise identification and modification
		// of the block and text range within Editor.js.

		alert(
			`Conceptual: In a full implementation, "${issue.text}" would be replaced with "${issue.suggestion}".\n\nThis requires direct manipulation of Editor.js blocks and is complex.`
		);

		// try {
		//     const block = editorInstanceRef.current.blocks.getBlockByIndex(issue.blockIndex);
		//     if (block && block.data && (block.type === "paragraph" || block.type === "header")) {
		//         let blockText = block.data.text || "";
		//         // Ensure the indices are valid
		//         if (issue.startInBlock !== undefined && issue.endInBlock !== undefined) {
		//             const newBlockText =
		//                 blockText.substring(0, issue.startInBlock) +
		//                 issue.suggestion +
		//                 blockText.substring(issue.endInBlock);
		//             await editorInstanceRef.current.blocks.update(block.id, { ...block.data, text: newBlockText });
		//             handleEditorChange(); // Re-analyze after change
		//         }
		//     }
		// } catch (error) {
		//     console.error("Error applying suggestion:", error);
		//     alert("Could not apply suggestion. Feature not fully implemented.");
		// }

		// Optionally, remove the applied issue from the list
		setGrammarIssues((prevIssues) => prevIssues.filter((i) => i !== issue));
	};

	// Toggle theme between light and dark
	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	// Toggle fullscreen mode
	const toggleFullscreen = () => {
		setFullscreen(!fullscreen);
		if (!fullscreen) {
			setDistractionFree(true);
			setSidebarOpen(false);
			setAnalysisOpen(false);
		}
	};

	// Exit fullscreen mode
	const exitFullscreen = () => {
		setFullscreen(false);
		setDistractionFree(false);
		// Restore previous state after fullscreen if needed, or just default to open
		setSidebarOpen(true);
		setAnalysisOpen(true);
	};

	// Add a new section
	const addSection = () => {
		const newId = Date.now().toString(); // Use timestamp for more unique ID
		const colorIndex = sections.length % sectionColors.length;

		const newSection = {
			id: newId,
			name: `Chapter ${sections.length + 1}`,
			content: { blocks: [] },
			color: sectionColors[colorIndex],
		};

		setSections([...sections, newSection]);
		setCurrentSectionId(newId);
		setEditorKey(Date.now()); // Force re-render for the new section
	};

	// Delete current section
	const deleteSection = (id: string) => {
		if (sections.length <= 1) return; // Prevent deleting the last section

		const newSections = sections.filter((section) => section.id !== id);
		setSections(newSections);

		if (currentSectionId === id) {
			// If the deleted section was the current one, switch to the first one
			setCurrentSectionId(newSections[0].id);
			setEditorKey(Date.now()); // Force re-render
		}
	};

	// Rename current section
	const renameSection = (id: string, newName: string) => {
		setSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id ? { ...section, name: newName } : section
			)
		);
	};

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (analyzeTimeoutRef.current) {
				clearTimeout(analyzeTimeoutRef.current);
			}
		};
	}, []);

	// Apply theme to body element
	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	// Render Editor.js blocks for preview
	const renderEditorContent = (content: any) => {
		if (!content || !content.blocks || content.blocks.length === 0) {
			return (
				<p className="text-gray-500 dark:text-gray-400">
					No content yet. Start writing to see a preview.
				</p>
			);
		}

		return (
			<div className="editor-preview">
				{content.blocks.map((block: any, index: number) => {
					switch (block.type) {
						case "header": {
							const HeaderTag =
								`h${block.data.level}` as keyof JSX.IntrinsicElements;
							return (
								<HeaderTag
									key={index}
									dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
								/>
							);
						}
						case "paragraph":
							return (
								<p
									key={index}
									dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
								/>
							);

						case "list": {
							const ListTag = block.data.style === "ordered" ? "ol" : "ul";
							return (
								<ListTag key={index} className="ml-6 my-4">
									{Array.isArray(block.data.items) ? (
										block.data.items.map((item: string, i: number) => (
											<li
												key={i}
												dangerouslySetInnerHTML={{ __html: item || "" }}
											/>
										))
									) : (
										<li>Unable to render list items</li>
									)}
								</ListTag>
							);
						}
						case "checklist":
							return (
								<ul key={index} className="my-4">
									{Array.isArray(block.data.items) ? (
										block.data.items.map((item: any, i: number) => (
											<li key={i} className="flex items-center">
												<input
													type="checkbox"
													checked={item.checked || false}
													readOnly // Read-only in preview
													className="mr-2"
												/>
												<span
													dangerouslySetInnerHTML={{ __html: item.text || "" }}
												/>
											</li>
										))
									) : (
										<li>Unable to render checklist items</li>
									)}
								</ul>
							);
						case "quote":
							return (
								<blockquote key={index} className="border-l-4 pl-4 italic my-4">
									<p
										dangerouslySetInnerHTML={{ __html: block.data.text || "" }}
									/>
									{block.data.caption && (
										<footer className="text-sm mt-1">
											— {block.data.caption}
										</footer>
									)}
								</blockquote>
							);

						case "image": {
							const imageUrl = block.data.file?.url || block.data.url || "";
							return (
								<figure key={index} className="my-4">
									{imageUrl ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={imageUrl}
											alt={block.data.caption || "Image"}
											className="max-w-full rounded mx-auto"
										/>
									) : (
										<div className="bg-gray-200 dark:bg-[#383a40] flex items-center justify-center h-32 rounded">
											<span className="text-gray-500 dark:text-gray-400">
												Image not available
											</span>
										</div>
									)}
									{block.data.caption && (
										<figcaption className="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">
											{block.data.caption}
										</figcaption>
									)}
								</figure>
							);
						}

						case "code":
							return (
								<pre
									key={index}
									className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm my-4"
								>
									<code>{block.data.code || ""}</code>
								</pre>
							);

						case "delimiter":
							return (
								<div
									key={index}
									className="text-center my-8 text-gray-400 dark:text-gray-600"
								>
									***
								</div>
							);

						case "table":
							return (
								<div key={index} className="overflow-x-auto my-4">
									<table className="w-full border-collapse">
										<tbody>
											{Array.isArray(block.data.content) &&
												block.data.content.map(
													(row: string[], rowIndex: number) => (
														<tr
															key={rowIndex}
															className={
																rowIndex % 2 === 0
																	? "bg-gray-50 dark:bg-[#313338]"
																	: ""
															}
														>
															{Array.isArray(row) &&
																row.map((cell: string, cellIndex: number) => (
																	<td
																		key={cellIndex}
																		className="border border-gray-300 dark:border-[#383a40] p-2 text-sm"
																		dangerouslySetInnerHTML={{
																			__html: cell || "",
																		}}
																	/>
																))}
														</tr>
													)
												)}
										</tbody>
									</table>
								</div>
							);

						default:
							return (
								<div key={index} className="text-red-500 text-sm">
									Unsupported block type: {block.type}
								</div>
							);
					}
				})}
			</div>
		);
	};

	// Function to scroll the editor view to a specific block (Conceptual)
	const scrollToBlock = (blockIndex: number | undefined) => {
		if (!editorInstanceRef.current || blockIndex === undefined) return;

		// ### CONCEPTUAL IMPLEMENTATION ###
		// Editor.js doesn't have a direct scrollToBlock API.
		// You would likely need to:
		// 1. Get the DOM element for the specific block.
		// 2. Use standard DOM scrolling methods (e.g., element.scrollIntoView()).
		// This can be tricky because Editor.js manages the DOM of its blocks.

		alert(
			`Conceptual: Would scroll to block index ${blockIndex}. Feature not fully implemented due to Editor.js DOM handling.`
		);

		// Example (highly simplified and may not work reliably):
		// try {
		//     const blockElement = editorInstanceRef.current.blocks.getBlocks().find((b: any) => b.id === editorInstanceRef.current.blocks.getBlockByIndex(blockIndex)?.id)?.holder;
		//      if (blockElement) {
		//          blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		//      }
		// } catch (error) {
		//      console.error("Error scrolling to block:", error);
		// }
	};

	// Main application render
	return (
		<div
			className={`min-h-screen transition-colors duration-300 font-sans flex ${
				theme === "dark"
					? "bg-[#1e1f22] text-gray-100"
					: "bg-gray-50 text-gray-900"
			} ${
				fullscreen ? "fixed inset-0 z-50 bg-[#1e1f22] dark:bg-[#1e1f22]" : ""
			}`}
			ref={containerRef}
		>
			{/* Left Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out ${
					sidebarOpen ? "w-72 md:w-72" : "w-0"
				} ${
					theme === "dark"
						? "bg-[#2b2d31] border-r border-[#1e1f22]"
						: "bg-white border-r border-gray-200"
				}`}
			>
				{sidebarOpen && (
					<div className="h-full flex flex-col">
						<div className="p-5 border-b border-gray-200 dark:border-[#1e1f22] flex items-center justify-between">
							<h1 className="text-xl font-bold flex items-center">
								<FileEdit
									className={`mr-3 ${
										theme === "dark" ? "text-purple-400" : "text-purple-600"
									}`}
									size={24}
								/>
								<span
									className={
										theme === "dark"
											? "text-white font-semibold"
											: "text-gray-900 font-semibold"
									}
								>
									Writer's Assistant
								</span>
							</h1>
						</div>

						<div className="flex-1 overflow-y-auto p-4">
							<div className="space-y-3">
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-medium text-lg flex items-center">
										<FileText size={18} className="mr-2 text-gray-400" />
										Document Sections
									</h3>
									<button
										onClick={addSection}
										className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#383a40] transition-colors"
										aria-label="Add section"
									>
										<Plus size={18} />
									</button>
								</div>

								<ul className="space-y-3">
									{sections.map((section) => (
										<li
											key={section.id}
											onClick={() => handleSectionChange(section.id)}
											className={`rounded-lg transition-all duration-200 overflow-hidden cursor-pointer ${
												currentSectionId === section.id
													? theme === "dark"
														? "border-l-4 border-l-purple-500 bg-[#313338]"
														: "border-l-4 border-l-purple-500 bg-gray-50"
													: "hover:bg-gray-100 dark:hover:bg-[#313338]"
											} ${theme === "dark" ? "bg-[#2b2d31]" : "bg-white"}`}
										>
											<div className="p-3">
												<div className="flex items-center justify-between">
													<div className="flex items-center flex-grow">
														<Bookmark
															size={16}
															className={`mr-2 flex-shrink-0 ${
																currentSectionId === section.id
																	? "text-purple-500"
																	: "text-gray-400"
															}`}
														/>
														<input
															type="text"
															value={section.name}
															onChange={(e) =>
																renameSection(section.id, e.target.value)
															}
															onClick={(e) => e.stopPropagation()}
															className={`bg-transparent outline-none w-full text-sm ${
																currentSectionId === section.id
																	? theme === "dark"
																		? "text-white"
																		: "text-gray-900"
																	: theme === "dark"
																	? "text-gray-300"
																	: "text-gray-700"
															}`}
														/>
													</div>

													{sections.length > 1 && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																deleteSection(section.id);
															}}
															className={`p-1.5 rounded-full opacity-60 hover:opacity-100 transition-opacity ${
																theme === "dark"
																	? "hover:bg-[#383a40] text-gray-400 hover:text-red-400"
																	: "hover:bg-gray-200 text-gray-500 hover:text-red-600"
															}`}
															aria-label="Delete section"
														>
															<Trash2 size={14} />
														</button>
													)}
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="p-4 border-t border-gray-200 dark:border-[#1e1f22]">
							{/* Thesaurus Lookup Button moved to analysis panel */}
						</div>
					</div>
				)}
			</div>

			{/* Main Content Area */}
			<div
				className={`flex-1 transition-all duration-300 ease-in-out ${
					sidebarOpen ? "ml-0 md:ml-72" : "ml-0"
				}`}
			>
				{/* App Header */}
				{!distractionFree && !fullscreen && (
					<header
						className={`border-b sticky top-0 z-30 backdrop-blur-lg bg-opacity-90 ${
							theme === "dark"
								? "bg-[#1e1f22]/90 border-[#2b2d31]"
								: "bg-white/90 border-gray-200"
						}`}
					>
						<div className="px-4 py-3 flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<button
									onClick={() => setSidebarOpen(!sidebarOpen)}
									className={`p-2 rounded-lg transition-colors ${
										theme === "dark"
											? "hover:bg-[#2b2d31]"
											: "hover:bg-gray-100"
									}`}
									aria-label="Toggle sidebar"
								>
									{sidebarOpen ? <ArrowLeft size={20} /> : <Menu size={20} />}
								</button>
								{(!sidebarOpen || isMobile) && (
									<h1 className="text-lg font-semibold flex items-center">
										<FileEdit
											className={`mr-2 ${
												theme === "dark" ? "text-purple-400" : "text-purple-600"
											}`}
										/>

										<span
											className={
												theme === "dark" ? "text-white" : "text-gray-900"
											}
										>
											Writer's Assistant
										</span>
									</h1>
								)}
							</div>

							<div className="flex items-center overflow-x-auto space-x-2">
								<div className="text-sm bg-opacity-80 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2b2d31] whitespace-nowrap hidden sm:block">
									<span className="font-medium text-white">Words:</span>{" "}
									<span className="text-white">{wordCount}</span>
								</div>

								<button
									onClick={toggleTheme}
									className={`p-2 rounded-lg transition-colors ${
										theme === "dark"
											? "hover:bg-[#2b2d31]"
											: "hover:bg-gray-100"
									}`}
									aria-label={
										theme === "dark"
											? "Switch to light mode"
											: "Switch to dark mode"
									}
								>
									{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
								</button>

								<button
									onClick={() => setSplitScreen(!splitScreen)}
									className={`p-2 rounded-lg transition-colors hidden md:block ${
										splitScreen
											? theme === "dark"
												? "bg-[#2b2d31]"
												: "bg-gray-200"
											: theme === "dark"
											? "hover:bg-[#2b2d31]"
											: "hover:bg-gray-100"
									}`}
									aria-label={
										splitScreen ? "Full screen mode" : "Split screen mode"
									}
								>
									<Split size={20} />
								</button>

								<button
									onClick={() => setPreviewMode(!previewMode)}
									className={`p-2 rounded-lg transition-colors ${
										previewMode
											? theme === "dark"
												? "bg-[#2b2d31]"
												: "bg-gray-200"
											: theme === "dark"
											? "hover:bg-[#2b2d31]"
											: "hover:bg-gray-100"
									}`}
									aria-label={
										previewMode
											? "Switch to edit mode"
											: "Switch to preview mode"
									}
								>
									{previewMode ? <Edit size={20} /> : <Eye size={20} />}
								</button>

								<button
									onClick={toggleFullscreen}
									className={`p-2 rounded-lg transition-colors ${
										theme === "dark"
											? "hover:bg-[#2b2d31]"
											: "hover:bg-gray-100"
									}`}
									aria-label="Toggle fullscreen mode"
								>
									<Maximize2 size={20} />
								</button>

								{!analysisOpen && (
									<button
										onClick={() => setAnalysisOpen(true)}
										className={`p-2 rounded-lg transition-colors flex items-center ${
											theme === "dark"
												? "bg-[#2b2d31] hover:bg-[#383a40] text-purple-400"
												: "bg-gray-100 hover:bg-gray-200 text-purple-600"
										}`}
										aria-label="Show analysis"
									>
										<Lightbulb size={18} className="mr-1" />
										<span className="text-sm hidden sm:inline">Analysis</span>
									</button>
								)}

								<button
									onClick={handleEditorChange}
									className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
									aria-label="Save content"
								>
									<Save size={16} className="mr-2" />{" "}
									<span className="hidden sm:inline">Save</span>
								</button>
							</div>
						</div>
					</header>
				)}

				{/* Exit Fullscreen Button */}
				{fullscreen && (
					<button
						onClick={exitFullscreen}
						className="fixed top-4 right-4 z-50 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
						aria-label="Exit fullscreen mode"
					>
						<X size={24} />
					</button>
				)}

				<div className="flex flex-col h-[calc(100vh-64px)]">
					{" "}
					{/* Adjust height based on header */}
					{/* Main Editor Area */}
					<div className="flex-1 overflow-hidden">
						{previewMode ? (
							<div
								className={`p-4 md:p-8 mx-auto prose dark:prose-invert max-w-4xl h-full overflow-y-auto ${
									theme === "dark"
										? "bg-[#2b2d31] prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-purple-400"
										: "bg-white"
								} ${fullscreen ? "w-full" : ""}`}
							>
								<h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-[#383a40]">
									{currentSection.name}
								</h2>
								{renderEditorContent(currentSection.content)}
							</div>
						) : (
							<div
								className={`flex ${
									splitScreen && !distractionFree && !fullscreen
										? "space-x-4"
										: ""
								}`}
							>
								{/* Editor */}
								<div
									className={`${
										splitScreen && !distractionFree && !fullscreen
											? "w-1/2"
											: "w-full"
									} ${fullscreen ? "h-screen" : ""}`}
								>
									<div
										className={`relative h-full ${
											theme === "dark" ? "bg-[#2b2d31]" : "bg-white"
										}`}
									>
										<div
											className={`editor-container ${
												fullscreen ? "h-full p-8" : "p-4 md:p-6"
											} min-h-[calc(100vh-250px)] ${
												analysisOpen && !fullscreen
													? "h-[calc(100vh-300px)]"
													: "h-full"
											} overflow-y-auto`}
											onMouseUp={handleWordSelect} // Listen for word selection within the editor container
										>
											{/* Editor.js styles override for left alignment */}
											<style jsx global>{`
												.codex-editor__redactor {
													padding-left: 0 !important;
													margin-left: 0 !important;
												}
												.ce-block__content {
													max-width: 100% !important;
													margin-left: 0 !important;
													padding-left: 0 !important;
												}
											`}</style>
											<ReactEditorJS
												key={editorKey}
												onInitialize={handleEditorInitialize}
												onChange={handleEditorChange}
												tools={EDITOR_JS_TOOLS}
												defaultValue={currentSection.content}
											/>
										</div>
									</div>
								</div>

								{/* Split Screen Preview */}
								{splitScreen && !distractionFree && !fullscreen && (
									<div className="w-1/2 hidden md:block">
										<div
											className={`p-6 prose dark:prose-invert h-full overflow-auto ${
												theme === "dark"
													? "bg-[#2b2d31] prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-purple-400"
													: "bg-white"
											}`}
										>
											<h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-[#383a40] flex items-center">
												<Eye size={18} className="mr-2" /> Preview
											</h3>
											{renderEditorContent(currentSection.content)}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
					{/* Analysis Footer */}
					{!distractionFree && !fullscreen && !previewMode && analysisOpen && (
						<div
							className={`border-t transition-all duration-300 ease-in-out ${
								theme === "dark"
									? "bg-[#2b2d31] border-[#1e1f22]"
									: "bg-white border-gray-200"
							}`}
						>
							<div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-[#1e1f22]">
								<h3 className="font-medium flex items-center">
									<Lightbulb size={16} className="mr-2 text-yellow-500" />
									Writing Analysis
								</h3>
								<div className="flex items-center space-x-2">
									<button
										onClick={handleWordSelect}
										className={`p-2 rounded-lg flex items-center transition-colors ${
											theme === "dark"
												? "hover:bg-[#383a40]"
												: "hover:bg-gray-100"
										}`}
										aria-label="Thesaurus Lookup"
										title="Thesaurus Lookup"
									>
										<Book size={16} />
									</button>
									<button
										onClick={() => setAnalysisOpen(false)}
										className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#383a40]"
										aria-label="Close analysis panel"
										title="Close analysis panel"
									>
										<ChevronUp size={18} />
									</button>
								</div>
							</div>

							<div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* Writing Tip */}
								<div
									className={`p-3 rounded-lg border ${
										theme === "dark"
											? "bg-[#313338] border-[#383a40]"
											: "bg-gray-50 border-gray-200"
									} md:col-span-1 flex flex-col justify-between`}
								>
									{currentTip && (
										<>
											<div className="flex items-start mb-2">
												<Lightbulb
													size={16}
													className="text-yellow-500 mt-0.5 mr-2 shrink-0"
												/>
												<h4 className="font-medium text-sm">
													{currentTip.title}
												</h4>
											</div>
											<p className="text-xs text-gray-500 dark:text-gray-400 ml-6 flex-grow">
												{currentTip.description}
											</p>
											<div className="flex justify-end mt-2">
												<span
													className={`text-xs px-2 py-0.5 rounded-full ${
														currentTip.category === "grammar"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
															: currentTip.category === "style"
															? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
															: currentTip.category === "structure"
															? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
															: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
													}`}
												>
													{currentTip.category}
												</span>
											</div>
										</>
									)}
								</div>

								{/* Grammar Issues */}
								<div>
									<h4 className="text-sm font-medium mb-2 flex items-center">
										<Sparkles size={14} className="text-amber-500 mr-2" />
										Writing Suggestions ({grammarIssues.length})
									</h4>
									{isAnalyzing ? (
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Analyzing...
										</p>
									) : grammarIssues.length > 0 ? (
										<ul className="space-y-2 max-h-40 overflow-y-auto">
											{" "}
											{/* Added height and overflow */}
											{grammarIssues.map((issue, idx) => (
												<li
													key={idx}
													className={`p-2 rounded-lg text-sm cursor-pointer ${
														theme === "dark"
															? "bg-[#313338] hover:bg-[#383a40]"
															: "bg-gray-50 hover:bg-gray-100"
													}`}
													onClick={() => scrollToBlock(issue.blockIndex)} // Scroll to the block on click
												>
													<div className="flex items-start">
														<ChevronRight
															size={14}
															className="text-purple-500 mt-0.5 mr-2 shrink-0"
														/>
														<div>
															<strong className="font-medium">
																{issue.type}:
															</strong>{" "}
															<span className="text-gray-600 dark:text-gray-300">
																{issue.text}
															</span>
															{issue.suggestion && (
																<p
																	className="text-xs mt-1 text-gray-500 dark:text-gray-400 flex items-center hover:underline"
																	onClick={(e) => {
																		e.stopPropagation(); // Prevent clicking the suggestion from scrolling the main issue
																		applySuggestion(issue); // Attempt to apply suggestion
																	}}
																>
																	<Lightbulb
																		size={12}
																		className="mr-1 shrink-0"
																	/>
																	Suggest: {issue.suggestion}
																</p>
															)}
														</div>
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className="text-sm text-gray-500 dark:text-gray-400">
											No suggestions yet. Start writing to see feedback.
										</p>
									)}
								</div>

								{/* Thesaurus */}
								<div>
									<h4 className="text-sm font-medium mb-2 flex items-center">
										<Book size={14} className="text-purple-500 mr-2" />
										Thesaurus
									</h4>
									{selectedWord ? (
										<div>
											<div className="flex items-center mb-2">
												<span className="font-medium text-sm">
													"{selectedWord}"
												</span>
											</div>

											{thesaurusLoading ? (
												<p className="text-sm text-gray-500 dark:text-gray-400">
													Loading synonyms...
												</p>
											) : synonyms.length > 0 ? (
												<div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
													{" "}
													{/* Added height and overflow */}
													{synonyms.map((synonym, idx) => (
														<button
															key={idx}
															className={`px-2 py-1 rounded text-xs transition-colors ${
																theme === "dark"
																	? "bg-[#383a40] hover:bg-[#404249]"
																	: "bg-gray-100 hover:bg-gray-200"
															}`}
															onClick={() => applySynonym(synonym)} // Attempt to apply synonym
														>
															{synonym}
														</button>
													))}
												</div>
											) : (
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{thesaurusError || "No synonyms found."}
												</p>
											)}
											<button
												onClick={() => {
													setSelectedWord("");
													setSynonyms([]);
													setThesaurusError(null);
												}}
												className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:underline"
											>
												Clear Thesaurus
											</button>
										</div>
									) : (
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Select a word in your text to see synonyms.
										</p>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default WritingAssistant;
