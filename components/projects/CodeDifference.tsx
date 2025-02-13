"use client";
import { useRef, useState, useEffect, useCallback } from "react";

type DiffLine = {
	old: string;
	new: string;
	lineNumber: number;
	type: "unchanged" | "changed" | "added" | "deleted";
};

type CommentPin = Record<number, string>;

type HeaderProps = {
	darkMode: boolean;
	setDarkMode: (value: boolean) => void;
	swiped: boolean;
	setSwiped: (value: boolean) => void;
	rejected: boolean;
	setRejected: (value: boolean) => void;
	scrollRatio: number;
	setShowApproveModal: (value: boolean) => void;
	setShowRejectModal: (value: boolean) => void;
};

type FooterProps = {
	darkMode: boolean;
};

type LineViewProps = {
	line: DiffLine;
	commentPins: CommentPin;
	setActivePin: (lineNumber: number | null) => void;
	lineHeight: number;
	darkMode: boolean;
	isOld?: boolean;
	emojiReactions?: EmojiReactions;
	setShowDiffModal?: (show: boolean) => void;
	setDiffContent?: (content: { text: string; lineNumber?: number }) => void;
};

type AnnotationModalProps = {
	activePin: number;
	setActivePin: (lineNumber: number | null) => void;
	commentPins: CommentPin;
	setCommentPins: React.Dispatch<React.SetStateAction<CommentPin>>;
	emojiReactions: EmojiReactions;
	setEmojiReactionsByLine: React.Dispatch<React.SetStateAction<EmojiReactions>>;
	setSelectedEmojiReactions: React.Dispatch<React.SetStateAction<string[]>>;
	setShowEmoji: (show: boolean) => void;
	darkMode: boolean;
};

type EmojiBottomSheetProps = {
	showEmoji: boolean;
	setShowEmoji: (show: boolean) => void;
	selectedEmojiReactions: string[];
	handleEmojiReaction: (emoji: string) => void;
	darkMode: boolean;
};

type TextSelectionToolbarProps = {
	showToolbar: boolean;
	toolbarPos: { top: number; left: number };
	highlightedText: string;
	setShowToolbar: (show: boolean) => void;
	setShowDiffModal: (show: boolean) => void;
	setDiffContent: (content: { text: string; lineNumber?: number }) => void;
};

type EmojiReactions = Record<number, string[]>;

type DiffModalProps = {
	showDiffModal: boolean;
	setShowDiffModal: (show: boolean) => void;
	diffContent: { text: string; lineNumber?: number };
	darkMode: boolean;
	diffLines: DiffLine[];
};

