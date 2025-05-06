"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";

import {
	FiPlus,
	FiTrash2,
	FiEdit3,
	FiTarget,
	FiDownload,
	FiSearch,
	FiSun,
	FiMaximize2,
	FiX,
} from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";



type NodeStatus = "healthy" | "warning" | "critical";
type NodeType = "frontend" | "backend" | "service" | "library";
type Node = {
	id: string;
	label: string;
	type: NodeType;
	status: NodeStatus;
	x: number;
	y: number;
};
type Edge = {
	id: string;
	source: string;
	target: string;
};

type GroupBy = "none" | "type" | "status";

const COLORS = {
	primary: "#3b82f6",
	primaryLight: "#bfdbfe",
	secondary: "#6366f1",
	accent: "#f97316",
	success: "#22c55e",
	warning: "#f59e0b",
	critical: "#ef4444",
	card: "#ffffff",
	text: "#1e293b",
	textLight: "#94a3b8",
	backdrop: "#f8fafc",
	selection: "#bae6fd",
	shadow: "rgba(15, 23, 42, 0.1)",
	groupType: {
		frontend: "#a5b4fc",
		backend: "#fbbf24",
		service: "#6ee7b7",
		library: "#f9a8d4",
	},
};

const STATUS_COLORS = {
	healthy: COLORS.success,
	warning: COLORS.warning,
	critical: COLORS.critical,
};

const ZOOM_MIN = 0.45;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.15;

const NODE_RADIUS = 48;
const EDGE_WIDTH = 2;

const genId = () => Math.random().toString(36).substr(2, 9);

const NODE_TYPE_OPTIONS: { value: NodeType; label: string }[] = [
	{ value: "frontend", label: "Frontend" },
	{ value: "backend", label: "Backend" },
	{ value: "service", label: "Service" },
	{ value: "library", label: "Library" },
];

const NODE_STATUS_OPTIONS: { value: NodeStatus; label: string }[] = [
	{ value: "healthy", label: "Healthy" },
	{ value: "warning", label: "Warning" },
	{ value: "critical", label: "Critical" },
];

function groupLayout(
	nodes: Node[],
	groupBy: GroupBy,
	canvasW: number,
	canvasH: number
): Record<string, { cx: number; cy: number; nodes: Node[]; color: string }> {
	let groups: Record<string, Node[]> = {};
	if (groupBy === "none") {
		groups["all"] = nodes;
	} else {
		for (const n of nodes) {
			const key = n[groupBy];
			if (!groups[key]) groups[key] = [];
			groups[key].push(n);
		}
	}

	const groupKeys = Object.keys(groups);
	const groupCount = groupKeys.length;
	const marginY = 80;
	const marginX = 80;
	const availableW = canvasW - marginX * 2;
	const availableH = canvasH - marginY * 2;
	let res: Record<
		string,
		{ cx: number; cy: number; nodes: Node[]; color: string }
	> = {};
	groupKeys.forEach((groupKey, i) => {
		const groupCx = marginX + (availableW * (i + 1)) / (groupCount + 1);
		const groupCy = canvasH / 2;
		let color = "#e0e7ef";
		if (groupBy === "type")
			color = COLORS.groupType[groupKey as NodeType] || "#e0e7ef";
		if (groupBy === "status")
			color = STATUS_COLORS[groupKey as NodeStatus] || "#e0e7ef";
		res[groupKey] = {
			cx: groupCx,
			cy: groupCy,
			nodes: groups[groupKey],
			color,
		};
	});
	return res;
}

