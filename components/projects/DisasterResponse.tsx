"use client";
import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import type { FormEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
	FaExclamationTriangle,
	FaHouseDamage,
	FaWater,
	FaFire,
	FaWind,
	FaHeadSideVirus,
	FaBolt,
	FaShieldAlt,
	FaBoxOpen,
	FaUsers,
	FaClock,
	FaShareSquare,
	FaPlus,
	FaUsersCog,
	FaSignInAlt,
	FaInfoCircle,
	FaCheckCircle,
	FaTimesCircle,
	FaChevronDown,
	FaTrash,
	FaQuestionCircle,
	FaCopyright,
	FaGithub,
	FaProjectDiagram,
	FaSignOutAlt,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaBullhorn,
	FaHandshake,
	FaBell,
	FaHospital,
	FaClipboardCheck,
	FaExternalLinkAlt,
	FaChartLine,
	FaUserShield,
	FaBars,
	FaTimes,
	FaExclamationCircle,
	FaSkullCrossbones,
	FaDoorOpen,
	FaArrowLeft,
} from "react-icons/fa";

interface DecisionConsequences {
	safety: number;
	resources: number;
	community: number;
	time: number;
}

interface Decision {
	id: string;
	text: string;
	consequences: DecisionConsequences;
	nextDecisionId?: string;
	outcome?: string;
	isFailure?: boolean;
}

interface Scenario {
	id: string;
	title: string;
	description: string;
	category:
		| "earthquake"
		| "flood"
		| "fire"
		| "hurricane"
		| "pandemic"
		| "custom";
	difficulty: "beginner" | "intermediate" | "advanced";
	isCustom?: boolean;
	initialStats: DecisionConsequences;
	decisions: Record<string, Decision[]>;
	startDecisionId: string;
	imageUrl?: string;
}

interface SimulationState {
	currentScenario: Scenario | null;
	currentDecisionId: string;
	stats: DecisionConsequences;
	history: Array<{ decision: Decision; timestamp: number }>;
	isComplete: boolean;
	isFailed?: boolean;
}

interface CollaborativeSession {
	sessionId: string;
	hostId: string;
	scenarioId: string;
	scenarioTitle: string;
	currentDecisionId: string;
	stats: DecisionConsequences;
	isComplete: boolean;
	isFailed?: boolean;
	participants: string[];
	lastUpdate: number;
}

interface UserProfile {
	id: string;
	name: string;
	location: {
		city: string;
		state: string;
		zipCode: string;
	};
	emergencyContact?: string;
	notificationsEnabled: boolean;
	localEmergencyServicesConnected: boolean;
	organizationCode?: string;
}

const baseScenarios: Scenario[] = [
	{
		id: "eq-1",
		title: "Urban Earthquake",
		description:
			"A major 7.2 magnitude earthquake rocks the city center. Critical infrastructure is damaged. Make life-saving decisions amidst chaos and coordinate rescue operations when every second counts.",
		category: "earthquake",
		difficulty: "intermediate",
		initialStats: { safety: 65, resources: 75, community: 55, time: 90 },
		startDecisionId: "eq1_start",
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1664803966500-328c41598e1a?q=80&w=2233&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		decisions: {
			eq1_start: [
				{
					id: "eq1_d1",
					text: "Prioritize Search & Rescue in collapsed buildings",
					consequences: {
						safety: 25,
						resources: -15,
						community: 10,
						time: -20,
					},
					nextDecisionId: "eq1_assess_infra",
				},
				{
					id: "eq1_d2",
					text: "Secure critical facilities (hospitals, power plants)",
					consequences: { safety: 10, resources: -10, community: 5, time: -15 },
					nextDecisionId: "eq1_assess_infra",
				},
				{
					id: "eq1_d3",
					text: "Establish city-wide communication & info hub",
					consequences: { safety: 5, resources: -5, community: 20, time: -10 },
					nextDecisionId: "eq1_assess_infra",
				},
				{
					id: "eq1_d4",
					text: "Wait for additional resources before acting",
					consequences: {
						safety: -30,
						resources: 5,
						community: -15,
						time: -40,
					},
					outcome:
						"Critical time was lost waiting for resources that never arrived. Building collapses caused numerous casualties. Response efforts were chaotic and ineffective.",
					isFailure: true,
				},
			],
			eq1_assess_infra: [
				{
					id: "eq1_d4",
					text: "Deploy engineers to assess structural integrity of bridges",
					consequences: { safety: 10, resources: -5, community: 0, time: -10 },
					nextDecisionId: "eq1_shelter",
				},
				{
					id: "eq1_d5",
					text: "Focus on restoring water and power immediately",
					consequences: { safety: 5, resources: -20, community: 15, time: -25 },
					nextDecisionId: "eq1_shelter",
				},
				{
					id: "eq1_d6",
					text: "Divert resources to undamaged areas first",
					consequences: {
						safety: -20,
						resources: -10,
						community: -25,
						time: -15,
					},
					outcome:
						"Resources were misallocated to areas that didn't need immediate help. Severely damaged sectors collapsed further, resulting in preventable casualties.",
					isFailure: true,
				},
			],
			eq1_shelter: [
				{
					id: "eq1_d6",
					text: "Set up large centralized shelters",
					consequences: {
						safety: 15,
						resources: -15,
						community: 20,
						time: -15,
					},
					outcome:
						"Centralized shelters provided refuge, though managing them was challenging. Order slowly restored.",
				},
				{
					id: "eq1_d7",
					text: "Encourage neighborhood-level small shelters",
					consequences: { safety: 10, resources: -5, community: 25, time: -10 },
					outcome:
						"Community-led shelters fostered resilience, but resource distribution was difficult. The city is recovering.",
				},
				{
					id: "eq1_d8",
					text: "Delay shelter deployment to focus on search & rescue",
					consequences: {
						safety: -15,
						resources: -10,
						community: -30,
						time: -25,
					},
					outcome:
						"Without proper shelter, survivors were exposed to aftershocks and elements. Public panic increased and coordination broke down completely.",
					isFailure: true,
				},
			],
		},
	},
	{
		id: "fld-1",
		title: "Sudden Flash Flood",
		description:
			"Unexpected torrential rain causes rapid flash flooding in several districts. With waters rising at an alarming rate, you must coordinate immediate evacuation while managing limited resources.",
		category: "flood",
		difficulty: "beginner",
		initialStats: { safety: 60, resources: 85, community: 70, time: 80 },
		startDecisionId: "fld1_start",
		imageUrl:
			"https://images.unsplash.com/photo-1547683905-f686c993aae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		decisions: {
			fld1_start: [
				{
					id: "fld1_d1",
					text: "Issue immediate evacuation order for all affected areas",
					consequences: {
						safety: 30,
						resources: -10,
						community: 15,
						time: -15,
					},
					nextDecisionId: "fld1_rescue",
				},
				{
					id: "fld1_d2",
					text: "Deploy rapid response teams with boats to low-lying zones",
					consequences: { safety: 20, resources: -15, community: 5, time: -20 },
					nextDecisionId: "fld1_rescue",
				},
				{
					id: "fld1_d3",
					text: "Wait for more data before issuing evacuation orders",
					consequences: {
						safety: -40,
						resources: -5,
						community: -20,
						time: -30,
					},
					outcome:
						"The delay proved catastrophic. Waters rose faster than expected, trapping hundreds in their homes. Rescue operations were overwhelmed.",
					isFailure: true,
				},
			],
			fld1_rescue: [
				{
					id: "fld1_d3",
					text: "Open emergency shelters in schools and public buildings",
					consequences: {
						safety: 20,
						resources: -20,
						community: 25,
						time: -15,
					},
					outcome:
						"Swift action and well-managed shelters saved many lives. The community commends your leadership.",
				},
				{
					id: "fld1_d4",
					text: "Request military assistance for large-scale rescue",
					consequences: { safety: 25, resources: -5, community: 10, time: -10 },
					outcome:
						"Military support was crucial in reaching stranded individuals. A long recovery ahead, but many are safe.",
				},
				{
					id: "fld1_d5",
					text: "Focus resources on protecting critical infrastructure",
					consequences: {
						safety: -25,
						resources: -30,
						community: -15,
						time: -20,
					},
					outcome:
						"While infrastructure was protected, hundreds of civilians were left stranded. The public outcry was immediate and severe.",
					isFailure: true,
				},
			],
		},
	},
	{
		id: "fire-1",
		title: "Wildfire Approaching Suburb",
		description:
			"A fast-moving wildfire threatens a suburban area with thousands of homes. Wind conditions are worsening and the fire is accelerating. Balance evacuations with firefighting resources as the situation evolves rapidly.",
		category: "fire",
		difficulty: "advanced",
		initialStats: { safety: 50, resources: 70, community: 60, time: 70 },
		startDecisionId: "fire1_start",
		imageUrl:
			"https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		decisions: {
			fire1_start: [
				{
					id: "fire1_d1",
					text: "Order immediate mandatory evacuation of the most threatened zone",
					consequences: {
						safety: 30,
						resources: -5,
						community: -10,
						time: -15,
					},
					nextDecisionId: "fire1_contain",
				},
				{
					id: "fire1_d2",
					text: "Focus all resources on creating firebreaks ahead of the fire",
					consequences: { safety: 10, resources: -25, community: 5, time: -25 },
					nextDecisionId: "fire1_contain",
				},
				{
					id: "fire1_d3",
					text: "Deploy air tankers and ground crews to directly attack the fire front",
					consequences: { safety: 20, resources: -30, community: 0, time: -20 },
					nextDecisionId: "fire1_contain",
				},
				{
					id: "fire1_d4",
					text: "Implement a voluntary evacuation plan only",
					consequences: {
						safety: -35,
						resources: -10,
						community: -25,
						time: -30,
					},
					outcome:
						"Many residents chose to stay, believing they could protect their homes. When the fire accelerated, evacuation routes became blocked with traffic, leading to numerous casualties.",
					isFailure: true,
				},
			],
			fire1_contain: [
				{
					id: "fire1_d4",
					text: "Prioritize protecting critical infrastructure (water, power)",
					consequences: { safety: 10, resources: -10, community: 5, time: -10 },
					outcome:
						"Critical infrastructure was saved, minimizing long-term disruption, but some homes were lost.",
				},
				{
					id: "fire1_d5",
					text: "Establish a perimeter and let the fire burn to natural barriers where possible",
					consequences: { safety: -5, resources: 10, community: -5, time: -5 },
					outcome:
						"A risky strategy that conserved resources, but public outcry is high due to property loss.",
				},
				{
					id: "fire1_d6",
					text: "Request mutual aid from neighboring jurisdictions for more manpower",
					consequences: { safety: 15, resources: -5, community: 10, time: -10 },
					outcome:
						"Reinforcements helped contain the blaze significantly, though the cost was high. The community is grateful for the effort.",
				},
				{
					id: "fire1_d7",
					text: "Split resources evenly across all threatened areas",
					consequences: {
						safety: -30,
						resources: -25,
						community: -15,
						time: -20,
					},
					outcome:
						"Resources were spread too thin to be effective anywhere. The fire overtook multiple neighborhoods simultaneously, causing catastrophic losses.",
					isFailure: true,
				},
			],
		},
	},
	{
		id: "hur-1",
		title: "Hurricane Landfall Imminent",
		description:
			"A Category 4 hurricane is projected to make landfall in 36 hours. With destructive winds and storm surge threatening the coastal city, coordinate evacuations and infrastructure protection before the devastating storm arrives.",
		category: "hurricane",
		difficulty: "intermediate",
		initialStats: { safety: 80, resources: 90, community: 75, time: 100 },
		startDecisionId: "hur1_prep",
		imageUrl:
			"https://images.unsplash.com/photo-1726312497465-8b5c6d0bc7b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		decisions: {
			hur1_prep: [
				{
					id: "hur1_d1",
					text: "Issue phased evacuation orders starting with Zone A (coastal)",
					consequences: { safety: 20, resources: -10, community: 5, time: -20 },
					nextDecisionId: "hur1_shelter",
				},
				{
					id: "hur1_d2",
					text: "Fortify critical infrastructure and pre-position emergency supplies",
					consequences: { safety: 10, resources: -20, community: 0, time: -15 },
					nextDecisionId: "hur1_shelter",
				},
				{
					id: "hur1_d3",
					text: "Broadcast continuous preparedness messages and open hotlines",
					consequences: { safety: 5, resources: -5, community: 15, time: -10 },
					nextDecisionId: "hur1_shelter",
				},
				{
					id: "hur1_d4",
					text: "Downgrade evacuation advisory to reduce panic",
					consequences: {
						safety: -40,
						resources: 0,
						community: -15,
						time: -25,
					},
					outcome:
						"The minimized threat warning resulted in most residents staying put. When the hurricane made landfall at full strength, evacuation routes were inundated and casualties were extensive.",
					isFailure: true,
				},
			],
			hur1_shelter: [
				{
					id: "hur1_d4",
					text: "Open all designated public shelters and arrange transport for vulnerable populations",
					consequences: {
						safety: 25,
						resources: -15,
						community: 20,
						time: -25,
					},
					outcome:
						"Extensive preparations and well-run shelters significantly mitigated casualties. The city weathered the storm.",
				},
				{
					id: "hur1_d5",
					text: "Focus on securing utilities and clearing evacuation routes",
					consequences: { safety: 15, resources: -10, community: 5, time: -20 },
					outcome:
						"Post-storm recovery was faster due to secured utilities, but shelter capacity was strained.",
				},
				{
					id: "hur1_d6",
					text: "Allocate majority of resources to high-value property areas",
					consequences: {
						safety: -30,
						resources: -20,
						community: -40,
						time: -15,
					},
					outcome:
						"Lower-income areas were devastated with minimal support. Public outrage at the inequitable response led to civil unrest during recovery efforts.",
					isFailure: true,
				},
			],
		},
	},
	{
		id: "pan-1",
		title: "Novel Virus Outbreak",
		description:
			"A new, highly contagious virus with a 5% mortality rate is spreading rapidly in the city. Balance containment measures with economic impacts as you coordinate the public health response to this emerging crisis. You can manage the outbreak and protect its citizens.",
		category: "pandemic",
		difficulty: "advanced",
		initialStats: { safety: 70, resources: 80, community: 65, time: 100 },
		startDecisionId: "pan1_detect",
		imageUrl:
			"https://images.unsplash.com/photo-1584483766114-2cea6facdf57?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
		decisions: {
			pan1_detect: [
				{
					id: "pan1_d1",
					text: "Implement widespread testing and contact tracing immediately",
					consequences: {
						safety: 15,
						resources: -20,
						community: -5,
						time: -15,
					},
					nextDecisionId: "pan1_measures",
				},
				{
					id: "pan1_d2",
					text: "Launch a massive public awareness campaign on hygiene and distancing",
					consequences: { safety: 10, resources: -5, community: 10, time: -10 },
					nextDecisionId: "pan1_measures",
				},
				{
					id: "pan1_d3",
					text: "Restrict large public gatherings and close non-essential services",
					consequences: {
						safety: 20,
						resources: -10,
						community: -15,
						time: -20,
					},
					nextDecisionId: "pan1_measures",
				},
				{
					id: "pan1_d4",
					text: "Minimize response to prevent economic disruption",
					consequences: {
						safety: -40,
						resources: 0,
						community: -30,
						time: -30,
					},
					outcome:
						"The virus spread uncontrolled throughout the population. Healthcare systems were overwhelmed and both the death toll and economic impact far exceeded projections.",
					isFailure: true,
				},
			],
			pan1_measures: [
				{
					id: "pan1_d4",
					text: "Mandate mask-wearing in all public spaces and distribute masks",
					consequences: { safety: 20, resources: -15, community: 5, time: -10 },
					nextDecisionId: "pan1_vaccine_rollout",
				},
				{
					id: "pan1_d5",
					text: "Invest heavily in hospital capacity and PPE for healthcare workers",
					consequences: { safety: 25, resources: -25, community: 0, time: -20 },
					nextDecisionId: "pan1_vaccine_rollout",
				},
				{
					id: "pan1_d6",
					text: "Focus resources exclusively on vaccine development",
					consequences: {
						safety: -25,
						resources: -35,
						community: -20,
						time: -40,
					},
					outcome:
						"While neglecting immediate containment measures, the virus spread rapidly. By the time a vaccine was ready, healthcare systems had collapsed and social order was breaking down.",
					isFailure: true,
				},
			],
			pan1_vaccine_rollout: [
				{
					id: "pan1_d6",
					text: "Prioritize vaccine distribution to vulnerable groups and essential workers",
					consequences: {
						safety: 30,
						resources: -10,
						community: 15,
						time: -25,
					},
					outcome:
						"Strategic public health measures and a targeted vaccine rollout curbed the pandemic effectively. The city slowly returns to normal.",
				},
				{
					id: "pan1_d7",
					text: "Opt for a general population vaccine rollout as supplies become available",
					consequences: { safety: 25, resources: -5, community: 10, time: -20 },
					outcome:
						"The pandemic was brought under control, though challenges in equitable distribution emerged. Society is healing.",
				},
				{
					id: "pan1_d8",
					text: "Allow private market to control vaccine distribution",
					consequences: {
						safety: -20,
						resources: -5,
						community: -40,
						time: -25,
					},
					outcome:
						"Wealthy communities quickly obtained vaccines while vulnerable populations were left unprotected. The resulting inequity led to ongoing outbreaks and social upheaval.",
					isFailure: true,
				},
			],
		},
	},

	{
		id: "flood-failure",
		title: "Dam Breach Crisis",
		description:
			"A major dam is showing structural weakness during heavy rainfall. Water levels are rising rapidly behind the dam, and downstream communities with 50,000 residents are at risk. Your decisions will determine if this becomes a catastrophe or a managed crisis.",
		category: "flood",
		difficulty: "advanced",
		initialStats: { safety: 50, resources: 60, community: 70, time: 75 },
		startDecisionId: "dam_initial",
		imageUrl:
			"https://images.unsplash.com/photo-1563539785769-a98e7e05707c?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		decisions: {
			dam_initial: [
				{
					id: "dam_d1",
					text: "Issue immediate evacuation for downstream areas",
					consequences: {
						safety: 30,
						resources: -15,
						community: -5,
						time: -25,
					},
					nextDecisionId: "dam_response",
				},
				{
					id: "dam_d2",
					text: "Attempt emergency repairs to reinforce the dam",
					consequences: {
						safety: -10,
						resources: -30,
						community: 5,
						time: -40,
					},
					nextDecisionId: "dam_critical",
				},
				{
					id: "dam_d3",
					text: "Wait for engineering assessment before taking action",
					consequences: { safety: -25, resources: 0, community: 10, time: -20 },
					nextDecisionId: "dam_critical",
				},
			],
			dam_response: [
				{
					id: "dam_d4",
					text: "Deploy all resources to evacuation assistance",
					consequences: {
						safety: 25,
						resources: -25,
						community: 15,
						time: -20,
					},
					nextDecisionId: "dam_outcome",
				},
				{
					id: "dam_d5",
					text: "Split resources between evacuation and emergency dam repair",
					consequences: { safety: 10, resources: -30, community: 5, time: -25 },
					nextDecisionId: "dam_outcome",
				},
			],
			dam_critical: [
				{
					id: "dam_d6",
					text: "Last-minute emergency evacuation order",
					consequences: {
						safety: -20,
						resources: -25,
						community: -30,
						time: -40,
					},
					outcome:
						"The delayed evacuation order caused significant casualties as the dam collapsed. This disaster will be remembered as a failure of emergency management.",
					isFailure: true,
				},
				{
					id: "dam_d7",
					text: "Focus all remaining resources on dam reinforcement",
					consequences: {
						safety: -40,
						resources: -40,
						community: -20,
						time: -30,
					},
					outcome:
						"The desperate attempt to save the dam failed catastrophically. Hundreds of lives were lost in the subsequent flash flooding. This response will be studied as an example of poor disaster management.",
					isFailure: true,
				},
			],
			dam_outcome: [
				{
					id: "dam_d8",
					text: "Establish emergency shelters and begin recovery planning",
					consequences: {
						safety: 15,
						resources: -15,
						community: 20,
						time: -10,
					},
					outcome:
						"Though the dam eventually failed, your rapid evacuation saved countless lives. The community faces rebuilding challenges but credits your leadership with preventing a much worse tragedy.",
				},
				{
					id: "dam_d9",
					text: "Request federal emergency declaration and assistance",
					consequences: { safety: 10, resources: 20, community: 10, time: -10 },
					outcome:
						"Your proactive measures before the dam collapsed minimized casualties. While property damage was extensive, the early evacuation is considered a successful emergency response.",
				},
			],
		},
	},
];

