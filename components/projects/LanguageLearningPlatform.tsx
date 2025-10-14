"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
	useDraggable,
	useDroppable,
} from "@dnd-kit/core";
import type {
	DragStartEvent,
	DragEndEvent,
	DragOverEvent,
	Active,
	Over,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	FaPlay,
	FaCheck,
	FaRedo,
	FaQuestionCircle,
	FaTrophy,
	FaDatabase,
	FaLock,
	FaUnlock,
	FaStar,
	FaBookOpen,
	FaEdit,
	FaChartLine,
	FaGraduationCap,
	FaLightbulb,
	FaArrowRight,
	FaTimes,
	FaChevronDown,
	FaGripVertical,
	FaHeartbeat,
	FaBrain,
	FaRegLightbulb,
	FaRegClock,
	FaRegCalendarAlt,
	FaRegCommentDots,
	FaRegEnvelope,
	FaRegUser,
	FaExternalLinkAlt,
	FaCodeBranch,
	FaRegFileAlt,
	FaCog,
	FaColumns,
	FaThList,
	FaInfoCircle,
} from "react-icons/fa";

interface Word {
	id: string;
	text: string;
	type:
		| "subject"
		| "verb"
		| "object"
		| "adjective"
		| "adverb"
		| "article"
		| "preposition"
		| "conjunction";
	correctPosition?: number;
}

interface Exercise {
	id: string;
	sentence: string;
	words: Word[];
	correctOrder: string[];
	difficulty: 1 | 2 | 3;
	category: string;
	hint?: string;
}

interface UserProgress {
	level: number;
	totalCompleted: number;
	streakCount: number;
	lastCompletedDate: string;
	categoryProgress: Record<string, number>;
}

interface PracticeHistory {
	exerciseId: string;
	completedAt: string;
	attempts: number;
	timeSpent: number;
	accuracy: number;
}

interface PerformanceMetrics {
	averageAttempts: number;
	averageAccuracy: number;
	averageTimePerExercise: number;
	consecutiveCorrect: number;
	recentPerformance: number[];
}

interface TooltipData {
	content: string;
	type: "word" | "button" | "info";
	position?: "top" | "bottom" | "left" | "right";
}

