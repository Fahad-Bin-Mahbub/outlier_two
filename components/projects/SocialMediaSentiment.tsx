"use client";

import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import { BiFilterAlt } from "react-icons/bi";
import ReactDOM from "react-dom";

interface Comment {
	id: string;
	text: string;
	timestamp: Date;
	sentiment: "positive" | "neutral" | "negative";
	reactions: string[];
	user: string;
}

interface Topic {
	text: string;
	value: number;
}

interface SentimentDistribution {
	positive: number;
	neutral: number;
	negative: number;
	total: number;
}

const MOCK_USERS = [
	"UserAlpha",
	"BetaTester",
	"CommenterGamma",
	"TechGuru",
	"SocialStar",
	"NewsBot",
	"RandomUser123",
];
const MOCK_COMMENTS_POSITIVE = [
	"This is absolutely amazing! Love it ❤️",
	"Great work, very insightful and helpful 👍",
	"Fantastic feature, so useful for my workflow!",
	"Absolutely brilliant, exceeded my expectations.",
	"I'm so happy with this product, it's a game changer.",
	"Highly recommend this to everyone. Wonderful!",
	"Excellent! The new update is fantastic. 🎉",
];
const MOCK_COMMENTS_NEGATIVE = [
	"This is terrible, I really hate it 😠",
	"Doesn't work as expected, very buggy.",
	"Very disappointing experience, needs a lot of fixes.",
	"I'm frustrated with this, it's unusable.",
	"Needs a lot of improvement, not worth the time.",
	"The worst app I've used this year. 👎",
	"Crashed multiple times. Unreliable.",
];
const MOCK_COMMENTS_NEUTRAL = [
	"Interesting perspective on the matter.",
	"Okay, I see the point being made here.",
	"This is a standard feature, nothing new.",
	"Not bad, not great either. It's average.",
	"The update is now live for all users.",
	"I'll need more time to evaluate this properly.",
	"The documentation could be clearer.",
];
const ALL_MOCK_COMMENTS = [
	...MOCK_COMMENTS_POSITIVE,
	...MOCK_COMMENTS_NEGATIVE,
	...MOCK_COMMENTS_NEUTRAL,
];
const AVAILABLE_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😠", "🎉"];

let commentIdCounter = 0;

const TRENDING_WORDS_POOL = [
	"amazing",
	"fantastic",
	"terrible",
	"awesome",
	"love",
	"hate",
	"great",
	"bad",
	"excellent",
	"horrible",
	"update",
	"feature",
	"bug",
	"fix",
	"issue",
	"problem",
	"solution",
	"improvement",
	"enhancement",
	"fast",
	"slow",
	"easy",
	"difficult",
	"simple",
	"complex",
	"useful",
	"useless",
	"helpful",
	"confusing",
	"design",
	"interface",
	"experience",
	"workflow",
	"performance",
	"speed",
	"quality",
	"reliability",
	"mobile",
	"desktop",
	"app",
	"website",
	"platform",
	"service",
	"product",
	"tool",
	"software",
	"recommend",
	"suggest",
	"avoid",
	"try",
	"test",
	"demo",
	"review",
	"feedback",
	"opinion",
	"thoughts",
];

const generateMockComment = (): Comment => {
	const shouldUseTrendingWords = Math.random() > 0.3;
	let randomText;

	if (shouldUseTrendingWords) {
		const baseText =
			ALL_MOCK_COMMENTS[Math.floor(Math.random() * ALL_MOCK_COMMENTS.length)];
		const trendingWord =
			TRENDING_WORDS_POOL[
				Math.floor(Math.random() * TRENDING_WORDS_POOL.length)
			];
		const variations = [
			`${baseText} The ${trendingWord} is remarkable.`,
			`This ${trendingWord} feature ${baseText.toLowerCase()}`,
			`${baseText} Really ${trendingWord} overall.`,
			`The new ${trendingWord} update: ${baseText.toLowerCase()}`,
			`${trendingWord} experience! ${baseText}`,
		];
		randomText = variations[Math.floor(Math.random() * variations.length)];
	} else {
		randomText =
			ALL_MOCK_COMMENTS[Math.floor(Math.random() * ALL_MOCK_COMMENTS.length)];
	}

	let sentiment: "positive" | "neutral" | "negative";
	if (
		MOCK_COMMENTS_POSITIVE.some((comment) => randomText.includes(comment)) ||
		randomText.includes("amazing") ||
		randomText.includes("fantastic") ||
		randomText.includes("love") ||
		randomText.includes("great") ||
		randomText.includes("excellent") ||
		randomText.includes("awesome")
	) {
		sentiment = "positive";
	} else if (
		MOCK_COMMENTS_NEGATIVE.some((comment) => randomText.includes(comment)) ||
		randomText.includes("terrible") ||
		randomText.includes("hate") ||
		randomText.includes("bad") ||
		randomText.includes("horrible") ||
		randomText.includes("awful")
	) {
		sentiment = "negative";
	} else {
		sentiment = "neutral";
	}

	const numReactions = Math.floor(Math.random() * 5);
	const reactions: string[] = [];
	const shuffledReactions = [...AVAILABLE_REACTIONS].sort(
		() => 0.5 - Math.random()
	);
	for (let i = 0; i < numReactions; i++) {
		reactions.push(shuffledReactions[i]);
	}

	return {
		id: `comment-${commentIdCounter++}`,
		text: randomText,
		timestamp: new Date(
			Date.now() -
				Math.floor(Math.random() * Math.random() * 1000 * 60 * 60 * 24 * 7)
		),
		sentiment,
		reactions,
		user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
	};
};

