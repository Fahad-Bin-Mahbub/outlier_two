"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
	FiChevronDown,
	FiChevronLeft,
	FiClipboard,
	FiBook,
	FiZap,
	FiGitBranch,
	FiClock,
	FiChevronRight,
	FiDownload,
	FiFileText,
	FiUsers,
	FiThumbsUp,
	FiHeart,
	FiSmile,
	FiMessageSquare,
	FiRefreshCw,
	FiPlus,
	FiBold,
	FiItalic,
	FiUnderline,
	FiPlay,
	FiEdit,
	FiCode,
	FiX,
	FiInfo,
	FiClock as FiClockCircle,
	FiMenu,
	FiSave,
} from "react-icons/fi";
import Head from "next/head";

const showToast = (message: string, type: "success" | "error" = "success") => {
	const toast = document.createElement("div");
	toast.className = `transition-all duration-300 fixed top-4 px-6 py-3 rounded-lg text-white z-[60] shadow-lg backdrop-blur-sm border font-medium text-center ${
		type === "success"
			? "bg-blue-500/90 border-blue-400/50"
			: "bg-red-500/90 border-red-400/50"
	}`;
	toast.textContent = message;

	toast.style.position = "fixed";
	toast.style.top = "1rem";
	toast.style.left = "50%";
	toast.style.transform = "translateX(-50%) translateY(-100%)";
	toast.style.maxWidth = "90vw";
	toast.style.wordBreak = "break-word";
	toast.style.whiteSpace = "nowrap";
	toast.style.opacity = "0";

	document.body.appendChild(toast);
	setTimeout(() => {
		toast.classList.add("toast-slide-in");
	}, 10);

	setTimeout(() => {
		toast.classList.add("toast-slide-out");
		setTimeout(() => {
			if (toast.parentNode) {
				toast.remove();
			}
		}, 300);
	}, 3000);
};

interface Player {
	id: number;
	name: string;
	contributionCount: number;
}

interface PlotTwist {
	id: string;
	suggestion: string;
	votes: number[];
	submittedBy: number;
	isApplied?: boolean;
}

interface StorySegment {
	id: string;
	content: string;
	author: Player;
	timestamp: Date;
	reactions: { [emoji: string]: string[] };
	gifReactions: { [gifUrl: string]: number[] };
	votes: { up: string[]; down: string[] };
	isPlotTwist?: boolean;
	branchPoint?: boolean;
	x?: number;
	y?: number;
	formatting?: {
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
	};
}

interface StoryBranch {
	id: string;
	title: string;
	segments: StorySegment[];
	parentBranchId?: string;
	isActive: boolean;
	createdBy: number;
	createdAt: Date;
	color: string;
	x?: number;
	y?: number;
}

const REACTION_GIFS = [
	{
		name: "sparkle",
		gifUrl:
			"https://cdn.pixabay.com/animation/2025/05/19/00/14/00-14-39-779_512.gif",
		label: "Sparkle",
	},
	{
		name: "celebrate",
		gifUrl:
			"https://cdn.pixabay.com/animation/2024/07/08/23/37/23-37-00-615_512.gif",
		label: "Celebrate",
	},
	{
		name: "amazing",
		gifUrl:
			"https://cdn.pixabay.com/animation/2023/04/16/16/18/16-18-04-472_512.gif",
		label: "Amazing",
	},
	{
		name: "awesome",
		gifUrl:
			"https://cdn.pixabay.com/animation/2025/06/14/19/01/19-01-51-889_512.gif",
		label: "Awesome",
	},
];

const PLOT_TWIST_SUGGESTIONS = [
	"Everything was just a dream... or was it?",
	"A magical portal opens to another world",
	"Time starts moving backwards",
	"The animals start talking",
	"A hidden treasure is discovered",
	"A long-lost relative appears",
];