const MOCK_EXERCISES: Exercise[] = [
	{
		id: "1",
		sentence: "The quick brown fox jumps over the lazy dog.",
		words: [
			{ id: "w1", text: "The", type: "article" },
			{ id: "w2", text: "quick", type: "adjective" },
			{ id: "w3", text: "brown", type: "adjective" },
			{ id: "w4", text: "fox", type: "subject" },
			{ id: "w5", text: "jumps", type: "verb" },
			{ id: "w6", text: "over", type: "preposition" },
			{ id: "w7", text: "the", type: "article" },
			{ id: "w8", text: "lazy", type: "adjective" },
			{ id: "w9", text: "dog", type: "object" },
		],
		correctOrder: ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"],
		difficulty: 1,
		category: "Basic Sentence Structure",
		hint: "Start with the article and subject, then find the verb and object.",
	},
	{
		id: "4",
		sentence: "My younger sister reads interesting books every evening.",
		words: [
			{ id: "w32", text: "My", type: "adjective" },
			{ id: "w33", text: "younger", type: "adjective" },
			{ id: "w34", text: "sister", type: "subject" },
			{ id: "w35", text: "reads", type: "verb" },
			{ id: "w36", text: "interesting", type: "adjective" },
			{ id: "w37", text: "books", type: "object" },
			{ id: "w38", text: "every", type: "adjective" },
			{ id: "w39", text: "evening", type: "adverb" },
		],
		correctOrder: ["w32", "w33", "w34", "w35", "w36", "w37", "w38", "w39"],
		difficulty: 1,
		category: "Possessive Adjectives",
		hint: "Focus on the possessive adjective, subject, verb, and object with their modifiers.",
	},
	{
		id: "10",
		sentence: "She always arrives early for important appointments.",
		words: [
			{ id: "w91", text: "She", type: "subject" },
			{ id: "w92", text: "always", type: "adverb" },
			{ id: "w93", text: "arrives", type: "verb" },
			{ id: "w94", text: "early", type: "adverb" },
			{ id: "w95", text: "for", type: "preposition" },
			{ id: "w96", text: "important", type: "adjective" },
			{ id: "w97", text: "appointments", type: "object" },
		],
		correctOrder: ["w91", "w92", "w93", "w94", "w95", "w96", "w97"],
		difficulty: 1,
		category: "Frequency Adverbs",
		hint: "Notice where the frequency adverb 'always' is positioned in relation to the verb.",
	},
	{
		id: "12",
		sentence: "My grandmother bakes delicious cookies for us every weekend.",
		words: [
			{ id: "w110", text: "My", type: "adjective" },
			{ id: "w111", text: "grandmother", type: "subject" },
			{ id: "w112", text: "bakes", type: "verb" },
			{ id: "w113", text: "delicious", type: "adjective" },
			{ id: "w114", text: "cookies", type: "object" },
			{ id: "w115", text: "for", type: "preposition" },
			{ id: "w116", text: "us", type: "object" },
			{ id: "w117", text: "every", type: "adjective" },
			{ id: "w118", text: "weekend", type: "adverb" },
		],
		correctOrder: [
			"w110",
			"w111",
			"w112",
			"w113",
			"w114",
			"w115",
			"w116",
			"w117",
			"w118",
		],
		difficulty: 1,
		category: "Family and Routine",
		hint: "Identify the subject, verb, direct object, and prepositional phrase showing for whom and when.",
	},

	{
		id: "2",
		sentence: "Students carefully study difficult grammar rules daily.",
		words: [
			{ id: "w10", text: "Students", type: "subject" },
			{ id: "w11", text: "carefully", type: "adverb" },
			{ id: "w12", text: "study", type: "verb" },
			{ id: "w13", text: "difficult", type: "adjective" },
			{ id: "w14", text: "grammar", type: "adjective" },
			{ id: "w15", text: "rules", type: "object" },
			{ id: "w16", text: "daily", type: "adverb" },
		],
		correctOrder: ["w10", "w11", "w12", "w13", "w14", "w15", "w16"],
		difficulty: 2,
		category: "Adverbs and Adjectives",
		hint: "Pay attention to the adverbs that modify the verb and the adjectives that describe the nouns.",
	},
	{
		id: "3",
		sentence:
			"Although the weather was terrible, we decided to go hiking because we needed exercise.",
		words: [
			{ id: "w18", text: "Although", type: "conjunction" },
			{ id: "w19", text: "the", type: "article" },
			{ id: "w20", text: "weather", type: "subject" },
			{ id: "w21", text: "was", type: "verb" },
			{ id: "w22", text: "terrible", type: "adjective" },
			{ id: "w23", text: "we", type: "subject" },
			{ id: "w24", text: "decided", type: "verb" },
			{ id: "w25", text: "to", type: "preposition" },
			{ id: "w26", text: "go", type: "verb" },
			{ id: "w27", text: "hiking", type: "object" },
			{ id: "w28", text: "because", type: "conjunction" },
			{ id: "w29", text: "we", type: "subject" },
			{ id: "w30", text: "needed", type: "verb" },
			{ id: "w31", text: "exercise", type: "object" },
		],
		correctOrder: [
			"w18",
			"w19",
			"w20",
			"w21",
			"w22",
			"w23",
			"w24",
			"w25",
			"w26",
			"w27",
			"w28",
			"w29",
			"w30",
			"w31",
		],
		difficulty: 3,
		category: "Complex Sentences",
		hint: "This sentence has dependent and independent clauses connected by conjunctions.",
	},
	{
		id: "5",
		sentence:
			"The talented musician played beautifully at the concert last night.",
		words: [
			{ id: "w40", text: "The", type: "article" },
			{ id: "w41", text: "talented", type: "adjective" },
			{ id: "w42", text: "musician", type: "subject" },
			{ id: "w43", text: "played", type: "verb" },
			{ id: "w44", text: "beautifully", type: "adverb" },
			{ id: "w45", text: "at", type: "preposition" },
			{ id: "w46", text: "the", type: "article" },
			{ id: "w47", text: "concert", type: "object" },
			{ id: "w48", text: "last", type: "adjective" },
			{ id: "w49", text: "night", type: "adverb" },
		],
		correctOrder: [
			"w40",
			"w41",
			"w42",
			"w43",
			"w44",
			"w45",
			"w46",
			"w47",
			"w48",
			"w49",
		],
		difficulty: 2,
		category: "Prepositional Phrases",
		hint: "Notice how the prepositional phrase 'at the concert' modifies where the action took place.",
	},
	{
		id: "6",
		sentence: "Children often learn new languages more easily than adults.",
		words: [
			{ id: "w50", text: "Children", type: "subject" },
			{ id: "w51", text: "often", type: "adverb" },
			{ id: "w52", text: "learn", type: "verb" },
			{ id: "w53", text: "new", type: "adjective" },
			{ id: "w54", text: "languages", type: "object" },
			{ id: "w55", text: "more", type: "adverb" },
			{ id: "w56", text: "easily", type: "adverb" },
			{ id: "w57", text: "than", type: "conjunction" },
			{ id: "w58", text: "adults", type: "object" },
		],
		correctOrder: [
			"w50",
			"w51",
			"w52",
			"w53",
			"w54",
			"w55",
			"w56",
			"w57",
			"w58",
		],
		difficulty: 2,
		category: "Comparative Structures",
		hint: "This sentence compares how children and adults learn languages using 'more...than'.",
	},
	{
		id: "14",
		sentence:
			"The weather forecast predicts heavy rain throughout the entire week.",
		words: [
			{ id: "w132", text: "The", type: "article" },
			{ id: "w133", text: "weather", type: "adjective" },
			{ id: "w134", text: "forecast", type: "subject" },
			{ id: "w135", text: "predicts", type: "verb" },
			{ id: "w136", text: "heavy", type: "adjective" },
			{ id: "w137", text: "rain", type: "object" },
			{ id: "w138", text: "throughout", type: "preposition" },
			{ id: "w139", text: "the", type: "article" },
			{ id: "w140", text: "entire", type: "adjective" },
			{ id: "w141", text: "week", type: "object" },
		],
		correctOrder: [
			"w132",
			"w133",
			"w134",
			"w135",
			"w136",
			"w137",
			"w138",
			"w139",
			"w140",
			"w141",
		],
		difficulty: 2,
		category: "Weather and Time",
		hint: "Notice the compound noun 'weather forecast' and the prepositional phrase indicating duration.",
	},
	{
		id: "8",
		sentence:
			"The old library contains thousands of rare books and manuscripts.",
		words: [
			{ id: "w69", text: "The", type: "article" },
			{ id: "w70", text: "old", type: "adjective" },
			{ id: "w71", text: "library", type: "subject" },
			{ id: "w72", text: "contains", type: "verb" },
			{ id: "w73", text: "thousands", type: "adjective" },
			{ id: "w74", text: "of", type: "preposition" },
			{ id: "w75", text: "rare", type: "adjective" },
			{ id: "w76", text: "books", type: "object" },
			{ id: "w77", text: "and", type: "conjunction" },
			{ id: "w78", text: "manuscripts", type: "object" },
		],
		correctOrder: [
			"w69",
			"w70",
			"w71",
			"w72",
			"w73",
			"w74",
			"w75",
			"w76",
			"w77",
			"w78",
		],
		difficulty: 2,
		category: "Compound Objects",
		hint: "Notice the compound object connected by 'and' and the prepositional phrase 'of rare books'.",
	},

	{
		id: "7",
		sentence:
			"If you study regularly, you will improve your English significantly.",
		words: [
			{ id: "w59", text: "If", type: "conjunction" },
			{ id: "w60", text: "you", type: "subject" },
			{ id: "w61", text: "study", type: "verb" },
			{ id: "w62", text: "regularly", type: "adverb" },
			{ id: "w63", text: "you", type: "subject" },
			{ id: "w64", text: "will", type: "verb" },
			{ id: "w65", text: "improve", type: "verb" },
			{ id: "w66", text: "your", type: "adjective" },
			{ id: "w67", text: "English", type: "object" },
			{ id: "w68", text: "significantly", type: "adverb" },
		],
		correctOrder: [
			"w59",
			"w60",
			"w61",
			"w62",
			"w63",
			"w64",
			"w65",
			"w66",
			"w67",
			"w68",
		],
		difficulty: 3,
		category: "Conditional Sentences",
		hint: "This is a first conditional sentence with 'if' clause and main clause.",
	},
	{
		id: "9",
		sentence:
			"During the meeting, the manager explained the new policy clearly and thoroughly.",
		words: [
			{ id: "w79", text: "During", type: "preposition" },
			{ id: "w80", text: "the", type: "article" },
			{ id: "w81", text: "meeting", type: "object" },
			{ id: "w82", text: "the", type: "article" },
			{ id: "w83", text: "manager", type: "subject" },
			{ id: "w84", text: "explained", type: "verb" },
			{ id: "w85", text: "the", type: "article" },
			{ id: "w86", text: "new", type: "adjective" },
			{ id: "w87", text: "policy", type: "object" },
			{ id: "w88", text: "clearly", type: "adverb" },
			{ id: "w89", text: "and", type: "conjunction" },
			{ id: "w90", text: "thoroughly", type: "adverb" },
		],
		correctOrder: [
			"w79",
			"w80",
			"w81",
			"w82",
			"w83",
			"w84",
			"w85",
			"w86",
			"w87",
			"w88",
			"w89",
			"w90",
		],
		difficulty: 3,
		category: "Complex Modifiers",
		hint: "Start with the prepositional phrase, then identify the main subject and verb, followed by compound adverbs.",
	},
	{
		id: "11",
		sentence:
			"The students who studied hard passed the difficult examination with excellent grades.",
		words: [
			{ id: "w98", text: "The", type: "article" },
			{ id: "w99", text: "students", type: "subject" },
			{ id: "w100", text: "who", type: "conjunction" },
			{ id: "w101", text: "studied", type: "verb" },
			{ id: "w102", text: "hard", type: "adverb" },
			{ id: "w103", text: "passed", type: "verb" },
			{ id: "w104", text: "the", type: "article" },
			{ id: "w105", text: "difficult", type: "adjective" },
			{ id: "w106", text: "examination", type: "object" },
			{ id: "w107", text: "with", type: "preposition" },
			{ id: "w108", text: "excellent", type: "adjective" },
			{ id: "w109", text: "grades", type: "object" },
		],
		correctOrder: [
			"w98",
			"w99",
			"w100",
			"w101",
			"w102",
			"w103",
			"w104",
			"w105",
			"w106",
			"w107",
			"w108",
			"w109",
		],
		difficulty: 3,
		category: "Relative Clauses",
		hint: "This sentence contains a relative clause 'who studied hard' that modifies 'students'.",
	},
	{
		id: "13",
		sentence:
			"After finishing homework, the tired student immediately went to bed and slept soundly.",
		words: [
			{ id: "w119", text: "After", type: "preposition" },
			{ id: "w120", text: "finishing", type: "verb" },
			{ id: "w121", text: "homework", type: "object" },
			{ id: "w122", text: "the", type: "article" },
			{ id: "w123", text: "tired", type: "adjective" },
			{ id: "w124", text: "student", type: "subject" },
			{ id: "w125", text: "immediately", type: "adverb" },
			{ id: "w126", text: "went", type: "verb" },
			{ id: "w127", text: "to", type: "preposition" },
			{ id: "w128", text: "bed", type: "object" },
			{ id: "w129", text: "and", type: "conjunction" },
			{ id: "w130", text: "slept", type: "verb" },
			{ id: "w131", text: "soundly", type: "adverb" },
		],
		correctOrder: [
			"w119",
			"w120",
			"w121",
			"w122",
			"w123",
			"w124",
			"w125",
			"w126",
			"w127",
			"w128",
			"w129",
			"w130",
			"w131",
		],
		difficulty: 3,
		category: "Complex Time Expressions",
		hint: "Start with the time expression, then identify the compound verbs connected by 'and'.",
	},
	{
		id: "15",
		sentence:
			"Neither the teacher nor the students understood the complex mathematical equation completely.",
		words: [
			{ id: "w142", text: "Neither", type: "conjunction" },
			{ id: "w143", text: "the", type: "article" },
			{ id: "w144", text: "teacher", type: "subject" },
			{ id: "w145", text: "nor", type: "conjunction" },
			{ id: "w146", text: "the", type: "article" },
			{ id: "w147", text: "students", type: "subject" },
			{ id: "w148", text: "understood", type: "verb" },
			{ id: "w149", text: "the", type: "article" },
			{ id: "w150", text: "complex", type: "adjective" },
			{ id: "w151", text: "mathematical", type: "adjective" },
			{ id: "w152", text: "equation", type: "object" },
			{ id: "w153", text: "completely", type: "adverb" },
		],
		correctOrder: [
			"w142",
			"w143",
			"w144",
			"w145",
			"w146",
			"w147",
			"w148",
			"w149",
			"w150",
			"w151",
			"w152",
			"w153",
		],
		difficulty: 3,
		category: "Correlative Conjunctions",
		hint: "This sentence uses 'neither...nor' to connect compound subjects with the same verb.",
	},
];