const formatDateForInput = (date: Date): string => {
	if (isNaN(date.getTime())) {
		date = new Date();
	}
	const pad = (num: number) => num.toString().padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate()
	)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseDateFromInput = (dateString: string): Date => {
	const parsedDate = new Date(dateString);
	return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

interface TimeRangeSelectorProps {
	startTime: Date;
	endTime: Date;
	onStartTimeChange: (date: Date) => void;
	onEndTimeChange: (date: Date) => void;
	theme: "light" | "dark";
	palette: any;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
	startTime,
	endTime,
	onStartTimeChange,
	onEndTimeChange,
	theme,
	palette,
}) => {
	const [selectedPreset, setSelectedPreset] = useState<string>("7d");

	const presets = [
		{ key: "hour", label: "Last hour", hours: 1 },
		{ key: "24h", label: "Last 24 hours", hours: 24 },
		{ key: "7d", label: "Last 7 days", hours: 24 * 7 },
		{ key: "custom", label: "Custom", hours: 0 },
	];

	const handlePresetChange = (preset: (typeof presets)[0]) => {
		setSelectedPreset(preset.key);
		if (preset.key !== "custom") {
			const now = new Date();
			const start = new Date(now.getTime() - preset.hours * 60 * 60 * 1000);
			onStartTimeChange(start);
			onEndTimeChange(now);
		}
	};

	const handleCustomStartChange = (dateString: string) => {
		const newDate = parseDateFromInput(dateString);
		onStartTimeChange(newDate);
	};

	const handleCustomEndChange = (dateString: string) => {
		const newDate = parseDateFromInput(dateString);
		onEndTimeChange(newDate);
	};

	return (
		<div
			className="time-range-controls"
			style={{
				display: "flex",
				gap: "1rem",
				alignItems: "center",
				flexWrap: "wrap",
			}}
		>
			<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
				{presets.map((preset) => (
					<button
						key={preset.key}
						onClick={() => handlePresetChange(preset)}
						style={{
							padding: "0.4rem 0.8rem",
							fontSize: "0.85rem",
							borderWidth: selectedPreset === preset.key ? "2px" : "1px",
							borderStyle: "solid",
							borderColor:
								selectedPreset === preset.key ? palette.accent : palette.border,
							backgroundColor:
								selectedPreset === preset.key ? "#3b82f6" : palette.emojiBtn,
							color: selectedPreset === preset.key ? "white" : palette.text,
							cursor: "pointer",
							borderRadius: "6px",
							transition: "all 0.2s ease",
							fontWeight: selectedPreset === preset.key ? 600 : 400,
						}}
					>
						{preset.label}
					</button>
				))}
			</div>

			{selectedPreset === "custom" && (
				<div
					style={{
						display: "flex",
						gap: "0.8rem",
						alignItems: "center",
						flexWrap: "wrap",
					}}
				>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
					>
						<label
							style={{
								fontSize: "0.8rem",
								color: palette.text,
								fontWeight: 500,
							}}
						>
							Start Date
						</label>
						<input
							type="datetime-local"
							value={formatDateForInput(startTime)}
							onChange={(e) => handleCustomStartChange(e.target.value)}
							style={{
								padding: "0.4rem 0.6rem",
								fontSize: "0.85rem",
								borderRadius: "4px",
								border: `1px solid ${palette.border}`,
								backgroundColor: theme === "dark" ? "#232936" : "white",
								color: palette.text,
								width: "100%",
							}}
						/>
					</div>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
					>
						<label
							style={{
								fontSize: "0.8rem",
								color: palette.text,
								fontWeight: 500,
							}}
						>
							End Date
						</label>
						<input
							type="datetime-local"
							value={formatDateForInput(endTime)}
							onChange={(e) => handleCustomEndChange(e.target.value)}
							style={{
								padding: "0.4rem 0.6rem",
								fontSize: "0.85rem",
								borderRadius: "4px",
								border: `1px solid ${palette.border}`,
								backgroundColor: theme === "dark" ? "#232936" : "white",
								color: palette.text,
								width: "100%",
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

interface ExportSelectorProps {
	onExport: (type: "full" | "filtered" | "summary") => void;
	theme: "light" | "dark";
	palette: any;
}

const ExportSelector: React.FC<ExportSelectorProps> = ({
	onExport,
	theme,
	palette,
}) => {
	const [selectedType, setSelectedType] = useState<
		"full" | "filtered" | "summary"
	>("filtered");
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const exportTypes = [
		{
			key: "full" as const,
			label: "Full Dataset",
			desc: "All comments in time range",
		},
		{
			key: "filtered" as const,
			label: "Filtered Comments",
			desc: "Only comments matching filters",
		},
		{
			key: "summary" as const,
			label: "Sentiment Summary",
			desc: "Aggregated sentiment data",
		},
	];

	const handleExport = () => {
		console.log("Exporting with type:", selectedType);
		onExport(selectedType);
		setIsOpen(false);
	};

	const handleTypeSelect = (type: "full" | "filtered" | "summary") => {
		console.log("Selected export type:", type);
		setSelectedType(type);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={dropdownRef} style={{ position: "relative" }}>
			<div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
				<button
					onClick={handleExport}
					style={{
						padding: "10px 14px",
						backgroundColor: palette.accent,
						color: "white",
						border: "none",
						borderRadius: "8px 0 0 8px",
						cursor: "pointer",
						fontSize: "0.85rem",
						fontWeight: 600,
						transition: "all 0.2s ease",
						display: "flex",
						alignItems: "center",
						gap: "6px",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						height: "40px",
						minHeight: "40px",
						borderRight: `1px solid ${
							theme === "dark" ? "#1e40af" : "#2563eb"
						}`,
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor =
							theme === "dark" ? "#2563eb" : "#2563eb";
						e.currentTarget.style.transform = "translateY(-1px)";
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = palette.accent;
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
					}}
				>
					<span>📊</span>
					Export
				</button>
				<button
					onClick={() => setIsOpen(!isOpen)}
					style={{
						padding: "0 12px",
						backgroundColor: palette.accent,
						color: "white",
						border: "none",
						borderRadius: "0 8px 8px 0",
						cursor: "pointer",
						fontSize: "0.75rem",
						transition: "all 0.2s ease",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "40px",
						minHeight: "40px",
						width: "40px",
						minWidth: "40px",
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor =
							theme === "dark" ? "#2563eb" : "#2563eb";
						e.currentTarget.style.transform = "translateY(-1px)";
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = palette.accent;
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
					}}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="6,9 12,15 18,9"></polyline>
					</svg>
				</button>
			</div>

			{isOpen && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						right: 0,
						marginTop: "4px",
						backgroundColor: palette.card,
						border: `1px solid ${palette.border}`,
						borderRadius: "6px",
						boxShadow: palette.shadow,
						zIndex: 10,
						minWidth: "220px",
					}}
				>
					{exportTypes.map((type) => (
						<div
							key={type.key}
							onClick={() => handleTypeSelect(type.key)}
							style={{
								padding: "10px 12px",
								cursor: "pointer",
								backgroundColor:
									selectedType === type.key
										? theme === "dark"
											? "#374151"
											: palette.emojiBtnActive
										: "transparent",
								borderRadius: "6px",
								margin: "4px",
								transition: "background-color 0.2s ease",
							}}
						>
							<div
								style={{ display: "flex", alignItems: "center", gap: "8px" }}
							>
								<div
									style={{
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										border: `2px solid ${
											selectedType === type.key
												? palette.accent
												: palette.border
										}`,
										backgroundColor:
											selectedType === type.key
												? palette.accent
												: "transparent",
									}}
								/>
								<div>
									<div
										style={{
											fontSize: "0.9rem",
											fontWeight: 500,
											color: palette.text,
										}}
									>
										{type.label}
									</div>
									<div style={{ fontSize: "0.75rem", color: palette.subtext }}>
										{type.desc}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

interface PrivacyBadgeProps {
	theme: "light" | "dark";
	palette: any;
}

const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ theme, palette }) => (
	<div
		style={{
			display: "inline-flex",
			alignItems: "center",
			gap: "4px",
			padding: "4px 8px",
			backgroundColor: theme === "dark" ? "#1e2329" : "#f8f9fa",
			border: `1px solid ${palette.border}`,
			borderRadius: "12px",
			fontSize: "0.75rem",
			color: palette.subtext,
			fontWeight: 500,
		}}
	>
		<span style={{ fontSize: "0.7rem" }}>🔒</span>
		Client-side rendered
	</div>
);

interface WordCloudDisplayProps {
	comments: Comment[];
	theme: "light" | "dark";
	palette: any;
}

const WordCloudDisplay: React.FC<WordCloudDisplayProps> = ({
	comments,
	theme,
	palette,
}) => {
	const [prevTopics, setPrevTopics] = useState<{ [word: string]: number }>({});
	const [animatingWords, setAnimatingWords] = useState<Set<string>>(new Set());

	const [isLiveMode, setIsLiveMode] = useState(true);
	const [liveUpdateCount, setLiveUpdateCount] = useState(0);
	const [fadingTopics, setFadingTopics] = useState<{ [word: string]: number }>(
		{}
	);
	const [newTopics, setNewTopics] = useState<Set<string>>(new Set());
	const [topicLifecycle, setTopicLifecycle] = useState<{
		[word: string]: "new" | "existing" | "fading";
	}>({});

	const topics = useMemo(() => {
		const wordCounts: Record<
			string,
			{
				count: number;
				sentiments: { positive: number; negative: number; neutral: number };
			}
		> = {};
		const stopWords = new Set([
			"a",
			"an",
			"the",
			"is",
			"are",
			"was",
			"were",
			"be",
			"been",
			"being",
			"i",
			"me",
			"my",
			"you",
			"your",
			"he",
			"him",
			"his",
			"she",
			"her",
			"it",
			"its",
			"we",
			"us",
			"our",
			"they",
			"them",
			"their",
			"this",
			"that",
			"to",
			"of",
			"in",
			"on",
			"for",
			"with",
			"s",
			"t",
			"not",
		]);

		const relevantComments = comments;

		relevantComments.forEach((comment) => {
			const words = comment.text
				.toLowerCase()
				.replace(/[^ -\w\s']|_/g, "")
				.replace(/\s+/g, " ")
				.split(/\s+/);
			words.forEach((word) => {
				if (word.length > 2 && !stopWords.has(word) && isNaN(Number(word))) {
					if (!wordCounts[word]) {
						wordCounts[word] = {
							count: 0,
							sentiments: { positive: 0, negative: 0, neutral: 0 },
						};
					}
					wordCounts[word].count++;
					wordCounts[word].sentiments[comment.sentiment]++;
				}
			});
		});

		return Object.entries(wordCounts)
			.map(([text, data]) => {
				const sentiments = data.sentiments;
				let dominantSentiment: "positive" | "negative" | "neutral" = "neutral";
				if (
					sentiments.positive > sentiments.negative &&
					sentiments.positive > sentiments.neutral
				) {
					dominantSentiment = "positive";
				} else if (
					sentiments.negative > sentiments.positive &&
					sentiments.negative > sentiments.neutral
				) {
					dominantSentiment = "negative";
				}

				return {
					text,
					value: data.count,
					sentiment: dominantSentiment,
					sentimentStrength:
						Math.max(
							sentiments.positive,
							sentiments.negative,
							sentiments.neutral
						) / data.count,
				};
			})
			.sort((a, b) => b.value - a.value)
			.slice(0, 30);
	}, [comments]);

	const topicsSignature = useMemo(
		() => topics.map((t) => `${t.text}:${t.value}`).join(","),
		[topics]
	);

	useEffect(() => {
		if (isLiveMode) {
			const currentTopicMap: { [word: string]: number } = {};
			const newAnimatingWords = new Set<string>();
			const currentNewTopics = new Set<string>();
			const newLifecycle: { [word: string]: "new" | "existing" | "fading" } =
				{};

			topics.forEach((t) => {
				currentTopicMap[t.text] = t.value;

				if (!prevTopics[t.text]) {
					currentNewTopics.add(t.text);
					newLifecycle[t.text] = "new";
					newAnimatingWords.add(t.text);
					setLiveUpdateCount((prev) => prev + 1);
				} else if (Math.abs(prevTopics[t.text] - t.value) > 0) {
					newLifecycle[t.text] = "existing";
					newAnimatingWords.add(t.text);
				} else {
					newLifecycle[t.text] = "existing";
				}
			});

			const currentTopicTexts = new Set(topics.map((t) => t.text));
			const newFadingTopics: { [word: string]: number } = {};

			Object.keys(prevTopics).forEach((word) => {
				if (!currentTopicTexts.has(word)) {
					newFadingTopics[word] = prevTopics[word];
					newLifecycle[word] = "fading";
				}
			});

			setAnimatingWords(newAnimatingWords);
			setNewTopics(currentNewTopics);
			setFadingTopics(newFadingTopics);
			setTopicLifecycle(newLifecycle);
			setPrevTopics(currentTopicMap);

			const newTopicTimer = setTimeout(() => {
				setNewTopics(new Set());
			}, 2000);

			const animationTimer = setTimeout(() => {
				setAnimatingWords(new Set());
			}, 1000);

			const fadeTimer = setTimeout(() => {
				setFadingTopics({});
				setTopicLifecycle((prev) => {
					const updated = { ...prev };
					Object.keys(updated).forEach((key) => {
						if (updated[key] === "fading") {
							delete updated[key];
						}
					});
					return updated;
				});
			}, 3000);

			return () => {
				clearTimeout(newTopicTimer);
				clearTimeout(animationTimer);
				clearTimeout(fadeTimer);
			};
		}
	}, [topicsSignature, isLiveMode]);

	if (topics.length === 0) {
		return (
			<p
				style={{ textAlign: "center", color: palette.subtext, padding: "2rem" }}
			>
				No trending topics in selected range.
			</p>
		);
	}

	const maxFreq = Math.max(...topics.map((t) => t.value), 1);

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "1rem",
					padding: "0.5rem",
					backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
					borderRadius: "6px",
					border: `1px solid ${palette.border}`,
					flexShrink: 0,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					<div
						style={{
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							backgroundColor: "#4ade80",
							animation: "live-pulse 1.5s infinite",
							transition: "all 0.3s ease",
						}}
					/>
					<span
						style={{
							fontSize: "0.85rem",
							color: palette.sentiment.positive,
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.5px",
						}}
					>
						LIVE
					</span>
					<span
						style={{
							fontSize: "0.75rem",
							color: palette.subtext,
							marginLeft: "0.5rem",
						}}
					>
						{liveUpdateCount} updates
					</span>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "0.6rem 0.8rem",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "220px",
					flex: 1,
					marginBottom: "0.5rem",
					padding: "1rem 0.5rem",
				}}
			>
				{topics.map((topic) => {
					const baseColor = palette.sentiment[topic.sentiment];
					const lifecycle = topicLifecycle[topic.text] || "existing";
					const isAnimating = animatingWords.has(topic.text) && isLiveMode;
					const isNew = newTopics.has(topic.text);

					let opacity = 0.7 + 0.3 * topic.sentimentStrength;
					let backgroundColor = `${baseColor}10`;
					let border = `1px solid ${baseColor}30`;
					let boxShadow = isAnimating ? `0 0 15px ${baseColor}60` : "none";

					if (isNew && isLiveMode) {
						opacity = 1;
						backgroundColor = `${baseColor}25`;
						border = `2px solid ${baseColor}60`;
						boxShadow = `0 0 20px ${baseColor}80, inset 0 0 10px ${baseColor}20`;
					}

					return (
						<div
							key={topic.text}
							title={`${topic.text} (Count: ${topic.value}, Sentiment: ${
								topic.sentiment
							}) ${isNew ? "• NEW" : ""}`}
							className={
								isAnimating
									? isNew
										? "word-pop-in new-topic"
										: "word-pulse"
									: isNew
									? "new-topic"
									: ""
							}
							style={{
								display: "flex",
								flexDirection: "column",
								fontSize: "15px",
								padding: "0.3rem 0.6rem",
								color: baseColor,
								opacity: opacity,
								fontWeight: isNew
									? "800"
									: topic.value / maxFreq > 0.5
									? "700"
									: "500",
								cursor: "default",
								transition: "all 0.6s cubic-bezier(0.4,0.2,0.2,1)",
								willChange: "font-size, color, opacity",
								borderRadius: "6px",
								backgroundColor: backgroundColor,
								border: border,
								boxShadow: boxShadow,
								position: "relative",
								transform: isNew && isLiveMode ? "scale(1.05)" : "scale(1)",
							}}
						>
							{topic.text}
							{isNew && isLiveMode && (
								<span
									style={{
										position: "absolute",
										top: "-8px",
										right: "-8px",
										backgroundColor: palette.sentiment.positive,
										color: "white",
										fontSize: "0.6rem",
										padding: "2px 4px",
										borderRadius: "8px",
										fontWeight: 700,
										textTransform: "uppercase",
										letterSpacing: "0.5px",
										boxShadow: `0 2px 4px ${palette.sentiment.positive}40`,
										animation: "new-badge-glow 2s ease-in-out infinite",
									}}
								>
									NEW
								</span>
							)}
						</div>
					);
				})}

				{isLiveMode &&
					Object.entries(fadingTopics).map(([text, value]) => {
						const numValue = Number(value);
						const fontSize = Math.max(0.9, 0.9 + 2.5 * (numValue / maxFreq));
						const baseColor = palette.subtext;

						return (
							<span
								key={`fading-${text}`}
								title={`${text} (Fading out)`}
								className="word-fade-out"
								style={{
									fontSize: `${fontSize}rem`,
									padding: "0.3rem 0.6rem",
									color: baseColor,
									opacity: 0.4,
									fontWeight: "400",
									cursor: "default",
									transition: "all 1.5s ease-out",
									willChange: "opacity, transform",
									borderRadius: "6px",
									backgroundColor: `${baseColor}08`,
									border: `1px solid ${baseColor}20`,
									transform: "scale(0.95)",
									textDecoration: "line-through",
									filter: "blur(0.5px)",
								}}
							>
								{text}
							</span>
						);
					})}
			</div>
		</div>
	);
};

interface SentimentMeterDisplayProps {
	comments: Comment[];
	theme: "light" | "dark";
	palette: any;
}

const SentimentMeterDisplay: React.FC<SentimentMeterDisplayProps> = ({
	comments,
	theme,
	palette,
}) => {
	const [prevData, setPrevData] = useState<any[]>([]);
	const [animatingBars, setAnimatingBars] = useState<Set<string>>(new Set());

	const sourceData = useMemo(() => {
		if (comments.length === 0) return [];

		const sources = [
			{ name: "Power Users", pattern: /^(TechGuru|SocialStar)/ },
			{ name: "News Sources", pattern: /^(NewsBot)/ },
			{ name: "Beta Testers", pattern: /^(BetaTester|UserAlpha)/ },
			{ name: "General Users", pattern: /^(CommenterGamma|RandomUser123)/ },
		];

		return sources
			.map((source) => {
				const sourceComments = comments.filter((comment) =>
					source.pattern.test(comment.user)
				);

				if (sourceComments.length === 0) {
					return {
						name: source.name,
						positive: 0,
						negative: 0,
						neutral: 0,
						total: 0,
					};
				}

				const sentiments = {
					positive: 0,
					negative: 0,
					neutral: 0,
					total: sourceComments.length,
				};
				sourceComments.forEach((comment) => {
					sentiments[comment.sentiment]++;
				});

				return {
					name: source.name,
					positive: Math.round((sentiments.positive / sentiments.total) * 100),
					negative: Math.round((sentiments.negative / sentiments.total) * 100),
					neutral: Math.round((sentiments.neutral / sentiments.total) * 100),
					total: sentiments.total,
				};
			})
			.filter((source) => source.total > 0);
	}, [comments]);

	useEffect(() => {
		const newAnimatingBars = new Set<string>();

		sourceData.forEach((source) => {
			const prevSource = prevData.find((p) => p.name === source.name);
			if (
				!prevSource ||
				prevSource.positive !== source.positive ||
				prevSource.negative !== source.negative ||
				prevSource.neutral !== source.neutral
			) {
				newAnimatingBars.add(source.name);
			}
		});

		setAnimatingBars(newAnimatingBars);
		setPrevData(sourceData);

		const timer = setTimeout(() => {
			setAnimatingBars(new Set());
		}, 800);

		return () => clearTimeout(timer);
	}, [sourceData, prevData]);

	const [prevSentimentData, setPrevSentimentData] = useState({
		positive: 0,
		negative: 0,
		neutral: 0,
	});
	const [pieAnimating, setPieAnimating] = useState(false);

	const sentimentData = useMemo(() => {
		if (comments.length === 0) return { positive: 0, negative: 0, neutral: 0 };

		const totals = { positive: 0, negative: 0, neutral: 0 };
		comments.forEach((comment) => {
			totals[comment.sentiment]++;
		});

		const total = comments.length;
		return {
			positive: Math.round((totals.positive / total) * 100),
			negative: Math.round((totals.negative / total) * 100),
			neutral: Math.round((totals.neutral / total) * 100),
		};
	}, [comments]);

	useEffect(() => {
		if (
			prevSentimentData.positive !== sentimentData.positive ||
			prevSentimentData.negative !== sentimentData.negative ||
			prevSentimentData.neutral !== sentimentData.neutral
		) {
			setPieAnimating(true);
			const timer = setTimeout(() => setPieAnimating(false), 1000);
			setPrevSentimentData(sentimentData);
			return () => clearTimeout(timer);
		}
	}, [sentimentData, prevSentimentData]);

	if (sourceData.length === 0) {
		return (
			<p style={{ textAlign: "center", color: palette.subtext }}>
				No sentiment data in selected range.
			</p>
		);
	}

	const SentimentBar = ({
		percentage,
		color,
		isAnimating,
	}: {
		percentage: number;
		color: string;
		isAnimating?: boolean;
	}) => (
		<div
			style={{
				width: "50px",
				height: "5px",
				backgroundColor: theme === "dark" ? "#2a2e3a" : "#f1f5f9",
				borderRadius: "3px",
				overflow: "hidden",
				margin: "0 auto",
				border: `1px solid ${theme === "dark" ? "#3a4252" : "#e2e8f0"}`,
				boxShadow: isAnimating ? `0 0 8px ${color}60` : "none",
			}}
		>
			<div
				className={isAnimating ? "sentiment-bar-pulse" : ""}
				style={{
					width: `${percentage}%`,
					height: "100%",
					background: `linear-gradient(90deg, ${color}, ${color}dd)`,
					borderRadius: "2px",
					transition: "width 0.6s ease, box-shadow 0.3s ease",
				}}
			/>
		</div>
	);

	const radius = 35;
	const centerX = 60;
	const centerY = 60;

	const positiveAngle = (sentimentData.positive / 100) * 360;
	const negativeAngle = (sentimentData.negative / 100) * 360;
	const neutralAngle = (sentimentData.neutral / 100) * 360;

	const createPath = (startAngle: number, endAngle: number) => {
		const start = (startAngle * Math.PI) / 180;
		const end = (endAngle * Math.PI) / 180;

		const x1 = centerX + radius * Math.cos(start);
		const y1 = centerY + radius * Math.sin(start);
		const x2 = centerX + radius * Math.cos(end);
		const y2 = centerY + radius * Math.sin(end);

		const largeArc = endAngle - startAngle > 180 ? 1 : 0;

		return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
	};

	let currentAngle = 0;
	const segments = [
		{
			label: "Positive",
			value: sentimentData.positive,
			color: palette.sentiment.positive,
			path:
				sentimentData.positive > 0
					? createPath(currentAngle, currentAngle + positiveAngle)
					: "",
		},
	];
	currentAngle += positiveAngle;

	if (sentimentData.negative > 0) {
		segments.push({
			label: "Negative",
			value: sentimentData.negative,
			color: palette.sentiment.negative,
			path: createPath(currentAngle, currentAngle + negativeAngle),
		});
	}
	currentAngle += negativeAngle;

	if (sentimentData.neutral > 0) {
		segments.push({
			label: "Neutral",
			value: sentimentData.neutral,
			color: palette.sentiment.neutral,
			path: createPath(currentAngle, currentAngle + neutralAngle),
		});
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					marginBottom: "1rem",
					borderBottom: `1px solid ${palette.border}`,
				}}
			>
				<h5
					style={{
						margin: "0 0 0.75rem 0",
						fontSize: "0.9em",
						color: palette.text,
						fontWeight: 500,
					}}
				>
					Overall Sentiment Distribution
				</h5>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.75rem",
						flex: 0.5,
						justifyContent: "center",
						marginTop: "1rem",
						padding: "2rem 0",
					}}
				>
					{/* Pie Chart SVG */}
					<div style={{ position: "relative", display: "inline-block" }}>
						<svg
							width="120"
							height="120"
							style={{
								overflow: "visible",
								transform: pieAnimating ? "scale(1.05)" : "scale(1)",
								transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
								marginLeft: "30px",
							}}
							className="pie-chart-container"
						>
							{/* Background circle for glow effect */}
							<circle
								cx={centerX}
								cy={centerY}
								r={radius + 5}
								fill="none"
								stroke={
									theme === "dark"
										? "rgba(255,255,255,0.1)"
										: "rgba(0,0,0,0.05)"
								}
								strokeWidth="1"
								className="pie-background-glow"
							/>

							{/* Animated segments */}
							{segments.map(
								(segment, index) =>
									segment.path && (
										<g key={index}>
											{/* Shadow layer */}
											<path
												d={segment.path}
												fill={segment.color}
												opacity="0.3"
												transform="translate(2, 2)"
												className="pie-segment-shadow"
											/>

											{/* Main segment */}
											<path
												d={segment.path}
												fill={segment.color}
												stroke={palette.card}
												strokeWidth="3"
												style={{
													cursor: "pointer",
													transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
													filter: pieAnimating
														? `drop-shadow(0 6px 12px ${segment.color}50) drop-shadow(0 0 20px ${segment.color}30) brightness(1.1)`
														: `drop-shadow(0 4px 8px ${segment.color}30)`,
													transformOrigin: `${centerX}px ${centerY}px`,
													animation: `pie-segment-entry 1s ease-out ${
														index * 0.2
													}s both`,
												}}
												className={`pie-segment ${
													pieAnimating ? "pie-segment-pulse" : ""
												}`}
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = "scale(1.08)";
													e.currentTarget.style.filter = `drop-shadow(0 8px 16px ${segment.color}60) drop-shadow(0 0 25px ${segment.color}40) brightness(1.15)`;
													e.currentTarget.style.strokeWidth = "4";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "scale(1)";
													e.currentTarget.style.filter = `drop-shadow(0 4px 8px ${segment.color}30)`;
													e.currentTarget.style.strokeWidth = "3";
												}}
											/>

											{/* Highlight overlay for hover effect */}
											<path
												d={segment.path}
												fill="url(#pieGradient)"
												opacity="0"
												style={{
													pointerEvents: "none",
													transition: "opacity 0.3s ease",
												}}
												className="pie-segment-highlight"
											/>
										</g>
									)
							)}

							{/* Gradient definitions */}
							<defs>
								<radialGradient id="pieGradient" cx="50%" cy="50%" r="50%">
									<stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
									<stop offset="100%" stopColor="rgba(255,255,255,0)" />
								</radialGradient>

								<filter id="pieGlow">
									<feGaussianBlur stdDeviation="3" result="coloredBlur" />
									<feMerge>
										<feMergeNode in="coloredBlur" />
										<feMergeNode in="SourceGraphic" />
									</feMerge>
								</filter>
							</defs>
						</svg>

						{/* Floating percentage indicators */}
						{segments.map((segment, index) => {
							if (!segment.path || segment.value === 0) return null;

							const angle =
								index * (360 / segments.length) + 360 / segments.length / 2;
							const radian = (angle * Math.PI) / 180;
							const x = centerX + (radius + 25) * Math.cos(radian);
							const y = centerY + (radius + 25) * Math.sin(radian);

							return (
								<div
									key={`indicator-${index}`}
									style={{
										position: "absolute",
										left: `${x - 20}px`,
										top: `${y - 10}px`,
										width: "40px",
										height: "20px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: segment.color,
										marginLeft: "30px",
										color: "white",
										fontSize: "0.7rem",
										fontWeight: "700",
										borderRadius: "10px",
										boxShadow: `0 2px 8px ${segment.color}40`,
										animation: `pie-indicator-float 2s ease-in-out infinite ${
											index * 0.3
										}s`,
										zIndex: 10,
									}}
									className="pie-percentage-indicator"
								>
									{segment.value}%
								</div>
							);
						})}
					</div>

					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						{segments.map((segment, index) => (
							<div
								key={index}
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: "6px",
								}}
							>
								<div
									style={{
										width: "8px",
										height: "8px",
										backgroundColor: segment.color,
										borderRadius: "2px",
										border: `1px solid ${segment.color}60`,
									}}
								/>
								<span
									style={{
										fontSize: "0.75rem",
										color: palette.text,
										fontWeight: 500,
									}}
								>
									{segment.label}
								</span>
								<span
									style={{
										fontSize: "0.75rem",
										color: segment.color,
										fontWeight: 600,
									}}
								>
									{segment.value}%
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Sentiment by Source */}
			<h4
				style={{
					margin: "1rem 0 1rem 0",
					fontSize: "1.05em",
					color: palette.text,
					fontWeight: 500,
				}}
			>
				Sentiment by Source
			</h4>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 1fr 1fr",
					gap: "6px",
					padding: "10px 12px",
					backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
					borderRadius: "8px 8px 0 0",
					fontSize: "0.8rem",
					fontWeight: 600,
					color: palette.subtext,
					textTransform: "uppercase",
					letterSpacing: "0.3px",
					border: `1px solid ${palette.border}`,
					borderBottom: "none",
				}}
			>
				<div>Source</div>
				<div style={{ textAlign: "center" }}>Positive</div>
				<div style={{ textAlign: "center" }}>Negative</div>
				<div style={{ textAlign: "center" }}>Neutral</div>
			</div>

			{/* Data rows */}
			{sourceData.map((source, index) => {
				const isAnimating = animatingBars.has(source.name);
				return (
					<div
						key={source.name}
						className={isAnimating ? "sentiment-row-update" : ""}
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr 1fr",
							gap: "6px",
							padding: "12px",
							backgroundColor: palette.card,
							borderBottom:
								index === sourceData.length - 1
									? `1px solid ${palette.border}`
									: `1px solid ${palette.border}`,
							borderLeft: `1px solid ${palette.border}`,
							borderRight: `1px solid ${palette.border}`,
							fontSize: "0.85rem",
							alignItems: "center",
							transition: "all 0.3s ease",
						}}
					>
						<div
							style={{
								fontWeight: 500,
								color: palette.text,
								display: "flex",
								alignItems: "center",
								gap: "8px",
							}}
						>
							<span style={{ fontSize: "0.85rem" }}>{source.name}</span>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "4px",
								flexDirection: "column",
							}}
						>
							<span
								style={{
									color: palette.sentiment.positive,
									fontWeight: 600,
									fontSize: "0.85rem",
									textShadow: isAnimating
										? `0 0 8px ${palette.sentiment.positive}60`
										: "none",
									transition: "text-shadow 0.3s ease",
								}}
							>
								{source.positive}%
							</span>
							<SentimentBar
								percentage={source.positive}
								color={palette.sentiment.positive}
								isAnimating={isAnimating}
							/>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "4px",
								flexDirection: "column",
							}}
						>
							<span
								style={{
									color: palette.sentiment.negative,
									fontWeight: 600,
									fontSize: "0.8rem",
									textShadow: isAnimating
										? `0 0 8px ${palette.sentiment.negative}60`
										: "none",
									transition: "text-shadow 0.3s ease",
								}}
							>
								{source.negative}%
							</span>
							<SentimentBar
								percentage={source.negative}
								color={palette.sentiment.negative}
								isAnimating={isAnimating}
							/>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "4px",
								flexDirection: "column",
							}}
						>
							<span
								style={{
									color: palette.sentiment.neutral,
									fontWeight: 600,
									fontSize: "0.8rem",
									textShadow: isAnimating
										? `0 0 8px ${palette.sentiment.neutral}60`
										: "none",
									transition: "text-shadow 0.3s ease",
								}}
							>
								{source.neutral}%
							</span>
							<SentimentBar
								percentage={source.neutral}
								color={palette.sentiment.neutral}
								isAnimating={isAnimating}
							/>
						</div>
					</div>
				);
			})}

			<div
				style={{
					padding: "10px 12px",
					backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
					borderRadius: "0 0 8px 8px",
					border: `1px solid ${palette.border}`,
					borderTop: "none",
					fontSize: "0.8rem",
					color: palette.subtext,
					textAlign: "center",
				}}
			>
				Total Comments Analyzed: {comments.length}
			</div>
		</div>
	);
};

