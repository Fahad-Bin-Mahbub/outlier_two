"use client";
import { useState, useEffect } from "react";
import {
	CheckCircle,
	Heart,
	ArrowLeft,
	X,
	Info,
	Facebook,
	Twitter,
	Instagram,
	Lock,
} from "lucide-react";

type Cause = {
	id: string;
	name: string;
	description: string;
	image: string;
	suggestedAmounts: number[];
	goal?: number;
	raised?: number;
};

type DonationDetails = {
	cause: Cause | null;
	amount: number;
	name: string;
	email: string;
};

const Toast = ({
	message,
	type = "info",
	onClose,
}: {
	message: string;
	type?: "success" | "error" | "info";
	onClose: () => void;
}) => {
	return (
		<div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 z-50 animate-fade-in">
			<div
				className={`${
					type === "success"
						? "text-emerald-600"
						: type === "error"
						? "text-red-600"
						: "text-amber-600"
				}`}
			>
				{type === "success" ? (
					<CheckCircle size={20} />
				) : type === "error" ? (
					<X size={20} />
				) : (
					<Info size={20} />
				)}
			</div>
			<p className="text-gray-700">{message}</p>
			<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
				<X size={16} />
			</button>
		</div>
	);
};

const LoadingSpinner = () => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div className="bg-white p-5 rounded-lg flex flex-col items-center">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
			<p className="text-gray-700">Processing your donation...</p>
		</div>
	</div>
);

const ProgressBar = ({ raised, goal }: { raised: number; goal: number }) => {
	const percentage = Math.min(Math.round((raised / goal) * 100), 100);

	return (
		<div className="mb-4">
			<div className="flex justify-between text-sm mb-1">
				<span className="text-gray-600 font-medium">
					${raised.toLocaleString()} raised
				</span>
				<span className="text-gray-500">${goal.toLocaleString()} goal</span>
			</div>
			<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
				<div
					className="h-full bg-emerald-600 rounded-full"
					style={{ width: `${percentage}%` }}
				></div>
			</div>
		</div>
	);
};

const causes: Cause[] = [
	{
		id: "environment",
		name: "Environmental Protection",
		description:
			"Support conservation efforts and fight climate change to protect our planet for future generations.",
		image:
			"https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
		suggestedAmounts: [10, 25, 50, 100],
		goal: 50000,
		raised: 32450,
	},
	{
		id: "education",
		name: "Education for All",
		description:
			"Help provide quality education to underprivileged children worldwide and transform their future.",
		image:
			"https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
		suggestedAmounts: [15, 30, 60, 120],
		goal: 75000,
		raised: 58320,
	},
	{
		id: "healthcare",
		name: "Healthcare Access",
		description:
			"Support medical care for those who can't afford it and help save lives in underserved communities.",
		image:
			"https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
		suggestedAmounts: [20, 40, 75, 150],
		goal: 100000,
		raised: 43250,
	},
	{
		id: "hunger",
		name: "Fight Hunger",
		description:
			"Provide nutritious meals to those facing food insecurity and help eliminate hunger worldwide.",
		image:
			"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
		suggestedAmounts: [5, 15, 45, 90],
		goal: 30000,
		raised: 18790,
	},
];

