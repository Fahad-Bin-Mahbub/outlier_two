"use client";
import React, {
	useState,
	useRef,
	useCallback,
	useMemo,
	useEffect,
} from "react";

const VISIBLE_SPECTRUM_MIN_NM = 380;
const VISIBLE_SPECTRUM_MAX_NM = 750;
const DEFAULT_WAVELENGTH_NM = 550;
const N0_GLASS = 1.51;
const N_DISPERSION_COEFF = 0.004;
const LAMBDA_REF_NM = 550;

const LENS_RENDER_THICKNESS = 20;
const LIGHT_SOURCE_SIZE = 30;
const MAX_RAY_SEGMENTS = 10;
const WORLD_BOUND_X = 1000;
const WORLD_BOUND_Y = 1000;

interface Point {
	x: number;
	y: number;
}

interface Draggable {
	id: string;
	position: Point;
}

interface Lens extends Draggable {
	type: "lens";
	lensType: "convex" | "concave";
	diameter: number;
	referenceFocalLength: number;
}

interface LightSource extends Draggable {
	type: "lightsource";
	sourceType: "beam" | "point";
	angle: number;
	numRays: number;
	spreadAngle: number;
}

type OpticalElement = Lens | LightSource;

interface RaySegment {
	start: Point;
	end: Point;
}

interface ViewBox {
	minX: number;
	minY: number;
	width: number;
	height: number;
}

interface DragState {
	elementId: string | null;
	offset: Point;
}

interface PinchState {
	isPinching: boolean;
	initialDistance: number;
	initialViewBox: ViewBox;
	lastMidpoint: Point | null;
}

function wavelengthToColor(wavelength: number): string {
	let R, G, B;
	if (wavelength >= 380 && wavelength < 440) {
		R = -(wavelength - 440) / (440 - 380);
		G = 0.0;
		B = 1.0;
	} else if (wavelength >= 440 && wavelength < 490) {
		R = 0.0;
		G = (wavelength - 440) / (490 - 440);
		B = 1.0;
	} else if (wavelength >= 490 && wavelength < 510) {
		R = 0.0;
		G = 1.0;
		B = -(wavelength - 510) / (510 - 490);
	} else if (wavelength >= 510 && wavelength < 580) {
		R = (wavelength - 510) / (580 - 510);
		G = 1.0;
		B = 0.0;
	} else if (wavelength >= 580 && wavelength < 645) {
		R = 1.0;
		G = -(wavelength - 645) / (645 - 580);
		B = 0.0;
	} else if (wavelength >= 645 && wavelength <= 750) {
		R = 1.0;
		G = 0.0;
		B = 0.0;
	} else {
		R = 0.5;
		G = 0.5;
		B = 0.5;
	}

	let factor;
	if (wavelength >= 380 && wavelength < 420) {
		factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
	} else if (wavelength >= 420 && wavelength < 645) {
		factor = 1.0;
	} else if (wavelength >= 645 && wavelength <= 750) {
		factor = 0.3 + (0.7 * (750 - wavelength)) / (750 - 645);
	} else {
		factor = 0.0;
	}

	const gamma = 0.8;
	const adjust = (colorVal: number, fact: number) =>
		Math.round(255 * Math.pow(colorVal * fact, gamma));
	return `rgb(${adjust(R, factor)}, ${adjust(G, factor)}, ${adjust(
		B,
		factor
	)})`;
}

function generateConcaveLensPath(
	width: number,
	height: number,
	referenceFocalLength: number
): string {
	const w = width / 2;
	const h = height / 2;

	const absFocal = Math.max(10, Math.abs(referenceFocalLength));

	const minCurvature = 0.5;
	const maxCurvature = 0.13;
	const curvatureFactor = Math.min(
		maxCurvature,
		Math.max(minCurvature, 200 / absFocal)
	);

	return [
		`M ${-w} ${-h}`,
		`Q ${-w * curvatureFactor} 0 ${-w} ${h}`,
		`L ${w} ${h}`,
		`Q ${w * curvatureFactor} 0 ${w} ${-h}`,
		`Z`,
	].join(" ");
}

function getConvexLensThickness(
	referenceFocalLength: number,
	diameter: number
): number {
	const absFocal = Math.max(10, Math.abs(referenceFocalLength));

	const minRx = diameter * 0.05;
	const maxRx = diameter * 0.15;

	const range = maxRx - minRx;
	const scaledRx = minRx + range * Math.min(1, 150 / absFocal);

	return scaledRx;
}

function generateConvexLensPath(
	width: number,
	height: number,
	referenceFocalLength: number
): string {
	const w = width / 2;
	const h = height / 2;

	const absFocal = Math.max(10, Math.abs(referenceFocalLength));
	const curvature = Math.max(0.2, Math.min(0.8, 150 / absFocal));

	return [
		`M ${-w} ${-h}`,
		`Q 0 ${-h * curvature} ${w} ${-h}`,
		`L ${w} ${h}`,
		`Q 0 ${h * curvature} ${-w} ${h}`,
		`Z`,
	].join(" ");
}

function getRefractiveIndex(wavelengthNm: number): number {
	const lambdaUm = wavelengthNm / 1000;
	return N0_GLASS + N_DISPERSION_COEFF / (lambdaUm * lambdaUm);
}

function getCurrentFocalLength(lens: Lens, wavelengthNm: number): number {
	const nRef = getRefractiveIndex(LAMBDA_REF_NM);
	const nCurrent = getRefractiveIndex(wavelengthNm);
	if (nRef <= 1 || nCurrent <= 1)
		return lens.referenceFocalLength * (lens.lensType === "concave" ? -1 : 1);

	let f = (lens.referenceFocalLength * (nRef - 1)) / (nCurrent - 1);
	return lens.lensType === "concave" ? -f : f;
}

const vec = {
	add: (p1: Point, p2: Point): Point => ({ x: p1.x + p2.x, y: p1.y + p2.y }),
	sub: (p1: Point, p2: Point): Point => ({ x: p1.x - p2.x, y: p1.y - p2.y }),
	scale: (p: Point, s: number): Point => ({ x: p.x * s, y: p.y * s }),
	dist: (p1: Point, p2: Point): number =>
		Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
	normalize: (p: Point): Point => {
		const len = Math.sqrt(p.x * p.x + p.y * p.y);
		return len === 0 ? { x: 0, y: 0 } : { x: p.x / len, y: p.y / len };
	},
	angle: (p: Point): number => Math.atan2(p.y, p.x),
};

const degToRad = (deg: number): number => deg * (Math.PI / 180);