export default function StoryCreatorExport() {
	const [players, setPlayers] = useState<Player[]>([
		{ id: 1, name: "Luna", contributionCount: 0 },
		{ id: 2, name: "Max", contributionCount: 0 },
		{ id: 3, name: "Zoe", contributionCount: 0 },
		{ id: 4, name: "Alex", contributionCount: 0 },
		{ id: 5, name: "John", contributionCount: 0 },
	]);

	const [currentPlayerId] = useState(1);
	const [isUserTurn, setIsUserTurn] = useState(true);
	const [writingPlayerId, setWritingPlayerId] = useState<number | null>(null);
	const [isWaitingForOthers, setIsWaitingForOthers] = useState(false);
	const [writingProgress, setWritingProgress] = useState(0);
	const [branches, setBranches] = useState<StoryBranch[]>([
		{
			id: "main",
			title: "The Great Adventure",
			isActive: true,
			createdBy: 0,
			createdAt: new Date(),
			color: "#4B352A",
			x: 50,
			y: 20,
			segments: [
				{
					id: "intro",
					content:
						"Once upon a time, in a magical kingdom where rainbow bridges connected floating islands in the sky, there lived a brave young adventurer who was about to discover the most amazing secret of their life...",
					author: {
						id: 0,
						name: "Story Narrator",
						contributionCount: 0,
					},
					timestamp: new Date(),
					reactions: {},
					gifReactions: {},
					votes: { up: [], down: [] },
					branchPoint: true,
					x: 50,
					y: 20,
				},
			],
		},
	]);

	const [activeBranchId, setActiveBranchId] = useState("main");
	const [currentSegment, setCurrentSegment] = useState("");
	const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState("");
	const [showHistory, setShowHistory] = useState(false);
	const [showBranchView, setShowBranchView] = useState(false);
	const [showGifReactions, setShowGifReactions] = useState<string | null>(null);
	const [wordCount, setWordCount] = useState(0);
	const [characterCount, setCharacterCount] = useState(0);
	const [showPlotTwistVoting, setShowPlotTwistVoting] = useState(false);
	const [showAddPlotTwistModal, setShowAddPlotTwistModal] = useState(false);
	const [newTwistText, setNewTwistText] = useState("");

	const [plotTwists, setPlotTwists] = useState<PlotTwist[]>([]);
	const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
		null
	);
	const [isPlotTwist, setIsPlotTwist] = useState(false);
	const [branchingFromSegmentId, setBranchingFromSegmentId] = useState<
		string | null
	>(null);
	const [showCreateBranchModal, setShowCreateBranchModal] = useState(false);
	const [newBranchTitle, setNewBranchTitle] = useState("");

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const editTextareaRef = useRef<HTMLTextAreaElement>(null);
	const storyContainerRef = useRef<HTMLDivElement>(null);

	const currentPlayer =
		players.find((p) => p.id === currentPlayerId) || players[0];
	const activeBranch =
		branches.find((b) => b.id === activeBranchId) || branches[0];

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height =
				Math.min(textareaRef.current.scrollHeight, 120) + "px";
		}
	}, [currentSegment]);

	useEffect(() => {
		if (editTextareaRef.current) {
			editTextareaRef.current.style.height = "auto";
			editTextareaRef.current.style.height =
				Math.min(editTextareaRef.current.scrollHeight, 120) + "px";
		}
	}, [editingContent]);

	useEffect(() => {
		setWordCount(
			currentSegment
				.trim()
				.split(/\s+/)
				.filter((word) => word.length > 0).length
		);

		setCharacterCount(currentSegment.length);
	}, [currentSegment]);

	const scrollToBottom = useCallback(() => {
		if (storyContainerRef.current) {
			storyContainerRef.current.scrollTo({
				top: storyContainerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);

	const calculateSegmentPosition = (branchId: string, segmentIndex: number) => {
		const branch = branches.find((b) => b.id === branchId);

		if (!branch) {
			return { x: 50, y: 50 };
		}

		const baseX = 50;
		const baseY = 20 + segmentIndex * 15;

		const offsetX = Math.sin(segmentIndex * 0.5) * 20;

		return {
			x: Math.max(15, Math.min(85, baseX + offsetX)),
			y: Math.max(15, Math.min(85, baseY)),
		};
	};

	const addSegment = () => {
		if (!currentSegment.trim() || !isUserTurn) {
			return;
		}

		const segmentIndex = activeBranch.segments.length;
		const position = calculateSegmentPosition(activeBranchId, segmentIndex);

		const newSegment: StorySegment = {
			id: `segment_${Date.now()}`,
			content: currentSegment,
			author: currentPlayer,
			timestamp: new Date(),
			reactions: {},
			gifReactions: {},
			isPlotTwist: isPlotTwist,
			votes: { up: [], down: [] },
			branchPoint: true,
			x: position.x,
			y: position.y,
		};

		setIsPlotTwist(false);
		if (isPlotTwist) {
			setPlotTwists([]);
		}

		setBranches((prev) =>
			prev.map((branch) =>
				branch.id === activeBranchId
					? { ...branch, segments: [...branch.segments, newSegment] }
					: branch
			)
		);

		setPlayers((prev) =>
			prev.map((player) =>
				player.id === currentPlayerId
					? { ...player, contributionCount: player.contributionCount + 1 }
					: player
			)
		);

		setCurrentSegment("");

		setIsUserTurn(false);
		setIsWaitingForOthers(true);

		setTimeout(() => {
			scrollToBottom();
		}, 600);

		setTimeout(() => {
			startCollaborativeWriting();
		}, 1000);
	};

	const handleEditSegment = (segmentId: string) => {
		const segmentToEdit = findSegmentById(segmentId);
		if (segmentToEdit && segmentToEdit.segment) {
			setEditingSegmentId(segmentId);
			setEditingContent(segmentToEdit.segment.content);
		}
	};

	const saveEditedSegment = () => {
		if (!editingSegmentId || !editingContent.trim()) {
			return;
		}

		setBranches((prev) =>
			prev.map((branch) => ({
				...branch,
				segments: branch.segments.map((segment) =>
					segment.id === editingSegmentId
						? { ...segment, content: editingContent }
						: segment
				),
			}))
		);

		setEditingSegmentId(null);
		setEditingContent("");
		showToast("Story segment updated successfully!", "success");
	};

	const cancelEditing = () => {
		setEditingSegmentId(null);
		setEditingContent("");
	};

	const startCollaborativeWriting = () => {
		const otherPlayers = players.filter((p) => p.id !== 1);
		const randomOtherPlayers = [...otherPlayers].sort(
			() => 0.5 - Math.random()
		);
		const playersToWrite = randomOtherPlayers.slice(
			0,
			Math.min(2, randomOtherPlayers.length)
		);

		let currentWriterIndex = 0;

		const simulateNextWriter = () => {
			if (currentWriterIndex >= playersToWrite.length) {
				setWritingPlayerId(null);
				setIsWaitingForOthers(false);
				setIsUserTurn(true);
				setWritingProgress(0);
				showToast("Your turn! Continue the story...", "success");
				return;
			}

			const currentWriter = playersToWrite[currentWriterIndex];
			setWritingPlayerId(currentWriter.id);
			setWritingProgress(0);

			const typingDuration = 3000 + Math.random() * 4000;
			const progressInterval = setInterval(() => {
				setWritingProgress((prev) => {
					const newProgress = prev + 100 / (typingDuration / 100);
					return Math.min(newProgress, 95);
				});
			}, 100);

			setTimeout(() => {
				clearInterval(progressInterval);
				setWritingProgress(100);

				addSimulatedContribution(currentWriter);

				currentWriterIndex++;

				setTimeout(() => {
					simulateNextWriter();
				}, 1500);
			}, typingDuration);
		};

		setTimeout(() => {
			simulateNextWriter();
		}, 500);
	};

	const addSimulatedContribution = (player: Player) => {
		const storyPrompts = [
			"The mysterious figure stepped out from behind the ancient oak tree, their eyes glowing with an otherworldly light that seemed to pierce through the morning mist.",
			"Suddenly, the ground began to tremble beneath their feet, and strange symbols started appearing on the nearby stone walls, pulsing with magical energy.",
			"A gentle breeze carried the sound of distant music, and they realized that the melody was actually a map - each note pointing the way to their next adventure.",
			"The old key in their pocket grew warm, and when they looked down, they saw it was now made of pure crystal and humming with power.",
			"From the shadows emerged a talking fox with silver fur, who bowed gracefully and said, 'I've been waiting for you for three hundred years.'",
			"The path ahead split into three directions: one led upward into the clouds, another descended into a glowing cave, and the third seemed to shimmer like water.",
			"As they reached for the mysterious object, time seemed to slow down, and they could hear the whispers of ancient spirits offering guidance.",
			"The compass spun wildly before pointing to something that shouldn't exist - a direction that was neither north, south, east, nor west, but somewhere else entirely.",
		];

		const randomPrompt =
			storyPrompts[Math.floor(Math.random() * storyPrompts.length)];
		const segmentIndex = activeBranch.segments.length;
		const position = calculateSegmentPosition(activeBranchId, segmentIndex);

		const newSegment: StorySegment = {
			id: `segment_${Date.now()}_${player.id}`,
			content: randomPrompt,
			author: player,
			timestamp: new Date(),
			reactions: {},
			gifReactions: {},
			votes: { up: [], down: [] },
			branchPoint: true,
			x: position.x,
			y: position.y,
		};

		setBranches((prev) =>
			prev.map((branch) =>
				branch.id === activeBranchId
					? { ...branch, segments: [...branch.segments, newSegment] }
					: branch
			)
		);

		setPlayers((prev) =>
			prev.map((p) =>
				p.id === player.id
					? { ...p, contributionCount: p.contributionCount + 1 }
					: p
			)
		);

		setTimeout(() => {
			scrollToBottom();
		}, 300);
	};

	const votePlotTwist = (suggestion: string) => {
		const existingTwist = plotTwists.find((pt) => pt.suggestion === suggestion);
		if (existingTwist) {
			if (!existingTwist.votes.includes(currentPlayerId)) {
				setPlotTwists((prev) =>
					prev.map((pt) =>
						pt.id === existingTwist.id
							? {
									...pt,
									votes: [...pt.votes, currentPlayerId],
							  }
							: pt
					)
				);
				showToast("Vote added successfully!", "success");
			} else {
				showToast("You have already voted for this twist", "error");
			}
		} else {
			const newTwist: PlotTwist = {
				id: `twist_${Date.now()}`,
				suggestion,
				votes: [currentPlayerId],
				submittedBy: currentPlayerId,
			};

			setPlotTwists((prev) => [...prev, newTwist]);
			showToast("Vote added successfully!", "success");
		}
	};

	const addPlotTwist = (suggestion: string) => {
		const newTwist: PlotTwist = {
			id: `twist_${Date.now()}`,
			suggestion,
			votes: [],
			submittedBy: currentPlayerId,
		};
		PLOT_TWIST_SUGGESTIONS.push(suggestion);

		setPlotTwists((prev) => [...prev, newTwist]);
		showToast("Plot twist added successfully!", "success");
	};

	const applyPlotTwist = () => {
		if (plotTwists.length === 0) return;

		const maxVotes = Math.max(...plotTwists.map((pt) => pt.votes.length));

		const topCandidates = plotTwists.filter(
			(pt) => pt.votes.length === maxVotes
		);

		const chosen =
			topCandidates[Math.floor(Math.random() * topCandidates.length)];

		setCurrentSegment(chosen.suggestion + " ");
		setPlotTwists((prev) =>
			prev.map((pt) => (pt.id === chosen.id ? { ...pt, isApplied: true } : pt))
		);
		setShowPlotTwistVoting(false);
		setIsPlotTwist(true);
	};

	const addGifReaction = (segmentId: string, gifName: string) => {
		setBranches((prev) =>
			prev.map((branch) => ({
				...branch,
				segments: branch.segments.map((segment) => {
					if (segment.id === segmentId) {
						const gifReactions = { ...segment.gifReactions };
						if (!gifReactions[gifName]) gifReactions[gifName] = [];

						const playerIndex = gifReactions[gifName].indexOf(currentPlayerId);
						if (playerIndex > -1) {
							gifReactions[gifName] = gifReactions[gifName].filter(
								(id) => id !== currentPlayerId
							);
							if (gifReactions[gifName].length === 0)
								delete gifReactions[gifName];
						} else {
							gifReactions[gifName] = [
								...gifReactions[gifName],
								currentPlayerId,
							];
						}

						return { ...segment, gifReactions };
					}
					return segment;
				}),
			}))
		);
	};

	const switchBranch = (branchId: string) => {
		setActiveBranchId(branchId);
		setShowBranchView(false);
		setTimeout(scrollToBottom, 100);
	};

	const createBranchFromSegment = (segmentId: string, branchTitle: string) => {
		const sourceSegmentResult = findSegmentById(segmentId);
		if (!sourceSegmentResult) {
			showToast("Cannot find segment to branch from", "error");
			return;
		}

		const { branch: sourceBranch } = sourceSegmentResult;

		const segmentIndex = sourceBranch.segments.findIndex(
			(s) => s.id === segmentId
		);
		if (segmentIndex === -1) {
			showToast("Cannot find segment position", "error");
			return;
		}
		const newBranchId = `branch_${Date.now()}`;

		const branchSegments = sourceBranch.segments
			.slice(0, segmentIndex + 1)
			.map((s) => ({
				...s,
				id: `${newBranchId}_${s.id}`,
			}));

		const branchColors = [
			"#4B352A",
			"#1F2937",
			"#2F4858",
			"#7C3AED",
			"#059669",
			"#DC2626",
			"#EA580C",
		];
		const usedColors = branches.map((b) => b.color);
		const availableColors = branchColors.filter((c) => !usedColors.includes(c));
		const newColor =
			availableColors.length > 0
				? availableColors[0]
				: branchColors[Math.floor(Math.random() * branchColors.length)];

		const newBranch: StoryBranch = {
			id: newBranchId,
			title: branchTitle.trim() || `Alternative Path ${branches.length}`,
			segments: branchSegments,
			parentBranchId: sourceBranch.id,
			isActive: true,
			createdBy: currentPlayerId,
			createdAt: new Date(),
			color: newColor,
			x: 50 + ((branches.length * 15) % 40),
			y: 30 + ((branches.length * 10) % 30),
		};

		setBranches((prev) => [...prev, newBranch]);
		setActiveBranchId(newBranchId);
		setShowCreateBranchModal(false);
		setBranchingFromSegmentId(null);
		setNewBranchTitle("");

		showToast(
			`New branch "${newBranch.title}" created! Continue the alternative story...`,
			"success"
		);
	};

	const handleCreateAlternative = (segmentId: string) => {
		setBranchingFromSegmentId(segmentId);
		setShowCreateBranchModal(true);
	};

	const applyFormatting = (format: "bold" | "italic" | "underline") => {
		const textarea = editingSegmentId
			? editTextareaRef.current
			: textareaRef.current;
		if (!textarea) {
			return;
		}

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = textarea.value.substring(start, end);

		if (selectedText) {
			let prefix = "";
			let suffix = "";

			switch (format) {
				case "bold":
					prefix = "**";
					suffix = "**";
					break;
				case "italic":
					prefix = "*";
					suffix = "*";
					break;
				case "underline":
					prefix = "__";
					suffix = "__";
					break;
			}

			const formattedText = prefix + selectedText + suffix;
			const newText =
				textarea.value.substring(0, start) +
				formattedText +
				textarea.value.substring(end);

			if (editingSegmentId) {
				setEditingContent(newText);
			} else {
				setCurrentSegment(newText);
			}

			setTimeout(() => {
				textarea.focus();
				const newCursorPos = start + formattedText.length;
				textarea.setSelectionRange(newCursorPos, newCursorPos);
			}, 0);
		}
	};

	const renderFormattedText = (text: string) => {
		return text
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>")
			.replace(/__(.*?)__/g, "<u>$1</u>");
	};

	const [menuOpen, setMenuOpen] = useState(false);

	const exportStory = (format: "txt" | "html" | "pdf" = "txt") => {
		const title = activeBranch.title;
		const createdAt = activeBranch.createdAt.toLocaleDateString();
		const segmentCount = activeBranch.segments.length;

		const plainText = [
			`${title}`,
			`Created: ${createdAt}`,
			`Total Segments: ${segmentCount}`,
			"",
			...activeBranch.segments.map(
				(segment, index) =>
					`${index + 1}. ${
						segment.author.name
					} (${segment.timestamp.toLocaleString()}):\n${segment.content}\n`
			),
		].join("\n");

		const htmlContent = `
      <html>
        <head>
          <title>${title}</title>
          <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Lora', serif; line-height: 1.5;">
          <h1>${title}</h1>
          <p><strong>Created:</strong> ${createdAt}</p>
          <p><strong>Total Segments:</strong> ${segmentCount}</p>
          <hr />
          ${activeBranch.segments
						.map(
							(segment, index) => `
              <div style="margin-bottom: 16px;">
                <strong>${index + 1}. ${segment.author.name}</strong> 
                <em>(${segment.timestamp.toLocaleString()})</em><br/>
                <p>${segment.content}</p>
              </div>
            `
						)
						.join("")}
        </body>
      </html>
    `;

		if (format === "txt") {
			const blob = new Blob([plainText], { type: "text/plain" });
			triggerDownload(blob, `${title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`);
		} else if (format === "html") {
			const blob = new Blob([htmlContent], { type: "text/html" });
			triggerDownload(blob, `${title.replace(/[^a-zA-Z0-9]/g, "_")}.html`);
		} else if (format === "pdf") {
			const printHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
            <style>
              @page {
                margin: 1in;
                size: A4;
              }
              body {
                font-family: "Lora", serif;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
                margin: 0;
                padding: 0;
              }
              h1 {
                color: #2c3e50;
                border-bottom: 3px solid #3498db;
                padding-bottom: 10px;
                margin-bottom: 30px;
                font-size: 28px;
              }
              .story-info {
                background: #f8f9fa;
                padding: 15px;
                border-left: 4px solid #3498db;
                margin-bottom: 30px;
                border-radius: 4px;
              }
              .segment {
                margin-bottom: 25px;
                padding: 15px;
                border-radius: 8px;
                background: #fdfdfd;
                border: 1px solid #e9ecef;
              }
              .segment-header {
                font-weight: bold;
                color: #495057;
                margin-bottom: 10px;
                font-size: 14px;
              }
              .segment-content {
                font-size: 16px;
                line-height: 1.8;
                text-align: justify;
              }
              .page-break {
                page-break-before: always;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="story-info">
              <p><strong>Created:</strong> ${createdAt}</p>
              <p><strong>Total Segments:</strong> ${segmentCount}</p>
              <p><strong>Authors:</strong> ${[
								...new Set(activeBranch.segments.map((s) => s.author.name)),
							].join(", ")}</p>
            </div>
            
            ${activeBranch.segments
							.map(
								(segment, index) => `
                <div class="segment${
									index > 0 && index % 3 === 0 ? " page-break" : ""
								}">
                  <div class="segment-header">
                    ${index + 1}. ${
									segment.author.name
								} • ${segment.timestamp.toLocaleString()}
                  </div>
                  <div class="segment-content">
                    ${segment.content
											.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
											.replace(/\*(.*?)\*/g, "<em>$1</em>")
											.replace(/__(.*?)__/g, "<u>$1</u>")}
                  </div>
                </div>
              `
							)
							.join("")}
          </body>
        </html>
      `;

			const printWindow = window.open("", "_blank");
			if (printWindow) {
				printWindow.document.write(printHtml);
				printWindow.document.close();

				printWindow.onload = () => {
					setTimeout(() => {
						printWindow.print();

						printWindow.onafterprint = () => printWindow.close();
					}, 500);
				};
			} else {
				const blob = new Blob([printHtml], { type: "text/html" });
				triggerDownload(
					blob,
					`${title.replace(/[^a-zA-Z0-9]/g, "_")}_printable.html`
				);
				showToast(
					"Print window blocked! Downloaded printable HTML instead. Open it and use Ctrl+P to print as PDF.",
					"error"
				);
			}
		}
	};

	const triggerDownload = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const [showExportOptions, setShowExportOptions] = useState(false);

	const getAllSegments = () => {
		return branches.flatMap((branch) =>
			branch.segments.filter(
				(segment) => segment.branchPoint && segment.x && segment.y
			)
		);
	};

	const findSegmentById = (segmentId: string) => {
		for (const branch of branches) {
			const segment = branch.segments.find((s) => s.id === segmentId);
			if (segment) {
				return { segment, branch };
			}
		}
		return null;
	};

	const handleNodeClick = (segmentId: string) => {
		setSelectedSegmentId(segmentId === selectedSegmentId ? null : segmentId);
	};

	return (
		<div className="h-full min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-yellow-50 overflow-x-hidden overflow-y-auto m-0 p-0">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<style jsx global>{`
				* {
					box-sizing: border-box;
				}

				html,
				body {
					padding: 0;
					margin: 0;
					font-family: "Lora", serif;
					touch-action: manipulation;
					overflow-x: hidden;
					width: 100%;
					height: 100%;
				}

				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: "Lora", serif;
					font-weight: 700;
				}

				p,
				span,
				div,
				button,
				input,
				textarea {
					font-family: "Lora", serif;
				}

				.segment-enter {
					animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
				}

				button,
				a {
					cursor: pointer;
					touch-action: manipulation;
					-webkit-tap-highlight-color: transparent;
				}

				@keyframes slideInUp {
					from {
						transform: translateY(40px) scale(0.95);
						opacity: 0;
					}
					to {
						transform: translateY(0) scale(1);
						opacity: 1;
					}
				}

				.branch-connection {
					stroke-dasharray: 5, 5;
					animation: dash 20s linear infinite;
				}

				@keyframes dash {
					to {
						stroke-dashoffset: -100;
					}
				}

				.node-selected {
					stroke: #f0f2bd;
					stroke-width: 3px;
				}

				.safe-area-pb {
					padding-bottom: env(safe-area-inset-bottom, 0);
				}

				::-webkit-scrollbar {
					width: 8px;
				}

				::-webkit-scrollbar-track {
					background: rgba(240, 242, 189, 0.3);
					border-radius: 10px;
				}

				::-webkit-scrollbar-thumb {
					background: #ca7842;
					border-radius: 10px;
				}

				::-webkit-scrollbar-thumb:hover {
					background: #b2cd9c;
				}

				.sidebar-scrollable {
					scrollbar-width: none;
					-ms-overflow-style: none;
				}

				.sidebar-scrollable::-webkit-scrollbar {
					display: none;
				}

				.toast-slide-in {
					transform: translateX(-50%) translateY(0) !important;
					opacity: 1 !important;
				}

				.toast-slide-out {
					transform: translateX(-50%) translateY(-100%) !important;
					opacity: 0 !important;
				}

				.sticky-left-panel {
					position: sticky;
					top: 1rem;
					height: calc(100vh - 2rem);
					overflow-y: auto;
				}

				@media (max-width: 640px) {
					.modal-container {
						padding: 0.75rem;
						max-height: 90vh;
						width: 95vw;
					}

					.modal-content {
						padding: 1rem;
						max-height: calc(90vh - 2rem);
						overflow-y: auto;
					}

					input,
					textarea,
					button {
						font-size: 16px;
					}

					.mobile-tab {
						min-width: 70px;
						text-align: center;
					}

					.mobile-fixed-bottom {
						position: fixed;
						bottom: 0;
						left: 0;
						right: 0;
						background: rgba(255, 255, 255, 0.9);
						backdrop-filter: blur(10px);
						z-index: 40;
						border-top: 1px solid rgba(0, 0, 0, 0.1);
						padding-bottom: env(safe-area-inset-bottom, 0.5rem);
					}
				}
			`}</style>

			<div className="min-h-full flex flex-col overflow-y-auto lg:overflow-auto p-2 sm:p-4 gap-2 sm:gap-4 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
				<div>
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 p-2 sm:p-4 bg-white/30 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl shadow-lg">
						<div className="flex items-center justify-between w-full md:w-auto">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100/80 backdrop-blur-sm rounded-xl border border-purple-200/60">
									<div className="text-lg sm:text-xl md:text-2xl text-purple-700">
										<FiBook />
									</div>
								</div>
								<div>
									<h1 className="text-xl md:text-3xl font-bold text-gray-800">
										Story Weavers
									</h1>
									<p className="text-sm md:text-base text-gray-600">
										Collaborative Story Adventures
									</p>
								</div>
							</div>

							<button
								className="md:hidden text-gray-700 text-2xl p-2 hover:bg-white/20 rounded-lg transition-all"
								onClick={() => setMenuOpen(!menuOpen)}
								title="Toggle Menu"
							>
								{menuOpen ? <FiX /> : <FiMenu />}
							</button>
						</div>

						<div
							className={`transition-all duration-300 ease-in-out overflow-hidden ${
								menuOpen ? "max-h-40" : "max-h-0"
							} md:max-h-none flex flex-row flex-wrap md:flex-nowrap gap-1 sm:gap-2 md:gap-4 mt-2 md:mt-0`}
						>
							<div className="flex flex-row flex-wrap gap-2 md:gap-4 mt-2 md:mt-0">
								<div className="relative group ">
									<button
										onClick={() => {
											setShowHistory((prev) => !prev);
											setMenuOpen(false);
										}}
										className="p-2 cursor-pointer text-lg md:text-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-700 hover:text-gray-900 transition-all rounded-lg border border-white/30"
									>
										<FiClock />
									</button>
									<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800/80 backdrop-blur-sm text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
										History
									</span>
								</div>

								<div className="relative group cursor-pointer">
									<button
										onClick={() => {
											setShowBranchView((prev) => !prev);
											setMenuOpen(false);
										}}
										className="p-2 cursor-pointer text-lg md:text-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-700 hover:text-gray-900 transition-all rounded-lg border border-white/30"
									>
										<FiGitBranch />
									</button>
									<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800/80 backdrop-blur-sm text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
										Branch View
									</span>
								</div>

								<div className="relative group cursor-pointer">
									<button
										onClick={() => {
											setShowExportOptions(true);
											setMenuOpen(false);
										}}
										className="p-2 cursor-pointer text-lg md:text-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-700 hover:text-gray-900 transition-all rounded-lg border border-white/30"
									>
										<FiDownload />
									</button>
									<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-800/80 backdrop-blur-sm text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
										Export
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="flex-1 flex flex-col lg:grid lg:grid-cols-4 gap-2 sm:gap-4 min-h-0 h-full pb-24 sm:pb-32 lg:pb-0">
					<div className="hidden lg:flex lg:col-span-1 flex-col gap-4 min-h-0 overflow-y-auto pr-2 border-r border-white/30 bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
						<div className="sticky-left-panel flex flex-col gap-4">
							<div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-4 flex-shrink-0">
								<h3 className="text-lg font-bold mb-3 flex items-center gap-3 text-gray-800">
									<div className="flex items-center justify-center w-8 h-8 bg-blue-100/80 backdrop-blur-sm rounded-lg border border-blue-200/60">
										<div className="text-sm text-blue-700">
											<FiPlay />
										</div>
									</div>
									{isWaitingForOthers ? "Others Writing..." : "Current Turn"}
								</h3>
								<div
									className={`p-3 rounded-2xl border-2 ${
										isUserTurn
											? "border-dashed border-blue-400 bg-blue-50/20"
											: "border-solid border-purple-400 bg-purple-50/20"
									}`}
								>
									{isUserTurn ? (
										<div className="flex items-center gap-3">
											<div>
												<div className="font-bold text-gray-800">
													{currentPlayer.name} (You)
												</div>
												<div className="text-sm font-medium text-blue-600">
													Your turn! Add to the story
												</div>
											</div>
										</div>
									) : writingPlayerId ? (
										<div className="flex items-center gap-3">
											<div className="flex-1">
												<div className="font-bold text-gray-800">
													{players.find((p) => p.id === writingPlayerId)?.name}
												</div>
												<div className="text-sm font-medium text-purple-600 flex items-center gap-2">
													<span className="animate-pulse">
														<FiEdit />
													</span>
													Writing...
												</div>
												<div className="mt-2 bg-white/40 rounded-full h-2 overflow-hidden">
													<div
														className="h-full bg-purple-500 transition-all duration-200 ease-out"
														style={{ width: `${writingProgress}%` }}
													/>
												</div>
											</div>
										</div>
									) : (
										<div className="flex items-center gap-3">
											<div>
												<div className="font-bold text-gray-800">
													Waiting for others...
												</div>
												<div className="text-sm font-medium text-blue-600">
													Other players are thinking
												</div>
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-4 flex-shrink-0">
								<div className="flex flex-col lg:flex-row items-center justify-between mb-3">
									<h3 className="text-sm lg:text-lg font-bold flex items-center gap-3 text-gray-800">
										<div className="flex items-center justify-center w-8 h-8 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-purple-200/60">
											<div className="text-sm text-purple-700">
												<FiZap />
											</div>
										</div>
										Plot Twists
									</h3>
									<div className="flex items-center gap-1">
										<button
											onClick={() =>
												setShowAddPlotTwistModal(!showAddPlotTwistModal)
											}
											className="cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl border border-purple-600 rounded-lg"
										>
											Add
										</button>
										<button
											onClick={() =>
												setShowPlotTwistVoting(!showPlotTwistVoting)
											}
											className="cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 text-sm px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium shadow-lg hover:shadow-xl border border-purple-600 rounded-lg"
										>
											Vote
										</button>
									</div>
								</div>

								{plotTwists.length > 0 && (
									<div className="space-y-2 mb-3 overflow-x-hidden">
										{plotTwists
											.filter(
												(twist) => !twist.isApplied && twist.votes.length > 0
											)
											.sort((a, b) => b.votes.length - a.votes.length)
											.map((twist) => (
												<div
													key={twist.id}
													className="p-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30"
												>
													<div className="flex justify-between items-center cursor-pointer">
														<span className="text-xs font-medium truncate max-w-[80%] text-gray-800 cursor-pointer">
															{twist.suggestion.substring(0, 25)}...
														</span>
														<span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 bg-purple-500 text-white cursor-pointer">
															{twist.votes.length}
														</span>
													</div>
												</div>
											))}
									</div>
								)}

								{plotTwists.some(
									(twist) => twist.votes.length >= Math.ceil(players.length / 2)
								) && (
									<button
										onClick={applyPlotTwist}
										className={`bg-purple-500 hover:bg-purple-600 text-white w-full text-sm py-2 rounded-lg transition-all backdrop-blur-sm ${
											isPlotTwist ? "hidden" : ""
										}`}
									>
										Apply Top Twist
									</button>
								)}
							</div>

							<div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-4 flex-shrink-0">
								<h3 className="text-sm lg:text-lg font-bold mb-3 flex items-center gap-3 text-gray-800">
									<div className="flex items-center justify-center w-8 h-8 bg-green-100/80 backdrop-blur-sm rounded-lg border border-green-200/60">
										<div className="text-sm text-green-700">
											<FiUsers />
										</div>
									</div>
									Players
								</h3>
								<div className="space-y-2">
									{players
										.sort((a, b) => b.contributionCount - a.contributionCount)
										.map((player) => (
											<div
												key={player.id}
												className={`p-2 rounded-xl ${
													player.id === currentPlayerId
														? "bg-blue-100/50 border-blue-200/50"
														: "bg-white/40"
												} backdrop-blur-sm border border-white/30 flex justify-between items-center`}
											>
												<div className="flex items-center gap-2">
													<div
														className={`w-2 h-2 rounded-full ${
															player.id === writingPlayerId
																? "bg-purple-500 animate-pulse"
																: "bg-gray-300"
														}`}
													></div>
													<span className="text-sm font-medium text-gray-800">
														{player.name}{" "}
														{player.id === currentPlayerId && "(You)"}
													</span>
												</div>
												<span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
													{player.contributionCount}
												</span>
											</div>
										))}
								</div>
							</div>

							<div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-4 flex-shrink-0">
								<h3 className="text-sm lg:text-lg font-bold mb-3 flex items-center gap-3 text-gray-800">
									<div className="flex items-center justify-center w-8 h-8 bg-amber-100/80 backdrop-blur-sm rounded-lg border border-amber-200/60">
										<div className="text-sm text-amber-700">
											<FiFileText />
										</div>
									</div>
									Story Stats
								</h3>
								<div className="space-y-1">
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Branch
										</span>
										<span className="text-xs font-bold text-gray-800">
											{activeBranch.title}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Segments
										</span>
										<span className="text-xs font-bold text-gray-800">
											{activeBranch.segments.length}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Plot Twists
										</span>
										<span className="text-xs font-bold text-gray-800">
											{
												activeBranch.segments.filter((s) => s.isPlotTwist)
													.length
											}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Created
										</span>
										<span className="text-xs font-bold text-gray-800">
											{activeBranch.createdAt.toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-4 flex-shrink-0">
								<h3 className="text-sm lg:text-lg font-bold mb-3 flex items-center gap-3 text-gray-800">
									<div className="flex items-center justify-center w-8 h-8 bg-blue-100/80 backdrop-blur-sm rounded-lg border border-blue-200/60">
										<div className="text-sm text-blue-700">
											<FiMessageSquare />
										</div>
									</div>
									Inspiration
								</h3>
								<div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
									<p className="text-sm italic text-gray-600 mb-2">
										Try adding these elements to your story:
									</p>
									<div className="space-y-1.5">
										{[
											"A mysterious artifact with unexpected powers",
											"A character revealing a hidden motivation",
											"An environmental change (storm, earthquake, magic)",
											"An unexpected ally or enemy appears",
											"A difficult choice that changes everything",
										].map((idea, index) => (
											<div key={index} className="flex items-start gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
												<p className="text-xs text-gray-700">{idea}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex-1 lg:col-span-3 flex flex-col min-h-[50vh] gap-4 overflow-hidden">
						<div className="rounded-xl sm:rounded-2xl backdrop-blur-md p-2 sm:p-4 flex-shrink-0 bg-white/30 border border-white/30">
							<div className="flex items-center justify-betweenx">
								<h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-gray-800">
									{activeBranch.title}
								</h3>
							</div>

							{branches.length > 1 && (
								<div className="space-y-2">
									<p className="text-xs text-gray-600 font-medium">
										Choose story branch:
									</p>
									<div className="flex gap-2 flex-wrap">
										{branches.map((branch) => (
											<button
												key={branch.id}
												onClick={() => switchBranch(branch.id)}
												className={`px-3 py-1 ${
													branch.id === activeBranchId
														? "text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
														: "text-gray-800 bg-white/40 hover:bg-white/80 hover:text-gray-900 cursor-pointer"
												} rounded-full text-sm font-bold transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center gap-1 hover:shadow-sm`}
												style={{
													borderLeftColor: branch.color,
													borderLeftWidth: "3px",
												}}
											>
												{branch.parentBranchId && (
													<span className="text-xs">↳</span>
												)}
												{branch.title} ({branch.segments.length})
											</button>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-2 sm:p-4 flex-1 overflow-hidden flex flex-col max-h-[50vh] lg:max-h-[60vh]">
							<div
								ref={storyContainerRef}
								className="flex-1 overflow-y-auto p-2 sm:p-4 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30 space-y-2 sm:space-y-4"
							>
								{activeBranch.segments.map((segment) => (
									<div key={segment.id} className="segment-enter">
										<div className="flex items-start gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<span className="font-bold text-gray-800">
														{segment.author.name}
													</span>
													<span className="text-xs font-medium ml-2 px-2 py-1 rounded-full bg-white/40 backdrop-blur-sm text-gray-700 border border-white/30">
														{segment.timestamp.toLocaleTimeString()}
													</span>
													{segment.isPlotTwist && (
														<span className="text-xs flex justify-center items-center gap-1 px-2 py-1 rounded-full font-bold text-purple-600 bg-white/40 backdrop-blur-sm border border-white/30 ml-2">
															<FiZap /> Plot Twist
														</span>
													)}

													{segment.author.id === currentPlayerId && (
														<button
															onClick={() => handleEditSegment(segment.id)}
															className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-500 text-white flex items-center gap-1 hover:bg-blue-600 transition-all"
														>
															<FiEdit size={12} /> Edit
														</button>
													)}
												</div>

												{editingSegmentId !== segment.id ? (
													<div className="rounded-2xl border border-white/30 bg-white/40 backdrop-blur-md shadow-lg p-3 mb-2 text-gray-800">
														<p
															className="leading-relaxed"
															dangerouslySetInnerHTML={{
																__html: renderFormattedText(segment.content),
															}}
														/>
													</div>
												) : (
													<div className="rounded-2xl border border-white/30 bg-white/50 backdrop-blur-md shadow-lg p-3 mb-2">
														<div className="mb-2 flex items-center gap-2 p-2 bg-white/40 backdrop-blur-sm rounded-lg">
															<button
																onClick={() => applyFormatting("bold")}
																className="bg-white/80 backdrop-blur-sm border border-stone-800/20 px-2 py-1 rounded cursor-pointer transition-all duration-300 text-stone-800 font-bold hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl text-sm"
																title="Bold"
															>
																B
															</button>
															<button
																onClick={() => applyFormatting("italic")}
																className="bg-white/80 backdrop-blur-sm border border-stone-800/20 px-2 py-1 rounded cursor-pointer transition-all duration-300 text-stone-800 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl italic text-sm"
																title="Italic"
															>
																I
															</button>
															<button
																onClick={() => applyFormatting("underline")}
																className="bg-white/80 backdrop-blur-sm border border-stone-800/20 px-2 py-1 rounded cursor-pointer transition-all duration-300 text-stone-800 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl underline text-sm"
																title="Underline"
															>
																U
															</button>
														</div>

														<textarea
															ref={editTextareaRef}
															value={editingContent}
															onChange={(e) =>
																setEditingContent(e.target.value)
															}
															className="w-full p-3 border-2 border-blue-300 focus:border-blue-500 focus:outline-none resize-none min-h-16 backdrop-blur-sm font-normal bg-white/70 text-gray-800 rounded-lg"
															style={{
																minHeight: "3rem",
																maxHeight: "7.5rem",
																direction: "ltr",
																textAlign: "left",
															}}
															maxLength={1000}
														/>

														<div className="flex justify-end gap-2 mt-2">
															<button
																onClick={cancelEditing}
																className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm"
															>
																Cancel
															</button>
															<button
																onClick={saveEditedSegment}
																className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1"
																disabled={!editingContent.trim()}
															>
																<FiSave size={14} /> Save
															</button>
														</div>
													</div>
												)}

												<div className="flex items-center gap-2 flex-wrap mb-3">
													<div className="flex gap-2">
														{Object.entries(segment.gifReactions).map(
															([emojiName, userIds]) => {
																const reaction = REACTION_GIFS.find(
																	(r) => r.name === emojiName
																);
																return (
																	<button
																		key={emojiName}
																		onClick={() =>
																			addGifReaction(segment.id, emojiName)
																		}
																		className="flex items-center gap-1.5 px-2 py-1.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/80 hover:shadow-md transition-all duration-300"
																	>
																		<img
																			src={
																				reaction?.gifUrl ||
																				"https://cdn.pixabay.com/animation/2025/05/19/00/14/00-14-39-779_512.gif"
																			}
																			alt={reaction?.label || "Reaction"}
																			className="w-6 h-6 object-contain"
																		/>
																		<span className="text-xs font-medium text-gray-800 bg-white/80 px-1.5 py-0.5 rounded-full">
																			{userIds.length}
																		</span>
																	</button>
																);
															}
														)}
													</div>

													<div className="relative group">
														<button
															onClick={() =>
																setShowGifReactions(
																	showGifReactions === segment.id
																		? null
																		: segment.id
																)
															}
															className="flex items-center justify-center w-16 h-8 bg-blue-500 hover:bg-blue-600 border border-blue-600 rounded-lg hover:shadow-md transition-all duration-300 text-white font-medium cursor-pointer"
														>
															<span className="text-xs font-bold ">GIF</span>
														</button>
														<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 whitespace-nowrap">
															Add GIF reaction
														</div>
													</div>

													<div className="relative group">
														<button
															onClick={() =>
																handleCreateAlternative(segment.id)
															}
															className="flex items-center justify-center w-16 h-8 bg-purple-500 hover:bg-purple-600 border border-purple-600 rounded-lg hover:shadow-md transition-all duration-300 text-white font-medium cursor-pointer"
														>
															<span className="text-xs">Branch</span>
														</button>
														<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 whitespace-nowrap">
															Create alternative story
														</div>
													</div>
												</div>

												{showGifReactions === segment.id && (
													<div className="mt-3 p-3 bg-white/50 backdrop-blur-md rounded-xl border border-white/40 shadow-lg animate-in fade-in-0 duration-300 ease-out scale-in-95">
														<div className="mb-2">
															<h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
																<div className="w-1 h-4 bg-blue-500 rounded-full"></div>
																Choose a GIF reaction
															</h4>
														</div>
														<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-64 overflow-y-auto">
															{REACTION_GIFS.map((reaction) => (
																<button
																	key={reaction.name}
																	onClick={() => {
																		addGifReaction(segment.id, reaction.name);
																		setShowGifReactions(null);
																	}}
																	className="group relative p-3 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md transition-all duration-300 border border-white/50 flex items-center justify-center"
																	title={reaction.label}
																>
																	<img
																		src={reaction.gifUrl}
																		alt={reaction.label}
																		className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
																	/>
																	<div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
																</button>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-2 sm:p-4 flex-shrink-0">
							<h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2 text-gray-800">
								<span className="text-lg sm:text-xl text-purple-600">
									<FiEdit />
								</span>
								{isUserTurn
									? "Continue the Adventure"
									: writingPlayerId
									? `${
											players.find((p) => p.id === writingPlayerId)?.name
									  } is writing...`
									: "Waiting for others..."}
							</h3>

							<div className="flex items-center gap-2 p-2 bg-white/40 backdrop-blur-sm rounded-t-lg border border-white/30">
								<button
									onClick={() => applyFormatting("bold")}
									className="bg-white/80 backdrop-blur-sm border border-stone-800/20 px-2 py-1 rounded cursor-pointer transition-all duration-300 text-stone-800 font-bold hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl text-sm"
									title="Bold"
								>
									B
								</button>
								<button
									onClick={() => applyFormatting("italic")}
									className="bg-white/80 backdrop-blur-sm border border-stone-800/20 px-2 py-1 rounded cursor-pointer transition-all duration-300 text-stone-800 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl italic text-sm"
									title="Italic"
								>
									I
								</button>
								<button
									onClick={() => applyFormatting("underline")}
									className="bg-white/80 backdrop-blur-sm border border-stone-800/20 px-2 py-1 rounded cursor-pointer transition-all duration-300 text-stone-800 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl underline text-sm"
									title="Underline"
								>
									U
								</button>
								<div className="w-px h-4 bg-white/50 mx-2" />
								<span className="text-xs font-medium text-gray-700">
									Select text and click formatting buttons
								</span>
							</div>

							<div className="space-y-3">
								<div className="bg-white/40 backdrop-blur-sm p-2 rounded-b-lg border border-white/30">
									<textarea
										ref={textareaRef}
										value={currentSegment}
										onChange={(e) => setCurrentSegment(e.target.value)}
										placeholder={
											isUserTurn
												? `${currentPlayer.name}, what magical adventure happens next?`
												: `Continue writing...`
										}
										className={`w-full p-2 sm:p-3 border-2 ${
											isUserTurn
												? "border-white/30 focus:border-purple-400"
												: "border-gray-300"
										} focus:outline-none resize-none min-h-12 sm:min-h-16 backdrop-blur-sm font-normal 'bg-gray-100/50 text-gray-500' placeholder-gray-600 rounded-lg text-sm sm:text-base`}
										style={{
											minHeight: "3rem",
											maxHeight: "7.5rem",
											direction: "ltr",
											textAlign: "left",
										}}
										maxLength={1000}
									/>
								</div>

								<div className="flex justify-between items-center">
									<div className="flex gap-4 text-sm text-gray-700">
										<span>Words: {wordCount}</span>
										<span>Characters: {characterCount}/1000</span>
									</div>

									<button
										onClick={addSegment}
										disabled={
											!isUserTurn ||
											!currentSegment.trim() ||
											currentSegment.length > 1000
										}
										className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg backdrop-blur-sm text-sm sm:text-base border border-blue-700"
									>
										{isUserTurn
											? "Add to Story"
											: writingPlayerId
											? `${
													players.find((p) => p.id === writingPlayerId)?.name
											  } Writing...`
											: "Waiting..."}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-lg border-t border-white/40 z-40 mobile-fixed-bottom">
					<div className="flex justify-around items-center gap-1 p-2 max-w-screen-sm mx-auto">
						<button
							onClick={() => setShowPlotTwistVoting(!showPlotTwistVoting)}
							className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 min-w-[60px] mobile-tab"
						>
							<FiZap className="text-purple-600" />
							<span className="text-[10px] text-gray-800 font-medium">
								Twists
							</span>
						</button>

						<button
							onClick={() => setShowAddPlotTwistModal(!showAddPlotTwistModal)}
							className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 min-w-[60px] mobile-tab"
						>
							<FiPlus className="text-blue-600" />
							<span className="text-[10px] text-gray-800 font-medium">Add</span>
						</button>

						<button
							onClick={() => setShowHistory(true)}
							className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 min-w-[60px] mobile-tab"
						>
							<FiClock className="text-amber-600" />
							<span className="text-[10px] text-gray-800 font-medium">
								History
							</span>
						</button>

						<button
							onClick={() => setShowBranchView(true)}
							className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 min-w-[60px] mobile-tab"
						>
							<FiGitBranch className="text-green-600" />
							<span className="text-[10px] text-gray-800 font-medium">
								Branches
							</span>
						</button>

						<button
							onClick={() => setMenuOpen(true)}
							className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 min-w-[60px] mobile-tab"
						>
							<FiUsers className="text-indigo-600" />
							<span className="text-[10px] text-gray-800 font-medium">
								Players
							</span>
						</button>
					</div>
				</div>
			</div>

			{showAddPlotTwistModal && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div className="bg-white/90 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl border border-white/30 animate-in fade-in-0 duration-300 ease-out scale-in-95 modal-container">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<div className="flex items-center justify-center w-8 h-8 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-purple-200/60">
									<div className="text-sm text-purple-700">
										<FiZap />
									</div>
								</div>
								Add a Plot Twist
							</h2>
							<button
								onClick={() => setShowAddPlotTwistModal(false)}
								className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
							>
								<FiX />
							</button>
						</div>

						<div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
							<p className="text-sm text-purple-700 flex items-start gap-2">
								<FiInfo className="mt-0.5 flex-shrink-0" />
								Plot twists add unexpected turns to the story. Be creative and
								surprise everyone!
							</p>
						</div>

						<textarea
							value={newTwistText}
							onChange={(e) => setNewTwistText(e.target.value)}
							rows={3}
							className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
							placeholder="Enter your twist idea here..."
						/>

						<div className="flex justify-end gap-2">
							<button
								onClick={() => setShowAddPlotTwistModal(false)}
								className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									if (newTwistText.trim()) {
										addPlotTwist(newTwistText.trim());
										setNewTwistText("");
										setShowAddPlotTwistModal(false);
									}
								}}
								disabled={!newTwistText.trim()}
								className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-md"
							>
								<FiZap size={16} /> Add Twist
							</button>
						</div>
					</div>
				</div>
			)}

			{showPlotTwistVoting && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
					<div className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/90 backdrop-blur-lg shadow-2xl p-3 sm:p-6 w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[80vh] overflow-auto modal-container">
						<div className="flex justify-between items-center mb-4 sm:mb-6">
							<h3 className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3 text-gray-800">
								<div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-purple-200/60">
									<div className="text-sm sm:text-lg text-purple-700 cursor-pointer">
										<FiZap />
									</div>
								</div>
								<span className="hidden sm:inline">Vote for Plot Twists!</span>
								<span className="sm:hidden">Vote Twists!</span>
							</h3>
							<button
								onClick={() => setShowPlotTwistVoting(false)}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/60 rounded-lg transition-all duration-300"
							>
								<FiX />
							</button>
						</div>

						<div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 mb-4">
							<p className="text-sm text-purple-700 flex items-start gap-2">
								<FiInfo className="mt-0.5 flex-shrink-0" />
								Vote for your favorite plot twists! The twist with the most
								votes will be applied to the story.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-y-auto max-h-[50vh] sm:max-h-none">
							{PLOT_TWIST_SUGGESTIONS.map((suggestion) => {
								const twist = plotTwists.find(
									(pt) => pt.suggestion === suggestion
								);
								const voteCount = twist?.votes.length || 0;
								const hasVoted =
									twist?.votes.includes(currentPlayerId) || false;

								return (
									<button
										key={suggestion}
										onClick={() => votePlotTwist(suggestion)}
										className={`p-3 sm:p-6 bg-white/80 backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl text-left hover:bg-white/90 hover:shadow-md transition-all duration-300 min-h-[50px] sm:min-h-[60px] ${
											hasVoted
												? "border-purple-400 bg-purple-50/80 shadow-md"
												: "border-white/50 hover:border-purple-300"
										}`}
									>
										<div className="flex justify-between items-center">
											<span className="text-xs sm:text-base text-gray-800 font-medium leading-tight pr-2">
												{suggestion}
											</span>
											<span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold bg-purple-500 text-white flex-shrink-0 shadow-sm">
												{voteCount}
											</span>
										</div>
									</button>
								);
							})}
						</div>

						<div className="text-center pt-2 border-t border-white/30">
							<button
								onClick={applyPlotTwist}
								className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-600 disabled:border-gray-500 text-sm sm:text-base"
							>
								<span className="sm:hidden">Use Top Twist</span>
								<span className="hidden sm:inline">Use Top Voted Twist</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{showExportOptions && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
					<div className="rounded-2xl border border-white/10 bg-white/90 shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md animate-in fade-in-0 duration-300 ease-out scale-in-95 modal-container">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl text-gray-800 font-bold flex items-center gap-2 cursor-pointer">
								<FiDownload />
								Export Story
							</h3>
							<button
								onClick={() => setShowExportOptions(false)}
								className="bg-white/80 backdrop-blur-sm border border-stone-800/20 cursor-pointer transition-all duration-300 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl text-lg sm:text-xl font-bold p-2 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
								aria-label="Close Export Options"
							>
								<FiX />
							</button>
						</div>

						<div className="grid grid-cols-1 gap-3">
							<button
								onClick={() => {
									exportStory("pdf");
									setShowExportOptions(false);
								}}
								className="bg-purple-600 hover:bg-purple-700 text-white p-4 sm:p-3 rounded-lg transition-all min-h-[52px] w-full"
							>
								<span className="flex items-center justify-center gap-2 cursor-pointer">
									<FiFileText />
									<span className="text-sm sm:text-base">Download as PDF</span>
								</span>
							</button>
							<button
								onClick={() => {
									exportStory("html");
									setShowExportOptions(false);
								}}
								className="bg-purple-600 hover:bg-purple-700 text-white p-4 sm:p-3 rounded-lg transition-all min-h-[52px] w-full flex items-center justify-center gap-2"
							>
								<FiCode />
								<span className="text-sm sm:text-base">Download as HTML</span>
							</button>

							<button
								onClick={() => {
									exportStory("txt");
									setShowExportOptions(false);
								}}
								className="bg-purple-600 hover:bg-purple-700 text-white p-4 sm:p-3 rounded-lg transition-all min-h-[52px] w-full flex items-center justify-center gap-2"
							>
								<FiClipboard />
								<span className="text-sm sm:text-base">Download as Text</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{showBranchView && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
					<div className="rounded-2xl border border-white/10 bg-white/90 shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-4xl lg:max-w-6xl max-h-[90vh] sm:max-h-[90vh] overflow-scroll animate-in fade-in-0 duration-300 ease-out scale-in-95 modal-container">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-gray-800">
								<div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-purple-200/60">
									<div className="text-sm sm:text-lg text-purple-700">
										<FiGitBranch />
									</div>
								</div>
								Story Branches Visualization
							</h3>
							<button
								onClick={() => setShowBranchView(false)}
								className="bg-white/80 backdrop-blur-sm border border-stone-800/20 cursor-pointer transition-all duration-300 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-xl text-lg sm:text-xl font-bold p-2 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg"
								aria-label="Close Branch View"
							>
								<FiX />
							</button>
						</div>

						<div className="mb-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-wrap gap-2 sm:gap-4">
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-medium text-blue-700">
									Total Branches:
								</span>
								<span className="text-xs font-bold text-blue-900 px-2 py-0.5 bg-blue-100 rounded-full">
									{branches.length}
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-medium text-blue-700">
									Active Branch:
								</span>
								<span className="text-xs font-bold text-blue-900 px-2 py-0.5 bg-blue-100 rounded-full">
									{activeBranch.title}
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-medium text-blue-700">
									Total Segments:
								</span>
								<span className="text-xs font-bold text-blue-900 px-2 py-0.5 bg-blue-100 rounded-full">
									{getAllSegments().length}
								</span>
							</div>
							<div className="flex-1"></div>
							<div className="text-xs text-blue-700 flex items-center gap-1">
								<FiInfo size={14} />
								<span>Click on nodes to view segments</span>
							</div>
						</div>

						<div className="flex flex-col lg:flex-row gap-4 h-[calc(90vh-200px)] sm:h-[calc(90vh-380px)]">
							<div className="relative w-full lg:w-3/5 h-52 sm:h-64 lg:h-full overflow-auto rounded-2xl border border-white/30 bg-gradient-to-br from-indigo-50/70 to-blue-50/70">
								<svg className="w-full h-full">
									{branches.map((branch) => {
										if (!branch.parentBranchId) return null;

										const parentBranch = branches.find(
											(b) => b.id === branch.parentBranchId
										);
										if (!parentBranch) return null;

										const commonSegments = branch.segments.filter((seg) =>
											parentBranch.segments.some(
												(parentSeg) => parentSeg.id === seg.id
											)
										);

										if (commonSegments.length === 0) return null;

										const lastCommonSegment =
											commonSegments[commonSegments.length - 1];
										const childBranchFirstUniqueSegment =
											branch.segments[commonSegments.length];

										if (!childBranchFirstUniqueSegment) return null;

										return (
											<line
												key={`branch-connection-${branch.id}`}
												x1={`${lastCommonSegment.x}%`}
												y1={`${lastCommonSegment.y}%`}
												x2={`${branch.x}%`}
												y2={`${branch.y}%`}
												stroke={branch.color}
												strokeWidth="3"
												strokeDasharray="5,5"
												className="branch-connection"
											/>
										);
									})}

									{branches.map((branch) =>
										branch.segments.map((segment, index) => {
											if (index === 0) return null;
											const prevSegment = branch.segments[index - 1];
											if (!prevSegment) return null;

											return (
												<line
													key={`segment-connection-${segment.id}`}
													x1={`${prevSegment.x}%`}
													y1={`${prevSegment.y}%`}
													x2={`${segment.x}%`}
													y2={`${segment.y}%`}
													stroke={branch.color}
													strokeWidth="2"
													className="opacity-60"
												/>
											);
										})
									)}

									{getAllSegments().map((segment, index) => (
										<g
											key={segment.id}
											onClick={() => handleNodeClick(segment.id)}
										>
											<circle
												cx={`${segment.x}%`}
												cy={`${segment.y}%`}
												r="18"
												fill="#4fc3f7"
												className={`cursor-pointer transition-all duration-300 hover:brightness-110 ${
													selectedSegmentId === segment.id
														? "node-selected"
														: ""
												}`}
												style={{
													filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
												}}
											/>
											<text
												x={`${segment.x}%`}
												y={`${segment.y}%`}
												textAnchor="middle"
												dominantBaseline="central"
												className="font-bold text-xs fill-white pointer-events-none"
											>
												{index + 1}
											</text>
										</g>
									))}
								</svg>
							</div>

							<div className="w-full lg:w-2/5 flex-1 overflow-y-auto bg-white/30 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
								{selectedSegmentId ? (
									(() => {
										const result = findSegmentById(selectedSegmentId);
										if (!result)
											return (
												<div className="h-full flex items-center justify-center">
													<p className="text-center text-gray-500">
														Select a node to view details
													</p>
												</div>
											);

										const { segment, branch } = result;
										const segmentIndex = branch.segments.findIndex(
											(s) => s.id === segment.id
										);

										return (
											<div className="animate-fade-in p-4">
												<div className="flex flex-wrap justify-between items-center mb-3 gap-2">
													<div className="flex items-center gap-2">
														<div
															className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold"
															style={{ backgroundColor: branch.color }}
														>
															{segmentIndex + 1}
														</div>
														<div>
															<div className="font-bold text-gray-800">
																{segment.author.name}
															</div>
															<div className="text-xs text-gray-600">
																{segment.timestamp.toLocaleString()}
															</div>
														</div>
													</div>
													<div>
														<span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">
															Branch: {branch.title}
														</span>
													</div>
												</div>

												<div className="bg-gray-50 p-2 rounded-lg mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
													<div className="flex items-center gap-1">
														<span className="text-gray-500">Segment:</span>
														<span className="font-medium">
															{segmentIndex + 1} of {branch.segments.length}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<span className="text-gray-500">Characters:</span>
														<span className="font-medium">
															{segment.content.length}
														</span>
													</div>
													{segment.isPlotTwist && (
														<div className="flex items-center gap-1">
															<span className="text-purple-600 font-bold">
																<FiZap size={12} />
															</span>
															<span className="text-purple-600 font-medium">
																Plot Twist
															</span>
														</div>
													)}
												</div>

												<div className="rounded-2xl border border-white/30 bg-white/50 backdrop-blur-md shadow-lg p-4 mb-4">
													<div className="prose prose-sm max-w-none">
														<p
															className="text-gray-800 leading-relaxed"
															dangerouslySetInnerHTML={{
																__html: renderFormattedText(segment.content),
															}}
														/>
													</div>
												</div>

												<div className="flex flex-wrap justify-between items-center gap-2">
													<div className="flex gap-2">
														{segmentIndex > 0 && (
															<button
																onClick={() =>
																	handleNodeClick(
																		branch.segments[segmentIndex - 1].id
																	)
																}
																className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm flex items-center gap-1"
															>
																<FiChevronLeft size={14} /> Previous
															</button>
														)}
														{segmentIndex < branch.segments.length - 1 && (
															<button
																onClick={() =>
																	handleNodeClick(
																		branch.segments[segmentIndex + 1].id
																	)
																}
																className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm flex items-center gap-1"
															>
																Next <FiChevronRight size={14} />
															</button>
														)}
													</div>
													{branch.id !== activeBranchId && (
														<button
															onClick={() => {
																switchBranch(branch.id);
																setShowBranchView(false);
															}}
															className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm flex items-center gap-1.5 shadow-md"
														>
															<FiGitBranch size={14} /> Switch to Branch
														</button>
													)}
												</div>

												{Object.keys(segment.gifReactions).length > 0 && (
													<div className="mt-4 pt-3 border-t border-gray-200">
														<h4 className="text-xs font-medium text-gray-500 mb-2">
															Reactions:
														</h4>
														<div className="flex flex-wrap gap-2">
															{Object.entries(segment.gifReactions).map(
																([gifName, userIds]) => {
																	const reaction = REACTION_GIFS.find(
																		(r) => r.name === gifName
																	);
																	return (
																		<div
																			key={gifName}
																			className="flex items-center gap-1 p-1 bg-white/60 rounded-lg border border-white/70"
																		>
																			<img
																				src={reaction?.gifUrl || ""}
																				alt={reaction?.label || ""}
																				className="w-6 h-6 object-contain"
																			/>
																			<span className="text-xs bg-gray-100 px-1.5 rounded-full">
																				{userIds.length}
																			</span>
																		</div>
																	);
																}
															)}
														</div>
													</div>
												)}
											</div>
										);
									})()
								) : (
									<div className="h-full flex flex-col items-center justify-center p-6">
										<div className="w-16 h-16 mb-4 text-blue-400 opacity-70">
											<FiGitBranch size={64} />
										</div>
										<p className="text-center text-gray-500 mb-2">
											Click on a node to view story segment details
										</p>
										<p className="text-center text-xs text-gray-400">
											Each node represents a segment in the story
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{showHistory && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
					<div className="rounded-2xl border border-white/10 bg-white/90 shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[80vh] overflow-hidden animate-in fade-in-0 duration-300 ease-out scale-in-95 modal-container">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-2xl font-bold flex items-center gap-2 text-gray-700">
								Story History
							</h3>
							<button
								onClick={() => setShowHistory(false)}
								className="text-lg sm:text-xl font-bold p-2 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
								aria-label="Close Story History"
							>
								<FiX />
							</button>
						</div>

						<div className="overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(80vh-120px)] space-y-4">
							{activeBranch.segments.map((segment, index) => (
								<div
									key={segment.id}
									className="rounded-2xl border border-white/30 bg-white/90 backdrop-blur-md shadow-lg p-4"
								>
									<div className="flex items-center gap-3 mb-2">
										<span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 font-medium">
											#{index + 1}
										</span>
										<span className="text-gray-800 font-semibold">
											{segment.author.name}
										</span>
										<span className="text-xs text-gray-600">
											{segment.timestamp.toLocaleString()}
										</span>
									</div>
									<p
										className="leading-relaxed text-gray-800"
										dangerouslySetInnerHTML={{
											__html: renderFormattedText(segment.content),
										}}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{showCreateBranchModal && branchingFromSegmentId && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
					<div className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/90 backdrop-blur-lg shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[95vh] sm:max-h-[80vh] overflow-hidden animate-in fade-in-0 duration-300 ease-out scale-in-95 modal-container">
						<div className="flex justify-between items-center mb-4 sm:mb-6">
							<h3 className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3 text-gray-800">
								<div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-100/80 backdrop-blur-sm rounded-lg border border-purple-200/60">
									<div className="text-sm sm:text-lg text-purple-700">
										<FiGitBranch />
									</div>
								</div>
								Create Alternative Branch
							</h3>
							<button
								onClick={() => {
									setShowCreateBranchModal(false);
									setBranchingFromSegmentId(null);
									setNewBranchTitle("");
								}}
								className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/60 rounded-lg transition-all duration-300"
							>
								<FiX />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Branch Name
								</label>
								<input
									type="text"
									value={newBranchTitle}
									onChange={(e) => setNewBranchTitle(e.target.value)}
									placeholder="Enter alternative story title..."
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									maxLength={50}
								/>
								<p className="text-xs text-gray-500 mt-1">
									Give your alternative storyline a descriptive name
								</p>
							</div>

							<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
								<div className="flex items-start gap-2">
									<div className="text-blue-600 mt-0.5">
										<FiInfo />
									</div>
									<div className="text-sm text-blue-800">
										<strong>Creating Alternative Branch:</strong> This will
										create a new story path from the selected segment. You'll be
										able to write a different continuation of the story.
									</div>
								</div>
							</div>

							<div className="flex gap-3 pt-2">
								<button
									onClick={() => {
										setShowCreateBranchModal(false);
										setBranchingFromSegmentId(null);
										setNewBranchTitle("");
									}}
									className="flex-1 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300"
								>
									Cancel
								</button>
								<button
									onClick={() => {
										if (branchingFromSegmentId) {
											createBranchFromSegment(
												branchingFromSegmentId,
												newBranchTitle
											);
										}
									}}
									className="flex-1 cursor-pointer px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
								>
									Create Branch
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{menuOpen && (
				<div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
					<div className="rounded-xl sm:rounded-2xl border border-white/30 bg-white/90 backdrop-blur-lg shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-auto animate-in fade-in-0 duration-300 ease-out scale-in-95 modal-container">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg sm:text-xl font-bold text-gray-800">
								Players & Information
							</h3>
							<button
								onClick={() => setMenuOpen(false)}
								className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
							>
								<FiX />
							</button>
						</div>

						<div className="space-y-5">
							<div className="rounded-xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-3">
								<h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-800">
									<div className="flex items-center justify-center w-6 h-6 bg-green-100/80 backdrop-blur-sm rounded-lg border border-green-200/60">
										<div className="text-xs text-green-700">
											<FiUsers />
										</div>
									</div>
									Players
								</h4>
								<div className="space-y-2">
									{players
										.sort((a, b) => b.contributionCount - a.contributionCount)
										.map((player) => (
											<div
												key={player.id}
												className={`p-2 rounded-xl ${
													player.id === currentPlayerId
														? "bg-blue-100/50 border-blue-200/50"
														: "bg-white/40"
												} backdrop-blur-sm border border-white/30 flex justify-between items-center`}
											>
												<div className="flex items-center gap-2">
													<div
														className={`w-2 h-2 rounded-full ${
															player.id === writingPlayerId
																? "bg-purple-500 animate-pulse"
																: "bg-gray-300"
														}`}
													></div>
													<span className="text-sm font-medium text-gray-800">
														{player.name}{" "}
														{player.id === currentPlayerId && "(You)"}
													</span>
												</div>
												<span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
													{player.contributionCount}
												</span>
											</div>
										))}
								</div>
							</div>

							<div className="rounded-xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-3">
								<h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-800">
									<div className="flex items-center justify-center w-6 h-6 bg-amber-100/80 backdrop-blur-sm rounded-lg border border-amber-200/60">
										<div className="text-xs text-amber-700">
											<FiFileText />
										</div>
									</div>
									Story Stats
								</h4>
								<div className="space-y-1">
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Branch
										</span>
										<span className="text-xs font-bold text-gray-800">
											{activeBranch.title}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Segments
										</span>
										<span className="text-xs font-bold text-gray-800">
											{activeBranch.segments.length}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Plot Twists
										</span>
										<span className="text-xs font-bold text-gray-800">
											{
												activeBranch.segments.filter((s) => s.isPlotTwist)
													.length
											}
										</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-lg bg-white/40 backdrop-blur-sm">
										<span className="text-xs font-medium text-gray-700">
											Created
										</span>
										<span className="text-xs font-bold text-gray-800">
											{activeBranch.createdAt.toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>

							<div className="rounded-xl border border-white/30 bg-white/30 backdrop-blur-md shadow-lg p-3">
								<h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-800">
									<div className="flex items-center justify-center w-6 h-6 bg-blue-100/80 backdrop-blur-sm rounded-lg border border-blue-200/60">
										<div className="text-xs text-blue-700">
											<FiMessageSquare />
										</div>
									</div>
									Inspiration
								</h4>
								<div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
									<p className="text-xs italic text-gray-600 mb-2">
										Try adding these elements to your story:
									</p>
									<div className="space-y-1.5">
										{[
											"A mysterious artifact with unexpected powers",
											"A character revealing a hidden motivation",
											"An environmental change (storm, earthquake, magic)",
											"An unexpected ally or enemy appears",
											"A difficult choice that changes everything",
										].map((idea, index) => (
											<div key={index} className="flex items-start gap-2">
												<div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
												<p className="text-xs text-gray-700">{idea}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
