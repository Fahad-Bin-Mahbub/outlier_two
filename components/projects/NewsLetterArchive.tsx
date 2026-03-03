"use client";
import React, {
	useState,
	useRef,
	useEffect,
	WheelEvent,
	useCallback,
	TouchEvent,
} from "react";
interface Newsletter {
	id: number;
	date: string;
	title: string;
	summary: string;
	link: string;
	isMilestone?: boolean;
}

const seededRandom = (seed: number) => {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
};

const generateNewsletters = (): Newsletter[] => {
	const START_YEAR = 1990;
	const currentYear = new Date().getFullYear();
	const years: number[] = [];
	for (let y = START_YEAR; y <= currentYear; y++) {
		years.push(y);
	}

	const newsletters: Newsletter[] = [];
	let id = 1;
	let seedCounter = 42;

	years.forEach((year) => {
		const newslettersPerYear = 5 + Math.floor(seededRandom(seedCounter++) * 15);

		for (let i = 0; i < newslettersPerYear; i++) {
			const month = Math.floor(seededRandom(seedCounter++) * 12);
			const day = Math.floor(seededRandom(seedCounter++) * 28) + 1;
			const dateString = `${year}-${String(month + 1).padStart(
				2,
				"0"
			)}-${String(day).padStart(2, "0")}`;

			let isMilestone = false;
			let milestoneTitlePrefix = "";
			let milestoneSummarySuffix = "";

			if (id === 1) {
				isMilestone = true;
				milestoneTitlePrefix = "Founder's Edition: ";
				milestoneSummarySuffix =
					" This inaugural issue sets the stage for our journey ahead.";
			} else if (year === 2000 && i === 0) {
				isMilestone = true;
				milestoneTitlePrefix = "Y2K Special: ";
				milestoneSummarySuffix =
					" Entering the new millennium with insights and forecasts.";
			} else if (year === 2010 && i === 0) {
				isMilestone = true;
				milestoneTitlePrefix = "Decade Forward: ";
				milestoneSummarySuffix =
					" Reflecting on the past decade and looking towards new horizons.";
			} else if (year === 2020 && i === 0) {
				isMilestone = true;
				milestoneTitlePrefix = "New Era Insights: ";
				milestoneSummarySuffix =
					" Navigating the complexities of a new decade with critical analysis.";
			} else if (id > 1 && id % 25 === 0) {
				isMilestone = true;
				milestoneTitlePrefix = `Landmark Issue (${id}): `;
				milestoneSummarySuffix = ` Celebrating our ${id}th publication with special content.`;
			} else if (
				(year === 1995 ||
					year === 2005 ||
					year === 2015 ||
					year === currentYear - 1) &&
				i === newslettersPerYear - 1
			) {
				isMilestone = true;
				milestoneTitlePrefix = `Annual Review ${year}: `;
				milestoneSummarySuffix = ` A comprehensive look back at the significant events and trends of ${year}.`;
			}

			newsletters.push({
				id: id,
				date: dateString,
				title: `${milestoneTitlePrefix}Crimson Chronicle: Vol. ${year}-${String(
					i + 1
				).padStart(2, "0")}`,
				summary: `Exploring digital frontiers from ${String(day).padStart(
					2,
					"0"
				)}/${String(month + 1).padStart(
					2,
					"0"
				)}/${year} in Crimson Chronicle. This issue delves into cybernetic advancements, virtual realities, and AI narratives. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.${milestoneSummarySuffix}`,
				link: "#",
				isMilestone: isMilestone,
			});
			id++;
		}
	});

	return newsletters.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);
};

const newsletterData = generateNewsletters();

const groupNewsletters = (
	newsletters: Newsletter[],
	zoomLevel: number
): { [key: string]: Newsletter[] } => {
	const grouped: { [key: string]: Newsletter[] } = {};

	newsletters.forEach((newsletter) => {
		const date = new Date(newsletter.date);
		let key;

		if (zoomLevel < 0.8) {
			key = date.getUTCFullYear().toString();
		} else if (zoomLevel < 1.2) {
			key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
		} else {
			key = newsletter.date;
		}

		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(newsletter);
	});

	return grouped;
};

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		className={className}
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			d="M10.868 2.884c.321-.662 1.28-.662 1.6 0l1.983 4.093a1 1 0 00.753.548l4.524.658c.706.103.987.97.478 1.454l-3.274 3.19a1 1 0 00-.288.885l.773 4.507c.121.703-.617 1.252-1.246.92l-4.045-2.127a1 1 0 00-.932 0l-4.045 2.127c-.63.332-1.367-.217-1.246-.92l.773-4.507a1 1 0 00-.288-.885l-3.274-3.19c-.509-.484-.228-1.35.478-1.454l4.524-.658a1 1 0 00.753-.548l1.983-4.093z"
			clipRule="evenodd"
		/>
	</svg>
);