function getElementBoundingBox(element: OpticalElement): {
	x: number;
	y: number;
	width: number;
	height: number;
} {
	if (element.type === "lens") {
		return {
			x: element.position.x - LENS_RENDER_THICKNESS / 2,
			y: element.position.y - element.diameter / 2,
			width: LENS_RENDER_THICKNESS,
			height: element.diameter,
		};
	} else {
		return {
			x: element.position.x - LIGHT_SOURCE_SIZE / 2,
			y: element.position.y - LIGHT_SOURCE_SIZE / 2,
			width: LIGHT_SOURCE_SIZE,
			height: LIGHT_SOURCE_SIZE,
		};
	}
}

function checkCollision(el1: OpticalElement, el2: OpticalElement): boolean {
	const box1 = getElementBoundingBox(el1);
	const box2 = getElementBoundingBox(el2);
	return (
		box1.x < box2.x + box2.width &&
		box1.x + box1.width > box2.x &&
		box1.y < box2.y + box2.height &&
		box1.y + box1.height > box2.y
	);
}

function calculateFocalPoints(
	lens: Lens,
	wavelengthNm: number
): { primary: Point; secondary: Point } {
	const focalLength = getCurrentFocalLength(lens, wavelengthNm);

	const primaryFocalPoint = {
		x: lens.position.x + Math.sign(focalLength) * Math.abs(focalLength),
		y: lens.position.y,
	};

	const secondaryFocalPoint = {
		x: lens.position.x - Math.sign(focalLength) * Math.abs(focalLength),
		y: lens.position.y,
	};

	return { primary: primaryFocalPoint, secondary: secondaryFocalPoint };
}