interface EmojiFilterProps {
	selectedEmojis: string[];
	onFilterChange: (emoji: string) => void;
	theme: "light" | "dark";
	palette: any;
}

const EmojiFilter: React.FC<EmojiFilterProps> = ({
	selectedEmojis,
	onFilterChange,
	theme,
	palette,
}) => {
	return (
		<div
			style={{
				marginBottom: "1rem",
				padding: "0.75rem",
				backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
				borderRadius: "6px",
				border: `1px solid ${palette.border}`,
			}}
		>
			<div
				style={{
					display: "flex",
					gap: "0.5rem",
					flexWrap: "wrap",
					alignItems: "center",
					marginBottom: "0.75rem",
				}}
			>
				<span
					style={{
						fontSize: "0.95rem",
						marginRight: "0.5rem",
						color: palette.text,
						fontWeight: 500,
					}}
				>
					Filter by reactions:
				</span>
				<select style={{ padding: "0.4rem 0.8rem", borderRadius: "4px" }}>
					{AVAILABLE_REACTIONS.map((emoji) => (
						<option
							key={emoji}
							onClick={() => onFilterChange(emoji)}
							title={`Filter by ${emoji}`}
							className={`emoji-hover ${
								selectedEmojis.includes(emoji) ? "selected-filter" : ""
							}`}
							style={{
								padding: "0.4rem 0.8rem",
								fontSize: "1.2rem",
								border: selectedEmojis.includes(emoji)
									? `2px solid ${palette.accent}`
									: `1px solid ${palette.border}`,
								backgroundColor: selectedEmojis.includes(emoji)
									? `${palette.accent}20`
									: palette.emojiBtn,
								cursor: "pointer",
								borderRadius: "20px",
								transition: "all 0.3s ease",
								boxShadow: selectedEmojis.includes(emoji)
									? `0 2px 8px ${palette.accent}40`
									: "0 1px 3px rgba(0,0,0,0.1)",
								transform: selectedEmojis.includes(emoji)
									? "scale(1.05)"
									: "scale(1)",
							}}
						>
							{emoji}
						</option>
					))}
				</select>
			</div>

			{selectedEmojis.length > 0 && (
				<div
					style={{
						display: "flex",
						gap: "0.5rem",
						flexWrap: "wrap",
						alignItems: "center",
						paddingTop: "0.75rem",
						borderTop: `1px solid ${palette.border}`,
					}}
				>
					<span
						style={{
							fontSize: "0.9rem",
							color: palette.subtext,
							marginRight: "0.5rem",
							fontWeight: 500,
						}}
					>
						Active filters:
					</span>
					{selectedEmojis.map((emoji) => (
						<div
							key={`chip-${emoji}`}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "0.4rem",
								padding: "0.3rem 0.6rem",
								background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent}dd)`,
								color: theme === "dark" ? "#fff" : "white",
								borderRadius: "16px",
								fontSize: "0.9rem",
								fontWeight: 500,
								boxShadow: `0 2px 6px ${palette.accent}30`,
							}}
						>
							<span>{emoji}</span>
							<button
								onClick={() => onFilterChange(emoji)}
								style={{
									background: "none",
									border: "none",
									color: theme === "dark" ? "#fff" : "white",
									cursor: "pointer",
									fontSize: "1rem",
									padding: "0",
									lineHeight: 1,
									opacity: 0.9,
									borderRadius: "50%",
									width: "16px",
									height: "16px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
								title={`Remove ${emoji} filter`}
							>
								×
							</button>
						</div>
					))}
					<button
						onClick={() =>
							selectedEmojis.forEach((emoji) => onFilterChange(emoji))
						}
						style={{
							background: "none",
							border: `1px solid ${palette.border}`,
							color: palette.subtext,
							cursor: "pointer",
							fontSize: "0.85rem",
							padding: "0.25rem 0.6rem",
							borderRadius: "12px",
							transition: "all 0.2s ease",
							fontWeight: 500,
						}}
						title="Clear all emoji filters"
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor =
								theme === "dark" ? "#3a4252" : "#f1f5f9";
							e.currentTarget.style.color = palette.text;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "transparent";
							e.currentTarget.style.color = palette.subtext;
						}}
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
};

interface SubFiltersProps {
	sortBy: "recent" | "liked" | "sentiment";
	sentimentFilter: "all" | "positive" | "neutral" | "negative";
	onSortChange: (sort: "recent" | "liked" | "sentiment") => void;
	onSentimentFilterChange: (
		sentiment: "all" | "positive" | "neutral" | "negative"
	) => void;
	theme: "light" | "dark";
	palette: any;
}

const SubFilters: React.FC<SubFiltersProps> = ({
	sortBy,
	sentimentFilter,
	onSortChange,
	onSentimentFilterChange,
	theme,
	palette,
}) => {
	return (
		<div
			style={{
				marginBottom: "1rem",
				padding: "0.75rem",
				backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
				borderRadius: "6px",
				border: `1px solid ${palette.border}`,
				boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
			}}
		>
			<div
				style={{
					display: "flex",
					gap: "2rem",
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
					<span
						style={{
							fontSize: "0.95rem",
							color: palette.text,
							fontWeight: 600,
							minWidth: "60px",
						}}
					>
						Sort by:
					</span>
					<select defaultValue={sortBy} style={{ fontSize: "0.9rem" }}>
						{[
							{ key: "recent", label: "Most Recent" },
							{ key: "liked", label: "Most Liked" },
							{ key: "sentiment", label: "By Sentiment" },
						].map((option) => (
							<>
								<option
									onClick={() => onSortChange(option.key as any)}
									value={option.key}
								>
									{option.label}
								</option>
							</>
						))}
					</select>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.8rem",
						flexWrap: "wrap",
					}}
				>
					<span
						style={{
							fontSize: "0.95rem",
							color: palette.text,
							fontWeight: 600,
							minWidth: "80px",
						}}
					>
						Sentiment:
					</span>
					<div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
						<select>
							{[
								{ key: "all", label: "All", color: palette.text },
								{
									key: "positive",
									label: "Positive",
									color: palette.sentiment.positive,
								},
								{
									key: "neutral",
									label: "Neutral",
									color: palette.sentiment.neutral,
								},
								{
									key: "negative",
									label: "Negative",
									color: palette.sentiment.negative,
								},
							].map((item) => (
								<option
									key={item.key}
									onClick={() => onSentimentFilterChange(item.key as any)}
									value={item.key}
								>
									{item.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</div>
	);
};

interface CommentItemProps {
	comment: Comment;
	theme: "light" | "dark";
	palette: any;
	isNew?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = React.memo(
	({ comment, theme, palette, isNew = false }) => {
		const sentimentColor = palette.sentiment[comment.sentiment];
		const isVeryRecent = Date.now() - comment.timestamp.getTime() < 10000;

		return (
			<div
				style={{
					borderWidth: isVeryRecent ? "1px" : "1px",
					borderStyle: "solid",
					borderColor: isVeryRecent ? palette.border : palette.border,
					padding: "0.75rem",
					marginBottom: "0.5rem",
					borderRadius: "8px",
					backgroundColor: isVeryRecent
						? theme === "dark"
							? "#1e2d1e"
							: "#f0fdf4"
						: palette.card,
					boxShadow: isVeryRecent
						? `0 4px 12px ${palette.sentiment.positive}20`
						: theme === "dark"
						? "0 2px 8px rgba(0,0,0,0.15)"
						: "0 2px 8px rgba(0,0,0,0.05)",
					borderLeft: `4px solid ${sentimentColor}`,
					transition: "all 0.3s ease",
					position: "relative",
				}}
				className={isVeryRecent ? "new-comment-highlight" : ""}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = "translateY(-1px)";
					e.currentTarget.style.boxShadow =
						theme === "dark"
							? "0 4px 12px rgba(0,0,0,0.25)"
							: "0 4px 12px rgba(0,0,0,0.1)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = "translateY(0)";
					e.currentTarget.style.boxShadow = isVeryRecent
						? `0 4px 12px ${palette.sentiment.positive}20`
						: theme === "dark"
						? "0 2px 8px rgba(0,0,0,0.15)"
						: "0 2px 8px rgba(0,0,0,0.05)";
				}}
			>
				{isVeryRecent && (
					<div
						style={{
							position: "absolute",
							top: "0.5rem",
							right: "0.5rem",
							backgroundColor: palette.sentiment.positive,
							color: "white",
							fontSize: "0.7rem",
							padding: "0.2rem 0.5rem",
							borderRadius: "10px",
							fontWeight: 600,
							animation: "new-badge-pulse 2s ease-in-out infinite",
						}}
					>
						NEW
					</div>
				)}
				<div
					style={{
						display: "flex",
						justifyContent: "flex-start",
						alignItems: "center",
						marginBottom: "0.5rem",
					}}
				>
					<span
						style={{
							fontWeight: "600",
							color: palette.accent,
							fontSize: "0.9rem",
						}}
					>
						{comment.user}
					</span>
				</div>
				<p
					style={{
						margin: "0 0 0.75rem 0",
						color: palette.text,
						fontSize: "0.95rem",
						lineHeight: "1.5",
					}}
				>
					{comment.text}
				</p>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: "0.75rem",
					}}
				>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "0.5rem",
							padding: "0.3rem 0.6rem",
							backgroundColor: `${sentimentColor}20`,
							borderRadius: "12px",
							border: `1px solid ${sentimentColor}40`,
						}}
					>
						<div
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: sentimentColor,
							}}
						/>
						<span
							style={{
								color: sentimentColor,
								fontWeight: "600",
								textTransform: "capitalize",
								fontSize: "0.85rem",
							}}
						>
							{comment.sentiment}
						</span>
					</div>
					<div
						style={{
							display: "flex",
							gap: "0.25rem",
							padding: "0.25rem",
							backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
							borderRadius: "8px",
							border: `1px solid ${palette.border}`,
						}}
					>
						{comment.reactions.map((reaction, index) => (
							<span
								key={index}
								className="emoji-pop"
								style={{
									fontSize: "1.1rem",
									padding: "0.2rem",
									borderRadius: "4px",
									transition: "transform 0.2s ease",
									display: "inline-block",
								}}
							>
								{reaction}
							</span>
						))}
					</div>
				</div>
			</div>
		);
	}
);
CommentItem.displayName = "CommentItem";

interface CommentAnalysisPanelProps {
	comments: Comment[];
	selectedEmojis: string[];
	onEmojiFilterChange: (emoji: string) => void;
	sortBy: "recent" | "liked" | "sentiment";
	sentimentFilter: "all" | "positive" | "neutral" | "negative";
	onSortChange: (sort: "recent" | "liked" | "sentiment") => void;
	onSentimentFilterChange: (
		sentiment: "all" | "positive" | "neutral" | "negative"
	) => void;
	theme: "light" | "dark";
	palette: any;
}

interface HistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	comments: Comment[];
	selectedEmojis: string[];
	sortBy: "recent" | "liked" | "sentiment";
	sentimentFilter: "all" | "positive" | "neutral" | "negative";
	theme: "light" | "dark";
	palette: any;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
	isOpen,
	onClose,
	comments,
	selectedEmojis,
	sortBy,
	sentimentFilter,
	theme,
	palette,
}) => {
	const [displayCount, setDisplayCount] = useState(50);
	const modalRef = useRef<HTMLDivElement>(null);

	const historicalComments = useMemo(() => {
		const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
		let filtered = comments.filter(
			(comment) => comment.timestamp < thirtyMinutesAgo
		);

		if (selectedEmojis.length > 0) {
			filtered = filtered.filter((comment) =>
				selectedEmojis.some((emoji) => comment.reactions.includes(emoji))
			);
		}

		if (sentimentFilter !== "all") {
			filtered = filtered.filter(
				(comment) => comment.sentiment === sentimentFilter
			);
		}

		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "recent":
					return b.timestamp.getTime() - a.timestamp.getTime();
				case "liked":
					return b.reactions.length - a.reactions.length;
				case "sentiment":
					const sentimentOrder = { positive: 2, neutral: 1, negative: 0 };
					return sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment];
				default:
					return 0;
			}
		});

		return sorted.slice(0, displayCount);
	}, [comments, selectedEmojis, sortBy, sentimentFilter, displayCount]);

	const loadMoreHistory = () => {
		setDisplayCount((prev) => prev + 50);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			const scrollY = window.scrollY;

			document.addEventListener("mousedown", handleClickOutside);

			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
			document.body.classList.add("modal-open");
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);

			if (isOpen) {
				const scrollY = document.body.style.top;
				document.body.style.position = "";
				document.body.style.top = "";
				document.body.style.width = "";
				document.body.style.overflow = "";
				document.body.classList.remove("modal-open");

				window.scrollTo(0, parseInt(scrollY || "0") * -1);
			}
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	if (typeof document === "undefined") return null;

	return ReactDOM.createPortal(
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				backgroundColor: "rgba(0, 0, 0, 0.6)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
				padding: "1rem",
				backdropFilter: "blur(4px)",
				WebkitBackdropFilter: "blur(4px)",
				transition: "opacity 0.2s",
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<div
				ref={modalRef}
				style={{
					backgroundColor: palette.card,
					borderRadius: "16px",
					maxWidth: "800px",
					width: "100%",
					maxHeight: "90vh",
					minHeight: "300px",
					display: "flex",
					flexDirection: "column",
					boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.1)",
					border: `1px solid ${palette.border}`,
					overflow: "hidden",
					position: "relative",
					animation: "modal-fade-in 0.3s ease-out",
					margin: "0 auto",
				}}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					style={{
						padding: "1.5rem",
						borderBottom: `1px solid ${palette.border}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexShrink: 0,
					}}
				>
					<div>
						<h3
							style={{
								margin: "0 0 0.5rem 0",
								color: palette.text,
								fontSize: "1.3rem",
							}}
						>
							Comment History
						</h3>
						<p
							style={{ margin: 0, color: palette.subtext, fontSize: "0.9rem" }}
						>
							Previous conversations • {historicalComments.length} comments
							found
						</p>
					</div>
					<button
						onClick={onClose}
						style={{
							background: "none",
							border: `1px solid ${palette.border}`,
							borderRadius: "8px",
							padding: "0.5rem",
							cursor: "pointer",
							color: palette.text,
							fontSize: "1.2rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "40px",
							height: "40px",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor =
								theme === "dark" ? "#3a4252" : "#f1f5f9";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "transparent";
						}}
					>
						×
					</button>
				</div>

				<div
					style={{
						flex: 1,
						overflowY: "auto",
						padding: "1rem",
						minHeight: 0,
					}}
				>
					{historicalComments.length > 0 ? (
						<>
							{historicalComments.map((comment) => (
								<CommentItem
									key={comment.id}
									comment={comment}
									theme={theme}
									palette={palette}
								/>
							))}
							{displayCount <
								comments.filter(
									(c) => new Date(Date.now() - 30 * 60 * 1000) > c.timestamp
								).length && (
								<div style={{ textAlign: "center", margin: "1rem 0" }}>
									<button
										onClick={loadMoreHistory}
										style={{
											padding: "0.6rem 1.2rem",
											fontSize: "0.9rem",
											border: `1px solid ${palette.border}`,
											backgroundColor: palette.emojiBtn,
											color: palette.text,
											cursor: "pointer",
											borderRadius: "8px",
											fontWeight: 500,
											transition: "all 0.2s ease",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor =
												theme === "dark" ? "#3a4252" : "#f1f5f9";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = palette.emojiBtn;
										}}
									>
										Load More History
									</button>
								</div>
							)}
						</>
					) : (
						<div
							style={{
								textAlign: "center",
								padding: "3rem 1rem",
								color: palette.subtext,
							}}
						>
							<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</div>
							<h4 style={{ margin: "0 0 0.5rem 0", color: palette.text }}>
								No History Found
							</h4>
							<p style={{ margin: 0 }}>
								No previous conversations match your current filters.
							</p>
						</div>
					)}
				</div>

				<div
					style={{
						padding: "1rem 1.5rem",
						borderTop: `1px solid ${palette.border}`,
						display: "flex",
						justifyContent: "flex-end",
						flexShrink: 0,
					}}
				>
					<button
						onClick={onClose}
						style={{
							padding: "0.6rem 1.2rem",
							fontSize: "0.9rem",
							border: "none",
							backgroundColor: palette.accent,
							color: "white",
							cursor: "pointer",
							borderRadius: "8px",
							fontWeight: 500,
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor =
								theme === "dark" ? "#2563eb" : "#2563eb";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = palette.accent;
						}}
					>
						Back to Live Stream
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
};

const CommentAnalysisPanel: React.FC<CommentAnalysisPanelProps> = ({
	comments,
	selectedEmojis,
	onEmojiFilterChange,
	sortBy,
	sentimentFilter,
	onSortChange,
	onSentimentFilterChange,
	theme,
	palette,
}) => {
	const [autoScroll, setAutoScroll] = useState(true);
	const [newCommentCount, setNewCommentCount] = useState(0);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const prevCommentsLength = useRef(comments.length);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (comments.length > prevCommentsLength.current) {
			const newComments = comments.length - prevCommentsLength.current;
			setNewCommentCount((prev) => prev + newComments);

			if (autoScroll && isAtBottom && scrollContainerRef.current) {
				setTimeout(() => {
					if (scrollContainerRef.current) {
						scrollContainerRef.current.scrollTop =
							scrollContainerRef.current.scrollHeight;
					}
				}, 100);
			}
		}
		prevCommentsLength.current = comments.length;
	}, [comments, autoScroll, isAtBottom]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				isFilterModalOpen
			) {
				setIsFilterModalOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isFilterModalOpen]);

	const handleScroll = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				scrollContainerRef.current;
			const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
			setIsAtBottom(isBottom);

			if (isBottom) {
				setNewCommentCount(0);
			}
		}
	}, []);

	const commentsToDisplay = useMemo(() => {
		let filtered = [...comments];

		if (selectedEmojis.length > 0) {
			filtered = filtered.filter((comment) =>
				selectedEmojis.some((emoji) => comment.reactions.includes(emoji))
			);
		}

		if (sentimentFilter !== "all") {
			filtered = filtered.filter(
				(comment) => comment.sentiment === sentimentFilter
			);
		}

		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "recent":
					return b.timestamp.getTime() - a.timestamp.getTime();
				case "liked":
					return b.reactions.length - a.reactions.length;
				case "sentiment":
					const sentimentOrder = { positive: 2, neutral: 1, negative: 0 };
					return sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment];
				default:
					return 0;
			}
		});

		return sorted;
	}, [comments, selectedEmojis, sortBy, sentimentFilter]);

	const scrollToBottom = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop =
				scrollContainerRef.current.scrollHeight;
		}
		setNewCommentCount(0);
	};

	const openHistoryModal = () => {
		setIsHistoryModalOpen(true);
	};

	const closeHistoryModal = () => {
		setIsHistoryModalOpen(false);
	};

	const recentCommentsCount = useMemo(() => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		return comments.filter((comment) => comment.timestamp > fiveMinutesAgo)
			.length;
	}, [comments]);

	const handleClearFilters = () => {
		selectedEmojis.forEach((emoji) => onEmojiFilterChange(emoji));
		onSortChange("recent");
		onSentimentFilterChange("all");
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				position: "relative",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.75rem",
					marginBottom: "0.5rem",
					padding: "0.5rem",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					<div
						style={{
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							backgroundColor: "#4ade80",
							animation: "live-pulse 1.5s infinite",
							transition: "all 0.3s ease",
						}}
					/>
					<span
						style={{
							fontSize: "0.85rem",
							color: palette.sentiment.positive,
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.5px",
						}}
					>
						LIVE STREAM
					</span>
				</div>

				<span
					style={{
						fontSize: "0.75rem",
						color: palette.subtext,
						background: theme === "dark" ? "#232936" : "#e2e8f0",
						padding: "0.2rem 0.5rem",
						borderRadius: "10px",
					}}
				>
					{recentCommentsCount} in last 5min
				</span>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1rem",
					flexShrink: 0,
				}}
			>
				<button
					onClick={() => setIsFilterModalOpen(true)}
					style={{
						padding: "0.5rem 1rem",
						backgroundColor: palette.accent,
						color: "white",
						border: "none",
						borderRadius: "6px",
						cursor: "pointer",
						fontSize: "0.9rem",
						fontWeight: 600,
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						transition: "all 0.2s ease",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor =
							theme === "dark" ? "#2563eb" : "#2563eb";
						e.currentTarget.style.transform = "translateY(-1px)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = palette.accent;
						e.currentTarget.style.transform = "translateY(0)";
					}}
				>
					<BiFilterAlt size={20} color={"#fff"} /> All Filters
				</button>
				{(selectedEmojis.length > 0 ||
					sentimentFilter !== "all" ||
					sortBy !== "recent") && (
					<button
						onClick={handleClearFilters}
						style={{
							padding: "0.5rem 1rem",
							backgroundColor: palette.sentiment.negative,
							color: "white",
							border: "none",
							borderRadius: "6px",
							cursor: "pointer",
							fontSize: "0.9rem",
							fontWeight: 600,
							transition: "all 0.2s ease",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = "#dc2626";
							e.currentTarget.style.transform = "translateY(-1px)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor =
								palette.sentiment.negative;
							e.currentTarget.style.transform = "translateY(0)";
						}}
					>
						Clear Filters
					</button>
				)}
			</div>

			{/* Custom Modal */}
			{isFilterModalOpen && (
				<>
					<div
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							zIndex: 9998,
							backdropFilter: "blur(2px)",
							transition: "opacity 0.3s ease",
							opacity: isFilterModalOpen ? 1 : 0,
						}}
						onClick={() => setIsFilterModalOpen(false)}
						role="presentation"
					/>
					<div
						ref={modalRef}
						style={{
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							backgroundColor: palette.card,
							border: `1px solid ${palette.border}`,
							borderRadius: "12px",
							padding: "1.5rem",
							width: "90%",
							maxWidth: "500px",
							maxHeight: "80vh",
							overflowY: "auto",
							boxShadow: palette.shadow,
							zIndex: 9999,
							transition: "transform 0.3s ease, opacity 0.3s ease",
							opacity: isFilterModalOpen ? 1 : 0,
							transform: isFilterModalOpen
								? "translate(-50%, -50%) scale(1)"
								: "translate(-50%, -50%) scale(0.95)",
						}}
						role="dialog"
						aria-labelledby="filter-modal-title"
						aria-modal="true"
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "1.5rem",
							}}
						>
							<h3
								id="filter-modal-title"
								style={{
									margin: 0,
									fontSize: "1.2rem",
									color: palette.text,
									fontWeight: 600,
								}}
							>
								Filter Options
							</h3>

							{/* Filter by Reactions */}
							<div>
								<h4
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "1rem",
										color: palette.text,
										fontWeight: 500,
									}}
								>
									Filter by Reactions:
								</h4>
								<div
									style={{
										display: "flex",
										gap: "0.5rem",
										flexWrap: "wrap",
										alignItems: "center",
									}}
								>
									{AVAILABLE_REACTIONS.map((emoji) => (
										<button
											key={emoji}
											onClick={() => onEmojiFilterChange(emoji)}
											title={`Filter by ${emoji}`}
											style={{
												padding: "0.4rem 0.8rem",
												fontSize: "1.2rem",
												border: selectedEmojis.includes(emoji)
													? `2px solid ${palette.accent}`
													: `1px solid ${palette.border}`,
												backgroundColor: selectedEmojis.includes(emoji)
													? `${palette.accent}20`
													: palette.emojiBtn,
												cursor: "pointer",
												borderRadius: "20px",
												transition: "all 0.3s ease",
												boxShadow: selectedEmojis.includes(emoji)
													? `0 2px 8px ${palette.accent}40`
													: "0 1px 3px rgba(0,0,0,0.1)",
												transform: selectedEmojis.includes(emoji)
													? "scale(1.05)"
													: "scale(1)",
											}}
										>
											{emoji}
										</button>
									))}
								</div>
							</div>

							{/* Sort By */}
							<div
								style={{ display: "flex", alignItems: "center", gap: "1rem" }}
							>
								<h4
									style={{
										fontSize: "1rem",
										color: palette.text,
										fontWeight: 500,
									}}
								>
									Sort By:
								</h4>
								<div
									style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
								>
									<select
										onChange={(e) =>
											onSortChange(
												e.target.value as "recent" | "liked" | "sentiment"
											)
										}
										style={{
											padding: "0.4rem 0.8rem",
											fontSize: "1rem",
											border: `1px solid ${palette.border}`,
											backgroundColor: palette.card,
											cursor: "pointer",
											borderRadius: "4px",
										}}
									>
										{[
											{ key: "recent", label: "Most Recent" },
											{ key: "liked", label: "Most Liked" },
											{ key: "sentiment", label: "Sentiment" },
										].map((sort) => (
											<option key={sort.key} value={sort.key}>
												{sort.label}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Sentiment Filter */}
							<div
								style={{ display: "flex", alignItems: "center", gap: "1rem" }}
							>
								<h4
									style={{
										margin: "0 0 0.5rem 0",
										fontSize: "1rem",
										color: palette.text,
										fontWeight: 500,
									}}
								>
									Sentiment:
								</h4>
								<div
									style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
								>
									<select
										value={sentimentFilter}
										onChange={(e) =>
											onSentimentFilterChange(
												e.target.value as
													| "all"
													| "positive"
													| "neutral"
													| "negative"
											)
										}
										style={{
											padding: "0.4rem 0.8rem",
											fontSize: "1rem",
											border: `1px solid ${palette.border}`,
											backgroundColor: palette.card,
											cursor: "pointer",
											borderRadius: "4px",
										}}
									>
										{[
											{ key: "all", label: "All" },
											{ key: "positive", label: "Positive" },
											{ key: "neutral", label: "Neutral" },
											{ key: "negative", label: "Negative" },
										].map((sentiment) => (
											<option key={sentiment.key} value={sentiment.key}>
												{sentiment.label}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Modal Actions */}
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									gap: "1rem",
									marginTop: "1rem",
								}}
							>
								<button
									onClick={() => setIsFilterModalOpen(false)}
									style={{
										padding: "0.5rem 1rem",
										backgroundColor: palette.card,
										color: palette.text,
										border: `1px solid ${palette.border}`,
										borderRadius: "6px",
										cursor: "pointer",
										fontSize: "0.9rem",
										fontWeight: 500,
										transition: "all 0.2s ease",
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor =
											palette.emojiBtnActive;
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor = palette.card;
									}}
								>
									Close
								</button>
								<button
									onClick={handleClearFilters}
									style={{
										padding: "0.5rem 1rem",
										backgroundColor: palette.sentiment.negative,
										color: "white",
										border: "none",
										borderRadius: "6px",
										cursor: "pointer",
										fontSize: "0.9rem",
										fontWeight: 500,
										transition: "all 0.2s ease",
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.backgroundColor = "#dc2626";
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.backgroundColor =
											palette.sentiment.negative;
									}}
								>
									Clear All
								</button>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Active Filters Display */}
			{(selectedEmojis.length > 0 ||
				sentimentFilter !== "all" ||
				sortBy !== "recent") && (
				<div
					style={{
						marginBottom: "1rem",
						padding: "0.75rem",
						backgroundColor: theme === "dark" ? "#1e2329" : "#f8f9fa",
						borderRadius: "6px",
						border: `1px solid ${palette.border}`,
						display: "flex",
						flexWrap: "wrap",
						gap: "0.5rem",
						alignItems: "center",
					}}
				>
					<span
						style={{
							fontSize: "0.9rem",
							color: palette.subtext,
							marginRight: "0.5rem",
							fontWeight: 500,
						}}
					>
						Active filters:
					</span>
					{selectedEmojis.map((emoji) => (
						<div
							key={`chip-${emoji}`}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "0.4rem",
								padding: "0.3rem 0.6rem",
								background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent}dd)`,
								color: theme === "dark" ? "#fff" : "white",
								borderRadius: "16px",
								fontSize: "0.9rem",
								fontWeight: 500,
								boxShadow: `0 2px 6px ${palette.accent}30`,
							}}
						>
							<span>{emoji}</span>
							<button
								onClick={() => onEmojiFilterChange(emoji)}
								style={{
									background: "none",
									border: "none",
									color: "white",
									cursor: "pointer",
									fontSize: "0.8rem",
									padding: "0 0.2rem",
									display: "flex",
									alignItems: "center",
								}}
							>
								✕
							</button>
						</div>
					))}
					{sentimentFilter !== "all" && (
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "0.4rem",
								padding: "0.3rem 0.6rem",
								background: `linear-gradient(135deg, ${palette.sentiment[sentimentFilter]}, ${palette.sentiment[sentimentFilter]}dd)`,
								color: "white",
								borderRadius: "16px",
								fontSize: "0.9rem",
								fontWeight: 500,
								boxShadow: `0 2px 6px ${palette.sentiment[sentimentFilter]}30`,
							}}
						>
							<span>
								{sentimentFilter.charAt(0).toUpperCase() +
									sentimentFilter.slice(1)}
							</span>
							<button
								onClick={() => onSentimentFilterChange("all")}
								style={{
									background: "none",
									border: "none",
									color: "white",
									cursor: "pointer",
									fontSize: "0.8rem",
									padding: "0 0.2rem",
									display: "flex",
									alignItems: "center",
								}}
							>
								✕
							</button>
						</div>
					)}
					{sortBy !== "recent" && (
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "0.4rem",
								padding: "0.3rem 0.6rem",
								background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent}dd)`,
								color: "white",
								borderRadius: "16px",
								fontSize: "0.9rem",
								fontWeight: 500,
								boxShadow: `0 2px 6px ${palette.accent}30`,
							}}
						>
							<span>{sortBy === "liked" ? "Most Liked" : "Sentiment"}</span>
							<button
								onClick={() => onSortChange("recent")}
								style={{
									background: "none",
									border: "none",
									color: "white",
									cursor: "pointer",
									fontSize: "0.8rem",
									padding: "0 0.2rem",
									display: "flex",
									alignItems: "center",
								}}
							>
								✕
							</button>
						</div>
					)}
				</div>
			)}

			{/* Live Stream Controls */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "0.75rem",
					padding: "0.5rem",
					backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
					borderRadius: "6px",
					border: `1px solid ${palette.border}`,
					flexWrap: "wrap",
					gap: "0.5rem",
					flexShrink: 0,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					<button
						onClick={openHistoryModal}
						style={{
							padding: "0.4rem 0.8rem",
							fontSize: "0.8rem",
							border: `1px solid ${palette.border}`,
							backgroundColor: palette.emojiBtn,
							color: palette.text,
							cursor: "pointer",
							borderRadius: "6px",
							fontWeight: 500,
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor =
								theme === "dark" ? "#3a4252" : "#f1f5f9";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = palette.emojiBtn;
						}}
					>
						Switch to History
					</button>

					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.4rem",
							cursor: "pointer",
						}}
					>
						<input
							type="checkbox"
							checked={autoScroll}
							onChange={(e) => setAutoScroll(e.target.checked)}
							style={{
								marginRight: "0.2rem",
								cursor: "pointer",
								accentColor: palette.accent,
							}}
						/>
						<span
							style={{
								fontSize: "0.8rem",
								color: palette.text,
								userSelect: "none",
							}}
						>
							Auto-scroll
						</span>
					</label>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "10px",
				}}
			>
				<h4 style={{ margin: 0, fontSize: "1.1em", color: palette.text }}>
					Comments ({commentsToDisplay.length} of {comments.length})
					{(selectedEmojis.length > 0 || sentimentFilter !== "all") && (
						<span
							style={{
								fontSize: "0.85rem",
								color: palette.subtext,
								fontWeight: 400,
							}}
						>
							{" "}
							• Filtered
						</span>
					)}
				</h4>

				{/* New comments indicator */}
				{newCommentCount > 0 && !isAtBottom && (
					<button
						onClick={scrollToBottom}
						style={{
							padding: "0.4rem 0.8rem",
							fontSize: "0.8rem",
							background: `linear-gradient(135deg, ${palette.sentiment.positive}, ${palette.sentiment.positive}dd)`,
							color: "white",
							border: "none",
							borderRadius: "20px",
							cursor: "pointer",
							fontWeight: 600,
							boxShadow: `0 2px 8px ${palette.sentiment.positive}40`,
							animation: "new-comments-pulse 2s infinite",
							display: "flex",
							alignItems: "center",
							gap: "0.3rem",
						}}
					>
						↓ {newCommentCount} new
					</button>
				)}
			</div>

			<HistoryModal
				isOpen={isHistoryModalOpen}
				onClose={closeHistoryModal}
				comments={comments}
				selectedEmojis={selectedEmojis}
				sortBy={sortBy}
				sentimentFilter={sentimentFilter}
				theme={theme}
				palette={palette}
			/>

			{/* Comments List */}
			<div
				ref={scrollContainerRef}
				onScroll={handleScroll}
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					flex: 1,
					overflowY: "auto",
					padding: "0.5rem",
					maxHeight: "400px",
					WebkitOverflowScrolling: "touch",
				}}
			>
				{commentsToDisplay.length === 0 ? (
					<p
						style={{
							textAlign: "center",
							color: palette.subtext,
							padding: "2rem",
						}}
					>
						No comments match the selected filters.
					</p>
				) : (
					commentsToDisplay.map((comment, index) => (
						<div
							key={comment.id}
							className={index < 3 ? "new-comments-pulse" : ""}
							style={{
								padding: "1rem",
								marginBottom: "0.75rem",
								backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
								border: `1px solid ${palette.border}`,
								borderRadius: "8px",
								boxShadow: palette.shadow,
								position: "relative",
								transition: "all 0.3s ease",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "0.5rem",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
									}}
								>
									<span
										style={{
											fontWeight: 600,
											color: palette.text,
											fontSize: "0.9rem",
										}}
									>
										{comment.user}
									</span>
									<span
										style={{
											fontSize: "0.75rem",
											color: palette.subtext,
										}}
									>
										{comment.timestamp.toLocaleString()}
									</span>
								</div>
								<span
									style={{
										fontSize: "0.8rem",
										fontWeight: 500,
										color: palette.sentiment[comment.sentiment],
										textTransform: "capitalize",
									}}
								>
									{comment.sentiment}
								</span>
							</div>
							<p
								style={{
									margin: "0.5rem 0",
									color: palette.text,
									fontSize: "0.9rem",
									lineHeight: "1.4",
								}}
							>
								{comment.text}
							</p>
							<div
								style={{
									display: "flex",
									gap: "0.5rem",
									flexWrap: "wrap",
									marginTop: "0.5rem",
								}}
							>
								{comment.reactions.map((reaction, idx) => (
									<span
										key={`${comment.id}-reaction-${idx}`}
										className="emoji-pop"
										style={{
											fontSize: "1rem",
											cursor: "default",
										}}
									>
										{reaction}
									</span>
								))}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

interface ThemeToggleProps {
	theme: "light" | "dark";
	setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
	palette: any;
}
const ThemeToggle: React.FC<ThemeToggleProps> = ({
	theme,
	setTheme,
	palette,
}) => (
	<button
		onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		style={{
			padding: "8px 12px",
			background: theme === "dark" ? palette.card : palette.emojiBtn,
			color: palette.text,
			border: "none",
			borderRadius: "8px",
			cursor: "pointer",
			fontWeight: 600,
			fontSize: "0.85rem",
			transition: "all 0.2s ease",
			display: "flex",
			alignItems: "center",
			gap: "6px",
			boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
		}}
		onMouseOver={(e) => {
			e.currentTarget.style.transform = "translateY(-1px)";
			e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
			e.currentTarget.style.background =
				theme === "dark" ? palette.header : palette.emojiBtnActive;
		}}
		onMouseOut={(e) => {
			e.currentTarget.style.transform = "translateY(0)";
			e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
			e.currentTarget.style.background =
				theme === "dark" ? palette.card : palette.emojiBtn;
		}}
		aria-label="Toggle theme"
	>
		<span style={{ fontSize: "0.9rem" }}>
			{theme === "light" ? "🌙" : "☀️"}
		</span>
		{theme === "light" ? "Dark" : "Light"}
	</button>
);

interface AudiencePostsDisplayProps {
	comments: Comment[];
	theme: "light" | "dark";
	palette: any;
}

const AudiencePostsDisplay: React.FC<AudiencePostsDisplayProps> = ({
	comments,
	theme,
	palette,
}) => {
	const audienceData = useMemo(() => {
		if (comments.length === 0) return [];

		const sources = [
			{
				name: "Power Users",
				pattern: /^(TechGuru|SocialStar)/,
				icon: "🔥",
				color: palette.sentiment.positive,
			},
			{
				name: "News Sources",
				pattern: /^(NewsBot)/,
				icon: "📰",
				color: palette.accent,
			},
			{
				name: "Beta Testers",
				pattern: /^(BetaTester|UserAlpha)/,
				icon: "🧪",
				color: palette.sentiment.neutral,
			},
			{
				name: "General Users",
				pattern: /^(CommenterGamma|RandomUser123)/,
				icon: "👥",
				color: palette.sentiment.negative,
			},
		];

		const results = sources
			.map((source) => {
				const count = comments.filter((comment) =>
					source.pattern.test(comment.user)
				).length;
				return {
					name: source.name,
					icon: source.icon,
					color: source.color,
					posts: count,
					percentage:
						comments.length > 0
							? Math.round((count / comments.length) * 100)
							: 0,
				};
			})
			.filter((item) => item.posts > 0);

		return results.sort((a, b) => b.posts - a.posts);
	}, [comments, palette]);

	if (audienceData.length === 0) {
		return (
			<p
				style={{ textAlign: "center", color: palette.subtext, padding: "2rem" }}
			>
				No audience data available.
			</p>
		);
	}

	const maxPosts = Math.max(...audienceData.map((item) => item.posts));

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<h4
				style={{
					margin: "0 0 0.5rem 0",
					fontSize: "1.05em",
					color: palette.text,
					fontWeight: 500,
				}}
			>
				Audience Posts
			</h4>
			<p
				style={{
					margin: "0 0 1rem 0",
					fontSize: "0.85rem",
					color: palette.subtext,
				}}
			>
				Posts shared by audience
			</p>

			<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
				{audienceData.map((item, index) => (
					<div
						key={index}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "1rem",
							padding: "0.75rem",
							backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
							borderRadius: "8px",
							border: `1px solid ${palette.border}`,
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor =
								theme === "dark" ? "#232936" : "#f1f5f9";
							e.currentTarget.style.borderColor = item.color;
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor =
								theme === "dark" ? "#1e2329" : "#f8fafc";
							e.currentTarget.style.borderColor = palette.border;
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.75rem",
								minWidth: "160px",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "32px",
									height: "32px",
									borderRadius: "50%",
									backgroundColor: `${item.color}20`,
									border: `2px solid ${item.color}30`,
								}}
							>
								<span style={{ fontSize: "1rem" }}>{item.icon}</span>
							</div>
							<span
								style={{
									fontSize: "0.9rem",
									color: palette.text,
									fontWeight: 500,
								}}
							>
								{item.name}
							</span>
						</div>

						<div
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								gap: "0.75rem",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									minWidth: "40px",
								}}
							>
								<span
									style={{
										fontSize: "0.9rem",
										color: item.color,
										fontWeight: 600,
									}}
								>
									{item.posts}
								</span>
								<span
									style={{
										fontSize: "0.75rem",
										color: palette.subtext,
										fontWeight: 500,
									}}
								>
									{item.percentage}%
								</span>
							</div>

							<div
								style={{
									flex: 1,
									height: "8px",
									backgroundColor: theme === "dark" ? "#2a2e3a" : "#f1f5f9",
									borderRadius: "4px",
									overflow: "hidden",
									border: `1px solid ${
										theme === "dark" ? "#3a4252" : "#e2e8f0"
									}`,
									maxWidth: "140px",
								}}
							>
								<div
									style={{
										width: `${(item.posts / maxPosts) * 100}%`,
										height: "100%",
										background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
										borderRadius: "3px",
										transition: "width 0.4s ease",
										boxShadow: `0 1px 3px ${item.color}40`,
									}}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

interface ConversationTrendDisplayProps {
	theme: "light" | "dark";
	palette: any;
}

const ConversationTrendDisplay: React.FC<ConversationTrendDisplayProps> = ({
	theme,
	palette,
}) => {
	const trendData = useMemo(() => {
		const now = new Date();
		const staticDays: Array<{
			date: Date;
			day: number;
			month: string;
			actualVolume: number;
			predictedVolume: number;
			total: number;
		}> = [];

		const staticValues = [
			{ actualVolume: 3800, predictedVolume: 4200 },
			{ actualVolume: 1200, predictedVolume: 1400 },
			{ actualVolume: 900, predictedVolume: 1100 },
			{ actualVolume: 1500, predictedVolume: 1300 },
			{ actualVolume: 1800, predictedVolume: 1900 },
			{ actualVolume: 1600, predictedVolume: 1750 },
			{ actualVolume: 12500, predictedVolume: 11800 },
		];

		for (let i = 6; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);
			const dataPoint = staticValues[6 - i];

			staticDays.push({
				date: date,
				day: date.getDate(),
				month: date.toLocaleDateString("en", { month: "short" }),
				actualVolume: dataPoint.actualVolume,
				predictedVolume: dataPoint.predictedVolume,
				total: dataPoint.actualVolume + dataPoint.predictedVolume,
			});
		}

		return staticDays;
	}, []);

	const maxVolume =
		Math.max(
			...trendData.map((d) => Math.max(d.actualVolume, d.predictedVolume))
		) || 10000;

	const chartWidth = 600;
	const chartHeight = 280;
	const padding = { top: 30, right: 30, bottom: 50, left: 80 };
	const plotWidth = chartWidth - padding.left - padding.right;
	const plotHeight = chartHeight - padding.top - padding.bottom;

	const getX = (index: number) =>
		padding.left + (index / (trendData.length - 1)) * plotWidth;
	const getY = (value: number) =>
		padding.top + (1 - value / maxVolume) * plotHeight;

	const actualPath = trendData
		.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.actualVolume)}`)
		.join(" ");

	const predictedPath = trendData
		.map(
			(d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.predictedVolume)}`
		)
		.join(" ");

	if (trendData.length === 0) {
		return (
			<p
				style={{ textAlign: "center", color: palette.subtext, padding: "2rem" }}
			>
				No trend data available.
			</p>
		);
	}

	return (
		<div style={{ padding: "1.5rem" }}>
			<div
				style={{
					position: "relative",
					display: "flex",
					justifyContent: "center",
					width: "100%",
					marginBottom: "1.5rem",
				}}
			>
				<svg
					width={chartWidth}
					height={chartHeight}
					style={{ overflow: "visible", maxWidth: "100%" }}
				>
					<g>
						{[0, 2000, 4000, 6000, 8000, 10000].map((value) => (
							<g key={value}>
								<text
									x={padding.left - 30}
									y={getY(value) + 5}
									textAnchor="end"
									fontSize="12"
									fill={palette.subtext}
									fontWeight="500"
									style={{ userSelect: "none" }}
								>
									{value === 10000 ? "10000" : value}
								</text>
								<line
									x1={padding.left}
									y1={getY(value)}
									x2={chartWidth - padding.right}
									y2={getY(value)}
									stroke={palette.border}
									strokeWidth="1"
									opacity="0.3"
								/>
							</g>
						))}
						<text
							x={padding.left - 70}
							y={padding.top + plotHeight / 2}
							textAnchor="middle"
							fontSize="13"
							fill={palette.text}
							fontWeight="600"
							transform={`rotate(-90,${padding.left - 70},${
								padding.top + plotHeight / 2
							})`}
							style={{ userSelect: "none" }}
						>
							Volume
						</text>
					</g>
					{trendData.map((d, i) => (
						<text
							key={i}
							x={getX(i)}
							y={chartHeight - 15}
							textAnchor="middle"
							fontSize="12"
							fill={palette.subtext}
							fontWeight="500"
						>
							{i === 0 ? d.month : d.day}
						</text>
					))}
					<text
						x={padding.left + plotWidth / 2}
						y={chartHeight - 2}
						textAnchor="middle"
						fontSize="13"
						fill={palette.text}
						fontWeight="600"
						style={{ userSelect: "none" }}
					>
						Date
					</text>
					<path
						d={predictedPath}
						fill="none"
						stroke={palette.subtext}
						strokeWidth="3"
						strokeDasharray="6,6"
						opacity="0.7"
					/>
					<path
						d={actualPath}
						fill="none"
						stroke={palette.accent}
						strokeWidth="4"
					/>
					{trendData.map((d, i) => (
						<g key={i}>
							<circle
								cx={getX(i)}
								cy={getY(d.predictedVolume)}
								r="4"
								fill={palette.subtext}
								opacity="0.7"
								stroke={palette.card}
								strokeWidth="2"
							/>
							<circle
								cx={getX(i)}
								cy={getY(d.actualVolume)}
								r="6"
								fill={palette.accent}
								stroke={palette.card}
								strokeWidth="3"
							/>
						</g>
					))}
				</svg>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "1rem",
					marginTop: "1rem",
					justifyContent: "center",
					flexWrap: "wrap",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						padding: "0.5rem 1rem",
						backgroundColor: theme === "dark" ? "#1e2329" : "#f8fafc",
						borderRadius: "8px",
						border: `1px solid ${palette.border}`,
					}}
				>
					<span
						style={{
							fontSize: "0.85rem",
							color: palette.text,
							fontWeight: 600,
						}}
					>
						Last 7 Days
					</span>
					<span style={{ fontSize: "0.75rem", color: palette.subtext }}>
						• Static View
					</span>
				</div>
			</div>

			<style jsx global>{`
				html,
				body,
				#__next,
				main {
					scroll-behavior: smooth !important;
				}
				@keyframes drawLine {
					from {
						stroke-dashoffset: 2000;
					}
					to {
						stroke-dashoffset: 0;
					}
				}
				@keyframes fadeInPoint {
					from {
						opacity: 0;
						transform: scale(0.7);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
			`}</style>
		</div>
	);
};