const CauseSelector = ({
	onSelectCause,
}: {
	onSelectCause: (cause: Cause) => void;
}) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	return (
		<div
			className={`max-w-6xl mx-auto px-4 py-12 transition-opacity duration-500 ${
				isLoaded ? "opacity-100" : "opacity-0"
			}`}
		>
			<h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
				Make a Difference Today
			</h1>
			<p className="text-xl text-center text-gray-600 mb-12">
				Choose a cause you'd like to support
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{causes.map((cause) => (
					<div
						key={cause.id}
						className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl group"
					>
						<div className="relative overflow-hidden h-48">
							<img
								src={cause.image}
								alt={cause.name}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</div>
						<div className="p-6">
							<h3 className="text-xl font-semibold text-gray-800 mb-2 h-14 flex items-center">
								{cause.name}
							</h3>
							<p className="text-gray-600 mb-4 h-24 overflow-hidden">
								{cause.description}
							</p>

							{cause.raised !== undefined && cause.goal !== undefined && (
								<ProgressBar raised={cause.raised} goal={cause.goal} />
							)}

							<button
								onClick={() => onSelectCause(cause)}
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-1 duration-300"
							>
								Support This Cause
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const DonationForm = ({
	cause,
	onBack,
	onSubmit,
	showToast,
}: {
	cause: Cause;
	onBack: () => void;
	onSubmit: (amount: number, name: string, email: string) => void;
	showToast: (message: string, type?: "success" | "error" | "info") => void;
}) => {
	const [amount, setAmount] = useState<number>(cause.suggestedAmounts[1]);
	const [customAmount, setCustomAmount] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [showCustom, setShowCustom] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const validateForm = (): boolean => {
		const newErrors: { [key: string]: string } = {};

		if (!name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (showCustom) {
			if (!customAmount) {
				newErrors.amount = "Please enter a donation amount";
			} else if (
				isNaN(parseFloat(customAmount)) ||
				parseFloat(customAmount) <= 0
			) {
				newErrors.amount = "Please enter a valid donation amount";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const finalAmount = showCustom ? parseFloat(customAmount) : amount;

		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			onSubmit(finalAmount, name, email);
		} catch (error) {
			showToast(
				"There was an error processing your donation. Please try again.",
				"error"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto px-4 py-12">
			{isLoading && <LoadingSpinner />}

			<button
				onClick={onBack}
				className="flex items-center text-emerald-600 mb-8 font-medium hover:text-emerald-800 transition-colors cursor-pointer"
				aria-label="Go back to cause selection"
			>
				<ArrowLeft size={18} className="mr-1" />
				Choose another cause
			</button>

			<div className="bg-white rounded-xl shadow-lg p-8">
				<div className="flex items-start mb-6">
					<div className="w-24 h-24 rounded-lg overflow-hidden mr-6 flex-shrink-0">
						<img
							src={cause.image}
							alt={cause.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<div>
						<h2 className="text-3xl font-bold text-gray-800 mb-2">
							Support {cause.name}
						</h2>
						<p className="text-gray-600">{cause.description}</p>
					</div>
				</div>

				{cause.raised !== undefined && cause.goal !== undefined && (
					<div className="mb-6">
						<ProgressBar raised={cause.raised} goal={cause.goal} />
					</div>
				)}

				<form onSubmit={handleSubmit} noValidate>
					<div className="mb-8">
						<h3 className="text-lg font-medium text-gray-800 mb-4">
							Select donation amount
						</h3>

						{!showCustom && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
								{cause.suggestedAmounts.map((suggestedAmount) => (
									<button
										key={suggestedAmount}
										type="button"
										onClick={() => setAmount(suggestedAmount)}
										className={`py-3 px-4 rounded-lg font-medium cursor-pointer transition-all ${
											amount === suggestedAmount
												? "bg-emerald-600 text-white shadow-md"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										${suggestedAmount}
									</button>
								))}
							</div>
						)}

						{showCustom ? (
							<div className="mb-4">
								<label
									htmlFor="customAmount"
									className="block text-gray-700 mb-2"
								>
									Enter amount
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<span className="text-gray-500">$</span>
									</div>
									<input
										type="number"
										id="customAmount"
										value={customAmount}
										onChange={(e) => setCustomAmount(e.target.value)}
										className={`block w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
											errors.amount ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="Enter amount"
										min="1"
										step="0.01"
										aria-invalid={errors.amount ? "true" : "false"}
										aria-describedby={
											errors.amount ? "amount-error" : undefined
										}
									/>
								</div>
								{errors.amount && (
									<p id="amount-error" className="mt-1 text-red-500 text-sm">
										{errors.amount}
									</p>
								)}
							</div>
						) : null}

						<button
							type="button"
							onClick={() => setShowCustom(!showCustom)}
							className="text-emerald-600 font-medium hover:text-emerald-800 transition-colors cursor-pointer"
						>
							{showCustom ? "Choose suggested amount" : "Enter custom amount"}
						</button>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-medium text-gray-800 mb-4">
							Your Information
						</h3>

						<div className="mb-4">
							<label htmlFor="name" className="block text-gray-700 mb-2">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
									errors.name ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="Enter your full name"
								aria-invalid={errors.name ? "true" : "false"}
								aria-describedby={errors.name ? "name-error" : undefined}
								autoComplete="name"
							/>
							{errors.name && (
								<p id="name-error" className="mt-1 text-red-500 text-sm">
									{errors.name}
								</p>
							)}
						</div>

						<div className="mb-4">
							<label htmlFor="email" className="block text-gray-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
									errors.email ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="Enter your email address"
								aria-invalid={errors.email ? "true" : "false"}
								aria-describedby={errors.email ? "email-error" : undefined}
								autoComplete="email"
							/>
							{errors.email && (
								<p id="email-error" className="mt-1 text-red-500 text-sm">
									{errors.email}
								</p>
							)}
						</div>
					</div>

					<div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
						<div className="flex items-center text-gray-600 text-sm">
							<Lock size={16} className="mr-2 text-gray-500" />
							<span>
								Your payment information is securely processed and encrypted
							</span>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-lg transition-all shadow hover:shadow-lg transform hover:-translate-y-1 duration-300 cursor-pointer"
						disabled={isLoading}
					>
						{isLoading ? "Processing..." : "Complete Donation"}
					</button>
				</form>
			</div>
		</div>
	);
};

const ThankYouPage = ({
	donationDetails,
	onDonateAgain,
}: {
	donationDetails: DonationDetails;
	onDonateAgain: () => void;
}) => {
	const [animateIn, setAnimateIn] = useState(false);

	useEffect(() => {
		setTimeout(() => setAnimateIn(true), 100);
	}, []);

	const transactionId = `GH-${Math.floor(Math.random() * 1000000)
		.toString()
		.padStart(6, "0")}`;

	return (
		<div
			className={`max-w-2xl mx-auto px-4 py-12 text-center transition-all duration-500 transform ${
				animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
			}`}
		>
			<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
				<div className="mb-6">
					<div className="bg-emerald-100 mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6">
						<CheckCircle size={40} className="text-emerald-600" />
					</div>
					<h2 className="text-3xl font-bold text-gray-800 mb-2">
						Thank You, {donationDetails.name}!
					</h2>
					<p className="text-gray-600 text-xl mb-4">
						Your donation has been received.
					</p>
				</div>

				<div className="bg-gray-50 rounded-lg p-6 mb-6">
					<div className="flex justify-between mb-2">
						<span className="text-gray-600">Donation Amount:</span>
						<span className="font-medium text-gray-800">
							${donationDetails.amount.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between mb-2">
						<span className="text-gray-600">Cause:</span>
						<span className="font-medium text-gray-800">
							{donationDetails.cause?.name}
						</span>
					</div>
					<div className="flex justify-between mb-2">
						<span className="text-gray-600">Email:</span>
						<span className="font-medium text-gray-800">
							{donationDetails.email}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Transaction ID:</span>
						<span className="font-medium text-gray-800">{transactionId}</span>
					</div>
				</div>

				<div className="mb-6 text-left">
					<h3 className="font-semibold text-lg mb-2">What happens next?</h3>
					<ul className="space-y-2 text-gray-600">
						<li className="flex items-start">
							<CheckCircle
								size={16}
								className="text-emerald-600 mt-1 mr-2 flex-shrink-0"
							/>
							<span>A receipt has been sent to your email</span>
						</li>
						<li className="flex items-start">
							<CheckCircle
								size={16}
								className="text-emerald-600 mt-1 mr-2 flex-shrink-0"
							/>
							<span>
								100% of your donation goes directly to{" "}
								{donationDetails.cause?.name}
							</span>
						</li>
						<li className="flex items-start">
							<CheckCircle
								size={16}
								className="text-emerald-600 mt-1 mr-2 flex-shrink-0"
							/>
							<span>
								You'll receive updates about the impact of your donation
							</span>
						</li>
					</ul>
				</div>

				<div className="border-t border-gray-200 pt-6">
					<p className="text-gray-600 mb-6">
						Share your contribution and inspire others:
					</p>
					<div className="flex justify-center space-x-4">
						<button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
							<Facebook size={20} />
						</button>
						<button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
							<Twitter size={20} />
						</button>
						<button className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors">
							<Instagram size={20} />
						</button>
					</div>
				</div>
			</div>

			<button
				onClick={onDonateAgain}
				className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow hover:shadow-lg transform hover:-translate-y-1 duration-300 cursor-pointer"
			>
				Make Another Donation
			</button>
		</div>
	);
};

const FeaturedImpact = () => {
	return (
		<div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-16">
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
						<div className="text-4xl font-bold mb-2">$3.2M+</div>
						<p className="text-emerald-200">Donations collected</p>
					</div>

					<div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
						<div className="text-4xl font-bold mb-2">42K+</div>
						<p className="text-emerald-200">People helped</p>
					</div>

					<div className="text-center p-6 bg-white/10 backdrop-blur rounded-lg">
						<div className="text-4xl font-bold mb-2">96%</div>
						<p className="text-emerald-200">Funds reach the causes</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const Testimonials = () => {
	const testimonials = [
		{
			quote:
				"Making a donation was incredibly simple. I love how transparent GiveHope is about where my money goes.",
			author: "Sarah Johnson",
			role: "Monthly Donor",
		},
		{
			quote:
				"The impact reports help me see the real difference my contributions are making. I feel connected to the cause.",
			author: "Michael Chen",
			role: "Environmental Advocate",
		},
		{
			quote:
				"As a small business owner, I appreciate how easy GiveHope makes it to support causes my company cares about.",
			author: "Priya Patel",
			role: "Business Partner",
		},
	];

	return (
		<div className="py-16 bg-gray-50">
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
					What Our Donors Say
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<div key={index} className="bg-white p-6 rounded-xl shadow-md">
							<div className="mb-4 text-emerald-600">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9.59 4.59A2 2 0 1 1 11 8H8.41L7 12h3a2 2 0 1 1 0 4H6l2-8H5V4h4.59zM19 4h-4.59a2 2 0 1 0-1.41 3.41L14.59 8H17l-1.59 4H13v4h3a2 2 0 1 0 0-4h-.41L18 4z"
										fill="currentColor"
									/>
								</svg>
							</div>
							<p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
							<div>
								<p className="font-semibold text-gray-800">
									{testimonial.author}
								</p>
								<p className="text-sm text-gray-500">{testimonial.role}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const Partners = () => {
	const partners = [
		{
			id: 1,
			name: "Global Green Initiative",
			logo: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120&q=80",
		},
		{
			id: 2,
			name: "Education First Foundation",
			logo: "https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120&q=80",
		},
		{
			id: 3,
			name: "World Health Coalition",
			logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120&q=80",
		},
		{
			id: 4,
			name: "Food For All Alliance",
			logo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120&q=80",
		},
	];

	return (
		<div className="py-16 bg-white">
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
					Our Partners
				</h2>
				<p className="text-center text-gray-600 mb-12">
					Working together to make a difference
				</p>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{partners.map((partner) => (
						<div
							key={partner.id}
							className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<img
								src={partner.logo}
								alt={`${partner.name} logo`}
								className="h-12 object-contain mb-3"
							/>
							<p className="text-sm font-medium text-gray-700 text-center">
								{partner.name}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const DonationPlatform = () => {
	const [step, setStep] = useState<"cause" | "form" | "thanks">("cause");
	const [donationDetails, setDonationDetails] = useState<DonationDetails>({
		cause: null,
		amount: 0,
		name: "",
		email: "",
	});
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);

	const handleSelectCause = (cause: Cause) => {
		setDonationDetails({ ...donationDetails, cause });
		setStep("form");

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleDonationSubmit = (
		amount: number,
		name: string,
		email: string
	) => {
		setDonationDetails({ ...donationDetails, amount, name, email });
		setStep("thanks");
		showToast("Donation successful! Thank you for your support.", "success");

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleDonateAgain = () => {
		setStep("cause");
		setDonationDetails({
			cause: null,
			amount: 0,
			name: "",
			email: "",
		});

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 5000);
	};

	const renderStep = () => {
		switch (step) {
			case "cause":
				return (
					<>
						<CauseSelector onSelectCause={handleSelectCause} />
						<FeaturedImpact />
						<Testimonials />
						<Partners />
					</>
				);
			case "form":
				return (
					<DonationForm
						cause={donationDetails.cause!}
						onBack={() => setStep("cause")}
						onSubmit={handleDonationSubmit}
						showToast={showToast}
					/>
				);
			case "thanks":
				return (
					<ThankYouPage
						donationDetails={donationDetails}
						onDonateAgain={handleDonateAgain}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
			{}
			<header className="bg-white shadow-md sticky top-0 z-40">
				<div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Heart size={28} className="text-emerald-600 mr-2" />
							<h1 className="text-2xl font-bold text-gray-800">GiveHope</h1>
						</div>

						<button className="md:hidden text-gray-500">
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
					</div>

					<nav className="hidden md:flex items-center space-x-1">
						<a
							href="#causes"
							className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
						>
							Causes
						</a>
						<a
							href="#about"
							className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
						>
							About Us
						</a>
						<a
							href="#impact"
							className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
						>
							Our Impact
						</a>
						<button
							onClick={() => showToast("Contact form coming soon!", "info")}
							className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow hover:shadow-md ml-2 cursor-pointer"
						>
							Contact
						</button>
					</nav>
				</div>
			</header>

			{}
			<main>{renderStep()}</main>

			{}
			<footer className="bg-gray-800 text-white py-12">
				<div className="max-w-6xl mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<Heart size={24} className="text-emerald-400 mr-2" />
								<h2 className="text-2xl font-bold">GiveHope</h2>
							</div>
							<p className="text-gray-400 mb-4">
								Making a difference, one donation at a time.
							</p>
							<div className="flex space-x-4">
								<button
									onClick={() => showToast("Social media coming soon!", "info")}
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="Facebook"
								>
									<Facebook size={20} />
								</button>
								<button
									onClick={() => showToast("Social media coming soon!", "info")}
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="Twitter"
								>
									<Twitter size={20} />
								</button>
								<button
									onClick={() => showToast("Social media coming soon!", "info")}
									className="text-gray-400 hover:text-white transition-colors"
									aria-label="Instagram"
								>
									<Instagram size={20} />
								</button>
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#how"
										className="text-gray-400 hover:text-white transition-colors"
									>
										How It Works
									</a>
								</li>
								<li>
									<a
										href="#stories"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Success Stories
									</a>
								</li>
								<li>
									<a
										href="#partners"
										className="text-gray-400 hover:text-white transition-colors"
									>
										Our Partners
									</a>
								</li>
								<li>
									<a
										href="#faq"
										className="text-gray-400 hover:text-white transition-colors"
									>
										FAQs
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4">Newsletter</h3>
							<p className="text-gray-400 mb-4">
								Stay updated with our latest causes and success stories.
							</p>
							<div className="flex">
								<input
									type="email"
									placeholder="Your email address"
									className="bg-gray-700 text-white rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
								/>
								<button
									onClick={() =>
										showToast("Newsletter subscription coming soon!", "info")
									}
									className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-r-lg transition-colors cursor-pointer"
								>
									Subscribe
								</button>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2025 GiveHope. All rights reserved.</p>
						<div className="mt-2 flex justify-center space-x-4 text-sm">
							<a href="#privacy" className="hover:text-white transition-colors">
								Privacy Policy
							</a>
							<a href="#terms" className="hover:text-white transition-colors">
								Terms of Service
							</a>
							<a
								href="#accessibility"
								className="hover:text-white transition-colors"
							>
								Accessibility
							</a>
						</div>
					</div>
				</div>
			</footer>

			{}
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
};

export default DonationPlatform;