const OpticsLab: React.FC = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				mobileMenuOpen &&
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setMobileMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [mobileMenuOpen]);

	useEffect(() => {
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}, []);

	const [isMeasuring, setIsMeasuring] = useState(false);
	const [isMeasuringFocalLength, setIsMeasuringFocalLength] = useState(false);
	const [measurementInstructions, setMeasurementInstructions] = useState("");
	const [showDemoRays, setShowDemoRays] = useState(false);

	const calculateDistance = (p1: Point, p2: Point): number => {
		return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	};

	const toggleMeasurementMode = () => {
		if (isMeasuringFocalLength) {
			setIsMeasuringFocalLength(false);
		}

		setIsMeasuring(!isMeasuring);
		setMeasurementPoints([]);

		if (!isMeasuring) {
			setMeasurementInstructions("Click two points to measure distance");
		} else {
			setMeasurementInstructions("");
		}
	};

	const toggleFocalLengthMeasurement = () => {
		if (isMeasuring) {
			setIsMeasuring(false);
		}

		setIsMeasuringFocalLength(!isMeasuringFocalLength);
		setMeasurementPoints([]);
		setShowDemoRays(!isMeasuringFocalLength);

		if (!isMeasuringFocalLength) {
			setMeasurementInstructions("Select a lens");
		} else {
			setMeasurementInstructions("");
			setShowDemoRays(false);
		}
	};

	const [measurementPoints, setMeasurementPoints] = useState<Point[]>([]);
	const [measuredFocalLength, setMeasuredFocalLength] = useState<number | null>(
		null
	);
	const [measuredLensId, setMeasuredLensId] = useState<string | null>(null);

	const [elements, setElements] = useState<OpticalElement[]>([
		{
			id: "lens1",
			type: "lens",
			lensType: "convex",
			position: { x: 0, y: 0 },
			diameter: 100,
			referenceFocalLength: 150,
		},
		{
			id: "lens2",
			type: "lens",
			lensType: "concave",
			position: { x: 200, y: -50 },
			diameter: 80,
			referenceFocalLength: -120,
		},
		{
			id: "source1",
			type: "lightsource",
			sourceType: "point",
			position: { x: -300, y: 0 },
			angle: 0,
			numRays: 11,
			spreadAngle: 30,
		},
		{
			id: "source2",
			type: "lightsource",
			sourceType: "point",
			position: { x: -250, y: 100 },
			angle: 0,
			numRays: 7,
			spreadAngle: 30,
		},
	]);

	const [wavelength, setWavelength] = useState<number>(DEFAULT_WAVELENGTH_NM);
	const [selectedElementId, setSelectedElementId] = useState<string | null>(
		null
	);

	const svgRef = useRef<SVGSVGElement>(null);
	const [viewBox, setViewBox] = useState<ViewBox>({
		minX: -400,
		minY: -300,
		width: 800,
		height: 600,
	});

	const [dragState, setDragState] = useState<DragState>({
		elementId: null,
		offset: { x: 0, y: 0 },
	});

	const [pinchState, setPinchState] = useState<PinchState>({
		isPinching: false,
		initialDistance: 0,
		initialViewBox: viewBox,
		lastMidpoint: null,
	});

	const getSVGPoint = useCallback((clientX: number, clientY: number): Point => {
		if (!svgRef.current) return { x: 0, y: 0 };
		const pt = svgRef.current.createSVGPoint();
		pt.x = clientX;
		pt.y = clientY;
		const ctm = svgRef.current.getScreenCTM();
		return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
	}, []);

	useEffect(() => {
		if (measuredLensId) {
			const lens = elements.find(
				(el) => el.id === measuredLensId && el.type === "lens"
			) as Lens | undefined;
			if (lens) {
				const focalLength = Math.abs(getCurrentFocalLength(lens, wavelength));
				setMeasuredFocalLength(focalLength);

				const { primary } = calculateFocalPoints(lens, wavelength);
				setMeasurementPoints([lens.position, primary]);
			}
		}
	}, [elements, wavelength, measuredLensId]);

	const focalPoints = useMemo(() => {
		const points: { lensId: string; primary: Point; secondary: Point }[] = [];

		elements
			.filter((el): el is Lens => el.type === "lens")
			.forEach((lens) => {
				const { primary, secondary } = calculateFocalPoints(lens, wavelength);
				points.push({
					lensId: lens.id,
					primary,
					secondary,
				});
			});

		return points;
	}, [elements, wavelength]);

	const demoRays = useMemo(() => {
		if (!showDemoRays) return [];

		const rays: RaySegment[][] = [];

		elements
			.filter((el): el is Lens => el.type === "lens")
			.forEach((lens) => {
				const { primary } = calculateFocalPoints(lens, wavelength);
				const focalLength = getCurrentFocalLength(lens, wavelength);
				const isConverging = focalLength > 0;

				const rayCount = 5;
				const raySpacing = lens.diameter / (rayCount - 1);

				for (let i = 0; i < rayCount; i++) {
					const startY = lens.position.y - lens.diameter / 2 + i * raySpacing;
					const startX = lens.position.x - 300;

					const segments: RaySegment[] = [
						{
							start: { x: startX, y: startY },
							end: { x: lens.position.x, y: startY },
						},
					];

					if (isConverging) {
						segments.push({
							start: { x: lens.position.x, y: startY },
							end: {
								x: primary.x + 300,
								y:
									primary.y +
									(startY - lens.position.y) * (1 + 300 / focalLength),
							},
						});
					} else {
						const dx = lens.position.x - primary.x;
						const dy = startY - lens.position.y;
						const slope = dy / dx;

						segments.push({
							start: { x: lens.position.x, y: startY },
							end: { x: lens.position.x + 300, y: startY + slope * 300 },
						});
					}

					rays.push(segments);
				}
			});

		return rays;
	}, [elements, wavelength, showDemoRays]);

	const rayPaths = useMemo(() => {
		const paths: RaySegment[][] = [];
		const worldOpticalAxisY = 0;

		elements
			.filter((el) => el.type === "lightsource")
			.forEach((source) => {
				const s = source as LightSource;
				const initialRays: { origin: Point; dir: Point }[] = [];

				if (s.sourceType === "beam") {
					const angleRad = degToRad(s.angle);
					const dir = { x: Math.cos(angleRad), y: Math.sin(angleRad) };
					const beamWidth = Math.min(
						LIGHT_SOURCE_SIZE * 0.4,
						s.numRays > 1 ? 40 : 0
					);
					for (let i = 0; i < s.numRays; i++) {
						const offset =
							s.numRays > 1 ? (i / (s.numRays - 1) - 0.5) * beamWidth : 0;
						const startPos = {
							x: s.position.x - Math.sin(angleRad) * offset,
							y: s.position.y + Math.cos(angleRad) * offset,
						};
						initialRays.push({ origin: startPos, dir });
					}
				} else {
					const baseAngleRad = degToRad(s.angle);
					const spreadRad = degToRad(s.spreadAngle);
					for (let i = 0; i < s.numRays; i++) {
						const angle =
							s.numRays > 1
								? baseAngleRad -
								  spreadRad / 2 +
								  (i / (s.numRays - 1)) * spreadRad
								: baseAngleRad;
						initialRays.push({
							origin: s.position,
							dir: { x: Math.cos(angle), y: Math.sin(angle) },
						});
					}
				}

				initialRays.forEach((ray) => {
					let currentOrigin = { ...ray.origin };
					let currentDir = { ...ray.dir };
					const segments: RaySegment[] = [];

					for (
						let segmentCount = 0;
						segmentCount < MAX_RAY_SEGMENTS;
						segmentCount++
					) {
						let closestIntersection: {
							lens: Lens;
							point: Point;
							dist: number;
						} | null = null;

						elements
							.filter((el) => el.type === "lens")
							.forEach((lensEl) => {
								const l = lensEl as Lens;
								if (currentDir.x === 0) return;

								const t = (l.position.x - currentOrigin.x) / currentDir.x;
								if (t <= 1e-6) return;

								const intersectY = currentOrigin.y + t * currentDir.y;
								const distToOpticalAxis = Math.abs(intersectY - l.position.y);

								if (distToOpticalAxis <= l.diameter / 2) {
									const intersectionPoint = { x: l.position.x, y: intersectY };
									const dist = vec.dist(currentOrigin, intersectionPoint);
									if (!closestIntersection || dist < closestIntersection.dist) {
										closestIntersection = {
											lens: l,
											point: intersectionPoint,
											dist,
										};
									}
								}
							});

						if (closestIntersection) {
							segments.push({
								start: currentOrigin,
								end: closestIntersection.point,
							});
							currentOrigin = { ...closestIntersection.point };

							const lens = closestIntersection.lens;
							const f = getCurrentFocalLength(lens, wavelength);

							const y_rel_to_lens_axis = currentOrigin.y - lens.position.y;
							const angleIn = vec.angle(currentDir);

							let deflectionAngle = -y_rel_to_lens_axis / f;
							let newAngle;

							if (Math.abs(currentDir.x) < 1e-6) {
								newAngle =
									(currentDir.y > 0 ? Math.PI / 2 : -Math.PI / 2) +
									deflectionAngle;
							} else {
								let rayAngleToHorizontal = Math.atan2(
									currentDir.y,
									currentDir.x
								);
								newAngle = rayAngleToHorizontal + deflectionAngle;
							}

							currentDir = { x: Math.cos(newAngle), y: Math.sin(newAngle) };
						} else {
							const endX = currentDir.x > 0 ? WORLD_BOUND_X : -WORLD_BOUND_X;
							const endY = currentDir.y > 0 ? WORLD_BOUND_Y : -WORLD_BOUND_Y;

							let tX = Infinity,
								tY = Infinity;
							if (Math.abs(currentDir.x) > 1e-6)
								tX = (endX - currentOrigin.x) / currentDir.x;
							if (Math.abs(currentDir.y) > 1e-6)
								tY = (endY - currentOrigin.y) / currentDir.y;

							const t = Math.min(tX, tY);
							const endPoint = vec.add(
								currentOrigin,
								vec.scale(
									currentDir,
									t > 0 ? t : Math.max(viewBox.width, viewBox.height)
								)
							);
							segments.push({ start: currentOrigin, end: endPoint });
							break;
						}
					}
					paths.push(segments);
				});
			});
		return paths;
	}, [elements, wavelength, viewBox.width, viewBox.height]);

	const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
		if (e.touches.length === 2) {
			e.preventDefault();

			const t1 = getSVGPoint(e.touches[0].clientX, e.touches[0].clientY);
			const t2 = getSVGPoint(e.touches[1].clientX, e.touches[1].clientY);
			setPinchState({
				isPinching: true,
				initialDistance: vec.dist(t1, t2),
				initialViewBox: { ...viewBox },
				lastMidpoint: { x: (t1.x + t2.x) / 2, y: (t1.y + t2.y) / 2 },
			});
		}
	};

	const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
		if (e.touches.length === 2 && pinchState.isPinching) {
			e.preventDefault();
			const t1 = getSVGPoint(e.touches[0].clientX, e.touches[0].clientY);
			const t2 = getSVGPoint(e.touches[1].clientX, e.touches[1].clientY);
			const currentDistance = vec.dist(t1, t2);
			const currentMidpoint = { x: (t1.x + t2.x) / 2, y: (t1.y + t2.y) / 2 };

			if (!pinchState.isPinching || pinchState.initialDistance === 0) {
				setPinchState({
					isPinching: true,
					initialDistance: currentDistance,
					initialViewBox: { ...viewBox },
					lastMidpoint: currentMidpoint,
				});
				return;
			}

			const scale = pinchState.initialDistance / currentDistance;
			const newWidth = viewBox.width * scale;
			const newHeight = viewBox.height * scale;

			const newMinX =
				currentMidpoint.x - (currentMidpoint.x - viewBox.minX) * scale;
			const newMinY =
				currentMidpoint.y - (currentMidpoint.y - viewBox.minY) * scale;

			setViewBox({
				width: newWidth,
				height: newHeight,
				minX: newMinX,
				minY: newMinY,
			});

			setPinchState((prev) => ({
				...prev,
				lastMidpoint: currentMidpoint,
			}));
		}
	};

	const handleTouchEnd = () => {
		setPinchState({
			isPinching: false,
			initialDistance: 0,
			initialViewBox: viewBox,
			lastMidpoint: null,
		});
	};

	const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
		if (e.touches && e.touches.length === 2) {
			e.preventDefault();
			const t1 = getSVGPoint(e.touches[0].clientX, e.touches[0].clientY);
			const t2 = getSVGPoint(e.touches[1].clientX, e.touches[1].clientY);
			setPinchState({
				isPinching: true,
				initialDistance: vec.dist(t1, t2),
				initialViewBox: { ...viewBox },
				lastMidpoint: { x: (t1.x + t2.x) / 2, y: (t1.y + t2.y) / 2 },
			});
			return;
		}

		const svgPoint = getSVGPoint(e.clientX, e.clientY);
		let targetElement: OpticalElement | undefined = undefined;
		let minDistanceSq = Infinity;

		elements.forEach((el) => {
			const elBox = getElementBoundingBox(el);
			if (
				svgPoint.x >= elBox.x &&
				svgPoint.x <= elBox.x + elBox.width &&
				svgPoint.y >= elBox.y &&
				svgPoint.y <= elBox.y + elBox.height
			) {
				const distSq = vec.dist(svgPoint, el.position);
				if (distSq < minDistanceSq) {
					minDistanceSq = distSq;
					targetElement = el;
				}
			}
		});

		if (targetElement) {
			e.currentTarget.setPointerCapture(e.pointerId);

			if (isMeasuringFocalLength && targetElement.type === "lens") {
				const lens = targetElement as Lens;
				const focalLength = Math.abs(getCurrentFocalLength(lens, wavelength));
				setMeasuredFocalLength(focalLength);
				setMeasuredLensId(lens.id);
				setSelectedElementId(lens.id);

				setMeasurementPoints([lens.position]);

				const focalPoint = calculateFocalPoints(lens, wavelength);
				setMeasurementPoints([lens.position, focalPoint.primary]);
			} else {
				setDragState({
					elementId: targetElement.id,
					offset: vec.sub(targetElement.position, svgPoint),
				});
				setSelectedElementId(targetElement.id);
			}
		} else if (e.target === svgRef.current) {
			if (isMeasuring) {
				setMeasurementPoints((prev) => {
					if (prev.length >= 2) return [svgPoint];
					return [...prev, svgPoint];
				});
				e.preventDefault();
			} else {
				e.currentTarget.setPointerCapture(e.pointerId);
				setSelectedElementId(null);
				setPinchState((prev) => ({
					...prev,
					isPinching: false,
					lastMidpoint: svgPoint,
				}));
			}
		}
	};

	const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
		if (
			dragState.elementId ||
			pinchState.isPinching ||
			pinchState.lastMidpoint
		) {
			e.preventDefault();
		}

		if (pinchState.isPinching && e.touches && e.touches.length === 2) {
			const t1 = getSVGPoint(e.touches[0].clientX, e.touches[0].clientY);
			const t2 = getSVGPoint(e.touches[1].clientX, e.touches[1].clientY);
			const currentDistance = vec.dist(t1, t2);
			const currentMidpoint = { x: (t1.x + t2.x) / 2, y: (t1.y + t2.y) / 2 };

			if (pinchState.initialDistance === 0) return;

			const scale = currentDistance / pinchState.initialDistance;
			const newWidth = pinchState.initialViewBox.width / scale;
			const newHeight = pinchState.initialViewBox.height / scale;

			const dx =
				(currentMidpoint.x - pinchState.initialViewBox.minX) * (1 - 1 / scale);
			const dy =
				(currentMidpoint.y - pinchState.initialViewBox.minY) * (1 - 1 / scale);

			let newMinX = pinchState.initialViewBox.minX - dx;
			let newMinY = pinchState.initialViewBox.minY - dy;

			if (pinchState.lastMidpoint) {
				const panDX = currentMidpoint.x - pinchState.lastMidpoint.x;
				const panDY = currentMidpoint.y - pinchState.lastMidpoint.y;
				newMinX -= panDX * (viewBox.width / newWidth);
				newMinY -= panDY * (viewBox.height / newHeight);
			}

			setViewBox({
				width: newWidth,
				height: newHeight,
				minX: newMinX,
				minY: newMinY,
			});

			setPinchState((prev) => ({
				...prev,
				lastMidpoint: currentMidpoint,
			}));
			return;
		}

		const svgPoint = getSVGPoint(e.clientX, e.clientY);

		if (dragState.elementId) {
			const newPosition = vec.add(svgPoint, dragState.offset);

			let collision = false;
			const draggedEl = elements.find((el) => el.id === dragState.elementId);
			if (draggedEl) {
				const tempDraggedEl = { ...draggedEl, position: newPosition };
				for (const otherEl of elements) {
					if (
						otherEl.id !== dragState.elementId &&
						checkCollision(tempDraggedEl, otherEl)
					) {
						collision = true;
						break;
					}
				}
			}

			if (!collision) {
				setElements((prev) =>
					prev.map((el) =>
						el.id === dragState.elementId
							? { ...el, position: newPosition }
							: el
					)
				);
			}
		} else if (pinchState.lastMidpoint && !pinchState.isPinching) {
			const dx = svgPoint.x - pinchState.lastMidpoint.x;
			const dy = svgPoint.y - pinchState.lastMidpoint.y;
			setViewBox((prev) => ({
				...prev,
				minX: prev.minX - dx,
				minY: prev.minY - dy,
			}));
		}
	};

	const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
		if (
			dragState.elementId ||
			(pinchState.lastMidpoint && !pinchState.isPinching) ||
			pinchState.isPinching
		) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
		setDragState({ elementId: null, offset: { x: 0, y: 0 } });
		setPinchState((prev) => ({
			...prev,
			isPinching: false,
			lastMidpoint: null,
		}));
	};

	const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
		e.preventDefault();
		const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9;
		const mousePoint = getSVGPoint(e.clientX, e.clientY);

		const newWidth = viewBox.width * scaleFactor;
		const newHeight = viewBox.height * scaleFactor;

		const newMinX = mousePoint.x - (mousePoint.x - viewBox.minX) * scaleFactor;
		const newMinY = mousePoint.y - (mousePoint.y - viewBox.minY) * scaleFactor;

		setViewBox({
			width: newWidth,
			height: newHeight,
			minX: newMinX,
			minY: newMinY,
		});
	};

	const addElement = (
		type: "lens" | "lightsource",
		lensType?: "convex" | "concave"
	) => {
		const newId = `el-${Date.now()}`;
		const newPosition = {
			x: viewBox.minX + viewBox.width / 2,
			y: viewBox.minY + viewBox.height / 2,
		};

		let newElement: OpticalElement;

		if (type === "lens") {
			newElement = {
				id: newId,
				type: "lens",
				lensType: lensType || "convex",
				position: newPosition,
				diameter: 80,
				referenceFocalLength: lensType === "concave" ? -120 : 150,
			};
		} else {
			newElement = {
				id: newId,
				type: "lightsource",
				sourceType: "point",
				position: newPosition,
				angle: 0,
				numRays: 5,
				spreadAngle: 30,
			};
		}

		setElements((prev) => [...prev, newElement]);
		setSelectedElementId(newId);
	};

	const deleteSelectedElement = () => {
		if (selectedElementId) {
			if (selectedElementId === measuredLensId) {
				setMeasuredLensId(null);
				setMeasuredFocalLength(null);
				setMeasurementPoints([]);
			}

			setElements((prev) => prev.filter((el) => el.id !== selectedElementId));
			setSelectedElementId(null);
		}
	};

	const selectedElement = elements.find((el) => el.id === selectedElementId);
	let focalLengthInfo: string | null = null;
	if (selectedElement && selectedElement.type === "lens") {
		const f = getCurrentFocalLength(selectedElement, wavelength);
		focalLengthInfo = `Focal Length: ${Math.abs(f).toFixed(1)} units (${
			f > 0 ? "Converging" : "Diverging"
		}) at ${wavelength}nm`;
	}

	return (
		<div
			className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
			style={{ fontFamily: "'Quicksand', sans-serif" }}
		>
			{}
			<div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
				<div className="flex items-center">
					<div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
						<span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
							OpticsLab
						</span>
						<span className="text-gray-5000 font-normal ml-2 text-sm">
							Professional Edition
						</span>
					</div>
				</div>

				<div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 scale-[0.85] md:scale-100 min-w-0">
					<div className="flex items-center bg-gray-100 px-2 md:px-3 py-1 rounded-full flex-shrink-0">
						<div
							className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-2 border border-white shadow-sm"
							style={{ backgroundColor: wavelengthToColor(wavelength) }}
						/>
						<span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
							{wavelength} nm
						</span>
					</div>

					<input
						type="range"
						min={VISIBLE_SPECTRUM_MIN_NM}
						max={VISIBLE_SPECTRUM_MAX_NM}
						value={wavelength}
						onChange={(e) => setWavelength(Number(e.target.value))}
						className="min-w-0 flex-1 h-1.5 bg-gradient-to-r from-purple-500 via-green-500 to-red-500 rounded-full appearance-none cursor-pointer"
					/>
				</div>
			</div>

			{}
			<div className="flex flex-1 overflow-hidden flex-col-reverse md:flex-row">
				{}
				<div className="flex-1 relative">
					{}
					{measurementInstructions && (
						<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm md:text-base">
							{measurementInstructions}
						</div>
					)}

					<svg
						ref={svgRef}
						className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 touch-none"
						viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerUp}
						onWheel={handleWheel}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<defs>
							{}
							<filter
								id="glassEffect"
								x="-20%"
								y="-20%"
								width="140%"
								height="140%"
							>
								<feGaussianBlur
									in="SourceAlpha"
									stdDeviation="2"
									result="blur"
								/>
								<feComponentTransfer in="blur" result="shadow">
									<feFuncA type="linear" slope="0.2" />
								</feComponentTransfer>
								<feComposite in="SourceGraphic" in2="shadow" operator="over" />
							</filter>

							{}
							<linearGradient
								id="convexLensGradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
								<stop offset="100%" stopColor="rgba(79, 70, 229, 0.25)" />
							</linearGradient>

							<linearGradient
								id="concaveLensGradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="rgba(236, 72, 153, 0.15)" />
								<stop offset="100%" stopColor="rgba(219, 39, 119, 0.25)" />
							</linearGradient>

							<linearGradient
								id="lightSourceGradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stopColor="rgba(252, 211, 77, 0.2)" />
								<stop offset="100%" stopColor="rgba(245, 158, 11, 0.3)" />
							</linearGradient>

							{}
							<pattern
								id="dashedLine"
								patternUnits="userSpaceOnUse"
								width="10"
								height="10"
							>
								<line
									x1="0"
									y1="5"
									x2="10"
									y2="5"
									stroke="#888"
									strokeWidth="1"
									strokeDasharray="5,5"
								/>
							</pattern>
						</defs>

						{}
						{elements
							.filter((el): el is Lens => el.type === "lens")
							.map((lens) => (
								<line
									key={`axis-${lens.id}`}
									x1={viewBox.minX}
									y1={lens.position.y}
									x2={viewBox.minX + viewBox.width}
									y2={lens.position.y}
									stroke="url(#dashedLine)"
									strokeWidth="1"
									strokeDasharray="5,5"
									opacity={
										isMeasuringFocalLength || selectedElementId === lens.id
											? 0.7
											: 0.3
									}
								/>
							))}

						{}
						{focalPoints.map((fp) => {
							const lens = elements.find((el) => el.id === fp.lensId) as
								| Lens
								| undefined;
							const isSelected = selectedElementId === fp.lensId;
							const isMeasured = measuredLensId === fp.lensId;
							const isHighlighted =
								isSelected || isMeasuringFocalLength || isMeasured;

							if (!lens) return null;

							return (
								<g
									key={`focal-points-${fp.lensId}`}
									opacity={isHighlighted ? 1 : 0.3}
								>
									{}
									<circle
										cx={fp.primary.x}
										cy={fp.primary.y}
										r={5 * (600 / viewBox.width)}
										fill={
											lens.lensType === "convex"
												? "rgba(99, 102, 241, 0.8)"
												: "rgba(236, 72, 153, 0.8)"
										}
										stroke="white"
										strokeWidth="1"
									/>
									<line
										x1={fp.primary.x}
										y1={fp.primary.y - 20}
										x2={fp.primary.x}
										y2={fp.primary.y + 20}
										stroke={
											lens.lensType === "convex"
												? "rgba(99, 102, 241, 0.5)"
												: "rgba(236, 72, 153, 0.5)"
										}
										strokeWidth="1"
										strokeDasharray="3,3"
									/>
									<text
										x={fp.primary.x}
										y={fp.primary.y - 25}
										fill={lens.lensType === "convex" ? "#4f46e5" : "#be185d"}
										fontSize={12 * (600 / viewBox.width)}
										textAnchor="middle"
										fontWeight="bold"
									>
										F
									</text>

									{}
									<circle
										cx={fp.secondary.x}
										cy={fp.secondary.y}
										r={5 * (600 / viewBox.width)}
										fill={
											lens.lensType === "convex"
												? "rgba(99, 102, 241, 0.5)"
												: "rgba(236, 72, 153, 0.5)"
										}
										stroke="white"
										strokeWidth="1"
										opacity="0.7"
									/>
									<line
										x1={fp.secondary.x}
										y1={fp.secondary.y - 20}
										x2={fp.secondary.x}
										y2={fp.secondary.y + 20}
										stroke={
											lens.lensType === "convex"
												? "rgba(99, 102, 241, 0.3)"
												: "rgba(236, 72, 153, 0.3)"
										}
										strokeWidth="1"
										strokeDasharray="3,3"
									/>
									<text
										x={fp.secondary.x}
										y={fp.secondary.y - 25}
										fill={lens.lensType === "convex" ? "#4f46e5" : "#be185d"}
										fontSize={12 * (600 / viewBox.width)}
										textAnchor="middle"
										fontWeight="bold"
										opacity="0.7"
									>
										F'
									</text>
								</g>
							);
						})}

						{}
						{demoRays.map((segments, pathIdx) => (
							<g key={`demo-path-${pathIdx}`} className="opacity-70">
								{segments.map((seg, segIdx) => (
									<line
										key={`demo-seg-${pathIdx}-${segIdx}`}
										x1={seg.start.x}
										y1={seg.start.y}
										x2={seg.end.x}
										y2={seg.end.y}
										stroke={wavelengthToColor(wavelength)}
										strokeWidth={1.0 * (600 / viewBox.width)}
										strokeDasharray="3,3"
									/>
								))}
							</g>
						))}

						{}
						{rayPaths.map((segments, pathIdx) => (
							<g key={`path-${pathIdx}`}>
								{segments.map((seg, segIdx) => (
									<line
										key={`seg-${pathIdx}-${segIdx}`}
										x1={seg.start.x}
										y1={seg.start.y}
										x2={seg.end.x}
										y2={seg.end.y}
										stroke={wavelengthToColor(wavelength)}
										strokeWidth={1.0 * (600 / viewBox.width)}
										className="opacity-90 stroke-linecap-round"
									/>
								))}
							</g>
						))}

						{}
						{elements.map((el) => {
							if (el.type === "lens") {
								const lens = el as Lens;
								const isSelected = lens.id === selectedElementId;
								const isMeasured = measuredLensId === lens.id;
								const isHighlighted = isSelected || isMeasured;
								const lensFill =
									lens.lensType === "convex"
										? "url(#convexLensGradient)"
										: "url(#concaveLensGradient)";
								const strokeColor =
									lens.lensType === "convex"
										? "rgba(99, 102, 241, 0.7)"
										: "rgba(236, 72, 153, 0.7)";

								return (
									<g
										key={lens.id}
										transform={`translate(${lens.position.x}, ${lens.position.y})`}
										className={`cursor-grab ${
											isHighlighted
												? "drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"
												: ""
										}`}
									>
										{lens.lensType === "convex" ? (
											<ellipse
												cx={0}
												cy={0}
												rx={getConvexLensThickness(
													lens.referenceFocalLength,
													lens.diameter
												)}
												ry={lens.diameter / 2}
												fill={lensFill}
												stroke={strokeColor}
												strokeWidth="1.5"
												filter="url(#glassEffect)"
											/>
										) : (
											<path
												d={generateConcaveLensPath(
													LENS_RENDER_THICKNESS,
													lens.diameter,
													lens.referenceFocalLength
												)}
												fill={lensFill}
												stroke={strokeColor}
												strokeWidth="1.5"
												filter="url(#glassEffect)"
											/>
										)}
									</g>
								);
							} else {
								const source = el as LightSource;
								const isSelected = source.id === selectedElementId;

								return (
									<g
										key={source.id}
										transform={`translate(${source.position.x}, ${source.position.y}) rotate(${source.angle})`}
										className={`cursor-grab ${
											isSelected
												? "drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
												: ""
										}`}
									>
										<circle
											cx={0}
											cy={0}
											r={LIGHT_SOURCE_SIZE / 2}
											fill="url(#lightSourceGradient)"
											stroke="rgba(245, 158, 11, 0.7)"
											strokeWidth="1.2"
											filter="url(#glassEffect)"
										/>

										<line
											x1={0}
											y1={0}
											x2={LIGHT_SOURCE_SIZE * 0.6}
											y2={0}
											stroke={wavelengthToColor(wavelength)}
											strokeWidth={1.2 * (600 / viewBox.width)}
										/>

										<polygon
											points={`${LIGHT_SOURCE_SIZE * 0.6},0 ${
												LIGHT_SOURCE_SIZE * 0.5
											},-${LIGHT_SOURCE_SIZE * 0.1} ${
												LIGHT_SOURCE_SIZE * 0.5
											},${LIGHT_SOURCE_SIZE * 0.1}`}
											fill={wavelengthToColor(wavelength)}
										/>
									</g>
								);
							}
						})}

						{}
						{isMeasuring && measurementPoints.length > 0 && (
							<>
								{measurementPoints.map((point, index) => (
									<circle
										key={`measure-point-${index}`}
										cx={point.x}
										cy={point.y}
										r={5 * (600 / viewBox.width)}
										fill="#3b82f6"
										stroke="white"
										strokeWidth={1}
									/>
								))}
								{measurementPoints.length === 2 && (
									<>
										<line
											x1={measurementPoints[0].x}
											y1={measurementPoints[0].y}
											x2={measurementPoints[1].x}
											y2={measurementPoints[1].y}
											stroke="#3b82f6"
											strokeDasharray="5,5"
											strokeWidth={1.5 * (600 / viewBox.width)}
										/>
										<text
											x={(measurementPoints[0].x + measurementPoints[1].x) / 2}
											y={
												(measurementPoints[0].y + measurementPoints[1].y) / 2 -
												10
											}
											fill="#1e40af"
											fontSize={12 * (600 / viewBox.width)}
											textAnchor="middle"
											fontWeight="bold"
										>
											{`${calculateDistance(
												measurementPoints[0],
												measurementPoints[1]
											).toFixed(1)} units`}
										</text>
									</>
								)}
							</>
						)}

						{}
						{isMeasuringFocalLength && measurementPoints.length === 2 && (
							<>
								<line
									x1={measurementPoints[0].x}
									y1={measurementPoints[0].y}
									x2={measurementPoints[1].x}
									y2={measurementPoints[1].y}
									stroke="#3b82f6"
									strokeWidth={2 * (600 / viewBox.width)}
									strokeDasharray="5,5"
								/>
								<text
									x={(measurementPoints[0].x + measurementPoints[1].x) / 2}
									y={(measurementPoints[0].y + measurementPoints[1].y) / 2 - 10}
									fill="#1e40af"
									fontSize={14 * (600 / viewBox.width)}
									textAnchor="middle"
									fontWeight="bold"
								>
									{`Focal Length: ${measuredFocalLength?.toFixed(1)} units`}
								</text>
							</>
						)}
					</svg>

					{}
					{(focalLengthInfo || selectedElement) && (
						<div className="absolute top-0 left-0 bg-white/90 backdrop-blur-lg rounded-xl border border-gray-200 shadow-xl p-2 md:p-4 max-w-[14rem] md:max-w-xs w-full md:w-72">
							<div className="border-b border-gray-100 pb-1 mb-1 md:pb-2 md:mb-2">
								<h3 className="text-xs md:text-sm font-semibold text-gray-800 flex items-center">
									{selectedElement?.type === "lens" ? (
										<>
											<span
												className={`w-2 h-2 rounded-full mr-2 ${
													selectedElement.lensType === "convex"
														? "bg-indigo-500"
														: "bg-pink-500"
												}`}
											></span>
											{selectedElement.lensType.charAt(0).toUpperCase() +
												selectedElement.lensType.slice(1)}{" "}
											Lens
										</>
									) : (
										<>
											<span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
											Light Source
										</>
									)}
								</h3>
							</div>

							{focalLengthInfo && (
								<div className="mb-2 md:mb-3 p-1 md:p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
									<div className="text-[8px] md:text-xs font-medium text-blue-700 uppercase tracking-wide mb-0.5 md:mb-1">
										Focal Length
									</div>
									<div className="text-xs nd:text-sm text-gray-700">
										{Math.abs(
											getCurrentFocalLength(selectedElement as Lens, wavelength)
										).toFixed(1)}{" "}
										units
										<span className="block text-[8px] md:text-xs text-gray-500 mt:0.5 md:mt-1">
											{getCurrentFocalLength(
												selectedElement as Lens,
												wavelength
											) > 0
												? "Converging"
												: "Diverging"}{" "}
											at {wavelength}nm
										</span>
									</div>
								</div>
							)}

							{selectedElement && (
								<div className="space-y-2 md:space-y-3">
									{selectedElement.type === "lens" && (
										<>
											<div>
												<div className="flex justify-between text-[10px] md:text-xs text-gray-500 mb-1">
													<span>Diameter</span>
													<span className="font-medium">
														{selectedElement.diameter.toFixed(0)}px
													</span>
												</div>
												<input
													type="range"
													min="40"
													max="200"
													value={selectedElement.diameter}
													onChange={(e) => {
														setElements(
															elements.map((el) =>
																el.id === selectedElementId
																	? { ...el, diameter: Number(e.target.value) }
																	: el
															)
														);
													}}
													className="w-full h-1 md:h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
												/>
											</div>

											<div>
												<div className="flex justify-between text-[10px] md:text-xs text-gray-500 mb-1">
													<span>Focal Length</span>
													<span className="font-medium">
														{selectedElement.referenceFocalLength.toFixed(0)}px
													</span>
												</div>
												<input
													type="range"
													min={
														selectedElement.lensType === "convex"
															? "50"
															: "-300"
													}
													max={
														selectedElement.lensType === "convex"
															? "300"
															: "-50"
													}
													value={selectedElement.referenceFocalLength}
													onChange={(e) => {
														setElements(
															elements.map((el) =>
																el.id === selectedElementId
																	? {
																			...el,
																			referenceFocalLength: Number(
																				e.target.value
																			),
																	  }
																	: el
															)
														);
													}}
													className="w-full h-1 md:h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
												/>
											</div>
										</>
									)}

									{selectedElement.type === "lightsource" && (
										<>
											<div>
												<div className="flex justify-between text-xs text-gray-500 mb-1">
													<span>Number of Rays</span>
													<span className="font-medium">
														{selectedElement.numRays}
													</span>
												</div>
												<input
													type="range"
													min="3"
													max="15"
													value={selectedElement.numRays}
													onChange={(e) => {
														setElements(
															elements.map((el) =>
																el.id === selectedElementId
																	? { ...el, numRays: Number(e.target.value) }
																	: el
															)
														);
													}}
													className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
												/>
											</div>

											<div>
												<div className="flex justify-between text-xs text-gray-500 mb-1">
													<span>Spread Angle</span>
													<span className="font-medium">
														{selectedElement.spreadAngle.toFixed(0)}°
													</span>
												</div>
												<input
													type="range"
													min="0"
													max="90"
													value={selectedElement.spreadAngle}
													onChange={(e) => {
														setElements(
															elements.map((el) =>
																el.id === selectedElementId
																	? {
																			...el,
																			spreadAngle: Number(e.target.value),
																	  }
																	: el
															)
														);
													}}
													className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer"
												/>
											</div>
										</>
									)}
								</div>
							)}
						</div>
					)}
					{}
					<div className="md:hidden fixed bottom-4 right-4 z-50">
						<div className="relative" ref={menuRef}>
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className={`w-12 h-12 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center text-xl leading-none transition-all duration-300 ${
									mobileMenuOpen ? "bg-blue-600 rotate-45" : "rotate-0"
								}`}
							>
								{mobileMenuOpen ? (
									<svg
										className="w-6 h-6 "
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								) : (
									<svg
										className="w-6 h-6 "
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>

							<div
								className={`absolute bottom-14 right-0 w-[80vw] max-w-[200px] bg-white rounded-xl shadow-xl p-3 border border-gray-200 space-y-3 text-xs
        transform origin-bottom-right transition-all duration-300 ease-out
        ${
					mobileMenuOpen
						? "scale-100 opacity-100 pointer-events-auto"
						: "scale-95 opacity-0 pointer-events-none"
				}`}
							>
								<div className="grid grid-cols-3 gap-2">
									<button
										onClick={() => {
											addElement("lens", "convex");
											setMobileMenuOpen(false);
										}}
										className="p-2 rounded-md bg-blue-100 text-blue-700 font-bold text-xl text-center shadow hover:bg-blue-200"
										title="Add Convex Lens"
									>
										+
									</button>

									<button
										onClick={() => {
											addElement("lens", "concave");
											setMobileMenuOpen(false);
										}}
										className="p-2 rounded-md bg-pink-100 text-pink-700 font-bold text-xl text-center shadow hover:bg-pink-200"
										title="Add Concave Lens"
									>
										–
									</button>

									<button
										onClick={() => {
											addElement("lightsource");
											setMobileMenuOpen(false);
										}}
										className="p-2 rounded-md bg-yellow-100 text-yellow-700 font-bold text-xl text-center shadow hover:bg-yellow-200"
										title="Add Light Source"
									>
										<svg
											className="w-5 h-5 mx-auto"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
											/>
										</svg>
									</button>

									<button
										onClick={() => {
											toggleMeasurementMode();
											setMobileMenuOpen(false);
										}}
										className={`p-2 rounded-md ${
											isMeasuring
												? "bg-blue-200 text-blue-800"
												: "bg-gray-100 text-gray-800"
										} shadow hover:bg-gray-200`}
										title="Toggle Measurement"
									>
										<svg
											className="w-5 h-5 mx-auto"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M4 16v4h4m-4 0l5-5m11 5v-4h-4m4 0l-5-5m0-5V4h-4m4 0l-5 5M4 8V4h4m-4 0l5 5"
											/>
										</svg>
									</button>

									<button
										onClick={() => {
											toggleFocalLengthMeasurement();
											setMobileMenuOpen(false);
										}}
										className={`p-2 rounded-md ${
											isMeasuringFocalLength
												? "bg-purple-200 text-purple-800"
												: "bg-gray-100 text-gray-800"
										} shadow hover:bg-gray-200`}
										title="Measure Focal Length"
									>
										<svg
											className="w-5 h-5 mx-auto"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6 18L18 6M6 6l12 12M12 2v20"
											/>
										</svg>
									</button>

									{selectedElementId && (
										<button
											onClick={() => {
												deleteSelectedElement();
												setMobileMenuOpen(false);
											}}
											className="p-2 rounded-md bg-red-100 text-red-700 font-bold text-center shadow hover:bg-red-200"
											title="Delete Selected"
										>
											<svg
												className="w-5 h-5 mx-auto"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									)}
								</div>

								{}
								<div className="pt-2 border-t">
									<div className="flex items-center justify-between mb-1">
										<div
											className="w-4 h-4 rounded-full shadow"
											style={{ backgroundColor: wavelengthToColor(wavelength) }}
										></div>
										<span className="text-xs text-gray-600">
											{wavelength} nm
										</span>
									</div>
									<input
										type="range"
										min={VISIBLE_SPECTRUM_MIN_NM}
										max={VISIBLE_SPECTRUM_MAX_NM}
										value={wavelength}
										onChange={(e) => setWavelength(Number(e.target.value))}
										className="w-full h-1.5 bg-gradient-to-r from-purple-500 via-green-500 to-red-500 rounded-full appearance-none cursor-pointer"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="hidden md:flex flex-row md:flex-col items-center justify-between md:justify-start p-3 bg-white/90 backdrop-blur-sm border-t md:border-r md:border-t-0 border-gray-200 md:w-16">
					<div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-4">
						<button
							className="cursor-pointer p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center space-y-1"
							onClick={() => addElement("lens", "convex")}
							title="Add Convex Lens"
						>
							<div className="w-6 h-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full border border-blue-200 flex items-center justify-center">
								<span className="text-blue-600 font-bold text-xs ">+</span>
							</div>
							<span className="text-xs text-gray-500 mt-1 hidden md:block">
								Convex
							</span>
						</button>

						<button
							className="cursor-pointer p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center space-y-1"
							onClick={() => addElement("lens", "concave")}
							title="Add Concave Lens"
						>
							<div className="w-6 h-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-full border border-pink-200 flex items-center justify-center">
								<span className="text-pink-600 font-bold text-xs">-</span>
							</div>
							<span className="text-xs text-gray-500 mt-1 hidden md:block">
								Concave
							</span>
						</button>

						<button
							className="cursor-pointer p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center space-y-1"
							onClick={() => addElement("lightsource")}
							title="Add Light Source"
						>
							<div className="w-6 h-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full border border-amber-200 flex items-center justify-center">
								<svg
									className="w-4 h-4 text-amber-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
							<span className="text-xs text-gray-500 mt-1 hidden md:block">
								Light
							</span>
						</button>

						<button
							className={`cursor-pointer p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center space-y-1 ${
								isMeasuring ? "bg-blue-100 border-blue-300" : "bg-white"
							}`}
							onClick={toggleMeasurementMode}
							title="Measure Distance"
						>
							<div className="w-6 h-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full border border-blue-200 flex items-center justify-center">
								<svg
									className="w-4 h-4 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
									/>
								</svg>
							</div>
							<span className="text-xs text-gray-500 mt-1 hidden md:block">
								Distance
							</span>
						</button>

						{}
						<button
							className={`cursor-pointer p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center space-y-1 ${
								isMeasuringFocalLength
									? "bg-purple-100 border-purple-300"
									: "bg-white"
							}`}
							onClick={toggleFocalLengthMeasurement}
							title="Measure Focal Length"
						>
							<div className="w-6 h-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full border border-purple-200 flex items-center justify-center">
								<svg
									className="w-4 h-4 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							</div>
							<span className="text-xs text-gray-500 mt-1 hidden md:block">
								Focal L.
							</span>
						</button>
					</div>
					<div className="hidden md:block flex-grow"></div>
					{selectedElementId && (
						<button
							className="cursor-pointer p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-center space-y-1"
							onClick={deleteSelectedElement}
							title="Delete Selected"
						>
							<div className="w-6 h-6 bg-gradient-to-br from-red-50 to-red-100 rounded-full border border-red-200 flex items-center justify-center">
								<svg
									className="w-4 h-4 text-red-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</div>
							<span className="text-xs text-gray-500 mt-1 hidden md:block">
								Delete
							</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default OpticsLab;