interface ScrollToTopProps {
	theme: "light" | "dark";
	palette: any;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ theme, palette }) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			className={`scroll-to-top ${!isVisible ? "hidden" : ""}`}
			onClick={scrollToTop}
			title="Scroll to top"
			aria-label="Scroll to top"
		>
			↑
		</button>
	);
};

const HomePage: React.FC = () => {
	const [allComments, setAllComments] = useState<Comment[]>(() =>
		Array.from({ length: 80 }, generateMockComment).sort(
			(a, b) => b.timestamp.getTime() - a.timestamp.getTime()
		)
	);
	const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

	const [startTime, setStartTime] = useState<Date>(
		() => new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
	);
	const [endTime, setEndTime] = useState<Date>(() => new Date());

	const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<"recent" | "liked" | "sentiment">(
		"recent"
	);
	const [sentimentFilter, setSentimentFilter] = useState<
		"all" | "positive" | "neutral" | "negative"
	>("all");
	const [theme, setTheme] = useState<"light" | "dark">(() => {
		if (typeof window !== "undefined") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return "light";
	});

	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
	const [now, setNow] = useState<Date>(new Date());
	const [dataUpdateIndicator, setDataUpdateIndicator] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			document.title = "Social Sentiment Dashboard";
			document.documentElement.setAttribute("data-theme", theme);
		}
	}, [theme]);

	const palette =
		theme === "dark"
			? {
					background: "#181c23",
					card: "#232936",
					border: "#3a4252",
					text: "#e6eaf3",
					subtext: "#d1d5db",
					accent: "#4f8cff",
					header: "#232936",
					shadow: "0 4px 12px rgba(0,0,0,0.35)",
					panelShadow: "0 8px 24px rgba(0,0,0,0.4)",
					separator:
						"linear-gradient(90deg, transparent, rgba(79,140,255,0.3), transparent)",
					sentiment: {
						positive: "#4ade80",
						neutral: "#a3a3a3",
						negative: "#f87171",
					},
					sentimentSecondary: {
						positive: "#22c55e",
						neutral: "#737373",
						negative: "#ef4444",
					},
					emojiBtn: "#232936",
					emojiBtnActive: "#4f8cff",
					emojiBtnBorder: "#3a4252",
			  }
			: {
					background: "#f8fafc",
					card: "#ffffff",
					border: "#e2e8f0",
					text: "#1e293b",
					subtext: "#64748b",
					accent: "#3b82f6",
					header: "#ffffff",
					shadow: "0 4px 12px rgba(0,0,0,0.08)",
					panelShadow: "0 8px 24px rgba(0,0,0,0.12)",
					separator:
						"linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)",
					sentiment: {
						positive: "#10b981",
						neutral: "#6b7280",
						negative: "#f59e0b",
					},
					sentimentSecondary: {
						positive: "#059669",
						neutral: "#4b5563",
						negative: "#d97706",
					},
					emojiBtn: "#ffffff",
					emojiBtnActive: "#dbeafe",
					emojiBtnBorder: "#e2e8f0",
			  };

	useEffect(() => {
		const interval = setInterval(() => {
			setAllComments((prevComments) => {
				const newCommentsBatch = Array.from(
					{ length: Math.ceil(Math.random() * 4) + 1 },
					generateMockComment
				);
				newCommentsBatch.forEach((c, index) => {
					c.timestamp = new Date(Date.now() - index * 1000);
				});
				const updatedComments = [...newCommentsBatch, ...prevComments].sort(
					(a, b) => b.timestamp.getTime() - a.timestamp.getTime()
				);
				return updatedComments.slice(0, 500);
			});
		}, 1500);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const commentsInDateRange = allComments.filter(
			(comment) =>
				comment.timestamp >= startTime && comment.timestamp <= endTime
		);
		setFilteredComments(commentsInDateRange);
	}, [allComments, startTime, endTime]);

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		setLastUpdate(new Date());
		setDataUpdateIndicator(true);
		const timer = setTimeout(() => setDataUpdateIndicator(false), 2000);
		return () => clearTimeout(timer);
	}, [allComments]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setEndTime(new Date());
		}, 100);

		return () => clearTimeout(timer);
	}, [allComments.length]);

	const handleEmojiFilterChange = useCallback((emoji: string) => {
		setSelectedEmojis((prev) =>
			prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
		);
	}, []);

	const handleSortChange = useCallback(
		(sort: "recent" | "liked" | "sentiment") => {
			setSortBy(sort);
		},
		[]
	);

	const handleSentimentFilterChange = useCallback(
		(sentiment: "all" | "positive" | "neutral" | "negative") => {
			setSentimentFilter(sentiment);
		},
		[]
	);

	const handleCsvExport = useCallback(
		(exportType: "full" | "filtered" | "summary" = "filtered") => {
			console.log("handleCsvExport called with type:", exportType);
			let csvString = "";
			let filename = "";

			if (exportType === "summary") {
				console.log("Exporting sentiment summary...");
				const totalComments = filteredComments.length;
				const sentiments = { positive: 0, negative: 0, neutral: 0 };

				filteredComments.forEach((comment) => {
					sentiments[comment.sentiment]++;
				});

				const summaryData = [
					["Metric", "Value", "Percentage"],
					["Total Comments", totalComments.toString(), "100%"],
					[
						"Positive Comments",
						sentiments.positive.toString(),
						`${
							totalComments > 0
								? Math.round((sentiments.positive / totalComments) * 100)
								: 0
						}%`,
					],
					[
						"Negative Comments",
						sentiments.negative.toString(),
						`${
							totalComments > 0
								? Math.round((sentiments.negative / totalComments) * 100)
								: 0
						}%`,
					],
					[
						"Neutral Comments",
						sentiments.neutral.toString(),
						`${
							totalComments > 0
								? Math.round((sentiments.neutral / totalComments) * 100)
								: 0
						}%`,
					],
					["", "", ""],
					[
						"Time Range",
						formatDateForInput(startTime).replace("T", " "),
						formatDateForInput(endTime).replace("T", " "),
					],
					["Export Date", new Date().toISOString(), ""],
				];

				csvString = summaryData
					.map((row) => row.map((cell) => `"${cell}"`).join(","))
					.join("\n");
				filename = `sentiment_summary_${
					formatDateForInput(new Date()).split("T")[0]
				}.csv`;
				console.log("Summary data prepared, rows:", summaryData.length);
			} else {
				console.log(`Exporting ${exportType} comment data...`);
				let commentsForExport = filteredComments;
				console.log("Initial comments count:", commentsForExport.length);

				if (exportType === "filtered") {
					if (selectedEmojis.length > 0) {
						commentsForExport = commentsForExport.filter((comment) =>
							selectedEmojis.some((emoji) => comment.reactions.includes(emoji))
						);
						console.log("After emoji filter:", commentsForExport.length);
					}

					if (sentimentFilter !== "all") {
						commentsForExport = commentsForExport.filter(
							(comment) => comment.sentiment === sentimentFilter
						);
						console.log("After sentiment filter:", commentsForExport.length);
					}
				}

				if (commentsForExport.length === 0) {
					console.log("No data to export");
					alert("No data to export based on current filters.");
					return;
				}

				const headers = [
					"ID",
					"Timestamp",
					"User",
					"Text",
					"Sentiment",
					"Reactions",
				];
				const csvRows = [
					headers.join(","),
					...commentsForExport.map((comment) =>
						[
							comment.id,
							comment.timestamp.toISOString(),
							`"${comment.user.replace(/"/g, '""')}"`,
							`"${comment.text.replace(/"/g, '""')}"`,
							comment.sentiment,
							`"${comment.reactions.join(" ")}"`,
						].join(",")
					),
				];
				csvString = csvRows.join("\n");
				filename = `social_media_${exportType}_${
					formatDateForInput(new Date()).split("T")[0]
				}.csv`;
				console.log("Comment data prepared, rows:", csvRows.length);
			}

			console.log("Creating download with filename:", filename);
			const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			if (link.download !== undefined) {
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				console.log("Download triggered successfully");
			}
		},
		[filteredComments, selectedEmojis, sentimentFilter, startTime, endTime]
	);

	return (
		<>
			<main
				style={{
					fontFamily:
						'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
					padding: "20px",
					maxWidth: "1600px",
					margin: "0 auto",
					background: palette.background,
					minHeight: "100vh",
					color: palette.text,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: "10px",
						flexWrap: "wrap",
						gap: "1rem",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
						<span
							className={`stream-dot ${
								dataUpdateIndicator ? "data-update-flash" : ""
							}`}
							style={{
								display: "inline-block",
								width: 10,
								height: 10,
								borderRadius: "50%",
								background: dataUpdateIndicator
									? "#4ade80"
									: theme === "dark"
									? "#4f8cff"
									: "#007bff",
								boxShadow: `0 0 0 0 ${
									dataUpdateIndicator
										? "rgba(74,222,128,0.6)"
										: theme === "dark"
										? "rgba(79,140,255,0.5)"
										: "rgba(0,123,255,0.4)"
								}`,
								marginRight: 4,
								verticalAlign: "middle",
								animation: dataUpdateIndicator
									? "data-flash 0.5s ease-in-out"
									: "pulse-dot 1.2s infinite",
								transition: "all 0.3s ease",
							}}
						/>
						<span
							style={{
								color: dataUpdateIndicator
									? palette.sentiment.positive
									: palette.subtext,
								fontSize: "0.98rem",
								fontWeight: dataUpdateIndicator ? 600 : 500,
								transition: "all 0.3s ease",
							}}
						>
							{dataUpdateIndicator
								? "Live data updated!"
								: `Last updated ${Math.max(
										0,
										Math.floor((now.getTime() - lastUpdate.getTime()) / 1000)
								  )}s ago`}
						</span>
					</div>
					<PrivacyBadge theme={theme} palette={palette} />
				</div>

				<header
					style={{
						marginBottom: "15px",
						borderBottom: `1px solid ${palette.border}`,
						paddingBottom: "15px",
						background:
							theme === "dark" ? palette.header : "rgba(255,255,255,0.7)",
						backdropFilter: theme === "dark" ? "none" : "blur(12px)",
						WebkitBackdropFilter: theme === "dark" ? "none" : "blur(12px)",
						borderRadius: "20px",
						boxShadow:
							theme === "dark"
								? "0 8px 32px 0 rgba(31, 38, 135, 0.18)"
								: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
						marginTop: "15px",
						paddingTop: "20px",
						paddingLeft: "28px",
						paddingRight: "28px",
						animation: "header-fade-in 0.8s cubic-bezier(0.4,0,0.2,1)",
						position: "relative",
						overflow: "visible",
						zIndex: 2,
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginBottom: "18px",
							position: "relative",
						}}
					>
						<span
							className="dashboard-logo-spin"
							style={{
								fontSize: "2rem",
								marginRight: "0.6rem",
								color: palette.accent,
								filter: "drop-shadow(0 2px 8px #3b82f650)",
							}}
						>
							<svg
								width="38"
								height="38"
								viewBox="0 0 38 38"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="19"
									cy="19"
									r="18"
									stroke={palette.accent}
									strokeWidth="2"
									fill="url(#headerLogoGradient)"
								/>
								<defs>
									<radialGradient
										id="headerLogoGradient"
										cx="50%"
										cy="50%"
										r="50%"
									>
										<stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
										<stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
									</radialGradient>
								</defs>
							</svg>
						</span>
						<h1
							style={{
								textAlign: "center",
								margin: 0,
								color: palette.text,
								fontWeight: 800,
								fontSize: "2.4rem",
								letterSpacing: "-0.03em",
								background: "linear-gradient(90deg, #3b82f6 30%, #4ade80 70%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								position: "relative",
								display: "inline-block",
								zIndex: 1,
								animation: "title-slide-in 1.1s cubic-bezier(0.4,0,0.2,1)",
							}}
						>
							Social Media Sentiment Dashboard
							<span
								className="title-underline-anim"
								style={{
									display: "block",
									height: "4px",
									width: "100%",
									background:
										"linear-gradient(90deg, #3b82f6 30%, #4ade80 70%)",
									borderRadius: "2px",
									marginTop: "6px",
									opacity: 0.7,
									animation:
										"underline-grow 1.2s cubic-bezier(0.4,0,0.2,1) 0.5s both",
								}}
							/>
						</h1>
					</div>
					<div
						className="header-controls"
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: "1.2rem",
						}}
					>
						<TimeRangeSelector
							startTime={startTime}
							endTime={endTime}
							onStartTimeChange={setStartTime}
							onEndTimeChange={setEndTime}
							theme={theme}
							palette={palette}
						/>
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
						>
							<ExportSelector
								onExport={handleCsvExport}
								theme={theme}
								palette={palette}
							/>
							<ThemeToggle
								theme={theme}
								setTheme={setTheme}
								palette={palette}
							/>
						</div>
					</div>
				</header>

				<div
					className="dashboard-grid"
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr 1fr",
						gridTemplateRows: "auto auto",
						gap: "1.5rem",
						padding: "0.5rem 0",
						alignItems: "start",
					}}
				>
					{[
						{
							title: "Trending Topics",
							component: (
								<WordCloudDisplay
									comments={filteredComments}
									theme={theme}
									palette={palette}
								/>
							),
						},
						{
							title: "Sentiment Meter",
							component: (
								<SentimentMeterDisplay
									comments={filteredComments}
									theme={theme}
									palette={palette}
								/>
							),
						},
						{
							title: "Comment Analysis",
							component: (
								<CommentAnalysisPanel
									comments={filteredComments}
									selectedEmojis={selectedEmojis}
									onEmojiFilterChange={handleEmojiFilterChange}
									sortBy={sortBy}
									sentimentFilter={sentimentFilter}
									onSortChange={handleSortChange}
									onSentimentFilterChange={handleSentimentFilterChange}
									theme={theme}
									palette={palette}
								/>
							),
						},
						{
							title: "Audience Posts",
							component: (
								<AudiencePostsDisplay
									comments={filteredComments}
									theme={theme}
									palette={palette}
								/>
							),
						},
						{
							title: "Conversation Trends",
							component: (
								<ConversationTrendDisplay theme={theme} palette={palette} />
							),
						},
					].map((panel, index) => {
						// Define special layout for bottom row panels
						const isBottomRowPanel = index >= 3;
						const isConversationTrends = panel.title === "Conversation Trends";

						return (
							<section
								key={index}
								className="dashboard-card"
								style={{
									border: `1px solid ${palette.border}`,
									borderRadius: "12px",
									backgroundColor: palette.card,
									boxShadow: palette.panelShadow,
									overflow: "hidden",
									position: "relative",
									transition: "transform 0.2s ease, box-shadow 0.2s ease",
									gridColumn: isConversationTrends ? "span 2" : "span 1",
									display: "flex",
									flexDirection: "column",
									height: isBottomRowPanel ? "480px" : "580px",
									minHeight: isBottomRowPanel ? "480px" : "580px",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = "translateY(-2px)";
									e.currentTarget.style.boxShadow = palette.panelShadow;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "translateY(0)";
									e.currentTarget.style.boxShadow = palette.shadow;
								}}
							>
								{/* Panel separator */}
								<div
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										height: "3px",
										background: palette.separator,
									}}
								/>

								<div
									style={{
										padding: "1.5rem",
										display: "flex",
										flexDirection: "column",
										flex: 1,
										overflow: "hidden",
									}}
								>
									<h2
										style={{
											marginTop: "0",
											borderBottom: `2px solid ${
												theme === "dark" ? "#3a4252" : "#e2e8f0"
											}`,
											paddingBottom: "0.75rem",
											marginBottom: "1rem",
											fontSize: "1.2em",
											color: palette.text,
											fontWeight: 600,
											letterSpacing: "-0.025em",
											flexShrink: 0,
										}}
									>
										{panel.title}
									</h2>
									<div
										style={{
											flex: 1,
											display: "flex",
											flexDirection: "column",
											overflow: "auto",
											minHeight: 0,
										}}
									>
										{panel.component}
									</div>
								</div>
							</section>
						);
					})}
				</div>

				{/* Scroll to top button */}
				<ScrollToTop theme={theme} palette={palette} />
			</main>

			{/* Responsive Footer */}
			<footer
				style={{
					width: "100%",
					background: theme === "dark" ? palette.header : palette.card,
					color: palette.subtext,
					borderTop: `1px solid ${palette.border}`,
					textAlign: "center",
					padding: "1.2rem 0 1.2rem 0",
					fontSize: "0.98rem",
					fontWeight: 500,
					marginTop: "auto",
					zIndex: 1,
				}}
			>
				<span style={{ color: palette.text, fontWeight: 600 }}>
					© {new Date().getFullYear()} Social Media Sentiment Dashboard
				</span>
				<span style={{ marginLeft: 8, color: palette.subtext }}>
					| Built with{" "}
					<span style={{ color: palette.accent, fontWeight: 700 }}>React</span>{" "}
					&{" "}
					<span style={{ color: palette.accent, fontWeight: 700 }}>
						Next.js
					</span>
				</span>
			</footer>

			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap");

				body {
					margin: 0;
					background-color: ${palette.background};
					color: ${palette.text};
					font-size: 16px;
					font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, sans-serif;
					line-height: 1.6;
				}

				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI",
						Roboto, sans-serif;
					font-weight: 600;
					letter-spacing: -0.025em;
				}

				h1 {
					font-size: 2.25rem;
					font-weight: 700;
				}
				h2 {
					font-size: 1.5rem;
					font-weight: 600;
				}
				h3 {
					font-size: 1.25rem;
					font-weight: 600;
				}
				h4 {
					font-size: 1.125rem;
					font-weight: 600;
				}
				h5 {
					font-size: 1rem;
					font-weight: 600;
				}

				/* Emoji animations */
				@keyframes wiggle {
					0% {
						transform: rotate(0deg) scale(1);
					}
					25% {
						transform: rotate(-5deg) scale(1.05);
					}
					50% {
						transform: rotate(5deg) scale(1.1);
					}
					75% {
						transform: rotate(-3deg) scale(1.05);
					}
					100% {
						transform: rotate(0deg) scale(1);
					}
				}

				@keyframes pop {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.2);
					}
					100% {
						transform: scale(1.1);
					}
				}

				@keyframes glow {
					0% {
						box-shadow: 0 0 5px ${palette.accent}40;
					}
					50% {
						box-shadow: 0 0 20px ${palette.accent}80,
							0 0 30px ${palette.accent}40;
					}
					100% {
						box-shadow: 0 0 5px ${palette.accent}40;
					}
				}

				@keyframes pulse-glow {
					0% {
						box-shadow: 0 2px 8px ${palette.accent}40;
					}
					50% {
						box-shadow: 0 4px 16px ${palette.accent}60,
							0 0 25px ${palette.accent}30;
					}
					100% {
						box-shadow: 0 2px 8px ${palette.accent}40;
					}
				}

				.emoji-hover:hover {
					animation: wiggle 0.6s ease-in-out;
				}

				.emoji-pop:hover {
					animation: pop 0.3s ease-in-out;
				}

				.filter-glow {
					animation: glow 2s infinite;
				}

				.selected-filter {
					animation: pulse-glow 2s infinite;
				}

				/* Smooth scroll */
				html {
					scroll-behavior: smooth;
				}

				/* Scroll to top button */
				.scroll-to-top {
					position: fixed;
					bottom: 2rem;
					right: 2rem;
					width: 3rem;
					height: 3rem;
					background: ${palette.accent};
					color: white;
					border: none;
					border-radius: 50%;
					cursor: pointer;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
					transition: all 0.3s ease;
					z-index: 1000;
					font-size: 1.2rem;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.scroll-to-top:hover {
					transform: translateY(-2px);
					box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
					background: ${theme === "dark" ? "#2563eb" : "#2563eb"};
				}

				.scroll-to-top.hidden {
					opacity: 0;
					pointer-events: none;
					transform: translateY(10px);
				}
				input[type="datetime-local"] {
					padding: 8px 10px;
					border: 1px solid ${palette.border};
					border-radius: 4px;
					font-size: 0.95rem;
					background-color: ${theme === "dark" ? "#232936" : "white"};
					color: ${palette.text};
				}
				/* Hide all scrollbars */
				/* Hide scrollbar for Chrome, Safari and Opera */
				::-webkit-scrollbar {
					display: none;
				}

				/* Hide scrollbar for IE, Edge and Firefox */
				* {
					-ms-overflow-style: none; /* IE and Edge */
					scrollbar-width: none; /* Firefox */
				}

				/* Ensure scrolling still works */
				html,
				body {
					overflow: auto;
				}

				/* Hide scrollbars for all overflow containers */
				div[style*="overflow"] {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				div[style*="overflow"]::-webkit-scrollbar {
					display: none;
				}
				@keyframes pulse-dot {
					0% {
						box-shadow: 0 0 0 0 rgba(79, 140, 255, 0.5);
					}
					70% {
						box-shadow: 0 0 0 8px rgba(79, 140, 255, 0);
					}
					100% {
						box-shadow: 0 0 0 0 rgba(79, 140, 255, 0);
					}
				}

				@keyframes data-flash {
					0% {
						transform: scale(1);
						box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6);
					}
					50% {
						transform: scale(1.3);
						box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
					}
					100% {
						transform: scale(1);
						box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
					}
				}

				@keyframes word-pop-in {
					0% {
						transform: scale(0.8) translateY(10px);
						opacity: 0;
					}
					50% {
						transform: scale(1.1) translateY(-5px);
						opacity: 0.8;
					}
					100% {
						transform: scale(1) translateY(0);
						opacity: 1;
					}
				}

				@keyframes word-pulse {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
					100% {
						transform: scale(1);
					}
				}

				@keyframes sentiment-bar-pulse {
					0% {
						box-shadow: inset 0 0 0 0 rgba(255, 255, 255, 0.2);
					}
					50% {
						box-shadow: inset 0 0 20px 0 rgba(255, 255, 255, 0.3);
					}
					100% {
						box-shadow: inset 0 0 0 0 rgba(255, 255, 255, 0.2);
					}
				}

				@keyframes sentiment-row-update {
					0% {
						background-color: ${palette.card};
					}
					50% {
						background-color: ${theme === "dark" ? "#2a3441" : "#f0f9ff"};
					}
					100% {
						background-color: ${palette.card};
					}
				}

				@keyframes pie-chart-pulse {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.02);
					}
					100% {
						transform: scale(1);
					}
				}

				@keyframes pie-segment-pulse {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.05);
					}
					100% {
						transform: scale(1);
					}
				}

				.word-pop-in {
					animation: word-pop-in 0.6s ease-out;
				}

				.word-pulse {
					animation: word-pulse 0.5s ease-in-out;
				}

				.sentiment-bar-pulse {
					animation: sentiment-bar-pulse 0.8s ease-in-out;
				}

				.sentiment-row-update {
					animation: sentiment-row-update 0.8s ease-in-out;
				}

				.pie-chart-pulse {
					animation: pie-chart-pulse 0.6s ease-in-out;
				}

				.pie-segment-pulse {
					animation: pie-segment-pulse 0.6s ease-in-out;
				}

				.data-update-flash {
					animation: data-flash 0.5s ease-in-out;
				}

				@keyframes live-pulse {
					0% {
						box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
					}
					70% {
						box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
					}
					100% {
						box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
					}
				}

				@keyframes new-comments-pulse {
					0% {
						transform: scale(1);
						box-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
					}
					50% {
						transform: scale(1.05);
						box-shadow: 0 4px 12px rgba(74, 222, 128, 0.6);
					}
					100% {
						transform: scale(1);
						box-shadow: 0 2px 8px rgba(74, 222, 128, 0.4);
					}
				}

				.live-pulse {
					animation: live-pulse 1.5s infinite;
				}

				.new-comments-pulse {
					animation: new-comments-pulse 2s infinite;
				}

				@keyframes new-badge-glow {
					0% {
						box-shadow: 0 2px 4px rgba(74, 222, 128, 0.4);
					}
					50% {
						box-shadow: 0 4px 12px rgba(74, 222, 128, 0.8),
							0 0 20px rgba(74, 222, 128, 0.3);
					}
					100% {
						box-shadow: 0 2px 4px rgba(74, 222, 128, 0.4);
					}
				}

				@keyframes word-fade-out {
					0% {
						opacity: 0.6;
						transform: scale(1);
						filter: blur(0);
					}
					50% {
						opacity: 0.3;
						transform: scale(0.98);
						filter: blur(0.3px);
					}
					100% {
						opacity: 0;
						transform: scale(0.9);
						filter: blur(1px);
					}
				}

				.new-topic {
					position: relative;
					z-index: 2;
				}

				.word-fade-out {
					animation: word-fade-out 3s ease-out forwards;
				}

				/* Modern Pie Chart Animations */
				@keyframes pie-segment-entry {
					0% {
						opacity: 0;
						transform: scale(0.3) rotate(-180deg);
						filter: brightness(0.5);
					}
					50% {
						opacity: 0.8;
						transform: scale(1.1) rotate(-90deg);
						filter: brightness(1.2);
					}
					100% {
						opacity: 1;
						transform: scale(1) rotate(0deg);
						filter: brightness(1);
					}
				}

				@keyframes pie-center-pulse {
					0% {
						transform: scale(1);
						stroke-width: 2;
						opacity: 1;
					}
					50% {
						transform: scale(1.15);
						stroke-width: 3;
						opacity: 0.8;
					}
					100% {
						transform: scale(1);
						stroke-width: 2;
						opacity: 1;
					}
				}

				@keyframes pie-indicator-float {
					0% {
						transform: translateY(0px) scale(1);
						opacity: 0.9;
					}
					50% {
						transform: translateY(-4px) scale(1.08);
						opacity: 1;
					}
					100% {
						transform: translateY(0px) scale(1);
						opacity: 0.9;
					}
				}

				@keyframes pie-background-glow {
					0% {
						stroke-width: 1;
						opacity: 0.2;
					}
					50% {
						stroke-width: 2;
						opacity: 0.5;
					}
					100% {
						stroke-width: 1;
						opacity: 0.2;
					}
				}

				@keyframes pie-segment-hover {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.12) rotate(3deg);
					}
					100% {
						transform: scale(1.08);
					}
				}

				/* Enhanced pie chart classes */
				.pie-segment {
					transform-origin: center;
					transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				}

				.pie-segment:hover {
					animation: pie-segment-hover 0.6s ease-in-out;
				}

				.pie-chart-container {
					filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15));
					transition: filter 0.5s ease;
				}

				.pie-chart-container:hover {
					filter: drop-shadow(0 8px 30px rgba(0, 0, 0, 0.25));
				}

				.pie-background-glow {
					animation: pie-background-glow 4s ease-in-out infinite;
				}

				.pie-percentage-indicator {
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					cursor: pointer;
				}

				.pie-percentage-indicator:hover {
					transform: scale(1.2) translateY(-2px) !important;
					z-index: 20;
					box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
				}

				.pie-segment-shadow {
					transition: all 0.4s ease;
				}

				/* Gradient animation for center circle */
				@keyframes pie-center-gradient {
					0% {
						fill: ${palette.card};
						stroke: ${palette.accent};
					}
					50% {
						fill: ${theme === "dark" ? "#2a3441" : "#f0f9ff"};
						stroke: ${palette.sentiment.positive};
					}
					100% {
						fill: ${palette.card};
						stroke: ${palette.accent};
					}
				}

				/* Modal animations */
				@keyframes modal-fade-in {
					0% {
						opacity: 0;
						transform: scale(0.95) translateY(-20px);
					}
					100% {
						opacity: 1;
						transform: scale(1) translateY(0);
					}
				}

				@keyframes modal-fade-out {
					0% {
						opacity: 1;
						transform: scale(1) translateY(0);
					}
					100% {
						opacity: 0;
						transform: scale(0.95) translateY(-20px);
					}
				}
				@keyframes header-fade-in {
					0% {
						opacity: 0;
						transform: translateY(-30px) scale(0.98);
					}
					100% {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
				@keyframes title-slide-in {
					0% {
						opacity: 0;
						transform: translateY(-20px) scale(0.95);
					}
					100% {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
				@keyframes underline-grow {
					0% {
						width: 0;
						opacity: 0;
					}
					100% {
						width: 100%;
						opacity: 0.7;
					}
				}
				.dashboard-logo-spin {
					animation: dashboard-logo-spin 2.5s linear infinite;
				}
				@keyframes dashboard-logo-spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
				/* Theme toggle styling removed as we've updated inline styles */
				/* Modern button styling removed as we've updated inline styles */
				/* Preset buttons */
				button[style*="Last hour"],
				button[style*="Last 24 hours"],
				button[style*="Last 7 days"],
				button[style*="Custom"] {
					transition: background 0.2s, color 0.2s, border 0.2s, transform 0.2s;
					font-weight: 600;
					box-shadow: 0 1px 4px #3b82f610;
					position: relative;
					overflow: hidden;
				}
				button[style*="Last hour"]:hover,
				button[style*="Last 24 hours"]:hover,
				button[style*="Last 7 days"]:hover,
				button[style*="Custom"]:hover {
					background: #e0e7ff !important;
					color: #3b82f6 !important;
					transform: scale(1.05);
				}
				button[style*="Last hour"]:active,
				button[style*="Last 24 hours"]:active,
				button[style*="Last 7 days"]:active,
				button[style*="Custom"]:active {
					background: #dbeafe !important;
					color: #2563eb !important;
					transform: scale(0.97);
				}
				button[style*="Custom"][style*="2px solid"] {
					box-shadow: 0 2px 8px #3b82f650;
				}
				/* Date input enhancements */
				input[type="datetime-local"] {
					background: #f8fafc
						url('data:image/svg+xml;utf8,<svg fill="%2364748b" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M7 10h5v5H7z" opacity=".3"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm0-13H5V5h14v1zM7 10h5v5H7z"/></svg>')
						no-repeat right 10px center/18px 18px;
					border: 1.5px solid #e2e8f0;
					box-shadow: 0 1px 4px #3b82f610;
					transition: border 0.2s, box-shadow 0.2s;
				}
				input[type="datetime-local"]:focus {
					border: 2px solid #3b82f6;
					box-shadow: 0 2px 8px #3b82f650;
				}
				/* Responsive Design */

				/* Mobile First Approach */
				@media (max-width: 480px) {
					main {
						padding: 10px !important;
					}

					header {
						padding: 1rem !important;
						margin: 0.5rem 0 !important;
						border-radius: 12px !important;
					}

					.header-controls {
						flex-direction: column !important;
						align-items: stretch !important;
						gap: 1rem !important;
					}

					.time-range-controls {
						flex-direction: column !important;
						align-items: stretch !important;
						gap: 0.75rem !important;
					}

					.time-range-controls > div {
						justify-content: center !important;
					}

					.dashboard-logo-spin {
						font-size: 1.2rem !important;
						margin-right: 0.4rem !important;
					}

					h1 {
						font-size: 1.3rem !important;
						text-align: center !important;
						line-height: 1.2 !important;
					}

					.dashboard-grid {
						grid-template-columns: 1fr !important;
						gap: 1rem !important;
						padding: 0 !important;
					}

					.dashboard-card {
						height: auto !important;
						min-height: 400px !important;
					}

					.dashboard-card-wide {
						grid-column: span 1 !important;
					}

					.scroll-to-top {
						bottom: 1rem !important;
						right: 1rem !important;
						width: 2.5rem !important;
						height: 2.5rem !important;
						font-size: 1rem !important;
					}
				}

				/* Small Mobile */
				@media (max-width: 600px) {
					main {
						padding: 15px !important;
					}

					header {
						padding: 1.25rem !important;
						margin: 0.75rem 0 !important;
					}

					.dashboard-logo-spin {
						font-size: 1.4rem !important;
					}

					h1 {
						font-size: 1.5rem !important;
					}

					.dashboard-grid {
						gap: 1.25rem !important;
					}

					.dashboard-card {
						min-height: 450px !important;
					}
				}

				/* Tablet Portrait */
				@media (min-width: 601px) and (max-width: 768px) {
					main {
						padding: 20px !important;
					}

					header {
						padding: 1.5rem !important;
						margin: 1rem 0 !important;
					}

					.header-controls {
						flex-direction: column !important;
						align-items: stretch !important;
						gap: 1.25rem !important;
					}

					.time-range-controls {
						justify-content: center !important;
					}

					.dashboard-logo-spin {
						font-size: 1.6rem !important;
					}

					h1 {
						font-size: 1.8rem !important;
					}

					.dashboard-grid {
						grid-template-columns: 1fr !important;
						gap: 1.5rem !important;
					}

					.dashboard-card {
						height: auto !important;
						min-height: 500px !important;
					}

					.dashboard-card-wide {
						grid-column: span 1 !important;
					}
				}

				/* Tablet Landscape */
				@media (min-width: 769px) and (max-width: 1024px) {
					main {
						padding: 20px !important;
					}

					header {
						padding: 2rem !important;
						margin: 1rem 0 !important;
					}

					.header-controls {
						flex-wrap: wrap !important;
						justify-content: space-between !important;
					}

					.dashboard-logo-spin {
						font-size: 1.8rem !important;
					}

					h1 {
						font-size: 2rem !important;
					}

					.dashboard-grid {
						grid-template-columns: repeat(
							auto-fit,
							minmax(280px, 1fr)
						) !important;
						gap: 1.5rem !important;
					}

					.dashboard-card {
						min-height: 520px !important;
					}

					.dashboard-card-wide {
						grid-column: span 2 !important;
					}
				}

				/* Small Desktop */
				@media (min-width: 1025px) and (max-width: 1200px) {
					.dashboard-grid {
						grid-template-columns: repeat(
							auto-fit,
							minmax(280px, 1fr)
						) !important;
					}

					.dashboard-card {
						min-height: 560px !important;
					}
				}

				/* Large Desktop */
				@media (min-width: 1201px) {
					.dashboard-grid {
						grid-template-columns: repeat(
							auto-fit,
							minmax(300px, 1fr)
						) !important;
					}

					.dashboard-card {
						min-height: 580px !important;
					}
				}

				/* Extra spacing adjustments for mobile */
				@media (max-width: 768px) {
					.emoji-hover,
					.selected-filter {
						padding: 0.3rem 0.6rem !important;
						font-size: 1rem !important;
						margin: 0.2rem !important;
					}

					button {
						padding: 0.4rem 0.8rem !important;
						font-size: 0.85rem !important;
					}

					input[type="datetime-local"] {
						width: 100% !important;
						padding: 0.6rem !important;
						font-size: 0.9rem !important;
					}

					h2 {
						font-size: 1rem !important;
						margin-bottom: 0.75rem !important;
					}

					h3 {
						font-size: 0.95rem !important;
					}

					h4 {
						font-size: 0.9rem !important;
					}

					h5 {
						font-size: 0.85rem !important;
					}

					p,
					span,
					div {
						font-size: 0.85rem !important;
					}
				}

				/* Touch-friendly buttons on mobile */
				@media (max-width: 768px) and (pointer: coarse) {
					button,
					.emoji-hover {
						min-height: 44px !important;
						min-width: 44px !important;
						padding: 0.5rem 1rem !important;
					}

					.scroll-to-top {
						min-height: 48px !important;
						min-width: 48px !important;
					}
				}

				/* Flexible text sizing */
				@media (max-width: 480px) {
					body {
						font-size: 14px !important;
					}
				}

				@media (min-width: 481px) and (max-width: 768px) {
					body {
						font-size: 15px !important;
					}
				}

				@media (min-width: 769px) {
					body {
						font-size: 16px !important;
					}
				}
				/* Responsive Design */

				/* Mobile First Approach */
				@media (max-width: 480px) {
					main {
						padding: 10px !important;
					}

					header {
						padding: 1rem !important;
						margin: 0.5rem 0 !important;
						border-radius: 12px !important;
					}

					.header-controls {
						flex-direction: column !important;
						align-items: stretch !important;
						gap: 1rem !important;
					}

					.time-range-controls {
						flex-direction: column !important;
						align-items: stretch !important;
						gap: 0.75rem !important;
					}

					.time-range-controls > div {
						justify-content: center !important;
					}

					.dashboard-logo-spin {
						font-size: 1.2rem !important;
						margin-right: 0.4rem !important;
					}

					h1 {
						font-size: 1.3rem !important;
						text-align: center !important;
						line-height: 1.2 !important;
					}

					.dashboard-grid {
						grid-template-columns: 1fr !important;
						gap: 1rem !important;
						padding: 0 !important;
					}

					.dashboard-card {
						height: auto !important;
						min-height: 400px !important;
					}

					.dashboard-card-wide {
						grid-column: span 1 !important;
					}

					.scroll-to-top {
						bottom: 1rem !important;
						right: 1rem !important;
						width: 2.5rem !important;
						height: 2.5rem !important;
						font-size: 1rem !important;
					}
				}

				/* Small Mobile */
				@media (max-width: 600px) {
					main {
						padding: 15px !important;
					}

					header {
						padding: 1.25rem !important;
						margin: 0.75rem 0 !important;
					}

					.dashboard-logo-spin {
						font-size: 1.4rem !important;
					}

					h1 {
						font-size: 1.5rem !important;
					}

					.dashboard-grid {
						gap: 1.25rem !important;
					}

					.dashboard-card {
						min-height: 450px !important;
					}
				}

				/* Tablet Portrait */
				@media (min-width: 601px) and (max-width: 768px) {
					main {
						padding: 20px !important;
					}

					header {
						padding: 1.5rem !important;
						margin: 1rem 0 !important;
					}

					.header-controls {
						flex-direction: column !important;
						align-items: stretch !important;
						gap: 1.25rem !important;
					}

					.time-range-controls {
						justify-content: center !important;
					}

					.dashboard-logo-spin {
						font-size: 1.6rem !important;
					}

					h1 {
						font-size: 1.8rem !important;
					}

					.dashboard-grid {
						grid-template-columns: 1fr !important;
						gap: 1.5rem !important;
					}

					.dashboard-card {
						height: auto !important;
						min-height: 500px !important;
					}

					.dashboard-card-wide {
						grid-column: span 1 !important;
					}
				}

				/* Tablet Landscape */
				@media (min-width: 769px) and (max-width: 1024px) {
					main {
						padding: 20px !important;
					}

					header {
						padding: 2rem !important;
						margin: 1rem 0 !important;
					}

					.header-controls {
						flex-wrap: wrap !important;
						justify-content: space-between !important;
					}

					.dashboard-logo-spin {
						font-size: 1.8rem !important;
					}

					h1 {
						font-size: 2rem !important;
					}

					.dashboard-grid {
						grid-template-columns: repeat(
							auto-fit,
							minmax(400px, 1fr)
						) !important;
						gap: 1.5rem !important;
					}

					.dashboard-card {
						min-height: 520px !important;
					}

					.dashboard-card-wide {
						grid-column: span 2 !important;
					}
				}

				/* Small Desktop */
				@media (min-width: 1025px) and (max-width: 1200px) {
					.dashboard-grid {
						grid-template-columns: repeat(2, 1fr) !important;
					}

					.dashboard-card {
						min-height: 560px !important;
					}
				}

				/* Large Desktop */
				@media (min-width: 1201px) {
					.dashboard-grid {
						grid-template-columns: repeat(3, 1fr) !important;
					}

					.dashboard-card {
						min-height: 580px !important;
					}
				}

				/* Extra spacing adjustments for mobile */
				@media (max-width: 768px) {
					.emoji-hover,
					.selected-filter {
						padding: 0.3rem 0.6rem !important;
						font-size: 1rem !important;
						margin: 0.2rem !important;
					}

					button {
						padding: 0.4rem 0.8rem !important;
						font-size: 0.85rem !important;
					}

					input[type="datetime-local"] {
						width: 100% !important;
						padding: 0.6rem !important;
						font-size: 0.9rem !important;
					}

					h2 {
						font-size: 1rem !important;
						margin-bottom: 0.75rem !important;
					}

					h3 {
						font-size: 0.95rem !important;
					}

					h4 {
						font-size: 0.9rem !important;
					}

					h5 {
						font-size: 0.85rem !important;
					}

					p,
					span,
					div {
						font-size: 0.85rem !important;
					}
				}

				/* Touch-friendly buttons on mobile */
				@media (max-width: 768px) and (pointer: coarse) {
					button,
					.emoji-hover {
						min-height: 44px !important;
						min-width: 44px !important;
						padding: 0.5rem 1rem !important;
					}

					.scroll-to-top {
						min-height: 48px !important;
						min-width: 48px !important;
					}
				}

				/* Flexible text sizing */
				@media (max-width: 480px) {
					body {
						font-size: 14px !important;
					}
				}

				@media (min-width: 481px) and (max-width: 768px) {
					body {
						font-size: 15px !important;
					}
				}

				@media (min-width: 769px) {
					body {
						font-size: 16px !important;
					}
				}
				/* Prevent background scroll when modal is open */
				body.modal-open {
					overflow: hidden !important;
				}
				/* Responsive footer */
				footer {
					width: 100vw;
					min-height: 60px;
					font-size: 1rem;
					background: ${theme === "dark" ? palette.header : palette.card};
					color: ${palette.subtext};
					border-top: 1px solid ${palette.border};
					text-align: center;
					padding: 1.2rem 0 1.2rem 0;
					font-weight: 500;
					margin-top: auto;
					z-index: 1;
				}
				@media (max-width: 600px) {
					footer {
						font-size: 0.85rem;
						padding: 0.8rem 0 0.8rem 0;
					}
				}
				@media (max-width: 400px) {
					footer {
						font-size: 0.75rem;
						padding: 0.6rem 0 0.6rem 0;
					}
				}
				/* Ensure footer does not overlap modal */
				.ReactModal__Overlay {
					z-index: 9999 !important;
				}

				/* Mobile Design Improvements */
				@media (max-width: 768px) {
					.dashboard-grid {
						grid-template-columns: 1fr !important;
						grid-template-rows: repeat(5, auto) !important;
					}

					.dashboard-card {
						grid-column: span 1 !important;
						height: auto !important;
						min-height: 400px !important;
						max-height: 500px !important;
					}

					/* Fixed scroll for comment analysis panel */
					.dashboard-card div[style*='overflow: "auto"'] {
						max-height: 300px !important;
						overflow-y: auto !important;
						-webkit-overflow-scrolling: touch !important;
					}

					/* Specific fix for comment list containers */
					.dashboard-card div[style*='maxHeight: "400px"'] {
						max-height: 250px !important;
						overflow-y: auto !important;
						-webkit-overflow-scrolling: touch !important;
					}
				}

				/* Tablet Layout */
				@media (min-width: 769px) and (max-width: 1024px) {
					.dashboard-grid {
						grid-template-columns: 1fr 1fr !important;
						grid-template-rows: auto auto auto !important;
					}

					.dashboard-card:last-child {
						grid-column: span 2 !important;
					}
				}

				/* Desktop Layout */
				@media (min-width: 1025px) {
					.dashboard-grid {
						grid-template-columns: 1fr 1fr 1fr !important;
						grid-template-rows: auto auto !important;
					}
				}
			`}</style>
		</>
	);
};

export default HomePage;
