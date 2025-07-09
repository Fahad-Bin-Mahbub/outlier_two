"use client";
import { useState, useEffect, useRef } from "react";
import {
	Search,
	Menu,
	X,
	Star,
	Play,
	Check,
	Lock,
	ArrowRight,
	Sparkles,
	Building2,
	BookOpen,
	Users,
	Award,
	ChevronDown,
	Globe,
	Twitter,
	Linkedin,
	Github,
	Mail,
	Calendar,
	Clock,
	MapPin,
	User,
	Bell,
	Settings,
} from "lucide-react";

interface Course {
	id: number;
	title: string;
	description: string;
	category: string;
	level: string;
	duration: string;
	image: string;
	altText: string;
	video: string;
	instructor: string;
	isNew: boolean;
	isPopular: boolean;
	price: number;
	rating: number;
}

interface Feature {
	name: string;
	included: boolean;
}

interface PricingPlan {
	id: string;
	name: string;
	price: number;
	interval: string;
	description: string;
	gradient: string;
	features: Feature[];
	highlighted?: boolean;
	cta: string;
}

interface UserProfile {
	name: string;
	email: string;
	avatar: string;
	role: string;
	enrolledCourses: number;
	completedCourses: number;
}

interface CompanyLogo {
	name: string;
	svg: JSX.Element;
}

interface ToastMessage {
	message: string;
	type: "success" | "error" | "info";
}

const coursesData: Course[] = [
	{
		id: 1,
		title: "Frontend Web Development with React",
		description:
			"Learn to build interactive interfaces with the most popular library.",
		category: "web-development",
		level: "Intermediate",
		duration: "40 hours",
		image:
			"https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
		altText: "React Course",
		video: "https://www.youtube.com/embed/w7ejDZ8SWv8?autoplay=1",
		instructor: "Ana Martinez",
		isNew: true,
		isPopular: true,
		price: 39.99,
		rating: 4.8,
	},
	{
		id: 2,
		title: "Introduction to Python for Data Science",
		description: "Master Python basics and its libraries for data analysis.",
		category: "data-science",
		level: "Beginner",
		duration: "35 hours",
		image:
			"https://images.unsplash.com/photo-1624953587687-daf255b6b80a?q=80&w=1974&auto=format&fit=crop",
		altText: "Python Course",
		video: "https://www.youtube.com/embed/rfscVS0vtbw?autoplay=1",
		instructor: "Carlos Ramirez",
		isNew: false,
		isPopular: true,
		price: 29.99,
		rating: 4.7,
	},
	{
		id: 3,
		title: "User Interface (UI) Design",
		description:
			"Create attractive and functional interfaces that your users will love.",
		category: "design",
		level: "Intermediate",
		duration: "25 hours",
		image:
			"https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop",
		altText: "UI Course",
		video: "https://www.youtube.com/embed/c9Wg6Cb_YlU?autoplay=1",
		instructor: "Laura Pinto",
		isNew: false,
		isPopular: false,
		price: 49.99,
		rating: 4.9,
	},
	{
		id: 4,
		title: "Digital Marketing from Scratch",
		description:
			"Learn effective strategies to promote products and services online.",
		category: "marketing",
		level: "Beginner",
		duration: "30 hours",
		image:
			"https://plus.unsplash.com/premium_photo-1684225764999-3597a8da10ab?q=80&w=1932&auto=format&fit=crop",
		altText: "Marketing Course",
		video: "https://www.youtube.com/embed/yKpIpE_bSGQ?autoplay=1",
		instructor: "Diego Mendoza",
		isNew: false,
		isPopular: false,
		price: 34.99,
		rating: 4.6,
	},
];

const pricingPlans: PricingPlan[] = [
	{
		id: "starter",
		name: "Starter",
		price: 29,
		interval: "USD/month",
		description: "Perfect for getting started with online learning",
		gradient: "from-gray-800 to-gray-900",
		features: [
			{ name: "5 courses", included: true },
			{ name: "50 students", included: true },
			{ name: "Email support", included: true },
			{ name: "Course certificates", included: true },
			{ name: "Advanced analytics", included: false },
			{ name: "Custom branding", included: false },
			{ name: "API access", included: false },
			{ name: "White-label platform", included: false },
		],
		cta: "Get Started",
	},
	{
		id: "professional",
		name: "Professional",
		price: 79,
		interval: "USD/month",
		description: "For serious creators looking to scale",
		gradient: "from-blue-600 to-indigo-600",
		features: [
			{ name: "20 courses", included: true },
			{ name: "500 students", included: true },
			{ name: "Priority support", included: true },
			{ name: "Course certificates", included: true },
			{ name: "Advanced analytics", included: true },
			{ name: "Custom branding", included: true },
			{ name: "API access", included: false },
			{ name: "White-label platform", included: false },
		],
		highlighted: true,
		cta: "Upgrade now",
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: 199,
		interval: "USD/month",
		description: "Complete solution for educational organizations",
		gradient: "from-purple-600 to-pink-600",
		features: [
			{ name: "Unlimited courses", included: true },
			{ name: "Unlimited students", included: true },
			{ name: "24/7 Phone & Email support", included: true },
			{ name: "Course certificates", included: true },
			{ name: "Advanced analytics", included: true },
			{ name: "Custom branding", included: true },
			{ name: "API access", included: true },
			{ name: "White-label platform", included: true },
		],
		cta: "Contact sales",
	},
];