const WORD_TYPE_COLORS = {
	subject: "bg-indigo-100 border-indigo-300 text-indigo-800",
	verb: "bg-purple-100 border-purple-300 text-purple-800",
	object: "bg-blue-100 border-blue-300 text-blue-800",
	adjective: "bg-green-100 border-green-300 text-green-800",
	adverb: "bg-yellow-100 border-yellow-300 text-yellow-800",
	article: "bg-gray-100 border-gray-300 text-gray-800",
	preposition: "bg-pink-100 border-pink-300 text-pink-800",
	conjunction: "bg-orange-100 border-orange-300 text-orange-800",
};

const Tooltip: React.FC<{
	children: React.ReactNode;
	content: string;
	position?: "top" | "bottom" | "left" | "right";
	show?: boolean;
}> = ({ children, content, position = "top", show = true }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!show || !isMounted) return <>{children}</>;

	const positionClasses = {
		top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
		left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
		right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
	};

	const arrowClasses = {
		top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800",
		bottom:
			"bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800",
		left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800",
		right:
			"right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800",
	};

	return (
		<div
			className="relative inline-block"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			onFocus={() => setIsVisible(true)}
			onBlur={() => setIsVisible(false)}
		>
			{children}
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
						className={`absolute z-50 ${positionClasses[position]}`}
					>
						<div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-xs">
							{content}
							<div
								className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const IconWrapper: React.FC<{
	children: React.ReactNode;
	className?: string;
	size?: number;
}> = ({ children, className = "", size = 18 }) => (
	<span
		className={`inline-flex items-center justify-center ${className}`}
		style={{ fontSize: size }}
	>
		{children}
	</span>
);

const DraggableWord: React.FC<{
	word: Word;
	isInAnswer: boolean;
	isCompleted: boolean;
	isCorrectPosition?: boolean;
	isWrongPosition?: boolean;
	onClick: () => void;
	index?: number;
}> = ({
	word,
	isInAnswer,
	isCompleted,
	isCorrectPosition,
	isWrongPosition,
	onClick,
	index,
}) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: word.id,
			data: {
				word,
				isInAnswer,
				index,
			},
		});

	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`
        px-3 py-2 rounded-lg border-2 cursor-pointer transition-all relative select-none
        ${WORD_TYPE_COLORS[word.type]}
        ${isWrongPosition ? "ring-2 ring-red-500 bg-red-50" : ""}
        ${isCorrectPosition && isCompleted ? "ring-2 ring-green-500" : ""}
        ${isDragging ? "opacity-25" : "opacity-100"}
        hover:shadow-md
      `}
			onClick={onClick}
		>
			<span className="text-sm font-medium">{word.text}</span>
			{isWrongPosition && <span className="ml-2 text-red-500 text-xs">X</span>}
			{isCorrectPosition && isCompleted && (
				<span className="ml-2 text-green-500 text-xs">✓</span>
			)}
			{!isCompleted && isInAnswer && (
				<span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 rounded-full text-xs text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
					<IconWrapper className="text-white" size={10}>
						<FaGripVertical />
					</IconWrapper>
				</span>
			)}
		</div>
	);
};

const SortableWord: React.FC<{
	word: Word;
	isCompleted: boolean;
	isCorrectPosition?: boolean;
	isWrongPosition?: boolean;
	onClick: () => void;
}> = ({ word, isCompleted, isCorrectPosition, isWrongPosition, onClick }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: word.id,
		data: {
			word,
			isInAnswer: true,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`
        px-3 py-2 rounded-lg border-2 cursor-pointer transition-all relative select-none
        ${WORD_TYPE_COLORS[word.type]}
        ${isWrongPosition ? "ring-2 ring-red-500 bg-red-50" : ""}
        ${isCorrectPosition && isCompleted ? "ring-2 ring-green-500" : ""}
        ${isDragging ? "opacity-25" : "opacity-100"}
        hover:shadow-md
      `}
			onClick={onClick}
		>
			<span className="text-sm font-medium">{word.text}</span>
			{isWrongPosition && <span className="ml-2 text-red-500 text-xs">X</span>}
			{isCorrectPosition && isCompleted && (
				<span className="ml-2 text-green-500 text-xs">✓</span>
			)}
			{!isCompleted && (
				<span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 rounded-full text-xs text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
					<IconWrapper className="text-white" size={10}>
						<FaGripVertical />
					</IconWrapper>
				</span>
			)}
		</div>
	);
};

const DroppableAnswerArea: React.FC<{
	children: React.ReactNode;
	isEmpty: boolean;
}> = ({ children, isEmpty }) => {
	const { isOver, setNodeRef } = useDroppable({
		id: "answer-area",
	});

	return (
		<div
			ref={setNodeRef}
			className={`min-h-[100px] p-3 border-2 border-dashed rounded-lg transition-colors ${
				isEmpty
					? "border-gray-300 bg-gray-50"
					: "border-indigo-300 bg-indigo-50"
			} ${isOver ? "border-indigo-500 bg-indigo-100" : ""}`}
		>
			{children}
		</div>
	);
};

