"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	PieChart,
	Pie,
	Cell,
	LineChart,
	LabelList,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	Legend,
	CartesianGrid,
	Area,
	AreaChart,
	RadialBar,
	RadialBarChart,
} from "recharts";
import {
	MdDashboard,
	MdAssessment,
	MdMic,
	MdLocationOn,
	MdRestaurant,
	MdNotifications,
	MdSettings,
	MdArrowUpward,
	MdArrowDownward,
	MdPerson,
	MdMoreVert,
	MdFilterList,
	MdRefresh,
} from "react-icons/md";

interface SurveyResult {
	question: string;
	answers: {
		option: string;
		count: number;
		percentage: number;
		color: string;
	}[];
	category: string;
	responseRate: number;
}

interface SentimentData {
	time: string;
	positive: number;
	negative: number;
	neutral: number;
	total: number;
	category: string;
}

interface MoodData {
	name: string;
	value: number;
	color: string;
	category: string;
}

interface FeedbackComment {
	id: string;
	text: string;
	sentiment: "positive" | "negative" | "neutral";
	time: string;
	category: string;
}

type TimeFrame = "last24h" | "fullEvent" | "morning" | "afternoon";

const COLORS = {
	primary: "#5D48E5",
	primaryLight: "#EBE8FD",
	secondary: "#03DAC5",
	positive: "#4CAF50",
	negative: "#F44336",
	neutral: "#FF9800",
	background: "#F5F7FA",
	cardBg: "#FFFFFF",
	text: "#263238",
	textSecondary: "#607D8B",
	border: "#ECEFF1",
	chartColors: [
		"#5D48E5",
		"#03DAC5",
		"#FF9800",
		"#F44336",
		"#4CAF50",
		"#9C27B0",
		"#2196F3",
		"#795548",
		"#FF5722",
		"#607D8B",
	],
};