const categoryDetails: Record<
	Scenario["category"],
	{ icon: JSX.Element; bgColor: string; color: string; label: string }
> = {
	earthquake: {
		icon: <FaHouseDamage />,
		bgColor: "#fed7d7",
		color: "#c53030",
		label: "Earthquake",
	},
	flood: {
		icon: <FaWater />,
		bgColor: "#bee3f8",
		color: "#2b6cb0",
		label: "Flood",
	},
	fire: {
		icon: <FaFire />,
		bgColor: "#feebc8",
		color: "#c05621",
		label: "Fire",
	},
	hurricane: {
		icon: <FaWind />,
		bgColor: "#e6fffa",
		color: "#00766c",
		label: "Hurricane",
	},
	pandemic: {
		icon: <FaHeadSideVirus />,
		bgColor: "#f0d9ff",
		color: "#6b46c1",
		label: "Pandemic",
	},
	custom: {
		icon: <FaBolt />,
		bgColor: "#e2e8f0",
		color: "#4a5568",
		label: "Custom",
	},
};

const statIcons: Record<keyof DecisionConsequences, JSX.Element> = {
	safety: <FaShieldAlt />,
	resources: <FaBoxOpen />,
	community: <FaUsers />,
	time: <FaClock />,
};

const statTooltips: Record<keyof DecisionConsequences, string> = {
	safety:
		"Represents the physical safety and security of the population. Higher values mean more people are protected from immediate danger.",
	resources:
		"Represents available emergency supplies, equipment, and personnel. Depletes as you allocate resources to different actions.",
	community:
		"Represents public trust, cooperation, and social cohesion. Higher values mean better coordination and fewer social issues.",
	time: "Represents time pressure and urgency. Lower values mean less time available for decision-making and action.",
};