// Components
const Header = ({
	darkMode,
	setDarkMode,
	swiped,
	setSwiped,
	rejected,
	setRejected,
	scrollRatio = 0,
	setShowApproveModal,
	setShowRejectModal,
}: HeaderProps) => {
	const useScrollPercentage = (): number => {
		const [percentage, setPercentage] = useState(0);

		useEffect(() => {
			const update = () => {
				const scrollTop =
					document.documentElement.scrollTop || document.body.scrollTop;

				const scrollHeight = document.documentElement.scrollHeight;
				const clientHeight = document.documentElement.clientHeight;
				const maxScroll = scrollHeight - clientHeight;

				const pct = scrollTop / maxScroll;
				setPercentage(+pct.toFixed(2));
			};

			update();
			window.addEventListener("scroll", update, { passive: true });

			return () => window.removeEventListener("scroll", update);
		}, []);

		return percentage;
	};
	const pct = useScrollPercentage();

	const progress = Math.round(pct * 100);
	const handleReject = () => {
		setRejected(true);
		setSwiped(false);
		setShowRejectModal(true);
	};

	const handleApprove = () => {
		setSwiped(true);
		setRejected(false);
		setShowApproveModal(true);
	};

	const getStatusInfo = () => {
		if (rejected)
			return { text: "Rejected", color: "bg-red-500", pulse: false };
		if (swiped)
			return { text: "Approved", color: "bg-green-500", pulse: false };
		return { text: "In review", color: "bg-blue-500", pulse: true };
	};

	const status = getStatusInfo();

	return (
		<div
			className={`flex flex-col shadow-lg sticky top-0 z-20 ${
				darkMode ? "bg-[#0a1d2e]" : "bg-white"
			} transition-colors duration-300`}
		>
			<div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
				<div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2 sm:gap-4 mb-3 sm:mb-0">
					<div className="font-bold text-xl flex items-center">
						<span
							className={`${
								darkMode ? "text-blue-300" : "text-blue-700"
							} tracking-tight`}
						>
							Diff<span className="font-extrabold">Review</span>
						</span>
					</div>

					<div className="flex sm:hidden items-center gap-1 bg-opacity-10 rounded-full px-2 py-1 text-xs font-medium">
						<div
							className={`h-2 w-2 rounded-full ${status.color} ${
								status.pulse ? "animate-pulse" : ""
							}`}
						></div>
						<span className={darkMode ? "text-gray-300" : "text-gray-700"}>
							{status.text}
						</span>
					</div>

					<div className="hidden sm:flex items-center gap-2 bg-opacity-10 rounded-full px-3 py-1 text-sm font-medium">
						<div
							className={`h-2 w-2 rounded-full ${status.color} ${
								status.pulse ? "animate-pulse" : ""
							}`}
						></div>
						<span className={darkMode ? "text-gray-300" : "text-gray-700"}>
							{status.text}
							{status.text === "In review" && ` (${progress}% viewed)`}
						</span>
					</div>

					<div className="sm:hidden text-right">
						<div
							className={`text-xs ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							main.js
						</div>
					</div>
				</div>

				<div className="w-full sm:hidden flex items-center gap-2 mb-3">
					<div className="h-1.5 flex-grow bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
						<div
							className={`h-full ${
								rejected
									? "bg-red-500"
									: swiped
									? "bg-green-500"
									: "bg-blue-600"
							} transition-all duration-300 ease-in-out`}
							style={{ width: `${progress}%` }}
						></div>
					</div>
					<span className="text-xs font-medium text-blue-600 dark:text-blue-400 min-w-[30px] text-right">
						{progress}%
					</span>
				</div>

				<div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 sm:gap-3">
					<div className="hidden sm:block text-right">
						<div
							className={`text-xs ${
								darkMode ? "text-gray-400" : "text-gray-500"
							}`}
						>
							main.js
						</div>
						<div
							className={`text-xs ${
								darkMode ? "text-gray-500" : "text-gray-600"
							}`}
						>
							15 changes
						</div>
					</div>

					<button
						onClick={() => setDarkMode(!darkMode)}
						className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
							darkMode ? "text-yellow-300" : "text-blue-600"
						}`}
						aria-label="Toggle dark mode"
					>
						{darkMode ? "☀️" : "🌙"}
					</button>

					<div className="flex gap-2">
						<button
							className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold shadow-md transition-all duration-300 ${
								rejected
									? "bg-red-500 text-white"
									: "bg-white text-red-600 border border-red-300 hover:bg-red-50"
							}`}
							onClick={handleReject}
						>
							{rejected ? "❌ Rejected" : "Reject"}
						</button>

						<button
							className={`rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-sm font-semibold shadow-md transition-all duration-300 ${
								swiped
									? "bg-green-500 text-white"
									: "bg-blue-600 text-white hover:bg-blue-700"
							}`}
							onClick={handleApprove}
						>
							{swiped ? "✔️ Approved!" : "Approve"}
						</button>
					</div>
				</div>
			</div>

			<div className="hidden sm:block h-2 bg-gray-200 dark:bg-gray-800 w-full relative">
				<div
					className={`h-full ${
						rejected ? "bg-red-500" : swiped ? "bg-green-500" : "bg-blue-600"
					} transition-all duration-300 ease-in-out relative`}
					style={{ width: `${progress}%` }}
				>
					<div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border-2 border-blue-600 dark:border-blue-400 shadow-md"></div>
				</div>
			</div>

			<div
				className={`h-px w-full ${darkMode ? "bg-[#2b4470]" : "bg-blue-200"}`}
			></div>
		</div>
	);
};

const Footer = ({ darkMode }: FooterProps) => (
	<footer
		className={`py-8 border-t ${
			darkMode
				? "bg-[#091a29] border-[#1e3755] text-gray-300"
				: "bg-[#f8fafd] border-gray-100 text-gray-600"
		} transition-colors duration-300`}
	>
		<div className="container mx-auto px-6">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
				<div className="md:col-span-4 space-y-4">
					<div className="flex items-center gap-2">
						<div
							className={`h-8 w-8 rounded-lg ${
								darkMode ? "bg-blue-900" : "bg-blue-100"
							} flex items-center justify-center`}
						>
							<span
								className={`text-xl ${
									darkMode ? "text-blue-300" : "text-blue-700"
								}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M16 3h5v5"></path>
									<path d="M4 20l16-16"></path>
									<path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
								</svg>
							</span>
						</div>
						<div className="font-bold text-xl flex items-center">
							<span
								className={`${
									darkMode ? "text-blue-300" : "text-blue-700"
								} tracking-tight`}
							>
								Diff<span className="font-extrabold">Review</span>
							</span>
						</div>
					</div>

					<p
						className={`text-sm ${
							darkMode ? "text-gray-400" : "text-gray-500"
						} leading-relaxed max-w-sm`}
					>
						Advanced code review platform designed for development teams to
						collaborate, compare changes, and ensure code quality.
					</p>

					<div
						className={`text-xs ${
							darkMode ? "text-gray-500" : "text-gray-400"
						} font-medium`}
					>
						 {new Date().getFullYear()} DiffReview. Compare beyond.
					</div>
				</div>

				<div className="md:col-span-8">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8">
						<div className="space-y-4">
							<h3
								className={`text-sm font-semibold ${
									darkMode ? "text-blue-300" : "text-blue-700"
								}`}
							>
								Product
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Integrations
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Changelog
									</a>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3
								className={`text-sm font-semibold ${
									darkMode ? "text-blue-300" : "text-blue-700"
								}`}
							>
								Resources
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Documentation
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										API Reference
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Tutorials
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Status
									</a>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3
								className={`text-sm font-semibold ${
									darkMode ? "text-blue-300" : "text-blue-700"
								}`}
							>
								Company
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										About
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Careers
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Contact
									</a>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3
								className={`text-sm font-semibold ${
									darkMode ? "text-blue-300" : "text-blue-700"
								}`}
							>
								Legal
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Privacy
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Terms
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Security
									</a>
								</li>
								<li>
									<a
										href="#"
										className={`text-sm ${
											darkMode
												? "text-gray-400 hover:text-blue-300"
												: "text-gray-600 hover:text-blue-700"
										} transition-colors duration-200`}
									>
										Licenses
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div
				className={`mt-12 pt-6 border-t ${
					darkMode ? "border-[#1e3755]" : "border-gray-100"
				} flex flex-col sm:flex-row justify-between items-center gap-4`}
			>
				<div className="flex items-center">
					<div
						className={`px-3 py-1 rounded-full text-xs font-medium ${
							darkMode
								? "bg-blue-900/30 text-blue-300"
								: "bg-blue-50 text-blue-700"
						}`}
					>
						Version 2.4.0
					</div>
				</div>

				<div
					className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
				>
					Made with care by the DiffReview team
				</div>
			</div>
		</div>
	</footer>
);

const LineView = ({
	line,
	commentPins,
	setActivePin,
	lineHeight,
	darkMode,
	isOld = false,
	emojiReactions,
	setShowDiffModal,
	setDiffContent,
}: LineViewProps) => {
	// Add touch feedback for mobile
	const [isTouched, setIsTouched] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const getLineBackground = (type: string) => {
		const baseColors = {
			changed: darkMode ? "bg-[#11294b]" : "bg-blue-50",
			added: darkMode ? "bg-[#132e20]" : "bg-green-50",
			deleted: darkMode ? "bg-[#2e1320]" : "bg-red-50",
			default: "",
		};

		if (isTouched) {
			if (type === "changed") return darkMode ? "bg-[#15325d]" : "bg-blue-100";
			if (type === "added") return darkMode ? "bg-[#193928]" : "bg-green-100";
			if (type === "deleted") return darkMode ? "bg-[#3b1a29]" : "bg-red-100";
		}

		return baseColors[type as keyof typeof baseColors] || baseColors.default;
	};

	const getLineNumberColor = (type: string) => {
		switch (type) {
			case "changed":
				return darkMode ? "text-blue-300" : "text-blue-600";
			case "added":
				return darkMode ? "text-green-300" : "text-green-600";
			case "deleted":
				return darkMode ? "text-red-300" : "text-red-600";
			default:
				return darkMode ? "text-gray-500" : "text-gray-400";
		}
	};

	const hasEmojis =
		emojiReactions &&
		emojiReactions[line.lineNumber] &&
		emojiReactions[line.lineNumber].length > 0;

	return (
		<div
			className={`group flex items-start ${getLineBackground(
				line.type
			)} relative overflow-hidden`}
			style={{
				height: `${lineHeight}px`,
				minHeight: `${lineHeight}px`,
				paddingLeft: "8px",
				paddingRight: "8px",
				paddingTop: "4px",
				paddingBottom: "4px",
				fontFamily: "Menlo, Monaco, 'Courier New', monospace",
				fontSize: "13px",
				lineHeight: "20px",
			}}
			onTouchStart={() => setIsTouched(true)}
			onTouchEnd={() => setTimeout(() => setIsTouched(false), 300)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<span
				className={`shrink-0 text-right select-none ${getLineNumberColor(
					line.type
				)}`}
				style={{
					width: "30px",
					marginRight: "8px",
					fontSize: "12px",
				}}
			>
				{line.lineNumber + 1}
			</span>

			{commentPins[line.lineNumber] && (
				<button
					className="shrink-0 z-10 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
					style={{ marginRight: "8px" }}
					onClick={() => setActivePin(line.lineNumber)}
				>
					{hasEmojis ? `📍 ${emojiReactions[line.lineNumber][0]}` : "📍"}
				</button>
			)}

			<span
				className="overflow-x-auto whitespace-pre-wrap break-words"
				style={{
					maxWidth: "calc(100% - 50px)",
					wordBreak: "break-all",
				}}
			>
				{isOld
					? line.old || <span>&nbsp;</span>
					: line.new || <span>&nbsp;</span>}
			</span>

			<div
				className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center transition-opacity duration-200 ${
					isHovered || isTouched
						? "opacity-100"
						: "opacity-0 group-hover:opacity-100"
				}`}
			>
				{line.type !== "unchanged" && setShowDiffModal && setDiffContent && (
					<button
						className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-opacity mr-2"
						onClick={() => {
							setDiffContent({
								text: isOld ? line.old : line.new,
								lineNumber: line.lineNumber,
							});
							setShowDiffModal(true);
						}}
						title="Compare this line"
					>
						🔍
					</button>
				)}

				{!commentPins[line.lineNumber] && (
					<div className="relative group/tooltip">
						<button
							className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
								darkMode
									? "bg-blue-900/30 hover:bg-blue-800/60 text-blue-300 hover:text-blue-200"
									: "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
							} shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
							onClick={() => setActivePin(line.lineNumber)}
							aria-label="Add comment"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
						</button>

						<div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none">
							Add comment
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const AnnotationModal = ({
	activePin,
	setActivePin,
	commentPins,
	setCommentPins,
	emojiReactions,
	setEmojiReactionsByLine,
	setSelectedEmojiReactions,
	setShowEmoji,
	darkMode,
}: AnnotationModalProps) => {
	const [comment, setComment] = useState(commentPins[activePin] || "");
	const [isEditing, setIsEditing] = useState(!commentPins[activePin]);
	const lineEmojis = emojiReactions[activePin] || [];

	const saveComment = () => {
		setCommentPins((prev) => ({
			...prev,
			[activePin]: comment,
		}));

		if (!emojiReactions[activePin]) {
			setEmojiReactionsByLine((prev) => ({
				...prev,
				[activePin]: [],
			}));
		}

		setIsEditing(false);
	};

	const closeModal = () => {
		if (!commentPins[activePin] && !comment.trim()) {
			setActivePin(null);
			return;
		}

		if (isEditing && commentPins[activePin]) {
			setComment(commentPins[activePin]);
			setIsEditing(false);
			return;
		}

		setActivePin(null);
	};

	const deleteComment = () => {
		setCommentPins((prev) => {
			const newPins = { ...prev };
			delete newPins[activePin];
			return newPins;
		});

		setEmojiReactionsByLine((prev) => {
			const newReactions = { ...prev };
			delete newReactions[activePin];
			return newReactions;
		});

		setActivePin(null);
	};

	return (
		<div
			className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300"
			onClick={closeModal}
		>
			<div
				className={`bg-white dark:bg-[#1a2b42] rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden transition-all duration-300 transform scale-100`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex items-center justify-between">
					<div className="font-semibold flex items-center gap-2">
						<span className="text-lg">📍</span>
						<span>Comment</span>
						<span className="text-xs bg-blue-500/50 px-2 py-0.5 rounded-full">
							line {activePin + 1}
						</span>
					</div>
					<div className="flex items-center gap-2">
						{!isEditing && commentPins[activePin] && (
							<button
								className="text-white hover:bg-red-500 rounded-full p-1.5 transition-all duration-200 hover:shadow-lg"
								onClick={(e) => {
									e.stopPropagation();
									deleteComment();
								}}
								title="Delete comment"
							>
								🗑️
							</button>
						)}
						<button
							className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 rounded-full transition-all duration-200 group"
							onClick={(e) => {
								e.stopPropagation();
								closeModal();
							}}
							aria-label="Close"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="group-hover:scale-110 transition-transform duration-200"
							>
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>
				</div>
				<div className="p-4">
					{!isEditing && commentPins[activePin] ? (
						<>
							<div className="text-gray-800 dark:text-gray-200 font-medium mb-3 border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded">
								{commentPins[activePin]}
							</div>

							{lineEmojis.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-3 mb-3">
									{lineEmojis.map((emoji) => (
										<span
											key={emoji}
											className="text-xl bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
										>
											{emoji}
										</span>
									))}
								</div>
							)}
						</>
					) : (
						<textarea
							className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 min-h-[80px] focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none"
							placeholder="Add your comment here..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							autoFocus
						/>
					)}
					<div className="flex gap-2 mt-4 justify-between">
						{isEditing ? (
							<>
								<button
									className="rounded-md px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200"
									onClick={(e) => {
										e.stopPropagation();
										if (commentPins[activePin]) {
											setComment(commentPins[activePin]);
											setIsEditing(false);
										} else {
											setActivePin(null);
										}
									}}
								>
									Cancel
								</button>
								<button
									className="rounded-md px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 hover:shadow-md"
									onClick={(e) => {
										e.stopPropagation();
										saveComment();
									}}
								>
									Save
								</button>
							</>
						) : (
							<div className="flex gap-2 w-full">
								<button
									className="rounded-md px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition-all duration-200 flex-1 hover:shadow-md"
									onClick={(e) => {
										e.stopPropagation();
										setActivePin(null);
									}}
								>
									Done
								</button>
								<div className="flex gap-2">
									<button
										className="rounded-md px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200"
										onClick={(e) => {
											e.stopPropagation();
											setIsEditing(true);
										}}
									>
										Edit
									</button>
									<button
										className="rounded-md px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200 hover:shadow-md"
										onClick={(e) => {
											e.stopPropagation();
											setShowEmoji(true);
											setSelectedEmojiReactions(
												emojiReactions[activePin] || []
											);
										}}
									>
										React
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const EmojiBottomSheet = ({
	showEmoji,
	setShowEmoji,
	selectedEmojiReactions,
	handleEmojiReaction,
	darkMode,
}: EmojiBottomSheetProps) => (
	<div
		className="fixed inset-0 z-40 bg-black/40 flex items-end"
		onClick={() => setShowEmoji(false)}
	>
		<div
			className={`w-full ${
				darkMode ? "bg-[#142e4e]" : "bg-white"
			} rounded-t-2xl py-4 px-6 shadow-lg min-h-[120px] transition-all duration-300`}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex items-center justify-center gap-1 sm:gap-3 mb-3">
				{["👍", "🎉", "🔥", "😕", "❤️", "🚀", "😄"].map((emoji) => (
					<button
						key={emoji}
						className={`text-lg sm:text-2xl px-2 sm:px-3 py-1 sm:py-2 rounded-full transition ${
							selectedEmojiReactions.includes(emoji)
								? "bg-blue-100 dark:bg-blue-800 scale-115"
								: "hover:scale-125"
						}`}
						onClick={() => handleEmojiReaction(emoji)}
					>
						{emoji}
					</button>
				))}
			</div>
			<div
				className={`text-center text-sm ${
					darkMode ? "text-blue-200" : "text-blue-700"
				}`}
			>
				Tap an emoji to react!
			</div>
			<div className="flex justify-center mt-4">
				<button
					className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
					onClick={() => setShowEmoji(false)}
				>
					Done
				</button>
			</div>
		</div>
	</div>
);

const TextSelectionToolbar = ({
	showToolbar,
	toolbarPos,
	highlightedText,
	setShowToolbar,
	setShowDiffModal,
	setDiffContent,
}: TextSelectionToolbarProps) => {
	const selection = window.getSelection();
	let lineNumber: number | undefined = undefined;

	if (selection && selection.anchorNode) {
		let element = selection.anchorNode.parentElement;
		while (element && !element.classList.contains("group")) {
			element = element.parentElement;
		}

		if (element) {
			const lineEl = element.querySelector('[class*="text-right"]');
			if (lineEl && lineEl.textContent) {
				lineNumber = parseInt(lineEl.textContent) - 1;
			}
		}
	}

	return (
		<div
			className="fixed z-50 pointer-events-none"
			style={{
				top: `${toolbarPos.top}px`,
				left: `${toolbarPos.left}px`,
			}}
		>
			<div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg animate-scaleIn overflow-hidden flex flex-col w-64 pointer-events-auto transform -translate-x-1/2">
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-blue-100"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
						<span className="font-medium text-sm">Compare Selection</span>
					</div>
					<button
						className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
						onClick={() => setShowToolbar(false)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<div className="p-3">
					<button
						className="w-full py-2.5 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
						onClick={() => {
							setDiffContent({
								text: highlightedText,
								lineNumber: lineNumber,
							});
							setShowDiffModal(true);
							setShowToolbar(false);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
						</svg>
						Compare
					</button>
				</div>
			</div>
		</div>
	);
};

const DiffModal = ({
	showDiffModal,
	setShowDiffModal,
	diffContent,
	darkMode,
	diffLines,
}: DiffModalProps) => {
	if (!showDiffModal) return null;

	const lineNum = diffContent.lineNumber;

	const diffLine =
		lineNum !== undefined
			? diffLines.find((line: DiffLine) => line.lineNumber === lineNum)
			: null;

	return (
		<div
			className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
			onClick={() => setShowDiffModal(false)}
		>
			<div
				className={`${
					darkMode ? "bg-[#1a2b42]" : "bg-white"
				} rounded-xl shadow-xl max-w-xl w-full mx-4 overflow-hidden`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="bg-blue-600 text-white p-3 flex items-center justify-between">
					<div className="font-semibold flex items-center gap-2">
						<span className="text-lg">🔍</span>
						<span>Code Comparison</span>
						{diffContent.lineNumber !== undefined && (
							<span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">
								line {diffContent.lineNumber + 1}
							</span>
						)}
					</div>
					<button
						className="text-white hover:bg-blue-500 rounded-full p-1"
						onClick={() => setShowDiffModal(false)}
					>
						✕
					</button>
				</div>

				<div className="p-4 flex flex-col gap-4">
					<div>
						<div className="text-xs mb-1 font-semibold text-blue-500 flex items-center gap-2">
							<div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
								−
							</div>
							OLD
						</div>
						<div
							className={`p-3 rounded font-mono text-sm ${
								darkMode
									? "bg-[#0a1d2e] text-gray-200"
									: "bg-gray-50 text-gray-800"
							}`}
						>
							{diffLine
								? diffLine.old || (
										<span className="text-gray-400 italic">Empty line</span>
								  )
								: diffContent.text || (
										<span className="text-gray-400 italic">No content</span>
								  )}
						</div>
					</div>

					<div>
						<div className="text-xs mb-1 font-semibold text-blue-500 flex items-center gap-2">
							<div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
								+
							</div>
							NEW
						</div>
						<div
							className={`p-3 rounded font-mono text-sm ${
								diffLine
									? diffLine.type === "added"
										? darkMode
											? "bg-[#132e20] text-green-300"
											: "bg-green-50 text-green-800"
										: diffLine.type === "deleted"
										? darkMode
											? "bg-[#2e1320] text-red-300"
											: "bg-red-50 text-red-800"
										: diffLine.type === "changed"
										? darkMode
											? "bg-[#11294b] text-blue-300"
											: "bg-blue-50 text-blue-800"
										: darkMode
										? "bg-[#0a1d2e] text-gray-200"
										: "bg-gray-50 text-gray-800"
									: darkMode
									? "bg-[#0a1d2e] text-gray-200"
									: "bg-gray-50 text-gray-800"
							}`}
						>
							{diffLine
								? diffLine.new || (
										<span className="text-gray-400 italic">Empty line</span>
								  )
								: diffContent.text || (
										<span className="text-gray-400 italic">No content</span>
								  )}
						</div>
					</div>
				</div>

				<div className="p-3 border-t flex justify-end gap-2">
					<button
						className={`px-4 py-2 rounded-md ${
							darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
						}`}
						onClick={() => setShowDiffModal(false)}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

const getDiffLines = (oldArr: string[], newArr: string[]) => {
	const maxLen = Math.max(oldArr.length, newArr.length);
	let lines: DiffLine[] = [];

	for (let i = 0; i < maxLen; ++i) {
		let type: "unchanged" | "changed" | "added" | "deleted" = "unchanged";

		if (!oldArr[i] && newArr[i]) {
			type = "added";
		} else if (oldArr[i] && !newArr[i]) {
			type = "deleted";
		} else if (oldArr[i] !== newArr[i]) {
			type = "changed";
		}

		lines.push({
			old: oldArr[i] ?? "",
			new: newArr[i] ?? "",
			lineNumber: i,
			type,
		});
	}
	return lines;
};

export default function CodeDifferenceExport() {
	const oldCode = [
		"function helloWorld() {",
		"  console.log('Hello, world!');",
		"}",
		"",
		"// TODO: add more logic",
		"",
		"export default helloWorld;",
		"",
		"// End of file",
		"",
		"// Commented line",
		"let unusedVar = 42;",
		"//",
		"// Some more dummy lines to simulate a big file",
		...Array.from({ length: 100 }, (_, i) => `// Dummy line ${i + 1}`),
	];

	const newCode = [
		"function helloWorld() {",
		"  console.log('Hello, world! 🌍');",
		"  // Added comment",
		"}",
		"",
		"// TODO: add more logic",
		"",
		"export default helloWorld;",
		"",
		"// End of file.",
		"",
		"",
		"let unusedVar = 43;",
		"//",
		"// Some more dummy lines to simulate a big file",
		...Array.from({ length: 100 }, (_, i) => `// Dummy line ${i + 1}`),
	];

	const [commentPins, setCommentPins] = useState<CommentPin>({
		2: "Should we revisit this?",
		10: "Unused variable. Remove?",
		90: "Check for performance impact.",
	});

	const [split, setSplit] = useState(50);
	const [dragging, setDragging] = useState(false);
	const [activePin, setActivePin] = useState<number | null>(null);
	const [swiped, setSwiped] = useState(false);
	const [rejected, setRejected] = useState(false);
	const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
	const [showEmoji, setShowEmoji] = useState(false);
	const [selectedEmojiReactions, setSelectedEmojiReactions] = useState<
		string[]
	>([]);
	const [showToolbar, setShowToolbar] = useState(false);
	const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
	const [highlightedText, setHighlightedText] = useState("");
	const [compareMessage, setCompareMessage] = useState<string | null>(null);
	const [scrollRatio, setScrollRatio] = useState(0);
	const [visibleRange, setVisibleRange] = useState([0, 40]);
	const [darkMode, setDarkMode] = useState(false);
	const [showDiffModal, setShowDiffModal] = useState(false);
	const [diffContent, setDiffContent] = useState<{
		text: string;
		lineNumber?: number;
	}>({ text: "" });
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const lineHeight = 28;

	const diffLines = getDiffLines(oldCode, newCode);

	const [emojiReactionsByLine, setEmojiReactionsByLine] =
		useState<EmojiReactions>({
			2: ["👍", "🔥"],
			10: ["😕"],
		});

	useEffect(() => {
		if (activePin !== null) {
			setSelectedEmojiReactions(emojiReactionsByLine[activePin] || []);
		} else {
			setSelectedEmojiReactions([]);
		}
	}, [activePin, emojiReactionsByLine]);

	useEffect(() => {
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		setDarkMode(prefersDark);

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	useEffect(() => {
		function onMove(e: MouseEvent | TouchEvent) {
			if (!dragging) return;

			const clientX =
				"touches" in e && e.touches.length
					? e.touches[0].clientX
					: (e as MouseEvent).clientX;

			const container = containerRef.current;
			if (!container) return;

			const rect = container.getBoundingClientRect();
			let percent = ((clientX - rect.left) / rect.width) * 100;
			percent = Math.max(25, Math.min(75, percent));
			setSplit(percent);
		}

		function onUp() {
			setDragging(false);
		}

		if (dragging) {
			window.addEventListener("mousemove", onMove);
			window.addEventListener("touchmove", onMove);
			window.addEventListener("mouseup", onUp);
			window.addEventListener("touchend", onUp);
		}

		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("mouseup", onUp);
			window.removeEventListener("touchend", onUp);
		};
	}, [dragging]);

	const handleScroll = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;

		const scrollTop = el.scrollTop;
		const visibleHeight = el.clientHeight;
		const totalHeight = el.scrollHeight;

		const visibleLines = Math.ceil(visibleHeight / lineHeight);
		const edgeBuffer = Math.ceil(visibleLines * 1.5);
		const start = Math.max(0, Math.floor(scrollTop / lineHeight) - edgeBuffer);
		const end = Math.min(diffLines.length, start + visibleLines + edgeBuffer);

		setVisibleRange([start, end]);
		const ratio = scrollTop / (totalHeight - visibleHeight || 1);
		setScrollRatio(ratio);
	}, [diffLines.length, lineHeight]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		handleScroll();
		el.addEventListener("scroll", handleScroll);

		return () => {
			el.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	const handleSelection = useCallback(() => {
		setTimeout(() => {
			const selection = window.getSelection();
			const text = selection?.toString();

			if (text && text.trim().length > 0 && selection) {
				try {
					const range = selection.getRangeAt(0);

					let node = selection.anchorNode;
					let isCodeLine = false;
					let isLineNumber = false;

					while (node && node instanceof Node) {
						if (node instanceof Element) {
							if (
								node.classList.contains("fixed") ||
								node.classList.contains("sticky") ||
								node.tagName === "BUTTON" ||
								node.tagName === "HEADER" ||
								(node.classList.contains("w-8") &&
									node.classList.contains("text-right"))
							) {
								isLineNumber = true;
								break;
							}

							if (
								node.classList.contains("group") &&
								node.classList.contains("flex") &&
								node.classList.contains("items-start")
							) {
								isCodeLine = true;
								break;
							}
						}

						node = node.parentNode;
					}

					if (isCodeLine && !isLineNumber) {
						const rect = range.getBoundingClientRect();

						setToolbarPos({
							top: rect.bottom + window.scrollY + 10,
							left: rect.right + window.scrollX,
						});

						setShowToolbar(true);
						setHighlightedText(text);
					} else {
						setShowToolbar(false);
						setHighlightedText("");
					}
				} catch (error: unknown) {
					setShowToolbar(false);
				}
			} else {
				setShowToolbar(false);
				setHighlightedText("");
			}
		}, 10);
	}, []);

	useEffect(() => {
		document.addEventListener("selectionchange", handleSelection);
		return () => {
			document.removeEventListener("selectionchange", handleSelection);
		};
	}, [handleSelection]);

	const handleTouchStart = (e: React.TouchEvent) => {
		setSwipeStartX(e.touches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (swipeStartX !== null) {
			const dx = e.touches[0].clientX - swipeStartX;
			if (dx > 80) {
				setSwiped(true);
				setRejected(false);
				setShowApproveModal(true);
				setSwipeStartX(null);
			}
		}
	};

	const handleTouchEnd = () => {
		setSwipeStartX(null);
	};

	const handleEmojiReaction = (emoji: string) => {
		setSelectedEmojiReactions((prev) =>
			prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
		);

		if (activePin !== null) {
			setEmojiReactionsByLine((prev) => {
				const currentEmojis = prev[activePin] || [];
				const newEmojis = currentEmojis.includes(emoji)
					? currentEmojis.filter((e) => e !== emoji)
					: [...currentEmojis, emoji];

				return {
					...prev,
					[activePin]: newEmojis,
				};
			});
		}
	};

	const isMobileDevice = () => {
		return (
			(typeof window !== "undefined" && window.innerWidth < 768) ||
			(typeof navigator !== "undefined" &&
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				))
		);
	};

	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth < 768 && split === 50) {
				setSplit(45);
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div
			className={`min-h-dvh ${
				darkMode ? "bg-[#0a1d2e]" : "bg-white"
			} text-sm transition-colors duration-300 flex flex-col`}
		>
			<Header
				darkMode={darkMode}
				setDarkMode={setDarkMode}
				swiped={swiped}
				setSwiped={setSwiped}
				rejected={rejected}
				setRejected={setRejected}
				scrollRatio={scrollRatio}
				setShowApproveModal={setShowApproveModal}
				setShowRejectModal={setShowRejectModal}
			/>

			<div
				ref={containerRef}
				className="relative flex overflow-auto flex-1 h-[calc(100dvh-96px)] md:h-[calc(100vh-96px)] transition-colors duration-300"
				style={{
					WebkitOverflowScrolling: "touch",
					background: darkMode ? "#081624" : "#f6fafd",
					scrollbarWidth: "thin",
					scrollbarColor: darkMode ? "#2b4470 #081624" : "#b5cdf2 #f6fafd",
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div
					className={`flex flex-col transition-all duration-150 ease-in-out border-r ${
						darkMode ? "border-[#2b4470]" : "border-blue-200"
					} ${darkMode ? "text-white" : "text-[#0a1d2e]"}`}
					style={{
						width: isMobile ? `${split}%` : `${split}%`,
						minWidth: isMobile ? "40%" : "90px",
						background: darkMode ? "#0a1d2e" : "#fff",
					}}
				>
					<div className="sticky top-0 z-10 px-3 pb-1 pt-2 font-semibold text-xs text-blue-400 flex justify-between items-center backdrop-blur-sm bg-opacity-80 bg-inherit">
						<div className="flex items-center">
							<span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-[10px] mr-1">
								OLD
							</span>
							<span className="hidden sm:inline">CODE</span>
						</div>
						<span className="text-xs opacity-60">{oldCode.length} lines</span>
					</div>
					<div className="flex-1 relative">
						<div style={{ height: visibleRange[0] * lineHeight }} />
						{diffLines.slice(visibleRange[0], visibleRange[1]).map((line) => (
							<LineView
								key={line.lineNumber + "-old"}
								line={line}
								commentPins={commentPins}
								setActivePin={setActivePin}
								lineHeight={lineHeight}
								darkMode={darkMode}
								isOld={true}
								emojiReactions={emojiReactionsByLine}
								setShowDiffModal={setShowDiffModal}
								setDiffContent={setDiffContent}
							/>
						))}
						<div
							style={{
								height: (diffLines.length - visibleRange[1]) * lineHeight,
							}}
						/>
					</div>
				</div>

				<div
					className="relative cursor-ew-resize z-10 touch-manipulation"
					style={{
						width: isMobile ? 8 : 12,
						marginLeft: isMobile ? -4 : -6,
						marginRight: isMobile ? -4 : -6,
						touchAction: "none",
						background: darkMode
							? "linear-gradient(90deg, #0a1d2e 25%, #2b4470 50%, #0a1d2e 75%)"
							: "linear-gradient(90deg, #eaf3fa 25%, #b5cdf2 50%, #eaf3fa 75%)",
					}}
					onMouseDown={() => setDragging(true)}
					onTouchStart={() => setDragging(true)}
					title="Drag to resize"
				>
					<div
						className={`absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full ${
							darkMode ? "bg-blue-500" : "bg-blue-200"
						}`}
					/>
				</div>

				<div
					className={`flex flex-col transition-all duration-150 ease-in-out ${
						darkMode ? "text-white" : "text-[#0a1d2e]"
					}`}
					style={{
						width: isMobile ? `${100 - split}%` : `${100 - split}%`,
						minWidth: isMobile ? "40%" : "90px",
						background: darkMode ? "#0a1d2e" : "#fff",
					}}
				>
					<div className="sticky top-0 z-10 px-3 pb-1 pt-2 font-semibold text-xs text-blue-400 flex justify-between items-center backdrop-blur-sm bg-opacity-80 bg-inherit">
						<div className="flex items-center">
							<span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] mr-1">
								NEW
							</span>
							<span className="hidden sm:inline">CODE</span>
						</div>
						<span className="text-xs opacity-60">{newCode.length} lines</span>
					</div>
					<div className="flex-1 relative">
						<div style={{ height: visibleRange[0] * lineHeight }} />
						{diffLines.slice(visibleRange[0], visibleRange[1]).map((line) => (
							<LineView
								key={line.lineNumber + "-new"}
								line={line}
								commentPins={commentPins}
								setActivePin={setActivePin}
								lineHeight={lineHeight}
								darkMode={darkMode}
								isOld={false}
								emojiReactions={emojiReactionsByLine}
								setShowDiffModal={setShowDiffModal}
								setDiffContent={setDiffContent}
							/>
						))}
						<div
							style={{
								height: (diffLines.length - visibleRange[1]) * lineHeight,
							}}
						/>
					</div>
				</div>
			</div>

			<Footer darkMode={darkMode} />

			{activePin !== null && (
				<AnnotationModal
					activePin={activePin}
					setActivePin={setActivePin}
					commentPins={commentPins}
					setCommentPins={setCommentPins}
					emojiReactions={emojiReactionsByLine}
					setEmojiReactionsByLine={setEmojiReactionsByLine}
					setSelectedEmojiReactions={setSelectedEmojiReactions}
					setShowEmoji={setShowEmoji}
					darkMode={darkMode}
				/>
			)}

			{showEmoji && (
				<EmojiBottomSheet
					showEmoji={showEmoji}
					setShowEmoji={(show) => {
						setShowEmoji(show);
						if (!show && activePin !== null) {
							setEmojiReactionsByLine((prev) => ({
								...prev,
								[activePin]: selectedEmojiReactions,
							}));
						}
					}}
					selectedEmojiReactions={selectedEmojiReactions}
					handleEmojiReaction={handleEmojiReaction}
					darkMode={darkMode}
				/>
			)}

			{showToolbar && (
				<TextSelectionToolbar
					showToolbar={showToolbar}
					toolbarPos={toolbarPos}
					highlightedText={highlightedText}
					setShowToolbar={setShowToolbar}
					setShowDiffModal={setShowDiffModal}
					setDiffContent={setDiffContent}
				/>
			)}

			{compareMessage && (
				<div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fadein">
					<div className="flex items-center gap-2">
						<span className="text-lg">🔍</span>
						<span>{compareMessage}</span>
						<button
							className="ml-2 text-blue-200 hover:text-white"
							onClick={() => setCompareMessage(null)}
						>
							✕
						</button>
					</div>
				</div>
			)}

			{isMobile && (
				<div className="fixed right-4 bottom-20 z-30 flex flex-col gap-2">
					<button
						className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-blue-500 text-white"
						onClick={() => setSplit(40)}
						title="Focus on old code"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
					</button>
					<button
						className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-blue-600 text-white"
						onClick={() => setSplit(50)}
						title="Equal split"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<line x1="12" y1="3" x2="12" y2="21"></line>
						</svg>
					</button>
					<button
						className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-green-500 text-white"
						onClick={() => setSplit(60)}
						title="Focus on new code"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="5" y1="12" x2="19" y2="12"></line>
							<polyline points="12 5 19 12 12 19"></polyline>
						</svg>
					</button>
				</div>
			)}

			{!swiped && (
				<div className="fixed left-2 bottom-20 z-30 md:hidden">
					<div className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg text-xs animate-pulse">
						<span className="mr-2">👉 Swipe right to approve</span>
					</div>
				</div>
			)}

			{swiped && showApproveModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-xs w-full transform scale-100 animate-fadeIn overflow-hidden">
						<div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
							<div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
								<span className="text-green-600 dark:text-green-300 text-lg">
									✓
								</span>
							</div>
							<h3 className="font-medium text-gray-800 dark:text-white">
								Diff Approved
							</h3>
							<button
								onClick={() => setShowApproveModal(false)}
								className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
								aria-label="Close notification"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>
						<div className="p-5 text-center">
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
								Changes have been accepted and will be merged.
							</p>
							<button
								onClick={() => setShowApproveModal(false)}
								className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
							>
								Got it
							</button>
						</div>
					</div>
				</div>
			)}

			{rejected && showRejectModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-xs w-full transform scale-100 animate-fadeIn overflow-hidden">
						<div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
							<div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0">
								<span className="text-red-600 dark:text-red-300 text-lg">
									✕
								</span>
							</div>
							<h3 className="font-medium text-gray-800 dark:text-white">
								Diff Rejected
							</h3>
							<button
								onClick={() => setShowRejectModal(false)}
								className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
								aria-label="Close notification"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>
						<div className="p-5 text-center">
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
								Please review the feedback and make necessary adjustments.
							</p>
							<button
								onClick={() => setShowRejectModal(false)}
								className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
							>
								Got it
							</button>
						</div>
					</div>
				</div>
			)}

			<DiffModal
				showDiffModal={showDiffModal}
				setShowDiffModal={setShowDiffModal}
				diffContent={diffContent}
				darkMode={darkMode}
				diffLines={diffLines}
			/>

			<style jsx global>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: scale(0.95);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.25s ease-out forwards;
				}

				@keyframes scaleIn {
					from {
						opacity: 0;
						transform: scale(0.9);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				.animate-scaleIn {
					animation: scaleIn 0.2s ease-out forwards;
				}

				::-webkit-scrollbar {
					width: 8px;
					height: 8px;
				}
				::-webkit-scrollbar-track {
					background: ${darkMode ? "#081624" : "#f6fafd"};
				}
				::-webkit-scrollbar-thumb {
					background: ${darkMode ? "#2b4470" : "#b5cdf2"};
					border-radius: 4px;
				}
				::-webkit-scrollbar-thumb:hover {
					background: ${darkMode ? "#3a5a94" : "#84a8e0"};
				}
			`}</style>
		</div>
	);
}