const generateCategoryData = (): SurveyResult[] => {
	const baseResults: SurveyResult[] = [
		{
			question: "How would you rate the overall event experience?",
			answers: [
				{
					option: "Excellent",
					count: 127,
					percentage: 42,
					color: COLORS.chartColors[0],
				},
				{
					option: "Good",
					count: 98,
					percentage: 33,
					color: COLORS.chartColors[1],
				},
				{
					option: "Average",
					count: 45,
					percentage: 15,
					color: COLORS.chartColors[2],
				},
				{
					option: "Below Average",
					count: 21,
					percentage: 7,
					color: COLORS.chartColors[3],
				},
				{
					option: "Poor",
					count: 9,
					percentage: 3,
					color: COLORS.chartColors[4],
				},
			],
			category: "general",
			responseRate: 87,
		},
		{
			question: "How would you rate the keynote speakers?",
			answers: [
				{
					option: "Exceptional",
					count: 142,
					percentage: 47,
					color: COLORS.chartColors[0],
				},
				{
					option: "Informative",
					count: 91,
					percentage: 30,
					color: COLORS.chartColors[1],
				},
				{
					option: "Satisfactory",
					count: 39,
					percentage: 13,
					color: COLORS.chartColors[2],
				},
				{
					option: "Lacking",
					count: 18,
					percentage: 6,
					color: COLORS.chartColors[3],
				},
				{
					option: "Disappointing",
					count: 10,
					percentage: 3,
					color: COLORS.chartColors[4],
				},
			],
			category: "speakers",
			responseRate: 92,
		},
		{
			question: "How satisfied were you with the venue facilities?",
			answers: [
				{
					option: "Very Satisfied",
					count: 105,
					percentage: 35,
					color: COLORS.chartColors[0],
				},
				{
					option: "Satisfied",
					count: 118,
					percentage: 39,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 51,
					percentage: 17,
					color: COLORS.chartColors[2],
				},
				{
					option: "Dissatisfied",
					count: 21,
					percentage: 7,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very Dissatisfied",
					count: 5,
					percentage: 2,
					color: COLORS.chartColors[4],
				},
			],
			category: "venue",
			responseRate: 81,
		},
		{
			question: "How would you rate the quality of refreshments?",
			answers: [
				{
					option: "Outstanding",
					count: 87,
					percentage: 29,
					color: COLORS.chartColors[0],
				},
				{
					option: "Good Quality",
					count: 102,
					percentage: 34,
					color: COLORS.chartColors[1],
				},
				{
					option: "Acceptable",
					count: 75,
					percentage: 25,
					color: COLORS.chartColors[2],
				},
				{
					option: "Needs Improvement",
					count: 27,
					percentage: 9,
					color: COLORS.chartColors[3],
				},
				{
					option: "Poor Quality",
					count: 9,
					percentage: 3,
					color: COLORS.chartColors[4],
				},
			],
			category: "catering",
			responseRate: 76,
		},
	];

	const specificResults: SurveyResult[] = [
		{
			question: "How engaging were the panel discussions?",
			answers: [
				{
					option: "Highly engaging",
					count: 135,
					percentage: 45,
					color: COLORS.chartColors[0],
				},
				{
					option: "Moderately engaging",
					count: 93,
					percentage: 31,
					color: COLORS.chartColors[1],
				},
				{
					option: "Somewhat engaging",
					count: 51,
					percentage: 17,
					color: COLORS.chartColors[2],
				},
				{
					option: "Minimally engaging",
					count: 15,
					percentage: 5,
					color: COLORS.chartColors[3],
				},
				{
					option: "Not engaging",
					count: 6,
					percentage: 2,
					color: COLORS.chartColors[4],
				},
			],
			category: "speakers",
			responseRate: 84,
		},
		{
			question: "How satisfied were you with the Q&A opportunities?",
			answers: [
				{
					option: "Very satisfied",
					count: 102,
					percentage: 34,
					color: COLORS.chartColors[0],
				},
				{
					option: "Satisfied",
					count: 114,
					percentage: 38,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 48,
					percentage: 16,
					color: COLORS.chartColors[2],
				},
				{
					option: "Dissatisfied",
					count: 27,
					percentage: 9,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very dissatisfied",
					count: 9,
					percentage: 3,
					color: COLORS.chartColors[4],
				},
			],
			category: "speakers",
			responseRate: 79,
		},

		{
			question: "How satisfied were you with the venue accessibility?",
			answers: [
				{
					option: "Very satisfied",
					count: 117,
					percentage: 39,
					color: COLORS.chartColors[0],
				},
				{
					option: "Satisfied",
					count: 123,
					percentage: 41,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 36,
					percentage: 12,
					color: COLORS.chartColors[2],
				},
				{
					option: "Dissatisfied",
					count: 18,
					percentage: 6,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very dissatisfied",
					count: 6,
					percentage: 2,
					color: COLORS.chartColors[4],
				},
			],
			category: "venue",
			responseRate: 88,
		},
		{
			question: "How would you rate the comfort of seating arrangements?",
			answers: [
				{
					option: "Very comfortable",
					count: 93,
					percentage: 31,
					color: COLORS.chartColors[0],
				},
				{
					option: "Comfortable",
					count: 126,
					percentage: 42,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 54,
					percentage: 18,
					color: COLORS.chartColors[2],
				},
				{
					option: "Uncomfortable",
					count: 24,
					percentage: 8,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very uncomfortable",
					count: 3,
					percentage: 1,
					color: COLORS.chartColors[4],
				},
			],
			category: "venue",
			responseRate: 82,
		},

		{
			question: "How would you rate the variety of food options?",
			answers: [
				{
					option: "Excellent variety",
					count: 78,
					percentage: 26,
					color: COLORS.chartColors[0],
				},
				{
					option: "Good variety",
					count: 111,
					percentage: 37,
					color: COLORS.chartColors[1],
				},
				{
					option: "Adequate variety",
					count: 81,
					percentage: 27,
					color: COLORS.chartColors[2],
				},
				{
					option: "Limited variety",
					count: 24,
					percentage: 8,
					color: COLORS.chartColors[3],
				},
				{
					option: "Poor variety",
					count: 6,
					percentage: 2,
					color: COLORS.chartColors[4],
				},
			],
			category: "catering",
			responseRate: 74,
		},
		{
			question: "How satisfied were you with dietary accommodation?",
			answers: [
				{
					option: "Very satisfied",
					count: 69,
					percentage: 23,
					color: COLORS.chartColors[0],
				},
				{
					option: "Satisfied",
					count: 114,
					percentage: 38,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 72,
					percentage: 24,
					color: COLORS.chartColors[2],
				},
				{
					option: "Dissatisfied",
					count: 36,
					percentage: 12,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very dissatisfied",
					count: 9,
					percentage: 3,
					color: COLORS.chartColors[4],
				},
			],
			category: "catering",
			responseRate: 70,
		},

		{
			question: "How likely are you to attend future events?",
			answers: [
				{
					option: "Very likely",
					count: 156,
					percentage: 52,
					color: COLORS.chartColors[0],
				},
				{
					option: "Likely",
					count: 87,
					percentage: 29,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 36,
					percentage: 12,
					color: COLORS.chartColors[2],
				},
				{
					option: "Unlikely",
					count: 15,
					percentage: 5,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very unlikely",
					count: 6,
					percentage: 2,
					color: COLORS.chartColors[4],
				},
			],
			category: "general",
			responseRate: 91,
		},
		{
			question: "How satisfied were you with event organization?",
			answers: [
				{
					option: "Very satisfied",
					count: 123,
					percentage: 41,
					color: COLORS.chartColors[0],
				},
				{
					option: "Satisfied",
					count: 108,
					percentage: 36,
					color: COLORS.chartColors[1],
				},
				{
					option: "Neutral",
					count: 42,
					percentage: 14,
					color: COLORS.chartColors[2],
				},
				{
					option: "Dissatisfied",
					count: 21,
					percentage: 7,
					color: COLORS.chartColors[3],
				},
				{
					option: "Very dissatisfied",
					count: 6,
					percentage: 2,
					color: COLORS.chartColors[4],
				},
			],
			category: "general",
			responseRate: 86,
		},
	];

	return [...baseResults, ...specificResults];
};