const DependencyGraphApp: React.FC = () => {
	const [showLanding, setShowLanding] = useState(true);

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`}
		>
			{showLanding ? (
				<LandingPage onEnter={() => setShowLanding(false)} />
			) : (
				<ProjectMapping />
			)}
		</div>
	);
};

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="w-full px-8 py-6 flex justify-between items-center">
				<div className="flex items-center">
					<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
						<FiMaximize2 className="text-white text-2xl" />
					</div>
					<h1 className="ml-3 text-2xl font-bold text-slate-800">
						DependencyGraph
					</h1>
				</div>
				<div className="flex items-center gap-4">
					<a
						href="#features"
						className="text-slate-600 hover:text-blue-600 font-medium"
					>
						Features
					</a>
					<a
						href="#about"
						className="text-slate-600 hover:text-blue-600 font-medium"
					>
						About
					</a>
					<button
						onClick={onEnter}
						className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
					>
						Launch App
					</button>
				</div>
			</header>

			<main className="flex-1">
				{}
				<section className="py-20 px-8 max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row items-center gap-12">
						<div className="md:w-1/2">
							<h1 className="text-5xl font-bold text-slate-800 leading-tight">
								Visualize Your Project{" "}
								<span className="text-blue-600">Dependencies</span> With Ease
							</h1>
							<p className="mt-6 text-xl text-slate-600 leading-relaxed">
								Create interactive dependency graphs to understand your project
								architecture, track component relationships, and identify
								critical services.
							</p>
							<div className="mt-10 flex gap-4">
								<button
									onClick={onEnter}
									className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-lg"
								>
									Get Started
								</button>
								<a
									href="#features"
									className="border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 px-8 py-3 rounded-lg font-medium transition-all text-lg flex items-center"
								>
									Learn More
								</a>
							</div>
						</div>
						<div className="md:w-1/2">
							<div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-[1.02] transition-all duration-300">
								<img
									src="https://www.monday.com/blog/wp-content/uploads/2021/02/pasted-image-0-58.png"
									alt="Project Dependency Graph Preview"
									className="rounded-xl"
								/>
							</div>
						</div>
					</div>
				</section>

				{}
				<section id="features" className="py-20 px-8 bg-white">
					<div className="max-w-7xl mx-auto">
						<h2 className="text-3xl font-bold text-center text-slate-800 mb-16">
							Powerful Features
						</h2>
						<div className="grid md:grid-cols-3 gap-10">
							{[
								{
									icon: <FiMaximize2 className="text-blue-500 text-4xl" />,
									title: "Interactive Visualization",
									description:
										"Drag, zoom, and explore your project dependencies with an intuitive interface.",
								},
								{
									icon: <FiEdit3 className="text-blue-500 text-4xl" />,
									title: "Edit in Real-Time",
									description:
										"Add nodes, create connections, and update statuses with immediate visual feedback.",
								},
								{
									icon: <FiDownload className="text-blue-500 text-4xl" />,
									title: "Export & Share",
									description:
										"Export your graph as PNG to include in documentation or share with team members.",
								},
							].map((feature, index) => (
								<div
									key={index}
									className="bg-slate-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
								>
									<div className="mb-4">{feature.icon}</div>
									<h3 className="text-xl font-bold text-slate-800 mb-3">
										{feature.title}
									</h3>
									<p className="text-slate-600">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{}
				<section id="about" className="py-20 px-8">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold text-slate-800 mb-6">
							About DependencyGraph
						</h2>
						<p className="text-lg text-slate-600 leading-relaxed">
							DependencyGraph is a powerful tool designed to help development
							teams visualize and manage the complex relationships between
							components in their projects. Whether you're working on
							microservices, monolithic applications, or libraries, our tool
							makes it easy to understand the architecture and identify
							potential issues.
						</p>
						<button
							onClick={onEnter}
							className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-lg"
						>
							Try It Now
						</button>
					</div>
				</section>
			</main>

			<footer className="py-10 px-8 border-t border-slate-200">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
					<div className="flex items-center mb-4 md:mb-0">
						<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
							<FiMaximize2 className="text-white text-lg" />
						</div>
						<p className="ml-2 text-lg font-semibold text-slate-800">
							DependencyGraph
						</p>
					</div>
					<p className="text-slate-500 text-sm">
						© {new Date().getFullYear()} DependencyGraph. All rights reserved.
					</p>
				</div>
			</footer>
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap");

				* {
					font-family: "Manrope", sans-serif;
				}
			`}</style>
		</div>
	);
};

const DEFAULT_NODES: Node[] = [
	{
		id: genId(),
		label: "Web UI",
		type: "frontend",
		status: "healthy",
		x: 320,
		y: 200,
	},
	{
		id: genId(),
		label: "API Gateway",
		type: "backend",
		status: "warning",
		x: 520,
		y: 340,
	},
	{
		id: genId(),
		label: "Auth Service",
		type: "service",
		status: "critical",
		x: 700,
		y: 180,
	},
	{
		id: genId(),
		label: "Core Lib",
		type: "library",
		status: "healthy",
		x: 200,
		y: 400,
	},
];

const DEFAULT_EDGES: Edge[] = [
	{ id: genId(), source: DEFAULT_NODES[0].id, target: DEFAULT_NODES[1].id },
	{ id: genId(), source: DEFAULT_NODES[1].id, target: DEFAULT_NODES[2].id },
	{ id: genId(), source: DEFAULT_NODES[3].id, target: DEFAULT_NODES[1].id },
	{ id: genId(), source: DEFAULT_NODES[3].id, target: DEFAULT_NODES[0].id },
];

const CANVAS_W = 1100;
const CANVAS_H = 650;