const companyLogos: CompanyLogo[] = [
	{
		name: "Google",
		svg: (
			<svg viewBox="0 0 272 92" className="h-8 w-auto">
				<path
					fill="currentColor"
					d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
				/>
				<path
					fill="currentColor"
					d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
				/>
				<path
					fill="currentColor"
					d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
				/>
				<path fill="currentColor" d="M225 3v65h-9.5V3h9.5z" />
				<path
					fill="currentColor"
					d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
				/>
				<path
					fill="currentColor"
					d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
				/>
			</svg>
		),
	},
	{
		name: "Microsoft",
		svg: (
			<svg viewBox="0 0 150 31" className="h-8 w-auto">
				<path
					fill="currentColor"
					d="M150 14.5v-1.837h-3.344v-4.262l-.118.036-3.141.955-.066.02v3.251h-4.949V10.81c0-.837.184-1.474.55-1.905.361-.425.889-.639 1.566-.639.484 0 .982.123 1.485.367l.126.061V6.819l-.058-.022c-.474-.178-1.12-.268-1.92-.268-.999 0-1.91.219-2.708.651a4.639 4.639 0 0 0-1.878 1.842c-.444.788-.67 1.689-.67 2.677v2.964h-2.328v1.837h2.328v9.308h3.344V14.5h4.949v5.903c0 2.422 1.139 3.653 3.384 3.653.368 0 .754-.036 1.15-.108.402-.074.673-.146.836-.221l.035-.017v-1.848l-.14.095a2.254 2.254 0 0 1-.602.255 2.513 2.513 0 0 1-.656.095c-.644 0-1.116-.179-1.4-.533-.288-.359-.434-.959-.434-1.782V14.5H150Zm-26.063-7.724v17.032h3.344V6.776h-3.344Zm-11.293 0v17.032h3.344V6.776h-3.344Zm15.118 5.191c-1.169-.857-2.618-1.292-4.303-1.292-1.687 0-3.136.435-4.304 1.293-1.168.857-1.76 2.132-1.76 3.794 0 1.612.574 2.866 1.708 3.726 1.128.855 2.552 1.289 4.229 1.289.902 0 1.76-.132 2.548-.392a5.297 5.297 0 0 0 2.078-1.24v1.241h3.344v-4.622c0-1.664-.591-2.939-1.76-3.797Zm-1.684 5.443c-.445.491-1.171.74-2.163.74-.991 0-1.717-.249-2.162-.74-.439-.483-.66-1.1-.66-1.832 0-.739.223-1.357.665-1.836.446-.484 1.171-.729 2.157-.729.986 0 1.71.245 2.159.729.442.479.666 1.096.666 1.836 0 .733-.22 1.35-.662 1.832Zm-22.099-5.443c-1.169-.857-2.619-1.292-4.303-1.292-1.688 0-3.136.435-4.304 1.293-1.168.857-1.76 2.132-1.76 3.794 0 1.612.574 2.866 1.707 3.726 1.129.855 2.552 1.289 4.229 1.289.903 0 1.76-.132 2.549-.392a5.297 5.297 0 0 0 2.078-1.24v1.241h3.344v-4.622c0-1.664-.592-2.939-1.76-3.797Zm-1.684 5.443c-.445.491-1.171.74-2.163.74-.991 0-1.717-.249-2.162-.74-.439-.483-.661-1.1-.661-1.832 0-.739.224-1.357.665-1.836.446-.484 1.171-.729 2.158-.729.986 0 1.71.245 2.159.729.441.479.665 1.096.665 1.836 0 .733-.22 1.35-.661 1.832ZM78.753 11.967c-.669-.7-1.808-1.055-3.387-1.055h-5.294v12.896h3.343V19.46h1.983c1.559 0 2.707-.36 3.409-1.07.703-.711 1.059-1.69 1.059-2.907 0-1.218-.356-2.196-1.059-2.907l-.054-.056.5.053.5.044Zm-2.039 4.074c-.322.315-.854.475-1.582.475h-1.717v-3.583h1.717c.728 0 1.26.16 1.582.477.322.315.486.761.486 1.33 0 .568-.164 1.012-.486 1.325v-.024Zm-11.7-5.129h-3.344V23.808h8.629v-2.312h-5.285V10.912ZM44.65 6.776h-8.629v17.032h8.629v-2.312h-5.285v-5.12h5.114v-2.307h-5.114V9.083h5.285V6.776ZM24.303 6.776v2.307h3.948v14.725h3.344V9.083h3.95V6.776h-11.242Z"
				/>
				<path
					fill="currentColor"
					d="M0 0h14.066v14.066H0V0ZM15.934 0H30v14.066H15.934V0ZM0 15.934h14.066V30H0V15.934ZM15.934 15.934H30V30H15.934V15.934Z"
				/>
			</svg>
		),
	},
	{
		name: "Amazon",
		svg: (
			<svg viewBox="0 0 283 64" className="h-8 w-auto">
				<path
					fill="currentColor"
					d="M172.048 55.511c-9.322 6.872-22.846 10.531-34.521 10.531-16.312 0-31.023-6.016-42.149-16.048-.887-.808-.093-1.91 1.02-1.31 12.379 7.526 27.86 11.925 43.807 11.925 10.742 0 22.572-2.237 33.427-6.864 1.673-.693 2.969 1.094 1.416 1.766M176.04 50.97c-1.17-1.5-7.778-1.371-10.756-.703-.894.224-1.058-.672-.221-1.2 5.272-3.706 13.919-2.633 14.916-1.392.998 1.241-.28 9.83-5.168 13.921-.759.627-1.457.308-1.139-.542 1.105-2.76 3.538-8.836 2.368-10.338M157.859 10.671v-3.75c0-.561.435-.946.956-.946h16.9c.52 0 .956.385.956.946v3.215c0 .543-.459.1.252-1.266 2.562-7.296 7.713-10.827 13.593-10.827h2.613c.52 0 .957.386.957.942v8.07c0 .557-.435.988-.935.989-4.932.008-9.858.638-13.458 2.995-1.284.807-1.041.946-1.129 1.368V45.68c0 .562-.436.946-.955.946h-8.698c-.517 0-.955-.384-.955-.946-1-25.598 0-31.29 0-35.01Zm-47.724 30.168c0 5.76 5.35 5.764 7.281 5.764 3.97-.07 6.825-1.02 9.027-2.32 1.092-.645 2.03-.41 2.08.788.042 1.03.048 2.11.098 3.194.051 1.002-.483 1.855-1.503 2.444-2.23 1.285-6.457 2.735-10.962 2.854-8.28.217-14.814-4.356-14.814-13.363 0-10.326 6.145-14.915 14.13-14.915 8.861 0 13.781 5.698 12.557 15.554H110.135Zm8.56-7.028c.17-3.304-2.34-6.434-5.845-6.434-3.622 0-6.31 3.255-6.686 6.434h12.532ZM48.977 40.839c0 5.76 5.35 5.764 7.28 5.764 3.971-.07 6.825-1.02 9.027-2.32 1.093-.645 2.03-.41 2.08.788.042 1.03.049 2.11.099 3.194.052 1.002-.483 1.855-1.504 2.444-2.23 1.285-6.456 2.735-10.962 2.854-8.281.217-14.814-4.356-14.814-13.363 0-10.326 6.146-14.915 14.13-14.915 8.862 0 13.781 5.698 12.557 15.554H48.979Zm8.559-7.028c.17-3.304-2.34-6.434-5.844-6.434-3.623 0-6.31 3.255-6.686 6.434h12.53ZM73.951 4.92c9.65-.571 17.78 2.45 17.78 12.372v22.399c0 2.241-1.842 4.043-4.1 4.043h-4.332c-2.204 0-4-1.716-4.1-3.879-.063-1.012-.083-1.273-1.063-1.98-3.021 3.33-8.179 4.858-12.783 4.858-7.257 0-12.895-4.471-12.895-13.43 0-7.003 3.809-11.767 9.221-14.08 4.69-2.006 11.241-2.368 16.27-2.922V9.957c0-2.07-1.583-4.549-5.281-4.549-3.243 0-5.073 1.624-5.683 4.159-.2.886-1.031 1.75-1.926 1.762l-8.386-.902c-.863-.19-1.821-.884-1.586-2.198C56.493 1.423 66.142-.413 73.951 4.92Zm13.235 24.503c0 3.985.08 7.302-1.904 10.832-1.604 2.851-4.16 4.603-6.991 4.603-3.873 0-6.147-2.953-6.147-7.302 0-8.604 7.699-10.17 15.042-10.17v2.037Zm42.142-24.286v3.321c-3.6 0-6.792 1.19-8.295 5.173-.347.926-.54 1.355-.54 2.593v24.438c0 .562-.428.947-.948.947h-8.55c-.521 0-.949-.385-.949-.947V16.55c0-2.64 1.29-5.173 3.6-5.173h5.8c2.02 0 2.948 1.19 3.301 2.782.617-2.146 2.701-3.62 5.151-3.62.434 0 .868.097 1.302.094l.128.005Zm-92.91 37.638V8.729c0-.561.43-.947.95-.947h8.509c.537 0 .96.433.96.947v34.046c0 .562-.423.947-.96.947H37.37c-.52 0-.95-.434-.95-.947h-.001Zm195.786-25.418c3.096 2.275 6.608 5.173 9.02 8.092l-6.82 6.82c-2.275-2.694-5.035-5.173-8.51-7.452l6.31-7.46Zm-9.17-6.984c3.374 1.846 7.32 5.219 9.437 8.51l-6.867 6.866c-2.222-3.237-5.742-6.662-9.067-8.51l6.497-6.866Zm30.646 4.346c-2.181 1.75-5.347 4.582-7.041 6.497l6.868 6.867c1.756-2.181 4.48-5.114 7.04-7.04l-6.867-6.324Zm9.17 6.984c-2.176 1.574-5.407 4.349-7.182 6.216l6.82 6.82c1.798-2.09 4.537-4.91 7.04-6.82l-6.678-6.216Z"
				/>
			</svg>
		),
	},
	{
		name: "Slack",
		svg: (
			<svg viewBox="0 0 124 31" className="h-8 w-auto">
				<path
					fill="currentColor"
					d="M55.4 25.7h-4.1V8.3h4.1v17.4zm6.2-14.9-5.5 14.9h4.4l5.5-14.9h-4.4zm13.8 9.8c-.9.1-1.8-.1-2.6-.5-.3-.2-.5-.5-.5-.9s.5-.8 1.2-.8c.9 0 1.7.5 1.9 1.3v.9zm4.1 5.2H76v-1.4c-.8 1.2-2.2 1.8-3.6 1.7-1.1 0-2.2-.4-3-.9-.8-.6-1.3-1.5-1.2-2.5 0-1.6 1.2-3.1 3.9-3.1h3.5v-.4c0-1.2-.9-1.9-2.6-1.9-1.1 0-2.1.4-2.9 1l-1.8-2.5c1.5-1.1 3.4-1.7 5.2-1.6 3.5 0 5.9 1.5 5.9 4.9v6.7h.1zm16.3-5.2c-.3 1.4-1.5 2.4-3 2.4-1.9 0-3.1-1.4-3.1-3.5 0-2.2 1.3-3.6 3.1-3.6 1.5 0 2.7 1 3 2.4v2.3zm4.1 5.1h-4.1V13.6h4.1v1.5c.8-1.2 2.1-1.9 3.5-1.9 3.3 0 5.1 2.5 5.1 5.9v6.6h-4.1v-6.1c0-1.8-.9-3-2.6-3-1.5 0-2.8 1.1-2.8 3.1v6h-.1v.1zm9.6-7.3c0-4.5 3.5-7.4 7.5-7.4 2.1-.1 4.1.8 5.5 2.3l-2.5 2.8c-.7-.8-1.8-1.3-2.8-1.2-2 0-3.5 1.4-3.5 3.6 0 2.1 1.4 3.6 3.6 3.6 1.1 0 2.1-.5 2.9-1.3l2.4 2.8c-1.5 1.6-3.6 2.4-5.8 2.3-4.2-.1-7.3-3.2-7.3-7.5zm14.7 0c0-4.4 3.1-7.4 7.6-7.4 4.4 0 7.6 3 7.6 7.4 0 4.4-3.1 7.4-7.6 7.4-4.4 0-7.6-3-7.6-7.4zm11.1 0c0-2.2-1.3-3.6-3.4-3.6s-3.4 1.4-3.4 3.6c0 2.2 1.3 3.6 3.4 3.6s3.4-1.4 3.4-3.6zm5.6 0c0-4.4 3.1-7.4 7.3-7.4 2.3-.1 4.5 1.1 5.6 3l-3.1 1.9c-.5-1-1.6-1.6-2.7-1.5-2.1 0-3.4 1.4-3.4 3.9 0 2.5 1.3 3.9 3.4 3.9 1.1.1 2.2-.6 2.7-1.6l3.1 1.9c-1.2 2-3.4 3.1-5.6 3-4.3.2-7.3-2.8-7.3-7.2v.1zM32 21.9c-.9 0-1.7-.7-1.7-1.7 0-.9.7-1.7 1.7-1.7h5V16c0-.9.7-1.7 1.7-1.7.9 0 1.7.7 1.7 1.7v5H32zm12.5-7.5c0-.9-.7-1.7-1.7-1.7-.9 0-1.7.7-1.7 1.7v5h-2.5c-.9 0-1.7.7-1.7 1.7 0 .9.7 1.7 1.7 1.7h5v-8.4zm-12.5-5c-.9 0-1.7-.7-1.7-1.7 0-.9.7-1.7 1.7-1.7h8.4c.9 0 1.7.7 1.7 1.7 0 .9-.7 1.7-1.7 1.7H32zm7.5-7.5c0-.9-.7-1.7-1.7-1.7-.9 0-1.7.7-1.7 1.7v5h-5c-.9 0-1.7.7-1.7 1.7 0 .9.7 1.7 1.7 1.7h8.4V1.9zM14.6 21.9c-.9 0-1.7-.7-1.7-1.7 0-.9.7-1.7 1.7-1.7h5V16c0-.9.7-1.7 1.7-1.7.9 0 1.7.7 1.7 1.7v5h-8.4zm12.5-7.5c0-.9-.7-1.7-1.7-1.7-.9 0-1.7.7-1.7 1.7v5h-2.5c-.9 0-1.7.7-1.7 1.7 0 .9.7 1.7 1.7 1.7h5v-8.4zm-12.5-5c-.9 0-1.7-.7-1.7-1.7 0-.9.7-1.7 1.7-1.7h8.4c.9 0 1.7.7 1.7 1.7 0 .9-.7 1.7-1.7 1.7h-8.4zm7.5-7.5c0-.9-.7-1.7-1.7-1.7-.9 0-1.7.7-1.7 1.7v5h-5c-.9 0-1.7.7-1.7 1.7 0 .9.7 1.7 1.7 1.7h8.4V1.9z"
				/>
			</svg>
		),
	},
	{
		name: "Netflix",
		svg: (
			<svg viewBox="0 0 111 30" className="h-8 w-auto fill-current">
				<path
					fill="currentColor"
					d="M105.062 14.28 111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"
				/>
			</svg>
		),
	},
];

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}

