"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export default function NumeroExport() {
	const [grid, setGrid] = useState<number[][]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [win, setWin] = useState(false);
	const [combinedTiles, setCombinedTiles] = useState<Set<string>>(new Set());
	const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
		null
	);
	const [showHowToPlay, setShowHowToPlay] = useState(false);
	const gridRef = useRef<HTMLDivElement>(null);

	const initializeGrid = useCallback(() => {
		const newGrid = Array(4)
			.fill(null)
			.map(() => Array(4).fill(0));
		addRandomTile(newGrid);
		addRandomTile(newGrid);
		setGrid(newGrid);
		setScore(0);
		setGameOver(false);
		setWin(false);
		setCombinedTiles(new Set());
	}, []);

	const addRandomTile = (grid: number[][]) => {
		const emptyCells: [number, number][] = [];
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				if (grid[row][col] === 0) {
					emptyCells.push([row, col]);
				}
			}
		}
		if (emptyCells.length > 0) {
			const [row, col] =
				emptyCells[Math.floor(Math.random() * emptyCells.length)];
			grid[row][col] = Math.random() < 0.9 ? 2 : 4;
		}
	};

	const checkGameOver = (grid: number[][]) => {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				if (grid[row][col] === 0) return false;
				if (row < 3 && grid[row][col] === grid[row + 1][col]) return false;
				if (col < 3 && grid[row][col] === grid[row][col + 1]) return false;
			}
		}
		return true;
	};

	const checkWin = (grid: number[][]) => {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				if (grid[row][col] === 2048) return true;
			}
		}
		return false;
	};

	const slideAndMerge = (tiles: number[], reverse: boolean) => {
		const nonZeroTiles = tiles.filter((tile) => tile !== 0);
		const mergedTiles: number[] = [];
		const newCombined = new Set<string>();

		for (let i = 0; i < nonZeroTiles.length; i++) {
			if (
				i < nonZeroTiles.length - 1 &&
				nonZeroTiles[i] === nonZeroTiles[i + 1]
			) {
				mergedTiles.push(nonZeroTiles[i] * 2);
				newCombined.add(
					`${nonZeroTiles[i] * 2}-${
						reverse
							? nonZeroTiles.length - 1 - mergedTiles.length
							: mergedTiles.length - 1
					}`
				);
				i++;
			} else {
				mergedTiles.push(nonZeroTiles[i]);
			}
		}

		const zeros = Array(4 - mergedTiles.length).fill(0);
		const result = reverse
			? [...zeros, ...mergedTiles]
			: [...mergedTiles, ...zeros];
		return { result, newCombined };
	};

	const moveTiles = (direction: "up" | "down" | "left" | "right") => {
		if (gameOver) return;

		const newGrid = grid.map((row) => [...row]);
		let moved = false;
		let scoreIncrease = 0;
		const newCombinedTiles = new Set<string>();

		if (direction === "left" || direction === "right") {
			for (let row = 0; row < 4; row++) {
				const { result, newCombined } = slideAndMerge(
					newGrid[row],
					direction === "right"
				);
				if (newGrid[row].join() !== result.join()) moved = true;
				newGrid[row] = result;
				newCombined.forEach((pos) => newCombinedTiles.add(`${row}-${pos}`));
				newGrid[row].forEach((val) => {
					if (val !== 0 && newCombined.has(`${val}-${result.indexOf(val)}`)) {
						scoreIncrease += val;
					}
				});
			}
		} else if (direction === "up" || direction === "down") {
			for (let col = 0; col < 4; col++) {
				const column = [];
				for (let row = 0; row < 4; row++) {
					column.push(newGrid[row][col]);
				}
				const { result, newCombined } = slideAndMerge(
					column,
					direction === "down"
				);
				if (column.join() !== result.join()) moved = true;
				newGrid.forEach((_, row) => {
					newGrid[row][col] = result[row];
				});
				newCombined.forEach((pos) => newCombinedTiles.add(`${pos}-${col}`));
				result.forEach((val, idx) => {
					if (val !== 0 && newCombined.has(`${val}-${idx}`)) {
						scoreIncrease += val;
					}
				});
			}
		}

		if (moved) {
			addRandomTile(newGrid);
			setScore((prev) => prev + scoreIncrease);
			setGrid(newGrid);
			setCombinedTiles(newCombinedTiles);
			if (checkWin(newGrid)) {
				setWin(true);
			} else if (checkGameOver(newGrid)) {
				setGameOver(true);
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		e.preventDefault();
		switch (e.key) {
			case "ArrowUp":
				moveTiles("up");
				break;
			case "ArrowDown":
				moveTiles("down");
				break;
			case "ArrowLeft":
				moveTiles("left");
				break;
			case "ArrowRight":
				moveTiles("right");
				break;
			default:
				return;
		}
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		setTouchStart({ x: touch.clientX, y: touch.clientY });
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (!touchStart) return;

		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - touchStart.x;
		const deltaY = touch.clientY - touchStart.y;
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);

		if (Math.max(absDeltaX, absDeltaY) > 30) {
			if (absDeltaX > absDeltaY) {
				if (deltaX > 0) moveTiles("right");
				else moveTiles("left");
			} else {
				if (deltaY > 0) moveTiles("down");
				else moveTiles("up");
			}
		}

		setTouchStart(null);
	};

	useEffect(() => {
		initializeGrid();
	}, [initializeGrid]);

	useEffect(() => {
		if (gridRef.current) {
			gridRef.current.focus();
		}
	}, []);

	const getTileColor = (value: number) => {
		const colors: Record<number, string> = {
			0: "#1e1e2e",
			2: "#6366f1",
			4: "#8b5cf6",
			8: "#a855f7",
			16: "#d946ef",
			32: "#ec4899",
			64: "#f43f5e",
			128: "#fb7185",
			256: "#f59e0b",
			512: "#f97316",
			1024: "#10b981",
			2048: "#06b6d4",
			4096: "#3b82f6",
			8192: "#2563eb",
		};
		return colors[value] || "#1e1e2e";
	};

	const getTileTextColor = (value: number) => {
		return value <= 4 ? "#ffffff" : "#ffffff";
	};

	const getTileFontSize = (value: number) => {
		if (value === 0) return "24px";
		const digits = value.toString().length;
		if (digits <= 1) return "28px";
		if (digits === 2) return "26px";
		if (digits === 3) return "22px";
		return "18px";
	};

	const HowToPlayModal = () => {
		if (!showHowToPlay) return null;

		return (
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0,0,0,0.75)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backdropFilter: "blur(8px)",
					zIndex: 1000,
					padding: "20px",
					animation: "fadeIn 0.3s ease",
				}}
				onClick={() => setShowHowToPlay(false)}
			>
				<div
					style={{
						backgroundColor: "#1e1e2e",
						padding: "35px",
						borderRadius: "24px",
						maxWidth: "450px",
						width: "100%",
						boxShadow:
							"0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
						animation: "scaleIn 0.3s ease",
						border: "1px solid rgba(168, 85, 247, 0.2)",
						position: "relative",
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<button
						style={{
							position: "absolute",
							top: "15px",
							right: "15px",
							background: "none",
							border: "none",
							fontSize: "24px",
							color: "#94a3b8",
							cursor: "pointer",
							padding: "5px",
							transition: "all 0.2s ease",
							borderRadius: "50%",
							width: "36px",
							height: "36px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						onClick={() => setShowHowToPlay(false)}
						onMouseOver={(e) => {
							e.currentTarget.style.color = "#f8fafc";
							e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.color = "#94a3b8";
							e.currentTarget.style.backgroundColor = "transparent";
						}}
					>
						✕
					</button>

					<h2
						style={{
							fontSize: "28px",
							fontWeight: "bold",
							marginBottom: "25px",
							background: "linear-gradient(to right, #a855f7, #d946ef)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							display: "inline-block",
						}}
					>
						How to Play Numero
					</h2>

					<div style={{ marginBottom: "35px" }}>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "bold",
								marginBottom: "12px",
								color: "#f8fafc",
							}}
						>
							Game Rules:
						</h3>
						<ul
							style={{
								paddingLeft: "10px",
								color: "#cbd5e1",
								fontSize: "16px",
								lineHeight: "1.8",
								listStyleType: "none",
							}}
						>
							<li
								style={{
									margin: "12px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span
									style={{
										width: "24px",
										height: "24px",
										borderRadius: "50%",
										backgroundColor: "rgba(168, 85, 247, 0.2)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#a855f7",
									}}
								>
									1
								</span>
								<span>
									Use arrow keys (←↑→↓) to move all tiles in that direction
								</span>
							</li>
							<li
								style={{
									margin: "12px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span
									style={{
										width: "24px",
										height: "24px",
										borderRadius: "50%",
										backgroundColor: "rgba(168, 85, 247, 0.2)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#a855f7",
									}}
								>
									2
								</span>
								<span>On mobile, swipe in any direction to move tiles</span>
							</li>
							<li
								style={{
									margin: "12px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span
									style={{
										width: "24px",
										height: "24px",
										borderRadius: "50%",
										backgroundColor: "rgba(168, 85, 247, 0.2)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#a855f7",
									}}
								>
									3
								</span>
								<span>
									When two tiles with the same number touch, they merge into
									one!
								</span>
							</li>
							<li
								style={{
									margin: "12px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span
									style={{
										width: "24px",
										height: "24px",
										borderRadius: "50%",
										backgroundColor: "rgba(168, 85, 247, 0.2)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#a855f7",
									}}
								>
									4
								</span>
								<span>Create a tile with the number 2048 to win the game!</span>
							</li>
						</ul>
					</div>

					<div style={{ marginBottom: "25px" }}>
						<h3
							style={{
								fontSize: "18px",
								fontWeight: "bold",
								marginBottom: "12px",
								color: "#f8fafc",
							}}
						>
							Tips & Tricks:
						</h3>
						<ul
							style={{
								paddingLeft: "10px",
								color: "#cbd5e1",
								fontSize: "16px",
								lineHeight: "1.7",
								listStyleType: "none",
							}}
						>
							<li
								style={{
									margin: "8px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span style={{ color: "#a855f7" }}>•</span>
								<span>Try to keep your highest value tile in a corner</span>
							</li>
							<li
								style={{
									margin: "8px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span style={{ color: "#a855f7" }}>•</span>
								<span>Work to build a "chain" of decreasing values</span>
							</li>
							<li
								style={{
									margin: "8px 0",
									display: "flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<span style={{ color: "#a855f7" }}>•</span>
								<span>Plan a few moves ahead whenever possible</span>
							</li>
						</ul>
					</div>

					<button
						onClick={() => setShowHowToPlay(false)}
						style={{
							backgroundColor: "#a855f7",
							color: "#ffffff",
							padding: "14px 25px",
							borderRadius: "12px",
							border: "none",
							cursor: "pointer",
							fontSize: "16px",
							fontWeight: "bold",
							width: "100%",
							boxShadow: "0 4px 15px rgba(168, 85, 247, 0.3)",
							transition: "all 0.2s ease",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = "#9333ea";
							e.currentTarget.style.transform = "translateY(-2px)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = "#a855f7";
							e.currentTarget.style.transform = "translateY(0)";
						}}
					>
						Got it!
					</button>
				</div>
			</div>
		);
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
				fontFamily: "'Poppins', system-ui, sans-serif",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "20px",
				color: "#f8fafc",
			}}
		>
			<style>
				{`
					@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
					
					@keyframes fadeIn {
						from { opacity: 0; }
						to { opacity: 1; }
					}
					@keyframes scaleIn {
						from { transform: scale(0.9); opacity: 0; }
						to { transform: scale(1); opacity: 1; }
					}
					@keyframes pulse {
						0% { transform: scale(1); }
						50% { transform: scale(1.05); }
						100% { transform: scale(1); }
					}
					@keyframes slideIn {
						from { transform: translateY(20px); opacity: 0; }
						to { transform: translateY(0); opacity: 1; }
					}
					@keyframes glow {
						0% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
						50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.8); }
						100% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
					}
					
					* {
						font-family: 'Poppins', system-ui, sans-serif;
					}
				`}
			</style>

			<div
				style={{
					maxWidth: "500px",
					width: "100%",
					margin: "0 auto",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					animation: "slideIn 0.5s ease",
				}}
			>
				<h1
					style={{
						fontSize: "48px",
						fontWeight: "bold",
						background: "linear-gradient(to right, #a855f7, #d946ef)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						marginBottom: "5px",
						textAlign: "center",
						letterSpacing: "-1px",
						textShadow: "0 4px 20px rgba(168, 85, 247, 0.4)",
					}}
				>
					Numero
				</h1>

				<p
					style={{
						fontSize: "16px",
						color: "#a1a1aa",
						marginBottom: "25px",
						textAlign: "center",
						maxWidth: "400px",
					}}
				>
					Merge tiles, reach 2048!
				</p>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
						maxWidth: "400px",
						marginBottom: "20px",
					}}
				>
					<div
						style={{
							backgroundColor: "#1e1e2e",
							borderRadius: "16px",
							padding: "12px 20px",
							boxShadow:
								"0 8px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
							flex: "1",
							marginRight: "15px",
							textAlign: "center",
							border: "1px solid rgba(255,255,255,0.05)",
						}}
					>
						<span
							style={{
								fontSize: "14px",
								color: "#94a3b8",
								display: "block",
								marginBottom: "5px",
								letterSpacing: "1px",
							}}
						>
							SCORE
						</span>
						<span
							style={{
								fontSize: "28px",
								background: "linear-gradient(to right, #f8fafc, #cbd5e1)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								fontWeight: "bold",
							}}
						>
							{score}
						</span>
					</div>

					<button
						onClick={() => setShowHowToPlay(true)}
						style={{
							backgroundColor: "#1e1e2e",
							color: "#a1a1aa",
							padding: "12px 0",
							borderRadius: "16px",
							border: "1px solid rgba(255,255,255,0.05)",
							cursor: "pointer",
							fontSize: "14px",
							flex: "1",
							boxShadow:
								"0 8px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.2s ease",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = "#2a2d3e";
							e.currentTarget.style.color = "#f8fafc";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = "#1e1e2e";
							e.currentTarget.style.color = "#a1a1aa";
						}}
					>
						<span
							style={{
								fontSize: "18px",
								marginBottom: "2px",
							}}
						>
							?
						</span>
						<span>How to Play</span>
					</button>
				</div>

				<div
					ref={gridRef}
					tabIndex={0}
					onKeyDown={handleKeyDown}
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					style={{
						width: "100%",
						maxWidth: "400px",
						backgroundColor: "#1e1e2e",
						padding: "15px",
						borderRadius: "16px",
						display: "grid",
						gridTemplateColumns: "repeat(4, 1fr)",
						gap: "10px",
						outline: "none",
						boxShadow:
							"0 15px 50px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.05)",
						border: "1px solid rgba(255,255,255,0.05)",
						touchAction: "none",
						marginBottom: "20px",
						animation: grid.flat().some((val) => val > 0)
							? "none"
							: "glow 2s infinite",
					}}
					onFocus={(e) => {
						e.currentTarget.style.border = "1px solid rgba(168, 85, 247, 0.5)";
						e.currentTarget.style.boxShadow =
							"0 15px 50px rgba(0, 0, 0, 0.3), 0 0 15px rgba(168, 85, 247, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.05)";
					}}
					onBlur={(e) => {
						e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)";
						e.currentTarget.style.boxShadow =
							"0 15px 50px rgba(0, 0, 0, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.05)";
					}}
				>
					{grid.map((row, rowIndex) =>
						row.map((value, colIndex) => (
							<div
								key={`${rowIndex}-${colIndex}`}
								style={{
									backgroundColor: getTileColor(value),
									height: "78px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: "12px",
									fontSize: getTileFontSize(value),
									fontWeight: "bold",
									color: getTileTextColor(value),
									boxShadow:
										value > 0
											? "0 4px 15px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
											: "inset 0 2px 3px rgba(0, 0, 0, 0.2)",
									transition: "all 0.2s ease-in-out",
									transform: combinedTiles.has(`${rowIndex}-${colIndex}`)
										? "scale(1.1)"
										: "scale(1)",
									border:
										value > 0 ? "none" : "1px solid rgba(255,255,255,0.03)",
									animation:
										value > 0 && combinedTiles.has(`${rowIndex}-${colIndex}`)
											? "pulse 0.3s ease"
											: "none",
									textShadow:
										value >= 128 ? "0 2px 2px rgba(0,0,0,0.3)" : "none",
								}}
							>
								{value !== 0 ? value : ""}
							</div>
						))
					)}
				</div>

				<button
					onClick={initializeGrid}
					style={{
						background: "linear-gradient(to right, #a855f7, #d946ef)",
						color: "#ffffff",
						padding: "15px 0",
						borderRadius: "16px",
						border: "none",
						cursor: "pointer",
						fontSize: "16px",
						fontWeight: "bold",
						width: "100%",
						maxWidth: "400px",
						boxShadow: "0 8px 25px rgba(168, 85, 247, 0.3)",
						transition: "all 0.2s ease",
						marginBottom: "20px",
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)";
						e.currentTarget.style.boxShadow =
							"0 10px 30px rgba(168, 85, 247, 0.4)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow =
							"0 8px 25px rgba(168, 85, 247, 0.3)";
					}}
					onMouseDown={(e) => {
						e.currentTarget.style.transform = "scale(0.98)";
					}}
					onMouseUp={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)";
					}}
				>
					New Game
				</button>

				<div
					style={{
						fontSize: "14px",
						color: "#a1a1aa",
						textAlign: "center",
						maxWidth: "400px",
						width: "100%",
						padding: "0 10px",
					}}
				>
					Use <span style={{ color: "#cbd5e1" }}>arrow keys</span> or{" "}
					<span style={{ color: "#cbd5e1" }}>swipe</span> to play. Combine
					matching tiles to reach{" "}
					<span style={{ color: "#a855f7", fontWeight: "bold" }}>2048</span>!
				</div>
			</div>

			{(gameOver || win) && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.75)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backdropFilter: "blur(8px)",
						zIndex: 1000,
						animation: "fadeIn 0.3s ease",
					}}
				>
					<div
						style={{
							backgroundColor: "#1e1e2e",
							padding: "40px",
							borderRadius: "24px",
							textAlign: "center",
							boxShadow:
								"0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
							maxWidth: "90%",
							width: "350px",
							animation: "scaleIn 0.3s ease",
							border: "1px solid rgba(168, 85, 247, 0.2)",
						}}
					>
						<div
							style={{
								width: "80px",
								height: "80px",
								borderRadius: "50%",
								margin: "0 auto 25px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "40px",
								background: win
									? "linear-gradient(135deg, #a855f7, #d946ef)"
									: "linear-gradient(135deg, #f43f5e, #fb7185)",
								boxShadow: win
									? "0 10px 30px rgba(168, 85, 247, 0.3)"
									: "0 10px 30px rgba(244, 63, 94, 0.3)",
							}}
						>
							{win ? "🎉" : "🔚"}
						</div>

						<h2
							style={{
								fontSize: "32px",
								fontWeight: "bold",
								color: win ? "#a855f7" : "#f43f5e",
								marginBottom: "15px",
							}}
						>
							{win ? "You Won!" : "Game Over"}
						</h2>
						<p
							style={{
								fontSize: "16px",
								color: "#a1a1aa",
								marginBottom: "25px",
								lineHeight: "1.6",
							}}
						>
							{win
								? "Congratulations! You reached 2048!"
								: "No more moves available."}
							<br />
							<span
								style={{
									display: "block",
									marginTop: "15px",
									fontSize: "24px",
									background: "linear-gradient(to right, #f8fafc, #cbd5e1)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									fontWeight: "bold",
								}}
							>
								Final Score: {score}
							</span>
						</p>
						<button
							onClick={initializeGrid}
							style={{
								background: win
									? "linear-gradient(to right, #a855f7, #d946ef)"
									: "linear-gradient(to right, #f43f5e, #fb7185)",
								color: "#ffffff",
								padding: "16px 30px",
								borderRadius: "16px",
								border: "none",
								cursor: "pointer",
								fontSize: "18px",
								fontWeight: "bold",
								boxShadow: win
									? "0 8px 25px rgba(168, 85, 247, 0.3)"
									: "0 8px 25px rgba(244, 63, 94, 0.3)",
								transition: "all 0.2s ease",
								width: "100%",
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = "translateY(-2px)";
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = "translateY(0)";
							}}
							onMouseDown={(e) => {
								e.currentTarget.style.transform = "scale(0.98)";
							}}
							onMouseUp={(e) => {
								e.currentTarget.style.transform = "scale(1)";
							}}
						>
							Play Again
						</button>
					</div>
				</div>
			)}

			<HowToPlayModal />
		</div>
	);
}