const generateMoodData = (category: string): MoodData[] => {
	const baseMoodData: MoodData[] = [
		{ name: "Inspired", value: 37, color: "#5D48E5", category: "general" },
		{ name: "Satisfied", value: 32, color: "#03DAC5", category: "general" },
		{ name: "Engaged", value: 25, color: "#4CAF50", category: "general" },
		{ name: "Neutral", value: 18, color: "#FF9800", category: "general" },
		{ name: "Disappointed", value: 8, color: "#F44336", category: "general" },
	];

	const categoryMoodData = {
		speakers: [
			{ name: "Inspired", value: 42, color: "#5D48E5", category: "speakers" },
			{ name: "Satisfied", value: 28, color: "#03DAC5", category: "speakers" },
			{ name: "Engaged", value: 21, color: "#4CAF50", category: "speakers" },
			{ name: "Neutral", value: 15, color: "#FF9800", category: "speakers" },
			{
				name: "Disappointed",
				value: 4,
				color: "#F44336",
				category: "speakers",
			},
		],
		venue: [
			{ name: "Impressed", value: 35, color: "#5D48E5", category: "venue" },
			{ name: "Comfortable", value: 31, color: "#03DAC5", category: "venue" },
			{ name: "Satisfied", value: 24, color: "#4CAF50", category: "venue" },
			{ name: "Neutral", value: 22, color: "#FF9800", category: "venue" },
			{ name: "Disappointed", value: 9, color: "#F44336", category: "venue" },
		],
		catering: [
			{ name: "Delighted", value: 32, color: "#5D48E5", category: "catering" },
			{ name: "Satisfied", value: 35, color: "#03DAC5", category: "catering" },
			{ name: "Content", value: 19, color: "#4CAF50", category: "catering" },
			{ name: "Neutral", value: 20, color: "#FF9800", category: "catering" },
			{
				name: "Disappointed",
				value: 14,
				color: "#F44336",
				category: "catering",
			},
		],
	};

	if (category === "home") {
		return baseMoodData;
	} else if (categoryMoodData[category as keyof typeof categoryMoodData]) {
		return categoryMoodData[category as keyof typeof categoryMoodData];
	}
	return baseMoodData;
};

const generateFeedbackComments = (): FeedbackComment[] => {
	return [
		{
			id: "1",
			text: "The keynote speaker was incredibly insightful and engaging throughout the presentation.",
			sentiment: "positive",
			time: "10:15 AM",
			category: "speakers",
		},
		{
			id: "2",
			text: "Registration process was smooth, but the WiFi connection was unreliable during the workshops.",
			sentiment: "neutral",
			time: "11:30 AM",
			category: "venue",
		},
		{
			id: "3",
			text: "Lunch options were limited for those with dietary restrictions.",
			sentiment: "negative",
			time: "1:15 PM",
			category: "catering",
		},
		{
			id: "4",
			text: "The interactive sessions were well-organized and provided valuable networking opportunities.",
			sentiment: "positive",
			time: "2:45 PM",
			category: "general",
		},
		{
			id: "5",
			text: "The panel discussion exceeded my expectations with diverse perspectives on industry trends.",
			sentiment: "positive",
			time: "4:00 PM",
			category: "speakers",
		},
		{
			id: "6",
			text: "The seats in the main hall were uncomfortable for long sessions. Consider better seating for future events.",
			sentiment: "negative",
			time: "11:45 AM",
			category: "venue",
		},
		{
			id: "7",
			text: "Coffee breaks were perfectly timed between sessions, keeping everyone energized.",
			sentiment: "positive",
			time: "2:30 PM",
			category: "catering",
		},
		{
			id: "8",
			text: "The event schedule was well-structured with a good balance of presentations and networking time.",
			sentiment: "positive",
			time: "5:15 PM",
			category: "general",
		},
		{
			id: "9",
			text: "The breakout session speaker seemed underprepared and didn't address key topics as promised.",
			sentiment: "negative",
			time: "3:20 PM",
			category: "speakers",
		},
		{
			id: "10",
			text: "The venue was difficult to navigate without proper signage. Spent too much time finding rooms.",
			sentiment: "negative",
			time: "9:45 AM",
			category: "venue",
		},
		{
			id: "11",
			text: "The dessert selection was outstanding! Particularly loved the mini cheesecakes.",
			sentiment: "positive",
			time: "1:50 PM",
			category: "catering",
		},
		{
			id: "12",
			text: "Event app was intuitive and helped me plan my day effectively. Great digital experience!",
			sentiment: "positive",
			time: "10:30 AM",
			category: "general",
		},
	];
};

const generateSentimentData = (
	category: string,
	timeframe: TimeFrame
): SentimentData[] => {
	const data: SentimentData[] = [];
	const times = [
		"9:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
	];

	let baseLevels = {
		general: { positive: 65, negative: 15, neutral: 20 },
		speakers: { positive: 70, negative: 12, neutral: 18 },
		venue: { positive: 60, negative: 20, neutral: 20 },
		catering: { positive: 55, negative: 25, neutral: 20 },
	};

	const baseLevel =
		baseLevels[category as keyof typeof baseLevels] || baseLevels.general;

	let positiveLevel = baseLevel.positive;
	let negativeLevel = baseLevel.negative;
	let neutralLevel = baseLevel.neutral;

	if (timeframe === "last24h") {
		positiveLevel = Math.min(80, positiveLevel + 5);
	} else if (timeframe === "morning") {
		positiveLevel = Math.max(50, positiveLevel - 10);
		negativeLevel = Math.min(30, negativeLevel + 5);
	} else if (timeframe === "afternoon") {
		positiveLevel = Math.min(80, positiveLevel + 8);
		negativeLevel = Math.max(5, negativeLevel - 5);
	}

	let filteredTimes = times;
	if (timeframe === "morning") {
		filteredTimes = times.slice(0, 4);
	} else if (timeframe === "afternoon") {
		filteredTimes = times.slice(4);
	}

	filteredTimes.forEach((time) => {
		let positiveChange, negativeChange;

		if (category === "speakers") {
			positiveChange = Math.floor(Math.random() * 14) - 6;
			negativeChange = Math.floor(Math.random() * 10) - 4;
		} else if (category === "catering") {
			const isMealTime = time === "12:00" || time === "13:00";
			positiveChange = Math.floor(Math.random() * 10) - 4;
			negativeChange =
				Math.floor(Math.random() * (isMealTime ? 16 : 8)) -
				(isMealTime ? 4 : 3);
		} else {
			positiveChange = Math.floor(Math.random() * 12) - 5;
			negativeChange = Math.floor(Math.random() * 10) - 4;
		}

		positiveLevel = Math.max(30, Math.min(75, positiveLevel + positiveChange));
		negativeLevel = Math.max(5, Math.min(40, negativeLevel + negativeChange));

		if (positiveLevel + negativeLevel > 100) {
			const scale = 95 / (positiveLevel + negativeLevel);
			positiveLevel = Math.round(positiveLevel * scale);
			negativeLevel = Math.round(negativeLevel * scale);
		}

		neutralLevel = Math.max(0, 100 - positiveLevel - negativeLevel);

		const sum = positiveLevel + negativeLevel + neutralLevel;
		if (sum !== 100) {
			positiveLevel += 100 - sum;
		}

		data.push({
			time,
			positive: positiveLevel,
			negative: negativeLevel,
			neutral: neutralLevel,
			total: Math.floor(Math.random() * 80) + 120,
			category,
		});
	});

	return data;
};

const EventFeedbackDashboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState("home");
	const [selectedTimeframe, setSelectedTimeframe] =
		useState<TimeFrame>("fullEvent");
	const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
	const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);
	const [moodData, setMoodData] = useState<MoodData[]>([]);
	const [feedbackComments, setFeedbackComments] = useState<FeedbackComment[]>(
		[]
	);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
	const [newDataReceived, setNewDataReceived] = useState(false);

	const headerAnimation = useAnimatedEntrance(0);
	const overviewAnimation = useAnimatedEntrance(100);
	const sentimentAnimation = useAnimatedEntrance(200);
	const surveyAnimation = useAnimatedEntrance(300);

	useEffect(() => {
		const allSurveyResults = generateCategoryData();
		setSurveyResults(allSurveyResults);
		setFeedbackComments(generateFeedbackComments());

		setSentimentData(generateSentimentData(activeTab, selectedTimeframe));
		setMoodData(generateMoodData(activeTab));

		setTimeout(() => {
			setShowNotification(true);
			setTimeout(() => setShowNotification(false), 4000);
		}, 15000);
	}, []);

	useEffect(() => {
		setSentimentData(generateSentimentData(activeTab, selectedTimeframe));
		setMoodData(generateMoodData(activeTab));
	}, [activeTab, selectedTimeframe]);

	useEffect(() => {
		const interval = setInterval(() => {
			setSentimentData((prev) => {
				if (prev.length === 0) return prev;

				const newData = [...prev];
				const lastItem = newData[newData.length - 1];

				const positiveChange = Math.floor(Math.random() * 8) - 3;
				const negativeChange = Math.floor(Math.random() * 6) - 2;

				let newPositive = Math.max(
					30,
					Math.min(75, lastItem.positive + positiveChange)
				);
				let newNegative = Math.max(
					5,
					Math.min(40, lastItem.negative + negativeChange)
				);

				if (newPositive + newNegative > 100) {
					const scale = 95 / (newPositive + newNegative);
					newPositive = Math.round(newPositive * scale);
					newNegative = Math.round(newNegative * scale);
				}

				const newNeutral = Math.max(0, 100 - newPositive - newNegative);

				const sum = newPositive + newNegative + newNeutral;
				if (sum !== 100) {
					newPositive += 100 - sum;
				}

				newData[newData.length - 1] = {
					...lastItem,
					positive: newPositive,
					negative: newNegative,
					neutral: newNeutral,
					total: lastItem.total + Math.floor(Math.random() * 10) + 2,
				};

				setLastUpdateTime(new Date());
				setNewDataReceived(true);
				setTimeout(() => setNewDataReceived(false), 2000);

				return newData;
			});
		}, 4000);

		return () => clearInterval(interval);
	}, []);

	const getFilteredQuestions = () => {
		if (activeTab === "home") {
			return surveyResults
				.filter((item) => item.category === "general")
				.slice(0, 2);
		}

		return surveyResults.filter((item) => item.category === activeTab);
	};

	const getFilteredComments = () => {
		if (activeTab === "home") {
			return feedbackComments.slice(0, 3);
		}

		return feedbackComments.filter((item) => item.category === activeTab);
	};

	const getSentimentSummary = () => {
		const lastSentiment = sentimentData[sentimentData.length - 1] || {
			positive: 0,
			negative: 0,
			neutral: 0,
		};

		return [
			{
				name: "Positive",
				value: lastSentiment.positive,
				color: COLORS.positive,
			},
			{ name: "Neutral", value: lastSentiment.neutral, color: COLORS.neutral },
			{
				name: "Negative",
				value: lastSentiment.negative,
				color: COLORS.negative,
			},
		];
	};

	const handleRefresh = () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setSentimentData(generateSentimentData(activeTab, selectedTimeframe));
			setMoodData(generateMoodData(activeTab));
			setIsRefreshing(false);
			setLastUpdateTime(new Date());

			setShowNotification(true);
			setTimeout(() => setShowNotification(false), 3000);
		}, 1000);
	};

	const handleTimeframeSelect = (timeframe: TimeFrame) => {
		setSelectedTimeframe(timeframe);
		setFilterOpen(false);
	};

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
					<p className="font-semibold text-gray-800">
						{label || payload[0].name}
					</p>
					{payload.map((entry: any, index: number) => (
						<div key={index} className="flex items-center mt-1">
							<div
								className="w-3 h-3 rounded-full mr-2"
								style={{ backgroundColor: entry.color || entry.fill }}
							></div>
							<span className="text-gray-600">{entry.name}: </span>
							<span className="font-medium ml-1">{entry.value}%</span>
						</div>
					))}
				</div>
			);
		}
		return null;
	};

	const getAverageResponseRate = () => {
		if (activeTab === "home") {
			return Math.round(
				surveyResults.reduce((sum, item) => sum + item.responseRate, 0) /
					surveyResults.length
			);
		}

		const filteredResults = surveyResults.filter(
			(item) => item.category === activeTab
		);

		if (filteredResults.length === 0) return 0;

		return Math.round(
			filteredResults.reduce((sum, item) => sum + item.responseRate, 0) /
				filteredResults.length
		);
	};

	const formatUpdateTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const getSentimentTrend = () => {
		if (sentimentData.length < 2) return { direction: "up", value: 0 };

		const lastItem = sentimentData[sentimentData.length - 1];
		const previousItem = sentimentData[sentimentData.length - 2];

		const difference = lastItem.positive - previousItem.positive;

		return {
			direction: difference >= 0 ? "up" : "down",
			value: Math.abs(difference).toFixed(1),
		};
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("en-US").format(num);
	};

	function useAnimatedEntrance(delay = 0) {
		const [isVisible, setIsVisible] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		useEffect(() => {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							setIsVisible(true);
						}, delay);
						observer.unobserve(entry.target);
					}
				},
				{ threshold: 0.1 }
			);

			if (ref.current) {
				observer.observe(ref.current);
			}

			return () => {
				if (ref.current) {
					observer.unobserve(ref.current);
				}
			};
		}, [delay]);

		return {
			ref,
			style: {
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? "translateY(0)" : "translateY(20px)",
				transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
			},
		};
	}
	const CustomYAxisTick = (props) => {
		const { x, y, payload } = props;
		// Ensure text is always a string
		const text = String(payload.value || "");
		const maxWidth = 80;
		const maxCharsPerLine = 12;


		if (!text) {
			return (
				<g transform={`translate(${x},${y})`}>
					<text x={0} y={0} textAnchor="end" fontSize={11} fill="#666">
						{payload.value}
					</text>
				</g>
			);
		}

		const words = text.split(" ");
		const lines = [];
		let currentLine = "";

		words.forEach((word) => {
			if ((currentLine + word).length <= maxCharsPerLine) {
				currentLine += (currentLine ? " " : "") + word;
			} else {
				if (currentLine) lines.push(currentLine);
				currentLine = word;
			}
		});
		if (currentLine) lines.push(currentLine);

		return (
			<g transform={`translate(${x},${y})`}>
				{lines.map((line, index) => (
					<text
						key={index}
						x={0}
						y={index * 12 - (lines.length - 1) * 6}
						textAnchor="end"
						fontSize={11}
						fill="#666"
					>
						{line}
					</text>
				))}
			</g>
		);
	};

	const getTimeframeLabel = () => {
		switch (selectedTimeframe) {
			case "last24h":
				return "Last 24 Hours";
			case "fullEvent":
				return "Full Event";
			case "morning":
				return "Morning Sessions";
			case "afternoon":
				return "Afternoon Sessions";
			default:
				return "Full Event";
		}
	};

	return (
		<div
			className="flex flex-col min-h-screen bg-gray-50"
			style={{ backgroundColor: COLORS.background }}
		>
			<div
				className={`fixed top-4 left-0 right-0 mx-auto w-11/12 max-w-sm bg-white rounded-lg shadow-lg border-l-4 border-indigo-500 p-4 z-50 transition-all duration-300 transform ${
					showNotification
						? "translate-y-0 opacity-100"
						: "-translate-y-24 opacity-0"
				}`}
			>
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<MdNotifications className="h-6 w-6 text-indigo-500" />
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-800">
							New feedback received
						</p>
						<p className="text-xs text-gray-500">
							12 new responses in the last 5 minutes
						</p>
					</div>
				</div>
			</div>

			<header
				className="bg-white text-gray-800 px-5 pt-6 pb-4 shadow-sm sticky top-0 z-10"
				ref={headerAnimation.ref}
				style={headerAnimation.style}
			>
				<div className="flex justify-between items-center mb-2">
					<h1 className="text-xl font-bold text-gray-900">Feedback Insights</h1>
					<div className="flex space-x-3">
						<button
							onClick={handleRefresh}
							className={`p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all ${
								isRefreshing ? "animate-spin" : ""
							}`}
							aria-label="Refresh data"
						>
							<MdRefresh size={20} />
						</button>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<div>
						<p className="text-sm font-medium text-gray-900">
							Summit 2025 •{" "}
							<span className="text-indigo-600">
								{formatNumber(300)} responses
							</span>
						</p>
						<p
							className={`text-xs ${
								newDataReceived ? "text-green-600 font-medium" : "text-gray-500"
							} mt-0.5 transition-colors duration-500`}
						>
							Last updated: {formatUpdateTime(lastUpdateTime)}
							{newDataReceived && " • New data"}
						</p>
					</div>
					<div className="flex items-center">
						<button
							onClick={() => setFilterOpen(!filterOpen)}
							className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all ${
								filterOpen
									? "bg-indigo-100 text-indigo-700"
									: "bg-gray-100 text-gray-600"
							}`}
							aria-label="Filter options"
							aria-expanded={filterOpen}
						>
							<MdFilterList size={16} className="mr-1" />
							{getTimeframeLabel()}
						</button>
					</div>
				</div>

				{filterOpen && (
					<div className="absolute top-full left-0 right-0 bg-white shadow-md rounded-b-lg p-4 border-t border-gray-100 z-20 mt-1 animate-fadeIn">
						<div className="grid grid-cols-2 gap-3">
							<button
								className={`px-3 py-2 rounded-lg text-sm font-medium ${
									selectedTimeframe === "last24h"
										? "bg-indigo-50 text-indigo-700"
										: "bg-gray-100 text-gray-700"
								}`}
								onClick={() => handleTimeframeSelect("last24h")}
								aria-pressed={selectedTimeframe === "last24h"}
							>
								Last 24 Hours
							</button>
							<button
								className={`px-3 py-2 rounded-lg text-sm font-medium ${
									selectedTimeframe === "fullEvent"
										? "bg-indigo-50 text-indigo-700"
										: "bg-gray-100 text-gray-700"
								}`}
								onClick={() => handleTimeframeSelect("fullEvent")}
								aria-pressed={selectedTimeframe === "fullEvent"}
							>
								Full Event
							</button>
							<button
								className={`px-3 py-2 rounded-lg text-sm font-medium ${
									selectedTimeframe === "morning"
										? "bg-indigo-50 text-indigo-700"
										: "bg-gray-100 text-gray-700"
								}`}
								onClick={() => handleTimeframeSelect("morning")}
								aria-pressed={selectedTimeframe === "morning"}
							>
								Morning Sessions
							</button>
							<button
								className={`px-3 py-2 rounded-lg text-sm font-medium ${
									selectedTimeframe === "afternoon"
										? "bg-indigo-50 text-indigo-700"
										: "bg-gray-100 text-gray-700"
								}`}
								onClick={() => handleTimeframeSelect("afternoon")}
								aria-pressed={selectedTimeframe === "afternoon"}
							>
								Afternoon Sessions
							</button>
						</div>
					</div>
				)}
			</header>

			<main className="flex-1 overflow-y-auto px-4 pb-20">
				<section
					className="mb-6 mt-5"
					ref={overviewAnimation.ref}
					style={overviewAnimation.style}
				>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold text-gray-800">
							{activeTab === "home"
								? "Event Overview"
								: activeTab.charAt(0).toUpperCase() +
								  activeTab.slice(1) +
								  " Feedback"}
						</h2>
						<span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
							{getAverageResponseRate()}% Response Rate
						</span>
					</div>

					<div className="grid grid-cols-2 gap-3 mb-5">
						<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<div className="flex flex-col h-full">
								<span className="text-xs text-gray-500 mb-1">
									Sentiment Score
								</span>
								<div className="flex items-baseline space-x-1">
									<span className="text-2xl font-bold text-gray-900">
										{(sentimentData.length > 0
											? sentimentData[sentimentData.length - 1].positive / 10
											: 0
										).toFixed(1)}
									</span>
									<span
										className={`text-xs ${
											getSentimentTrend().direction === "up"
												? "text-green-600"
												: "text-red-500"
										} font-medium flex items-center`}
									>
										{getSentimentTrend().direction === "up" ? (
											<MdArrowUpward size={12} />
										) : (
											<MdArrowDownward size={12} />
										)}
										{getSentimentTrend().value}
									</span>
								</div>
								<div className="flex-1 flex items-end mt-1">
									<div className="w-full bg-gray-100 rounded-full h-2">
										<div
											className={`h-2 rounded-full ${
												newDataReceived ? "bg-green-500" : "bg-indigo-600"
											} transition-colors duration-500`}
											style={{
												width: `${
													sentimentData.length > 0
														? sentimentData[sentimentData.length - 1].positive
														: 0
												}%`,
											}}
										></div>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
							<div className="flex flex-col h-full">
								<span className="text-xs text-gray-500 mb-1">Engagement</span>
								<div className="flex items-baseline space-x-1">
									<span className="text-2xl font-bold text-gray-900">
										{formatNumber(
											sentimentData.reduce((sum, item) => sum + item.total, 0)
										)}
									</span>
									<span className="text-xs text-green-600 font-medium flex items-center">
										<MdArrowUpward size={12} />
										{selectedTimeframe === "last24h"
											? "32%"
											: selectedTimeframe === "morning"
											? "18%"
											: "27%"}
									</span>
								</div>
								<div className="flex-1 flex items-end flex-wrap justify-between mt-1">
									<div className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></div>
										<span className="text-xs text-gray-500">Comments</span>
									</div>
									<div className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-teal-500 mr-1"></div>
										<span className="text-xs text-gray-500">Reactions</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100">
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-sm font-medium text-gray-800">
								Mood Distribution
							</h3>
							<button className="text-xs text-indigo-600 font-medium">
								View All
							</button>
						</div>
						<div className="h-56">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={moodData}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={80}
										paddingAngle={3}
										dataKey="value"
										cornerRadius={5}
										animationBegin={0}
										animationDuration={800}
									>
										{moodData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
												stroke={entry.color}
												strokeWidth={1}
											/>
										))}
									</Pie>
									<Tooltip content={<CustomTooltip />} />
									<Legend
										layout="horizontal"
										verticalAlign="bottom"
										align="center"
										iconType="circle"
										iconSize={8}
										formatter={(value) => (
											<span className="text-xs font-medium text-gray-700">
												{value}
											</span>
										)}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>

				<section
					className="mb-6"
					ref={sentimentAnimation.ref}
					style={sentimentAnimation.style}
				>
					<div className="flex justify-between flex-wrap items-center mb-4">
						<h2 className="text-lg font-semibold text-gray-800">
							Sentiment Trends
						</h2>
						<div className="flex items-center">
							<div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
							<span className="text-xs text-gray-600 mr-3">Positive</span>
							<div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
							<span className="text-xs text-gray-600 mr-3">Neutral</span>
							<div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
							<span className="text-xs text-gray-600">Negative</span>
						</div>
					</div>

					<div
						className={`bg-white rounded-xl shadow-sm p-4 mb-5 border ${
							newDataReceived ? "border-green-400" : "border-gray-100"
						} transition-colors duration-500`}
					>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={sentimentData}
									animationBegin={0}
									animationDuration={500}
								>
									<defs>
										<linearGradient
											id="colorPositive"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor={COLORS.positive}
												stopOpacity={0.8}
											/>
											<stop
												offset="95%"
												stopColor={COLORS.positive}
												stopOpacity={0.1}
											/>
										</linearGradient>
										<linearGradient
											id="colorNeutral"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor={COLORS.neutral}
												stopOpacity={0.8}
											/>
											<stop
												offset="95%"
												stopColor={COLORS.neutral}
												stopOpacity={0.1}
											/>
										</linearGradient>
										<linearGradient
											id="colorNegative"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor={COLORS.negative}
												stopOpacity={0.8}
											/>
											<stop
												offset="95%"
												stopColor={COLORS.negative}
												stopOpacity={0.1}
											/>
										</linearGradient>
									</defs>
									<XAxis
										dataKey="time"
										tick={{ fontSize: 10 }}
										tickLine={false}
										axisLine={{ stroke: "#E0E0E0" }}
									/>
									<YAxis hide domain={[0, 100]} />
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke="#F5F5F5"
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey="positive"
										stackId="1"
										stroke={COLORS.positive}
										fillOpacity={1}
										fill="url(#colorPositive)"
									/>
									<Area
										type="monotone"
										dataKey="neutral"
										stackId="1"
										stroke={COLORS.neutral}
										fillOpacity={1}
										fill="url(#colorNeutral)"
									/>
									<Area
										type="monotone"
										dataKey="negative"
										stackId="1"
										stroke={COLORS.negative}
										fillOpacity={1}
										fill="url(#colorNegative)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
						<div className="flex justify-between items-center text-xs text-gray-500 mt-2">
							<span>
								{sentimentData.length > 0 ? sentimentData[0].time : "9:00"} AM
							</span>
							<div className="flex items-center font-medium text-indigo-600">
								<span>Overall: </span>
								<span
									className={`ml-1 ${
										getSentimentTrend().direction === "up"
											? "text-green-600"
											: "text-red-500"
									} flex items-center`}
								>
									{getSentimentTrend().direction === "up" ? (
										<>
											<MdArrowUpward size={12} className="mr-0.5" />
											Trending Positive
										</>
									) : (
										<>
											<MdArrowDownward size={12} className="mr-0.5" />
											Trending Negative
										</>
									)}
								</span>
							</div>
							<span>
								{sentimentData.length > 0
									? sentimentData[sentimentData.length - 1].time
									: "5:00"}{" "}
								PM
							</span>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100">
						<h3 className="text-sm font-medium text-gray-800 mb-3">
							Current Sentiment
						</h3>
						<div className="flex items-center justify-between">
							<div className="h-16 w-40">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={getSentimentSummary()}
										layout="vertical"
										barCategoryGap={8}
										animationBegin={0}
										animationDuration={800}
									>
										<XAxis type="number" hide domain={[0, 100]} />
										<YAxis
											dataKey="name"
											type="category"
											axisLine={false}
											tickLine={false}
											tick={{ fontSize: 11 }}
											width={70}
										/>
										<Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10}>
											{getSentimentSummary().map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
											<LabelList
												dataKey="value"
												position="right"
												formatter={(value: number) => `${value}%`}
												style={{ fontSize: 11, fill: "#666" }}
											/>
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>

							<div className="flex-1 flex justify-center">
								<div className="w-24 h-24">
									<ResponsiveContainer width="100%" height="100%">
										<RadialBarChart
											innerRadius="70%"
											outerRadius="100%"
											data={getSentimentSummary()}
											startAngle={90}
											endAngle={-270}
											animationBegin={0}
											animationDuration={800}
										>
											<RadialBar
												background
												dataKey="value"
												cornerRadius={10}
												label={false}
											>
												{getSentimentSummary().map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</RadialBar>
											<text
												x="50%"
												y="50%"
												textAnchor="middle"
												dominantBaseline="middle"
												className="text-lg font-bold"
												fill="#333"
											>
												{sentimentData[sentimentData.length - 1]?.positive || 0}
												%
											</text>
										</RadialBarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-sm font-medium text-gray-800">
								Recent Comments
							</h3>
							<button className="text-xs text-indigo-600 font-medium">
								View All
							</button>
						</div>
						<div className="space-y-3">
							{getFilteredComments().map((comment, index) => (
								<div
									key={comment.id}
									className="p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all"
								>
									<div className="flex justify-between items-start mb-1">
										<div className="flex items-center">
											<div
												className={`w-2 h-2 rounded-full mr-2 ${
													comment.sentiment === "positive"
														? "bg-green-500"
														: comment.sentiment === "negative"
														? "bg-red-500"
														: "bg-orange-400"
												}`}
											></div>
											<span className="text-xs font-medium text-gray-500">
												{comment.time}
											</span>
										</div>
										<button className="text-gray-400 hover:text-gray-600">
											<MdMoreVert size={16} />
										</button>
									</div>
									<p className="text-sm text-gray-700">{comment.text}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section
					className="mb-6"
					ref={surveyAnimation.ref}
					style={surveyAnimation.style}
				>
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Survey Results
					</h2>

					{getFilteredQuestions().map((item, index) => (
						<div
							key={index}
							className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100"
						>
							<div className="flex justify-between items-start mb-1">
								<h3 className="text-sm font-medium text-gray-800">
									{item.question}
								</h3>
								<span className="text-xs bg-indigo-100 text-indigo-700 p-2 rounded-lg font-medium">
									{item.responseRate}% Response
								</span>
							</div>
							<div className="h-52">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={item.answers}
										layout="vertical"
										barCategoryGap={8}
										margin={{ top: 5, left: 5, right: 30, bottom: 5 }}
										animationBegin={0}
										animationDuration={800}
									>
										<XAxis
											type="number"
											domain={[0, 100]}
											tickFormatter={(value) => `${value}%`}
											tick={{ fontSize: 10 }}
											tickLine={false}
											axisLine={{ stroke: "#E0E0E0" }}
										/>
										<YAxis
											dataKey="option"
											type="category"
											width={85}
											tick={<CustomYAxisTick />}
											tickLine={false}
											axisLine={false}
										/>
										<CartesianGrid
											strokeDasharray="3 3"
											horizontal={true}
											vertical={false}
											stroke="#F5F5F5"
										/>
										<Tooltip content={<CustomTooltip />} />
										<Bar
											dataKey="percentage"
											radius={[0, 4, 4, 0]}
											barSize={16}
										>
											{item.answers.map((entry, i) => (
												<Cell key={`cell-${i}`} fill={entry.color} />
											))}
											<LabelList
												dataKey="percentage"
												position="right"
												formatter={(value) => `${value}%`}
												style={{ fontSize: 11, fill: "#666" }}
											/>
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
							<div className="flex items-center justify-center mt-2">
								<span className="text-xs text-gray-500">
									Total responses:{" "}
									{formatNumber(
										item.answers.reduce((sum, ans) => sum + ans.count, 0)
									)}
								</span>
							</div>
						</div>
					))}
				</section>
			</main>

			<nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-20">
				<div className="flex justify-around py-2 px-1">
					<button
						onClick={() => setActiveTab("home")}
						className={`flex flex-col items-center p-2 rounded-md transition-all ${
							activeTab === "home"
								? "text-indigo-600 bg-indigo-50"
								: "text-gray-500 hover:bg-gray-50"
						}`}
						aria-label="Overview tab"
						aria-current={activeTab === "home" ? "page" : undefined}
					>
						<MdDashboard size={22} />
						<span className="text-xs mt-1 font-medium">Overview</span>
					</button>
					<button
						onClick={() => setActiveTab("general")}
						className={`flex flex-col items-center p-2 rounded-md transition-all ${
							activeTab === "general"
								? "text-indigo-600 bg-indigo-50"
								: "text-gray-500 hover:bg-gray-50"
						}`}
						aria-label="General tab"
						aria-current={activeTab === "general" ? "page" : undefined}
					>
						<MdAssessment size={22} />
						<span className="text-xs mt-1 font-medium">General</span>
					</button>
					<button
						onClick={() => setActiveTab("speakers")}
						className={`flex flex-col items-center p-2 rounded-md transition-all ${
							activeTab === "speakers"
								? "text-indigo-600 bg-indigo-50"
								: "text-gray-500 hover:bg-gray-50"
						}`}
						aria-label="Speakers tab"
						aria-current={activeTab === "speakers" ? "page" : undefined}
					>
						<MdMic size={22} />
						<span className="text-xs mt-1 font-medium">Speakers</span>
					</button>
					<button
						onClick={() => setActiveTab("venue")}
						className={`flex flex-col items-center p-2 rounded-md transition-all ${
							activeTab === "venue"
								? "text-indigo-600 bg-indigo-50"
								: "text-gray-500 hover:bg-gray-50"
						}`}
						aria-label="Venue tab"
						aria-current={activeTab === "venue" ? "page" : undefined}
					>
						<MdLocationOn size={22} />
						<span className="text-xs mt-1 font-medium">Venue</span>
					</button>
					<button
						onClick={() => setActiveTab("catering")}
						className={`flex flex-col items-center p-2 rounded-md transition-all ${
							activeTab === "catering"
								? "text-indigo-600 bg-indigo-50"
								: "text-gray-500 hover:bg-gray-50"
						}`}
						aria-label="Catering tab"
						aria-current={activeTab === "catering" ? "page" : undefined}
					>
						<MdRestaurant size={22} />
						<span className="text-xs mt-1 font-medium">Catering</span>
					</button>
				</div>
			</nav>

			<style jsx>{`
				@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

				* {
					font-family: "Poppins", sans-serif;
				}
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out forwards;
				}

				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.6;
					}
				}

				.animate-pulse {
					animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
				}

				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}

				.animate-spin {
					animation: spin 1s linear infinite;
				}
			`}</style>
		</div>
	);
};

export default EventFeedbackDashboard;
