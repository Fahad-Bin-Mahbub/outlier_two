"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
	FaChevronDown,
	FaUsers,
	FaChartPie,
	FaThermometerHalf,
	FaTh,
	FaFilter,
	FaCircle,
	FaSmile,
	FaMeh,
	FaFrown,
	FaClock,
	FaLightbulb,
	FaComments,
	FaChartBar,
	FaRegCopyright,
	FaHeart,
	FaRegFileAlt,
	FaChartLine,
	FaStar,
	FaBars,
	FaTimes,
} from "react-icons/fa";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip as RechartsTooltip,
} from "recharts";

type SentimentScore = number;

interface Answer {
	questionId: string;
	value: string;
	sentiment: SentimentScore;
}

interface SurveyResponse {
	id: number;
	ageGroup: "18-24" | "25-34" | "35-44" | "45+";
	gender: "Male" | "Female" | "Other";
	location: "Urban" | "Suburban" | "Rural";
	answers: Answer[];
}

interface Filters {
	ageGroup: string;
	gender: string;
	location: string;
}

interface TooltipData {
	content: string;
	x: number;
	y: number;
	visible: boolean;
}

const questions = [
	{ id: "q1", text: "How satisfied are you with the product quality?" },
	{ id: "q2", text: "Was the user interface intuitive?" },
	{ id: "q3", text: "How would you rate our customer support?" },
	{ id: "q4", text: "Is the pricing fair for the value offered?" },
];