const generateId = (prefix: string = "id") =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getStatColor = (value: number): string => {
	if (value >= 80) return "text-green-600";
	if (value >= 60) return "text-yellow-600";
	if (value >= 40) return "text-amber-500";
	return "text-red-600";
};

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({
	content,
	children,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [leftPos, setLeftPos] = useState(0);
	const [arrowLeft, setArrowLeft] = useState(0);

	useEffect(() => {
		if (isVisible && wrapperRef.current && tooltipRef.current) {
			const wrapperRect = wrapperRef.current.getBoundingClientRect();
			const tooltipWidth = 224;
			const viewportWidth = window.innerWidth;

			const idealLeftRelative = wrapperRect.width / 2 - tooltipWidth / 2;
			const idealLeftViewport = wrapperRect.left + idealLeftRelative;

			let adjustedLeftViewport = idealLeftViewport;
			if (idealLeftViewport < 0) {
				adjustedLeftViewport = 0;
			} else if (idealLeftViewport + tooltipWidth > viewportWidth) {
				adjustedLeftViewport = viewportWidth - tooltipWidth;
			}

			const leftRelative = adjustedLeftViewport - wrapperRect.left;
			setLeftPos(leftRelative);

			const parentCenterRelative = wrapperRect.width / 2;
			const arrowLeftRelative = parentCenterRelative - leftRelative;
			setArrowLeft(arrowLeftRelative);
		}
	}, [isVisible]);

	return (
		<div
			ref={wrapperRef}
			className="relative inline-flex items-center cursor-help group"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			onClick={() => setIsVisible(!isVisible)}
		>
			{children}
			<span className="ml-1 text-gray-500 text-sm">
				<FaInfoCircle />
			</span>
			<div
				ref={tooltipRef}
				className={`absolute bottom-full left-[-45px] bg-gray-800 text-white text-xs rounded py-2 px-3 w-36 md:w-56 z-50 shadow-lg transition-opacity duration-200 ${
					isVisible ? "opacity-100" : "opacity-0 invisible"
				}`}
			>
				{content}
				<span
					className="absolute top-full w-0 h-0 border-4 border-transparent border-t-gray-800"
					style={{ left: `${arrowLeft}px` }}
				></span>
			</div>
		</div>
	);
};

const Button: React.FC<{
	variant?: "primary" | "secondary" | "outline" | "danger" | "success";
	size?: "small" | "medium" | "large";
	fullWidth?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	children?: React.ReactNode;
	"aria-label"?: string;
}> = ({
	variant = "primary",
	size = "medium",
	fullWidth = false,
	iconLeft,
	iconRight,
	onClick,
	className = "",
	disabled = false,
	type = "button",
	children,
	...props
}) => {
	const baseClasses =
		"rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";

	const sizeClasses = {
		small: "px-3 py-1.5 text-sm",
		medium: "px-4 py-2.5",
		large: "px-6 py-3 text-lg",
	};

	const variantClasses = {
		primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
		secondary: "bg-gray-700 hover:bg-gray-800 text-white focus:ring-gray-500",
		outline:
			"border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500",
		danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
		success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
	};

	const disabledClasses = disabled
		? "opacity-60 cursor-not-allowed bg-gray-400 hover:bg-gray-400 text-gray-100 border-gray-400"
		: "";
	const widthClass = fullWidth ? "w-full" : "";

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClasses} ${className}`}
			{...props}
		>
			{iconLeft && <span>{iconLeft}</span>}
			{children}
			{iconRight && <span>{iconRight}</span>}
		</button>
	);
};

const Input: React.FC<{
	id: string;
	label?: string;
	type?: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	required?: boolean;
	className?: string;
	min?: number;
	max?: number;
}> = ({
	id,
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	required = false,
	className = "",
	...props
}) => {
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className="block mb-2 text-sm font-medium text-gray-600"
				>
					{label}
				</label>
			)}
			<input
				id={id}
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				className={`w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`}
				{...props}
			/>
		</div>
	);
};

const StatInput: React.FC<{
	id: string;
	label?: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	className?: string;
}> = ({ id, label, value, onChange, min = 0, max = 100, className = "" }) => {
	const [inputValue, setInputValue] = useState(value.toString());

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);

		if (newValue === "" || !isNaN(Number(newValue))) {
			onChange(newValue === "" ? 0 : Number(newValue));
		}
	};

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className="block mb-2 text-sm font-medium text-gray-600"
				>
					{label} ({value}%)
				</label>
			)}
			<input
				id={id}
				type="text"
				value={inputValue}
				onChange={handleChange}
				min={min}
				max={max}
				className={`w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`}
			/>
		</div>
	);
};

const Select: React.FC<{
	id: string;
	label?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: { value: string; label: string }[];
	required?: boolean;
	disabled?: boolean;
	className?: string;
}> = ({
	id,
	label,
	value,
	onChange,
	options,
	required = false,
	disabled = false,
	className = "",
}) => {
	return (
		<div className="w-full relative">
			{label && (
				<label
					htmlFor={id}
					className="block mb-2 text-sm font-medium text-gray-600"
				>
					{label}
				</label>
			)}
			<div className="relative">
				<select
					id={id}
					value={value}
					onChange={onChange}
					required={required}
					disabled={disabled}
					className={`w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
						disabled ? "opacity-60 cursor-not-allowed" : ""
					} ${className}`}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
					<FaChevronDown />
				</div>
			</div>
		</div>
	);
};

const Textarea: React.FC<{
	id: string;
	label?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	required?: boolean;
	className?: string;
	rows?: number;
}> = ({
	id,
	label,
	value,
	onChange,
	placeholder,
	required = false,
	className = "",
	rows = 4,
	...props
}) => {
	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={id}
					className="block mb-2 text-sm font-medium text-gray-600"
				>
					{label}
				</label>
			)}
			<textarea
				id={id}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				rows={rows}
				className={`w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y ${className}`}
				{...props}
			/>
		</div>
	);
};

const Modal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: "medium" | "large" | "xlarge";
	children: React.ReactNode;
}> = ({ isOpen, onClose, title, size = "medium", children }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const sizeClasses = {
		medium: "max-w-xl",
		large: "max-w-3xl",
		xlarge: "max-w-5xl",
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
			onClick={onClose}
		>
			<div
				className={`${sizeClasses[size]} w-full bg-white rounded-xl shadow-2xl overflow-auto max-h-[90vh] animate-modalAppear`}
				onClick={(e) => e.stopPropagation()}
			>
				{title && (
					<div className="flex justify-between items-center p-6 border-b border-gray-200">
						<h2 className="text-xl font-bold text-gray-800">{title}</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
							aria-label="Close modal"
						>
							<FaTimesCircle size={20} />
						</button>
					</div>
				)}
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
};

const ConfirmModal: React.FC<{
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}> = ({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = "Confirm",
	cancelText = "Cancel",
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onCancel} title={title}>
			<div className="text-center">
				<div className="flex items-center justify-center gap-4 mb-6">
					<FaQuestionCircle className="text-4xl text-amber-500" />
					<p className="text-gray-700">{message}</p>
				</div>
				<div className="flex justify-center gap-4">
					<Button variant="secondary" onClick={onCancel}>
						{cancelText}
					</Button>
					<Button variant="primary" onClick={onConfirm}>
						{confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const MobileMenu: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	currentView: string;
	onNavigate: (
		view: "scenarios" | "collaborate" | "profile" | "emergency-services"
	) => void;
	onShowCreateModal: () => void;
}> = ({ isOpen, onClose, currentView, onNavigate, onShowCreateModal }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
			<div className="bg-white w-full p-4 flex justify-between items-center">
				<div className="flex items-center gap-2 text-xl font-bold text-red-600">
					<FaExclamationTriangle className="text-2xl" />
					<span>DisasterReady</span>
				</div>
				<button
					onClick={onClose}
					className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
				>
					<FaTimes size={24} />
				</button>
			</div>
			<div className="flex-1 bg-gray-50 overflow-auto">
				<div className="p-4 flex flex-col gap-3">
					<Button
						variant={currentView === "scenarios" ? "primary" : "outline"}
						fullWidth
						size="large"
						onClick={() => {
							onNavigate("scenarios");
							onClose();
						}}
					>
						Scenarios
					</Button>
					<Button
						onClick={() => {
							onShowCreateModal();
							onClose();
						}}
						fullWidth
						size="large"
						iconLeft={<FaPlus />}
					>
						Create
					</Button>
					<Button
						variant={currentView === "collaborate" ? "primary" : "outline"}
						fullWidth
						size="large"
						onClick={() => {
							onNavigate("collaborate");
							onClose();
						}}
					>
						Collaborate
					</Button>
					<Button
						variant={
							currentView === "emergency-services" ? "primary" : "outline"
						}
						fullWidth
						size="large"
						onClick={() => {
							onNavigate("emergency-services");
							onClose();
						}}
						iconLeft={<FaHospital />}
					>
						Services
					</Button>
					<Button
						variant={currentView === "profile" ? "primary" : "outline"}
						fullWidth
						size="large"
						onClick={() => {
							onNavigate("profile");
							onClose();
						}}
						iconLeft={<FaUserShield />}
					>
						Profile
					</Button>
				</div>
			</div>
		</div>
	);
};

const AppHeader: React.FC<{
	currentView: string;
	onNavigate: (
		view: "scenarios" | "collaborate" | "profile" | "emergency-services"
	) => void;
	onShowCreateModal: () => void;
}> = ({ currentView, onNavigate, onShowCreateModal }) => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<>
			<header className="sticky top-0 z-40 bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
					<div className="flex items-center gap-2 text-2xl font-bold text-red-600 cursor-default">
						<FaExclamationTriangle className="text-3xl" />
						<span className="font-heading">DisasterReady</span>
					</div>

					{}
					<button
						className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
						onClick={() => setMobileMenuOpen(true)}
					>
						<FaBars size={24} />
					</button>

					{}
					<nav className="hidden md:flex gap-2 flex-wrap">
						<Button
							variant={currentView === "scenarios" ? "primary" : "outline"}
							size="small"
							onClick={() => onNavigate("scenarios")}
						>
							Scenarios
						</Button>
						<Button
							onClick={onShowCreateModal}
							size="small"
							iconLeft={<FaPlus />}
						>
							Create
						</Button>
						<Button
							variant={currentView === "collaborate" ? "primary" : "outline"}
							size="small"
							onClick={() => onNavigate("collaborate")}
						>
							Collaborate
						</Button>
						<Button
							variant={
								currentView === "emergency-services" ? "primary" : "outline"
							}
							size="small"
							onClick={() => onNavigate("emergency-services")}
							iconLeft={<FaHospital />}
						>
							Services
						</Button>
						<Button
							variant={currentView === "profile" ? "primary" : "outline"}
							size="small"
							onClick={() => onNavigate("profile")}
							iconLeft={<FaUserShield />}
						>
							Profile
						</Button>
					</nav>
				</div>
			</header>

			{}
			<MobileMenu
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				currentView={currentView}
				onNavigate={onNavigate}
				onShowCreateModal={onShowCreateModal}
			/>
		</>
	);
};

const AppFooter: React.FC = () => {
	return (
		<footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
				<div className="flex items-center gap-2">
					<FaCopyright />
					<span>
						{new Date().getFullYear()} DisasterReady Simulator. All Rights
						Reserved.
					</span>
				</div>
				<div className="flex gap-6">
					<a
						href="#"
						className="text-gray-300 hover:text-white transition-colors"
					>
						<FaGithub size={20} />
					</a>
					<a
						href="#"
						className="text-gray-300 hover:text-white transition-colors"
					>
						<FaInfoCircle size={20} />
					</a>
					<a
						href="#"
						className="text-gray-300 hover:text-white transition-colors"
					>
						<FaClipboardCheck size={20} />
					</a>
				</div>
			</div>
		</footer>
	);
};

const ScenarioCard: React.FC<{
	scenario: Scenario;
	onStart: (scenario: Scenario) => void;
}> = ({ scenario, onStart }) => {
	return (
		<div
			className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer relative ${
				scenario.isCustom ? "border-l-4 border-purple-600" : ""
			}`}
			onClick={() => onStart(scenario)}
		>
			{scenario.isCustom && (
				<div className="absolute top-4 left-0 bg-purple-600 text-white text-xs font-bold py-1 px-2 rounded-r uppercase">
					Custom
				</div>
			)}
			<div
				className={`absolute top-4 right-4 py-1 px-2 rounded-full text-xs font-semibold text-white ${
					scenario.difficulty === "beginner"
						? "bg-green-600"
						: scenario.difficulty === "intermediate"
						? "bg-yellow-600"
						: "bg-red-600"
				}`}
			>
				{scenario.difficulty}
			</div>

			{scenario.imageUrl ? (
				<div className="w-full h-40 bg-gray-200 overflow-hidden">
					<img
						src={scenario.imageUrl}
						alt={scenario.title}
						className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
					/>
				</div>
			) : (
				<div
					className={`w-16 h-16 flex items-center justify-center text-3xl rounded-lg mx-auto mt-6 mb-4`}
					style={{
						backgroundColor: categoryDetails[scenario.category].bgColor,
						color: categoryDetails[scenario.category].color,
					}}
				>
					{categoryDetails[scenario.category].icon}
				</div>
			)}

			<div className="p-6">
				<div className="flex items-center gap-2 mb-2">
					<span
						className={`w-8 h-8 flex items-center justify-center rounded-full text-sm`}
						style={{
							backgroundColor: categoryDetails[scenario.category].bgColor,
							color: categoryDetails[scenario.category].color,
						}}
					>
						{categoryDetails[scenario.category].icon}
					</span>
					<span className="text-sm font-medium text-gray-600">
						{categoryDetails[scenario.category].label}
					</span>
				</div>

				<h3 className="text-xl font-bold mb-2 text-gray-800">
					{scenario.title}
				</h3>
				<p className="text-gray-600 text-sm mb-6">{scenario.description}</p>

				<Button variant="primary" fullWidth>
					Start Scenario
				</Button>
			</div>
		</div>
	);
};

const StatsDisplay: React.FC<{
	stats: DecisionConsequences;
}> = ({ stats }) => {
	return (
		<div className="flex flex-wrap justify-between w-full gap-4 mb-8">
			{Object.entries(stats).map(([key, value]) => (
				<div key={key} className="bg-gray-100 rounded-lg p-4 text-center">
					<div className="text-gray-600 text-3xl mb-2 flex justify-center">
						{statIcons[key as keyof typeof statIcons]}
					</div>
					<div className={`text-3xl font-bold mb-1 ${getStatColor(value)}`}>
						{value}%
					</div>
					<div className="text-gray-600 capitalize text-sm">
						<Tooltip content={statTooltips[key as keyof typeof statTooltips]}>
							{key}
						</Tooltip>
					</div>
				</div>
			))}
		</div>
	);
};