const ProjectMapping: React.FC = () => {
	const [nodes, setNodes] = useState<Node[]>(() => {
		const saved = localStorage.getItem("graph_nodes");
		return saved
			? JSON.parse(saved)
			: JSON.parse(JSON.stringify(DEFAULT_NODES));
	});
	const [edges, setEdges] = useState<Edge[]>(() => {
		const saved = localStorage.getItem("graph_edges");
		return saved
			? JSON.parse(saved)
			: JSON.parse(JSON.stringify(DEFAULT_EDGES));
	});

	const [history, setHistory] = useState<{ n: Node[]; e: Edge[] }[]>([]);

	const zoomIn = useCallback(
		() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP)),
		[]
	);
	const zoomOut = useCallback(
		() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP)),
		[]
	);

	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
	const [creatingEdgeSourceId, setCreatingEdgeSourceId] = useState<
		string | null
	>(null);
	const [editingNode, setEditingNode] = useState<Node | null>(null);
	const [addingNode, setAddingNode] = useState<boolean>(false);
	const [deletingEdgeId, setDeletingEdgeId] = useState<string | null>(null);
	const [groupBy, setGroupBy] = useState<GroupBy>("none");

	const [zoom, setZoom] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
		null
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const [canvasSize, setCanvasSize] = useState<[number, number]>([
		CANVAS_W,
		CANVAS_H,
	]);

	useEffect(() => {
		const resize = () => {
			if (containerRef.current) {
				const { width, height } = containerRef.current.getBoundingClientRect();
				setCanvasSize([width, Math.max(height, 480)]);
			}
		};
		window.addEventListener("resize", resize);
		resize();
		return () => window.removeEventListener("resize", resize);
	}, []);

	useEffect(() => {
		if (groupBy === "none") return;
		const layout = groupLayout(nodes, groupBy, canvasSize[0], canvasSize[1]);
		const newNodes = nodes.map((n) => {
			const group = layout[n[groupBy]];
			const idx = group.nodes.findIndex((nn) => nn.id === n.id);
			const angle =
				group.nodes.length > 1 ? (2 * Math.PI * idx) / group.nodes.length : 0;
			const r = Math.max(90, 70 + 20 * group.nodes.length);
			return {
				...n,
				x: group.cx + Math.cos(angle) * r,
				y: group.cy + Math.sin(angle) * r,
			};
		});
		setNodes(newNodes);
	}, [groupBy, canvasSize[0], canvasSize[1]]);

	const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
	const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
		e.stopPropagation();
		setDraggingNodeId(nodeId);
		setSelectedNodeId(nodeId);
		const svg = (e.target as SVGElement).ownerSVGElement!;
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
		const node = nodes.find((n) => n.id === nodeId)!;
		dragOffset.current = { x: node.x - x, y: node.y - y };
		(e.target as Element).setPointerCapture(e.pointerId);
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (draggingNodeId) {
			const svg = (e.target as SVGElement).ownerSVGElement!;
			const pt = svg.createSVGPoint();
			pt.x = e.clientX;
			pt.y = e.clientY;
			const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
			setNodes((prev) =>
				prev.map((n) =>
					n.id === draggingNodeId
						? {
								...n,
								x: x + dragOffset.current.x,
								y: y + dragOffset.current.y,
						  }
						: n
				)
			);
		} else if (isPanning && panStart) {
			setOffset((prev) => ({
				x: prev.x + (e.clientX - panStart.x),
				y: prev.y + (e.clientY - panStart.y),
			}));
			setPanStart({ x: e.clientX, y: e.clientY });
		}
	};

	const handlePointerUp = () => {
		setDraggingNodeId(null);
		setIsPanning(false);
		setPanStart(null);
	};

	const handleBackgroundPointerDown = (e: React.PointerEvent) => {
		if (!draggingNodeId) {
			setIsPanning(true);
			setPanStart({ x: e.clientX, y: e.clientY });
			(e.target as Element).setPointerCapture(e.pointerId);
		}
	};

	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const factor = e.deltaY > 0 ? 0.9 : 1.1;
		const newZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom * factor));

		const svg = (e.target as SVGElement).ownerSVGElement!;
		const pt = svg.createSVGPoint();
		pt.x = e.clientX;
		pt.y = e.clientY;
		const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
		const dx = x * (newZoom - zoom);
		const dy = y * (newZoom - zoom);
		setOffset((prev) => ({
			x: prev.x - dx,
			y: prev.y - dy,
		}));
		setZoom(newZoom);
	};

	const [nodeForm, setNodeForm] = useState<Omit<Node, "id" | "x" | "y">>({
		label: "",
		type: "frontend",
		status: "healthy",
	});

	const handleNodeFormChange = (
		field: keyof typeof nodeForm,
		value: string
	) => {
		setNodeForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddNode = () => {
		setNodeForm({ label: "", type: "frontend", status: "healthy" });
		setAddingNode(true);
		setEditingNode(null);
	};

	const handleEditNode = (node: Node) => {
		setNodeForm({
			label: node.label,
			type: node.type,
			status: node.status,
		});
		setEditingNode(node);
		setAddingNode(false);
	};

	const handleNodeFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (addingNode) {
			const id = genId();
			setNodes((prev) => [
				...prev,
				{
					id,
					...nodeForm,
					x: canvasSize[0] / 2 + Math.random() * 60 - 30,
					y: canvasSize[1] / 2 + Math.random() * 60 - 30,
				},
			]);
		} else if (editingNode) {
			setNodes((prev) =>
				prev.map((n) => (n.id === editingNode.id ? { ...n, ...nodeForm } : n))
			);
		}
		setAddingNode(false);
		setEditingNode(null);
	};

	const handleDeleteNode = (nodeId: string) => {
		setNodes((prev) => prev.filter((n) => n.id !== nodeId));
		setEdges((prev) =>
			prev.filter((e) => e.source !== nodeId && e.target !== nodeId)
		);
		setHistory((h) => [...h.slice(-19), { n: nodes, e: edges }]);
		setSelectedNodeId(null);
		setEditingNode(null);
	};

	const handleDeleteEdge = (edgeId: string) => {
		setEdges((prev) => prev.filter((e) => e.id !== edgeId));
		setSelectedEdgeId(null);
		setDeletingEdgeId(null);
	};

	const handleStartEdgeCreate = (nodeId: string) => {
		setCreatingEdgeSourceId(nodeId);
	};

	const handleCompleteEdgeCreate = (targetNodeId: string) => {
		if (
			creatingEdgeSourceId &&
			creatingEdgeSourceId !== targetNodeId &&
			!edges.find(
				(e) => e.source === creatingEdgeSourceId && e.target === targetNodeId
			)
		) {
			setEdges((prev) => [
				...prev,
				{ id: genId(), source: creatingEdgeSourceId, target: targetNodeId },
			]);
		}
		setCreatingEdgeSourceId(null);
	};

	const handleCenterNode = (nodeId: string) => {
		const node = nodes.find((n) => n.id === nodeId)!;
		const [cw, ch] = canvasSize;
		setOffset({
			x: cw / 2 - node.x * zoom,
			y: ch / 2 - node.y * zoom,
		});
	};

	const svgRef = useRef<SVGSVGElement>(null);

	const exportAsPNG = async () => {
		if (!svgRef.current) return;

		const [canvasWidth, canvasHeight] = canvasSize;

		const visibleLeft = -offset.x / zoom;
		const visibleTop = -offset.y / zoom;
		const visibleWidth = canvasWidth / zoom;
		const visibleHeight = canvasHeight / zoom;

		const exportSvg = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"svg"
		);
		exportSvg.setAttribute("width", canvasWidth.toString());
		exportSvg.setAttribute("height", canvasHeight.toString());
		exportSvg.setAttribute(
			"viewBox",
			`${visibleLeft} ${visibleTop} ${visibleWidth} ${visibleHeight}`
		);
		exportSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

		const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		const gradient = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"linearGradient"
		);
		gradient.setAttribute("id", "bgGradient");
		gradient.setAttribute("x1", "0%");
		gradient.setAttribute("y1", "0%");
		gradient.setAttribute("x2", "100%");
		gradient.setAttribute("y2", "100%");

		const stop1 = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"stop"
		);
		stop1.setAttribute("offset", "0%");
		stop1.setAttribute("stop-color", "#f8fafc");

		const stop2 = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"stop"
		);
		stop2.setAttribute("offset", "100%");
		stop2.setAttribute("stop-color", "#dbeafe");

		gradient.appendChild(stop1);
		gradient.appendChild(stop2);
		defs.appendChild(gradient);
		exportSvg.appendChild(defs);

		const background = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"rect"
		);
		background.setAttribute("x", visibleLeft.toString());
		background.setAttribute("y", visibleTop.toString());
		background.setAttribute("width", visibleWidth.toString());
		background.setAttribute("height", visibleHeight.toString());
		background.setAttribute("fill", "url(#bgGradient)");
		exportSvg.appendChild(background);

		const transformGroup = svgRef.current.querySelector(
			'g[style*="transform"]'
		);
		if (transformGroup) {
			const clonedGroup = transformGroup.cloneNode(true) as SVGGElement;

			clonedGroup.removeAttribute("style");

			const foreignObjects = clonedGroup.querySelectorAll("foreignObject");
			foreignObjects.forEach((fo) => {
				const parentG = fo.parentElement;
				if (!parentG) return;

				const nodeId =
					parentG.getAttribute("data-node-id") ||
					Array.from(parentG.children)
						.find(
							(child) => child.tagName === "rect" && child.getAttribute("x")
						)
						?.getAttribute("x");

				const x = parseFloat(fo.getAttribute("x") || "0");
				const y = parseFloat(fo.getAttribute("y") || "0");
				const width = parseFloat(fo.getAttribute("width") || "0");

				const node = nodes.find((n) => {
					const nodeX = n.x - NODE_RADIUS;
					return Math.abs(nodeX - (x + 12)) < 1;
				});

				if (node) {
					const mainText = document.createElementNS(
						"http://www.w3.org/2000/svg",
						"text"
					);
					mainText.setAttribute("x", (x + width / 2).toString());
					mainText.setAttribute("y", (y + 25).toString());
					mainText.setAttribute("text-anchor", "middle");
					mainText.setAttribute(
						"font-family",
						"system-ui, -apple-system, sans-serif"
					);
					mainText.setAttribute("font-size", "16");
					mainText.setAttribute("font-weight", "600");
					mainText.setAttribute("fill", "#1e293b");
					mainText.textContent = node.label;

					const typeText = document.createElementNS(
						"http://www.w3.org/2000/svg",
						"text"
					);
					typeText.setAttribute("x", (x + width / 2).toString());
					typeText.setAttribute("y", (y + 45).toString());
					typeText.setAttribute("text-anchor", "middle");
					typeText.setAttribute(
						"font-family",
						"system-ui, -apple-system, sans-serif"
					);
					typeText.setAttribute("font-size", "14");
					typeText.setAttribute("font-weight", "500");
					typeText.setAttribute("fill", "#64748b");
					typeText.setAttribute("opacity", "0.9");
					typeText.textContent =
						node.type.charAt(0).toUpperCase() + node.type.slice(1);

					parentG.insertBefore(mainText, fo);
					parentG.insertBefore(typeText, fo);
				}

				fo.remove();
			});

			exportSvg.appendChild(clonedGroup);
		}

		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(exportSvg);
		const svg64 = btoa(unescape(encodeURIComponent(svgString)));
		const image64 = "data:image/svg+xml;base64," + svg64;

		const img = new window.Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			const ctx = canvas.getContext("2d")!;
			ctx.drawImage(img, 0, 0);

			const png = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.download = "dependency-graph.png";
			link.href = png;
			link.click();
		};
		img.src = image64;
	};

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Delete" && selectedNodeId) {
				handleDeleteNode(selectedNodeId);
			} else if (e.key === "Delete" && selectedEdgeId) {
				handleDeleteEdge(selectedEdgeId);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [selectedNodeId, selectedEdgeId]);

	useEffect(() => {
		localStorage.setItem("graph_nodes", JSON.stringify(nodes));
		localStorage.setItem("graph_edges", JSON.stringify(edges));
	}, [nodes, edges]);

	const edgeHighlightColor = (e: Edge) =>
		e.id === selectedEdgeId ? COLORS.selection : COLORS.primary;

	return (
		<div
			ref={containerRef}
			className="h-screen w-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden flex flex-col"
		>
			{}
			<header className="px-8 py-5 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white shadow-sm">
				<div className="flex items-center gap-4">
					<div className="flex items-center">
						<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
							<FiMaximize2 className="text-white text-xl" />
						</div>
						<h1 className="ml-3 text-2xl font-bold text-slate-800">
							DependencyGraph
						</h1>
					</div>
					<button
						onClick={handleAddNode}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
					>
						<FiPlus size={18} /> <span>Add Node</span>
					</button>
					<button
						onClick={exportAsPNG}
						className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all"
					>
						<FiDownload size={18} /> <span>Export PNG</span>
					</button>
				</div>

				<div className="flex items-center gap-5">
					<div className="relative">
						<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							placeholder="Search nodes..."
							onChange={(e) => {
								const q = e.target.value.trim().toLowerCase();
								const hit = nodes.find((n) =>
									n.label.toLowerCase().includes(q)
								);
								if (hit) {
									setSelectedNodeId(hit.id);
									handleCenterNode(hit.id);
								}
							}}
							className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56 text-slate-700"
						/>
					</div>

					<div className="flex items-center">
						<label className="text-slate-700 font-medium mr-2">Group By:</label>
						<select
							value={groupBy}
							onChange={(e) => setGroupBy(e.target.value as GroupBy)}
							className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
						>
							<option value="none">None</option>
							<option value="type">Type</option>
							<option value="status">Status</option>
						</select>
					</div>

					<div className="text-slate-500 text-sm hidden md:block">
						Drag to pan/zoom • Click node to edit • Click edge to select
					</div>
				</div>
			</header>

			{}
			<div className="flex-1 relative min-h-[350px] min-w-[350px]">
				{}
				<svg
					ref={svgRef}
					width={canvasSize[0]}
					height={canvasSize[1]}
					className="w-full h-full touch-none bg-gradient-to-br from-slate-50 to-blue-50 block"
					style={{
						cursor:
							isPanning || draggingNodeId
								? "grabbing"
								: creatingEdgeSourceId
								? "crosshair"
								: "grab",
						userSelect: "none",
					}}
					tabIndex={0}
					onPointerDown={handleBackgroundPointerDown}
					onPointerUp={handlePointerUp}
					onPointerMove={handlePointerMove}
					onWheel={handleWheel}
					onClick={() => {
						setSelectedEdgeId(null);
						setSelectedNodeId(null);
					}}
				>
					{}
					<g
						style={{
							transition: "transform 0.33s cubic-bezier(.4,1.6,.2,1)",
							transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
						}}
					>
						{}
						{groupBy !== "none" &&
							Object.entries(
								groupLayout(nodes, groupBy, canvasSize[0], canvasSize[1])
							).map(([key, group]) => (
								<g key={key}>
									<ellipse
										cx={group.cx}
										cy={group.cy}
										rx={130 + group.nodes.length * 30}
										ry={105 + group.nodes.length * 20}
										fill={group.color + "15"}
										stroke={group.color + "77"}
										strokeWidth={2}
										style={{
											transition: "all 0.5s cubic-bezier(.4,1,.5,1)",
											filter: "blur(0.3px)",
										}}
									/>
									<text
										x={group.cx}
										y={group.cy - 110 - group.nodes.length * 8}
										fill={COLORS.text}
										fontSize={18}
										style={{
											fontWeight: 600,
											letterSpacing: ".03em",
											textShadow: "0 2px 6px rgba(0,0,0,0.1)",
											filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
											pointerEvents: "none",
											opacity: 0.9,
											transition: "all 0.5s",
										}}
										textAnchor="middle"
									>
										{key.charAt(0).toUpperCase() + key.slice(1)}
									</text>
								</g>
							))}

						{}
						{edges.map((e) => {
							const source = nodes.find((n) => n.id === e.source);
							const target = nodes.find((n) => n.id === e.target);
							if (!source || !target) return null;

							const dx = target.x - source.x;
							const dy = target.y - source.y;
							const len = Math.sqrt(dx * dx + dy * dy);
							const normX = dx / len;
							const normY = dy / len;
							const endX = target.x - normX * (NODE_RADIUS + 4);
							const endY = target.y - normY * (NODE_RADIUS + 4);
							const startX = source.x + normX * (NODE_RADIUS + 4);
							const startY = source.y + normY * (NODE_RADIUS + 4);

							const arrowSize = 11;
							const arrowAngle = 0.42;
							const ax1 =
								endX - arrowSize * Math.cos(Math.atan2(dy, dx) - arrowAngle);
							const ay1 =
								endY - arrowSize * Math.sin(Math.atan2(dy, dx) - arrowAngle);
							const ax2 =
								endX - arrowSize * Math.cos(Math.atan2(dy, dx) + arrowAngle);
							const ay2 =
								endY - arrowSize * Math.sin(Math.atan2(dy, dx) + arrowAngle);

							return (
								<g
									key={e.id}
									onClick={(ev) => {
										ev.stopPropagation();
										setSelectedEdgeId(e.id);
										setSelectedNodeId(null);
									}}
									onDoubleClick={(ev) => {
										ev.stopPropagation();
										setEdges((prev) =>
											prev.map((ed) =>
												ed.id === e.id
													? { ...ed, source: ed.target, target: ed.source }
													: ed
											)
										);
									}}
									onContextMenu={(ev) => {
										ev.preventDefault();
										setDeletingEdgeId(e.id);
									}}
									className="cursor-pointer transition-opacity duration-200"
									style={{ opacity: e.id === selectedEdgeId ? 1 : 0.8 }}
								>
									<line
										x1={startX}
										y1={startY}
										x2={endX}
										y2={endY}
										stroke={edgeHighlightColor(e)}
										strokeWidth={EDGE_WIDTH}
										markerEnd=""
										style={{
											transition: "stroke 0.18s",
											filter:
												e.id === selectedEdgeId
													? "drop-shadow(0 0 4px rgba(186,230,253,0.6))"
													: "none",
										}}
									/>
									{}
									<polygon
										points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
										fill={edgeHighlightColor(e)}
										opacity={0.95}
									/>
									{selectedEdgeId === e.id && (
										<g
											onClick={(ev) => {
												ev.stopPropagation();
												handleDeleteEdge(e.id);
											}}
											className="cursor-pointer"
										>
											<rect
												x={(startX + endX) / 2 - 12}
												y={(startY + endY) / 2 - 12}
												width={25}
												height={25}
												rx={7}
												fill="#fff"
												fillOpacity={0.95}
												className="shadow-md"
											/>
											<g
												transform={`translate(${(startX + endX) / 2 - 6}, ${
													(startY + endY) / 2 - 6
												})`}
												className="pointer-events-none"
											>
												<FiTrash2 size={14} className="text-red-500" />
											</g>
										</g>
									)}
								</g>
							);
						})}

						{}
						{nodes.map((n) => (
							<g
								key={n.id}
								style={{
									cursor: creatingEdgeSourceId
										? "crosshair"
										: draggingNodeId === n.id
										? "grabbing"
										: "pointer",
									transition: "filter 0.2s",
									filter:
										selectedNodeId === n.id
											? "drop-shadow(0 0 10px rgba(186,230,253,0.8))"
											: "none",
									zIndex: 2,
								}}
								onPointerDown={(e) => handleNodePointerDown(e, n.id)}
								onPointerUp={(e) => {
									if (creatingEdgeSourceId && creatingEdgeSourceId !== n.id) {
										handleCompleteEdgeCreate(n.id);
									}
								}}
								onClick={(e) => {
									e.stopPropagation();
									if (creatingEdgeSourceId) {
									} else {
										setSelectedNodeId(n.id);
										setEditingNode(null);
									}
								}}
								onDoubleClick={(e) => {
									e.stopPropagation();
									setEditingNode(n);
									setAddingNode(false);
								}}
								onContextMenu={(e) => {
									e.preventDefault();
									handleDeleteNode(n.id);
								}}
							>
								<rect
									x={n.x - NODE_RADIUS}
									y={n.y - NODE_RADIUS}
									width={NODE_RADIUS * 2}
									height={NODE_RADIUS * 2}
									rx={16}
									fill="white"
									stroke={STATUS_COLORS[n.status]}
									strokeWidth={4}
									style={{
										transition: "stroke 0.22s, filter 0.16s",
										filter:
											n.status === "critical"
												? "drop-shadow(0 0 12px rgba(239,68,68,0.3))"
												: n.status === "warning"
												? "drop-shadow(0 0 10px rgba(245,158,11,0.3))"
												: "drop-shadow(0 0 8px rgba(34,197,94,0.3))",
									}}
								/>
								{}
								<circle
									cx={n.x + NODE_RADIUS * 0.65}
									cy={n.y - NODE_RADIUS * 0.65}
									r={10}
									fill={STATUS_COLORS[n.status]}
									stroke="#fff"
									strokeWidth={2.3}
									style={{
										filter:
											n.status === "critical"
												? "drop-shadow(0 0 4px rgba(239,68,68,0.6))"
												: n.status === "warning"
												? "drop-shadow(0 0 2px rgba(245,158,11,0.6))"
												: "drop-shadow(0 0 2.5px rgba(34,197,94,0.6))",
									}}
								/>
								{}
								<foreignObject
									x={n.x - NODE_RADIUS - 12}
									y={n.y - 34}
									width={NODE_RADIUS * 2 + 24}
									height={68}
									className="pointer-events-none"
								>
									<div className="text-center p-2">
										<div className="text-sm font-semibold text-slate-800 leading-tight tracking-wide break-words p-0.5 select-none">
											{n.label}
										</div>
										<div className="text-sm text-slate-500 text-center tracking-wide font-medium mt-0.5 opacity-90">
											{n.type.charAt(0).toUpperCase() + n.type.slice(1)}
										</div>
									</div>
								</foreignObject>

								{}
								{selectedNodeId === n.id && !creatingEdgeSourceId && (
									<g>
										{}
										<g
											onClick={(e) => {
												e.stopPropagation();
												handleEditNode(n);
											}}
											className="cursor-pointer"
										>
											<rect
												x={n.x - 16}
												y={n.y + NODE_RADIUS - 20}
												width={32}
												height={32}
												rx={6}
												fill="white"
												className="shadow-md"
											/>
											<g
												transform={`translate(${n.x - 8}, ${
													n.y + NODE_RADIUS - 12
												})`}
												className="pointer-events-none"
											>
												<FiEdit3 size={16} className="text-blue-600" />
											</g>
										</g>

										{}
										<g
											onClick={(e) => {
												e.stopPropagation();
												handleCenterNode(n.id);
											}}
											className="cursor-pointer"
										>
											<rect
												x={n.x + NODE_RADIUS - 14}
												y={n.y - 12}
												width={25}
												height={25}
												rx={7}
												fill="white"
												fillOpacity={0.95}
												className="shadow-sm"
											/>
											<g
												transform={`translate(${n.x + NODE_RADIUS - 8.5}, ${
													n.y - 5
												})`}
												className="pointer-events-none"
											>
												<FiTarget size={14} className="text-indigo-600" />
											</g>
										</g>

										{}
										<g
											onClick={(e) => {
												e.stopPropagation();
												handleStartEdgeCreate(n.id);
											}}
											className="cursor-crosshair"
										>
											<rect
												x={n.x - NODE_RADIUS - 12}
												y={n.y - 12}
												width={25}
												height={25}
												rx={7}
												fill="white"
												fillOpacity={0.95}
												className="shadow-sm"
											/>
											<g
												transform={`translate(${n.x - NODE_RADIUS - 6.5}, ${
													n.y - 5
												})`}
												className="pointer-events-none"
											>
												<FiPlus size={14} className="text-blue-600" />
											</g>
										</g>
									</g>
								)}

								{}
								{creatingEdgeSourceId && creatingEdgeSourceId !== n.id && (
									<circle
										cx={n.x}
										cy={n.y}
										r={NODE_RADIUS + 6}
										fill="none"
										stroke={COLORS.primary}
										strokeDasharray="4 3"
										strokeWidth={3}
										opacity={0.6}
									/>
								)}
							</g>
						))}

						{}
						{creatingEdgeSourceId && (
							<EdgePreview
								source={nodes.find((n) => n.id === creatingEdgeSourceId)!}
								svgRef={svgRef}
								offset={offset}
								zoom={zoom}
							/>
						)}
					</g>
				</svg>

				{}
				<div className="absolute left-5 bottom-5 z-10 flex flex-col gap-2">
					<button
						onClick={zoomIn}
						className="w-10 h-10 rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xl font-semibold transition-colors"
					>
						<FiPlus size={20} />
					</button>
					<button
						onClick={zoomOut}
						className="w-10 h-10 rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xl font-semibold transition-colors"
					>
						–
					</button>
				</div>

				{}
				<MiniMap
					nodes={nodes}
					edges={edges}
					offset={offset}
					zoom={zoom}
					canvasSize={canvasSize}
					offsetSetter={setOffset}
				/>

				{}
				{(addingNode || editingNode) && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
						onClick={() => {
							setAddingNode(false);
							setEditingNode(null);
						}}
					>
						<form
							onSubmit={handleNodeFormSubmit}
							className="bg-white rounded-xl shadow-2xl p-6 w-[380px] max-w-[90vw]"
							onClick={(e) => e.stopPropagation()}
							autoComplete="off"
						>
							<h2 className="text-xl font-bold text-slate-800 mb-5 text-center">
								{addingNode ? "Add Node" : "Edit Node"}
							</h2>

							<div className="mb-4">
								<label className="block text-slate-700 font-medium mb-1">
									Name
								</label>
								<input
									type="text"
									value={nodeForm.label}
									required
									onChange={(e) =>
										handleNodeFormChange("label", e.target.value)
									}
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									maxLength={34}
									autoFocus
								/>
							</div>

							<div className="mb-4">
								<label className="block text-slate-700 font-medium mb-1">
									Type
								</label>
								<select
									value={nodeForm.type}
									onChange={(e) => handleNodeFormChange("type", e.target.value)}
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{NODE_TYPE_OPTIONS.map((opt) => (
										<option value={opt.value} key={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							<div className="mb-6">
								<label className="block text-slate-700 font-medium mb-1">
									Status
								</label>
								<select
									value={nodeForm.status}
									onChange={(e) =>
										handleNodeFormChange("status", e.target.value)
									}
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									{NODE_STATUS_OPTIONS.map((opt) => (
										<option value={opt.value} key={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							<div className="flex gap-3 justify-center">
								<button
									type="submit"
									className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md"
								>
									{addingNode ? "Add" : "Save"}
								</button>
								<button
									type="button"
									onClick={() => {
										setEditingNode(null);
										setAddingNode(false);
									}}
									className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{}
				{deletingEdgeId && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
						onClick={() => setDeletingEdgeId(null)}
					>
						<div
							className="bg-white rounded-xl shadow-xl p-6 w-[300px] max-w-[90vw]"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="text-slate-800 font-medium mb-6 text-center">
								Delete this dependency?
							</div>
							<div className="flex gap-3 justify-center">
								<button
									className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-md"
									onClick={() => handleDeleteEdge(deletingEdgeId)}
								>
									<FiTrash2 size={16} /> Delete
								</button>
								<button
									className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
									onClick={() => setDeletingEdgeId(null)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{}
			<footer className="bg-white border-t border-slate-200 py-3 px-8">
				<div className="flex justify-between items-center">
					<p className="text-slate-600 text-sm font-medium">
						<span className="text-blue-600 font-semibold">Tip:</span>{" "}
						Double-click a node to edit, drag to move, or right-click to remove
					</p>
					<p className="text-slate-500 text-sm">
						© {new Date().getFullYear()} DependencyGraph
					</p>
				</div>
			</footer>
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap");

				* {
					font-family: "Manrope", sans-serif;
				}
			`}</style>
		</div>
	);
};

const EdgePreview: React.FC<{
	source: Node;
	svgRef: React.RefObject<SVGSVGElement | null>;
	offset: { x: number; y: number };
	zoom: number;
}> = ({ source, svgRef, offset, zoom }) => {
	const [pos, setPos] = useState<{ x: number; y: number }>({
		x: source.x,
		y: source.y,
	});

	useEffect(() => {
		const move = (ev: MouseEvent) => {
			if (!svgRef.current) return;
			const svg = svgRef.current;

			const rect = svg.getBoundingClientRect();
			const clientX = ev.clientX - rect.left;
			const clientY = ev.clientY - rect.top;

			const x = (clientX - offset.x) / zoom;
			const y = (clientY - offset.y) / zoom;

			setPos({ x, y });
		};

		document.addEventListener("mousemove", move);
		return () => document.removeEventListener("mousemove", move);
	}, [svgRef, offset, zoom]);

	return (
		<line
			x1={source.x}
			y1={source.y}
			x2={pos.x}
			y2={pos.y}
			stroke={COLORS.primary}
			strokeWidth={2}
			strokeDasharray="4 3"
			opacity={0.7}
			style={{
				pointerEvents: "none",
			}}
		/>
	);
};

const MiniMap: React.FC<{
	nodes: Node[];
	edges: Edge[];
	offset: { x: number; y: number };
	offsetSetter: (o: { x: number; y: number }) => void;
	zoom: number;
	canvasSize: [number, number];
}> = ({ nodes, edges, offset, zoom, canvasSize, offsetSetter }) => {
	const size = 160;
	const pad = 120;

	const xs = [
		...nodes.map((n) => n.x),
		-offset.x / zoom,
		(-offset.x + canvasSize[0]) / zoom,
	];
	const ys = [
		...nodes.map((n) => n.y),
		-offset.y / zoom,
		(-offset.y + canvasSize[1]) / zoom,
	];

	const minX = Math.min(...xs) - pad,
		maxX = Math.max(...xs) + pad;
	const minY = Math.min(...ys) - pad,
		maxY = Math.max(...ys) + pad;
	const spanX = maxX - minX,
		spanY = maxY - minY;
	const scale = size / Math.max(spanX, spanY);
	const viewW = Math.min(size, (canvasSize[0] * scale) / zoom);
	const viewH = Math.min(size, (canvasSize[1] * scale) / zoom);

	return (
		<svg
			width={size}
			height={size}
			className="absolute bottom-4 right-4 bg-white/30 rounded-lg backdrop-blur-sm shadow-lg z-10"
			onClick={(ev) => {
				const svgEl = ev.currentTarget as SVGSVGElement;
				const rect = svgEl.getBoundingClientRect();
				const mx = ev.clientX - rect.left;
				const my = ev.clientY - rect.top;

				const worldX = mx / scale + minX;
				const worldY = my / scale + minY;
				const [cw, ch] = canvasSize;
				offsetSetter({
					x: cw / 2 - worldX * zoom,
					y: ch / 2 - worldY * zoom,
				});
			}}
		>
			{edges.map((e) => {
				const s = nodes.find((n) => n.id === e.source)!;
				const t = nodes.find((n) => n.id === e.target)!;
				if (!s || !t) return null;
				return (
					<line
						key={e.id}
						x1={(s.x - minX) * scale}
						y1={(s.y - minY) * scale}
						x2={(t.x - minX) * scale}
						y2={(t.y - minY) * scale}
						stroke={COLORS.primary}
						strokeOpacity={0.6}
						strokeWidth={1}
					/>
				);
			})}

			{nodes.map((n) => (
				<circle
					key={n.id}
					cx={(n.x - minX) * scale}
					cy={(n.y - minY) * scale}
					r={4}
					fill={STATUS_COLORS[n.status]}
				/>
			))}

			<rect
				x={(-offset.x / zoom - minX) * scale}
				y={(-offset.y / zoom - minY) * scale}
				width={viewW}
				height={viewH}
				stroke="#fff"
				strokeWidth={1.5}
				fill="rgba(59, 130, 246, 0.1)"
				strokeOpacity={0.8}
			/>
		</svg>
	);
};

export default DependencyGraphApp;