interface ToastProps {
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	className = "",
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
			modalRef.current?.focus();
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				ref={modalRef}
				className={`relative bg-gray-900 rounded-xl shadow-2xl border border-gray-700 ${className} transform transition-all duration-300 scale-100 opacity-100`}
				tabIndex={-1}
			>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
					aria-label="Close modal"
				>
					<X className="w-6 h-6" />
				</button>
				{children}
			</div>
		</div>
	);
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white flex items-center 
      ${
				type === "success"
					? "bg-green-500"
					: type === "error"
					? "bg-red-500"
					: "bg-blue-600"
			}
      transform transition-all duration-300 translate-y-0 opacity-100`}
		>
			{type === "success" && <Check className="w-5 h-5 mr-2" />}
			{type === "error" && <X className="w-5 h-5 mr-2" />}
			{type === "info" && <Mail className="w-5 h-5 mr-2" />}
			<span>{message}</span>
		</div>
	);
};

export default function LearnHubExport(): JSX.Element {
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [profileDropdownOpen, setProfileDropdownOpen] =
		useState<boolean>(false);
	const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
	const [selectedVideo, setSelectedVideo] = useState<Course | null>(null);
	const [searchValue, setSearchValue] = useState<string>("");
	const [activeCategory, setActiveCategory] = useState<string>("all");
	const [filteredCourses, setFilteredCourses] = useState<Course[]>(coursesData);
	const [toast, setToast] = useState<ToastMessage | null>(null);
	const [activePricingTab, setActivePricingTab] = useState<string>("monthly");
	const [activeProfileTab, setActiveProfileTab] = useState<string>("dashboard");
	const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

	const userProfile: UserProfile = {
		name: "Alex Johnson",
		email: "alex@example.com",
		avatar:
			"https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop",
		role: "Professional Plan",
		enrolledCourses: 4,
		completedCourses: 2,
	};

	useEffect(() => {
		const filtered = coursesData.filter((course) => {
			const matchesSearch =
				searchValue === "" ||
				course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
				course.description.toLowerCase().includes(searchValue.toLowerCase());

			const matchesCategory =
				activeCategory === "all" || course.category === activeCategory;

			return matchesSearch && matchesCategory;
		});

		setFilteredCourses(filtered);
	}, [searchValue, activeCategory]);

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		setToast({ message, type });
	};

	const handleVideoPreview = (course: Course) => {
		setSelectedVideo(course);
		setVideoModalOpen(true);
	};

	const handleEnroll = (course: Course) => {
		showToast(`Successfully enrolled in ${course.title}!`, "success");
	};

	const getCategoryName = (slug: string): string => {
		const categories: { [key: string]: string } = {
			"web-development": "Web Development",
			"data-science": "Data Science",
			design: "Design",
			marketing: "Marketing",
		};
		return categories[slug] || slug;
	};

	const getRatingStars = (rating: number): JSX.Element[] => {
		const stars: JSX.Element[] = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<Star
					key={`full-${i}`}
					className="w-4 h-4 fill-amber-400 text-amber-400"
				/>
			);
		}

		if (hasHalfStar) {
			stars.push(
				<Star
					key="half"
					className="w-4 h-4 text-amber-400"
					style={{ clipPath: "inset(0 50% 0 0)", fill: "currentColor" }}
				/>
			);
		}

		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-600" />);
		}

		return stars;
	};

	const renderHeader = (): JSX.Element => (
		<header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{}
					<div className="flex items-center space-x-3">
						<a href="#" className="flex items-center space-x-2 group">
							<BookOpen className="w-8 h-8 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
							<span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
								LearnHub
							</span>
						</a>
					</div>

					{}
					<nav className="hidden md:flex items-center space-x-8">
						<a
							href="#features"
							className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
						>
							Features
						</a>
						<a
							href="#pricing"
							className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
						>
							Pricing
						</a>
						<a
							href="#testimonials"
							className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
						>
							Testimonials
						</a>
						<a
							href="#faq"
							className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
						>
							FAQ
						</a>
					</nav>

					{}
					<div className="flex items-center space-x-4">
						{}
						<div className="hidden md:block relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="search"
								placeholder="Search..."
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								className="w-40 lg:w-60 bg-gray-800 border border-gray-700 rounded-full py-1.5 pl-9 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-200 transition-all duration-300 focus:w-64 lg:focus:w-80"
							/>
						</div>

						{}
						<div className="relative">
							<button
								onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
								className="flex items-center space-x-1 focus:outline-none group"
								aria-expanded={profileDropdownOpen}
							>
								<div className="relative">
									<img
										src={userProfile.avatar}
										alt={userProfile.name}
										className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"
									/>
									<span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 border border-gray-900"></span>
								</div>
							</button>

							{}
							{profileDropdownOpen && (
								<div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-lg py-1 z-50 border border-gray-700 transform origin-top-right transition-all duration-200">
									<div className="px-4 py-3 border-b border-gray-700">
										<p className="text-sm font-medium text-gray-200">
											{userProfile.name}
										</p>
										<p className="text-xs text-gray-400 truncate">
											{userProfile.email}
										</p>
										<div className="mt-1.5">
											<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
												{userProfile.role}
											</span>
										</div>
									</div>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer"
									>
										My Dashboard
									</a>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer"
									>
										Account Settings
									</a>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer"
									>
										Billing
									</a>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer"
										onClick={() => {
											setProfileDropdownOpen(false);
											setProfileModalOpen(true);
										}}
									>
										View Profile
									</a>
									<div className="border-t border-gray-700 mt-1 pt-1">
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors cursor-pointer"
										>
											Help Center
										</a>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition-colors cursor-pointer"
										>
											Sign Out
										</a>
									</div>
								</div>
							)}
						</div>

						{}
						<button
							className="md:hidden rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							<span className="sr-only">Open menu</span>
							{mobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{}
			{mobileMenuOpen && (
				<div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 animate-fadeIn">
					<div className="px-2 pt-2 pb-3 space-y-1">
						<div className="px-3 py-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="search"
									placeholder="Search..."
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									className="block w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
								/>
							</div>
						</div>
						<a
							href="#features"
							className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
						>
							Features
						</a>
						<a
							href="#pricing"
							className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
						>
							Pricing
						</a>
						<a
							href="#testimonials"
							className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
						>
							Testimonials
						</a>
						<a
							href="#faq"
							className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
						>
							FAQ
						</a>
					</div>
				</div>
			)}
		</header>
	);

	const renderHeroSection = (): JSX.Element => (
		<section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 pt-24 pb-16 md:pt-32 md:pb-24">
			{}
			<div className="absolute inset-0 overflow-hidden opacity-30">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
				<div className="absolute top-60 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
				<div className="absolute bottom-40 right-20 w-80 h-80 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
				<div className="text-center max-w-3xl mx-auto">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 pb-2">
							The learning platform
						</span>
						<span className="block text-white">built for your success</span>
					</h1>
					<p className="mt-6 text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
						Transform your team with our powerful educational platform. Deliver
						engaging courses, track progress, and elevate skills to the next
						level.
					</p>
					<div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
						<a
							href="#pricing"
							className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
						>
							See our pricing
						</a>
						<a
							href="#features"
							className="px-8 py-3.5 bg-gray-800 text-gray-200 font-medium rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-gray-600 cursor-pointer"
						>
							Explore features
						</a>
					</div>
				</div>

				{}
				<div className="mt-20 max-w-5xl mx-auto">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-8 border border-gray-700/50 transform transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-800/70">
							<div className="text-3xl font-bold text-white">50K+</div>
							<div className="mt-1 text-sm text-gray-400">Active learners</div>
						</div>
						<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-8 border border-gray-700/50 transform transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-gray-800/70">
							<div className="text-3xl font-bold text-white">200+</div>
							<div className="mt-1 text-sm text-gray-400">
								Expert instructors
							</div>
						</div>
						<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-8 border border-gray-700/50 transform transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-gray-800/70">
							<div className="text-3xl font-bold text-white">95%</div>
							<div className="mt-1 text-sm text-gray-400">Completion rate</div>
						</div>
						<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-8 border border-gray-700/50 transform transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:bg-gray-800/70">
							<div className="text-3xl font-bold text-white">24/7</div>
							<div className="mt-1 text-sm text-gray-400">
								Support available
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);

	const renderFeaturesSection = (): JSX.Element => (
		<section id="features" className="py-20 bg-gray-950">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl font-bold text-white">
						Everything you need to deliver amazing learning experiences
					</h2>
					<p className="mt-4 text-xl text-gray-400">
						Our platform includes all the tools you need to create, manage, and
						scale your educational content.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{}
					<div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30">
						<div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
							<BookOpen className="w-6 h-6 text-blue-400" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							Comprehensive Course Creation
						</h3>
						<p className="text-gray-400">
							Build interactive courses with video, quizzes, assignments, and
							more. Our intuitive editor makes it simple.
						</p>
					</div>

					{}
					<div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30">
						<div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
							<Users className="w-6 h-6 text-purple-400" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							User Management
						</h3>
						<p className="text-gray-400">
							Easily organize students into groups, track progress, and provide
							personalized learning paths.
						</p>
					</div>

					{}
					<div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30">
						<div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
							<Award className="w-6 h-6 text-indigo-400" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							Certifications
						</h3>
						<p className="text-gray-400">
							Create custom certificates for course completion that students can
							share on LinkedIn and other platforms.
						</p>
					</div>

					{}
					<div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">
						<div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
							<Globe className="w-6 h-6 text-green-400" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							White Labeling
						</h3>
						<p className="text-gray-400">
							Customize the platform with your brand colors, logo, and domain
							for a seamless experience.
						</p>
					</div>

					{}
					<div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30">
						<div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-6">
							<Play className="w-6 h-6 text-amber-400" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							Interactive Content
						</h3>
						<p className="text-gray-400">
							Engage learners with interactive exercises, assessments, and
							multimedia content.
						</p>
					</div>

					{}
					<div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30">
						<div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
							<Settings className="w-6 h-6 text-red-400" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">
							API Access
						</h3>
						<p className="text-gray-400">
							Integrate with your existing tools and systems through our
							comprehensive API.
						</p>
					</div>
				</div>
			</div>
		</section>
	);

	const renderPricingSection = (): JSX.Element => (
		<section
			id="pricing"
			className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-blue-300">
						Pricing that scales with your ambition
					</h2>
					<p className="mt-4 text-xl text-gray-400">
						Choose the perfect plan for your educational journey. Start small,
						grow without limits.
					</p>
				</div>

				{}
				<div className="flex justify-center mb-12">
					<div className="inline-flex p-1 bg-gray-800 rounded-xl">
						<button
							className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
								activePricingTab === "monthly"
									? "bg-blue-600 text-white shadow-lg"
									: "text-gray-400 hover:text-gray-200"
							} cursor-pointer`}
							onClick={() => setActivePricingTab("monthly")}
						>
							Monthly
						</button>
						<button
							className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
								activePricingTab === "annual"
									? "bg-blue-600 text-white shadow-lg"
									: "text-gray-400 hover:text-gray-200"
							} cursor-pointer`}
							onClick={() => setActivePricingTab("annual")}
						>
							Annual{" "}
							<span className="text-xs py-0.5 px-2 bg-green-500/20 text-green-400 rounded-full ml-1">
								Save 20%
							</span>
						</button>
					</div>
				</div>

				{}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{pricingPlans.map((plan) => (
						<div
							key={plan.id}
							className={`relative rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${
								plan.highlighted
									? "ring-2 ring-blue-500 shadow-xl shadow-blue-500/20 bg-gradient-to-b from-blue-900/30 to-indigo-900/30"
									: "bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800"
							}`}
						>
							{plan.highlighted && (
								<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 px-3 py-1 text-center text-sm font-semibold text-white shadow-lg">
									MOST POPULAR
								</div>
							)}

							<div className="p-8">
								<h3 className="flex items-center gap-2 text-2xl font-bold text-white">
									{plan.name === "Starter" && (
										<Sparkles className="h-6 w-6 text-blue-400" />
									)}
									{plan.name === "Professional" && (
										<Star className="h-6 w-6 text-yellow-400" />
									)}
									{plan.name === "Enterprise" && (
										<Building2 className="h-6 w-6 text-purple-400" />
									)}
									{plan.name}
								</h3>
								<p className="mt-3 text-gray-300">{plan.description}</p>
								<div className="mt-6 flex items-baseline">
									<span className="text-5xl font-bold text-white">
										$
										{activePricingTab === "annual"
											? Math.round(plan.price * 0.8)
											: plan.price}
									</span>
									<span className="ml-2 text-gray-400">
										/{activePricingTab === "annual" ? "year" : "month"}
									</span>
								</div>
							</div>

							<div className="p-8 pt-0">
								<ul className="space-y-4 mb-8">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-center gap-3">
											<span
												className={`flex-shrink-0 ${
													feature.included ? "text-blue-400" : "text-gray-600"
												}`}
											>
												{feature.included ? (
													<Check className="w-5 h-5" />
												) : (
													<Lock className="w-5 h-5" />
												)}
											</span>
											<span
												className={`text-sm ${
													feature.included ? "text-gray-300" : "text-gray-500"
												}`}
											>
												{feature.name}
											</span>
										</li>
									))}
								</ul>

								<button
									onClick={() =>
										showToast(
											`You've selected the ${plan.name} plan`,
											"success"
										)
									}
									className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300 transform hover:translate-y-0 hover:shadow-lg focus:outline-none ${
										plan.highlighted
											? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
											: "bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white"
									} cursor-pointer`}
								>
									{plan.cta}
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					))}
				</div>

				{}
				<div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-900/50 rounded-2xl border border-gray-800 p-8 md:p-10">
					<div className="flex flex-col md:flex-row items-center justify-between gap-8">
						<div>
							<h3 className="text-2xl font-bold text-white mb-2">
								Need a custom solution?
							</h3>
							<p className="mt-2 text-gray-400 max-w-2xl">
								Our enterprise plan can be customized to meet your
								organization's specific needs. Contact our sales team to learn
								more.
							</p>
						</div>
						<button
							onClick={() =>
								showToast("Our sales team will contact you soon!", "info")
							}
							className="px-8 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap cursor-pointer"
						>
							Contact Sales
						</button>
					</div>
				</div>
			</div>
		</section>
	);

	const renderCoursesShowcase = (): JSX.Element => (
		<section className="py-20 bg-gray-950">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
					<div>
						<h2 className="text-3xl font-bold text-white mb-4">
							Featured courses
						</h2>
						<p className="text-gray-400 max-w-2xl">
							Explore our top courses created by industry experts to help you
							master new skills.
						</p>
					</div>

					<div className="mt-6 md:mt-0 flex flex-wrap gap-2">
						{[
							"all",
							"web-development",
							"data-science",
							"design",
							"marketing",
						].map((category) => (
							<button
								key={category}
								onClick={() => setActiveCategory(category)}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
									activeCategory === category
										? "bg-blue-600 text-white"
										: "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
								} cursor-pointer`}
							>
								{category === "all" ? "All" : getCategoryName(category)}
							</button>
						))}
					</div>
				</div>

				{}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{filteredCourses.map((course) => (
						<div
							key={course.id}
							className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-xl"
						>
							<div className="relative">
								{course.isNew && (
									<span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
										New
									</span>
								)}
								{course.isPopular && (
									<span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
										Popular
									</span>
								)}
								<div className="relative overflow-hidden h-48">
									<img
										src={course.image}
										alt={course.altText}
										className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
										<button
											onClick={() => handleVideoPreview(course)}
											className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 cursor-pointer"
										>
											<Play className="h-6 w-6" />
										</button>
									</div>
								</div>
							</div>

							<div className="p-6 flex flex-col flex-grow">
								<div className="flex items-center mb-2">
									<div className="flex text-amber-400">
										{getRatingStars(course.rating)}
									</div>
									<span className="text-xs text-gray-400 ml-1">
										({course.rating})
									</span>
								</div>

								<h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
									{course.title}
								</h3>
								<p className="text-sm text-gray-400 mb-4 flex-grow line-clamp-2">
									{course.description}
								</p>

								<div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
									<span className="text-sm font-medium text-blue-400">
										{getCategoryName(course.category)}
									</span>
									<span className="text-sm font-bold text-white">
										${course.price}
									</span>
								</div>

								<button
									onClick={() => handleEnroll(course)}
									className="mt-4 w-full bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white text-sm font-medium py-2 rounded-lg transition-colors duration-300 cursor-pointer"
								>
									Enroll Now
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);

	const renderTestimonialsSection = (): JSX.Element => (
		<section id="testimonials" className="py-20 bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl font-bold text-white">
						Trusted by companies worldwide
					</h2>
					<p className="mt-4 text-xl text-gray-400">
						See what our customers have to say about their experience.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{}
					<div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl">
						<div className="flex items-center mb-6">
							<div className="mr-4">
								<img
									src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2069&auto=format&fit=crop"
									alt="Sarah Johnson"
									className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
								/>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-white">
									Sarah Johnson
								</h4>
								<p className="text-sm text-gray-400">HR Director, TechGlobal</p>
							</div>
						</div>
						<p className="text-gray-300 mb-4">
							"LearnHub has transformed our onboarding process. New hires get up
							to speed 30% faster, and our team loves the intuitive interface."
						</p>
						<div className="flex text-amber-400">
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
						</div>
					</div>

					{}
					<div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl">
						<div className="flex items-center mb-6">
							<div className="mr-4">
								<img
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
									alt="David Martinez"
									className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
								/>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-white">
									David Martinez
								</h4>
								<p className="text-sm text-gray-400">COO, FinanceEdge</p>
							</div>
						</div>
						<p className="text-gray-300 mb-4">
							"The analytics dashboards give us incredible insights into our
							team's learning progress. It's been a game-changer for our L&D
							strategy."
						</p>
						<div className="flex text-amber-400">
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
						</div>
					</div>

					{}
					<div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl">
						<div className="flex items-center mb-6">
							<div className="mr-4">
								<img
									src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop"
									alt="Emily Chen"
									className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
								/>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-white">Emily Chen</h4>
								<p className="text-sm text-gray-400">CEO, StartupBoost</p>
							</div>
						</div>
						<p className="text-gray-300 mb-4">
							"As a fast-growing startup, we needed a scalable solution.
							LearnHub's flexible pricing allowed us to start small and expand
							as our team grew."
						</p>
						<div className="flex text-amber-400">
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
							<Star className="w-5 h-5 fill-current" />
						</div>
					</div>
				</div>

				{}
				<div className="mt-20 pt-12 border-t border-gray-800">
					<p className="text-center text-gray-500 text-sm mb-10">
						TRUSTED BY FORWARD-THINKING COMPANIES
					</p>
					<div className="flex flex-wrap justify-center gap-10 opacity-50">
						{companyLogos.map((logo) => (
							<div key={logo.name} className="h-8 text-gray-400">
								{logo.svg}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);

	const renderFAQSection = (): JSX.Element => (
		<section id="faq" className="py-20 bg-gray-950">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-white">
						Frequently Asked Questions
					</h2>
					<p className="mt-4 text-xl text-gray-400">
						Find answers to common questions about our platform
					</p>
				</div>

				<div className="space-y-6">
					{[
						{
							question: "How does the pricing work?",
							answer:
								"Our pricing is based on the number of users and features you need. We offer monthly and annual billing options, with a discount for annual commitments. You can start with a basic plan and upgrade as your needs grow.",
						},
						{
							question: "Can I customize the platform with my branding?",
							answer:
								"Yes, our Professional and Enterprise plans include custom branding options. You can add your logo, customize colors, and even use your own domain for a seamless branded experience.",
						},
						{
							question: "How do I create and publish courses?",
							answer:
								"Our platform includes an intuitive course builder that lets you create engaging content using various media types. You can organize lessons into modules, add quizzes and assignments, and publish when ready.",
						},
						{
							question: "What kind of support do you offer?",
							answer:
								"All plans include some level of support. Our Starter plan includes email support, Professional includes priority support, and Enterprise includes 24/7 phone and email support plus a dedicated account manager.",
						},
						{
							question: "Can I integrate with my existing tools?",
							answer:
								"Yes, our Enterprise plan includes API access for custom integrations. We also offer pre-built integrations with popular tools like Slack, MS Teams, Salesforce, and more.",
						},
					].map((faq, index) => (
						<div
							key={index}
							className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 group hover:border-blue-500/30 transition-all duration-300"
						>
							<details className="group/item">
								<summary className="flex cursor-pointer items-center justify-between p-6 text-white">
									<h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors duration-300">
										{faq.question}
									</h3>
									<div className="ml-4 flex-shrink-0 rounded-full bg-gray-800 p-1.5 text-gray-400 sm:p-2 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all duration-300">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 group-open:rotate-180 transition-transform duration-300"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</summary>
								<div className="px-6 pb-6 text-gray-400 text-sm animate-fadeIn">
									{faq.answer}
								</div>
							</details>
						</div>
					))}
				</div>

				<div className="mt-16 text-center">
					<p className="text-gray-400 mb-6">Still have questions?</p>
					<button
						onClick={() =>
							showToast("Our support team will contact you shortly!", "info")
						}
						className="inline-flex items-center text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg transition-colors duration-300 cursor-pointer"
					>
						<Mail className="w-4 h-4 mr-2" />
						Contact Support
					</button>
				</div>
			</div>
		</section>
	);

	const renderCTASection = (): JSX.Element => (
		<section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden shadow-xl">
					<div className="px-6 py-12 md:p-12 lg:px-16 lg:py-14 relative">
						<div className="absolute inset-0 opacity-10">
							<div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full"></div>
							<div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full"></div>
						</div>

						<div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
							<div className="max-w-xl">
								<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
									Ready to transform your learning experience?
								</h2>
								<p className="text-blue-100 text-lg">
									Join thousands of organizations already using LearnHub to
									deliver impactful learning experiences.
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-4 lg:flex-shrink-0">
								<a
									href="#pricing"
									className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
								>
									See Pricing
								</a>
								<button
									onClick={() => showToast("Demo request received!", "success")}
									className="px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
								>
									Request Demo
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);

	const renderFooter = (): JSX.Element => (
		<footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12">
					<div className="col-span-2">
						<div className="flex items-center space-x-2 mb-6">
							<BookOpen className="w-8 h-8 text-blue-500" />
							<span className="text-2xl font-bold text-blue-400">LearnHub</span>
						</div>
						<p className="text-gray-400 mb-6 max-w-md">
							The modern learning platform that helps you create, manage, and
							deliver engaging educational content.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
								aria-label="GitHub"
							>
								<Github className="w-5 h-5" />
							</a>
						</div>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							Platform
						</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="#features"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#pricing"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Integrations
								</a>
							</li>
							<li>
								<a
									href="#faq"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									FAQ
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							Company
						</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Careers
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Blog
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
							Legal
						</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Cookie Policy
								</a>
							</li>

							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-blue-400 transition-colors"
								>
									Data Processing
								</a>
							</li>
						</ul>
					</div>
				</div>

				{}
				<div className="mb-12 border-t border-gray-800 pt-8">
					<div className="flex flex-col md:flex-row md:justify-between md:items-center">
						<div className="mb-6 md:mb-0">
							<h3 className="text-lg font-semibold text-white mb-2">
								Subscribe to our newsletter
							</h3>
							<p className="text-gray-400">
								Get the latest updates and news directly to your inbox.
							</p>
						</div>
						<div className="max-w-md w-full">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const target = e.currentTarget;
									const email = target.email.value;
									if (email) {
										showToast("Thank you for subscribing!", "success");
										target.reset();
									}
								}}
								className="flex gap-2"
							>
								<input
									type="email"
									name="email"
									placeholder="Your email address"
									className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
									required
								/>
								<button
									type="submit"
									className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>
				</div>

				{}
				<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-500 text-sm">
						© {new Date().getFullYear()} LearnHub. All rights reserved.
					</p>
					<div className="mt-4 md:mt-0 flex items-center space-x-4">
						<a
							href="#"
							className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
						>
							Privacy
						</a>
						<a
							href="#"
							className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
						>
							Terms
						</a>
						<a
							href="#"
							className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
						>
							Cookies
						</a>
						<a
							href="#"
							className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
						>
							Contact
						</a>
					</div>
				</div>
			</div>
		</footer>
	);

	const renderVideoPreviewModal = (): JSX.Element => (
		<Modal
			isOpen={videoModalOpen}
			onClose={() => setVideoModalOpen(false)}
			className="w-full max-w-3xl"
		>
			<div className="p-6">
				<h3 className="text-xl font-semibold text-white mb-4">
					{selectedVideo?.title}
				</h3>
				<div className="aspect-video rounded-lg overflow-hidden bg-black">
					{selectedVideo && (
						<iframe
							src={selectedVideo.video}
							title={`${selectedVideo.title} preview`}
							className="w-full h-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					)}
				</div>
				<div className="mt-6 space-y-4">
					<p className="text-gray-300">{selectedVideo?.description}</p>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<span className="text-sm text-gray-400">
								{selectedVideo?.level}
							</span>
							<span className="text-gray-500">•</span>
							<span className="text-sm text-gray-400">
								{selectedVideo?.duration}
							</span>
						</div>
						<button
							onClick={() => {
								setVideoModalOpen(false);
								if (selectedVideo) {
									handleEnroll(selectedVideo);
								}
							}}
							className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
						>
							Enroll Now
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);

	const renderProfileModal = (): JSX.Element => (
		<Modal
			isOpen={profileModalOpen}
			onClose={() => setProfileModalOpen(false)}
			className="w-full max-w-2xl"
		>
			<div className="p-6">
				<div className="flex flex-col items-center mb-6">
					<img
						src={userProfile.avatar}
						alt={userProfile.name}
						className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mb-4"
					/>
					<h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
					<p className="text-gray-400">{userProfile.email}</p>
					<div className="mt-2">
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
							{userProfile.role}
						</span>
					</div>
				</div>

				{}
				<div className="border-b border-gray-700 mb-6">
					<div className="flex space-x-8">
						<button
							onClick={() => setActiveProfileTab("dashboard")}
							className={`py-3 border-b-2 text-sm font-medium transition-colors ${
								activeProfileTab === "dashboard"
									? "border-blue-500 text-blue-400"
									: "border-transparent text-gray-400 hover:text-gray-300"
							} cursor-pointer`}
						>
							Dashboard
						</button>
						<button
							onClick={() => setActiveProfileTab("courses")}
							className={`py-3 border-b-2 text-sm font-medium transition-colors ${
								activeProfileTab === "courses"
									? "border-blue-500 text-blue-400"
									: "border-transparent text-gray-400 hover:text-gray-300"
							} cursor-pointer`}
						>
							My Courses
						</button>
						<button
							onClick={() => setActiveProfileTab("settings")}
							className={`py-3 border-b-2 text-sm font-medium transition-colors ${
								activeProfileTab === "settings"
									? "border-blue-500 text-blue-400"
									: "border-transparent text-gray-400 hover:text-gray-300"
							} cursor-pointer`}
						>
							Settings
						</button>
					</div>
				</div>

				{}
				{activeProfileTab === "dashboard" && (
					<div className="animate-fadeIn">
						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
								<h3 className="text-sm font-medium text-gray-400 mb-1">
									Enrolled Courses
								</h3>
								<p className="text-2xl font-bold text-white">
									{userProfile.enrolledCourses}
								</p>
							</div>
							<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
								<h3 className="text-sm font-medium text-gray-400 mb-1">
									Completed
								</h3>
								<p className="text-2xl font-bold text-white">
									{userProfile.completedCourses}
								</p>
							</div>
						</div>

						<h3 className="text-lg font-semibold text-white mb-4">
							Recent Activity
						</h3>
						<div className="space-y-4">
							<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
								<div className="flex justify-between items-start">
									<div>
										<h4 className="text-gray-200 font-medium">
											Completed lesson: React Basics
										</h4>
										<p className="text-sm text-gray-400 mt-1">
											Frontend Web Development with React
										</p>
									</div>
									<span className="text-xs text-gray-500">2 days ago</span>
								</div>
							</div>
							<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
								<div className="flex justify-between items-start">
									<div>
										<h4 className="text-gray-200 font-medium">
											Started course: Python for Data Science
										</h4>
										<p className="text-sm text-gray-400 mt-1">
											Introduction to Python for Data Science
										</p>
									</div>
									<span className="text-xs text-gray-500">4 days ago</span>
								</div>
							</div>
							<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
								<div className="flex justify-between items-start">
									<div>
										<h4 className="text-gray-200 font-medium">
											Earned certificate
										</h4>
										<p className="text-sm text-gray-400 mt-1">
											UI Design Fundamentals
										</p>
									</div>
									<span className="text-xs text-gray-500">1 week ago</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{}
				{activeProfileTab === "courses" && (
					<div className="animate-fadeIn">
						<h3 className="text-lg font-semibold text-white mb-4">
							My Enrolled Courses
						</h3>
						<div className="space-y-4">
							{coursesData.slice(0, 3).map((course, index) => (
								<div
									key={index}
									className="flex bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
								>
									<div className="w-32 flex-shrink-0">
										<img
											src={course.image}
											alt={course.title}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="p-4 flex flex-col flex-grow">
										<h4 className="text-white font-medium mb-1">
											{course.title}
										</h4>
										<div className="flex items-center text-xs text-gray-400 space-x-2 mb-2">
											<span>{course.level}</span>
											<span className="text-gray-600">•</span>
											<span>{course.duration}</span>
										</div>
										<div className="mt-auto flex justify-between items-center">
											<div className="bg-gray-700 rounded-full h-2 w-32">
												<div
													className="bg-blue-500 h-2 rounded-full"
													style={{
														width:
															index === 2
																? "100%"
																: index === 1
																? "60%"
																: "25%",
													}}
												></div>
											</div>
											<span className="text-xs text-gray-400">
												{index === 2
													? "Completed"
													: index === 1
													? "60% complete"
													: "25% complete"}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{}
				{activeProfileTab === "settings" && (
					<div className="animate-fadeIn">
						<h3 className="text-lg font-semibold text-white mb-4">
							Account Settings
						</h3>
						<form className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Full Name
								</label>
								<input
									type="text"
									defaultValue={userProfile.name}
									className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Email
								</label>
								<input
									type="email"
									defaultValue={userProfile.email}
									className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Password
								</label>
								<input
									type="password"
									defaultValue="••••••••"
									className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div className="pt-4">
								<button
									type="button"
									onClick={() => {
										setProfileModalOpen(false);
										showToast("Settings saved successfully!", "success");
									}}
									className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
								>
									Save Changes
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</Modal>
	);

	const renderToastNotification = (): JSX.Element | null => {
		if (!toast) return null;

		return (
			<Toast
				message={toast.message}
				type={toast.type}
				onClose={() => setToast(null)}
			/>
		);
	};

	return (
		<div className="min-h-screen bg-gray-950 text-gray-200">
			{renderHeader()}
			<main>
				{renderHeroSection()}
				{renderFeaturesSection()}
				{renderPricingSection()}
				{renderCoursesShowcase()}
				{renderTestimonialsSection()}
				{renderFAQSection()}
				{renderCTASection()}
			</main>
			{renderFooter()}

			{}
			{renderVideoPreviewModal()}
			{renderProfileModal()}

			{}
			{renderToastNotification()}

			{}
			<style jsx global>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-in-out;
				}
			`}</style>
		</div>
	);
}