const surveyData: SurveyResponse[] = [
	{
		id: 1,
		ageGroup: "25-34",
		gender: "Female",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Very Satisfied", sentiment: 0.9 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Excellent", sentiment: 1.0 },
			{ questionId: "q4", value: "Agree", sentiment: 0.7 },
		],
	},
	{
		id: 2,
		ageGroup: "18-24",
		gender: "Male",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.0 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.2 },
			{ questionId: "q3", value: "Average", sentiment: 0.1 },
			{ questionId: "q4", value: "Disagree", sentiment: -0.6 },
		],
	},
	{
		id: 3,
		ageGroup: "35-44",
		gender: "Male",
		location: "Rural",
		answers: [
			{ questionId: "q1", value: "Dissatisfied", sentiment: -0.7 },
			{ questionId: "q2", value: "No", sentiment: -0.9 },
			{ questionId: "q3", value: "Poor", sentiment: -0.8 },
			{ questionId: "q4", value: "Strongly Disagree", sentiment: -1.0 },
		],
	},
	{
		id: 4,
		ageGroup: "45+",
		gender: "Female",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.6 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Good", sentiment: 0.7 },
			{ questionId: "q4", value: "Agree", sentiment: 0.5 },
		],
	},
	{
		id: 5,
		ageGroup: "25-34",
		gender: "Other",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Very Satisfied", sentiment: 1.0 },
			{ questionId: "q2", value: "Yes", sentiment: 1.0 },
			{ questionId: "q3", value: "Good", sentiment: 0.6 },
			{ questionId: "q4", value: "Neutral", sentiment: 0.0 },
		],
	},
	{
		id: 6,
		ageGroup: "35-44",
		gender: "Female",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.5 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.3 },
			{ questionId: "q3", value: "Average", sentiment: 0.2 },
			{ questionId: "q4", value: "Agree", sentiment: 0.4 },
		],
	},
	{
		id: 7,
		ageGroup: "18-24",
		gender: "Male",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.1 },
			{ questionId: "q2", value: "No", sentiment: -0.5 },
			{ questionId: "q3", value: "Poor", sentiment: -0.7 },
			{ questionId: "q4", value: "Disagree", sentiment: -0.4 },
		],
	},
	{
		id: 8,
		ageGroup: "45+",
		gender: "Male",
		location: "Rural",
		answers: [
			{ questionId: "q1", value: "Very Satisfied", sentiment: 0.9 },
			{ questionId: "q2", value: "Yes", sentiment: 0.7 },
			{ questionId: "q3", value: "Excellent", sentiment: 0.9 },
			{ questionId: "q4", value: "Strongly Agree", sentiment: 1.0 },
		],
	},
	{
		id: 9,
		ageGroup: "25-34",
		gender: "Male",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.5 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.4 },
			{ questionId: "q3", value: "Good", sentiment: 0.7 },
			{ questionId: "q4", value: "Neutral", sentiment: 0.1 },
		],
	},
	{
		id: 10,
		ageGroup: "35-44",
		gender: "Other",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.0 },
			{ questionId: "q2", value: "Yes", sentiment: 0.6 },
			{ questionId: "q3", value: "Good", sentiment: 0.6 },
			{ questionId: "q4", value: "Agree", sentiment: 0.4 },
		],
	},
	{
		id: 11,
		ageGroup: "18-24",
		gender: "Female",
		location: "Rural",
		answers: [
			{ questionId: "q1", value: "Dissatisfied", sentiment: -0.6 },
			{ questionId: "q2", value: "No", sentiment: -0.7 },
			{ questionId: "q3", value: "Poor", sentiment: -0.8 },
			{ questionId: "q4", value: "Strongly Disagree", sentiment: -0.9 },
		],
	},
	{
		id: 12,
		ageGroup: "45+",
		gender: "Other",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Very Satisfied", sentiment: 0.8 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Excellent", sentiment: 0.9 },
			{ questionId: "q4", value: "Agree", sentiment: 0.7 },
		],
	},
	{
		id: 13,
		ageGroup: "25-34",
		gender: "Female",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.7 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Good", sentiment: 0.6 },
			{ questionId: "q4", value: "Agree", sentiment: 0.5 },
		],
	},
	{
		id: 14,
		ageGroup: "18-24",
		gender: "Other",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.1 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.3 },
			{ questionId: "q3", value: "Average", sentiment: 0.1 },
			{ questionId: "q4", value: "Neutral", sentiment: 0.0 },
		],
	},
	{
		id: 15,
		ageGroup: "35-44",
		gender: "Female",
		location: "Rural",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.5 },
			{ questionId: "q2", value: "Yes", sentiment: 0.6 },
			{ questionId: "q3", value: "Good", sentiment: 0.7 },
			{ questionId: "q4", value: "Agree", sentiment: 0.6 },
		],
	},
	{
		id: 16,
		ageGroup: "45+",
		gender: "Male",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Very Satisfied", sentiment: 0.9 },
			{ questionId: "q2", value: "Yes", sentiment: 0.9 },
			{ questionId: "q3", value: "Excellent", sentiment: 1.0 },
			{ questionId: "q4", value: "Strongly Agree", sentiment: 1.0 },
		],
	},
	{
		id: 17,
		ageGroup: "25-34",
		gender: "Male",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.0 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.2 },
			{ questionId: "q3", value: "Average", sentiment: 0.2 },
			{ questionId: "q4", value: "Disagree", sentiment: -0.5 },
		],
	},
	{
		id: 18,
		ageGroup: "18-24",
		gender: "Female",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Dissatisfied", sentiment: -0.6 },
			{ questionId: "q2", value: "No", sentiment: -0.8 },
			{ questionId: "q3", value: "Poor", sentiment: -0.8 },
			{ questionId: "q4", value: "Strongly Disagree", sentiment: -1.0 },
		],
	},
	{
		id: 19,
		ageGroup: "35-44",
		gender: "Other",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.7 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Good", sentiment: 0.8 },
			{ questionId: "q4", value: "Agree", sentiment: 0.6 },
		],
	},
	{
		id: 20,
		ageGroup: "45+",
		gender: "Female",
		location: "Rural",
		answers: [
			{ questionId: "q1", value: "Very Satisfied", sentiment: 0.8 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Excellent", sentiment: 0.9 },
			{ questionId: "q4", value: "Agree", sentiment: 0.7 },
		],
	},
	{
		id: 21,
		ageGroup: "25-34",
		gender: "Other",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.7 },
			{ questionId: "q2", value: "Yes", sentiment: 0.9 },
			{ questionId: "q3", value: "Good", sentiment: 0.8 },
			{ questionId: "q4", value: "Agree", sentiment: 0.7 },
		],
	},
	{
		id: 22,
		ageGroup: "35-44",
		gender: "Male",
		location: "Urban",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.0 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.2 },
			{ questionId: "q3", value: "Average", sentiment: 0.1 },
			{ questionId: "q4", value: "Disagree", sentiment: -0.5 },
		],
	},
	{
		id: 23,
		ageGroup: "18-24",
		gender: "Other",
		location: "Rural",
		answers: [
			{ questionId: "q1", value: "Neutral", sentiment: 0.1 },
			{ questionId: "q2", value: "Somewhat", sentiment: 0.3 },
			{ questionId: "q3", value: "Average", sentiment: 0.1 },
			{ questionId: "q4", value: "Neutral", sentiment: 0.0 },
		],
	},
	{
		id: 24,
		ageGroup: "45+",
		gender: "Male",
		location: "Suburban",
		answers: [
			{ questionId: "q1", value: "Satisfied", sentiment: 0.7 },
			{ questionId: "q2", value: "Yes", sentiment: 0.8 },
			{ questionId: "q3", value: "Good", sentiment: 0.8 },
			{ questionId: "q4", value: "Agree", sentiment: 0.6 },
		],
	},
];

const pieColors = [
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#f97316",
	"#06b6d4",
	"#84cc16",
];

function sentimentToBg(sent: SentimentScore) {
	if (sent > 0.1) return "bg-emerald-500";
	if (sent < -0.1) return "bg-red-500";
	return "bg-amber-500";
}

const fillBarColor = (
	category: "Positive" | "Neutral" | "Negative",
	pct: number
) => {
	if (category === "Positive") {
		return `linear-gradient(90deg, #dcfce7 0%, #10b981 ${pct * 100}%, #dcfce7 ${
			pct * 100
		}%)`;
	}
	if (category === "Neutral") {
		return `linear-gradient(90deg, #fef3c7 0%, #f59e0b ${pct * 100}%, #fef3c7 ${
			pct * 100
		}%)`;
	}
	return `linear-gradient(90deg, #fee2e2 0%, #ef4444 ${pct * 100}%, #fee2e2 ${
		pct * 100
	}%)`;
};

const Tooltip: React.FC<{ data: TooltipData }> = ({ data }) =>
	data.visible ? (
		<div
			className="fixed z-50 px-4 py-3 rounded-2xl text-sm max-w-xs bg-slate-900 text-white shadow-2xl pointer-events-none border border-slate-700"
			style={{
				left: data.x + 10,
				top: data.y + 10,
				whiteSpace: "pre-line",
				opacity: data.visible ? 1 : 0,
				transition: "opacity 0.2s",
				backdropFilter: "blur(20px)",
			}}
		>
			{data.content}
		</div>
	) : null;