const NewsletterArchive: React.FC = () => {
	const [zoom, setZoom] = useState(0.7);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [modalOpenForId, setModalOpenForId] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [viewportWidth, setViewportWidth] = useState(0);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
	const [subscribedEmail, setSubscribedEmail] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const [touchStartX, setTouchStartX] = useState(0);
	const [touchStartY, setTouchStartY] = useState(0);
	const dragLockRef = useRef<"horizontal" | "vertical" | null>(null);

	const velocityRef = useRef(0);
	const animationFrameRef = useRef<number | null>(null);

	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
	const scrollTargetRef = useRef<{
		key: string;
		behavior: "smooth" | "auto";
	} | null>(null);

	const prevSelectedIdRef = useRef<number | null>(selectedId);
	const prevIsDraggingRef = useRef<boolean>(isDragging);

	const groupedNewsletters = groupNewsletters(newsletterData, zoom);
	const groupKeys = Object.keys(groupedNewsletters).sort((a, b) => {
		if (zoom < 0.8) return parseInt(a) - parseInt(b);
		if (zoom < 1.2) {
			const [yearA, monthA] = a.split("-").map(Number);
			const [yearB, monthB] = b.split("-").map(Number);
			if (yearA !== yearB) return yearA - yearB;
			return monthA - monthB;
		}
		const dateA = new Date(a);
		const dateB = new Date(b);
		return (
			new Date(
				dateA.getUTCFullYear(),
				dateA.getUTCMonth(),
				dateA.getUTCDate()
			).getTime() -
			new Date(
				dateB.getUTCFullYear(),
				dateB.getUTCMonth(),
				dateB.getUTCDate()
			).getTime()
		);
	});

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		const updateViewportWidth = () => {
			if (timelineContainerRef.current) {
				setViewportWidth(timelineContainerRef.current.offsetWidth);
			} else if (!isMobile) {
				setViewportWidth(window.innerWidth * 0.8);
			}
		};

		checkIfMobile();
		updateViewportWidth();

		window.addEventListener("resize", checkIfMobile);
		window.addEventListener("resize", updateViewportWidth);

		return () => {
			window.removeEventListener("resize", checkIfMobile);
			window.removeEventListener("resize", updateViewportWidth);
		};
	}, [isMobile]);

	useEffect(() => {
		if (timelineContainerRef.current && !isMobile) {
			setViewportWidth(timelineContainerRef.current.offsetWidth);
		}
	}, [timelineContainerRef, isMobile]);

	useEffect(() => {
		if (newsletterData.length > 0 && selectedId === null) {
			const mostRecentNewsletter = newsletterData[newsletterData.length - 1];
			if (mostRecentNewsletter) {
				setSelectedId(mostRecentNewsletter.id);
			}
		}
	}, [selectedId]);

	useEffect(() => {
		const wasDragging = prevIsDraggingRef.current;
		const previousSelectedIdValue = prevSelectedIdRef.current;

		if (isDragging) {
			prevSelectedIdRef.current = selectedId;
			prevIsDraggingRef.current = isDragging;
			return;
		}

		if (wasDragging && !isDragging && selectedId === previousSelectedIdValue) {
			prevSelectedIdRef.current = selectedId;
			prevIsDraggingRef.current = isDragging;
			return;
		}

		if (!selectedId || newsletterData.length === 0) {
			prevSelectedIdRef.current = selectedId;
			prevIsDraggingRef.current = isDragging;
			return;
		}

		const selectedNewsletter = newsletterData.find((n) => n.id === selectedId);
		if (!selectedNewsletter) {
			prevSelectedIdRef.current = selectedId;
			prevIsDraggingRef.current = isDragging;
			return;
		}

		const date = new Date(selectedNewsletter.date);
		let currentKey;
		if (zoom < 0.8) currentKey = date.getUTCFullYear().toString();
		else if (zoom < 1.2)
			currentKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
		else currentKey = selectedNewsletter.date;

		const itemElement = itemRefs.current.get(currentKey);
		if (!itemElement) {
			prevSelectedIdRef.current = selectedId;
			prevIsDraggingRef.current = isDragging;
			return;
		}

		let behavior: "smooth" | "auto" = "auto";
		if (scrollTargetRef.current && scrollTargetRef.current.key === currentKey) {
			behavior = scrollTargetRef.current.behavior;
			scrollTargetRef.current = null;
		}

		if (timelineContainerRef.current && !isMobile) {
			const currentItemWidth =
				parseFloat(itemElement.style.width) || Math.max(80, zoom * 130);
			const itemWidthForCalc = Math.max(80, zoom * 130);
			const spacer = Math.max(0, (viewportWidth - itemWidthForCalc) / 2);
			const scrollTo =
				(itemElement.offsetLeft || 0) +
				spacer -
				viewportWidth / 2 +
				currentItemWidth / 2;

			timelineContainerRef.current.scrollTo({
				left: isNaN(scrollTo) ? 0 : scrollTo,
				behavior,
			});
		} else if (isMobile && itemElement) {
			itemElement.scrollIntoView({
				behavior,
				block: "center",
				inline: "center",
			});
		}

		prevSelectedIdRef.current = selectedId;
		prevIsDraggingRef.current = isDragging;
	}, [selectedId, zoom, isMobile, groupKeys, isDragging, viewportWidth]);

	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				if (modalOpenForId !== null) setModalOpenForId(null);
				if (isSubscriptionModalOpen) setIsSubscriptionModalOpen(false);
			}
		};

		if (modalOpenForId !== null || isSubscriptionModalOpen) {
			document.body.style.overflow = "hidden";
			document.addEventListener("keydown", handleEscKey);
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [modalOpenForId, isSubscriptionModalOpen]);

	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2500);

		return () => clearTimeout(timer);
	}, []);

	const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
		if (
			isMobile ||
			isDragging ||
			modalOpenForId !== null ||
			isSubscriptionModalOpen
		) {
			return;
		}

		const isOverDesktopTimeline =
			timelineContainerRef.current &&
			timelineContainerRef.current.contains(e.target as Node);

		if (isOverDesktopTimeline && timelineContainerRef.current) {
			e.preventDefault();
			e.stopPropagation();

			if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
				const direction = e.deltaY > 0 ? "out" : "in";
				handleZoom(direction);
			} else if (Math.abs(e.deltaX) > 0) {
				timelineContainerRef.current.scrollLeft += e.deltaX;
			}
		}
	};

	const handleZoom = (direction: "in" | "out") => {
		setZoom((prevZoom) => {
			let newZoom = direction === "in" ? prevZoom * 1.25 : prevZoom / 1.25;
			newZoom = Math.max(0.4, Math.min(2.8, newZoom));
			return newZoom;
		});
	};

	const handleDecadeJump = useCallback(
		(decade: number) => {
			const firstItemInDecadeOrLater = newsletterData.find(
				(item) => new Date(item.date).getUTCFullYear() >= decade
			);
			let targetItem = firstItemInDecadeOrLater;

			if (firstItemInDecadeOrLater) {
				const yearOfFirstItem = new Date(
					firstItemInDecadeOrLater.date
				).getUTCFullYear();
				if (yearOfFirstItem >= decade + 10) {
					const itemsInDecade = newsletterData.filter((item) => {
						const year = new Date(item.date).getUTCFullYear();
						return year >= decade && year < decade + 10;
					});
					if (itemsInDecade.length > 0) {
						targetItem = itemsInDecade.sort(
							(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
						)[0];
					}
				}
			} else {
				if (newsletterData.length > 0) {
					targetItem = newsletterData[newsletterData.length - 1];
				}
			}

			if (targetItem) {
				const targetDate = new Date(targetItem.date);
				let itemKey;
				const tempZoom = zoom;
				if (tempZoom < 0.8) itemKey = targetDate.getUTCFullYear().toString();
				else if (tempZoom < 1.2)
					itemKey = `${targetDate.getUTCFullYear()}-${targetDate.getUTCMonth()}`;
				else itemKey = targetItem.date;

				scrollTargetRef.current = { key: itemKey, behavior: "smooth" };
				setSelectedId(targetItem.id);
			}
		},
		[zoom]
	);

	const startMomentumScroll = useCallback(() => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		const momentumLoop = () => {
			if (!timelineContainerRef.current) return;

			if (Math.abs(velocityRef.current) < 0.5) {
				velocityRef.current = 0;
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
					animationFrameRef.current = null;
				}
				return;
			}

			timelineContainerRef.current.scrollLeft += velocityRef.current;
			velocityRef.current *= 0.95;

			animationFrameRef.current = requestAnimationFrame(momentumLoop);
		};

		if (Math.abs(velocityRef.current) > 0.5) {
			animationFrameRef.current = requestAnimationFrame(momentumLoop);
		}
	}, []);

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (
			!timelineContainerRef.current ||
			isMobile ||
			modalOpenForId !== null ||
			isSubscriptionModalOpen
		)
			return;
		if (e.button !== 0) return;

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		velocityRef.current = 0;

		setIsDragging(true);
		setStartX(
			e.clientX - timelineContainerRef.current.getBoundingClientRect().left
		);
		setScrollLeft(timelineContainerRef.current.scrollLeft);
		if (timelineContainerRef.current)
			timelineContainerRef.current.style.cursor = "grabbing";
		document.body.style.cursor = "grabbing";
		document.body.style.userSelect = "none";
	};

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (
			!isDragging ||
			!timelineContainerRef.current ||
			isMobile ||
			modalOpenForId !== null ||
			isSubscriptionModalOpen
		)
			return;
		e.preventDefault();
		const x =
			e.clientX - timelineContainerRef.current.getBoundingClientRect().left;
		const walk = (x - startX) * 1.8;

		const newScrollLeft = scrollLeft - walk;
		velocityRef.current =
			newScrollLeft - timelineContainerRef.current.scrollLeft;

		timelineContainerRef.current.scrollLeft = newScrollLeft;
	};

	const onMouseUpOrLeave = useCallback(() => {
		if (!isDragging) return;
		setIsDragging(false);
		if (timelineContainerRef.current)
			timelineContainerRef.current.style.cursor = "grab";
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
		startMomentumScroll();
	}, [isDragging, startMomentumScroll]);

	const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
		if (!timelineContainerRef.current) return;

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		velocityRef.current = 0;

		const touch = e.touches[0];
		setTouchStartX(touch.clientX);
		setTouchStartY(touch.clientY);
		setIsDragging(true);
		setScrollLeft(timelineContainerRef.current.scrollLeft);
		dragLockRef.current = null;
	};

	const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		if (!isDragging || !timelineContainerRef.current) return;
		const touch = e.touches[0];
		const deltaX = touch.clientX - touchStartX;
		const deltaY = touch.clientY - touchStartY;

		if (
			dragLockRef.current === null &&
			(Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)
		) {
			dragLockRef.current =
				Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
		}

		if (dragLockRef.current === "horizontal") {
			const walk = (touch.clientX - touchStartX) * 1.8;
			const newScrollLeft = scrollLeft - walk;
			velocityRef.current =
				newScrollLeft - timelineContainerRef.current.scrollLeft;

			timelineContainerRef.current.scrollLeft = newScrollLeft;
		}
	};

	const onTouchEnd = useCallback(() => {
		if (!isDragging) return;

		if (dragLockRef.current === "horizontal") {
			startMomentumScroll();
		}

		setIsDragging(false);
		dragLockRef.current = null;
	}, [isDragging, startMomentumScroll]);

	const decades = Array.from(
		new Set(
			newsletterData.map(
				(item) => Math.floor(new Date(item.date).getUTCFullYear() / 10) * 10
			)
		)
	).sort((a, b) => a - b);

	const getGroupTitle = (key: string): string => {
		if (zoom < 0.8) return key;
		else if (zoom < 1.2) {
			const [year, monthIndex] = key.split("-");
			const monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			return `${monthNames[parseInt(monthIndex)]} ${year}`;
		} else {
			const date = new Date(key);
			const utcDate = new Date(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate()
			);
			return utcDate.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
				timeZone: "UTC",
			});
		}
	};

	const getYearColor = (year: number): string => {
		const colors = [
			"bg-blue-700",
			"bg-blue-800",
			"bg-blue-600",
			"bg-teal-700",
			"bg-teal-800",
			"bg-teal-600",
			"bg-cyan-700",
			"bg-cyan-800",
			"bg-cyan-600",
		];
		return colors[Math.abs(year) % colors.length];
	};

	const isDecadeActive = (decade: number): boolean => {
		if (!selectedId) return false;
		const selectedNewsletter = newsletterData.find((n) => n.id === selectedId);
		if (!selectedNewsletter) return false;
		const year = new Date(selectedNewsletter.date).getUTCFullYear();
		return year >= decade && year < decade + 10;
	};

	const currentZoomLabel =
		zoom < 0.8
			? "Decades / Years"
			: zoom < 1.2
			? "Years / Months"
			: "Months / Days";

	let newsInSelectedGroup: Newsletter[] = [];
	let selectedGroupTitle = "";
	let selectedGroupKey: string | null = null;

	if (selectedId) {
		const currentNewsletter = newsletterData.find((n) => n.id === selectedId);
		if (currentNewsletter) {
			const date = new Date(currentNewsletter.date);
			let groupKey;
			if (zoom < 0.8) groupKey = date.getUTCFullYear().toString();
			else if (zoom < 1.2)
				groupKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
			else groupKey = currentNewsletter.date;

			selectedGroupKey = groupKey;
			if (groupedNewsletters[groupKey]) {
				newsInSelectedGroup = groupedNewsletters[groupKey].sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
				);
				selectedGroupTitle = getGroupTitle(groupKey);
			}
		}
	}

	const handleItemClick = (itemId: number) => {
		const targetItem = newsletterData.find((n) => n.id === itemId);
		if (!targetItem) return;

		const targetDate = new Date(targetItem.date);
		let itemKey;
		if (zoom < 0.8) itemKey = targetDate.getUTCFullYear().toString();
		else if (zoom < 1.2)
			itemKey = `${targetDate.getUTCFullYear()}-${targetDate.getUTCMonth()}`;
		else itemKey = targetItem.date;

		scrollTargetRef.current = { key: itemKey, behavior: "smooth" };
		setSelectedId(itemId);
	};

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		setEmailError("");

		if (!email.trim()) {
			setEmailError("Please enter an email address.");
			return;
		}

		if (
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
		) {
			setEmailError(
				"Please enter a valid email address (e.g., user@example.com)."
			);
			return;
		}

		console.log("Subscribing with email:", email);
		setSubscribedEmail(email);
		setIsSubscriptionModalOpen(true);
		setEmail("");
	};

	const handleExportPdf = () => {
		window.print();
	};

	const currentItemWidthForTrack = Math.max(80, zoom * 130);
	const itemsTotalWidthForTrack = groupKeys.length * currentItemWidthForTrack;
	const spacerWidthForTrack = Math.max(
		0,
		(viewportWidth - currentItemWidthForTrack) / 2
	);
	const scrollTrackWidth = itemsTotalWidthForTrack + spacerWidthForTrack * 2;

	if (isLoading) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
				{}
				<div className="absolute inset-0">
					{}
					<div className="absolute top-10 left-10 w-96 h-96 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl rotate-12 animate-pulse glass-panel-1"></div>
					<div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/15 backdrop-blur-2xl rounded-3xl border border-blue-300/30 shadow-xl -rotate-12 animate-pulse glass-panel-2"></div>
					<div className="absolute top-1/2 left-20 w-64 h-64 bg-teal-400/15 backdrop-blur-xl rounded-full border border-teal-300/25 shadow-lg rotate-45 animate-pulse glass-panel-3"></div>

					{}
					<div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20">
						<svg
							viewBox="0 0 500 500"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							className="animate-pulse"
						>
							<defs>
								<linearGradient
									id="loadingBlob1"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="100%"
								>
									<stop
										offset="0%"
										style={{ stopColor: "rgba(56, 189, 248, 0.6)" }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: "rgba(20, 184, 166, 0.6)" }}
									/>
								</linearGradient>
							</defs>
							<path
								fill="url(#loadingBlob1)"
								d="M426.6,288.9Q399.4,327.8,377.9,368.1Q356.3,408.3,309.1,411.3Q261.9,414.3,227.1,399.7Q192.3,385.1,155.1,371.3Q117.9,357.5,99.4,319.4Q80.8,281.2,60.8,243.6Q40.8,206,71.5,179.3Q102.3,152.6,125.9,127.3Q149.6,102,192.3,92.5Q235.1,83,270.8,81.4Q306.5,79.7,344.9,98.6Q383.3,117.5,410.5,152.6Q437.7,187.7,445.2,234.3Q452.7,280.9,426.6,288.9Z"
								className="animate-spin"
								style={{ transformOrigin: "center", animationDuration: "20s" }}
							/>
						</svg>
					</div>

					<div className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-15">
						<svg
							viewBox="0 0 350 350"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							className="animate-bounce"
						>
							<defs>
								<linearGradient
									id="loadingBlob2"
									x1="100%"
									y1="100%"
									x2="0%"
									y2="0%"
								>
									<stop
										offset="0%"
										style={{ stopColor: "rgba(14, 116, 144, 0.4)" }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: "rgba(8, 145, 178, 0.4)" }}
									/>
								</linearGradient>
							</defs>
							<path
								fill="url(#loadingBlob2)"
								d="M315.8,303.3Q299.4,356.7,249.7,364.9Q200.1,373.1,162.9,342.3Q125.7,311.6,110.8,265.5Q95.9,219.4,115.3,178.6Q134.6,137.8,179.3,127.1Q224.1,116.3,264.4,124.6Q304.7,132.8,323.7,173.6Q342.7,214.4,332.2,258.9Q321.7,303.3,315.8,303.3Z"
								className="animate-pulse"
								style={{ animationDuration: "3s" }}
							/>
						</svg>
					</div>

					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10">
						<svg
							viewBox="0 0 400 400"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
						>
							<defs>
								<linearGradient
									id="loadingBlob3"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="100%"
								>
									<stop
										offset="0%"
										style={{ stopColor: "rgba(103, 232, 249, 0.5)" }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: "rgba(45, 212, 191, 0.5)" }}
									/>
								</linearGradient>
							</defs>
							<path
								fill="url(#loadingBlob3)"
								d="M380,200Q380,250,350,280Q320,310,285,320Q250,330,215,320Q180,310,150,280Q120,250,120,200Q120,150,150,120Q180,90,215,80Q250,70,285,80Q320,90,350,120Q380,150,380,200Z"
								className="animate-spin"
								style={{
									transformOrigin: "center",
									animationDuration: "15s",
									animationDirection: "reverse",
								}}
							/>
						</svg>
					</div>
				</div>

				{}
				<div className="relative z-20 glass-morphism-main p-8 sm:p-12 rounded-3xl border border-white/30 shadow-2xl backdrop-blur-2xl bg-white/20 max-w-2xl mx-4">
					{}
					<div className="glass-morphism-header p-6 rounded-2xl border border-white/25 shadow-xl backdrop-blur-xl bg-gradient-to-r from-white/10 to-blue-500/15 mb-8">
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-snug bg-gradient-to-br from-white via-blue-200 to-cyan-300 text-transparent bg-clip-text animate-pulse text-center">
							TimeNews
						</h1>
					</div>

					{}
					<div className="glass-morphism-content p-6 rounded-2xl border border-white/20 shadow-lg backdrop-blur-lg bg-white/10 text-center">
						{}
						<div className="flex items-center justify-center space-x-3 mb-6">
							<div
								className="w-4 h-4 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full animate-bounce glass-dot shadow-lg"
								style={{ animationDelay: "0ms" }}
							></div>
							<div
								className="w-4 h-4 bg-gradient-to-r from-cyan-300 to-teal-300 rounded-full animate-bounce glass-dot shadow-lg"
								style={{ animationDelay: "150ms" }}
							></div>
							<div
								className="w-4 h-4 bg-gradient-to-r from-teal-300 to-blue-300 rounded-full animate-bounce glass-dot shadow-lg"
								style={{ animationDelay: "300ms" }}
							></div>
						</div>

						{}
						<p className="text-lg sm:text-xl text-white font-medium mb-6">
							Loading your timeline experience...
						</p>

						{}
						<div className="glass-morphism-progress p-4 rounded-xl border border-white/20 backdrop-blur-md bg-white/10 shadow-inner">
							<div className="w-full h-2 bg-black/30 rounded-full overflow-hidden shadow-inner">
								<div className="h-full bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 rounded-full shadow-sm loading-progress"></div>
							</div>
						</div>
					</div>

					{}
					<div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 shadow-lg animate-pulse"></div>
					<div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-300/15 backdrop-blur-lg rounded-full border border-cyan-300/30 shadow-lg animate-pulse"></div>
					<div className="absolute top-1/2 -right-2 w-4 h-4 bg-teal-300/15 backdrop-blur-lg rounded-full border border-teal-300/30 shadow-lg animate-pulse"></div>
				</div>

				{}
				<div className="absolute inset-0 overflow-hidden z-10">
					{[...Array(16)].map((_, i) => (
						<div
							key={i}
							className="absolute bg-white/30 backdrop-blur-sm rounded-full border border-white/40 shadow-lg animate-float glass-particle"
							style={{
								width: `${8 + (i % 4) * 2}px`,
								height: `${8 + (i % 4) * 2}px`,
								left: `${Math.sin(i * 42) * 45 + 50}%`,
								top: `${Math.cos(i * 42) * 45 + 50}%`,
								animationDelay: `${i * 0.3}s`,
								animationDuration: `${4 + (i % 4)}s`,
							}}
						></div>
					))}
				</div>

				{}
				<div className="absolute inset-0 z-30 pointer-events-none">
					<div
						className="absolute top-1/4 left-1/3 w-32 h-1 bg-white/30 rounded-full blur-sm animate-pulse"
						style={{ animationDelay: "1s" }}
					></div>
					<div
						className="absolute bottom-1/3 right-1/4 w-24 h-1 bg-cyan-300/30 rounded-full blur-sm animate-pulse"
						style={{ animationDelay: "2s" }}
					></div>
				</div>
			</div>
		);
	}

	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
      
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg) scale(1); 
          opacity: 0.4;
        }
        50% { 
          transform: translateY(-25px) rotate(180deg) scale(1.1); 
          opacity: 0.8;
        }
      }
      
      @keyframes loading-progress {
        0% { 
          width: 0%; 
          transform: scaleX(0);
        }
        100% { 
          width: 100%; 
          transform: scaleX(1);
        }
      }
      
      @keyframes glassShimmer {
        0%, 100% { 
          transform: translateX(-100%);
          opacity: 0;
        }
        50% { 
          transform: translateX(100%);
          opacity: 1;
        }
      }
      
      @keyframes glassPulse {
        0%, 100% { 
          transform: scale(1);
          opacity: 0.5;
        }
        50% { 
          transform: scale(1.05);
          opacity: 0.8;
        }
      }
      
      @keyframes glassFloat {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
        }
        50% { 
          transform: translateY(-10px) rotate(5deg);
          box-shadow: 0 20px 40px rgba(255, 255, 255, 0.3);
        }
      }
      
      .animate-float {
        animation: float ease-in-out infinite;
      }
      
      .loading-progress {
        animation: loading-progress 2.5s ease-out forwards;
        transform-origin: left;
      }
      
      
      .glass-morphism-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(255, 255, 255, 0.2);
        animation: glassFloat 6s ease-in-out infinite;
      }
      
      .glass-morphism-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(56, 189, 248, 0.15));
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        box-shadow: 
          0 4px 16px rgba(56, 189, 248, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
        position: relative;
        overflow: hidden;
      }
      
      .glass-morphism-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: glassShimmer 3s ease-in-out infinite;
      }
      
      .glass-morphism-content {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 
          0 2px 16px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
      }
      
      .glass-morphism-progress {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 
          inset 0 2px 8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
      }
      
      .glass-dot {
        box-shadow: 
          0 2px 8px rgba(56, 189, 248, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      
      .glass-particle {
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        box-shadow: 
          0 2px 8px rgba(255, 255, 255, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
      }
      
      .glass-panel-1 {
        animation: glassPulse 4s ease-in-out infinite;
        box-shadow: 
          0 16px 64px rgba(255, 255, 255, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }
      
      .glass-panel-2 {
        animation: glassPulse 5s ease-in-out infinite reverse;
        box-shadow: 
          0 12px 48px rgba(56, 189, 248, 0.2),
          inset 0 1px 0 rgba(56, 189, 248, 0.4);
      }
      
      .glass-panel-3 {
        animation: glassPulse 6s ease-in-out infinite;
        box-shadow: 
          0 8px 32px rgba(45, 212, 191, 0.25),
          inset 0 1px 0 rgba(45, 212, 191, 0.4);
      }
      
      
      .liquid-svg-animation {
        animation: morphBlob 8s ease-in-out infinite;
      }
      
      .liquid-svg-animation-alt {
        animation: morphBlobAlt 12s ease-in-out infinite;
      }
      
      @keyframes morphBlob {
        0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        25% { transform: translate(-50%, -50%) scale(1.1) rotate(90deg); }
        50% { transform: translate(-50%, -50%) scale(0.9) rotate(180deg); }
        75% { transform: translate(-50%, -50%) scale(1.05) rotate(270deg); }
      }
      
      @keyframes morphBlobAlt {
        0%, 100% { transform: translate(-55%, -55%) scale(0.95) rotate(0deg); }
        33% { transform: translate(-45%, -65%) scale(1.1) rotate(120deg); }
        66% { transform: translate(-65%, -45%) scale(0.85) rotate(240deg); }
      }

      
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.7), rgba(14, 165, 233, 0.7));
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(14, 165, 233, 0.9));
      }
      
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: rgba(0, 0, 0, 0.2);
      }
      
      
      .timeline-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      .timeline-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.25);
        border-radius: 3px;
      }
      
      .timeline-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(14, 165, 233, 0.6);
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .timeline-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(14, 165, 233, 0.8);
      }
      
      
      .modal-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .modal-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      
      .modal-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.7), rgba(14, 165, 233, 0.7));
        border-radius: 3px;
      }
      
      .modal-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(14, 165, 233, 0.9));
      }
      
      
      .decades-scrollbar::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      
      .decades-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
      }
      
      .decades-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
      }
      
      .decades-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.4);
      }
      
      
      body::-webkit-scrollbar {
        width: 10px;
      }
      
      body::-webkit-scrollbar-track {
        background: linear-gradient(180deg, rgba(30, 58, 138, 0.4), rgba(37, 99, 235, 0.4));
      }
      
      body::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.8), rgba(14, 165, 233, 0.8));
        border-radius: 5px;
        border: 2px solid rgba(255, 255, 255, 0.15);
      }
      
      body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgba(56, 189, 248, 1), rgba(14, 165, 233, 1));
      }
      
      
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(56, 189, 248, 0.7) rgba(0, 0, 0, 0.2);
      }
      
      .timeline-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(14, 165, 233, 0.6) rgba(0, 0, 0, 0.25);
      }
      
      .modal-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(56, 189, 248, 0.7) rgba(255, 255, 255, 0.1);
      }
      
      .decades-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.2);
      }
      
      html {
        scrollbar-width: thin;
        scrollbar-color: rgba(56, 189, 248, 0.8) rgba(30, 58, 138, 0.4);
      }
      `,
				}}
			/>
			<div
				className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col selection:bg-blue-700 selection:text-white relative overflow-hidden print:bg-white print:text-black custom-scrollbar"
				onMouseUp={onMouseUpOrLeave}
				onMouseMove={onMouseMove}
			>
				<div
					aria-hidden="true"
					className="hidden md:block fixed top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-96 h-96 xl:w-[32rem] xl:h-[32rem] z-0 background-liquid-svg print:hidden"
				>
					<svg
						viewBox="0 0 500 500"
						xmlns="http://www.w3.org/2000/svg"
						width="100%"
					>
						<defs>
							<linearGradient
								id="bgBlobGradientTopLeft"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop
									offset="0%"
									style={{ stopColor: "rgba(56, 189, 248, 0.6)" }}
								/>
								<stop
									offset="100%"
									style={{ stopColor: "rgba(6, 182, 212, 0.6)" }}
								/>
							</linearGradient>
						</defs>
						<path
							fill="url(#bgBlobGradientTopLeft)"
							d="M426.6,288.9Q399.4,327.8,377.9,368.1Q356.3,408.3,309.1,411.3Q261.9,414.3,227.1,399.7Q192.3,385.1,155.1,371.3Q117.9,357.5,99.4,319.4Q80.8,281.2,60.8,243.6Q40.8,206,71.5,179.3Q102.3,152.6,125.9,127.3Q149.6,102,192.3,92.5Q235.1,83,270.8,81.4Q306.5,79.7,344.9,98.6Q383.3,117.5,410.5,152.6Q437.7,187.7,445.2,234.3Q452.7,280.9,426.6,288.9Z"
							transform="scale(0.8) rotate(15)"
						/>
					</svg>
				</div>
				<div
					aria-hidden="true"
					className="hidden md:block fixed bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[28rem] h-[28rem] xl:w-[36rem] xl:h-[36rem] z-0 background-liquid-svg print:hidden"
					style={{ animationDelay: "-15s", animationDuration: "45s" }}
				>
					<svg
						viewBox="0 0 500 500"
						xmlns="http://www.w3.org/2000/svg"
						width="100%"
					>
						<defs>
							<linearGradient
								id="bgBlobGradientBottomRight"
								x1="100%"
								y1="100%"
								x2="0%"
								y2="0%"
							>
								<stop
									offset="0%"
									style={{ stopColor: "rgba(3, 105, 161, 0.6)" }}
								/>
								<stop
									offset="100%"
									style={{ stopColor: "rgba(14, 116, 144, 0.6)" }}
								/>
							</linearGradient>
						</defs>
						<path
							fill="url(#bgBlobGradientBottomRight)"
							d="M315.8,303.3Q299.4,356.7,249.7,364.9Q200.1,373.1,162.9,342.3Q125.7,311.6,110.8,265.5Q95.9,219.4,115.3,178.6Q134.6,137.8,179.3,127.1Q224.1,116.3,264.4,124.6Q304.7,132.8,323.7,173.6Q342.7,214.4,332.2,258.9Q321.7,303.3,315.8,303.3Z"
							transform="scale(0.75) rotate(-25)"
						/>
					</svg>
				</div>

				<div id="export-container" className="flex flex-col flex-grow">
					<header className="bg-blue-950/70 backdrop-blur-xl border-b border-white/20 shadow-lg fixed top-0 left-0 right-0 z-40 print:static print:bg-white print:shadow-none print:border-b-2 print:border-gray-200">
						<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
							<div className="text-xl sm:text-2xl font-bold text-white tracking-tight print:text-black">
								Time<span className="text-sky-400 print:text-black">News</span>
							</div>
							<button
								id="export-pdf-button"
								onClick={handleExportPdf}
								className="p-2 sm:px-4 sm:py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs sm:text-sm font-semibold border border-sky-600/70 transition-all duration-200 ease-in-out flex items-center gap-2 print:hidden cursor-pointer"
								aria-label="Export page as PDF"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 sm:h-5 sm:w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								<span className="hidden sm:inline">Export PDF</span>
							</button>
						</div>
					</header>

					<div className="main-content-area flex-grow max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full pt-24 sm:pt-28 z-10 relative print:pt-8 print:px-2">
						<div className="mb-8 sm:mb-12 md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16 md:items-center">
							<div className="text-center md:text-left">
								<h1 className="font-poppins text-6xl sm:text-7xl lg:text-8xl xl:text-8xl font-extrabold mb-4 tracking-tight leading-snug bg-gradient-to-br from-sky-300 to-cyan-400 text-transparent bg-clip-text whitespace-nowrap print:bg-none print:text-black print:text-5xl">
									TimeNews
								</h1>
								<p className="text-lg sm:text-xl text-sky-100 max-w-3xl mx-auto md:mx-0 print:text-gray-600 print:text-base">
									Explore our past publications below and see what you've
									missed. Join our newsletter to stay updated with the latest
									insights!
								</p>
								<form
									onSubmit={handleSubscribe}
									noValidate
									className="mt-8 p-1 bg-blue-900/60 backdrop-blur-md rounded-full flex items-center border border-sky-400/30 shadow-xl w-full max-w-lg mx-auto md:mx-0 print:hidden"
									aria-label="Newsletter subscription form"
								>
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (emailError) setEmailError("");
										}}
										placeholder="your email address"
										className="flex-grow bg-transparent text-white placeholder-white/70 text-sm sm:text-base focus:outline-none border-none pl-4 pr-2 py-2 sm:py-3 min-w-0"
										aria-label="Email address for newsletter"
										required
									/>
									<button
										type="submit"
										className="bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 focus-visible:ring-sky-500 cursor-pointer flex-shrink-0"
									>
										Subscribe
									</button>
								</form>
								{emailError && (
									<div className="mt-3 p-3 bg-blue-800/80 border border-sky-500/40 rounded-lg backdrop-blur-md">
										<p className="text-sky-300 text-sm flex items-center gap-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 flex-shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											{emailError}
										</p>
									</div>
								)}
							</div>

							<div className="hidden md:flex justify-center items-center mt-10 md:mt-0 relative min-h-[24rem] lg:min-h-[28rem] print:hidden">
								<div className="w-full max-w-md lg:max-w-lg liquid-svg-animation absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
									<svg
										viewBox="0 0 500 500"
										xmlns="http://www.w3.org/2000/svg"
										width="100%"
										id="heroBlobSvg1"
									>
										<defs>
											<linearGradient
												id="heroBlobGradient"
												x1="0%"
												y1="0%"
												x2="0%"
												y2="100%"
											>
												<stop
													offset="0%"
													style={{ stopColor: "rgba(56, 189, 248, 0.15)" }}
												/>
												<stop
													offset="100%"
													style={{ stopColor: "rgba(8, 145, 178, 0.2)" }}
												/>
											</linearGradient>
										</defs>
										<path
											fill="url(#heroBlobGradient)"
											d="M426.6,288.9Q399.4,327.8,377.9,368.1Q356.3,408.3,309.1,411.3Q261.9,414.3,227.1,399.7Q192.3,385.1,155.1,371.3Q117.9,357.5,99.4,319.4Q80.8,281.2,60.8,243.6Q40.8,206,71.5,179.3Q102.3,152.6,125.9,127.3Q149.6,102,192.3,92.5Q235.1,83,270.8,81.4Q306.5,79.7,344.9,98.6Q383.3,117.5,410.5,152.6Q437.7,187.7,445.2,234.3Q452.7,280.9,426.6,288.9Z"
										/>
									</svg>
								</div>
								<div className="w-full max-w-sm lg:max-w-xs liquid-svg-animation-alt absolute top-1/2 left-1/2 transform -translate-x-[55%] -translate-y-[55%] opacity-90 z-0">
									<svg
										viewBox="0 0 350 350"
										xmlns="http://www.w3.org/2000/svg"
										width="100%"
										id="heroBlobSvg2"
									>
										<defs>
											<linearGradient
												id="heroBlobGradientSecondary"
												x1="0%"
												y1="0%"
												x2="0%"
												y2="100%"
											>
												<stop
													offset="0%"
													style={{ stopColor: "rgba(14, 165, 233, 0.12)" }}
												/>
												<stop
													offset="100%"
													style={{ stopColor: "rgba(20, 184, 166, 0.18)" }}
												/>
											</linearGradient>
										</defs>
										<path
											fill="url(#heroBlobGradientSecondary)"
											d="M315.8,303.3Q299.4,356.7,249.7,364.9Q200.1,373.1,162.9,342.3Q125.7,311.6,110.8,265.5Q95.9,219.4,115.3,178.6Q134.6,137.8,179.3,127.1Q224.1,116.3,264.4,124.6Q304.7,132.8,323.7,173.6Q342.7,214.4,332.2,258.9Q321.7,303.3,315.8,303.3Z"
											transform="scale(0.95) rotate(-10)"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div className="hidden print:block mb-8 prose">
							<h2 className="text-xl font-bold mb-2">Timeline Archive</h2>
							<p className="text-sm text-gray-600 mb-4">
								Current View:{" "}
								<span className="font-semibold">{currentZoomLabel}</span>
							</p>
							<div className="space-y-6">
								{groupKeys.map((key) => {
									const itemsInGroup = groupedNewsletters[key];
									const groupContainsMilestone = itemsInGroup.some(
										(n) => n.isMilestone
									);
									const isSelectedGroup = selectedGroupKey === key;
									return (
										<div
											key={`print-${key}`}
											className={`pt-4 border-t border-gray-200 ${
												isSelectedGroup ? "bg-gray-100 rounded p-4" : ""
											}`}
											style={{ breakInside: "avoid" }}
										>
											<h3
												className={`text-lg font-semibold mb-2 ${
													isSelectedGroup ? "underline" : ""
												}`}
											>
												{groupContainsMilestone && (
													<StarIcon className="inline-block w-4 h-4 mr-1.5 fill-current text-black" />
												)}
												{getGroupTitle(key)}
												<span className="text-sm font-normal text-gray-500 ml-2">
													({itemsInGroup.length} items)
												</span>
											</h3>
											<ul className="list-disc pl-5 space-y-1 text-sm">
												{itemsInGroup.map((item) => (
													<li key={`print-item-${item.id}`}>
														{item.isMilestone && (
															<StarIcon className="inline-block w-4 h-4 mr-1.5 fill-current text-black" />
														)}
														<span className="font-medium">{item.title}</span> -{" "}
														<span className="text-gray-600">
															{new Date(item.date).toLocaleDateString("en-CA", {
																timeZone: "UTC",
															})}
														</span>
													</li>
												))}
											</ul>
										</div>
									);
								})}
							</div>
						</div>

						<div className="sticky top-16 sm:top-20 z-30 bg-blue-900/50 backdrop-blur-2xl border border-sky-400/20 shadow-2xl rounded-2xl py-3 sm:py-4 mb-8 sm:mb-10 print:hidden">
							<div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
								<div className="flex items-center gap-1.5 sm:gap-2 bg-blue-950/70 backdrop-blur-lg border border-sky-400/20 p-1.5 rounded-full shadow-lg">
									<button
										onClick={() => handleZoom("out")}
										disabled={zoom <= 0.4}
										className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-700 hover:bg-sky-600 text-white disabled:bg-blue-800/50 disabled:text-white/50 disabled:cursor-not-allowed cursor-pointer transition-all"
										aria-label="Zoom out timeline"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M20 12H4"
											/>
										</svg>
									</button>
									<span className="px-3 py-1 text-xs sm:text-sm font-semibold text-white w-28 sm:w-32 text-center tabular-nums">
										{currentZoomLabel}
									</span>
									<button
										onClick={() => handleZoom("in")}
										disabled={zoom >= 2.8}
										className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-700 hover:bg-sky-600 text-white disabled:bg-blue-800/50 disabled:text-white/50 disabled:cursor-not-allowed cursor-pointer transition-all"
										aria-label="Zoom in timeline"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</button>
								</div>

								<div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 decades-scrollbar overflow-x-auto py-1 max-w-full sm:max-w-md lg:max-w-lg xl:max-w-xl">
									{decades.map((decade) => (
										<button
											key={decade}
											onClick={() => handleDecadeJump(decade)}
											className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ease-in-out whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 focus-visible:ring-sky-500 cursor-pointer ${
												isDecadeActive(decade)
													? "bg-sky-600 text-white border border-sky-400/50 shadow-lg transform scale-105"
													: "bg-blue-950/70 backdrop-blur-md border border-white/20 text-white/90 hover:bg-blue-800/80 hover:text-white shadow-md"
											}`}
											aria-label={`Jump to ${decade}s decade`}
										>
											{decade}s
										</button>
									))}
								</div>
							</div>
						</div>

						{newsletterData.length === 0 && (
							<div className="text-center py-16 print:hidden">
								<svg
									className="mx-auto h-16 w-16 text-white/80"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										vectorEffect="non-scaling-stroke"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<h3 className="mt-2 text-xl font-semibold text-white">
									No Newsletters Yet
								</h3>
								<p className="mt-1 text-md text-white/80">
									Please check back later for updates.
								</p>
							</div>
						)}

						{!isMobile && newsletterData.length > 0 && viewportWidth > 0 && (
							<div
								className="hidden md:block mb-10 sm:mb-12 h-56 sm:h-64 select-none relative print:hidden"
								onWheel={handleWheel}
								onMouseLeave={onMouseUpOrLeave}
								onTouchStart={onTouchStart}
								onTouchMove={onTouchMove}
								onTouchEnd={onTouchEnd}
							>
								<div
									ref={timelineContainerRef}
									onMouseDown={onMouseDown}
									className="absolute inset-0 overflow-x-auto py-8 cursor-grab timeline-scrollbar rounded-lg bg-blue-950/50 backdrop-blur-sm shadow-inner"
									style={{
										scrollBehavior: "auto",
										overscrollBehavior: "contain",
									}}
								>
									<div
										className="relative h-full"
										style={{ width: `${scrollTrackWidth}px` }}
									>
										<div className="absolute top-1/2 left-0 right-0 h-1 bg-sky-800/80 rounded-full transform -translate-y-1/2 z-0"></div>

										<div
											className="absolute top-0 bottom-0 flex items-center h-full"
											style={{
												left: `${spacerWidthForTrack}px`,
												width: `${itemsTotalWidthForTrack}px`,
											}}
										>
											{groupKeys.map((key) => {
												const itemsInGroup = groupedNewsletters[key];
												if (!itemsInGroup || itemsInGroup.length === 0)
													return null;

												const firstItemDate = new Date(itemsInGroup[0].date);
												const year = firstItemDate.getUTCFullYear();
												const colorClass = getYearColor(year);
												const isActive =
													selectedId &&
													itemsInGroup.some((n) => n.id === selectedId);
												const groupContainsMilestone = itemsInGroup.some(
													(n) => n.isMilestone
												);
												const selectedItemIsMilestone =
													isActive &&
													newsletterData.find((n) => n.id === selectedId)
														?.isMilestone;

												return (
													<div
														key={`desktop-${key}`}
														ref={(el) => {
															if (el) itemRefs.current.set(key, el);
															else itemRefs.current.delete(key);
														}}
														className="flex-shrink-0 px-1.5 sm:px-2 relative h-full flex items-center"
														style={{ width: `${currentItemWidthForTrack}px` }}
														onClick={() => handleItemClick(itemsInGroup[0].id)}
														role="button"
														tabIndex={0}
														onKeyPress={(e) =>
															e.key === "Enter" &&
															handleItemClick(itemsInGroup[0].id)
														}
														aria-label={`Select ${getGroupTitle(key)}`}
													>
														<div className="relative group cursor-pointer transition-all duration-200 w-full flex flex-col items-center justify-center h-full">
															<div
																className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white/60 transition-all duration-300 ease-in-out z-10 ${
																	isActive
																		? `ring-4 ring-offset-2 ${
																				selectedItemIsMilestone
																					? "ring-amber-500/80 ring-offset-amber-900/50"
																					: "ring-sky-500/70 ring-offset-blue-900"
																		  } shadow-xl scale-125 sm:scale-150 ${colorClass.replace(
																				"bg-",
																				"bg-opacity-90 "
																		  )}`
																		: `${
																				groupContainsMilestone
																					? "bg-amber-500/60 border-amber-400"
																					: colorClass.replace(
																							"bg-",
																							"bg-opacity-70 "
																					  )
																		  } group-hover:shadow-md group-hover:scale-110 sm:group-hover:scale-125`
																}`}
															></div>
															<div
																className={`text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-200 ease-in-out ${
																	isActive
																		? "-mt-10 sm:-mt-11"
																		: "-mt-8 sm:-mt-9 group-hover:-mt-9"
																}`}
															>
																<span
																	className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg transition-all duration-200 ease-in-out ${
																		isActive
																			? selectedItemIsMilestone
																				? "bg-amber-900/70 text-amber-100"
																				: "bg-blue-800/70 text-white"
																			: `bg-blue-950/70 backdrop-blur-md border border-sky-400/20 text-white group-hover:bg-blue-800/70 group-hover:text-white`
																	}`}
																>
																	{groupContainsMilestone && (
																		<StarIcon className="inline-block w-4 h-4 text-amber-400 mr-1" />
																	)}
																	{getGroupTitle(key)}
																	{isActive && selectedItemIsMilestone && (
																		<span className="sr-only">
																			{" "}
																			(Milestone)
																		</span>
																	)}
																</span>
															</div>
															<div
																className={`text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-200 ease-in-out ${
																	isActive
																		? "mt-8 sm:mt-9"
																		: "mt-6 sm:mt-7 group-hover:mt-7"
																}`}
															>
																<span
																	className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
																		isActive
																			? selectedItemIsMilestone
																				? "bg-blue-950/80 text-amber-300"
																				: "bg-blue-950/80 text-sky-300"
																			: "bg-blue-950/60 text-white/80 group-hover:text-sky-300 group-hover:bg-blue-950/80"
																	} shadow-md flex items-center gap-1`}
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-3 w-3"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		strokeWidth="2"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
																		/>
																	</svg>
																	{itemsInGroup.length} item
																	{itemsInGroup.length === 1 ? "" : "s"}
																</span>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						)}

						{isMobile && newsletterData.length > 0 && (
							<div className="md:hidden mb-8 print:hidden">
								<h3 className="text-xl font-bold text-sky-400 mb-3 flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									Timeline
									<span className="text-sm font-normal text-white/70 ml-1">
										(scroll to see more)
									</span>
								</h3>

								{/* Scrollable timeline container */}
								<div className="max-h-[40vh] overflow-y-auto pr-1 timeline-scrollbar rounded-lg border border-sky-400/20 bg-blue-950/30 backdrop-blur-sm">
									<div className="space-y-5 p-4">
										{groupKeys.map((key, index) => {
											const itemsInGroup = groupedNewsletters[key];
											if (!itemsInGroup || itemsInGroup.length === 0)
												return null;

											const isActive =
												selectedId &&
												itemsInGroup.some((n) => n.id === selectedId);
											const groupContainsMilestone = itemsInGroup.some(
												(n) => n.isMilestone
											);

											return (
												<div
													key={`mobile-${key}`}
													ref={(el) => {
														if (el) itemRefs.current.set(key, el);
														else itemRefs.current.delete(key);
													}}
													className={`relative pl-8 pb-3 border-l-2 ${
														index === groupKeys.length - 1
															? "border-l-transparent"
															: "border-sky-700/70"
													} last:pb-0`}
													onClick={() => handleItemClick(itemsInGroup[0].id)}
													role="button"
													tabIndex={0}
													onKeyPress={(e) =>
														e.key === "Enter" &&
														handleItemClick(itemsInGroup[0].id)
													}
													aria-label={`Select ${getGroupTitle(key)}`}
												>
													<div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full border-2 border-sky-400/60"></div>
													<div
														className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ease-in-out shadow-xl ${
															isActive
																? `bg-blue-800/50 backdrop-blur-xl border border-sky-400/30`
																: `bg-blue-950/40 backdrop-blur-xl border border-sky-400/20 hover:bg-blue-800/40 hover:border-sky-400/30`
														}`}
													>
														<div className="flex items-center gap-2.5 mb-1.5">
															<span className="w-3 h-3 rounded-full"></span>
															<h3 className="text-md font-semibold text-white">
																{groupContainsMilestone && (
																	<StarIcon className="inline-block w-4 h-4 text-amber-400 mr-1.5" />
																)}
																{getGroupTitle(key)}
																{groupContainsMilestone && (
																	<span className="sr-only">
																		{" "}
																		(Milestone Group)
																	</span>
																)}
															</h3>
														</div>
														<p className="text-xs text-white/80 ml-[22px] flex items-center gap-1">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-3 w-3"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																strokeWidth="2"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
																/>
															</svg>
															{itemsInGroup.length} newsletter
															{itemsInGroup.length === 1 ? "" : "s"}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						)}

						{selectedId &&
							(() => {
								const newsletter = newsletterData.find(
									(n) => n.id === selectedId
								);
								if (!newsletter) return null;
								const parts = newsletter.date.split("-").map(Number);
								const date = new Date(
									Date.UTC(parts[0], parts[1] - 1, parts[2])
								);

								return (
									<div
										className={`print-card bg-blue-900/30 backdrop-blur-xl border ${
											newsletter.isMilestone
												? "border-amber-500/40"
												: "border-sky-400/30"
										} rounded-3xl shadow-2xl overflow-hidden mt-8 sm:mt-10 print:bg-white print:shadow-none print:rounded-lg`}
									>
										<div
											className={`h-2.5 ${
												newsletter.isMilestone
													? "bg-amber-500/80"
													: "bg-sky-600"
											} print:hidden`}
										></div>
										<div className="p-5 sm:p-8 print:p-6">
											<div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5 sm:mb-6">
												<div className="flex-grow">
													<div className="flex items-center gap-2.5 mb-2.5">
														<span
															className={`w-3 h-3 rounded-full ${
																newsletter.isMilestone
																	? "bg-amber-500/90"
																	: "bg-sky-600"
															} print:hidden`}
														></span>
														<span className="text-sm font-medium text-white/80 print:text-gray-600 print:font-normal">
															{date.toLocaleDateString("en-US", {
																year: "numeric",
																month: "long",
																day: "numeric",
																weekday: "long",
																timeZone: "UTC",
															})}
														</span>
													</div>
													<h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight print:text-2xl print:text-black">
														{newsletter.isMilestone && (
															<StarIcon className="inline-block w-5 h-5 text-amber-400 mr-2 print:fill-black" />
														)}
														{newsletter.title}
													</h2>
												</div>
												<button
													onClick={() => setModalOpenForId(newsletter.id)}
													aria-label={`Read full story for ${newsletter.title}`}
													className="flex-shrink-0 mt-2 sm:mt-1.5 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 focus-visible:ring-sky-500 cursor-pointer print:hidden"
												>
													Read Full Story
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
															clipRule="evenodd"
														/>
													</svg>
												</button>
											</div>
											<div className="prose prose-sm sm:prose-base prose-invert max-w-none text-white/90 [&_p]:mb-3 print:prose-stone print:text-gray-800">
												<p>{newsletter.summary}</p>
											</div>
										</div>
									</div>
								);
							})()}

						{selectedId && newsInSelectedGroup.length > 0 && (
							<div className="mt-10 sm:mt-14 print:mt-8">
								<h3 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-6 sm:mb-8 flex items-center gap-3 print:text-xl print:text-black print:mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-7 w-7 sm:h-8 sm:w-8 print:hidden"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4 6h16M4 10h16M4 14h16M4 18h16"
										/>
									</svg>
									Also from {selectedGroupTitle}
								</h3>

								{/* Make the articles container scrollable on mobile */}
								<div
									className={`${
										isMobile
											? "max-h-[60vh] overflow-y-auto pr-1 modal-scrollbar"
											: ""
									}`}
								>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 print:grid-cols-1 print:gap-6">
										{/* Existing article cards code remains the same */}
										{newsInSelectedGroup.map((item) => {
											const itemDateParts = item.date.split("-").map(Number);
											const itemDate = new Date(
												Date.UTC(
													itemDateParts[0],
													itemDateParts[1] - 1,
													itemDateParts[2]
												)
											);
											const isCurrentlySelectedInList = item.id === selectedId;

											return (
												<div
													key={item.id}
													className={`print-card rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.03] focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-blue-900 flex flex-col print:shadow-none print:rounded-lg ${
														isCurrentlySelectedInList
															? `bg-blue-800/40 backdrop-blur-xl border-2 ${
																	item.isMilestone
																		? "border-amber-500/70 focus-within:ring-amber-500"
																		: "border-sky-500/60 focus-within:ring-sky-500"
															  } print:bg-gray-50 print:border-gray-400`
															: `bg-blue-950/30 backdrop-blur-xl border ${
																	item.isMilestone
																		? "border-amber-600/40 hover:border-amber-500/60"
																		: "border-sky-400/30 hover:border-sky-400/50"
															  } hover:bg-blue-800/40 focus-within:ring-sky-500 print:bg-white`
													}`}
												>
													{/* Existing article card content - no changes needed */}
													<div
														className={`h-2 ${
															item.isMilestone
																? "bg-amber-500/80"
																: "bg-sky-600"
														} print:hidden`}
													></div>
													<div className="p-5 flex flex-col flex-grow print:p-4">
														<div className="flex items-center gap-2 mb-2.5">
															<span
																className={`w-2.5 h-2.5 rounded-full ${
																	item.isMilestone
																		? "bg-amber-500/80"
																		: "bg-sky-600"
																} print:hidden`}
															></span>
															<span className="text-xs text-white/80 print:text-gray-600">
																{itemDate.toLocaleDateString("en-US", {
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																	timeZone: "UTC",
																})}
															</span>
														</div>
														<h4 className="text-lg font-semibold text-white mb-2 leading-snug print:text-base print:text-black">
															{item.isMilestone && (
																<StarIcon className="inline-block w-4 h-4 text-amber-400 mr-1.5 print:fill-black" />
															)}
															{item.title}
														</h4>
														<p className="text-sm text-white/90 mb-4 flex-grow print:text-gray-700">
															{item.summary.substring(0, 120)}...
														</p>
														<div className="mt-auto pt-2 flex justify-end print:hidden">
															<button
																onClick={() => {
																	if (!isCurrentlySelectedInList) {
																		handleItemClick(item.id);
																	}
																	setModalOpenForId(item.id);
																}}
																className={`inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 ${
																	isCurrentlySelectedInList
																		? "bg-sky-600 text-white cursor-default"
																		: "bg-blue-900/60 hover:bg-sky-600 text-white/90 hover:text-white cursor-pointer"
																}`}
																aria-label={
																	isCurrentlySelectedInList
																		? `Currently viewing details for ${item.title}`
																		: `View details for ${item.title}`
																}
																disabled={isCurrentlySelectedInList}
															>
																{isCurrentlySelectedInList ? (
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-6 w-6"
																		viewBox="0 0 20 20"
																		fill="currentColor"
																	>
																		<path
																			fillRule="evenodd"
																			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																			clipRule="evenodd"
																		/>
																	</svg>
																) : (
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		className="h-5 w-5"
																		viewBox="0 0 20 20"
																		fill="currentColor"
																	>
																		<path
																			fillRule="evenodd"
																			d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
																			clipRule="evenodd"
																		/>
																	</svg>
																)}
															</button>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						)}

						<footer className="mt-12 sm:mt-16 pt-8 border-t border-sky-400/20 text-center text-white/70 text-xs sm:text-sm print:border-t-gray-300 print:text-gray-500 print:mt-8 print:pt-4">
							<p className="flex items-center justify-center gap-1">
								{new Date().getFullYear()} TimeNews. Inspired by Modern Design.
							</p>
						</footer>
					</div>
				</div>

				{modalOpenForId &&
					(() => {
						const newsletter = newsletterData.find(
							(n) => n.id === modalOpenForId
						);
						if (!newsletter) return null;

						const parts = newsletter.date.split("-").map(Number);
						const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

						return (
							<div
								className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:hidden cursor-pointer"
								onClick={() => setModalOpenForId(null)}
								role="dialog"
								aria-modal="true"
								aria-labelledby={`modal-title-${newsletter.id}`}
							>
								<div
									className={`bg-blue-900/40 backdrop-blur-2xl border ${
										newsletter.isMilestone
											? "border-amber-500/40"
											: "border-sky-400/30"
									} rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_8px_32px_rgba(14,165,233,0.25)]`}
									onClick={(e) => e.stopPropagation()}
								>
									<div
										className={`h-2 ${
											newsletter.isMilestone ? "bg-amber-500/80" : "bg-sky-600"
										} flex-shrink-0`}
									></div>
									<div className="p-6 sm:p-8 flex-grow overflow-y-auto modal-scrollbar relative">
										<button
											onClick={() => setModalOpenForId(null)}
											className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
											aria-label="Close newsletter details"
										>
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
													strokeWidth="2"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>

										<div className="flex items-center gap-3 mb-3">
											<span
												className={`w-3 h-3 rounded-full ${
													newsletter.isMilestone
														? "bg-amber-500/80"
														: "bg-sky-600"
												}`}
											></span>
											<span className="text-sm font-medium text-white/80">
												{date.toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
													weekday: "long",
													timeZone: "UTC",
												})}
											</span>
										</div>
										<h2
											id={`modal-title-${newsletter.id}`}
											className="text-2xl sm:text-3xl font-bold text-white mb-6 pr-10"
										>
											{newsletter.isMilestone && (
												<StarIcon className="inline-block w-5 h-5 text-amber-400 mr-2" />
											)}
											{newsletter.title}
											{newsletter.isMilestone && (
												<span className="sr-only"> (Milestone)</span>
											)}
										</h2>
										<div className="prose prose-sm sm:prose-base prose-invert max-w-none text-white/90 [&_p]:mb-4 [&_a]:text-sky-400 hover:[&_a]:text-sky-300">
											{newsletter.summary
												.split("\n")
												.map((paragraph, index) => (
													<p key={index}>{paragraph}</p>
												))}
										</div>
									</div>
								</div>
							</div>
						);
					})()}

				{isSubscriptionModalOpen && subscribedEmail && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md print:hidden cursor-pointer"
						onClick={() => setIsSubscriptionModalOpen(false)}
						role="dialog"
						aria-modal="true"
						aria-labelledby="subscription-modal-title"
					>
						<div
							className="bg-blue-900/50 backdrop-blur-2xl border border-sky-600/50 rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center"
							onClick={(e) => e.stopPropagation()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-green-400 mx-auto mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h2
								id="subscription-modal-title"
								className="text-2xl font-semibold text-sky-400 mb-4"
							>
								Subscription Confirmed!
							</h2>
							<p className="text-white mb-6">
								Thank you for subscribing. You'll receive our latest updates and
								news at:
								<br />
								<strong className="text-white break-all">
									{subscribedEmail}
								</strong>
							</p>
							<button
								onClick={() => setIsSubscriptionModalOpen(false)}
								className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 focus-visible:ring-sky-500 cursor-pointer"
								aria-label="Close subscription confirmation"
							>
								Got it!
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default NewsletterArchive;
