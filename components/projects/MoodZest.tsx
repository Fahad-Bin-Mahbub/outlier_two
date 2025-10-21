"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
	FiInfo,
	FiRotateCcw,
	FiRotateCw,
	FiGrid,
	FiImage,
	FiType,
	FiSquare,
	FiCircle,
	FiTriangle,
	FiEdit2,
	FiTrash2,
	FiArrowLeft,
	FiArrowRight,
	FiDownload,
	FiRefreshCw,
	FiChevronUp,
	FiChevronDown,
	FiCheck,
	FiMove,
	FiXCircle,
} from "react-icons/fi";
import { BsEraser } from "react-icons/bs";
import { BiSolidSquare } from "react-icons/bi";
import { MdOutlineDragIndicator } from "react-icons/md";

function MoodZest() {
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([[]]);
	const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
	const [historyIndex, setHistoryIndex] = useState(0);

	const [selectedElement, setSelectedElement] = useState(null);
	const [backgroundPattern, setBackgroundPattern] = useState("grid");
	const [currentTheme, setCurrentTheme] = useState({
		name: "Dark Blue",
		background: "#1a1f2e",
		toolbar: "#2d3748",
		toolbarBorder: "rgba(255, 255, 255, 0.1)",
		elementBorder: "#718096",
		textColor: "#ffffff",
		toolbarTransparent: "rgba(45, 55, 72, 0.75)",
	});
	const [showWatermark, setShowWatermark] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [initialPinchDistance, setInitialPinchDistance] = useState(null);
	const [initialRotation, setInitialRotation] = useState(0);
	const [elementStartRotation, setElementStartRotation] = useState(0);
	const [elementStartScale, setElementStartScale] = useState(1);
	const [isResizing, setIsResizing] = useState(false);
	const [isRotating, setIsRotating] = useState(false);
	const [resizeStart, setResizeStart] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});
	const [resizeDirection, setResizeDirection] = useState(null);
	const [rotateStartAngle, setRotateStartAngle] = useState(0);
	const [isDrawingMode, setIsDrawingMode] = useState(false);
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentPath, setCurrentPath] = useState("");
	const [brushSize, setBrushSize] = useState(3);
	const [brushColor, setBrushColor] = useState("#ffffff");
	const [isErasing, setIsErasing] = useState(false);
	const [eraserSize, setEraserSize] = useState(20);
	const [mousePosition, setMousePosition] = useState(null);
	const [isPanelVisible, setIsPanelVisible] = useState(false);
	const [shapeColor, setShapeColor] = useState("#4a90e2");
	const [shapeFillStyle, setShapeFillStyle] = useState("filled");
	const [shapeBorderWidth, setShapeBorderWidth] = useState(3);

	const [editingText, setEditingText] = useState(null);
	const [textColor, setTextColor] = useState("#ffffff");
	const [isMobile, setIsMobile] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const boardRef = useRef(null);
	const fileInputRef = useRef(null);
	const canvasRef = useRef(null);
	const mobileScrollContainerRef = useRef(null);

	const editingTextRef = useRef(null);
	const saveTextTimeout = useRef(null);
	const headerRef = useRef(null);
	const footerRef = useRef(null);
	const dragOffsetRef = useRef(dragOffset);
	const selectedElementRef = useRef(selectedElement);
	const isDraggingRef = useRef(isDragging);
	const elementsRef = useRef(elements);
	const dragElementRef = useRef(null);
	const animationFrameRef = useRef(0);
	const lastMousePos = useRef({ x: 0, y: 0 });
	const dragStartPos = useRef({ x: 0, y: 0 });

	const GRID_SIZE = 20;

	const themes = [
		{
			name: "Dark Blue",
			background: "#1a1f2e",
			toolbar: "#2d3748",
			toolbarBorder: "rgba(255, 255, 255, 0.1)",
			elementBorder: "#718096",
			textColor: "#ffffff",
			toolbarTransparent: "rgba(45, 55, 72, 0.75)",
		},
		{
			name: "Forest Green",
			background: "#134e4a",
			toolbar: "#0f3c3a",
			toolbarBorder: "rgba(240, 253, 250, 0.2)",
			elementBorder: "#0d9488",
			textColor: "#f0fdfa",
			toolbarTransparent: "rgba(15, 60, 58, 0.75)",
		},
		{
			name: "Warm Gray",
			background: "#2d2d2d",
			toolbar: "#404040",
			toolbarBorder: "rgba(255, 255, 255, 0.1)",
			elementBorder: "#666666",
			textColor: "#ffffff",
			toolbarTransparent: "rgba(64, 64, 64, 0.75)",
		},
	];

	const generateId = () =>
		`element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

	const exitDrawingModeInMobile = () => {
		if (!isPanelVisible && isDrawingMode) {
			setIsDrawingMode(false);
			setIsErasing(false);
		}
	};

	const commitUpdate = useCallback(
		(newElements) => {
			setElements(newElements);
			setHistory((prev) => {
				const updatedHistory = prev.slice(0, historyIndex + 1);
				return [...updatedHistory, newElements];
			});
			setHistoryIndex((prev) => prev + 1);
		},
		[historyIndex]
	);

	const undo = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			setElements(history[newIndex]);
		}
	};

	const redo = () => {
		if (historyIndex < history.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			setElements(history[newIndex]);
		}
	};

	const handleMediaUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result;
			if (!content) {
				console.error("FileReader failed to read file content.");
				return;
			}
			const boardRect = boardRef.current?.getBoundingClientRect();
			const boardWidth = boardRect?.width || window.innerWidth;
			const boardHeight = boardRect?.height || window.innerHeight;

			const addElementToBoard = (type, width, height) => {
				const newElement = {
					id: generateId(),
					type,
					content,
					x: boardWidth / 2 - width / 2,
					y: boardHeight / 2 - height / 2,
					width,
					height,
					rotation: 0,
					scale: 1,
					fileName: file.name,
				};
				commitUpdate([...elements, newElement]);
			};

			if (file.type.startsWith("image/")) {
				const img = new Image();
				img.src = content;
				img.onload = () => {
					const maxWidth = 300;
					const maxHeight = 300;
					let width = img.naturalWidth;
					let height = img.naturalHeight;
					if (width > maxWidth) {
						height = (height * maxWidth) / width;
						width = maxWidth;
					}
					if (height > maxHeight) {
						width = (width * maxHeight) / height;
						height = maxHeight;
					}
					addElementToBoard("image", width, height);
				};
				img.onerror = () => {
					console.error("Failed to load image:", file.name);
					const errorElement = {
						id: generateId(),
						type: "text",
						content: `Error loading ${file.name}`,
						x: boardWidth / 2 - 150,
						y: boardHeight / 2 - 50,
						width: 300,
						height: 100,
						rotation: 0,
						scale: 1,
						color: "#ff6b6b",
						fontSize: 16,
						fontWeight: "normal",
					};
					commitUpdate([...elements, errorElement]);
				};
			} else if (file.type.startsWith("video/")) {
				addElementToBoard("video", 300, 200);
			} else if (file.type.startsWith("audio/")) {
				addElementToBoard("audio", 300, 60);
			}
		};
		reader.readAsDataURL(file);

		if (e.target) {
			e.target.value = "";
		}
	};

	const addTextElement = () => {
		const boardRect = boardRef.current?.getBoundingClientRect();
		let boardWidth, boardHeight;

		if (isMobile) {
			boardWidth = Math.max(1200, boardRef.current?.scrollWidth || 1200);
			boardHeight = boardRef.current?.scrollHeight || window.innerHeight;
		} else {
			boardWidth = boardRect?.width || window.innerWidth;
			boardHeight = boardRect?.height || window.innerHeight;
		}

		const textWidth = 200;
		const textHeight = 50;
		const padding = 20;

		const existingTexts = elements.filter((el) => el.type === "text");

		let newX, newY;

		if (existingTexts.length === 0) {
			newX = boardWidth / 2 - textWidth / 2;
			newY = boardHeight / 2 - textHeight / 2;
		} else {
			const offsetDistance = 120;
			const textsPerRow = Math.floor(
				(boardWidth - padding * 2) / offsetDistance
			);
			const textIndex = existingTexts.length;

			const row = Math.floor(textIndex / textsPerRow);
			const col = textIndex % textsPerRow;

			const startX = padding + textWidth / 2;
			const startY = padding + textHeight / 2;

			newX = startX + col * offsetDistance;
			newY = startY + row * offsetDistance;

			if (newX + textWidth > boardWidth - padding) {
				newX = boardWidth - textWidth - padding;
			}
			if (newY + textHeight > boardHeight - padding) {
				newY = boardHeight - textHeight - padding;
			}

			const hasOverlap = existingTexts.some((text) => {
				const distance = Math.sqrt(
					Math.pow(text.x - newX, 2) + Math.pow(text.y - newY, 2)
				);
				return distance < textWidth;
			});

			if (hasOverlap) {
				const randomOffsetX = (Math.random() - 0.5) * 80;
				const randomOffsetY = (Math.random() - 0.5) * 80;

				newX = Math.max(
					padding,
					Math.min(boardWidth - textWidth - padding, newX + randomOffsetX)
				);
				newY = Math.max(
					padding,
					Math.min(boardHeight - textHeight - padding, newY + randomOffsetY)
				);
			}
		}

		const newElement = {
			id: generateId(),
			type: "text",
			content: "Your Text Here",
			x: newX,
			y: newY,
			width: textWidth,
			height: textHeight,
			rotation: 0,
			scale: 1,
			color: textColor,
			fontSize: 24,
			fontWeight: "600",
		};
		commitUpdate([...elements, newElement]);
	};

	const addShapeElement = (shapeType) => {
		const boardRect = boardRef.current?.getBoundingClientRect();
		let boardWidth, boardHeight;

		if (isMobile) {
			boardWidth = Math.max(1200, boardRef.current?.scrollWidth || 1200);
			boardHeight = boardRef.current?.scrollHeight || window.innerHeight;
		} else {
			boardWidth = boardRect?.width || window.innerWidth;
			boardHeight = boardRect?.height || window.innerHeight;
		}

		const shapeSize = 150;
		const padding = 20;

		const existingShapes = elements.filter(
			(el) => el.type === "shape" && el.shapeType === shapeType
		);

		let newX, newY;

		if (existingShapes.length === 0) {
			newX = boardWidth / 2 - shapeSize / 2;
			newY = boardHeight / 2 - shapeSize / 2;
		} else {
			const offsetDistance = 180;
			const shapesPerRow = Math.floor(
				(boardWidth - padding * 2) / offsetDistance
			);
			const shapeIndex = existingShapes.length;

			const row = Math.floor(shapeIndex / shapesPerRow);
			const col = shapeIndex % shapesPerRow;

			const startX = padding + shapeSize / 2;
			const startY = padding + shapeSize / 2;

			newX = startX + col * offsetDistance;
			newY = startY + row * offsetDistance;

			if (newX + shapeSize > boardWidth - padding) {
				newX = boardWidth - shapeSize - padding;
			}
			if (newY + shapeSize > boardHeight - padding) {
				newY = boardHeight - shapeSize - padding;
			}

			const hasOverlap = existingShapes.some((shape) => {
				const distance = Math.sqrt(
					Math.pow(shape.x - newX, 2) + Math.pow(shape.y - newY, 2)
				);
				return distance < shapeSize;
			});

			if (hasOverlap) {
				const randomOffsetX = (Math.random() - 0.5) * 100;
				const randomOffsetY = (Math.random() - 0.5) * 100;

				newX = Math.max(
					padding,
					Math.min(boardWidth - shapeSize - padding, newX + randomOffsetX)
				);
				newY = Math.max(
					padding,
					Math.min(boardHeight - shapeSize - padding, newY + randomOffsetY)
				);
			}
		}

		const newElement = {
			id: generateId(),
			type: "shape",
			content: "",
			x: newX,
			y: newY,
			width: shapeSize,
			height: shapeSize,
			rotation: 0,
			scale: 1,
			color: shapeColor,
			shapeType,
			fillStyle: shapeFillStyle,
			borderWidth: shapeBorderWidth,
		};
		commitUpdate([...elements, newElement]);
	};

	const handleMouseDown = (e, elementId) => {
		if (isDrawingMode) {
			setSelectedElement(elementId);
			return;
		}

		const el = elements.find((el) => el.id === elementId);
		if (el?.type === "text") {
			if (
				editingText &&
				editingText.id === elementId &&
				e.target === editingTextRef.current
			) {
				return;
			}
			if (
				editingTextRef.current &&
				selectedElement === elementId &&
				editingText &&
				editingText.id === elementId
			) {
				const currentText = editingTextRef.current.textContent || "";
				setElements((prev) =>
					prev.map((elem) =>
						elem.id === elementId ? { ...elem, content: currentText } : elem
					)
				);
				setEditingText(null);
			}
		}

		e.preventDefault();

		setSelectedElement(elementId);

		const element = elements.find((el) => el.id === elementId);
		if (element && boardRef.current) {
			const rect = boardRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			dragStartPos.current = { x: element.x, y: element.y };
			lastMousePos.current = { x: mouseX, y: mouseY };

			setDragOffset({
				x: mouseX - element.x,
				y: mouseY - element.y,
			});

			const domElement = document.querySelector(
				`[data-element-id="${elementId}"]`
			);
			if (domElement) {
				dragElementRef.current = domElement;
			}
		}
	};

	const startDragIfNeeded = useCallback(
		(mouseX, mouseY) => {
			if (!isDragging && selectedElement && dragElementRef.current) {
				const deltaX = Math.abs(mouseX - lastMousePos.current.x);
				const deltaY = Math.abs(mouseY - lastMousePos.current.y);

				if (deltaX > 3 || deltaY > 3) {
					setIsDragging(true);
					isDraggingRef.current = true;

					if (dragElementRef.current) {
						dragElementRef.current.style.pointerEvents = "none";
						dragElementRef.current.style.zIndex = "9999";
					}

					return true;
				}
			}
			return false;
		},
		[isDragging, selectedElement]
	);

	const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

	const handleMouseMove = useCallback(
		(e) => {
			if (!boardRef.current) return;

			const rect = boardRef.current.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			if (!isDragging && selectedElement && dragElementRef.current) {
				startDragIfNeeded(mouseX, mouseY);
			}

			lastMousePos.current = { x: mouseX, y: mouseY };

			if (isDraggingRef.current && selectedElement && dragElementRef.current) {
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}

				animationFrameRef.current = requestAnimationFrame(() => {
					if (!boardRef.current || !dragElementRef.current) return;

					const rect = boardRef.current.getBoundingClientRect();
					let newX = lastMousePos.current.x - dragOffset.x;
					let newY = lastMousePos.current.y - dragOffset.y;

					const elementRect = dragElementRef.current.getBoundingClientRect();
					const elementWidth = elementRect.width;
					const elementHeight = elementRect.height;

					newX = Math.max(0, Math.min(newX, rect.width - elementWidth));
					newY = Math.max(0, Math.min(newY, rect.height - elementHeight));

					if (backgroundPattern === "grid") {
						newX = snapToGrid(newX);
						newY = snapToGrid(newY);
					}

					dragElementRef.current.style.transform = `translate(${
						newX - dragStartPos.current.x
					}px, ${newY - dragStartPos.current.y}px)`;
				});
			} else if (isResizing && selectedElement) {
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}

				animationFrameRef.current = requestAnimationFrame(() => {
					setElements((prev) => {
						const element = prev.find((el) => el.id === selectedElement);
						if (!element) return prev;

						let newWidth = element.width;
						let newHeight = element.height;

						const deltaX = e.clientX - resizeStart.x;
						const deltaY = e.clientY - resizeStart.y;

						if (
							resizeDirection === "horizontal" ||
							resizeDirection === "both"
						) {
							newWidth = Math.max(
								50,
								Math.min(resizeStart.width + deltaX, rect.width - element.x)
							);
						}
						if (resizeDirection === "vertical" || resizeDirection === "both") {
							newHeight = Math.max(
								50,
								Math.min(resizeStart.height + deltaY, rect.height - element.y)
							);
						}

						return prev.map((el) =>
							el.id === selectedElement
								? { ...el, width: newWidth, height: newHeight, scale: 1 }
								: el
						);
					});
				});
			} else if (isRotating && selectedElement) {
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}

				animationFrameRef.current = requestAnimationFrame(() => {
					setElements((prev) => {
						const element = prev.find((el) => el.id === selectedElement);
						if (!element) return prev;

						const elementCenterX = element.x + element.width / 2;
						const elementCenterY = element.y + element.height / 2;
						const angle =
							(Math.atan2(mouseY - elementCenterY, mouseX - elementCenterX) *
								180) /
							Math.PI;
						const rotation = angle - rotateStartAngle;

						return prev.map((el) =>
							el.id === selectedElement ? { ...el, rotation: rotation } : el
						);
					});
				});
			}
		},
		[
			isDragging,
			selectedElement,
			dragOffset,
			resizeStart,
			resizeDirection,
			backgroundPattern,
			rotateStartAngle,
			isResizing,
			isRotating,
			startDragIfNeeded,
		]
	);

	const handleMouseUp = useCallback(() => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		if (isDraggingRef.current && selectedElement && dragElementRef.current) {
			const rect = boardRef.current?.getBoundingClientRect();
			if (rect) {
				let newX = lastMousePos.current.x - dragOffset.x;
				let newY = lastMousePos.current.y - dragOffset.y;

				const elementRect = dragElementRef.current.getBoundingClientRect();
				const elementWidth = elementRect.width;
				const elementHeight = elementRect.height;

				newX = Math.max(0, Math.min(newX, rect.width - elementWidth));
				newY = Math.max(0, Math.min(newY, rect.height - elementHeight));

				if (backgroundPattern === "grid") {
					newX = snapToGrid(newX);
					newY = snapToGrid(newY);
				}

				setElements((prev) =>
					prev.map((el) =>
						el.id === selectedElement ? { ...el, x: newX, y: newY } : el
					)
				);
			}
		}

		if (dragElementRef.current) {
			dragElementRef.current.style.transform = "";
			dragElementRef.current.style.pointerEvents = "";
			dragElementRef.current.style.zIndex = "";
			dragElementRef.current = null;
		}

		if (isDragging || isResizing || isRotating) {
			setTimeout(() => {
				setElements((current) => {
					commitUpdate(current);
					return current;
				});
			}, 0);
		}

		isDraggingRef.current = false;
		setIsDragging(false);
		setIsResizing(false);
		setIsRotating(false);
		setResizeDirection(null);
		setDragOffset({ x: 0, y: 0 });
	}, [
		isDragging,
		isResizing,
		isRotating,
		selectedElement,
		dragOffset,
		backgroundPattern,
		commitUpdate,
	]);

	const handleTouchStart = (e, elementId) => {
		if (isDrawingMode) {
			if (e.cancelable) {
				e.preventDefault();
				e.stopPropagation();
			}
			setSelectedElement(elementId);
			return;
		}

		const el = elements.find((el) => el.id === elementId);
		if (el?.type === "text") {
			if (
				editingText &&
				editingText.id === elementId &&
				e.target === editingTextRef.current
			) {
				return;
			}
			if (
				editingTextRef.current &&
				selectedElement === elementId &&
				editingText &&
				editingText.id === elementId
			) {
				const currentText = editingTextRef.current.textContent || "";
				updateElement(elementId, { content: currentText });
				setEditingText(null);
			}
		}

		e.preventDefault();
		e.stopPropagation();
		setSelectedElement(elementId);

		if (e.touches.length === 2) {
			const distance = Math.hypot(
				e.touches[0].pageX - e.touches[1].pageX,
				e.touches[0].pageY - e.touches[1].pageY
			);
			setInitialPinchDistance(distance);

			const element = elements.find((el) => el.id === elementId);
			if (element) {
				const initialAngle =
					(Math.atan2(
						e.touches[1].pageY - e.touches[0].pageY,
						e.touches[1].pageX - e.touches[0].pageX
					) *
						180) /
					Math.PI;
				setInitialRotation(initialAngle);
				setElementStartRotation(element.rotation);
				setElementStartScale(element.scale || 1);
			}
		} else if (e.touches.length === 1) {
			setIsDragging(true);
			const element = elements.find((el) => el.id === elementId);
			if (element && boardRef.current) {
				const rect = boardRef.current.getBoundingClientRect();
				setDragOffset({
					x: e.touches[0].clientX - rect.left - element.x,
					y: e.touches[0].clientY - rect.top - element.y,
				});
			}
		}
	};

	const handleTouchMove = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (!selectedElement || !boardRef.current) return;

			if (e.touches.length === 2 && initialPinchDistance !== null) {
				const distance = Math.hypot(
					e.touches[0].pageX - e.touches[1].pageX,
					e.touches[0].pageY - e.touches[1].pageY
				);

				const scaleFactor = distance / initialPinchDistance;

				const currentAngle =
					(Math.atan2(
						e.touches[1].pageY - e.touches[0].pageY,
						e.touches[1].pageX - e.touches[0].pageX
					) *
						180) /
					Math.PI;

				const angleDifference = currentAngle - initialRotation;

				setElements((prev) =>
					prev.map((el) => {
						if (el.id === selectedElement) {
							const newScale = Math.max(
								0.5,
								Math.min(3, elementStartScale * scaleFactor)
							);
							return {
								...el,
								scale: newScale,
								rotation: elementStartRotation + angleDifference,
							};
						}
						return el;
					})
				);
			} else if (e.touches.length === 1 && isDragging) {
				const rect = boardRef.current.getBoundingClientRect();
				const newX = e.touches[0].clientX - rect.left - dragOffset.x;
				const newY = e.touches[0].clientY - rect.top - dragOffset.y;

				setElements((prev) =>
					prev.map((el) =>
						el.id === selectedElement
							? {
									...el,
									x: Math.max(0, Math.min(newX, rect.width - el.width)),
									y: Math.max(0, Math.min(newY, rect.height - el.height)),
							  }
							: el
					)
				);
			}
		},
		[
			selectedElement,
			initialPinchDistance,
			initialRotation,
			elementStartScale,
			elementStartRotation,
			isDragging,
			dragOffset,
		]
	);

	const handleTouchEnd = useCallback(() => {
		if (isDragging || isResizing || isRotating) {
			commitUpdate(elements);
		}
		setInitialPinchDistance(null);
		setInitialRotation(0);
		setElementStartRotation(0);
		setElementStartScale(1);
		setIsDragging(false);
		setIsResizing(false);
		setIsRotating(false);
	}, [isDragging, isResizing, isRotating, elements, commitUpdate]);

	const updateElement = (elementId, updates) => {
		setElements((prev) =>
			prev.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
		);
	};

	const deleteElement = (elementId) => {
		commitUpdate(elements.filter((el) => el.id !== elementId));
		setSelectedElement(null);
	};

	const startResize = (e, elementId, direction) => {
		e.preventDefault();
		e.stopPropagation();

		const element = elements.find((el) => el.id === elementId);
		if (element && boardRef.current) {
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

			setIsResizing(true);
			setSelectedElement(elementId);
			setResizeDirection(direction);
			setResizeStart({
				x: clientX,
				y: clientY,
				width: element.width,
				height: element.height,
			});
		}
	};

	const startRotate = (e, elementId) => {
		e.preventDefault();
		e.stopPropagation();

		const element = elements.find((el) => el.id === elementId);
		if (element && boardRef.current) {
			const rect = boardRef.current.getBoundingClientRect();
			const elementCenterX = element.x + element.width / 2;
			const elementCenterY = element.y + element.height / 2;

			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const mouseX = clientX - rect.left;
			const mouseY = clientY - rect.top;

			const initialAngle =
				(Math.atan2(mouseY - elementCenterY, mouseX - elementCenterX) * 180) /
				Math.PI;

			setIsRotating(true);
			setSelectedElement(elementId);
			setRotateStartAngle(initialAngle - element.rotation);
		}
	};

	const startDrawing = (e) => {
		if (!isDrawingMode || !boardRef.current) return;

		e.preventDefault();
		e.stopPropagation();

		setIsDrawing(true);
		const rect = boardRef.current.getBoundingClientRect();
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		setCurrentPath(`M ${x} ${y}`);
	};

	const getPathBounds = useCallback((pathString) => {
		try {
			const commands = pathString.match(/[ML][^ML]*/g);
			if (!commands) return null;

			let minX = Infinity,
				minY = Infinity,
				maxX = -Infinity,
				maxY = -Infinity;

			commands.forEach((command) => {
				const coords = command
					.slice(1)
					.trim()
					.split(/[\s,]+/);
				for (let i = 0; i < coords.length; i += 2) {
					const x = parseFloat(coords[i]);
					const y = parseFloat(coords[i + 1]);
					if (!isNaN(x) && !isNaN(y)) {
						minX = Math.min(minX, x);
						maxX = Math.max(maxX, x);
						minY = Math.min(minY, y);
						maxY = Math.max(maxY, y);
					}
				}
			});

			return { minX, minY, maxX, maxY };
		} catch (error) {
			return null;
		}
	}, []);

	const distancePointToLineSegment = useCallback((point, start, end) => {
		const A = point.x - start.x;
		const B = point.y - start.y;
		const C = end.x - start.x;
		const D = end.y - start.y;

		const dot = A * C + B * D;
		const lenSq = C * C + D * D;

		if (lenSq === 0) {
			return Math.sqrt(A * A + B * B);
		}

		let param = dot / lenSq;

		let xx, yy;

		if (param < 0) {
			xx = start.x;
			yy = start.y;
		} else if (param > 1) {
			xx = end.x;
			yy = end.y;
		} else {
			xx = start.x + param * C;
			yy = start.y + param * D;
		}

		const dx = point.x - xx;
		const dy = point.y - yy;
		return Math.sqrt(dx * dx + dy * dy);
	}, []);

	const performRealTimeErase = useCallback(
		(eraseX, eraseY) => {
			const threshold = eraserSize / 2;

			setElements((prevElements) => {
				return prevElements
					.map((element) => {
						if (element.type !== "drawing" || element.isEraser) {
							return element;
						}

						const localEraseX = eraseX - element.x;
						const localEraseY = eraseY - element.y;

						const commands = element.content.match(/[ML][^ML]*/g);
						if (!commands) return element;

						const newSegments = [];
						let currentX = 0,
							currentY = 0;
						let hasValidSegments = false;

						for (let i = 0; i < commands.length; i++) {
							const command = commands[i];
							const coords = command
								.slice(1)
								.trim()
								.split(/[\s,]+/);
							const type = command[0];

							if (type === "M" && coords.length >= 2) {
								const x = parseFloat(coords[0]);
								const y = parseFloat(coords[1]);

								currentX = x;
								currentY = y;

								const distance = Math.sqrt(
									(localEraseX - x) ** 2 + (localEraseY - y) ** 2
								);
								if (distance > threshold) {
									newSegments.push(`M ${x} ${y}`);
									hasValidSegments = true;
								}
							} else if (type === "L" && coords.length >= 2) {
								const x = parseFloat(coords[0]);
								const y = parseFloat(coords[1]);

								const distance = distancePointToLineSegment(
									{ x: localEraseX, y: localEraseY },
									{ x: currentX, y: currentY },
									{ x, y }
								);

								if (distance > threshold) {
									if (
										newSegments.length === 0 ||
										!newSegments[newSegments.length - 1].startsWith("M")
									) {
										newSegments.push(`M ${currentX} ${currentY}`);
									}
									newSegments.push(`L ${x} ${y}`);
									hasValidSegments = true;
								} else {
									if (i + 1 < commands.length) {
										const nextCommand = commands[i + 1];
										if (nextCommand[0] === "L") {
											const nextCoords = nextCommand
												.slice(1)
												.trim()
												.split(/[\s,]+/);
											if (nextCoords.length >= 2) {
												const nextX = parseFloat(nextCoords[0]);
												const nextY = parseFloat(nextCoords[1]);

												const nextDistance = distancePointToLineSegment(
													{ x: localEraseX, y: localEraseY },
													{ x, y },
													{ x: nextX, y: nextY }
												);
											}
										}
									}
								}

								currentX = x;
								currentY = y;
							}
						}

						const newPath = newSegments.join(" ").trim();
						if (!hasValidSegments || !newPath) {
							return null;
						}

						return {
							...element,
							content: newPath,
						};
					})
					.filter((element) => element !== null);
			});
		},
		[eraserSize, distancePointToLineSegment]
	);

	const draw = useCallback(
		(e) => {
			if (!isDrawing || !boardRef.current) return;

			e.preventDefault();

			const rect = boardRef.current.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const x = clientX - rect.left;
			const y = clientY - rect.top;

			if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
				if (isErasing) {
					performRealTimeErase(x, y);
				} else {
					setCurrentPath((prev) => `${prev} L ${x} ${y}`);
				}
			}
		},
		[isDrawing, isErasing, performRealTimeErase]
	);

	const endDrawing = useCallback(
		(e) => {
			if (!isDrawing || !currentPath.trim() || !boardRef.current) {
				setIsDrawing(false);
				return;
			}

			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (isErasing) {
			} else {
				const rect = boardRef.current.getBoundingClientRect();
				const pathBounds = getPathBounds(currentPath);

				if (!pathBounds) {
					setIsDrawing(false);
					setCurrentPath("");
					return;
				}

				const padding = Math.max(brushSize, eraserSize) + 10;
				const drawingX = Math.max(0, pathBounds.minX - padding);
				const drawingY = Math.max(0, pathBounds.minY - padding);
				const drawingWidth = Math.min(
					rect.width - drawingX,
					pathBounds.maxX - pathBounds.minX + padding * 2
				);
				const drawingHeight = Math.min(
					rect.height - drawingY,
					pathBounds.maxY - pathBounds.minY + padding * 2
				);

				const offsetX = drawingX - (pathBounds.minX - padding);
				const offsetY = drawingY - (pathBounds.minY - padding);

				const transformedPath = currentPath.replace(
					/([ML])\s*([^ML]*)/g,
					(match, command, coords) => {
						const coordPairs = coords.trim().split(/[\s,]+/);
						const transformedCoords = [];

						for (let i = 0; i < coordPairs.length; i += 2) {
							const x = parseFloat(coordPairs[i]);
							const y = parseFloat(coordPairs[i + 1]);
							if (!isNaN(x) && !isNaN(y)) {
								transformedCoords.push(
									x - drawingX + offsetX,
									y - drawingY + offsetY
								);
							}
						}

						return command + " " + transformedCoords.join(" ");
					}
				);

				let parentShapeId = undefined;

				if (pathBounds) {
					const intersectingShapes = elements.filter((el) => {
						if (el.type !== "shape") return false;

						const shapeLeft = el.x;
						const shapeRight = el.x + el.width * el.scale;
						const shapeTop = el.y;
						const shapeBottom = el.y + el.height * el.scale;

						return !(
							pathBounds.maxX < shapeLeft ||
							pathBounds.minX > shapeRight ||
							pathBounds.maxY < shapeTop ||
							pathBounds.minY > shapeBottom
						);
					});

					if (intersectingShapes.length === 1) {
						parentShapeId = intersectingShapes[0].id;
					}
				}

				const newDrawing = {
					id: generateId(),
					type: "drawing",
					content: transformedPath,
					x: drawingX,
					y: drawingY,
					width: drawingWidth,
					height: drawingHeight,
					rotation: 0,
					scale: 1,
					color: brushColor,
					strokeWidth: brushSize,
					parentId: parentShapeId,
					relativeToParent: !!parentShapeId,
					isEraser: false,
				};

				commitUpdate([...elements, newDrawing]);
			}

			setCurrentPath("");
			setIsDrawing(false);
		},
		[
			isDrawing,
			currentPath,
			brushColor,
			brushSize,
			isErasing,
			eraserSize,
			elements,
			commitUpdate,
			getPathBounds,
		]
	);

	const exportMoodZest = async () => {
		if (!boardRef.current || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = boardRef.current.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;

		ctx.fillStyle = currentTheme.background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		drawBackgroundPattern(ctx, canvas.width, canvas.height);

		for (const element of elements) {
			ctx.save();
			if (element.type === "drawing") {
				const width = element.width * element.scale;
				const height = element.height * element.scale;
				ctx.translate(element.x + width / 2, element.y + height / 2);
				ctx.rotate((element.rotation * Math.PI) / 180);
				ctx.scale(element.scale, element.scale);

				ctx.strokeStyle = element.color || "#ffffff";
				ctx.lineWidth = element.strokeWidth || 3;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";

				const path = new Path2D(element.content);
				ctx.translate(-width / 2, -height / 2);
				ctx.stroke(path);
			} else {
				const width = element.width * element.scale;
				const height = element.height * element.scale;
				ctx.translate(element.x + width / 2, element.y + height / 2);
				ctx.rotate((element.rotation * Math.PI) / 180);

				if (element.type === "image") {
					const img = new Image();
					img.src = element.content;
					await new Promise((resolve) => {
						img.onload = () => {
							ctx.drawImage(img, -width / 2, -height / 2, width, height);
							resolve(null);
						};
						img.onerror = () => {
							ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
							ctx.fillRect(-width / 2, -height / 2, width, height);
							ctx.fillStyle = "#666666";
							ctx.font = "12px sans-serif";
							ctx.textAlign = "center";
							ctx.textBaseline = "middle";
							ctx.fillText("Image failed to load", 0, 0);
							resolve(null);
						};
					});
				} else if (element.type === "video") {
					ctx.fillStyle = "rgba(45, 55, 72, 0.9)";
					ctx.fillRect(-width / 2, -height / 2, width, height);
					ctx.fillStyle = "#ffffff";
					ctx.font = "24px sans-serif";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText("VIDEO", 0, -10);
					ctx.font = "12px sans-serif";
					ctx.fillText(element.fileName || "Video", 0, 15);
				} else if (element.type === "audio") {
					ctx.fillStyle = "rgba(45, 55, 72, 0.9)";
					ctx.fillRect(-width / 2, -height / 2, width, height);
					ctx.fillStyle = "#ffffff";
					ctx.font = "16px sans-serif";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText("AUDIO", -20, 0);
					ctx.font = "10px sans-serif";
					ctx.fillText(element.fileName || "Audio", 20, 0);
				} else if (element.type === "text") {
					ctx.fillStyle = element.color || "#ffffff";
					ctx.font = `${element.fontWeight || "600"} ${
						element.fontSize || 24
					}px 'Manrope', sans-serif`;
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(element.content, 0, 0);
				} else if (element.type === "shape") {
					ctx.strokeStyle = element.color || "#4a90e2";
					ctx.fillStyle = element.color || "#4a90e2";
					ctx.lineWidth = element.borderWidth || 3;

					if (element.shapeType === "circle") {
						ctx.beginPath();
						ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
						if (element.fillStyle === "filled") {
							ctx.fill();
						} else {
							ctx.stroke();
						}
					} else if (element.shapeType === "triangle") {
						ctx.beginPath();
						ctx.moveTo(0, -height / 2);
						ctx.lineTo(-width / 2, height / 2);
						ctx.lineTo(width / 2, height / 2);
						ctx.closePath();
						if (element.fillStyle === "filled") {
							ctx.fill();
						} else {
							ctx.stroke();
						}
					} else {
						if (element.fillStyle === "filled") {
							ctx.fillRect(-width / 2, -height / 2, width, height);
						} else {
							ctx.strokeRect(-width / 2, -height / 2, width, height);
						}
					}
				}
			}
			ctx.restore();
		}

		if (showWatermark) {
			ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
			ctx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif";
			ctx.textAlign = "right";
			ctx.textBaseline = "bottom";
			ctx.fillText(
				"Created with MoodZest",
				canvas.width - 20,
				canvas.height - 20
			);
		}

		canvas.toBlob((blob) => {
			if (blob) {
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `MoodZest-${Date.now()}.png`;
				a.click();
				URL.revokeObjectURL(url);
			}
		});
	};

	const drawBackgroundPattern = (ctx, width, height) => {
		ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
		ctx.lineWidth = 1;

		if (backgroundPattern === "grid") {
			for (let x = 0; x < width; x += 40) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
			for (let y = 0; y < height; y += 40) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
		} else if (backgroundPattern === "dots") {
			ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
			for (let x = 20; x < width; x += 40) {
				for (let y = 20; y < height; y += 40) {
					ctx.beginPath();
					ctx.arc(x, y, 2, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}
	};

	const autoArrangeElements = () => {
		if (!boardRef.current) return;

		let canvasWidth = 0;
		let canvasHeight = 0;

		if (isMobile) {
			canvasWidth = Math.max(1200, boardRef.current.scrollWidth || 1200);
			canvasHeight = boardRef.current.scrollHeight || window.innerHeight;
		} else {
			const boardRect = boardRef.current.getBoundingClientRect();
			canvasWidth = boardRect.width;
			canvasHeight = boardRect.height;
		}

		const nonDrawingElements = elements.filter((el) => el.type !== "drawing");

		if (nonDrawingElements.length === 0) return;

		const idealColumnWidth = 280;
		const padding = 20;
		const maxColumns = Math.max(
			1,
			Math.floor(canvasWidth / (idealColumnWidth + padding))
		);

		const safeCanvasWidth = canvasWidth - padding * 2;
		const numColumns = Math.min(maxColumns, nonDrawingElements.length);

		const columnWidth =
			(safeCanvasWidth - padding * (numColumns - 1)) / numColumns;

		const columnHeights = Array(numColumns).fill(padding);

		const arrangedElements = nonDrawingElements.map((element) => {
			const elementWidth = element.width * element.scale;
			const elementHeight = element.height * element.scale;

			let shortestColumnIndex = 0;
			for (let i = 1; i < columnHeights.length; i++) {
				if (columnHeights[i] < columnHeights[shortestColumnIndex]) {
					shortestColumnIndex = i;
				}
			}

			const columnX = padding + shortestColumnIndex * (columnWidth + padding);

			const maxElementWidth = Math.min(elementWidth, columnWidth);
			const centeredX = columnX + (columnWidth - maxElementWidth) / 2;

			const newX = Math.max(
				padding,
				Math.min(centeredX, canvasWidth - elementWidth - padding)
			);
			const newY = columnHeights[shortestColumnIndex];

			const maxY = Math.max(canvasHeight - elementHeight - padding, newY);
			const finalY = Math.min(newY, maxY);

			columnHeights[shortestColumnIndex] += elementHeight + padding;

			return {
				...element,
				x: newX,
				y: finalY,
				rotation: 0,
			};
		});

		commitUpdate([
			...elements.filter((el) => el.type === "drawing"),
			...arrangedElements,
		]);
	};

	useEffect(() => {
		dragOffsetRef.current = dragOffset;
	}, [dragOffset]);

	useEffect(() => {
		selectedElementRef.current = selectedElement;
	}, [selectedElement]);

	useEffect(() => {
		isDraggingRef.current = isDragging;
	}, [isDragging]);

	useEffect(() => {
		elementsRef.current = elements;
	}, [elements]);

	useEffect(() => {
		const handleGlobalMouseMove = (e) => {
			if (!isDrawingMode) {
				handleMouseMove(e);
			} else {
				if (boardRef.current) {
					const rect = boardRef.current.getBoundingClientRect();
					const mouseX = e.clientX - rect.left;
					const mouseY = e.clientY - rect.top;

					if (
						mouseX >= 0 &&
						mouseX <= rect.width &&
						mouseY >= 0 &&
						mouseY <= rect.height
					) {
						draw(e);
					}

					if (isErasing) {
						if (
							mouseX >= 0 &&
							mouseX <= rect.width &&
							mouseY >= 0 &&
							mouseY <= rect.height
						) {
							setMousePosition({
								x: mouseX,
								y: mouseY,
							});
						} else {
							setMousePosition(null);
						}
					}
				}
			}
		};

		const handleGlobalMouseUp = (e) => {
			handleMouseUp();
			endDrawing(e);
		};

		const handleGlobalTouchMove = (e) => {
			const target = e.target;
			const isScrollableArea =
				target.closest(".overflow-y-auto") ||
				target.closest(".about-modal-content") ||
				target.closest(".quick-access-buttons") ||
				target.closest(
					".w-full.h-full.overflow-x-auto.overflow-y-hidden.relative"
				);

			if (!isScrollableArea && e.cancelable) {
				e.preventDefault();
			}

			if (isDrawingMode) {
				if (boardRef.current && e.touches.length > 0) {
					const rect = boardRef.current.getBoundingClientRect();
					const touchX = e.touches[0].clientX - rect.left;
					const touchY = e.touches[0].clientY - rect.top;

					if (
						touchX >= 0 &&
						touchX <= rect.width &&
						touchY >= 0 &&
						touchY <= rect.height
					) {
						draw(e);
					}
				}
			} else if (!isScrollableArea) {
				handleTouchMove(e);
			}
		};

		const handleGlobalTouchEnd = (e) => {
			handleTouchEnd();
			endDrawing(e);
		};

		const enableTouchScrolling = () => {
			const scrollableElements = document.querySelectorAll(
				".overflow-y-auto, .about-modal-content, .quick-access-buttons"
			);
			scrollableElements.forEach((element) => {
				const el = element;
				el.style.touchAction = "pan-y";
				el.style.webkitOverflowScrolling = "touch";
			});
		};

		enableTouchScrolling();
		setTimeout(enableTouchScrolling, 100);

		document.addEventListener("mousemove", handleGlobalMouseMove);
		document.addEventListener("mouseup", handleGlobalMouseUp);
		document.addEventListener("touchmove", handleGlobalTouchMove, {
			passive: false,
		});
		document.addEventListener("touchend", handleGlobalTouchEnd);
		document.addEventListener("touchcancel", handleGlobalTouchEnd);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
			document.removeEventListener("touchmove", handleGlobalTouchMove);
			document.removeEventListener("touchend", handleGlobalTouchEnd);
			document.removeEventListener("touchcancel", handleGlobalTouchEnd);
		};
	}, [
		handleMouseMove,
		handleMouseUp,
		handleTouchMove,
		handleTouchEnd,
		draw,
		endDrawing,
		isDrawingMode,
		isErasing,
		isDragging,
	]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				undo();
			} else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
				e.preventDefault();
				redo();
			} else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") {
				e.preventDefault();
				redo();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [undo, redo]);

	useEffect(() => {
		if (selectedElement) {
			const el = elements.find((e) => e.id === selectedElement);
			if (el?.type === "text" && editingTextRef.current) {
				editingTextRef.current.focus();

				const range = document.createRange();
				range.selectNodeContents(editingTextRef.current);
				range.collapse(false);
				const sel = window.getSelection();
				sel?.removeAllRanges();
				sel?.addRange(range);
				setEditingText({ id: el.id, value: el.content });
			} else {
				setEditingText(null);
			}
		} else {
			setEditingText(null);
		}
	}, [selectedElement, elements]);

	useEffect(() => {
		if (editingText) {
			if (saveTextTimeout.current) clearTimeout(saveTextTimeout.current);
			saveTextTimeout.current = setTimeout(() => {
				commitUpdate(
					elements.map((el) =>
						el.id === editingText.id
							? { ...el, content: editingText.value }
							: el
					)
				);
			}, 500);
		}
		return () => {
			if (saveTextTimeout.current) clearTimeout(saveTextTimeout.current);
		};
	}, [editingText, elements, commitUpdate]);

	const handleBoardClick = useCallback(
		(e) => {
			if (isDrawingMode) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}

			if (e.target === e.currentTarget) {
				setSelectedElement(null);
			}
		},
		[isDrawingMode]
	);

	useEffect(() => {
		const handleResize = () => {
			if (!boardRef.current) return;
			const boardRect = boardRef.current.getBoundingClientRect();

			setElements((prevElements) =>
				prevElements.map((el) => {
					if (el.type === "drawing") return el;

					const elRight = el.x + el.width * el.scale;
					const elBottom = el.y + el.height * el.scale;

					let newX = el.x;
					let newY = el.y;

					if (elRight > boardRect.width) {
						newX = boardRect.width - el.width * el.scale;
					}
					if (elBottom > boardRect.height) {
						newY = boardRect.height - el.height * el.scale;
					}

					if (newX < 0) newX = 0;
					if (newY < 0) newY = 0;

					if (newX !== el.x || newY !== el.y) {
						return { ...el, x: newX, y: newY };
					}
					return el;
				})
			);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (isMobile && mobileScrollContainerRef.current) {
			const timer = setTimeout(() => {
				const container = mobileScrollContainerRef.current;
				if (container) {
					const centerPosition =
						(container.scrollWidth - container.clientWidth) / 2;
					container.scrollLeft = centerPosition;
				}
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [isMobile]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 3300);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isMobile && isPanelVisible) {
			document.body.classList.add("modal-open");
			return () => {
				document.body.classList.remove("modal-open");
			};
		} else {
			document.body.classList.remove("modal-open");
		}
	}, [isMobile, isPanelVisible]);

	useEffect(() => {
		const initializeTouchScrolling = () => {
			const scrollableSelectors = [
				".overflow-y-auto",
				".about-modal-content",
				".quick-access-buttons",
				".w-full.h-full.overflow-x-auto.overflow-y-hidden.relative",
			];

			scrollableSelectors.forEach((selector) => {
				const elements = document.querySelectorAll(selector);
				elements.forEach((element) => {
					const el = element;
					el.style.touchAction = selector.includes("overflow-x-auto")
						? "pan-x"
						: "pan-y";
					el.style.webkitOverflowScrolling = "touch";
					el.style.overscrollBehavior = "contain";

					void el.offsetHeight;
				});
			});
		};

		initializeTouchScrolling();

		const timeouts = [
			setTimeout(initializeTouchScrolling, 50),
			setTimeout(initializeTouchScrolling, 200),
			setTimeout(initializeTouchScrolling, 500),
		];

		return () => {
			timeouts.forEach((timeout) => clearTimeout(timeout));
		};
	}, [isAboutModalVisible, isPanelVisible]);

	const selectedElementObject = elements.find(
		(el) => el.id === selectedElement
	);

	const LogoIcon = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className="w-8 h-8"
		>
			<path
				d="M3 3h7v9H3V3zm0 11h7v7H3v-7zm9-11h9v5h-9V3zm0 7h4v11h-4V10zm6 6h3v5h-3v-5z"
				fill="#8B5CF6"
			/>
		</svg>
	);

	const GridBackground = ({ pattern, theme, gridSize, width, height }) => {
		if (pattern === "none") {
			return null;
		}
		const strokeColor = `${theme.elementBorder}44`;

		const svgWidth = width || "100%";
		const svgHeight = height || "100%";

		return (
			<svg
				width={svgWidth}
				height={svgHeight}
				className="absolute top-0 left-0 z-[2] pointer-events-none"
			>
				<defs>
					{pattern === "grid" && (
						<pattern
							id="grid"
							width={gridSize}
							height={gridSize}
							patternUnits="userSpaceOnUse"
						>
							<path
								d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
								fill="none"
								stroke={strokeColor}
								strokeWidth="0.5"
							/>
						</pattern>
					)}
					{pattern === "dots" && (
						<pattern
							id="dots"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<circle cx="2" cy="2" r="1" fill={strokeColor} />
						</pattern>
					)}
				</defs>
				<rect width={svgWidth} height={svgHeight} fill={`url(#${pattern})`} />
			</svg>
		);
	};

	const SliderControl = ({ label, value, min, max, onChange, onMouseUp }) => (
		<div className="flex flex-col gap-2 mt-3">
			<label className="text-xs text-gray-300 m-0">{label}</label>
			<div className="flex items-center gap-2.5">
				<input
					type="range"
					min={min}
					max={max}
					value={value}
					onChange={onChange}
					onMouseUp={onMouseUp}
					className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer"
				/>
				<span className="text-xs font-medium min-w-[35px] text-right">
					{value}px
				</span>
			</div>
		</div>
	);

	return (
		<>
			{isLoading ? (
				<div className="fixed top-0 left-0 min-w-screen min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center z-50 backdrop-blur-md animate-fadeOut duration-800 delay-2500">
					<div className="flex flex-col items-center gap-10">
						<div className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent animate-gradient">
							MoodZest
						</div>
						<div className="relative w-16 h-16">
							<div className="absolute w-full h-full border-t-3 border-indigo-400 rounded-full animate-spin"></div>
							<div className="absolute w-4/5 h-4/5 top-1/10 left-1/10 border-r-3 border-pink-400 rounded-full animate-spin delay-300"></div>
							<div className="absolute w-3/5 h-3/5 top-1/5 left-1/5 border-b-3 border-cyan-400 rounded-full animate-spin delay-600"></div>
						</div>
						<div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
							<div className="h-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 animate-progressFill"></div>
						</div>
						<div className="text-sm text-gray-300 animate-pulse">
							Loading your creative canvas...
						</div>
						<div className="flex gap-2">
							<div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
							<div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
							<div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-400"></div>
						</div>
					</div>
				</div>
			) : (
				<div
					className={`flex flex-col w-screen h-screen font-sans overflow-hidden ${
						isAboutModalVisible ? "about-modal-open" : ""
					}`}
					style={{
						fontFamily: `'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
						backgroundColor: currentTheme.background,
					}}
				>
					{}
					<div
						className={`fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-md z-[999] transition-opacity duration-400 ${
							isAboutModalVisible
								? "opacity-100 visible"
								: "opacity-0 invisible"
						}`}
						onClick={() => setIsAboutModalVisible(false)}
					/>

					{}
					<div
						className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-xl p-6 w-[90%] max-w-lg max-h-[calc(100vh-140px)] z-[1100] shadow-2xl transition-opacity duration-300 ${
							isAboutModalVisible
								? "opacity-100 visible"
								: "opacity-0 invisible"
						}`}
						style={{
							backgroundColor: currentTheme.toolbar,
							borderColor: currentTheme.toolbarBorder,
						}}
					>
						<button
							className="absolute top-4 right-4 bg-transparent border-none text-gray-400 p-2 rounded-full hover:bg-gray-700/50 hover:text-white flex items-center justify-center w-8 h-8 transition-all duration-300 hover:rotate-90 active:scale-90"
							onClick={() => setIsAboutModalVisible(false)}
						>
							<FiXCircle size={20} />
						</button>

						<div className="max-h-[calc(100vh-200px)] overflow-y-auto p-1 scrollbar-hide">
							<h2 className="m-0 mb-6 text-2xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
								About MoodZest
							</h2>

							<div className="mb-6">
								<p className="text-center text-gray-300 opacity-90">
									MoodZest is a versatile digital canvas that empowers creators
									to bring their ideas to life. Whether you're designing mood
									boards, planning projects, or visualizing concepts, MoodZest
									provides the tools you need to express your creativity.
								</p>
							</div>

							<div className="mb-6">
								<h3 className="text-xl font-semibold mb-4 text-white">
									Key Features
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
										<div className="p-2 rounded-lg bg-indigo-500/10">
											<FiMove className="text-indigo-400" size={18} />
										</div>
										<div>
											<h4 className="font-semibold mb-1 text-white">
												Drag & Drop
											</h4>
											<p className="text-sm text-gray-400">
												Intuitive interface for effortless creativity
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
										<div className="p-2 rounded-lg bg-indigo-500/10">
											<FiGrid className="text-indigo-400" size={18} />
										</div>
										<div>
											<h4 className="font-semibold mb-1 text-white">
												Smart Grid
											</h4>
											<p className="text-sm text-gray-400">
												Precise layouts with intelligent snapping
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
										<div className="p-2 rounded-lg bg-indigo-500/10">
											<FiCircle className="text-indigo-400" size={18} />
										</div>
										<div>
											<h4 className="font-semibold mb-1 text-white">Themes</h4>
											<p className="text-sm text-gray-400">
												Custom colors and styling options
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
										<div className="p-2 rounded-lg bg-indigo-500/10">
											<FiDownload className="text-indigo-400" size={18} />
										</div>
										<div>
											<h4 className="font-semibold mb-1 text-white">Export</h4>
											<p className="text-sm text-gray-400">
												High-quality PNG export capability
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="text-center mb-6">
								<h3 className="text-xl font-semibold mb-3 text-white">
									Built with Modern Tech
								</h3>
								<p className="text-gray-300 opacity-80">
									MoodZest combines powerful features with a clean, minimalist
									interface to help you focus on what matters most - your
									creative vision.
								</p>
							</div>

							<div className="text-center pt-6 border-t border-gray-700">
								<div className="inline-block px-4 py-1 bg-indigo-500/10 rounded-full text-sm font-medium text-indigo-400 mb-2">
									Version 1.0
								</div>
								<p className="text-sm text-gray-400">
									Created with passion for the creative community
								</p>
							</div>
						</div>
					</div>

					{}
					<header
						className="flex justify-between items-center px-6 py-3 shrink-0 relative z-[1010] shadow-lg"
						style={{
							backgroundColor: currentTheme.toolbar,
							color: currentTheme.textColor,
							borderBottom: `1px solid ${currentTheme.toolbarBorder}`,
						}}
						ref={headerRef}
					>
						<h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight m-0 transition-all duration-400 ease-in-out">
							<div className="w-8 h-8 relative">
								<LogoIcon />
							</div>
							<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black">
								MoodZest
							</span>
						</h1>

						<div className="flex items-center gap-2">
							<button
								className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10 transition-colors"
								onClick={() => setIsAboutModalVisible(true)}
								title="About MoodZest"
							>
								<FiInfo className="w-5 h-5 opacity-70" />
							</button>
						</div>
					</header>

					{}
					<section
						className="text-center px-6 py-3 shrink-0 hidden md:block"
						style={{
							background: `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.toolbar})`,
							color: currentTheme.textColor,
							borderBottom: `1px solid ${currentTheme.toolbarBorder}`,
						}}
					>
						<h2 className="m-0 mb-1 text-xl font-bold">
							Welcome to Your Creative Canvas
						</h2>
						<p className="m-0 text-sm opacity-70">
							Drag, drop, and design your inspiration. Let your ideas flow
							freely.
						</p>
					</section>

					{}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,video/*,audio/*"
						onChange={handleMediaUpload}
						className="hidden"
					/>
					<main className="flex-1 relative overflow-hidden">
						{}
						{isMobile && (
							<div
								className={`fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-md z-[1001] transition-opacity duration-400 ${
									isPanelVisible ? "opacity-100 visible" : "opacity-0 invisible"
								}`}
								onClick={() => setIsPanelVisible(false)}
							/>
						)}

						{}
						<div
							className={`absolute top-4 left-3 w-[300px] h-[calc(100%-32px)] flex flex-col z-[1001] transition-transform duration-400 rounded-2xl border shadow-2xl ${
								!isPanelVisible ? "transform -translate-x-full" : ""
							}`}
							style={{
								backgroundColor: currentTheme.toolbarTransparent,
								backdropFilter: "blur(12px)",
								WebkitBackdropFilter: "blur(12px)",
								borderColor: currentTheme.toolbarBorder,
								color: currentTheme.textColor,
							}}
						>
							<div className="flex justify-between items-center px-4 py-3 shrink-0">
								<h2 className="text-base font-semibold">Tools</h2>
								<button
									className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
									onClick={() => setIsPanelVisible(false)}
									title="Hide Panel"
								>
									<FiArrowLeft className="w-6 h-6" />
								</button>
							</div>

							<div className="overflow-y-auto px-4 pb-4">
								{}
								<div className="bg-black/15 rounded-xl p-4 mb-4">
									<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
										History
									</h3>
									<div className="grid grid-cols-2 gap-2.5">
										<button
											className={`bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												historyIndex === 0
													? "opacity-50 cursor-not-allowed"
													: "hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={undo}
											disabled={historyIndex === 0}
										>
											<FiRotateCcw className="w-5 h-5" /> Undo
										</button>
										<button
											className={`bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												historyIndex >= history.length - 1
													? "opacity-50 cursor-not-allowed"
													: "hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={redo}
											disabled={historyIndex >= history.length - 1}
										>
											<FiRotateCw className="w-5 h-5" /> Redo
										</button>
									</div>
								</div>

								{}
								<div className="bg-black/15 rounded-xl p-4 mb-4">
									<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
										Layout
									</h3>
									<div className="grid grid-cols-1 gap-2.5">
										<button
											className="bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											onClick={autoArrangeElements}
										>
											<FiGrid className="w-5 h-5" /> Auto-Arrange
										</button>
										<button
											className="bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-red-500 hover:border-red-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											onClick={() => {
												commitUpdate([]);
											}}
										>
											<FiTrash2 className="w-5 h-5" /> Clear Canvas
										</button>
									</div>
								</div>

								{}
								<div className="bg-black/15 rounded-xl p-4 mb-4">
									<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
										Add Elements
									</h3>
									<div className="grid grid-cols-3 gap-2.5">
										<button
											className="bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg col-span-3"
											onClick={() => fileInputRef.current?.click()}
										>
											<FiImage className="w-5 h-5" /> Add Media
										</button>
										<button
											className="bg-white/5 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											onClick={() => addShapeElement("square")}
										>
											<FiSquare className="w-5 h-5" />
										</button>
										<button
											className="bg-white/5 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											onClick={() => addShapeElement("circle")}
										>
											<FiCircle className="w-5 h-5" />
										</button>
										<button
											className="bg-white/5 border border-white/10 text-white p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											onClick={() => addShapeElement("triangle")}
										>
											<FiTriangle className="w-5 h-5" />
										</button>
										<button
											className="bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg col-span-3"
											onClick={addTextElement}
										>
											<FiType className="w-5 h-5" /> Add Text
										</button>
									</div>
								</div>

								{}
								{selectedElementObject &&
									selectedElementObject.type === "text" && (
										<div className="bg-black/15 rounded-xl p-4 mb-4">
											<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
												Text Properties
											</h3>
											<div className="flex items-center gap-2.5 mt-3">
												<label className="text-xs text-gray-300">Color</label>
												<input
													type="color"
													value={selectedElementObject.color || "#ffffff"}
													onChange={(e) =>
														updateElement(selectedElementObject.id, {
															color: e.target.value,
														})
													}
													onBlur={() => commitUpdate(elements)}
													className="w-8 h-8 rounded-md border border-white/10 bg-transparent cursor-pointer p-0"
												/>
											</div>
											<SliderControl
												label="Font Size"
												value={selectedElementObject.fontSize || 24}
												min={8}
												max={144}
												onChange={(e) =>
													updateElement(selectedElementObject.id, {
														fontSize: Number(e.target.value),
													})
												}
												onMouseUp={() => commitUpdate(elements)}
											/>
										</div>
									)}

								{}
								<div className="bg-black/15 rounded-xl p-4 mb-4">
									<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
										Drawing
									</h3>
									<div className="grid grid-cols-2 gap-2.5">
										<button
											className={`bg-white/5 border text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												isDrawingMode && !isErasing
													? "bg-indigo-500 border-indigo-400 text-white"
													: "border-white/10 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={() => {
												if (isDrawingMode && !isErasing) {
													setIsDrawingMode(false);
												} else {
													setIsDrawingMode(true);
													setIsErasing(false);
												}
											}}
										>
											<FiEdit2 className="w-5 h-5" /> Draw
										</button>
										<button
											className={`bg-white/5 border text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												isDrawingMode && isErasing
													? "bg-indigo-500 border-indigo-400 text-white"
													: "border-white/10 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={() => {
												if (isDrawingMode && isErasing) {
													setIsDrawingMode(false);
												} else {
													setIsDrawingMode(true);
													setIsErasing(true);
												}
											}}
										>
											<BsEraser className="w-5 h-5" /> Erase
										</button>
									</div>
									{isDrawingMode && (
										<>
											{!isErasing && (
												<>
													<SliderControl
														label="Brush Size"
														value={brushSize}
														min={1}
														max={50}
														onChange={(e) =>
															setBrushSize(Number(e.target.value))
														}
													/>

													<div className="flex items-center gap-2.5 mt-3">
														<label className="text-xs text-gray-300">
															Brush Color
														</label>
														<input
															type="color"
															value={brushColor}
															onChange={(e) => setBrushColor(e.target.value)}
															title="Select brush color"
															className="w-8 h-8 rounded-md border border-white/10 bg-transparent cursor-pointer p-0"
														/>
													</div>
												</>
											)}
											{isErasing && (
												<SliderControl
													label="Eraser Size"
													value={eraserSize}
													min={10}
													max={100}
													onChange={(e) =>
														setEraserSize(Number(e.target.value))
													}
												/>
											)}
											<div className="mt-2.5">
												<button
													className="w-full bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
													onClick={() => setIsDrawingMode(false)}
												>
													Exit Drawing Mode
												</button>
											</div>
										</>
									)}
								</div>

								{}
								<div className="bg-black/15 rounded-xl p-4 mb-4">
									<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
										Background
									</h3>
									<div className="grid grid-cols-2 gap-2.5">
										<button
											className={`bg-white/5 border text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												backgroundPattern === "grid"
													? "bg-indigo-500 border-indigo-400 text-white"
													: "border-white/10 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={() => setBackgroundPattern("grid")}
										>
											Grid
										</button>
										<button
											className={`bg-white/5 border text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												backgroundPattern === "dots"
													? "bg-indigo-500 border-indigo-400 text-white"
													: "border-white/10 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={() => setBackgroundPattern("dots")}
										>
											Dots
										</button>

										<button
											className={`col-span-2 bg-white/5 border text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
												backgroundPattern === "none"
													? "bg-indigo-500 border-indigo-400 text-white"
													: "border-white/10 hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
											}`}
											onClick={() => setBackgroundPattern("none")}
										>
											None
										</button>
									</div>
								</div>

								{}
								<div className="bg-black/15 rounded-xl p-4 mb-4">
									<h3 className="text-xs font-medium text-white/80 uppercase tracking-wider mb-3 pb-2 border-b border-white/10">
										Settings
									</h3>
									<div
										className="flex items-center justify-between cursor-pointer"
										onClick={() => setShowWatermark(!showWatermark)}
									>
										<label className="text-sm text-white cursor-pointer m-0 select-none">
											Watermark
										</label>
										<div className="relative w-5 h-5">
											<input
												type="checkbox"
												id="watermark-toggle"
												checked={showWatermark}
												onChange={(e) => setShowWatermark(e.target.checked)}
												className="opacity-0 absolute w-0 h-0"
											/>
											<div
												className={`w-5 h-5 border ${
													showWatermark
														? "bg-indigo-500 border-indigo-600"
														: "bg-black/20 border-gray-600"
												} rounded transition-colors duration-200 flex items-center justify-center`}
											>
												{showWatermark && (
													<FiCheck className="text-white text-xs" />
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{}
						<div
							className={`absolute top-12 left-6 flex flex-col gap-1.5 z-[1000] transition-all duration-400 max-h-[calc(100vh-200px)] overflow-y-auto py-1 px-1 ${
								isPanelVisible
									? "opacity-0 -translate-x-[100px] pointer-events-none"
									: "opacity-100"
							}`}
						>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => setIsPanelVisible(true)}
								title="Open Panel"
							>
								<FiArrowRight size={18} />
							</button>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									undo();
								}}
								disabled={historyIndex === 0}
								title="Undo"
							>
								<FiRotateCcw size={18} />
							</button>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									redo();
								}}
								disabled={historyIndex >= history.length - 1}
								title="Redo"
							>
								<FiRotateCw size={18} />
							</button>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									fileInputRef.current?.click();
								}}
								title="Add Media"
							>
								<FiImage size={18} />
							</button>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									addTextElement();
								}}
								title="Add Text"
							>
								<FiType size={18} />
							</button>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									addShapeElement("square");
								}}
								title="Add Square"
							>
								<FiSquare size={18} />
							</button>
							<button
								className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-700/50 text-white shadow-md hover:scale-105 transition-all duration-200 ${
									isDrawingMode && !isErasing
										? "bg-indigo-500"
										: "bg-gray-800/75 backdrop-blur-md hover:bg-indigo-500"
								}`}
								onClick={() => {
									if (!isPanelVisible) {
										if (isDrawingMode && !isErasing) {
											setIsDrawingMode(false);
											setIsErasing(false);
										} else {
											setIsDrawingMode(true);
											setIsErasing(false);
										}
									} else {
										if (isDrawingMode && !isErasing) {
											setIsDrawingMode(false);
										} else {
											setIsDrawingMode(true);
											setIsErasing(false);
										}
									}
								}}
								title="Drawing Mode"
							>
								<FiEdit2 size={18} />
							</button>

							<button
								className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-700/50 text-white shadow-md hover:scale-105 transition-all duration-200 ${
									isDrawingMode && isErasing
										? "bg-indigo-500"
										: "bg-gray-800/75 backdrop-blur-md hover:bg-indigo-500"
								}`}
								onClick={() => {
									if (!isPanelVisible) {
										if (isDrawingMode && isErasing) {
											setIsDrawingMode(false);
											setIsErasing(false);
										} else {
											setIsDrawingMode(true);
											setIsErasing(true);
										}
									} else {
										if (isDrawingMode && isErasing) {
											setIsDrawingMode(false);
										} else {
											setIsDrawingMode(true);
											setIsErasing(true);
										}
									}
								}}
								title="Eraser"
							>
								<BsEraser size={18} />
							</button>

							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-indigo-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									autoArrangeElements();
								}}
								title="Auto-Arrange"
							>
								<FiGrid size={18} />
							</button>
							<button
								className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/75 backdrop-blur-md border border-gray-700/50 text-white shadow-md hover:bg-red-500 hover:scale-105 transition-all duration-200"
								onClick={() => {
									exitDrawingModeInMobile();
									commitUpdate([]);
								}}
								title="Clear Canvas"
							>
								<FiTrash2 size={18} />
							</button>
						</div>

						{}
						{isMobile ? (
							<div
								ref={mobileScrollContainerRef}
								className="w-full h-full overflow-x-auto overflow-y-hidden relative"
							>
								<div
									ref={boardRef}
									className={`min-w-[1200px] w-max h-full relative touch-manipulation select-none ${
										isDrawingMode ? "drawing-mode" : ""
									} ${isErasing ? "erasing" : ""} ${
										backgroundPattern === "grid"
											? "bg-grid"
											: backgroundPattern === "dots"
											? "bg-dots"
											: ""
									}`}
									style={{
										backgroundSize:
											backgroundPattern === "grid"
												? `${GRID_SIZE}px ${GRID_SIZE}px`
												: "20px 20px",
										backgroundImage:
											backgroundPattern === "grid"
												? `linear-gradient(${currentTheme.elementBorder}44 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.elementBorder}44 1px, transparent 1px)`
												: backgroundPattern === "dots"
												? `radial-gradient(circle, ${currentTheme.elementBorder}44 1px, transparent 1px)`
												: "none",
									}}
									onMouseDown={(e) => {
										if (isDrawingMode && e.target === e.currentTarget)
											startDrawing(e);
									}}
									onTouchStart={(e) => {
										if (isDrawingMode && e.target === e.currentTarget)
											startDrawing(e);
									}}
									onClick={handleBoardClick}
									onMouseMove={(e) => {
										if (isDrawingMode && isErasing) {
											const rect = boardRef.current?.getBoundingClientRect();
											if (rect) {
												setMousePosition({
													x: e.clientX - rect.left,
													y: e.clientY - rect.top,
												});
											}
										}
									}}
									onMouseLeave={() => {
										if (isErasing) setMousePosition(null);
									}}
								>
									{}
									{elements.map((element, index) => {
										const baseZIndex = 10 + index;
										const elementZIndex =
											selectedElement === element.id ? 999 : baseZIndex;

										if (element.type === "drawing") {
											const isEraserStroke = element.isEraser;
											return (
												<div
													key={element.id}
													data-element-id={element.id}
													className={`absolute select-none touch-none pointer-events-auto ${
														selectedElement === element.id && !isEraserStroke
															? "shadow-highlight shadow-indigo-500/50"
															: ""
													}`}
													style={{
														left: element.x,
														top: element.y,
														width: element.width,
														height: element.height,
														transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
														transformOrigin: "center",
														zIndex: elementZIndex,
														pointerEvents: isEraserStroke ? "none" : "auto",
														cursor: isDrawingMode
															? "crosshair"
															: isEraserStroke
															? "default"
															: "move",
													}}
													onMouseDown={
														!isEraserStroke
															? (e) => {
																	e.stopPropagation();
																	if (isDrawingMode) {
																		startDrawing(e);
																	} else if (!isResizing && !isRotating) {
																		handleMouseDown(e, element.id);
																	}
															  }
															: undefined
													}
													onTouchStart={
														!isEraserStroke
															? (e) => {
																	e.stopPropagation();

																	if (isDrawingMode) {
																		startDrawing(e);
																	} else {
																		handleTouchStart(e, element.id);
																	}
															  }
															: undefined
													}
													onTouchMove={
														!isEraserStroke ? handleTouchMove : undefined
													}
													onTouchEnd={
														!isEraserStroke ? handleTouchEnd : undefined
													}
												>
													<svg
														style={{
															width: "100%",
															height: "100%",
															pointerEvents: "none",
														}}
														viewBox={`0 0 ${element.width} ${element.height}`}
														preserveAspectRatio="none"
													>
														<path
															d={element.content}
															stroke={element.color}
															strokeWidth={element.strokeWidth}
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>

													{selectedElement === element.id &&
														!isEraserStroke && (
															<>
																<div
																	className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-nwse-resize"
																	onMouseDown={(e) =>
																		startResize(e, element.id, "both")
																	}
																	onTouchStart={(e) =>
																		startResize(e, element.id, "both")
																	}
																/>
																<div
																	className="absolute top-[-32px] left-1/2 transform -translate-x-1/2 w-6 h-6 cursor-grab z-[1000] text-white"
																	onMouseDown={(e) =>
																		startRotate(e, element.id)
																	}
																>
																	<FiRefreshCw className="w-6 h-6 filter drop-shadow-lg" />
																</div>
																<div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur rounded-lg p-2 flex gap-2 z-[1000]">
																	<label className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-600 transition-colors">
																		<input
																			type="color"
																			value={element.color || "#ffffff"}
																			onChange={(e) => {
																				const newElements = elements.map((el) =>
																					el.id === element.id
																						? { ...el, color: e.target.value }
																						: el
																				);
																				commitUpdate(newElements);
																			}}
																			title="Change Color"
																			className="opacity-0 absolute"
																		/>
																		<div
																			className="w-4 h-4 rounded-full"
																			style={{
																				backgroundColor:
																					element.color || "#ffffff",
																			}}
																		/>
																	</label>
																	<button
																		className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
																		onClick={() => deleteElement(element.id)}
																		title="Delete"
																	>
																		<FiTrash2 className="w-4 h-4 text-white" />
																	</button>
																</div>
															</>
														)}
												</div>
											);
										}

										return (
											<div
												key={element.id}
												data-element-id={element.id}
												className={`absolute select-none touch-none ${
													element.type === "shape" ? "shape-element" : ""
												} ${selectedElement === element.id ? "z-[999]" : ""}`}
												style={{
													left: element.x,
													top: element.y,
													width: element.width,
													height: element.height,
													transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
													transformOrigin: "center",
													zIndex: elementZIndex,
													...(element.type === "shape" &&
														selectedElement === element.id && {
															boxShadow: `0 0 0 3px ${
																element.color || "#4a90e2"
															}, 0 0 15px ${element.color || "#4a90e2"}40`,
														}),
												}}
												onMouseDown={(e) => {
													e.stopPropagation();
													if (isDrawingMode) {
														startDrawing(e);
													} else if (!isResizing && !isRotating) {
														handleMouseDown(e, element.id);
													}
												}}
												onTouchStart={(e) => {
													e.stopPropagation();

													if (isDrawingMode) {
														startDrawing(e);
													} else {
														handleTouchStart(e, element.id);
													}
												}}
												onTouchMove={handleTouchMove}
												onTouchEnd={handleTouchEnd}
											>
												{element.type === "image" && (
													<img
														src={element.content}
														alt="Mood Board element"
														className="w-full h-full object-cover rounded-lg"
													/>
												)}
												{element.type === "video" && (
													<>
														<video
															src={element.content}
															controls
															className="w-full h-full object-cover rounded-lg"
															title={element.fileName}
														/>
														<div
															className="absolute inset-0"
															onMouseDown={(e) => {
																e.stopPropagation();
																handleMouseDown(e, element.id);
															}}
															onTouchStart={(e) => {
																e.stopPropagation();

																if (isDrawingMode) {
																	startDrawing(e);
																} else {
																	handleTouchStart(e, element.id);
																}
															}}
														/>
													</>
												)}
												{element.type === "audio" && (
													<>
														<div className="w-full h-full bg-gray-800/90 rounded-lg flex flex-col justify-center items-center text-white text-xs p-2 relative">
															<div className="mb-2 text-center text-[10px]">
																AUDIO: {element.fileName}
															</div>
															<audio
																src={element.content}
																controls
																className="w-[90%] h-8"
															/>
														</div>
														<div
															className="absolute inset-0 bottom-12 cursor-move rounded-t-lg"
															onMouseDown={(e) => {
																e.stopPropagation();
																handleMouseDown(e, element.id);
															}}
															onTouchStart={(e) => {
																e.stopPropagation();

																if (isDrawingMode) {
																	startDrawing(e);
																} else {
																	handleTouchStart(e, element.id);
																}
															}}
														/>
													</>
												)}
												{element.type === "text" && (
													<>
														<div
															className="text-element w-full h-full p-2.5 box-border whitespace-pre-wrap break-words cursor-text overflow-hidden flex items-center justify-center"
															style={{
																color: element.color,
																fontSize: `${element.fontSize}px`,
																fontFamily: "Manrope",
																fontWeight: element.fontWeight,
															}}
															ref={
																selectedElement === element.id
																	? editingTextRef
																	: null
															}
															contentEditable={
																selectedElement === element.id &&
																!isDragging &&
																!isResizing &&
																!isRotating
															}
															suppressContentEditableWarning
															onInput={(e) => {
																if (selectedElement === element.id) {
																	updateElement(element.id, {
																		content: e.currentTarget.textContent || "",
																	});
																}
															}}
															onBlur={() => {
																commitUpdate(elements);
															}}
														>
															{element.content}
														</div>
														<div
															className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-500/90 border-2 border-white rounded-md flex items-center justify-center cursor-grab z-[1001] text-white shadow-md opacity-0 group-hover:opacity-70 transition-opacity duration-200"
															onMouseDown={(e) => {
																e.preventDefault();
																e.stopPropagation();
																if (
																	!isDrawingMode &&
																	!isResizing &&
																	!isRotating
																) {
																	handleMouseDown(e, element.id);
																}
															}}
															onTouchStart={(e) => {
																e.preventDefault();
																e.stopPropagation();
																if (!isDrawingMode || isPanelVisible) {
																	handleTouchStart(e, element.id);
																}
															}}
															title="Drag to move"
														>
															<MdOutlineDragIndicator className="w-4 h-4" />
														</div>
													</>
												)}
												{element.type === "shape" && (
													<div className="w-full h-full">
														{element.shapeType === "circle" && (
															<div
																className="w-full h-full rounded-full"
																style={{
																	backgroundColor:
																		(element.fillStyle || "filled") === "filled"
																			? element.color
																			: "transparent",
																	border:
																		(element.fillStyle || "filled") === "border"
																			? `${element.borderWidth || 3}px solid ${
																					element.color
																			  }`
																			: "none",
																	boxSizing: "border-box",
																}}
															/>
														)}
														{element.shapeType === "triangle" && (
															<svg
																className="w-full h-full"
																viewBox="0 0 100 100"
																preserveAspectRatio="none"
															>
																<polygon
																	points="50,10 10,90 90,90"
																	fill={
																		(element.fillStyle || "filled") === "filled"
																			? element.color
																			: "none"
																	}
																	stroke={
																		(element.fillStyle || "filled") === "border"
																			? element.color
																			: "none"
																	}
																	strokeWidth={element.borderWidth || 3}
																	vectorEffect="non-scaling-stroke"
																/>
															</svg>
														)}
														{element.shapeType === "square" && (
															<div
																className="w-full h-full rounded-lg box-border"
																style={{
																	backgroundColor:
																		(element.fillStyle || "filled") === "filled"
																			? element.color
																			: "transparent",
																	border:
																		(element.fillStyle || "filled") === "border"
																			? `${element.borderWidth || 3}px solid ${
																					element.color
																			  }`
																			: "none",
																}}
															/>
														)}
													</div>
												)}
												{selectedElement === element.id && (
													<>
														{element.type === "text" ? (
															<>
																<div
																	className="absolute top-1/2 right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-ew-resize transform -translate-y-1/2"
																	onMouseDown={(e) =>
																		startResize(e, element.id, "horizontal")
																	}
																	onTouchStart={(e) =>
																		startResize(e, element.id, "horizontal")
																	}
																/>
																<div
																	className="absolute bottom-[-8px] left-1/2 w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-ns-resize transform -translate-x-1/2"
																	onMouseDown={(e) =>
																		startResize(e, element.id, "vertical")
																	}
																	onTouchStart={(e) =>
																		startResize(e, element.id, "vertical")
																	}
																/>
																<div
																	className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-nwse-resize"
																	onMouseDown={(e) =>
																		startResize(e, element.id, "both")
																	}
																	onTouchStart={(e) =>
																		startResize(e, element.id, "both")
																	}
																/>
															</>
														) : (
															<div
																className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-nwse-resize"
																onMouseDown={(e) =>
																	startResize(e, element.id, "both")
																}
																onTouchStart={(e) =>
																	startResize(e, element.id, "both")
																}
															/>
														)}
														<div
															className="absolute top-[-32px] left-1/2 transform -translate-x-1/2 w-6 h-6 cursor-grab z-[1000] text-white"
															onMouseDown={(e) => startRotate(e, element.id)}
															onTouchStart={(e) => startRotate(e, element.id)}
														>
															<FiRefreshCw className="w-6 h-6 filter drop-shadow-lg" />
														</div>
														<div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur rounded-lg p-2 flex gap-2 z-[1000]">
															{element.type === "shape" && (
																<label className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-600 transition-colors">
																	<input
																		type="color"
																		value={element.color || "#4a90e2"}
																		onChange={(e) => {
																			const newElements = elements.map((el) =>
																				el.id === element.id
																					? { ...el, color: e.target.value }
																					: el
																			);
																			commitUpdate(newElements);
																		}}
																		title="Change Color"
																		className="opacity-0 absolute"
																	/>
																	<div
																		className="w-4 h-4 rounded-full"
																		style={{
																			backgroundColor:
																				element.color || "#4a90e2",
																		}}
																	/>
																</label>
															)}
															<button
																className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
																onClick={() => deleteElement(element.id)}
																title="Delete"
															>
																<FiTrash2 className="w-4 h-4 text-white" />
															</button>
														</div>
													</>
												)}
											</div>
										);
									})}

									{}
									{isDrawingMode && (
										<svg
											className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1000]"
											style={{ clipPath: "inset(0)" }}
										>
											<defs>
												<clipPath id="current-draw-clip">
													<rect x="0" y="0" width="100%" height="100%" />
												</clipPath>
											</defs>
											{currentPath && !isErasing && (
												<path
													d={currentPath}
													stroke={brushColor}
													strokeWidth={brushSize}
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													clipPath="url(#current-draw-clip)"
												/>
											)}
											{isErasing && mousePosition && (
												<circle
													cx={mousePosition?.x}
													cy={mousePosition?.y}
													r={eraserSize / 2}
													fill="none"
													stroke="rgba(255, 255, 255, 0.8)"
													strokeWidth="2"
													strokeDasharray="5,5"
													clipPath="url(#current-draw-clip)"
												/>
											)}
										</svg>
									)}
								</div>
							</div>
						) : (
							<div
								ref={boardRef}
								className={`absolute inset-0 ${
									isDrawingMode ? "drawing-mode" : ""
								} ${isErasing ? "erasing" : ""}`}
								style={{ backgroundColor: currentTheme.background }}
								onMouseDown={(e) => {
									if (isDrawingMode && e.target === e.currentTarget)
										startDrawing(e);
								}}
								onTouchStart={(e) => {
									if (isDrawingMode && e.target === e.currentTarget)
										startDrawing(e);
								}}
								onClick={handleBoardClick}
								onMouseMove={(e) => {
									if (isDrawingMode && isErasing) {
										const rect = boardRef.current?.getBoundingClientRect();
										if (rect) {
											setMousePosition({
												x: e.clientX - rect.left,
												y: e.clientY - rect.top,
											});
										}
									}
								}}
								onMouseLeave={() => {
									if (isErasing) setMousePosition(null);
								}}
							>
								<GridBackground
									pattern={backgroundPattern}
									theme={currentTheme}
									gridSize={GRID_SIZE}
								/>

								{}
								{elements.map((element, index) => {
									const baseZIndex = 10 + index;
									const elementZIndex =
										selectedElement === element.id ? 999 : baseZIndex;

									if (element.type === "drawing") {
										const isEraserStroke = element.isEraser;
										return (
											<div
												key={element.id}
												data-element-id={element.id}
												className={`absolute select-none touch-none pointer-events-auto ${
													selectedElement === element.id && !isEraserStroke
														? "shadow-highlight shadow-indigo-500/50"
														: ""
												}`}
												style={{
													left: element.x,
													top: element.y,
													width: element.width,
													height: element.height,
													transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
													transformOrigin: "center",
													zIndex: elementZIndex,
													pointerEvents: isEraserStroke ? "none" : "auto",
													cursor: isDrawingMode
														? "crosshair"
														: isEraserStroke
														? "default"
														: "move",
												}}
												onMouseDown={
													!isEraserStroke
														? (e) => {
																e.stopPropagation();
																if (isDrawingMode) {
																	startDrawing(e);
																} else if (!isResizing && !isRotating) {
																	handleMouseDown(e, element.id);
																}
														  }
														: undefined
												}
												onTouchStart={
													!isEraserStroke
														? (e) => {
																e.stopPropagation();
																if (isDrawingMode) {
																	startDrawing(e);
																} else {
																	handleTouchStart(e, element.id);
																}
														  }
														: undefined
												}
												onTouchMove={
													!isEraserStroke ? handleTouchMove : undefined
												}
												onTouchEnd={
													!isEraserStroke ? handleTouchEnd : undefined
												}
											>
												<svg
													style={{
														width: "100%",
														height: "100%",
														pointerEvents: "none",
													}}
													viewBox={`0 0 ${element.width} ${element.height}`}
													preserveAspectRatio="none"
												>
													<path
														d={element.content}
														stroke={element.color}
														strokeWidth={element.strokeWidth}
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>

												{selectedElement === element.id && !isEraserStroke && (
													<>
														<div
															className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-nwse-resize"
															onMouseDown={(e) =>
																startResize(e, element.id, "both")
															}
															onTouchStart={(e) =>
																startResize(e, element.id, "both")
															}
														/>
														<div
															className="absolute top-[-32px] left-1/2 transform -translate-x-1/2 w-6 h-6 cursor-grab z-[1000] text-white"
															onMouseDown={(e) => startRotate(e, element.id)}
															onTouchStart={(e) => startRotate(e, element.id)}
														>
															<FiRefreshCw className="w-6 h-6 filter drop-shadow-lg" />
														</div>
														<div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur rounded-lg p-2 flex gap-2 z-[1000]">
															<label className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-600 transition-colors">
																<input
																	type="color"
																	value={element.color || "#ffffff"}
																	onChange={(e) => {
																		const newElements = elements.map((el) =>
																			el.id === element.id
																				? { ...el, color: e.target.value }
																				: el
																		);
																		commitUpdate(newElements);
																	}}
																	title="Change Color"
																	className="opacity-0 absolute"
																/>
																<div
																	className="w-4 h-4 rounded-full"
																	style={{
																		backgroundColor: element.color || "#ffffff",
																	}}
																/>
															</label>
															<button
																className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
																onClick={() => deleteElement(element.id)}
																title="Delete"
															>
																<FiTrash2 className="w-4 h-4 text-white" />
															</button>
														</div>
													</>
												)}
											</div>
										);
									}

									return (
										<div
											key={element.id}
											data-element-id={element.id}
											className={`absolute select-none touch-none group ${
												element.type === "shape" ? "shape-element" : ""
											} ${selectedElement === element.id ? "z-[999]" : ""}`}
											style={{
												left: element.x,
												top: element.y,
												width: element.width,
												height: element.height,
												transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
												transformOrigin: "center",
												zIndex: elementZIndex,
												...(element.type === "shape" &&
													selectedElement === element.id && {
														boxShadow: `0 0 0 3px ${
															element.color || "#4a90e2"
														}, 0 0 15px ${element.color || "#4a90e2"}40`,
													}),
											}}
											onMouseDown={(e) => {
												e.stopPropagation();
												if (isDrawingMode) {
													startDrawing(e);
												} else if (!isResizing && !isRotating) {
													handleMouseDown(e, element.id);
												}
											}}
											onTouchStart={(e) => {
												e.stopPropagation();
												if (isDrawingMode) {
													startDrawing(e);
												} else {
													handleTouchStart(e, element.id);
												}
											}}
											onTouchMove={handleTouchMove}
											onTouchEnd={handleTouchEnd}
										>
											{}
											{}
											{element.type === "image" && (
												<img
													src={element.content}
													alt="Mood Board element"
													className="w-full h-full object-cover rounded-lg"
												/>
											)}
											{element.type === "video" && (
												<>
													<video
														src={element.content}
														controls
														className="w-full h-full object-cover rounded-lg"
														title={element.fileName}
													/>
													<div
														className="absolute inset-0"
														onMouseDown={(e) => {
															e.stopPropagation();
															handleMouseDown(e, element.id);
														}}
														onTouchStart={(e) => {
															e.stopPropagation();
															if (isDrawingMode) {
																startDrawing(e);
															} else {
																handleTouchStart(e, element.id);
															}
														}}
													/>
												</>
											)}
											{element.type === "audio" && (
												<>
													<div className="w-full h-full bg-gray-800/90 rounded-lg flex flex-col justify-center items-center text-white text-xs p-2 relative">
														<div className="mb-2 text-center text-[10px]">
															AUDIO: {element.fileName}
														</div>
														<audio
															src={element.content}
															controls
															className="w-[90%] h-8"
														/>
													</div>
													<div
														className="absolute inset-0 bottom-12 cursor-move rounded-t-lg"
														onMouseDown={(e) => {
															e.stopPropagation();
															handleMouseDown(e, element.id);
														}}
														onTouchStart={(e) => {
															e.stopPropagation();
															if (isDrawingMode) {
																startDrawing(e);
															} else {
																handleTouchStart(e, element.id);
															}
														}}
													/>
												</>
											)}
											{element.type === "text" && (
												<>
													<div
														className="text-element w-full h-full p-2.5 box-border whitespace-pre-wrap break-words cursor-text overflow-hidden flex items-center justify-center"
														style={{
															color: element.color,
															fontSize: `${element.fontSize}px`,
															fontFamily: "Manrope",
															fontWeight: element.fontWeight,
														}}
														ref={
															selectedElement === element.id
																? editingTextRef
																: null
														}
														contentEditable={
															selectedElement === element.id &&
															!isDragging &&
															!isResizing &&
															!isRotating
														}
														suppressContentEditableWarning
														onInput={(e) => {
															if (selectedElement === element.id) {
																updateElement(element.id, {
																	content: e.currentTarget.textContent || "",
																});
															}
														}}
														onBlur={() => {
															commitUpdate(elements);
														}}
													>
														{element.content}
													</div>
													<div
														className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-500/90 border-2 border-white rounded-md flex items-center justify-center cursor-grab z-[1001] text-white shadow-md opacity-0 group-hover:opacity-70 transition-opacity duration-200"
														onMouseDown={(e) => {
															e.preventDefault();
															e.stopPropagation();
															if (
																!isDrawingMode &&
																!isResizing &&
																!isRotating
															) {
																handleMouseDown(e, element.id);
															}
														}}
														onTouchStart={(e) => {
															e.preventDefault();
															e.stopPropagation();
															if (!isDrawingMode) {
																handleTouchStart(e, element.id);
															}
														}}
														title="Drag to move"
													>
														<MdOutlineDragIndicator className="w-4 h-4" />
													</div>
												</>
											)}
											{element.type === "shape" && (
												<div className="w-full h-full">
													{element.shapeType === "circle" && (
														<div
															className="w-full h-full rounded-full"
															style={{
																backgroundColor:
																	(element.fillStyle || "filled") === "filled"
																		? element.color
																		: "transparent",
																border:
																	(element.fillStyle || "filled") === "border"
																		? `${element.borderWidth || 3}px solid ${
																				element.color
																		  }`
																		: "none",
																boxSizing: "border-box",
															}}
														/>
													)}
													{element.shapeType === "triangle" && (
														<svg
															className="w-full h-full"
															viewBox="0 0 100 100"
															preserveAspectRatio="none"
														>
															<polygon
																points="50,10 10,90 90,90"
																fill={
																	(element.fillStyle || "filled") === "filled"
																		? element.color
																		: "none"
																}
																stroke={
																	(element.fillStyle || "filled") === "border"
																		? element.color
																		: "none"
																}
																strokeWidth={element.borderWidth || 3}
																vectorEffect="non-scaling-stroke"
															/>
														</svg>
													)}
													{element.shapeType === "square" && (
														<div
															className="w-full h-full rounded-lg box-border"
															style={{
																backgroundColor:
																	(element.fillStyle || "filled") === "filled"
																		? element.color
																		: "transparent",
																border:
																	(element.fillStyle || "filled") === "border"
																		? `${element.borderWidth || 3}px solid ${
																				element.color
																		  }`
																		: "none",
															}}
														/>
													)}
												</div>
											)}

											{}
											{selectedElement === element.id && (
												<>
													{element.type === "text" ? (
														<>
															<div
																className="absolute top-1/2 right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-ew-resize transform -translate-y-1/2"
																onMouseDown={(e) =>
																	startResize(e, element.id, "horizontal")
																}
																onTouchStart={(e) =>
																	startResize(e, element.id, "horizontal")
																}
															/>
															<div
																className="absolute bottom-[-8px] left-1/2 w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-ns-resize transform -translate-x-1/2"
																onMouseDown={(e) =>
																	startResize(e, element.id, "vertical")
																}
																onTouchStart={(e) =>
																	startResize(e, element.id, "vertical")
																}
															/>
															<div
																className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-nwse-resize"
																onMouseDown={(e) =>
																	startResize(e, element.id, "both")
																}
																onTouchStart={(e) =>
																	startResize(e, element.id, "both")
																}
															/>
														</>
													) : (
														<div
															className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-transparent border-2 border-indigo-500 rounded-full z-[1000] cursor-nwse-resize"
															onMouseDown={(e) =>
																startResize(e, element.id, "both")
															}
															onTouchStart={(e) =>
																startResize(e, element.id, "both")
															}
														/>
													)}
													<div
														className="absolute top-[-32px] left-1/2 transform -translate-x-1/2 w-6 h-6 cursor-grab z-[1000] text-white"
														onMouseDown={(e) => startRotate(e, element.id)}
														onTouchStart={(e) => startRotate(e, element.id)}
													>
														<FiRefreshCw className="w-6 h-6 filter drop-shadow-lg" />
													</div>
													<div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur rounded-lg p-2 flex gap-2 z-[1000]">
														{element.type === "shape" && (
															<label className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-600 transition-colors">
																<input
																	type="color"
																	value={element.color || "#4a90e2"}
																	onChange={(e) => {
																		const newElements = elements.map((el) =>
																			el.id === element.id
																				? { ...el, color: e.target.value }
																				: el
																		);
																		commitUpdate(newElements);
																	}}
																	title="Change Color"
																	className="opacity-0 absolute"
																/>
																<div
																	className="w-4 h-4 rounded-full"
																	style={{
																		backgroundColor: element.color || "#4a90e2",
																	}}
																/>
															</label>
														)}
														<button
															className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
															onClick={() => deleteElement(element.id)}
															title="Delete"
														>
															<FiTrash2 className="w-4 h-4 text-white" />
														</button>
													</div>
												</>
											)}
										</div>
									);
								})}

								{}
								{isDrawingMode && (
									<svg
										className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1000]"
										style={{ clipPath: "inset(0)" }}
									>
										<defs>
											<clipPath id="current-draw-clip">
												<rect x="0" y="0" width="100%" height="100%" />
											</clipPath>
										</defs>
										{currentPath && !isErasing && (
											<path
												d={currentPath}
												stroke={brushColor}
												strokeWidth={brushSize}
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
												clipPath="url(#current-draw-clip)"
											/>
										)}
										{isErasing && mousePosition && (
											<circle
												cx={mousePosition?.x}
												cy={mousePosition?.y}
												r={eraserSize / 2}
												fill="none"
												stroke="rgba(255, 255, 255, 0.8)"
												strokeWidth="2"
												strokeDasharray="5,5"
												clipPath="url(#current-draw-clip)"
											/>
										)}
									</svg>
								)}
							</div>
						)}
					</main>

					{}
					<button
						className="fixed bottom-12 right-3 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 z-[1011] shadow-lg bg-gray-700/80 text-white hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl"
						onClick={exportMoodZest}
					>
						<FiDownload size={18} />
						<span className="hidden md:inline">Export</span>
					</button>

					{}
					<canvas ref={canvasRef} className="hidden" />

					{}
					<footer
						className="text-center text-xs px-6 py-2.5 shrink-0 z-[1010]"
						style={{
							backgroundColor: currentTheme.toolbar,
							color: `${currentTheme.textColor}CC`,
							borderTop: `1px solid ${currentTheme.toolbarBorder}`,
						}}
						ref={footerRef}
					>
						<p>MoodZest Creator</p>
					</footer>
					<style jsx global>
						{`
							button,
							a {
								cursor: pointer;
							}
						`}
					</style>
				</div>
			)}
		</>
	);
}

export default MoodZest;