const StatCard: React.FC<{
	title: string;
	value: string | number;
	icon: React.ReactNode;
	color: string;
}> = ({ title, value, icon, color }) => (
	<div
		className={`bg-white rounded-2xl shadow-lg border-l-4 border-${color}-500 p-4 flex items-center`}
	>
		<div
			className={`w-12 h-12 rounded-xl bg-${color}-100 text-${color}-600 flex items-center justify-center mr-4 flex-shrink-0`}
		>
			{icon}
		</div>
		<div className="flex-1">
			<h3 className="text-sm font-medium text-slate-500">{title}</h3>
			<div className="text-xl font-bold text-slate-800">{value}</div>
		</div>
	</div>
);

const DashboardCard: React.FC<{
	title: string;
	children: React.ReactNode;
	className?: string;
	icon?: React.ReactNode;
	accentColor?: string;
}> = ({ title, children, className = "", icon, accentColor = "indigo" }) => (
	<section
		className={`relative bg-white rounded-3xl p-4 sm:p-6 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${className}`}
		style={{
			background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
			boxShadow:
				"0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
		}}
	>
		<div
			className={`absolute top-0 left-0 w-full h-1 bg-${accentColor}-500`}
		></div>
		<h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 mb-4 sm:mb-6 flex items-center gap-3">
			{icon && (
				<span className={`text-${accentColor}-600 text-xl`}>{icon}</span>
			)}
			{title}
		</h3>
		<div>{children}</div>
	</section>
);