const DecisionItem: React.FC<{
	decision: Decision;
	onMakeDecision: (decision: Decision) => void;
}> = ({ decision, onMakeDecision }) => {
	const isFailureOption = decision.isFailure === true;

	return (
		<div
			className={`${
				isFailureOption ? "bg-red-50 border-red-200" : "bg-gray-100"
			} rounded-lg p-5 mb-4 border-2 border-transparent hover:border-red-600 hover:translate-x-1 transition-all cursor-pointer shadow-sm hover:shadow-md`}
			onClick={() => onMakeDecision(decision)}
		>
			<p className="text-lg font-medium text-gray-800 mb-3">
				{isFailureOption && (
					<FaExclamationCircle className="inline-block mr-2 text-red-600" />
				)}
				{decision.text}
			</p>
			<div className="flex flex-wrap gap-3">
				{Object.entries(decision.consequences).map(([stat, value]) => (
					<span
						key={stat}
						className={`inline-flex items-center text-sm font-semibold py-1 px-2 rounded-md ${
							value >= 0
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						<span className="mr-1">
							{statIcons[stat as keyof typeof statIcons]}
						</span>
						<span>
							{stat}: {value > 0 ? "+" : ""}
							{value}
						</span>
					</span>
				))}
			</div>
		</div>
	);
};

const OutcomeDisplay: React.FC<{
	outcomeText: string | undefined;
	overallScore: number;
	onShare: () => void;
	onReset: () => void;
	isFailed: boolean;
}> = ({ outcomeText, overallScore, onShare, onReset, isFailed }) => {
	return (
		<div
			className={`${
				isFailed ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
			} border rounded-xl p-8 text-center mt-8`}
		>
			<div className="flex items-center justify-center text-3xl mb-4">
				{isFailed ? (
					<div className="text-red-600 flex items-center">
						<FaSkullCrossbones className="mr-2" />
						<h3 className="font-bold">Scenario Failed!</h3>
					</div>
				) : (
					<div className="text-green-600 flex items-center">
						<FaCheckCircle className="mr-2" />
						<h3 className="font-bold">Scenario Complete!</h3>
					</div>
				)}
			</div>

			<p className="text-lg text-gray-700 mb-6">
				{outcomeText || "The scenario has concluded."}
			</p>

			<div className={`text-5xl font-bold mb-1 ${getStatColor(overallScore)}`}>
				{overallScore}%
			</div>
			<p className="text-gray-600 mb-8">Overall Performance</p>

			<div className="flex flex-wrap justify-center gap-4">
				<Button
					variant="primary"
					onClick={onShare}
					iconLeft={<FaShareSquare />}
				>
					Share Results
				</Button>
				<Button variant="secondary" onClick={onReset}>
					Try Another Scenario
				</Button>
			</div>
		</div>
	);
};

const ExitSessionButton: React.FC<{
	onExit: () => void;
	isHost: boolean;
}> = ({ onExit, isHost }) => {
	return (
		<Button
			variant="danger"
			onClick={onExit}
			iconLeft={<FaSignOutAlt />}
			className="fixed top-20 right-8 z-30 shadow-lg md:static md:shadow-none"
			aria-label={isHost ? "End Session" : "Leave Session"}
		>
			<span className="hidden md:inline">
				{isHost ? "End Session" : "Leave Session"}
			</span>
		</Button>
	);
};

const SimulationView: React.FC<{
	simulation: SimulationState;
	currentDecisions: Decision[];
	overallScore: number;
	onMakeDecision: (decision: Decision) => void;
	onShare: () => void;
	onReset: () => void;
	isHostView?: boolean;
	activeSession?: CollaborativeSession | null;
	onExitSession?: () => void;
}> = ({
	simulation,
	currentDecisions,
	overallScore,
	onMakeDecision,
	onShare,
	onReset,
	isHostView = true,
	activeSession,
	onExitSession,
}) => {
	if (!simulation.currentScenario) return <p>Loading scenario...</p>;

	return (
		<div className="bg-white rounded-xl shadow-lg p-4 md:p-8 relative overflow-x-hidden">
			{}
			{activeSession && onExitSession && (
				<div className="mb-4md:absolute md:top-8 md:right-8">
					<ExitSessionButton onExit={onExitSession} isHost={isHostView} />
				</div>
			)}

			<div className="mb-6">
				<div className="flex flex-wrap items-center gap-3 mb-4">
					<div
						className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
						style={{
							backgroundColor:
								categoryDetails[simulation.currentScenario.category].bgColor,
							color: categoryDetails[simulation.currentScenario.category].color,
						}}
					>
						{categoryDetails[simulation.currentScenario.category].icon}
					</div>
					<h2 className="text-2xl font-bold text-gray-800">
						{simulation.currentScenario.title}
					</h2>
				</div>
				<p className="text-gray-600">
					{simulation.currentScenario.description}
				</p>
			</div>

			<StatsDisplay stats={simulation.stats} />

			{!simulation.isComplete && (
				<>
					<h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
						What's your next move?
						{!isHostView && (
							<span className="ml-2 text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
								Waiting for Host
							</span>
						)}
					</h3>
					<div>
						{currentDecisions.map((decision) => (
							<DecisionItem
								key={decision.id}
								decision={decision}
								onMakeDecision={isHostView ? onMakeDecision : () => {}}
							/>
						))}
					</div>
				</>
			)}

			{simulation.isComplete && (
				<OutcomeDisplay
					outcomeText={
						simulation.history[simulation.history.length - 1]?.decision.outcome
					}
					overallScore={overallScore}
					onShare={onShare}
					onReset={onReset}
					isFailed={simulation.isFailed || false}
				/>
			)}
		</div>
	);
};

const ShareModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	overallScore: number;
	scenarioTitle?: string;
	scenarioCategory?: string;
	isFailed?: boolean;
}> = ({
	isOpen,
	onClose,
	overallScore,
	scenarioTitle = "Disaster Scenario",
	scenarioCategory = "custom",
	isFailed = false,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Share Your Results">
			<div className="text-center">
				<div className="mb-4">
					<p className="mb-4">
						{isFailed
							? "Important learning opportunity! Share these results to help others understand critical decision points."
							: "Great job completing the scenario! Share your results with others."}
					</p>

					<div className="bg-gray-100 p-4 mb-6 rounded-lg">
						<div className="flex items-center justify-center gap-2 mb-2">
							<strong>Scenario:</strong> {scenarioTitle}
							<span
								className="inline-block px-2 py-1 text-xs rounded-full"
								style={{
									backgroundColor:
										categoryDetails[
											scenarioCategory as keyof typeof categoryDetails
										]?.bgColor || "#e2e8f0",
									color:
										categoryDetails[
											scenarioCategory as keyof typeof categoryDetails
										]?.color || "#4a5568",
								}}
							>
								{categoryDetails[
									scenarioCategory as keyof typeof categoryDetails
								]?.label || "Scenario"}
							</span>
						</div>

						<div className="text-gray-600 text-sm mb-2">Your Score</div>
						<div className={`text-4xl font-bold ${getStatColor(overallScore)}`}>
							{overallScore}%
						</div>
						<div className="mt-1 text-sm">
							{isFailed
								? "Critical Failure - Important Learning Moment"
								: overallScore >= 80
								? "Excellent Response!"
								: overallScore >= 60
								? "Good Response"
								: overallScore >= 40
								? "Challenging Outcome"
								: "Difficult Situation"}
						</div>
					</div>
				</div>

				<div className="flex gap-4">
					<Button
						variant="primary"
						fullWidth
						onClick={() => {
							navigator.clipboard
								.writeText(
									`I ${
										isFailed
											? "experienced a critical failure"
											: `scored ${overallScore}%`
									} in the "${scenarioTitle}" disaster scenario on DisasterReady! ${
										isFailed
											? "Learning from failures is crucial in emergency management."
											: "Check it out!"
									}`
								)
								.then(() => toast.success("Results copied to clipboard!"))
								.catch((err) => toast.error("Could not copy results."));
							onClose();
						}}
					>
						Copy Results
					</Button>
					<Button variant="secondary" fullWidth onClick={onClose}>
						Close
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const HelpModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose }) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="How to Create a Scenario"
			size="large"
		>
			<div className="max-h-[60vh] overflow-y-auto">
				<h3 className="text-xl font-bold text-red-600 mt-6 mb-3">
					Creating a Disaster Scenario
				</h3>
				<p className="mb-4">
					Follow these steps to create your own disaster response scenario:
				</p>

				<h4 className="text-lg font-bold text-gray-700 mt-4 mb-2">
					1. Basic Information
				</h4>
				<ul className="list-disc pl-8 mb-4">
					<li>
						<strong>Title:</strong> Give your scenario a descriptive name
					</li>
					<li>
						<strong>Category:</strong> Choose the type of disaster (earthquake,
						flood, fire, etc.)
					</li>
					<li>
						<strong>Difficulty:</strong> Set the complexity level (beginner,
						intermediate, advanced)
					</li>
					<li>
						<strong>Description:</strong> Explain the scenario situation and
						context
					</li>
				</ul>

				<h4 className="text-lg font-bold text-gray-700 mt-4 mb-2">
					2. Initial Stats
				</h4>
				<p>Set starting values for your scenario's key metrics:</p>
				<ul className="list-disc pl-8 mb-4">
					<li>
						<strong>Safety:</strong> Current safety level (0-100%)
					</li>
					<li>
						<strong>Resources:</strong> Available resources and supplies
						(0-100%)
					</li>
					<li>
						<strong>Community:</strong> Community morale and cooperation
						(0-100%)
					</li>
					<li>
						<strong>Time:</strong> Time pressure and urgency (0-100%)
					</li>
				</ul>

				<h3 className="text-xl font-bold text-red-600 mt-6 mb-3">
					Building the Decision Tree
				</h3>
				<p className="mb-4">
					The decision tree is the core of your scenario. Here's how to
					structure it:
				</p>

				<h4 className="text-lg font-bold text-gray-700 mt-4 mb-2">
					1. Decision Points
				</h4>
				<ul className="list-disc pl-8 mb-4">
					<li>
						<strong>Unique Name:</strong> Give each decision point a unique
						identifier (e.g., "initial_response", "evacuation_decision")
					</li>
					<li>
						<strong>Choices:</strong> Each decision point must have at least one
						choice
					</li>
					<li>
						<strong>Start Point:</strong> Designate one decision point as the
						starting point
					</li>
				</ul>

				<h4 className="text-lg font-bold text-gray-700 mt-4 mb-2">
					2. Creating Choices
				</h4>
				<ul className="list-disc pl-8 mb-4">
					<li>
						<strong>Choice Text:</strong> Describe the action or decision the
						player can make
					</li>
					<li>
						<strong>Consequences:</strong> Set how this choice affects each stat
						(positive or negative values)
					</li>
					<li>
						<strong>Link Type:</strong> Choose whether the choice leads to
						another decision or ends the scenario
					</li>
				</ul>

				<div className="bg-amber-50 p-4 rounded-lg my-4">
					<strong>Option A - Leads to Outcome:</strong> The choice ends the
					scenario with a specific outcome message
				</div>
				<div className="bg-amber-50 p-4 rounded-lg my-4">
					<strong>Option B - Leads to Next Decision:</strong> The choice
					continues to another decision point in your tree
				</div>

				<div className="bg-red-50 p-4 rounded-lg my-4 border border-red-200">
					<strong>Creating Failure Scenarios:</strong> Consider adding choices
					that lead to failure outcomes. These are valuable learning experiences
					that show how poor decisions can lead to disaster. Mark these choices
					as "isFailure: true" to highlight them.
				</div>

				<h4 className="text-lg font-bold text-gray-700 mt-4 mb-2">
					4. Decision Tree Structure
				</h4>
				<p>Your scenario can have multiple paths:</p>
				<ul className="list-disc pl-8 mb-4">
					<li>
						<strong>Linear:</strong> Simple A → B → C progression
					</li>
					<li>
						<strong>Branching:</strong> Multiple paths based on different
						choices
					</li>
					<li>
						<strong>Converging:</strong> Different paths that lead back to the
						same decision point
					</li>
				</ul>
			</div>
		</Modal>
	);
};

const CreateScenarioModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onScenarioCreate: (newScenario: Scenario) => void;
}> = ({ isOpen, onClose, onScenarioCreate }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState<Scenario["category"] | "">("");
	const [difficulty, setDifficulty] = useState<Scenario["difficulty"] | "">("");
	const [initialStats, setInitialStats] = useState<DecisionConsequences>({
		safety: 70,
		resources: 70,
		community: 70,
		time: 100,
	});
	const [decisionPoints, setDecisionPoints] = useState<
		{
			tempId: string;
			uniqueName: string;
			choices: {
				tempId: string;
				text: string;
				consequences: DecisionConsequences;
				linksTo: "nextDecision" | "outcome";
				nextDecisionPointId?: string;
				outcomeText?: string;
				isFailure?: boolean;
			}[];
		}[]
	>([]);
	const [startDecisionPointId, setStartDecisionPointId] = useState<string>("");
	const [showHelp, setShowHelp] = useState(false);

	const resetForm = () => {
		setTitle("");
		setDescription("");
		setCategory("");
		setDifficulty("");
		setInitialStats({ safety: 70, resources: 70, community: 70, time: 100 });
		setDecisionPoints([]);
		setStartDecisionPointId("");
	};

	const handleStatChange = (
		stat: keyof DecisionConsequences,
		value: number
	) => {
		setInitialStats((prev) => ({ ...prev, [stat]: value }));
	};

	const addDecisionPoint = () => {
		const newPointId = generateId("dp");
		setDecisionPoints((prev) => [
			...prev,
			{ tempId: newPointId, uniqueName: `dp_${prev.length + 1}`, choices: [] },
		]);
		if (!startDecisionPointId) setStartDecisionPointId(newPointId);
	};

	const updateDecisionPointName = (pointId: string, name: string) => {
		setDecisionPoints((prev) =>
			prev.map((dp) =>
				dp.tempId === pointId
					? { ...dp, uniqueName: name.replace(/[\s-]+/g, "_").toLowerCase() }
					: dp
			)
		);
	};

	const removeDecisionPoint = (pointId: string) => {
		setDecisionPoints((prev) => prev.filter((dp) => dp.tempId !== pointId));
		if (startDecisionPointId === pointId)
			setStartDecisionPointId(
				decisionPoints.length > 1
					? decisionPoints.find((dp) => dp.tempId !== pointId)!.tempId
					: ""
			);
	};

	const addChoiceToPoint = (pointId: string) => {
		setDecisionPoints((prev) =>
			prev.map((dp) =>
				dp.tempId === pointId
					? {
							...dp,
							choices: [
								...dp.choices,
								{
									tempId: generateId("choice"),
									text: "",
									consequences: {
										safety: 0,
										resources: 0,
										community: 0,
										time: 0,
									},
									linksTo: "outcome",
									outcomeText: "",
									isFailure: false,
								},
							],
					  }
					: dp
			)
		);
	};

	const updateChoice = (
		pointId: string,
		choiceId: string,
		field:
			| "text"
			| "linksTo"
			| "nextDecisionPointId"
			| "outcomeText"
			| "isFailure"
			| `consequence.${keyof DecisionConsequences}`,
		value: any
	) => {
		setDecisionPoints((prev) =>
			prev.map((dp) => {
				if (dp.tempId === pointId) {
					return {
						...dp,
						choices: dp.choices.map((ch) => {
							if (ch.tempId === choiceId) {
								if (String(field).startsWith("consequence.")) {
									const statKey = String(field).split(
										"."
									)[1] as keyof DecisionConsequences;
									return {
										...ch,
										consequences: {
											...ch.consequences,
											[statKey]: Number(value),
										},
									};
								}
								return { ...ch, [field]: value };
							}
							return ch;
						}),
					};
				}
				return dp;
			})
		);
	};

	const removeChoiceFromPoint = (pointId: string, choiceId: string) => {
		setDecisionPoints((prev) =>
			prev.map((dp) =>
				dp.tempId === pointId
					? {
							...dp,
							choices: dp.choices.filter((ch) => ch.tempId !== choiceId),
					  }
					: dp
			)
		);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (
			!title ||
			!description ||
			!category ||
			!difficulty ||
			!startDecisionPointId ||
			decisionPoints.length === 0
		) {
			toast.error(
				"Please fill all metadata and define at least one decision point with a starting point."
			);
			return;
		}

		if (
			decisionPoints.some(
				(dp) =>
					!dp.uniqueName ||
					decisionPoints.filter((p) => p.uniqueName === dp.uniqueName).length >
						1
			)
		) {
			toast.error(
				"All decision points must have valid, unique names (lowercase, underscores)."
			);
			return;
		}

		if (decisionPoints.some((dp) => dp.choices.length === 0)) {
			toast.error("All decision points must have at least one choice.");
			return;
		}

		const finalDecisions: Record<string, Decision[]> = {};
		for (const dp of decisionPoints) {
			if (!dp.uniqueName) {
				toast.error("A decision point is missing a unique name.");
				return;
			}
			finalDecisions[dp.uniqueName] = dp.choices.map((ch) => {
				let nextDecisionTargetId: string | undefined = undefined;
				if (ch.linksTo === "nextDecision" && ch.nextDecisionPointId) {
					const targetPoint = decisionPoints.find(
						(p) => p.tempId === ch.nextDecisionPointId
					);
					if (!targetPoint || !targetPoint.uniqueName) {
						toast.error(
							`Invalid next decision link for choice "${ch.text}" in point "${dp.uniqueName}". Target point not found or has no unique name.`
						);
						throw new Error("Invalid link");
					}
					nextDecisionTargetId = targetPoint.uniqueName;
				}
				return {
					id: generateId("d"),
					text: ch.text,
					consequences: ch.consequences,
					isFailure: ch.isFailure,
					...(ch.linksTo === "outcome"
						? { outcome: ch.outcomeText }
						: { nextDecisionId: nextDecisionTargetId }),
				};
			});
		}

		const startPoint = decisionPoints.find(
			(dp) => dp.tempId === startDecisionPointId
		);
		if (!startPoint?.uniqueName) {
			toast.error("Selected start decision point is invalid.");
			return;
		}

		const newScenario: Scenario = {
			id: generateId("customScenario"),
			title,
			description,
			category,
			difficulty,
			isCustom: true,
			initialStats,
			decisions: finalDecisions,
			startDecisionId: startPoint.uniqueName,
		};

		onScenarioCreate(newScenario);
		toast.success(`Scenario "${title}" created!`);
		resetForm();
		onClose();
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={() => {
					resetForm();
					onClose();
				}}
				title="Create Custom Scenario"
				size="xlarge"
			>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-800 m-0">
						Build Your Disaster Scenario
					</h3>
					<button
						onClick={() => setShowHelp(true)}
						className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
						title="Help"
					>
						<FaQuestionCircle size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					{}
					<div className="mb-8 pb-6 border-b border-gray-200">
						<h4 className="flex items-center text-lg font-bold text-gray-700 mb-4">
							<FaInfoCircle className="mr-2" /> Scenario Details
						</h4>

						<div className="flex flex-wrap gap-4 mb-4">
							<div className="flex-grow min-w-[250px]">
								<Input
									id="csTitle"
									label="Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
							</div>

							<div className="w-full sm:w-[200px]">
								<Select
									id="csCategory"
									label="Category"
									value={category}
									onChange={(e) =>
										setCategory(e.target.value as Scenario["category"] | "")
									}
									options={[
										{ value: "", label: "Select" },
										...Object.keys(categoryDetails).map((k) => ({
											value: k,
											label: k.charAt(0).toUpperCase() + k.slice(1),
										})),
									]}
									required
								/>
							</div>

							<div className="w-full sm:w-[200px]">
								<Select
									id="csDifficulty"
									label="Difficulty"
									value={difficulty}
									onChange={(e) =>
										setDifficulty(e.target.value as Scenario["difficulty"] | "")
									}
									options={[
										{ value: "", label: "Select" },
										{ value: "beginner", label: "Beginner" },
										{ value: "intermediate", label: "Intermediate" },
										{ value: "advanced", label: "Advanced" },
									]}
									required
								/>
							</div>
						</div>

						<Textarea
							id="csDesc"
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							placeholder="A brief overview of the disaster scenario..."
						/>

						<h5 className="text-base font-semibold text-gray-700 mt-4 mb-2">
							Initial Stats
						</h5>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
							{Object.keys(initialStats).map((key) => (
								<div key={key}>
									<label className="block mb-1 text-sm font-medium text-gray-600 capitalize">
										{key} ({initialStats[key as keyof DecisionConsequences]}%)
									</label>
									<input
										id={`csStat-${key}`}
										type="range"
										min="0"
										max="100"
										value={initialStats[key as keyof DecisionConsequences]}
										onChange={(e) =>
											handleStatChange(
												key as keyof DecisionConsequences,
												Number(e.target.value)
											)
										}
										className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
									/>
								</div>
							))}
						</div>
					</div>

					{}
					<div className="mb-8">
						<h4 className="flex items-center text-lg font-bold text-gray-700 mb-4">
							<FaProjectDiagram className="mr-2" /> Decision Tree Builder
						</h4>

						<div className="mb-4">
							<Select
								id="startDP"
								label="Start Decision Point (must be defined below)"
								value={startDecisionPointId}
								onChange={(e) => setStartDecisionPointId(e.target.value)}
								options={[
									{ value: "", label: "Select Starting Point" },
									...decisionPoints.map((dp) => ({
										value: dp.tempId,
										label:
											dp.uniqueName ||
											`(Unnamed Point ${dp.tempId.substring(0, 5)})`,
									})),
								]}
								required
							/>
						</div>

						{}
						{decisionPoints.map((dp) => (
							<div
								key={dp.tempId}
								className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-200"
							>
								<div className="flex flex-wrap items-end gap-2 mb-3">
									<div className="flex-grow">
										<label
											htmlFor={`dpName-${dp.tempId}`}
											className="block mb-1 text-sm font-medium text-gray-600"
										>
											Decision Point Name (Unique ID):
										</label>
										<input
											id={`dpName-${dp.tempId}`}
											type="text"
											value={dp.uniqueName}
											onChange={(e) =>
												updateDecisionPointName(dp.tempId, e.target.value)
											}
											placeholder="e.g., initial_assessment"
											required
											className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										/>
									</div>
									<Button
										type="button"
										variant="danger"
										size="small"
										onClick={() => removeDecisionPoint(dp.tempId)}
										iconLeft={<FaTrash />}
										aria-label="Remove Decision Point"
									/>
								</div>

								{}
								{dp.choices.map((choice, chIndex) => (
									<div
										key={choice.tempId}
										className="bg-white border border-dashed border-gray-300 rounded-lg p-3 mb-3"
									>
										<input
											type="text"
											placeholder={`Choice ${chIndex + 1} Text`}
											value={choice.text}
											onChange={(e) =>
												updateChoice(
													dp.tempId,
													choice.tempId,
													"text",
													e.target.value
												)
											}
											required
											className="w-full px-3 py-2 mb-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
										/>

										<label className="block mb-1 text-xs font-medium text-gray-600">
											Consequences:
										</label>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
											{Object.keys(choice.consequences).map((statKey) => (
												<div key={statKey}>
													<label
														htmlFor={`conseq-${choice.tempId}-${statKey}`}
														className="block mb-1 text-xs font-medium text-gray-600 capitalize"
													>
														{statKey}
													</label>
													<StatInput
														id={`conseq-${choice.tempId}-${statKey}`}
														value={
															choice.consequences[
																statKey as keyof DecisionConsequences
															]
														}
														onChange={(value) =>
															updateChoice(
																dp.tempId,
																choice.tempId,
																`consequence.${
																	statKey as keyof DecisionConsequences
																}`,
																value
															)
														}
													/>
												</div>
											))}
										</div>

										<div className="flex flex-wrap gap-3 items-end">
											<div className="w-full sm:w-[200px]">
												<label className="block mb-1 text-xs font-medium text-gray-600">
													Link Type
												</label>
												<select
													value={choice.linksTo}
													onChange={(e) =>
														updateChoice(
															dp.tempId,
															choice.tempId,
															"linksTo",
															e.target.value
														)
													}
													className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
												>
													<option value="outcome">Leads to Outcome</option>
													<option value="nextDecision">
														Leads to Next Decision
													</option>
												</select>
											</div>

											{choice.linksTo === "outcome" ? (
												<>
													<div className="flex-grow">
														<label className="block mb-1 text-xs font-medium text-gray-600">
															Outcome Text
														</label>
														<input
															type="text"
															placeholder="Outcome Text"
															value={choice.outcomeText || ""}
															onChange={(e) =>
																updateChoice(
																	dp.tempId,
																	choice.tempId,
																	"outcomeText",
																	e.target.value
																)
															}
															className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
														/>
													</div>
													<div className="flex items-center ml-2">
														<input
															id={`isFailure-${choice.tempId}`}
															type="checkbox"
															checked={choice.isFailure || false}
															onChange={(e) =>
																updateChoice(
																	dp.tempId,
																	choice.tempId,
																	"isFailure",
																	e.target.checked
																)
															}
															className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
														/>
														<label
															htmlFor={`isFailure-${choice.tempId}`}
															className="ml-2 text-xs font-medium text-gray-700"
														>
															Failure Outcome
														</label>
													</div>
												</>
											) : (
												<div className="flex-grow">
													<label className="block mb-1 text-xs font-medium text-gray-600">
														Next Decision Point
													</label>
													<select
														value={choice.nextDecisionPointId || ""}
														onChange={(e) =>
															updateChoice(
																dp.tempId,
																choice.tempId,
																"nextDecisionPointId",
																e.target.value
															)
														}
														className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
													>
														<option value="" disabled>
															Select Next Point
														</option>
														{decisionPoints
															.filter(
																(p) => p.tempId !== dp.tempId && p.uniqueName
															)
															.map((p) => (
																<option key={p.tempId} value={p.tempId}>
																	{p.uniqueName}
																</option>
															))}
													</select>
												</div>
											)}

											<Button
												type="button"
												variant="danger"
												size="small"
												onClick={() =>
													removeChoiceFromPoint(dp.tempId, choice.tempId)
												}
												iconLeft={<FaTrash />}
												aria-label="Remove Choice"
											/>
										</div>
									</div>
								))}

								<Button
									type="button"
									variant="outline"
									size="small"
									onClick={() => addChoiceToPoint(dp.tempId)}
									iconLeft={<FaPlus />}
								>
									Add Choice
								</Button>
							</div>
						))}

						<Button
							type="button"
							onClick={addDecisionPoint}
							iconLeft={<FaPlus />}
						>
							Add Decision Point
						</Button>
					</div>

					{}
					<div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								resetForm();
								onClose();
							}}
						>
							Cancel
						</Button>
						<Button type="submit" variant="primary">
							Create Scenario
						</Button>
					</div>
				</form>
			</Modal>

			<HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
		</>
	);
};

const AvailableSessionsList: React.FC<{
	sessions: CollaborativeSession[];
	onJoinSession: (session: CollaborativeSession) => void;
	currentUserId: string;
}> = ({ sessions, onJoinSession, currentUserId }) => {
	if (sessions.length === 0) {
		return (
			<div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center justify-center">
				<div className="text-gray-400 text-6xl mb-4">
					<FaUsers />
				</div>
				<h3 className="text-xl font-bold mb-2 text-gray-700">
					No Active Sessions
				</h3>
				<p className="text-center text-gray-600 mb-4">
					There are no sessions available to join right now. Host your own
					session or wait for someone else to create one.
				</p>
				<div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm w-full">
					<div className="font-medium mb-1">Tip:</div>
					<p>
						Open DisasterReady in another browser tab to test collaborative
						features!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
			<h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
				<FaSignInAlt className="mr-2" /> Available Sessions
			</h3>

			<div className="space-y-4">
				{sessions.map((session) => (
					<div
						key={session.sessionId}
						className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm"
					>
						<div className="font-bold text-lg mb-1">
							{session.scenarioTitle}
						</div>
						<div className="text-sm text-gray-600 mb-3">
							<div>
								<strong>Host:</strong> Tab {session.hostId.substring(0, 6)}...
							</div>
							<div>
								<strong>Participants:</strong> {session.participants.length}
							</div>
						</div>
						<Button
							variant="success"
							onClick={() => onJoinSession(session)}
							fullWidth
							iconLeft={<FaSignInAlt />}
							disabled={session.participants.includes(currentUserId)}
							size="small"
						>
							Join Session
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};

const ActiveSessionPanel: React.FC<{
	session: CollaborativeSession;
	isHost: boolean;
	onLeaveSession: () => void;
}> = ({ session, isHost, onLeaveSession }) => {
	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<div className="text-center mb-6">
				<h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
					<FaUsers className="mr-2" />
					{isHost ? "Hosting Session:" : "Joined Session:"}{" "}
					{session.scenarioTitle}
				</h2>
				<div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
					{isHost ? "Session Host" : "Active Participant"}
				</div>
			</div>

			<div className="bg-gray-50 rounded-lg p-4 mb-6">
				<p className="mb-4">
					{isHost
						? "You are hosting this collaborative session. Other users can join from their devices."
						: `You are participating in this session. The host (Tab ${session.hostId.substring(
								0,
								6
						  )}...) is controlling the simulation.`}
				</p>
				<div className="flex items-center justify-between">
					<span className="flex items-center">
						<strong>Participants:</strong>{" "}
						<span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
							{session.participants.length}
						</span>
					</span>
					<span className="flex items-center">
						<strong>Status:</strong>{" "}
						<span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">
							{session.isComplete ? "Complete" : "In Progress"}
						</span>
					</span>
				</div>
			</div>

			<Button
				variant="danger"
				onClick={onLeaveSession}
				iconLeft={<FaSignOutAlt />}
				fullWidth
			>
				{isHost ? "End Hosted Session" : "Leave Session"}
			</Button>
		</div>
	);
};

const CollaborateView: React.FC<{
	scenarios: Scenario[];
	onStartHostedSession: (
		scenario: Scenario,
		sessionId: string,
		hostId: string
	) => void;
	currentUserId: string;
	activeCollabSessionExt: CollaborativeSession | null;
	onLeaveSessionExt: () => void;
}> = ({
	scenarios,
	onStartHostedSession,
	currentUserId,
	activeCollabSessionExt,
	onLeaveSessionExt,
}) => {
	const [isHostingThisTab, setIsHostingThisTab] = useState(false);
	const [selectedScenarioId, setSelectedScenarioId] = useState<string>("");
	const [availableSessions, setAvailableSessions] = useState<
		CollaborativeSession[]
	>([]);

	const bc = useMemo(
		() => new BroadcastChannel("disasterReadyCollabChannel_v1"),
		[]
	);

	useEffect(() => {
		setIsHostingThisTab(activeCollabSessionExt?.hostId === currentUserId);

		const handleChannelMessage = (e: MessageEvent) => {
			if (e.data.type === "SESSION_UPDATE" && e.data.payload) {
				const session = e.data.payload as CollaborativeSession;
				if (!session.participants.includes(currentUserId)) {
					setAvailableSessions((prev) => [
						...prev.filter((s) => s.sessionId !== session.sessionId),
						session,
					]);
				} else {
					setAvailableSessions((prev) =>
						prev.filter((s) => s.sessionId !== session.sessionId)
					);
				}
			} else if (e.data.type === "SESSION_ENDED" && e.data.payload) {
				setAvailableSessions((prev) =>
					prev.filter((s) => s.sessionId !== e.data.payload.sessionId)
				);
			}
		};

		bc.onmessage = handleChannelMessage;

		return () => {
			bc.onmessage = null;
		};
	}, [activeCollabSessionExt, currentUserId, bc]);

	const hostSession = () => {
		if (!selectedScenarioId) {
			toast.error("Please select a scenario to host.");
			return;
		}
		const scenarioToHost = scenarios.find((s) => s.id === selectedScenarioId);
		if (!scenarioToHost) {
			toast.error("Selected scenario not found.");
			return;
		}
		const sessionId = generateId("sess");
		const newSession: CollaborativeSession = {
			sessionId,
			hostId: currentUserId,
			scenarioId: scenarioToHost.id,
			scenarioTitle: scenarioToHost.title,
			currentDecisionId: scenarioToHost.startDecisionId,
			stats: { ...scenarioToHost.initialStats },
			isComplete: false,
			participants: [currentUserId],
			lastUpdate: Date.now(),
		};
		localStorage.setItem(
			"disasterReadyCollabSession_v1",
			JSON.stringify(newSession)
		);
		bc.postMessage({ type: "SESSION_UPDATE", payload: newSession });
		onStartHostedSession(scenarioToHost, sessionId, currentUserId);
		toast.success(
			`Session "${scenarioToHost.title}" hosted! Others can join locally.`
		);
	};

	const joinExternalSession = (sessionToJoin: CollaborativeSession) => {
		if (sessionToJoin.participants.includes(currentUserId)) {
			toast.success("You are already in this session.");
			return;
		}
		const updatedSession = {
			...sessionToJoin,
			participants: [...sessionToJoin.participants, currentUserId],
			lastUpdate: Date.now(),
		};
		localStorage.setItem(
			"disasterReadyCollabSession_v1",
			JSON.stringify(updatedSession)
		);
		bc.postMessage({ type: "SESSION_UPDATE", payload: updatedSession });
		toast.success(`Joined session "${sessionToJoin.scenarioTitle}"!`);
		setAvailableSessions((prev) =>
			prev.filter((s) => s.sessionId !== sessionToJoin.sessionId)
		);
	};

	const endOrLeaveSession = () => {
		onLeaveSessionExt();
		setIsHostingThisTab(false);
	};

	if (
		activeCollabSessionExt &&
		activeCollabSessionExt.participants.includes(currentUserId) &&
		!isHostingThisTab
	) {
		return (
			<ActiveSessionPanel
				session={activeCollabSessionExt}
				isHost={false}
				onLeaveSession={endOrLeaveSession}
			/>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<div className="text-center mb-6">
				<h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
					<FaUsersCog className="mr-2" /> Collaborative Training
				</h2>
				<p className="text-gray-600">
					Host a new session or join an existing one simulated locally using
					browser tabs.
				</p>
			</div>

			{}
			{(!activeCollabSessionExt || isHostingThisTab) && (
				<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
					<h3 className="text-xl font-bold mb-4 text-gray-800">
						Host New Session
					</h3>

					<div className="mb-4">
						<Select
							id="collabScenarioSelect"
							label="Select Scenario to Host"
							value={selectedScenarioId}
							onChange={(e) => setSelectedScenarioId(e.target.value)}
							options={[
								{ value: "", label: "-- Select a Scenario --" },
								...scenarios.map((s) => ({ value: s.id, label: s.title })),
							]}
							disabled={isHostingThisTab}
						/>
					</div>

					<Button
						variant="primary"
						onClick={hostSession}
						disabled={isHostingThisTab || !selectedScenarioId}
						fullWidth
						iconLeft={<FaPlus />}
					>
						{isHostingThisTab
							? `Hosting "${activeCollabSessionExt?.scenarioTitle}"...`
							: "Host Selected Scenario"}
					</Button>

					{isHostingThisTab && activeCollabSessionExt && (
						<div className="mt-4">
							<div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm">
								<div className="font-medium mb-1">Session Details:</div>
								<div>
									<strong>Participants:</strong>{" "}
									{activeCollabSessionExt.participants.length}
								</div>
								<div>
									<strong>Session ID:</strong>{" "}
									{activeCollabSessionExt.sessionId.substring(0, 10)}...
								</div>
							</div>
							<Button
								variant="danger"
								onClick={endOrLeaveSession}
								iconLeft={<FaSignOutAlt />}
								fullWidth
							>
								End Hosted Session
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

const EmergencyServicesView: React.FC<{
	userProfile: UserProfile | null;
	onUpdateProfile: (updates: Partial<UserProfile>) => void;
}> = ({ userProfile, onUpdateProfile }) => {
	const [zipCode, setZipCode] = useState(userProfile?.location.zipCode || "");
	const [orgCode, setOrgCode] = useState(userProfile?.organizationCode || "");
	const [showIntegrationOptions, setShowIntegrationOptions] = useState(false);

	const handleConnectServices = () => {
		if (!zipCode) {
			toast.error("Please enter your ZIP code to connect to local services");
			return;
		}

		onUpdateProfile({
			location: {
				...(userProfile?.location || { city: "", state: "" }),
				zipCode,
			},
			organizationCode: orgCode,
			localEmergencyServicesConnected: true,
		});

		toast.success("Successfully connected to local emergency services!");
		setShowIntegrationOptions(true);
	};

	const handleDisconnect = () => {
		onUpdateProfile({ localEmergencyServicesConnected: false });
		toast.success("Disconnected from emergency services");
		setShowIntegrationOptions(false);
	};

	return (
		<div className="bg-white rounded-xl shadow-lg">
			<div className="bg-red-600 text-white p-6 rounded-t-xl">
				<h2 className="text-2xl font-bold mb-2 flex items-center">
					<FaHospital className="mr-2" /> Emergency Services Integration
				</h2>
				<p>
					Connect with local emergency services to enhance your disaster
					preparedness and response capabilities.
				</p>
			</div>

			<div className="p-6">
				<div className="grid md:grid-cols-2 gap-8">
					{}
					<div>
						<div className="border border-gray-200 rounded-lg p-6 mb-6">
							<h3 className="text-xl font-bold mb-4 text-gray-800">
								Connect to Local Services
							</h3>

							{userProfile?.localEmergencyServicesConnected ? (
								<div className="text-center">
									<div className="bg-green-100 text-green-800 rounded-lg p-4 mb-4">
										<FaCheckCircle className="text-3xl mb-2 mx-auto" />
										<p className="font-bold">Connected to Emergency Services</p>
										<p className="text-sm">
											You're receiving alerts and updates for{" "}
											{userProfile.location.zipCode}
										</p>
									</div>
									<Button variant="danger" onClick={handleDisconnect}>
										Disconnect Services
									</Button>
								</div>
							) : (
								<>
									<div className="mb-4">
										<Input
											id="zipCode"
											label="Your ZIP Code"
											type="text"
											value={zipCode}
											onChange={(e) => setZipCode(e.target.value)}
											placeholder="Enter ZIP code for local alerts"
										/>
									</div>

									<div className="mb-6">
										<Input
											id="orgCode"
											label="Organization Code (Optional)"
											type="text"
											value={orgCode}
											onChange={(e) => setOrgCode(e.target.value)}
											placeholder="For emergency responders & agencies"
										/>
										<p className="text-xs text-gray-500 mt-1">
											If you're part of an emergency response organization,
											enter your code for enhanced features.
										</p>
									</div>

									<Button
										variant="primary"
										onClick={handleConnectServices}
										fullWidth
									>
										Connect to Emergency Services
									</Button>
								</>
							)}
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<h4 className="font-bold text-lg mb-3 text-blue-800">
								Why Connect?
							</h4>
							<ul className="space-y-3">
								<li className="flex items-start">
									<FaBell className="text-blue-700 mt-1 mr-2 flex-shrink-0" />
									<span>
										Receive real-time emergency alerts specific to your area
									</span>
								</li>
								<li className="flex items-start">
									<FaMapMarkerAlt className="text-blue-700 mt-1 mr-2 flex-shrink-0" />
									<span>Access evacuation routes and shelter locations</span>
								</li>
								<li className="flex items-start">
									<FaPhoneAlt className="text-blue-700 mt-1 mr-2 flex-shrink-0" />
									<span>
										Direct connection to local emergency response teams
									</span>
								</li>
								<li className="flex items-start">
									<FaBullhorn className="text-blue-700 mt-1 mr-2 flex-shrink-0" />
									<span>Community-specific preparation guidelines</span>
								</li>
							</ul>
						</div>
					</div>

					{}
					<div>
						<h3 className="text-xl font-bold mb-4 text-gray-800">
							Emergency Resources
						</h3>

						<div className="space-y-4">
							<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<h4 className="font-bold text-lg mb-2 flex items-center">
									<FaHandshake className="text-red-600 mr-2" />
									Community Response Teams
								</h4>
								<p className="text-gray-600 mb-3">
									Join local community emergency response teams and receive
									professional training.
								</p>
								<a
									href="#"
									className="text-red-600 hover:text-red-800 font-medium inline-flex items-center"
								>
									Learn More <FaExternalLinkAlt className="ml-1 text-sm" />
								</a>
							</div>

							<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<h4 className="font-bold text-lg mb-2 flex items-center">
									<FaClipboardCheck className="text-red-600 mr-2" />
									Preparedness Certification
								</h4>
								<p className="text-gray-600 mb-3">
									Earn official certification in disaster preparedness and
									response procedures.
								</p>
								<a
									href="#"
									className="text-red-600 hover:text-red-800 font-medium inline-flex items-center"
								>
									View Programs <FaExternalLinkAlt className="ml-1 text-sm" />
								</a>
							</div>

							{showIntegrationOptions && (
								<div className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
									<h4 className="font-bold text-lg mb-2 flex items-center">
										<FaChartLine className="text-green-600 mr-2" />
										Local Emergency Service Integration
									</h4>
									<p className="text-gray-600 mb-3">
										Your simulation data can now be shared with local emergency
										services for improved community preparedness planning.
									</p>
									<div className="flex space-x-2">
										<Button variant="success" size="small">
											Enable Data Sharing
										</Button>
										<Button variant="outline" size="small">
											Privacy Settings
										</Button>
									</div>
								</div>
							)}

							<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<h4 className="font-bold text-lg mb-2 flex items-center">
									<FaChartLine className="text-red-600 mr-2" />
									Advanced Training Simulations
								</h4>
								<p className="text-gray-600 mb-3">
									Access professional-level disaster simulations used by
									emergency response agencies.
								</p>
								<Button variant="outline" size="small">
									Request Access
								</Button>
							</div>
						</div>

						<div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<p className="text-yellow-800">
								We're working with emergency services nationwide to bring you
								enhanced features:
							</p>
							<ul className="mt-2 space-y-1 text-sm text-yellow-800">
								<li>• Live emergency service integration with real agencies</li>
								<li>• Official emergency response certifications</li>
								<li>• AR/VR disaster simulations for immersive training</li>
								<li>• Multi-tier difficulty levels for progressive learning</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const UserProfileView: React.FC<{
	userProfile: UserProfile;
	onUpdateProfile: (updates: Partial<UserProfile>) => void;
}> = ({ userProfile, onUpdateProfile }) => {
	const [name, setName] = useState(userProfile.name || "");
	const [city, setCity] = useState(userProfile.location.city || "");
	const [state, setState] = useState(userProfile.location.state || "");
	const [zipCode, setZipCode] = useState(userProfile.location.zipCode || "");
	const [emergencyContact, setEmergencyContact] = useState(
		userProfile.emergencyContact || ""
	);
	const [notifications, setNotifications] = useState(
		userProfile.notificationsEnabled
	);

	const handleSaveProfile = () => {
		onUpdateProfile({
			name,
			location: { city, state, zipCode },
			emergencyContact,
			notificationsEnabled: notifications,
		});
		toast.success("Profile updated successfully!");
	};

	return (
		<div className="bg-white rounded-xl shadow-lg">
			<div className="bg-gray-800 text-white p-6 rounded-t-xl">
				<h2 className="text-2xl font-bold mb-2 flex items-center">
					<FaUserShield className="mr-2" /> Your Disaster Readiness Profile
				</h2>
				<p>
					Manage your profile information to enhance your disaster preparedness
					experience.
				</p>
			</div>

			<div className="p-6">
				<div className="grid md:grid-cols-2 gap-8">
					{}
					<div>
						<h3 className="text-xl font-bold mb-4 text-gray-800">
							Personal Information
						</h3>

						<div className="space-y-4">
							<Input
								id="name"
								label="Full Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your full name"
							/>

							<div className="grid grid-cols-2 gap-4">
								<Input
									id="city"
									label="City"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									placeholder="Your city"
								/>

								<Input
									id="state"
									label="State"
									value={state}
									onChange={(e) => setState(e.target.value)}
									placeholder="Your state"
								/>
							</div>

							<Input
								id="zipCode"
								label="ZIP Code"
								value={zipCode}
								onChange={(e) => setZipCode(e.target.value)}
								placeholder="Your ZIP code"
							/>

							<Input
								id="emergencyContact"
								label="Emergency Contact"
								value={emergencyContact}
								onChange={(e) => setEmergencyContact(e.target.value)}
								placeholder="Phone number or email"
							/>

							<div className="flex items-center py-2">
								<input
									id="notifications"
									type="checkbox"
									checked={notifications}
									onChange={(e) => setNotifications(e.target.checked)}
									className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
								/>
								<label
									htmlFor="notifications"
									className="ml-2 text-sm font-medium text-gray-700"
								>
									Enable notifications for disaster alerts and updates
								</label>
							</div>

							<Button variant="primary" onClick={handleSaveProfile}>
								Save Profile
							</Button>
						</div>
					</div>

					{}
					<div>
						<h3 className="text-xl font-bold mb-4 text-gray-800">
							Your Readiness Stats
						</h3>

						<div className="bg-gray-50 rounded-lg p-6 mb-6">
							<div className="flex items-center justify-between mb-4">
								<h4 className="font-bold">Readiness Score</h4>
								<div className="text-xl font-bold text-red-600">73%</div>
							</div>

							<div className="space-y-3">
								<div>
									<div className="flex justify-between mb-1 text-sm">
										<span>Scenarios Completed</span>
										<span className="font-medium">12</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-red-600 h-2 rounded-full"
											style={{ width: "60%" }}
										></div>
									</div>
								</div>

								<div>
									<div className="flex justify-between mb-1 text-sm">
										<span>Average Score</span>
										<span className="font-medium">78%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-red-600 h-2 rounded-full"
											style={{ width: "78%" }}
										></div>
									</div>
								</div>

								<div>
									<div className="flex justify-between mb-1 text-sm">
										<span>Difficulty Levels Tried</span>
										<span className="font-medium">2/3</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-red-600 h-2 rounded-full"
											style={{ width: "67%" }}
										></div>
									</div>
								</div>

								<div>
									<div className="flex justify-between mb-1 text-sm">
										<span>Profile Completion</span>
										<span className="font-medium">90%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-red-600 h-2 rounded-full"
											style={{ width: "90%" }}
										></div>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-gray-50 rounded-lg p-6">
							<h4 className="font-bold mb-4">Achievements</h4>

							<div className="flex flex-wrap gap-3">
								<div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center">
									<div className="bg-green-100 text-green-800 p-2 rounded-full mr-3">
										<FaCheckCircle />
									</div>
									<div>
										<div className="font-medium text-sm">First Responder</div>
										<div className="text-xs text-gray-500">
											Completed 10 scenarios
										</div>
									</div>
								</div>

								<div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center">
									<div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
										<FaUsers />
									</div>
									<div>
										<div className="font-medium text-sm">Team Leader</div>
										<div className="text-xs text-gray-500">
											Hosted 5 collaborative sessions
										</div>
									</div>
								</div>

								<div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center opacity-50">
									<div className="bg-gray-100 text-gray-500 p-2 rounded-full mr-3">
										<FaFire />
									</div>
									<div>
										<div className="font-medium text-sm">Fire Expert</div>
										<div className="text-xs text-gray-500">
											Master all fire scenarios
										</div>
									</div>
								</div>

								<div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center opacity-50">
									<div className="bg-gray-100 text-gray-500 p-2 rounded-full mr-3">
										<FaShieldAlt />
									</div>
									<div>
										<div className="font-medium text-sm">Safety Champion</div>
										<div className="text-xs text-gray-500">
											Maintain 90%+ safety rating
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const useUnsavedChangesAlert = (hasUnsavedChanges: boolean) => {
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue =
					"You have unsaved changes. Are you sure you want to leave?";
				return e.returnValue;
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);
};

const DisasterResponseApp: React.FC = () => {
	const LOCAL_STORAGE_KEY_SCENARIOS = "disasterReadyScenarios_v3";
	const CURRENT_USER_ID_KEY = "disasterReadyCurrentUserId_v1";
	const USER_PROFILE_KEY = "disasterReadyUserProfile_v1";
	const COLLAB_STORAGE_KEY = "disasterReadyCollabSession_v1";
	const COLLAB_CHANNEL_NAME = "disasterReadyCollabChannel_v1";

	const getUserId = (): string => {
		let userId = localStorage.getItem(CURRENT_USER_ID_KEY);
		if (!userId) {
			userId = generateId("user");
			localStorage.setItem(CURRENT_USER_ID_KEY, userId);
		}
		return userId;
	};

	const createDefaultProfile = (userId: string): UserProfile => {
		return {
			id: userId,
			name: "",
			location: {
				city: "",
				state: "",
				zipCode: "",
			},
			notificationsEnabled: false,
			localEmergencyServicesConnected: false,
		};
	};

	const [currentUserId] = useState<string>(getUserId());
	const [view, setView] = useState<
		| "scenarios"
		| "simulation"
		| "collaborate"
		| "profile"
		| "emergency-services"
	>("scenarios");
	const [allScenarios, setAllScenarios] = useState<Scenario[]>(() => {
		try {
			const s = localStorage.getItem(LOCAL_STORAGE_KEY_SCENARIOS);
			return s ? [...baseScenarios, ...JSON.parse(s)] : [...baseScenarios];
		} catch (e) {
			return [...baseScenarios];
		}
	});
	const [userProfile, setUserProfile] = useState<UserProfile>(() => {
		try {
			const p = localStorage.getItem(USER_PROFILE_KEY);
			return p ? JSON.parse(p) : createDefaultProfile(currentUserId);
		} catch (e) {
			return createDefaultProfile(currentUserId);
		}
	});
	const [simulation, setSimulation] = useState<SimulationState | null>(null);
	const [activeCollabSession, setActiveCollabSession] =
		useState<CollaborativeSession | null>(null);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [confirmation, setConfirmation] = useState<{
		isOpen: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
	}>({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: () => {},
	});

	const collabBc = useMemo(() => new BroadcastChannel(COLLAB_CHANNEL_NAME), []);

	useUnsavedChangesAlert(simulation !== null && !simulation.isComplete);

	useEffect(() => {
		const c = allScenarios.filter((s) => s.isCustom);
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY_SCENARIOS, JSON.stringify(c));
		} catch (e) {
			toast.error("Failed to save custom scenarios.");
		}
	}, [allScenarios]);

	useEffect(() => {
		try {
			localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
		} catch (e) {
			toast.error("Failed to save user profile.");
		}
	}, [userProfile]);

	const updateSimFromCollab = useCallback(
		(sessionData: CollaborativeSession | null) => {
			if (sessionData && sessionData.participants.includes(currentUserId)) {
				const scenarioForCollab = allScenarios.find(
					(s) => s.id === sessionData.scenarioId
				);
				if (scenarioForCollab) {
					setSimulation({
						currentScenario: scenarioForCollab,
						currentDecisionId: sessionData.currentDecisionId,
						stats: sessionData.stats,
						history: [],
						isComplete: Boolean(sessionData.isComplete),
						isFailed: Boolean(sessionData.isFailed),
					});
					if (view !== "simulation") setView("simulation");
				}
				setActiveCollabSession(sessionData);
			} else {
				if (
					activeCollabSession &&
					simulation?.currentScenario?.id === activeCollabSession.scenarioId
				) {
					setSimulation(null);
					if (view === "simulation") setView("scenarios");
				}
				setActiveCollabSession(null);
			}
		},
		[
			allScenarios,
			currentUserId,
			view,
			activeCollabSession,
			simulation?.currentScenario?.id,
		]
	);

	useEffect(() => {
		const handleStorage = (e: StorageEvent) => {
			if (e.key === COLLAB_STORAGE_KEY) {
				updateSimFromCollab(e.newValue ? JSON.parse(e.newValue) : null);
			}
		};

		const handleChannel = (e: MessageEvent) => {
			if (e.data.type === "SESSION_UPDATE" || e.data.type === "SESSION_ENDED") {
				updateSimFromCollab(e.data.payload);
			}
		};

		window.addEventListener("storage", handleStorage);
		collabBc.onmessage = handleChannel;

		const currentSessionData = localStorage.getItem(COLLAB_STORAGE_KEY);
		updateSimFromCollab(
			currentSessionData ? JSON.parse(currentSessionData) : null
		);

		return () => {
			window.removeEventListener("storage", handleStorage);
			collabBc.onmessage = null;
		};
	}, [updateSimFromCollab, collabBc]);

	const startSimulation = useCallback(
		(scenario: Scenario, collabSessionId?: string, collabHostId?: string) => {
			const simState: SimulationState = {
				currentScenario: scenario,
				currentDecisionId: scenario.startDecisionId,
				stats: { ...scenario.initialStats },
				history: [],
				isComplete: false,
				isFailed: false,
			};
			setSimulation(simState);
			setView("simulation");
			window.scrollTo(0, 0);

			if (collabSessionId && collabHostId === currentUserId) {
				const cs = JSON.parse(
					localStorage.getItem(COLLAB_STORAGE_KEY) || "{}"
				) as Partial<CollaborativeSession>;

				const us: CollaborativeSession = {
					...cs,
					sessionId: collabSessionId,
					hostId: collabHostId,
					scenarioId: scenario.id,
					scenarioTitle: scenario.title,
					currentDecisionId: scenario.startDecisionId,
					stats: { ...scenario.initialStats },
					isComplete: false as boolean,
					isFailed: false as boolean,
					participants: [
						currentUserId,
						...(cs.participants?.filter((p) => p !== currentUserId) || []),
					],
					lastUpdate: Date.now(),
				};

				setActiveCollabSession(us);
				localStorage.setItem(COLLAB_STORAGE_KEY, JSON.stringify(us));
				collabBc.postMessage({ type: "SESSION_UPDATE", payload: us });
			} else if (!collabSessionId && activeCollabSession) {
				localStorage.removeItem(COLLAB_STORAGE_KEY);
				collabBc.postMessage({ type: "SESSION_ENDED", payload: null });
				setActiveCollabSession(null);
			}
		},
		[currentUserId, collabBc, activeCollabSession]
	);

	const makeDecision = useCallback(
		(decision: Decision) => {
			if (!simulation || simulation.isComplete) return;

			if (activeCollabSession && activeCollabSession.hostId !== currentUserId) {
				toast.error("Only the host can make decisions.");
				return;
			}

			const newStats = {
				safety: Math.max(
					0,
					Math.min(100, simulation.stats.safety + decision.consequences.safety)
				),
				resources: Math.max(
					0,
					Math.min(
						100,
						simulation.stats.resources + decision.consequences.resources
					)
				),
				community: Math.max(
					0,
					Math.min(
						100,
						simulation.stats.community + decision.consequences.community
					)
				),
				time: Math.max(
					0,
					Math.min(100, simulation.stats.time + decision.consequences.time)
				),
			};

			const newHistory = [
				...simulation.history,
				{ decision, timestamp: Date.now() },
			];

			let newIsComplete: boolean = simulation.isComplete;
			let newIsFailed: boolean = Boolean(simulation.isFailed);
			let newCurrentDecisionId = simulation.currentDecisionId;

			if (decision.outcome) {
				newIsComplete = true;
				if (decision.isFailure) {
					newIsFailed = true;
				}
			} else if (decision.nextDecisionId) {
				newCurrentDecisionId = decision.nextDecisionId;
			}

			const updatedSimState: SimulationState = {
				...simulation,
				stats: newStats,
				history: newHistory,
				isComplete: newIsComplete,
				isFailed: newIsFailed,
				currentDecisionId: newCurrentDecisionId,
			};

			setSimulation(updatedSimState);

			if (activeCollabSession && activeCollabSession.hostId === currentUserId) {
				const updatedCollabSession: CollaborativeSession = {
					...activeCollabSession,
					stats: newStats,
					currentDecisionId: newCurrentDecisionId,
					isComplete: newIsComplete,
					isFailed: newIsFailed,
					lastUpdate: Date.now(),
				};

				setActiveCollabSession(updatedCollabSession);
				localStorage.setItem(
					COLLAB_STORAGE_KEY,
					JSON.stringify(updatedCollabSession)
				);

				collabBc.postMessage({
					type: "SESSION_UPDATE",
					payload: updatedCollabSession,
				});
			}
		},
		[simulation, activeCollabSession, currentUserId, collabBc]
	);

	const handleLeaveCollabSession = useCallback(() => {
		if (!activeCollabSession) return;

		const endSession = () => {
			localStorage.removeItem(COLLAB_STORAGE_KEY);
			collabBc.postMessage({ type: "SESSION_ENDED", payload: null });
			toast.success(
				activeCollabSession.hostId === currentUserId
					? "Hosted session ended."
					: "Left the session."
			);
		};

		if (activeCollabSession.hostId === currentUserId) {
			endSession();
		} else {
			const updatedParticipants = activeCollabSession.participants.filter(
				(pId) => pId !== currentUserId
			);

			if (
				updatedParticipants.length === 0 ||
				(updatedParticipants.length === 1 &&
					updatedParticipants[0] === activeCollabSession.hostId)
			) {
				endSession();
			} else {
				const updatedSession = {
					...activeCollabSession,
					participants: updatedParticipants,
					lastUpdate: Date.now(),
				};

				localStorage.setItem(
					COLLAB_STORAGE_KEY,
					JSON.stringify(updatedSession)
				);

				collabBc.postMessage({
					type: "SESSION_UPDATE",
					payload: updatedSession,
				});

				toast.success("Left the session.");
				setActiveCollabSession(null);
				setSimulation(null);
				setView("scenarios");
			}
		}
	}, [activeCollabSession, currentUserId, collabBc]);

	const resetSimulation = useCallback(() => {
		if (activeCollabSession) {
			requestConfirmation(
				"Leave Session?",
				"Are you sure you want to leave this collaborative session?",
				handleLeaveCollabSession
			);
		} else {
			setSimulation(null);
			setView("scenarios");
			window.scrollTo(0, 0);
		}
	}, [activeCollabSession, handleLeaveCollabSession]);

	const requestConfirmation = (
		title: string,
		message: string,
		onConfirmAction: () => void
	) => {
		setConfirmation({
			isOpen: true,
			title,
			message,
			onConfirm: () => {
				onConfirmAction();
				setConfirmation((c) => ({ ...c, isOpen: false }));
			},
		});
	};

	const handleShareSimulation = useCallback(() => {
		if (!simulation || !simulation.isComplete) return;
		setShowShareModal(true);
	}, [simulation]);

	const currentDecisions = useMemo(() => {
		if (!simulation?.currentScenario || simulation.isComplete) return [];
		return (
			simulation.currentScenario.decisions[simulation.currentDecisionId] || []
		);
	}, [simulation]);

	const overallScore = useMemo(() => {
		if (!simulation) return 0;
		const { safety, resources, community, time } = simulation.stats;
		return Math.round((safety + resources + community + time) / 4);
	}, [simulation]);

	const handleScenarioCreate = (newScenario: Scenario) => {
		setAllScenarios((prevScenarios) => [
			newScenario,
			...prevScenarios.filter((s) => s.id !== newScenario.id),
		]);
	};

	const handleUpdateProfile = (updates: Partial<UserProfile>) => {
		setUserProfile((prev) => ({
			...prev,
			...updates,
		}));
	};

	const handleNavigation = (
		targetView: "scenarios" | "collaborate" | "profile" | "emergency-services"
	) => {
		const commonNavLogic = () => {
			setView(targetView);
			window.scrollTo(0, 0);
		};

		if (simulation && !simulation.isComplete && !activeCollabSession) {
			requestConfirmation(
				"Leave Simulation?",
				"Your current solo simulation progress will be lost. Continue?",
				() => {
					setSimulation(null);
					commonNavLogic();
				}
			);
		} else if (activeCollabSession && targetView === "scenarios") {
			requestConfirmation(
				"Leave Session?",
				"Leaving this view will exit the collaborative session. Continue?",
				() => {
					handleLeaveCollabSession();
					commonNavLogic();
				}
			);
		} else {
			commonNavLogic();
		}
	};

	const handleShowCreateModal = () => {
		const openCreate = () => {
			setView("scenarios");
			setShowCreateModal(true);
		};

		if (simulation && !simulation.isComplete && !activeCollabSession) {
			requestConfirmation(
				"End Simulation?",
				"Opening the scenario creator will end your current solo simulation. Continue?",
				() => {
					setSimulation(null);
					openCreate();
				}
			);
		} else if (activeCollabSession) {
			toast.error("Cannot create scenarios while in a collaborative session.");
		} else {
			openCreate();
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gray-100">
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap");

				@keyframes modalAppear {
					from {
						opacity: 0;
						transform: translateY(20px) scale(0.95);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
				button,
				a {
					cursor: pointer;
				}
				html,
				body {
					font-family: "Roboto", "Segoe UI", "Helvetica Neue", sans-serif;
				}

				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: "Montserrat", "Segoe UI", "Helvetica Neue", sans-serif;
				}

				@media (max-width: 640px) {
					.container {
						padding-left: 1rem;
						padding-right: 1rem;
					}
				}
			`}</style>

			<Toaster
				position="top-right"
				reverseOrder={false}
				toastOptions={{ duration: 1000 }}
			/>

			<AppHeader
				currentView={view}
				onNavigate={handleNavigation}
				onShowCreateModal={handleShowCreateModal}
			/>

			<main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
				{}
				{view === "scenarios" && (
					<>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-800 mb-2">
								Choose Your Scenario
							</h1>
							<p className="text-lg text-gray-600">
								Select a disaster scenario or create your own to practice
								emergency response skills.
							</p>
						</div>

						{allScenarios.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{allScenarios.map((s) => (
									<ScenarioCard
										key={s.id}
										scenario={s}
										onStart={startSimulation}
									/>
								))}
							</div>
						) : (
							<div className="bg-white rounded-xl shadow-md p-8 text-center">
								<FaInfoCircle className="text-5xl text-gray-400 mx-auto mb-4" />
								<p className="text-lg text-gray-600 mb-6">
									No scenarios. Create one?
								</p>
								<Button
									variant="primary"
									onClick={handleShowCreateModal}
									iconLeft={<FaPlus />}
								>
									Create Scenario
								</Button>
							</div>
						)}
					</>
				)}

				{}
				{view === "simulation" && simulation && (
					<SimulationView
						simulation={simulation}
						currentDecisions={currentDecisions}
						overallScore={overallScore}
						onMakeDecision={makeDecision}
						onShare={handleShareSimulation}
						onReset={resetSimulation}
						isHostView={
							!activeCollabSession ||
							activeCollabSession.hostId === currentUserId
						}
						activeSession={activeCollabSession}
						onExitSession={handleLeaveCollabSession}
					/>
				)}

				{}
				{view === "collaborate" && (
					<CollaborateView
						scenarios={allScenarios}
						onStartHostedSession={startSimulation}
						currentUserId={currentUserId}
						activeCollabSessionExt={activeCollabSession}
						onLeaveSessionExt={handleLeaveCollabSession}
					/>
				)}

				{}
				{view === "profile" && (
					<UserProfileView
						userProfile={userProfile}
						onUpdateProfile={handleUpdateProfile}
					/>
				)}

				{}
				{view === "emergency-services" && (
					<EmergencyServicesView
						userProfile={userProfile}
						onUpdateProfile={handleUpdateProfile}
					/>
				)}
			</main>

			<AppFooter />

			{}
			<ConfirmModal
				isOpen={confirmation.isOpen}
				title={confirmation.title}
				message={confirmation.message}
				onConfirm={confirmation.onConfirm}
				onCancel={() => setConfirmation((c) => ({ ...c, isOpen: false }))}
			/>

			<ShareModal
				isOpen={showShareModal}
				onClose={() => setShowShareModal(false)}
				overallScore={overallScore}
				scenarioTitle={simulation?.currentScenario?.title}
				scenarioCategory={simulation?.currentScenario?.category}
				isFailed={simulation?.isFailed}
			/>

			<CreateScenarioModal
				isOpen={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onScenarioCreate={handleScenarioCreate}
			/>

			{}
			{simulation?.isComplete &&
				view === "simulation" &&
				!activeCollabSession && (
					<button
						className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-110 transition-all z-40"
						onClick={handleShareSimulation}
						aria-label="Share Results"
					>
						<FaShareSquare size={20} />
					</button>
				)}
		</div>
	);
};

export default DisasterResponseApp;