const ExercisesList: React.FC<{
	exercises: Exercise[];
	currentExercise: Exercise;
	completedExercises: Set<string>;
	userProgress: UserProgress;
	isMobile: boolean;
	isExerciseUnlocked: (exercise: Exercise, index: number) => boolean;
	switchToExercise: (exercise: Exercise) => void;
}> = ({
	exercises,
	currentExercise,
	completedExercises,
	userProgress,
	isMobile,
	isExerciseUnlocked,
	switchToExercise,
}) => {
	return (
		<div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-hidden flex flex-col">
			<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
				<div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
					<IconWrapper className="text-white drop-shadow-md" size={16}>
						<FaBookOpen />
					</IconWrapper>
				</div>
				Exercises
			</h3>

			<div className="space-y-2 custom-scrollbar overflow-y-auto flex-1">
				{exercises.map((exercise, index) => {
					const isCurrentExercise = exercise.id === currentExercise.id;
					const isCompleted = completedExercises.has(exercise.id);
					const isUnlocked = isExerciseUnlocked(exercise, index);

					return (
						<motion.div
							key={exercise.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all relative
                ${
									isCurrentExercise
										? "border-indigo-500 bg-indigo-50 shadow-md"
										: isUnlocked
										? "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
										: "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
								}
              `}
							onClick={() => isUnlocked && switchToExercise(exercise)}
							whileHover={isUnlocked ? { y: -2 } : {}}
							whileTap={isUnlocked ? { scale: 0.98 } : {}}
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<span className="text-sm font-medium text-gray-600">
											#{index + 1}
										</span>
										<div
											className={`px-2 py-1 rounded text-xs font-medium ${
												exercise.difficulty === 1
													? "bg-green-100 text-green-800"
													: exercise.difficulty === 2
													? "bg-yellow-100 text-yellow-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											Level {exercise.difficulty}
										</div>
									</div>

									<h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
										{exercise.category}
									</h4>

									<p className="text-xs text-gray-600 mb-2 line-clamp-2">
										{exercise.sentence}
									</p>

									<div className="flex items-center gap-2 text-xs text-gray-500">
										<span>{exercise.words.length} words</span>
										{exercise.hint && (
											<Tooltip content={exercise.hint} position="right">
												<span className="flex items-center gap-1 cursor-help">
													<IconWrapper className="text-gray-500" size={12}>
														<FaLightbulb />
													</IconWrapper>
													Hint
												</span>
											</Tooltip>
										)}
									</div>
								</div>

								<div className="flex flex-col items-center gap-1 ml-2">
									{!isUnlocked ? (
										<IconWrapper className="text-gray-400" size={16}>
											<FaLock />
										</IconWrapper>
									) : isCompleted ? (
										<IconWrapper className="text-green-500" size={16}>
											<FaCheck />
										</IconWrapper>
									) : (
										<IconWrapper className="text-gray-400" size={16}>
											<FaUnlock />
										</IconWrapper>
									)}
								</div>
							</div>

							{isCurrentExercise && (
								<motion.div
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-b-lg"
								/>
							)}
						</motion.div>
					);
				})}
			</div>

			<div className="mt-4 pt-4 border-t border-gray-200">
				<div className="text-sm text-gray-600 mb-2 flex justify-between">
					<span>Progress</span>
					<span>
						{completedExercises.size} / {exercises.length}
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<motion.div
						className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
						initial={{ width: 0 }}
						animate={{
							width: `${(completedExercises.size / exercises.length) * 100}%`,
						}}
						transition={{ duration: 1 }}
					/>
				</div>
			</div>
		</div>
	);
};

const LanguageLearningPlatform: React.FC = () => {
	const [currentExercise, setCurrentExercise] = useState<Exercise>(
		MOCK_EXERCISES[0]
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const [userAnswer, setUserAnswer] = useState<string[]>([]);
	const [availableWords, setAvailableWords] = useState<Word[]>([]);
	const [isCompleted, setIsCompleted] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [startTime, setStartTime] = useState<number>(Date.now());
	const [isMobile, setIsMobile] = useState(false);
	const [activeWord, setActiveWord] = useState<Word | null>(null);
	const [showProgress, setShowProgress] = useState(false);
	const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);
	const [showWrongFeedback, setShowWrongFeedback] = useState(false);
	const [completedExercises, setCompletedExercises] = useState<Set<string>>(
		new Set()
	);
	const [performanceMetrics, setPerformanceMetrics] =
		useState<PerformanceMetrics>({
			averageAttempts: 0,
			averageAccuracy: 0,
			averageTimePerExercise: 0,
			consecutiveCorrect: 0,
			recentPerformance: [],
		});

	const [userProgress, setUserProgress] = useState<UserProgress>({
		level: 1,
		totalCompleted: 0,
		streakCount: 0,
		lastCompletedDate: "",
		categoryProgress: {},
	});
	const [practiceHistory, setPracticeHistory] = useState<PracticeHistory[]>([]);

	const answerAreaRef = useRef<HTMLDivElement>(null);
	const mainContentRef = useRef<HTMLDivElement>(null);
	const processingExerciseRef = useRef<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const calculatePerformanceMetrics = useCallback(
		(history: PracticeHistory[]): PerformanceMetrics => {
			if (history.length === 0) {
				return {
					averageAttempts: 0,
					averageAccuracy: 0,
					averageTimePerExercise: 0,
					consecutiveCorrect: 0,
					recentPerformance: [],
				};
			}

			const recentHistory = history.slice(-10);
			const averageAttempts =
				recentHistory.reduce((sum, h) => sum + h.attempts, 0) /
				recentHistory.length;
			const averageAccuracy =
				recentHistory.reduce((sum, h) => sum + h.accuracy, 0) /
				recentHistory.length;
			const averageTimePerExercise =
				recentHistory.reduce((sum, h) => sum + h.timeSpent, 0) /
				recentHistory.length;

			let consecutiveCorrect = 0;
			for (let i = history.length - 1; i >= 0; i--) {
				if (history[i].attempts === 1) {
					consecutiveCorrect++;
				} else {
					break;
				}
			}

			const recentPerformance = recentHistory.slice(-5).map((h) => h.accuracy);

			return {
				averageAttempts,
				averageAccuracy,
				averageTimePerExercise,
				consecutiveCorrect,
				recentPerformance,
			};
		},
		[]
	);

	const getAdaptiveLevel = useCallback(
		(metrics: PerformanceMetrics): number => {
			const { averageAccuracy, consecutiveCorrect, averageAttempts } = metrics;

			if (
				averageAccuracy > 0.8 &&
				consecutiveCorrect >= 3 &&
				averageAttempts <= 2
			) {
				return Math.min(userProgress.level + 1, 3);
			}

			if (averageAccuracy < 0.5 && averageAttempts > 3) {
				return Math.max(userProgress.level - 1, 1);
			}

			return userProgress.level;
		},
		[userProgress.level]
	);

	const isExerciseUnlocked = useCallback(
		(exercise: Exercise, index: number): boolean => {
			if (index === 0) return true;

			if (isMobile) {
				return completedExercises.has(exercises[index - 1]?.id);
			}

			const exercisesAtSameDifficulty = exercises.filter(
				(ex) => ex.difficulty === exercise.difficulty
			);
			const completedAtSameDifficulty = exercisesAtSameDifficulty.filter((ex) =>
				completedExercises.has(ex.id)
			);

			return (
				userProgress.level >= exercise.difficulty ||
				(exercise.difficulty <= userProgress.level + 1 &&
					completedAtSameDifficulty.length > 0)
			);
		},
		[isMobile, completedExercises, exercises, userProgress.level]
	);

	useEffect(() => {
		const savedProgress = localStorage.getItem("languageLearning_progress");
		const savedHistory = localStorage.getItem("languageLearning_history");
		const savedCompleted = localStorage.getItem("languageLearning_completed");

		if (savedProgress) {
			setUserProgress(JSON.parse(savedProgress));
		}
		if (savedHistory) {
			const history = JSON.parse(savedHistory);
			setPracticeHistory(history);
			setPerformanceMetrics(calculatePerformanceMetrics(history));
		}
		if (savedCompleted) {
			setCompletedExercises(new Set(JSON.parse(savedCompleted)));
		}

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [calculatePerformanceMetrics]);

	useEffect(() => {
		const savedHistory = localStorage.getItem("languageLearning_history");
		if (savedHistory) {
			const history = JSON.parse(savedHistory);

			const uniqueHistory = history.filter(
				(item: PracticeHistory, index: number) => {
					return (
						history.findIndex(
							(other: PracticeHistory) =>
								other.exerciseId === item.exerciseId &&
								other.completedAt === item.completedAt
						) === index
					);
				}
			);

			if (uniqueHistory.length !== history.length) {
				setPracticeHistory(uniqueHistory);
				localStorage.setItem(
					"languageLearning_history",
					JSON.stringify(uniqueHistory)
				);
			} else {
				setPracticeHistory(history);
			}

			setPerformanceMetrics(calculatePerformanceMetrics(uniqueHistory));
		}
	}, [calculatePerformanceMetrics]);

	useEffect(() => {
		resetExercise();
	}, [currentExercise]);

	useEffect(() => {
		localStorage.setItem(
			"languageLearning_progress",
			JSON.stringify(userProgress)
		);
	}, [userProgress]);

	useEffect(() => {
		localStorage.setItem(
			"languageLearning_history",
			JSON.stringify(practiceHistory)
		);
	}, [practiceHistory]);

	useEffect(() => {
		localStorage.setItem(
			"languageLearning_completed",
			JSON.stringify(Array.from(completedExercises))
		);
	}, [completedExercises]);

	const resetExercise = useCallback(() => {
		const shuffledWords = [...currentExercise.words].sort(
			() => Math.random() - 0.5
		);
		setAvailableWords(shuffledWords);
		setUserAnswer([]);
		setIsCompleted(false);
		setIsProcessing(false);
		processingExerciseRef.current = null;
		setShowHint(false);
		setShowWrongFeedback(false);
		setAttempts(0);
		setStartTime(Date.now());
	}, [currentExercise]);

	const switchToExercise = (exercise: Exercise) => {
		const exerciseIndex = exercises.findIndex((ex) => ex.id === exercise.id);

		if (!isExerciseUnlocked(exercise, exerciseIndex)) {
			return;
		}

		setCurrentExercise(exercise);
		setUserAnswer([]);
		setIsCompleted(false);
		setIsProcessing(false);
		processingExerciseRef.current = null;
		setShowHint(false);
		setShowWrongFeedback(false);
		setAttempts(0);
		setStartTime(Date.now());

		if (mainContentRef.current) {
			mainContentRef.current.scrollTop = 0;
		}
	};

	const handleWordClick = (word: Word) => {
		if (!isCompleted) {
			if (availableWords.find((w) => w.id === word.id)) {
				setAvailableWords((prev) => prev.filter((w) => w.id !== word.id));
				setUserAnswer((prev) => [...prev, word.id]);
			} else {
				setUserAnswer((prev) => prev.filter((id) => id !== word.id));
				setAvailableWords((prev) => [...prev, word]);
			}
		}
	};

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const word = currentExercise.words.find((w) => w.id === active.id);
		setActiveWord(word || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveWord(null);

		if (!over || isCompleted) return;

		const activeId = String(active.id);
		const overId = String(over.id);
		const activeWord = currentExercise.words.find((w) => w.id === activeId);
		if (!activeWord) return;

		const isActiveInAvailable = availableWords.find((w) => w.id === activeId);
		const isActiveInAnswer = userAnswer.includes(activeId);

		if (overId === "answer-area" || userAnswer.includes(overId)) {
			if (isActiveInAvailable) {
				setAvailableWords((prev) => prev.filter((w) => w.id !== activeId));
				setUserAnswer((prev) => [...prev, activeId]);
			} else if (isActiveInAnswer && userAnswer.includes(overId)) {
				const oldIndex = userAnswer.indexOf(activeId);
				const newIndex = userAnswer.indexOf(overId);

				if (oldIndex !== newIndex && newIndex !== -1) {
					setUserAnswer((prev) => arrayMove(prev, oldIndex, newIndex));
				}
			}
		}
	};

	const removeWordFromAnswer = (wordId: string) => {
		if (!isCompleted) {
			const word = currentExercise.words.find((w) => w.id === wordId);
			if (word) {
				setUserAnswer((prev) => prev.filter((id) => id !== wordId));
				setAvailableWords((prev) => [...prev, word]);
			}
		}
	};

	const checkAnswer = () => {
		if (
			isCompleted ||
			isProcessing ||
			processingExerciseRef.current === currentExercise.id
		) {
			return;
		}

		setIsProcessing(true);
		processingExerciseRef.current = currentExercise.id;

		const newAttempts = attempts + 1;
		setAttempts(newAttempts);
		const isCorrect =
			JSON.stringify(userAnswer) ===
			JSON.stringify(currentExercise.correctOrder);

		if (isCorrect) {
			setIsCompleted(true);
			setShowWrongFeedback(false);
			const timeSpent = Date.now() - startTime;
			const accuracy = 1 / newAttempts;

			const isAlreadyCompleted = completedExercises.has(currentExercise.id);

			const now = new Date().toISOString();
			const recentDuplicate = practiceHistory.find(
				(entry) =>
					entry.exerciseId === currentExercise.id &&
					new Date(now).getTime() - new Date(entry.completedAt).getTime() < 5000
			);

			if (!isAlreadyCompleted && !recentDuplicate) {
				setCompletedExercises((prev) => new Set([...prev, currentExercise.id]));

				const newHistoryEntry: PracticeHistory = {
					exerciseId: currentExercise.id,
					completedAt: now,
					attempts: newAttempts,
					timeSpent,
					accuracy,
				};

				setPracticeHistory((prev) => {
					const isDuplicate = prev.some(
						(entry) =>
							entry.exerciseId === currentExercise.id &&
							entry.completedAt === now
					);

					if (isDuplicate) {
						return prev;
					}

					const newHistory = [...prev, newHistoryEntry];
					const newMetrics = calculatePerformanceMetrics(newHistory);
					setPerformanceMetrics(newMetrics);
					return newHistory;
				});

				setUserProgress((prevProgress) => {
					const newMetrics = calculatePerformanceMetrics([
						...practiceHistory,
						newHistoryEntry,
					]);
					const newLevel = getAdaptiveLevel(newMetrics);

					return {
						...prevProgress,
						level: newLevel,
						totalCompleted: prevProgress.totalCompleted + 1,
						streakCount: newAttempts === 1 ? prevProgress.streakCount + 1 : 0,
						lastCompletedDate: now,
						categoryProgress: {
							...prevProgress.categoryProgress,
							[currentExercise.category]:
								(prevProgress.categoryProgress[currentExercise.category] || 0) +
								1,
						},
					};
				});
			}
		} else {
			setShowWrongFeedback(true);

			if (newAttempts === 1) {
				setUserProgress((prev) => ({ ...prev, streakCount: 0 }));
			}

			setTimeout(() => setShowWrongFeedback(false), 5000);
		}

		setIsProcessing(false);
		processingExerciseRef.current = null;
	};

	const nextExercise = () => {
		const currentIndex = exercises.findIndex(
			(ex) => ex.id === currentExercise.id
		);

		for (let i = 1; i < exercises.length; i++) {
			const nextIndex = (currentIndex + i) % exercises.length;
			const nextExercise = exercises[nextIndex];
			if (isExerciseUnlocked(nextExercise, nextIndex)) {
				switchToExercise(nextExercise);
				return;
			}
		}
	};
	console.log(practiceHistory);
	const getWordById = (id: string) => {
		const word = currentExercise.words.find((w) => w.id === id);
		if (!word) {
			console.warn(`Word with id ${id} not found in current exercise`);

			return {
				id: id,
				text: "Unknown",
				type: "subject" as const,
			};
		}
		return word;
	};

	const getAccuracy = () => {
		if (userAnswer.length === 0) return 0;
		let correct = 0;
		userAnswer.forEach((wordId, index) => {
			if (currentExercise.correctOrder[index] === wordId) {
				correct++;
			}
		});
		return (correct / currentExercise.correctOrder.length) * 100;
	};

	const progressPercentage =
		(userProgress.totalCompleted / exercises.length) * 100;

	const [newsletter, setNewsletter] = useState({
		email: "",
		isLoading: false,
		error: "",
		success: false,
		touched: false,
	});

	const validateEmail = (email: string): string => {
		if (!email || email.trim() === "") {
			return "Email is required";
		}

		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		if (!emailRegex.test(email)) {
			return "Please enter a valid email address";
		}

		return "";
	};

	const handleNewsletterEmailChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const email = e.target.value;
		const error = newsletter.touched ? validateEmail(email) : "";

		setNewsletter((prev) => ({
			...prev,
			email,
			error,
			success: false,
		}));
	};

	const handleNewsletterEmailBlur = () => {
		const error = validateEmail(newsletter.email);
		setNewsletter((prev) => ({
			...prev,
			touched: true,
			error,
		}));
	};

	const handleNewsletterSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const error = validateEmail(newsletter.email);
		if (error) {
			setNewsletter((prev) => ({
				...prev,
				error,
				touched: true,
			}));
			return;
		}

		setNewsletter((prev) => ({
			...prev,
			isLoading: true,
			error: "",
		}));

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const isSuccess = Math.random() > 0.3;

			if (isSuccess) {
				setNewsletter((prev) => ({
					...prev,
					isLoading: false,
					success: true,
					email: "",
					touched: false,
				}));

				setTimeout(() => {
					setNewsletter((prev) => ({
						...prev,
						success: false,
					}));
				}, 5000);
			} else {
				throw new Error("Subscription failed. Please try again.");
			}
		} catch (error) {
			setNewsletter((prev) => ({
				...prev,
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Something went wrong. Please try again.",
			}));
		}
	};
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="min-h-screen bg-pattern-subtle flex flex-col relative">
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>

				<style
					dangerouslySetInnerHTML={{
						__html: `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      button, a {
        cursor: pointer;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .bg-pattern-dots {
        background-color: #f8fafc;
        background-image: radial-gradient(circle, #e2e8f0 1px, transparent 1px);
        background-size: 20px 20px;
      }
      .bg-pattern-subtle {
        background: 
          radial-gradient(circle at 25% 25%, #f1f5f9 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, #e0e7ff 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e0e7ff 100%);
      }
      @media (min-width: 1536px) {
        .container-2xl {
          max-width: none;
          padding-left: 2rem;
          padding-right: 2rem;
        }
      }
    `,
					}}
				/>

				<div className="w-full px-4  lg:px-6 xl:px-8 py-4 font-['Montserrat'] flex-1 flex flex-col overflow-hidden">
					{" "}
					<motion.header
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white rounded-2xl shadow-lg p-6 sticky top-0 z-10"
					>
						<div className="flex items-center gap-4 mb-4 md:mb-0">
							<div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
								<IconWrapper className="text-white drop-shadow-md" size={24}>
									<FaTrophy />
								</IconWrapper>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-800">
									Grammar Master
								</h1>
								<p className="text-sm text-gray-600">
									Level {userProgress.level} • {userProgress.totalCompleted}{" "}
									completed
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowProgress(!showProgress)}
								className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
							>
								<IconWrapper
									className="text-indigo-700 drop-shadow-sm"
									size={18}
								>
									<FaChartLine />
								</IconWrapper>
								{showProgress ? "Hide Progress" : "Show Progress"}
							</motion.button>
						</div>
					</motion.header>
					<AnimatePresence>
						{showProgress && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="mb-6 bg-white rounded-2xl shadow-lg p-6 overflow-hidden"
							>
								<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
									<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
										<IconWrapper className="text-white" size={16}>
											<FaChartLine />
										</IconWrapper>
									</div>
									Your Progress Dashboard
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-5 text-white shadow-md transform transition-transform hover:scale-[1.02]">
										<div className="flex items-center gap-3 mb-2">
											<div className="p-2 bg-white/20 rounded-lg">
												<IconWrapper className="text-white" size={18}>
													<FaGraduationCap />
												</IconWrapper>
											</div>
											<h4 className="text-sm font-medium opacity-90">
												Exercises Completed
											</h4>
										</div>
										<div className="text-3xl font-bold mb-1">
											{userProgress.totalCompleted}
										</div>
										<div className="text-xs opacity-80">
											{Math.round(progressPercentage)}% of all exercises
										</div>
									</div>

									<div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl p-5 text-white shadow-md transform transition-transform hover:scale-[1.02]">
										<div className="flex items-center gap-3 mb-2">
											<div className="p-2 bg-white/20 rounded-lg">
												<IconWrapper className="text-white" size={18}>
													<FaHeartbeat />
												</IconWrapper>
											</div>
											<h4 className="text-sm font-medium opacity-90">
												Current Streak
											</h4>
										</div>
										<div className="text-3xl font-bold mb-1">
											{userProgress.streakCount}
										</div>
										<div className="text-xs opacity-80">
											First-try correct answers
										</div>
									</div>

									<div className="bg-gradient-to-br from-purple-500 to-violet-700 rounded-xl p-5 text-white shadow-md transform transition-transform hover:scale-[1.02]">
										<div className="flex items-center gap-3 mb-2">
											<div className="p-2 bg-white/20 rounded-lg">
												<IconWrapper className="text-white" size={18}>
													<FaBrain />
												</IconWrapper>
											</div>
											<h4 className="text-sm font-medium opacity-90">
												Your Level
											</h4>
										</div>
										<div className="text-3xl font-bold mb-1">
											{userProgress.level}/3
										</div>
										<div className="text-xs opacity-80">
											{userProgress.level === 1
												? "Beginner - Keep practicing!"
												: userProgress.level === 2
												? "Intermediate - Good progress!"
												: "Advanced - Expert level!"}
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
									<div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
										<h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
											<IconWrapper className="text-indigo-600" size={16}>
												<FaRegLightbulb />
											</IconWrapper>
											Performance Metrics
										</h4>

										<div className="space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600">
													Average Accuracy
												</span>
												<div className="flex items-center">
													<span className="font-semibold text-gray-800">
														{Math.round(
															performanceMetrics.averageAccuracy * 100
														)}
														%
													</span>
													<div className="ml-3 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-indigo-600 rounded-full"
															style={{
																width: `${Math.round(
																	performanceMetrics.averageAccuracy * 100
																)}%`,
															}}
														></div>
													</div>
												</div>
											</div>

											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600">
													Average Attempts
												</span>
												<span className="font-semibold text-gray-800">
													{performanceMetrics.averageAttempts.toFixed(1)}
												</span>
											</div>

											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600">
													Consecutive Correct
												</span>
												<span className="font-semibold text-gray-800">
													{performanceMetrics.consecutiveCorrect}
												</span>
											</div>

											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-600">
													Avg. Time per Exercise
												</span>
												<span className="font-semibold text-gray-800">
													{Math.round(
														performanceMetrics.averageTimePerExercise / 1000
													)}{" "}
													sec
												</span>
											</div>
										</div>
									</div>

									<div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
										<h4 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
											<IconWrapper className="text-indigo-600" size={16}>
												<FaRegClock />
											</IconWrapper>
											Adaptive Learning System
										</h4>

										<p className="text-sm text-indigo-700 mb-4">
											Our system automatically adjusts to your performance,
											unlocking more challenging exercises as you improve.
										</p>

										<div className="bg-white/80 rounded-lg p-4 shadow-sm">
											<h5 className="text-xs font-semibold text-gray-700 mb-2">
												Current Status
											</h5>
											<div className="flex items-center gap-1 mb-3">
												<div
													className={`w-8 h-2 rounded-full ${
														userProgress.level >= 1
															? "bg-green-500"
															: "bg-gray-300"
													}`}
												></div>
												<div
													className={`w-8 h-2 rounded-full ${
														userProgress.level >= 2
															? "bg-yellow-500"
															: "bg-gray-300"
													}`}
												></div>
												<div
													className={`w-8 h-2 rounded-full ${
														userProgress.level >= 3
															? "bg-red-500"
															: "bg-gray-300"
													}`}
												></div>
											</div>
											<p className="text-xs text-gray-600">
												{userProgress.level === 1
													? "Complete exercises with high accuracy to unlock level 2 content"
													: userProgress.level === 2
													? "Keep practicing to master intermediate exercises and unlock level 3"
													: "You've unlocked all exercise levels - challenge yourself with advanced content!"}
											</p>
										</div>
									</div>
								</div>

								<div className="mt-2">
									<div className="flex justify-between text-sm text-gray-600 mb-2">
										<span>Overall Progress</span>
										<span>{Math.round(progressPercentage)}%</span>
									</div>
									<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
										<motion.div
											className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
											initial={{ width: 0 }}
											animate={{ width: `${progressPercentage}%` }}
											transition={{ duration: 1, ease: "easeOut" }}
										/>
									</div>
									<div className="mt-2 text-xs text-gray-500 text-center">
										{exercises.length - completedExercises.size} exercises
										remaining
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
					<div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 max-h-[100vh] overflow-hidden">
						<div className="hidden lg:block lg:w-1/3 xl:w-1/4 overflow-auto rounded-2xl">
							<ExercisesList
								exercises={exercises}
								currentExercise={currentExercise}
								completedExercises={completedExercises}
								userProgress={userProgress}
								isMobile={isMobile}
								isExerciseUnlocked={isExerciseUnlocked}
								switchToExercise={switchToExercise}
							/>
						</div>

						<div
							ref={mainContentRef}
							className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar rounded-2xl"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="bg-white rounded-2xl shadow-lg p-6"
							>
								<div className="mb-4">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
										<div className="flex-1 mb-3 sm:mb-0">
											<h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 leading-tight">
												{currentExercise.category}
											</h2>
											<div className="flex flex-wrap items-center gap-2 sm:gap-3">
												<div
													className={`px-3 py-1 rounded-full text-xs font-medium ${
														currentExercise.difficulty === 1
															? "bg-green-100 text-green-800"
															: currentExercise.difficulty === 2
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													Level {currentExercise.difficulty}
												</div>
												<div className="text-sm text-gray-600 font-medium">
													Attempt {attempts + 1}
												</div>
												<div className="text-sm text-gray-600">
													Exercise{" "}
													{exercises.findIndex(
														(ex) => ex.id === currentExercise.id
													) + 1}{" "}
													of {exercises.length}
												</div>
											</div>
										</div>

										<div className="flex items-center justify-between sm:justify-end gap-2">
											<div className="flex gap-1">
												<Tooltip content="Previous exercise" position="bottom">
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														onClick={() => {
															const currentIndex = exercises.findIndex(
																(ex) => ex.id === currentExercise.id
															);
															for (let i = 1; i <= exercises.length; i++) {
																const prevIndex =
																	(currentIndex - i + exercises.length) %
																	exercises.length;
																const prevExercise = exercises[prevIndex];
																if (
																	isExerciseUnlocked(prevExercise, prevIndex)
																) {
																	switchToExercise(prevExercise);
																	break;
																}
															}
														}}
														className="p-3 sm:p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors touch-manipulation"
													>
														<IconWrapper
															className="text-gray-600 hover:text-indigo-700 drop-shadow-sm"
															size={isMobile ? 18 : 16}
														>
															<FaChevronDown className="rotate-90" />
														</IconWrapper>
													</motion.button>
												</Tooltip>
												<Tooltip content="Next exercise" position="bottom">
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														onClick={nextExercise}
														className="p-3 sm:p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors touch-manipulation"
													>
														<IconWrapper
															className="text-gray-600 hover:text-indigo-700 drop-shadow-sm"
															size={isMobile ? 18 : 16}
														>
															<FaChevronDown className="-rotate-90" />
														</IconWrapper>
													</motion.button>
												</Tooltip>
											</div>

											<div className="flex gap-1">
												<Tooltip
													content={showHint ? "Hide hint" : "Show hint"}
													position="bottom"
												>
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														onClick={() => setShowHint(!showHint)}
														className={`p-3 sm:p-2 rounded-lg transition-colors touch-manipulation ${
															showHint
																? "text-indigo-600 bg-indigo-50"
																: "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
														}`}
													>
														<IconWrapper
															className={`drop-shadow-sm ${
																showHint
																	? "text-indigo-700"
																	: "text-gray-600 hover:text-indigo-700"
															}`}
															size={isMobile ? 18 : 16}
														>
															<FaLightbulb />
														</IconWrapper>
													</motion.button>
												</Tooltip>
												<Tooltip content="Reset exercise" position="bottom">
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														onClick={resetExercise}
														className="p-3 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
													>
														<IconWrapper
															className="text-gray-600 hover:text-red-700 drop-shadow-sm"
															size={isMobile ? 18 : 16}
														>
															<FaRedo />
														</IconWrapper>
													</motion.button>
												</Tooltip>
											</div>
										</div>
									</div>
								</div>

								<AnimatePresence>
									{showHint && currentExercise.hint && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
										>
											<div className="text-sm text-blue-800">
												<strong>Hint:</strong> {currentExercise.hint}
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								<div className="mb-4 p-3 bg-gray-50 rounded-lg">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Target Sentence:
									</label>
									<div className="text-lg font-medium text-gray-800">
										{currentExercise.sentence}
									</div>
								</div>

								<LayoutGroup>
									<div className="mb-4">
										<Tooltip
											content={
												isMobile
													? "Tap words below to build your sentence in the correct order"
													: "Drag words here or click them to build your sentence"
											}
											position="bottom"
										>
											<label className="block text-sm font-medium text-gray-700 mb-2 cursor-help">
												Your Answer {!isMobile && "(Drop words here)"}:
											</label>
										</Tooltip>
										<DroppableAnswerArea isEmpty={userAnswer.length === 0}>
											<div className="flex flex-wrap gap-2">
												<SortableContext
													items={userAnswer}
													strategy={verticalListSortingStrategy}
												>
													<AnimatePresence mode="popLayout">
														{userAnswer.map((wordId) => {
															const word = getWordById(wordId);
															const index = userAnswer.indexOf(wordId);
															const isCorrectPosition =
																currentExercise.correctOrder[index] === wordId;
															const isWrongPosition =
																!isCorrectPosition && isCompleted;

															return (
																<motion.div
																	key={`word-${wordId}`}
																	layout
																	layoutId={`word-${wordId}`}
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	exit={{ opacity: 0, scale: 0.8 }}
																	transition={{
																		layout: {
																			duration: 0.3,
																			ease: "easeInOut",
																		},
																		opacity: { duration: 0.2 },
																		scale: { duration: 0.2 },
																	}}
																>
																	<SortableWord
																		word={word}
																		isCompleted={isCompleted}
																		isCorrectPosition={isCorrectPosition}
																		isWrongPosition={isWrongPosition}
																		onClick={() => removeWordFromAnswer(wordId)}
																	/>
																</motion.div>
															);
														})}
													</AnimatePresence>
												</SortableContext>

												{userAnswer.length === 0 && (
													<div className="text-gray-400 italic text-center w-full py-6">
														{isMobile
															? "Tap words below to build your sentence"
															: "Drag words here to build your sentence"}
													</div>
												)}
											</div>
										</DroppableAnswerArea>

										{userAnswer.length > 0 && (
											<div className="mt-2 text-sm text-gray-600">
												Accuracy: {Math.round(getAccuracy())}%
											</div>
										)}
									</div>

									<div className="mb-4">
										<Tooltip
											content={
												isMobile
													? "Tap words to add them to your sentence"
													: "Drag words to the answer area above or click to select"
											}
											position="bottom"
										>
											<label className="block text-sm font-medium text-gray-700 mb-2 cursor-help">
												Available Words:
											</label>
										</Tooltip>
										<div className="flex flex-wrap gap-2">
											<AnimatePresence mode="popLayout">
												{availableWords.map((word) => (
													<Tooltip
														key={word.id}
														content={`${
															word.type.charAt(0).toUpperCase() +
															word.type.slice(1)
														} - "${word.text}"`}
														position="top"
													>
														<motion.div
															layout
															layoutId={`word-${word.id}`}
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															exit={{ opacity: 0, scale: 0.8 }}
															whileHover={!isMobile ? { scale: 1.05 } : {}}
															whileTap={isMobile ? { scale: 0.95 } : {}}
															transition={{
																layout: { duration: 0.3, ease: "easeInOut" },
																opacity: { duration: 0.2 },
																scale: { duration: 0.2 },
															}}
														>
															<DraggableWord
																word={word}
																isInAnswer={false}
																isCompleted={isCompleted}
																onClick={() => handleWordClick(word)}
															/>
														</motion.div>
													</Tooltip>
												))}
											</AnimatePresence>
										</div>
									</div>
								</LayoutGroup>

								<div className="flex gap-3">
									<Tooltip
										content={
											userAnswer.length !== currentExercise.correctOrder.length
												? `Add ${
														currentExercise.correctOrder.length -
														userAnswer.length
												  } more word${
														currentExercise.correctOrder.length -
															userAnswer.length !==
														1
															? "s"
															: ""
												  } to check your answer`
												: isCompleted
												? "Exercise completed! Well done!"
												: "Click to check if your sentence is correct"
										}
										position="top"
									>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={checkAnswer}
											disabled={
												userAnswer.length !==
													currentExercise.correctOrder.length ||
												isCompleted ||
												isProcessing
											}
											className={`
    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
    ${
			userAnswer.length === currentExercise.correctOrder.length &&
			!isCompleted &&
			!isProcessing
				? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
				: "bg-gray-200 text-gray-500 cursor-not-allowed"
		}
  `}
										>
											<IconWrapper
												className={`drop-shadow-sm ${
													userAnswer.length ===
														currentExercise.correctOrder.length && !isCompleted
														? "text-white"
														: "text-gray-500"
												}`}
												size={18}
											>
												<FaCheck />
											</IconWrapper>
											Check Answer
										</motion.button>
									</Tooltip>

									{isCompleted && (
										<Tooltip
											content="Move to the next available exercise"
											position="top"
										>
											<motion.button
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onClick={nextExercise}
												className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
											>
												<IconWrapper
													className="text-white drop-shadow-sm"
													size={18}
												>
													<FaArrowRight />
												</IconWrapper>
												Next Exercise
											</motion.button>
										</Tooltip>
									)}
								</div>

								<AnimatePresence>
									{isCompleted && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
										>
											<div className="flex items-center gap-2 text-green-800">
												<IconWrapper
													className="text-green-700 drop-shadow-sm"
													size={20}
												>
													<FaCheck />
												</IconWrapper>
												<span className="font-medium">Excellent work!</span>
											</div>
											<div className="text-sm text-green-700 mt-1">
												You completed this exercise in {attempts} attempt
												{attempts !== 1 ? "s" : ""}!
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								<AnimatePresence>
									{showWrongFeedback && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
										>
											<div className="flex items-center gap-2 text-red-800">
												<IconWrapper
													className="text-red-700 drop-shadow-sm"
													size={20}
												>
													<FaTimes />
												</IconWrapper>
												<span className="font-medium">Not quite right!</span>
											</div>
											<div className="text-sm text-red-700 mt-1">
												{attempts === 1
													? "Don't worry, try rearranging the words. Look at the hint if you need help!"
													: attempts < 3
													? "Keep trying! Pay attention to the word order and sentence structure."
													: "Having trouble? Try using the hint or reset the exercise to try again."}
											</div>
											<div className="text-xs text-red-600 mt-2">
												Attempt {attempts} - Current accuracy:{" "}
												{Math.round(getAccuracy())}%
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-white rounded-2xl shadow-lg p-6"
							>
								<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
									<div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm">
										<IconWrapper
											className="text-white drop-shadow-md"
											size={16}
										>
											<FaEdit />
										</IconWrapper>
									</div>
									Word Types Reference
								</h3>
								<div className="flex flex-wrap">
									{Object.entries(WORD_TYPE_COLORS).map(([type, classes]) => (
										<div
											key={type}
											className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
										>
											<div
												className={`w-4 h-4 rounded-full border-2 ${classes} flex-shrink-0`}
											/>
											<span className="text-sm capitalize text-gray-700 font-medium">
												{type.replace("_", " ")}
											</span>
										</div>
									))}
								</div>
							</motion.div>

							{practiceHistory.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-white rounded-2xl shadow-lg p-6"
								>
									<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
										<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
											<IconWrapper
												className="text-white drop-shadow-md"
												size={16}
											>
												<FaDatabase />
											</IconWrapper>
										</div>
										Recent Practice History
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{practiceHistory
											.slice(-6)
											.reverse()
											.map((record, index) => {
												const exercise = exercises.find(
													(ex) => ex.id === record.exerciseId
												);
												return (
													<motion.div
														key={`${record.exerciseId}-${record.completedAt}`}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.1 }}
														className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all"
													>
														<div className="flex justify-between items-start mb-2">
															<div className="flex-1">
																<div className="text-sm font-medium text-gray-800 mb-1">
																	{exercise?.category ||
																		`Exercise ${record.exerciseId}`}
																</div>
																<div className="text-xs text-gray-500">
																	{new Date(
																		record.completedAt
																	).toLocaleDateString()}
																</div>
															</div>
															<div
																className={`text-lg font-bold ${
																	record.accuracy >= 0.8
																		? "text-green-600"
																		: record.accuracy >= 0.6
																		? "text-yellow-600"
																		: "text-red-600"
																}`}
															>
																{Math.round(record.accuracy * 100)}%
															</div>
														</div>
														<div className="flex justify-between items-center">
															<span
																className={`px-2 py-1 rounded text-xs font-medium ${
																	exercise?.difficulty === 1
																		? "bg-green-100 text-green-700"
																		: exercise?.difficulty === 2
																		? "bg-yellow-100 text-yellow-700"
																		: "bg-red-100 text-red-700"
																}`}
															>
																Level {exercise?.difficulty || "?"}
															</span>
															<div className="text-xs text-gray-500 flex items-center gap-2">
																{record.attempts === 1 && (
																	<span className="text-green-500 font-medium">
																		First Try
																	</span>
																)}
																<span>
																	{record.attempts} attempt
																	{record.attempts !== 1 ? "s" : ""}
																</span>
															</div>
														</div>
													</motion.div>
												);
											})}
									</div>
								</motion.div>
							)}
						</div>
					</div>
					<footer className="mt-8 bg-white rounded-2xl shadow-lg p-6">
						<div className="max-w-7xl mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
								<div className="md:col-span-1">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
											<IconWrapper className="text-white" size={20}>
												<FaGraduationCap />
											</IconWrapper>
										</div>
										<h3 className="text-lg font-bold text-gray-800">
											Grammar Master
										</h3>
									</div>
									<p className="text-sm text-gray-600 mb-4">
										An interactive platform designed to help you master English
										grammar through engaging sentence-building exercises.
									</p>
									<div className="flex space-x-4">
										<a
											href="#"
											className="text-gray-500 hover:text-indigo-600 transition-colors"
										>
											<IconWrapper size={18}>
												<FaRegEnvelope />
											</IconWrapper>
										</a>
										<a
											href="#"
											className="text-gray-500 hover:text-indigo-600 transition-colors"
										>
											<IconWrapper size={18}>
												<FaExternalLinkAlt />
											</IconWrapper>
										</a>
										<a
											href="#"
											className="text-gray-500 hover:text-indigo-600 transition-colors"
										>
											<IconWrapper size={18}>
												<FaCodeBranch />
											</IconWrapper>
										</a>
									</div>
								</div>

								<div className="md:col-span-1">
									<h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
										Resources
									</h4>
									<ul className="space-y-2">
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Grammar Guide
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Exercise Library
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Word Type Reference
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Progress Tracking
											</a>
										</li>
									</ul>
								</div>

								<div className="md:col-span-1">
									<h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
										Support
									</h4>
									<ul className="space-y-2">
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Help Center
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Contact Us
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Feedback
											</a>
										</li>
										<li>
											<a
												href="#"
												className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
											>
												Community Forum
											</a>
										</li>
									</ul>
								</div>

								{}
								<div className="md:col-span-1">
									<h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
										Stay Updated
									</h4>
									<p className="text-sm text-gray-600 mb-4">
										Subscribe to our newsletter for the latest grammar tips and
										learning resources.
									</p>

									<form onSubmit={handleNewsletterSubmit} className="space-y-3">
										<div className="flex flex-col sm:flex-row gap-2">
											<div className="flex-1">
												<input
													type="email"
													placeholder="Enter your email"
													value={newsletter.email}
													onChange={handleNewsletterEmailChange}
													onBlur={handleNewsletterEmailBlur}
													disabled={newsletter.isLoading}
													className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm
            ${
							newsletter.error && newsletter.touched
								? "border-red-500 focus:ring-red-500 bg-red-50"
								: newsletter.success
								? "border-green-500 focus:ring-green-500 bg-green-50"
								: "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
						}
            ${newsletter.isLoading ? "opacity-50 cursor-not-allowed" : ""}
          `}
												/>

												<AnimatePresence>
													{newsletter.error && newsletter.touched && (
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															className="mt-1"
														>
															<p className="text-xs text-red-600 flex items-center gap-1">
																<IconWrapper className="text-red-500" size={12}>
																	<FaTimes />
																</IconWrapper>
																{newsletter.error}
															</p>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										</div>
										<motion.button
											type="submit"
											disabled={
												newsletter.isLoading ||
												(newsletter.touched && !!newsletter.error)
											}
											whileHover={
												!newsletter.isLoading && !newsletter.error
													? { scale: 1.02 }
													: {}
											}
											whileTap={
												!newsletter.isLoading && !newsletter.error
													? { scale: 0.98 }
													: {}
											}
											className={`
          px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2 min-w-[100px]
          ${
						newsletter.isLoading
							? "bg-gray-400 text-white cursor-not-allowed"
							: newsletter.error && newsletter.touched
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-indigo-600 text-white hover:bg-indigo-700"
					}
        `}
										>
											{newsletter.isLoading ? (
												<>
													<motion.div
														animate={{ rotate: 360 }}
														transition={{
															duration: 1,
															repeat: Infinity,
															ease: "linear",
														}}
														className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
													/>
													Subscribing...
												</>
											) : (
												<>
													<IconWrapper className="text-white" size={14}>
														<FaRegEnvelope />
													</IconWrapper>
													Subscribe
												</>
											)}
										</motion.button>
										<AnimatePresence>
											{newsletter.success && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="p-3 bg-green-50 border border-green-200 rounded-lg"
												>
													<p className="text-sm text-green-800 flex items-center gap-2">
														<IconWrapper className="text-green-600" size={16}>
															<FaCheck />
														</IconWrapper>
														<span className="font-medium">Success!</span>
														You've been subscribed to our newsletter.
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</form>
								</div>
							</div>

							<div className="border-t border-gray-200 mt-8 pt-6">
								<div className="flex flex-col md:flex-row justify-between items-center">
									<p className="text-sm text-gray-600 mb-4 md:mb-0">
										© {new Date().getFullYear()} Grammar Master. Exercise
										easily.
									</p>
									<div className="flex items-center space-x-6">
										<a
											href="#"
											className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
										>
											Privacy Policy
										</a>
										<a
											href="#"
											className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
										>
											Terms of Service
										</a>
										<a
											href="#"
											className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
										>
											Cookie Policy
										</a>
									</div>
								</div>
							</div>
						</div>
					</footer>
				</div>

				<DragOverlay dropAnimation={null}>
					{activeWord ? (
						<div className="transform rotate-3 shadow-lg scale-105">
							<div
								className={`
              px-3 py-2 rounded-lg border-2 cursor-grabbing transition-all relative select-none
              ${WORD_TYPE_COLORS[activeWord.type]}
              shadow-xl opacity-95
            `}
							>
								<span className="text-sm font-medium">{activeWord.text}</span>
							</div>
						</div>
					) : null}
				</DragOverlay>
			</div>
		</DndContext>
	);
};

export default LanguageLearningPlatform;