const DemographicFilter: React.FC<{
	filters: Filters;
	setFilters: (f: Filters) => void;
	options: { ageGroups: string[]; genders: string[]; locations: string[] };
	className?: string;
}> = ({ filters, setFilters, options, className = "" }) => (
	<section
		className={`mb-6 rounded-3xl flex justify-between flex-col md:flex-row bg-white border-2 border-indigo-200 shadow-xl px-4 py-6 sm:px-6 sm:py-6 relative overflow-hidden ${className}`}
		style={{
			background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
			boxShadow:
				"0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
		}}
	>
		<div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
		<div className="flex items-center gap-3 mb-4 sm:mb-6">
			<div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500 text-white shadow-lg">
				<FaFilter className="text-lg sm:text-xl" />
			</div>
			<div>
				<h2 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-tight">
					Demographic Filters
				</h2>
				<p className="text-slate-600 text-xs sm:text-sm font-medium mt-0.5">
					Segment your insights by audience demographics
				</p>
			</div>
		</div>
		<form className="flex flex-wrap gap-4 sm:gap-6">
			{[
				{
					label: "Age Group",
					id: "ageGroup-filter",
					value: filters.ageGroup,
					options: options.ageGroups,
					field: "ageGroup",
					icon: <FaUsers className="text-base sm:text-lg" />,
					color: "indigo",
				},
				{
					label: "Gender",
					id: "gender-filter",
					value: filters.gender,
					options: options.genders,
					field: "gender",
					icon: <FaCircle className="text-base sm:text-lg" />,
					color: "emerald",
				},
				{
					label: "Location",
					id: "location-filter",
					value: filters.location,
					options: options.locations,
					field: "location",
					icon: <FaTh className="text-base sm:text-lg" />,
					color: "amber",
				},
			].map(({ label, id, value, options: opts, field, icon, color }) => (
				<div key={id} className="relative">
					<div className="relative">
						<div
							className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-${color}-600 z-10`}
						>
							{icon}
						</div>
						<select
							id={id}
							name={field}
							value={value}
							onChange={(e) =>
								setFilters({ ...filters, [field]: e.target.value })
							}
							className={`
                block w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-10 sm:pr-12 pt-4 sm:pt-6 pb-1 sm:pb-2 text-sm border-2 
                border-slate-200 text-slate-900 rounded-xl sm:rounded-2xl 
                bg-white shadow-lg focus:ring-2 focus:ring-${color}-500 focus:border-${color}-500
                transition-all duration-300
                outline-none
                hover:shadow-xl hover:border-${color}-300
                appearance-none
                font-semibold
                focus:outline-none
              `}
						>
							{opts.map((opt) => (
								<option key={opt} value={opt}>
									{opt === "all" ? `All ${label}` : opt}
								</option>
							))}
						</select>
						<label
							htmlFor={id}
							className={`pointer-events-none absolute left-10 sm:left-12 top-1 sm:top-2 text-xs font-bold text-${color}-600 transition-all`}
						>
							{label}
						</label>
						<span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-base sm:text-lg">
							<FaChevronDown />
						</span>
					</div>
				</div>
			))}
		</form>
	</section>
);

const AnimatedPieChart: React.FC<{
	data: SurveyResponse[];
	questionId: string;
	onHover: (content: string, e: React.MouseEvent) => void;
	onLeave: () => void;
	cardHeight?: string;
}> = ({ data, questionId, onHover, onLeave, cardHeight = "auto" }) => {
	const distribution = useMemo(() => {
		const counts: { [key: string]: number } = {};
		data.forEach((response) => {
			const answer = response.answers.find((a) => a.questionId === questionId);
			if (answer) counts[answer.value] = (counts[answer.value] || 0) + 1;
		});
		if (questionId === "q4") {
			if (counts["Strongly Disagree"]) {
				counts["Disagree"] =
					(counts["Disagree"] || 0) + counts["Strongly Disagree"];
				delete counts["Strongly Disagree"];
			}
		}
		return Object.entries(counts)
			.map(([name, count], index) => ({
				name,
				count,
				color: pieColors[index % pieColors.length],
			}))
			.sort((a, b) => b.count - a.count);
	}, [data, questionId]);

	const total = distribution.reduce((sum, item) => sum + item.count, 0);

	if (total === 0)
		return (
			<div className="flex items-center justify-center h-40 bg-slate-50 rounded-2xl border-2 border-slate-200">
				<div className="text-center">
					<div className="text-slate-400 text-4xl mb-2">
						<FaChartPie />
					</div>
					<div className="text-slate-600 text-sm font-medium">
						No data for this filter selection
					</div>
				</div>
			</div>
		);

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0];
			return (
				<div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm max-w-xs">
					<div className="font-semibold">{data.name}</div>
					<div className="text-slate-300">
						{data.value} responses ({((data.value / total) * 100).toFixed(1)}%)
					</div>
				</div>
			);
		}
		return null;
	};

	const CustomLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
	}: any) => {
		if (percent < 0.05) return null;

		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
				className="text-xs font-bold"
				style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<div
			className="flex flex-col items-center gap-4"
			style={{ height: cardHeight }}
		>
			<div className="w-full h-60 sm:h-64">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={distribution}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={CustomLabel}
							outerRadius={window.innerWidth < 640 ? 80 : 100}
							innerRadius={window.innerWidth < 640 ? 25 : 30}
							fill="#8884d8"
							dataKey="count"
							animationBegin={0}
							animationDuration={800}
							animationEasing="ease-out"
						>
							{distribution.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
									stroke="#ffffff"
									strokeWidth={2}
									style={{
										filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
										cursor: "pointer",
										outline: "none",
									}}
								/>
							))}
						</Pie>
						<RechartsTooltip content={<CustomTooltip />} />
					</PieChart>
				</ResponsiveContainer>
			</div>

			<div className="flex flex-col gap-2 w-full overflow-y-auto max-h-48 pr-1">
				{distribution.map((item, i) => (
					<div
						key={item.name}
						className="flex items-center gap-3 cursor-pointer select-none text-slate-900 font-medium p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-md"
						onMouseEnter={(e) =>
							onHover(
								`${item.name}: ${item.count} (${(
									(item.count / total) *
									100
								).toFixed(1)}%)`,
								e
							)
						}
						onMouseLeave={onLeave}
					>
						<div
							className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg"
							style={{ backgroundColor: item.color }}
						/>
						<div className="flex-1 min-w-0">
							<div className="text-xs sm:text-sm font-semibold truncate">
								{item.name}
							</div>
							<div className="text-xs text-slate-500 truncate">
								{item.count} responses (
								{((item.count / total) * 100).toFixed(1)}%)
							</div>
						</div>
						<div className="text-base sm:text-lg font-bold text-slate-700">
							{item.count}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const SentimentPolarityMeter: React.FC<{
	data: SurveyResponse[];
	onHover: (content: string, e: React.MouseEvent) => void;
	onLeave: () => void;
}> = ({ data, onHover, onLeave }) => {
	const averagePolarity = useMemo(() => {
		if (!data.length) return 0;
		const sum = data.reduce((acc, res) => {
			const group =
				res.answers.reduce((g, a) => g + a.sentiment, 0) / res.answers.length;
			return acc + group;
		}, 0);
		return sum / data.length;
	}, [data]);
	const width = Math.abs(averagePolarity) * 50;
	const isPositive = averagePolarity > 0.1;
	const isNegative = averagePolarity < -0.1;
	const isNeutral = !isPositive && !isNegative;

	return (
		<div
			className="w-full h-full flex flex-col justify-between"
			onMouseEnter={(e) =>
				onHover(
					`Average Sentiment: ${averagePolarity.toFixed(2)}\n${
						data.length
					} responses analyzed`,
					e
				)
			}
			onMouseLeave={onLeave}
		>
			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<FaThermometerHalf className="text-base sm:text-lg text-indigo-600" />
						<span className="text-xs sm:text-sm font-semibold text-slate-700">
							Sentiment Score
						</span>
					</div>
					<div
						className={`text-base sm:text-lg font-bold px-2 sm:px-3 py-1 rounded-lg ${
							isPositive
								? "text-emerald-700 bg-emerald-100"
								: isNegative
								? "text-red-700 bg-red-100"
								: "text-amber-700 bg-amber-100"
						}`}
					>
						{averagePolarity > 0 ? "+" : ""}
						{averagePolarity.toFixed(2)}
					</div>
				</div>
			</div>
			<div className="relative w-full h-8 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-200 shadow-inner">
				<div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-300 shadow-sm" />
				<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-slate-400 shadow-lg z-10" />
				<div
					className={`absolute h-full transition-all duration-1000 ease-out shadow-lg ${
						isPositive
							? "bg-emerald-500"
							: isNegative
							? "bg-red-500"
							: "bg-amber-500"
					}`}
					style={{
						left: "50%",
						width: `${width}%`,
						transform:
							averagePolarity < 0 ? "translateX(-100%)" : "translateX(0%)",
						boxShadow: `0 0 20px ${
							isPositive
								? "rgba(16, 185, 129, 0.4)"
								: isNegative
								? "rgba(239, 68, 68, 0.4)"
								: "rgba(245, 158, 11, 0.4)"
						}`,
					}}
				/>
			</div>
			<div className="flex justify-between items-center mt-3">
				<div className="flex items-center gap-1 sm:gap-2">
					<div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full shadow-sm" />
					<span className="text-[10px] sm:text-xs font-medium text-slate-600">
						Negative
					</span>
				</div>
				<div className="flex items-center gap-1 sm:gap-2">
					<div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full shadow-sm" />
					<span className="text-[10px] sm:text-xs font-medium text-slate-600">
						Neutral
					</span>
				</div>
				<div className="flex items-center gap-1 sm:gap-2">
					<div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full shadow-sm" />
					<span className="text-[10px] sm:text-xs font-medium text-slate-600">
						Positive
					</span>
				</div>
			</div>

			<div className="mt-4 pt-4 border-t border-slate-200">
				<h4 className="text-xs sm:text-sm font-semibold text-slate-700 mb-3">
					Sentiment Distribution
				</h4>
				<div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
					{[
						{ label: "Positive", icon: <FaSmile />, color: "emerald" },
						{ label: "Neutral", icon: <FaMeh />, color: "amber" },
						{ label: "Negative", icon: <FaFrown />, color: "red" },
					].map((item) => {
						const count = data.filter((d) => {
							const avgSent =
								d.answers.reduce((sum, a) => sum + a.sentiment, 0) /
								d.answers.length;
							return item.label === "Positive"
								? avgSent > 0.1
								: item.label === "Negative"
								? avgSent < -0.1
								: avgSent >= -0.1 && avgSent <= 0.1;
						}).length;
						const percentage = data.length
							? Math.round((count / data.length) * 100)
							: 0;

						return (
							<div
								key={item.label}
								className={`bg-${item.color}-50 rounded-xl flex flex-col justify-center items-center p-2 sm:p-3 border border-${item.color}-200`}
							>
								<div
									className={`text-${item.color}-600 text-sm sm:text-base mb-1`}
								>
									{item.icon}
								</div>
								<div className="text-xs font-bold">{percentage}%</div>
								<div className="text-[10px] text-slate-500">
									{count} responses
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="mt-4 text-center">
				<div className="text-[10px] sm:text-xs text-slate-500">
					Based on {data.length} survey responses
				</div>
			</div>
		</div>
	);
};

const SentimentHeatmap: React.FC<{
	data: SurveyResponse[];
	onHover: (content: string, e: React.MouseEvent) => void;
	onLeave: () => void;
}> = ({ data, onHover, onLeave }) => {
	const heatmapData = useMemo(() => {
		return questions.map((question) => {
			const relevant = data
				.map((res) => res.answers.find((ans) => ans.questionId === question.id))
				.filter(Boolean) as Answer[];
			const pos = relevant.filter((a) => a.sentiment > 0.1).length;
			const neu = relevant.filter(
				(a) => a.sentiment >= -0.1 && a.sentiment <= 0.1
			).length;
			const neg = relevant.filter((a) => a.sentiment < -0.1).length;
			const total = relevant.length;
			return {
				questionId: question.id,
				questionText: question.text,
				positive: total ? pos / total : 0,
				neutral: total ? neu / total : 0,
				negative: total ? neg / total : 0,
				counts: { positive: pos, neutral: neu, negative: neg, total },
			};
		});
	}, [data]);
	const sentimentCategories = ["Positive", "Neutral", "Negative"] as const;

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "Positive":
				return <FaSmile className="text-emerald-600" />;
			case "Neutral":
				return <FaMeh className="text-amber-600" />;
			case "Negative":
				return <FaFrown className="text-red-600" />;
			default:
				return null;
		}
	};

	const getCategoryColor = (category: string, pct: number) => {
		const intensity = Math.min(pct * 1.2, 1);
		switch (category) {
			case "Positive":
				return {
					background: `rgba(16, 185, 129, ${0.1 + intensity * 0.8})`,
					color: pct > 0.6 ? "#ffffff" : "#047857",
					border: "#10b981",
				};
			case "Neutral":
				return {
					background: `rgba(245, 158, 11, ${0.1 + intensity * 0.8})`,
					color: pct > 0.6 ? "#ffffff" : "#92400e",
					border: "#f59e0b",
				};
			case "Negative":
				return {
					background: `rgba(239, 68, 68, ${0.1 + intensity * 0.8})`,
					color: pct > 0.6 ? "#ffffff" : "#991b1b",
					border: "#ef4444",
				};
			default:
				return {
					background: "#f1f5f9",
					color: "#475569",
					border: "#cbd5e1",
				};
		}
	};

	return (
		<div className="w-full select-none">
			<div className="overflow-x-auto pb-2">
				<div className="hidden sm:flex justify-center gap-4 mb-6">
					{sentimentCategories.map((cat) => {
						const colorClass =
							cat === "Positive"
								? "emerald"
								: cat === "Neutral"
								? "amber"
								: "red";
						return (
							<div
								key={cat}
								className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-md border border-${colorClass}-200 bg-${colorClass}-50 text-${colorClass}-700 w-40`}
							>
								<span className="text-xl">{getCategoryIcon(cat)}</span>
								<span className="font-bold">{cat}</span>
							</div>
						);
					})}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center mb-4 sm:hidden">
					{sentimentCategories.map((cat) => (
						<div
							key={cat}
							className="text-center font-bold text-sm sm:text-base text-slate-800 py-2 sm:py-3 px-3 sm:px-4 bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-slate-200 shadow-sm"
						>
							<div className="flex items-center justify-center gap-2">
								<span className="text-base sm:text-xl">
									{getCategoryIcon(cat)}
								</span>
								<span>{cat}</span>
							</div>
						</div>
					))}
				</div>

				<div className="block sm:hidden space-y-6">
					{heatmapData.map((row, rowIndex) => (
						<div key={row.questionId} className="space-y-2">
							<div className="bg-slate-50 rounded-xl p-3 border-2 border-slate-200 shadow-sm">
								<div className="text-sm font-bold text-slate-800 leading-tight">
									Q{rowIndex + 1}: {row.questionText}
								</div>
								<div className="text-xs text-slate-500 mt-1">
									{row.counts.total} total responses
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2">
								{sentimentCategories.map((cat) => {
									const value =
										row[
											cat.toLowerCase() as "positive" | "neutral" | "negative"
										];
									const pct = isNaN(value) ? 0 : value;
									const count =
										row.counts[
											cat.toLowerCase() as "positive" | "neutral" | "negative"
										];
									const total = row.counts.total;
									const styleConfig = getCategoryColor(cat, pct);

									return (
										<div
											key={cat}
											className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer min-h-[60px] border transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
											style={{
												backgroundColor: styleConfig.background,
												borderColor: styleConfig.border,
												color: styleConfig.color,
											}}
											onMouseEnter={(e) =>
												onHover(
													`${cat} sentiment for "${row.questionText}":\n${(
														pct * 100
													).toFixed(1)}% (${count} out of ${total} responses)`,
													e
												)
											}
											onMouseLeave={onLeave}
										>
											<div
												className="absolute inset-0 opacity-10 bg-white"
												style={{
													background: `radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)`,
												}}
											/>
											<div className="relative z-10 text-center">
												<div className="text-xl font-bold mb-0.5">
													{total ? `${Math.round(pct * 100)}%` : "-"}
												</div>
												<div className="text-[10px] opacity-75">
													{count}/{total}
												</div>
											</div>
											{pct > 0 && (
												<div
													className="absolute bottom-0 left-0 right-0 bg-white opacity-20"
													style={{ height: `${pct * 100}%` }}
												/>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>

				<div className="hidden sm:block">
					<div className="overflow-x-auto">
						<table className="w-full border-separate border-spacing-0">
							<thead>
								<tr>
									<th className="w-1/4 p-2"></th>
									{sentimentCategories.map((cat) => (
										<th key={cat} className="w-1/4 p-2 text-center"></th>
									))}
								</tr>
							</thead>
							<tbody>
								{heatmapData.map((row, rowIndex) => (
									<tr key={row.questionId} className="group">
										<td className="p-2">
											<div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow duration-200">
												<div className="text-sm font-bold text-slate-800 leading-tight">
													Q{rowIndex + 1}: {row.questionText}
												</div>
												<div className="text-xs text-slate-500 mt-1">
													{row.counts.total} total responses
												</div>
											</div>
										</td>
										{sentimentCategories.map((cat) => {
											const value =
												row[
													cat.toLowerCase() as
														| "positive"
														| "neutral"
														| "negative"
												];
											const pct = isNaN(value) ? 0 : value;
											const count =
												row.counts[
													cat.toLowerCase() as
														| "positive"
														| "neutral"
														| "negative"
												];
											const total = row.counts.total;
											const styleConfig = getCategoryColor(cat, pct);

											return (
												<td key={cat} className="p-2">
													<div
														className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer h-24 border-2 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden group-hover:transform group-hover:scale-105"
														style={{
															backgroundColor: styleConfig.background,
															borderColor: styleConfig.border,
															color: styleConfig.color,
														}}
														onMouseEnter={(e) =>
															onHover(
																`${cat} sentiment for "${
																	row.questionText
																}":\n${(pct * 100).toFixed(
																	1
																)}% (${count} out of ${total} responses)`,
																e
															)
														}
														onMouseLeave={onLeave}
													>
														<div
															className="absolute inset-0 opacity-10 bg-white"
															style={{
																background: `radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)`,
															}}
														/>
														<div className="relative z-10 text-center">
															<div className="text-2xl font-bold mb-1">
																{total ? `${Math.round(pct * 100)}%` : "-"}
															</div>
															<div className="text-xs opacity-75">
																{count}/{total}
															</div>
														</div>
														{pct > 0 && (
															<div
																className="absolute bottom-0 left-0 right-0 bg-white opacity-20"
																style={{ height: `${pct * 100}%` }}
															/>
														)}
													</div>
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export function SurveyDashboard() {
	const [filters, setFilters] = useState<Filters>({
		ageGroup: "all",
		gender: "all",
		location: "all",
	});
	const [tooltip, setTooltip] = useState<TooltipData>({
		content: "",
		x: 0,
		y: 0,
		visible: false,
	});
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const uniqueFilterOptions = useMemo(
		() => ({
			ageGroups: [
				"all",
				...Array.from(new Set(surveyData.map((d) => d.ageGroup))),
			],
			genders: ["all", ...Array.from(new Set(surveyData.map((d) => d.gender)))],
			locations: [
				"all",
				...Array.from(new Set(surveyData.map((d) => d.location))),
			],
		}),
		[]
	);

	const filteredData = useMemo(
		() =>
			surveyData.filter(
				(res) =>
					(filters.ageGroup === "all" || res.ageGroup === filters.ageGroup) &&
					(filters.gender === "all" || res.gender === filters.gender) &&
					(filters.location === "all" || res.location === filters.location)
			),
		[filters]
	);

	const isTouch = typeof window !== "undefined" && "ontouchstart" in window;
	const showTooltip = useCallback(
		(content: string, e: React.MouseEvent) => {
			if (isTouch) return;
			setTooltip({ content, x: e.clientX, y: e.clientY, visible: true });
		},
		[setTooltip, isTouch]
	);
	const hideTooltip = useCallback(
		() => setTooltip((prev) => ({ ...prev, visible: false })),
		[]
	);
	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		setTooltip((prev) =>
			prev.visible ? { ...prev, x: e.clientX, y: e.clientY } : prev
		);
	}, []);

	const lastUpdated = "Today, 16:38 UTC";

	const positivePercentage = useMemo(() => {
		const totalSentiments = filteredData.reduce((total, resp) => {
			const avgSentiment =
				resp.answers.reduce((sum, a) => sum + a.sentiment, 0) /
				resp.answers.length;
			return avgSentiment > 0.1 ? total + 1 : total;
		}, 0);
		return filteredData.length
			? Math.round((totalSentiments / filteredData.length) * 100)
			: 0;
	}, [filteredData]);

	const negativePercentage = useMemo(() => {
		const totalSentiments = filteredData.reduce((total, resp) => {
			const avgSentiment =
				resp.answers.reduce((sum, a) => sum + a.sentiment, 0) /
				resp.answers.length;
			return avgSentiment < -0.1 ? total + 1 : total;
		}, 0);
		return filteredData.length
			? Math.round((totalSentiments / filteredData.length) * 100)
			: 0;
	}, [filteredData]);

	return (
		<>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
			/>
			<style>
				{`
          .recharts-wrapper *:focus,
          .recharts-wrapper *:focus-visible {
            outline: none !important;
          }
          .recharts-sector:focus,
          .recharts-sector:focus-visible {
            outline: none !important;
          }
          
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          
          .hide-scrollbar {
            -ms-overflow-style: none;  
            scrollbar-width: none;  
          }
          
          @media (max-width: 640px) {
            .sm\\:grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }
        `}
			</style>
			<div
				className="min-h-screen bg-slate-50"
				style={{
					fontFamily: "'Space Grotesk', sans-serif",
					background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
				}}
			>
				<Tooltip data={tooltip} />

				<nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg">
					<div className="max-w-7xl mx-auto px-4">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg">
									<FaChartPie className="text-lg" />
								</div>
								<div className="hidden sm:block">
									<h1 className="text-xl font-bold text-slate-900">
										Survey Analytics
									</h1>
									<p className="text-xs text-slate-500">
										Last updated: {lastUpdated}
									</p>
								</div>
							</div>

							<div className="hidden sm:flex items-center space-x-4">
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
									<FaUsers className="text-sm" />
									<span className="text-sm font-medium">
										{filteredData.length} responses
									</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
									<FaSmile className="text-sm" />
									<span className="text-sm font-medium">
										{positivePercentage}% positive
									</span>
								</div>
							</div>

							<button
								className="sm:hidden text-slate-600 hover:text-indigo-600 focus:outline-none"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							>
								{mobileMenuOpen ? (
									<FaTimes className="text-xl" />
								) : (
									<FaBars className="text-xl" />
								)}
							</button>
						</div>
					</div>
				</nav>

				{mobileMenuOpen && (
					<div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-lg sm:hidden">
						<div className="px-4 py-4 space-y-3">
							<div className="flex items-center justify-between">
								<h1 className="text-lg font-bold text-slate-900">
									Survey Analytics
								</h1>
								<p className="text-xs text-slate-500">
									Last updated: {lastUpdated}
								</p>
							</div>
							<div className="grid grid-cols-3 gap-3">
								<div className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
									<FaUsers className="text-sm" />
									<span className="text-xs font-medium">
										{filteredData.length}
									</span>
									<span className="text-[10px]">responses</span>
								</div>
								<div className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
									<FaSmile className="text-sm" />
									<span className="text-xs font-medium">
										{positivePercentage}%
									</span>
									<span className="text-[10px]">positive</span>
								</div>
								<div className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
									<FaChartBar className="text-sm" />
									<span className="text-xs font-medium">Live</span>
									<span className="text-[10px]">Data</span>
								</div>
							</div>
						</div>
					</div>
				)}

				<div
					className="max-w-7xl mx-auto py-20 px-4 lg:px-6"
					onMouseMove={handleMouseMove}
				>
					<div className="flex flex-wrap justify-between gap-3 sm:gap-4 mb-6">
						<StatCard
							title="Total Responses"
							value={filteredData.length}
							icon={<FaUsers className="text-xl" />}
							color="indigo"
						/>
						<StatCard
							title="Positive Feedback"
							value={`${positivePercentage}%`}
							icon={<FaSmile className="text-xl" />}
							color="emerald"
						/>
						<StatCard
							title="Negative Feedback"
							value={`${negativePercentage}%`}
							icon={<FaFrown className="text-xl" />}
							color="red"
						/>
						<StatCard
							title="Last Updated"
							value={lastUpdated}
							icon={<FaClock className="text-xl" />}
							color="blue"
						/>
					</div>

					<DemographicFilter
						filters={filters}
						setFilters={setFilters}
						options={uniqueFilterOptions}
						className={mobileMenuOpen ? "mt-24 sm:mt-0" : ""}
					/>

					<main className="flex flex-col gap-4 sm:gap-6">
						<div className="flex md:flex-row flex-col gap-4">
							<DashboardCard
								title="Overall Sentiment"
								icon={<FaThermometerHalf />}
								className="md:w-1/3"
								accentColor="indigo"
							>
								<SentimentPolarityMeter
									data={filteredData}
									onHover={showTooltip}
									onLeave={hideTooltip}
								/>
							</DashboardCard>

							<DashboardCard
								title="Product Quality"
								icon={<FaChartPie />}
								className="md:w-2/3"
								accentColor="emerald"
							>
								<AnimatedPieChart
									data={filteredData}
									questionId="q1"
									onHover={showTooltip}
									onLeave={hideTooltip}
								/>
							</DashboardCard>
						</div>

						<DashboardCard
							title="Sentiment Analysis Heatmap"
							icon={<FaTh />}
							className="lg:col-span-12"
							accentColor="amber"
						>
							<SentimentHeatmap
								data={filteredData}
								onHover={showTooltip}
								onLeave={hideTooltip}
							/>
						</DashboardCard>

						<div className="flex flex-col md:flex-row gap-4 sm:gap-6">
							<DashboardCard
								title="UI Experience"
								icon={<FaChartPie />}
								accentColor="blue"
								className="md:w-1/3"
							>
								<AnimatedPieChart
									data={filteredData}
									questionId="q2"
									onHover={showTooltip}
									onLeave={hideTooltip}
									cardHeight="100%"
								/>
							</DashboardCard>

							<DashboardCard
								title="Support Rating"
								icon={<FaChartPie />}
								accentColor="purple"
								className="md:w-1/3"
							>
								<AnimatedPieChart
									data={filteredData}
									questionId="q3"
									onHover={showTooltip}
									onLeave={hideTooltip}
									cardHeight="100%"
								/>
							</DashboardCard>

							<DashboardCard
								title="Pricing Perception"
								icon={<FaChartPie />}
								accentColor="orange"
								className="md:w-1/3"
							>
								<AnimatedPieChart
									data={filteredData}
									questionId="q4"
									onHover={showTooltip}
									onLeave={hideTooltip}
									cardHeight="100%"
								/>
							</DashboardCard>
						</div>
					</main>
				</div>
				<footer className="pt-8 pb-4 border-t border-slate-200 bg-white shadow-lg">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div>
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center">
										<FaChartLine className="text-lg" />
									</div>
									<div>
										<h3 className="text-lg font-bold text-slate-800">
											Survey Analytics
										</h3>
										<p className="text-xs text-slate-500">Insights dashboard</p>
									</div>
								</div>
								<p className="text-sm text-slate-600 mb-4">
									Visualize and analyze survey data with interactive charts and
									filters.
								</p>
							</div>

							<div>
								<h3 className="text-sm font-bold text-slate-800 mb-4">
									Features
								</h3>
								<ul className="space-y-2">
									{[
										{ icon: <FaChartPie />, text: "Interactive Charts" },
										{ icon: <FaFilter />, text: "Demographic Filters" },
										{
											icon: <FaThermometerHalf />,
											text: "Sentiment Analysis",
										},
										{ icon: <FaUsers />, text: "Response Tracking" },
									].map((item, i) => (
										<li
											key={i}
											className="flex items-center gap-2 text-sm text-slate-600"
										>
											<span className="text-indigo-500">{item.icon}</span>
											{item.text}
										</li>
									))}
								</ul>
							</div>

							<div>
								<h3 className="text-sm font-bold text-slate-800 mb-4">
									Dashboard Info
								</h3>
								<ul className="space-y-2">
									{[
										{
											icon: <FaClock />,
											text: `Last updated: ${lastUpdated}`,
										},
										{
											icon: <FaRegFileAlt />,
											text: `${filteredData.length} responses analyzed`,
										},
										{
											icon: <FaLightbulb />,
											text: "Insights updated in real-time",
										},
										{
											icon: <FaComments />,
											text: "4 survey questions tracked",
										},
									].map((item, i) => (
										<li
											key={i}
											className="flex items-center gap-2 text-sm text-slate-600"
										>
											<span className="text-indigo-500">{item.icon}</span>
											{item.text}
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between">
							<div className="flex items-center gap-1 text-xs text-slate-500 mb-4 sm:mb-0">
								<FaStar className="text-amber-400" />
								<span>Analytics Dashboard</span>
								<span className="mx-2">•</span>
								<span>v2.4.0</span>
							</div>

							<div className="flex items-center gap-4">
								{[
									<FaChartBar className="text-indigo-500" />,
									<FaUsers className="text-emerald-500" />,
									<FaComments className="text-blue-500" />,
									<FaRegFileAlt className="text-purple-500" />,
									<FaHeart className="text-red-500" />,
								].map((icon, i) => (
									<div
										key={i}
										className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors"
									>
										{icon}
									</div>
								))}
							</div>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}

export default SurveyDashboard;
