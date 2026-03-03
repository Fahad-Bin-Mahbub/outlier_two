"use client";
import React, { useState, useEffect, useRef } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts";

type ControllerType = "P" | "PI" | "PID";

interface MotorData {
	time: number;
	rpm: number;
	setpoint: number;
	controlSignal?: number;
}

interface Gain {
	proportional: number;
	integral: number;
	derivative: number;
}

interface PerformanceMetrics {
	riseTime: number | null;
	settlingTime: number | null;
	overshoot: number | null;
	steadyStateError: number | null;
}

const MotorControlInterface: React.FC = () => {
	const [targetRPM, setTargetRPM] = useState<number>(500);
	const [currentRPM, setCurrentRPM] = useState<number>(0);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [controllerType, setControllerType] = useState<ControllerType>("P");
	const [responseData, setResponseData] = useState<MotorData[]>([]);
	const [gain, setGain] = useState<Gain>({
		proportional: 1.0,
		integral: 0.5,
		derivative: 0.2,
	});
	const [timeWindow, setTimeWindow] = useState<number>(10); 
	const [metrics, setMetrics] = useState<PerformanceMetrics>({
		riseTime: null,
		settlingTime: null,
		overshoot: null,
		steadyStateError: null,
	});
	const [motorHealth, setMotorHealth] = useState<number>(100);
	const [showControlSignal, setShowControlSignal] = useState<boolean>(false);
    const [maxControlSignal, setMaxControlSignal] = useState<number>(800); 

	
	const motorSpeedRef = useRef<HTMLDivElement>(null);
	const motorAnimationRef = useRef<HTMLDivElement>(null);

	
	const simulationRef = useRef({
		time: 0,
		lastRPM: 0,
		integralSum: 0,
		lastError: 0,
		hasReached90Percent: false,
		peakValue: 0,
		settledTime: null,
        lastControlSignal: 0, 
	});

    
    const MAX_RPM_CHANGE_PER_STEP = 50;

	
	const calculateMetrics = (data: MotorData[]): PerformanceMetrics => {
		if (data.length < 5)
			return {
				riseTime: null,
				settlingTime: null,
				overshoot: null,
				steadyStateError: null,
			};

		const setpoint = targetRPM;
		const threshold90 = setpoint * 0.9;
		const steadyStateThreshold = setpoint * 0.05; 

		let riseTime = null;
		let settlingTime = null;
		let maxValue = 0;
		let lastFewValues = data.slice(-5).map((d) => d.rpm);
		let steadyStateError = null;

		
		for (let i = 0; i < data.length; i++) {
			if (data[i].rpm >= threshold90 && data[i - 1]?.rpm < threshold90) {
				riseTime = data[i].time;
				break;
			}
		}

		
		maxValue = Math.max(...data.map((d) => d.rpm));

		
		if (
			lastFewValues.every(
				(v) => Math.abs(v - lastFewValues[0]) < steadyStateThreshold
			)
		) {
			steadyStateError = setpoint - lastFewValues[0];
		}

		
		const settlingThreshold = setpoint * 0.05;
		for (let i = 0; i < data.length - 10; i++) {
			const rangeValues = data.slice(i, i + 10).map((d) => d.rpm);
			const max = Math.max(...rangeValues);
			const min = Math.min(...rangeValues);
			if (
				Math.abs(max - min) < settlingThreshold &&
				Math.abs(max - setpoint) < settlingThreshold
			) {
				settlingTime = data[i].time;
				break;
			}
		}

		
		const overshoot =
			maxValue > setpoint ? ((maxValue - setpoint) / setpoint) * 100 : 0;

		return {
			riseTime,
			settlingTime,
			overshoot,
			steadyStateError,
		};
	};

	
	useEffect(() => {
		if (motorAnimationRef.current && motorSpeedRef.current) {
			const normalizedSpeed = Math.min(Math.max(currentRPM / 1000, 0), 1);
			const rotationSpeed = normalizedSpeed * 2 + 0.1; 

			motorAnimationRef.current.style.animation = isRunning
				? `spin ${1 / rotationSpeed}s linear infinite`
				: "none";

			motorSpeedRef.current.style.height = `${normalizedSpeed * 100}%`;
		}
	}, [currentRPM, isRunning]);

	useEffect(() => {
		if (!isRunning) {
			
			simulationRef.current = {
				...simulationRef.current,
				lastRPM: currentRPM,
				integralSum: 0,
				lastError: 0,
				hasReached90Percent: false,
				peakValue: 0,
				settledTime: null,
                lastControlSignal: 0,
			};
			return;
		}

		let timer: NodeJS.Timeout;

		const updateMotor = () => {
			const sim = simulationRef.current;
			sim.time += 0.1;
			const error = targetRPM - sim.lastRPM;

			
			let controlSignal = gain.proportional * error;

			if (controllerType !== "P") {
				sim.integralSum += error * 0.1;
				
				sim.integralSum = Math.max(-500, Math.min(500, sim.integralSum));
				controlSignal += gain.integral * sim.integralSum;
			}

			if (controllerType === "PID") {
				const derivative = (error - sim.lastError) / 0.1;
                
                const filteredDerivative = derivative * 0.7 + (error - sim.lastError) * 0.3 / 0.1;
				controlSignal += gain.derivative * filteredDerivative;
				sim.lastError = error;
			}

            
            const controlSignalChange = controlSignal - sim.lastControlSignal;
            const maxChange = 200; 
            const limitedChange = Math.max(-maxChange, Math.min(maxChange, controlSignalChange));
            controlSignal = sim.lastControlSignal + limitedChange;
            
            
            controlSignal = Math.max(-maxControlSignal, Math.min(maxControlSignal, controlSignal));
            sim.lastControlSignal = controlSignal;

			
			const motorInertia = 0.1; 
			const frictionCoefficient = 0.05; 
			const motorTorque = controlSignal;
			const friction = frictionCoefficient * sim.lastRPM;

			
			const rpmChange = (motorTorque - friction) / motorInertia;
            
            
            const limitedRpmChange = Math.max(-MAX_RPM_CHANGE_PER_STEP, Math.min(MAX_RPM_CHANGE_PER_STEP, rpmChange * 0.1));
			const rpm = sim.lastRPM + limitedRpmChange;

			
			const noise = Math.random() * 3 - 1.5; 
			const finalRPM = Math.max(0, Math.min(1200, rpm + noise)); 

			sim.lastRPM = finalRPM;

			
			if (finalRPM > sim.peakValue) {
				sim.peakValue = finalRPM;
			}

			
			if (!sim.hasReached90Percent && finalRPM >= targetRPM * 0.9) {
				sim.hasReached90Percent = true;
			}

			
			const newDataPoint = {
				time: parseFloat(sim.time.toFixed(1)),
				rpm: parseFloat(finalRPM.toFixed(2)),
				setpoint: targetRPM,
				controlSignal: parseFloat(controlSignal.toFixed(2)),
			};

			
			setResponseData((prevData) => {
				const newData = [...prevData, newDataPoint];
				
				return newData.filter((point) => point.time > sim.time - timeWindow);
			});

			setCurrentRPM(Math.round(finalRPM));

			
			if (Math.round(sim.time * 10) % 10 === 0) {
				setResponseData((prevData) => {
					setMetrics(calculateMetrics(prevData));
					return prevData;
				});

				
				if (Math.abs(controlSignal) > maxControlSignal * 0.9) {
					setMotorHealth((prev) => Math.max(0, prev - 0.1));
				}
			}

			
			timer = setTimeout(updateMotor, 100);
		};

		updateMotor();

		return () => clearTimeout(timer);
	}, [isRunning, targetRPM, controllerType, gain, timeWindow, maxControlSignal]);

	const handleStartStop = () => {
		setIsRunning((prev) => !prev);
	};

	const handleReset = () => {
		setIsRunning(false);
		setResponseData([]);
		setCurrentRPM(0);
		simulationRef.current.time = 0;
		simulationRef.current.lastRPM = 0;
		simulationRef.current.integralSum = 0;
		simulationRef.current.lastError = 0;
        simulationRef.current.lastControlSignal = 0;
		setMetrics({
			riseTime: null,
			settlingTime: null,
			overshoot: null,
			steadyStateError: null,
		});
		setMotorHealth(100);
	};

	const handleGainChange = (type: keyof Gain, value: number) => {
		setGain((prev) => ({
			...prev,
			[type]: Math.max(0, value),
		}));
	};

	const handleTimeWindowChange = (value: number) => {
		setTimeWindow(value);
	};
    
    
    const getRecommendedMaxKp = () => {
        
        return Math.max(0.5, 10 - (targetRPM / 1000) * 8);
    };
    
    
    const isKpTooHigh = () => {
        return gain.proportional > getRecommendedMaxKp() && targetRPM > 500;
    };

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 p-5 bg-white rounded-md shadow">
						DC Motor Control Interface
					</h1>
					<div className="bg-white p-4 rounded-md shadow flex items-center space-x-3">
						<div className="text-sm font-medium text-gray-600">
							Motor Health
						</div>
						<div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
							<div
								className={`h-full ${
									motorHealth > 70
										? "bg-green-500"
										: motorHealth > 30
										? "bg-yellow-500"
										: "bg-red-500"
								}`}
								style={{ width: `${motorHealth}%` }}
							></div>
						</div>
						<div className="text-sm font-medium">{motorHealth.toFixed(0)}%</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-xl text-gray-800 font-semibold text-center bg-gray-50 p-3 rounded-md mb-4">
							Motor Controls
						</h2>

						
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Target Speed: {targetRPM} RPM
							</label>
							<input
								type="range"
								min="0"
								max="1000"
								step="50"
								value={targetRPM}
								onChange={(e) => setTargetRPM(Number(e.target.value))}
								disabled={isRunning}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
							<div className="flex justify-between text-xs text-gray-500 mt-1">
								<span>0</span>
								<span>500</span>
								<span>1000</span>
							</div>
						</div>

						
						<div className="bg-blue-50 p-4 rounded-lg mb-6">
							<div className="text-sm font-medium text-gray-500 mb-1">
								Current Speed
							</div>
							<div className="flex items-center">
								<div className="text-3xl font-bold text-blue-600 mr-4">
									{currentRPM} <span className="text-sm ml-1">RPM</span>
								</div>
								<div className="relative h-12 w-4 bg-gray-200 rounded overflow-hidden">
									<div
										ref={motorSpeedRef}
										className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
										style={{ height: `${(currentRPM / 1000) * 100}%` }}
									></div>
								</div>
							</div>
						</div>

						
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Controller Type
							</label>
							<div className="flex space-x-4">
								{(["P", "PI", "PID"] as ControllerType[]).map((type) => (
									<button
										key={type}
										onClick={() => setControllerType(type)}
										disabled={isRunning}
										className={`px-4 py-2 rounded-lg flex-1 text-sm font-medium transition-colors cursor-pointer ${
											controllerType === type
												? "bg-sky-600 text-white"
												: "bg-gray-200 hover:bg-gray-300 text-gray-700"
										}`}
									>
										{type}
									</button>
								))}
							</div>
						</div>

						
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Controller Gains
							</label>
							<div className="space-y-3">
								<div>
									<div className="flex justify-between">
										<label className="block text-xs text-gray-500 mb-1">
											Proportional (Kp)
										</label>
										<span className={`text-xs ${isKpTooHigh() ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
											{gain.proportional.toFixed(2)}
                                            {isKpTooHigh() && " (Too high!)"}
										</span>
									</div>
									<input
										type="range"
										min="0"
										max="10"
										step="0.1"
										value={gain.proportional}
										onChange={(e) =>
											handleGainChange(
												"proportional",
												parseFloat(e.target.value)
											)
										}
										disabled={isRunning}
										className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
									/>
                                    {isKpTooHigh() && (
                                        <div className="text-xs text-red-500 mt-1">
                                            Recommended max Kp for this RPM: {getRecommendedMaxKp().toFixed(1)}
                                        </div>
                                    )}
								</div>
								{controllerType !== "P" && (
									<div>
										<div className="flex justify-between">
											<label className="block text-xs text-gray-500 mb-1">
												Integral (Ki)
											</label>
											<span className="text-xs text-gray-500">
												{gain.integral.toFixed(2)}
											</span>
										</div>
										<input
											type="range"
											min="0"
											max="5"
											step="0.05"
											value={gain.integral}
											onChange={(e) =>
												handleGainChange("integral", parseFloat(e.target.value))
											}
											disabled={isRunning}
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
										/>
									</div>
								)}
								{controllerType === "PID" && (
									<div>
										<div className="flex justify-between">
											<label className="block text-xs text-gray-500 mb-1">
												Derivative (Kd)
											</label>
											<span className="text-xs text-gray-500">
												{gain.derivative.toFixed(2)}
											</span>
										</div>
										<input
											type="range"
											min="0"
											max="2"
											step="0.05"
											value={gain.derivative}
											onChange={(e) =>
												handleGainChange(
													"derivative",
													parseFloat(e.target.value)
												)
											}
											disabled={isRunning}
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
										/>
									</div>
								)}
							</div>
						</div>

                        
                        <div className="mb-6">
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Maximum Control Signal
                                </label>
                                <span className="text-sm text-gray-500">{maxControlSignal}</span>
                            </div>
                            <input
                                type="range"
                                min="200"
                                max="1000"
                                step="50"
                                value={maxControlSignal}
                                onChange={(e) => setMaxControlSignal(Number(e.target.value))}
                                disabled={isRunning}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Higher values allow faster response but may damage the motor
                            </div>
                        </div>

						
						<div className="mb-6">
							<div className="flex justify-between">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Time Window
								</label>
								<span className="text-sm text-gray-500">{timeWindow}s</span>
							</div>
							<input
								type="range"
								min="5"
								max="30"
								step="5"
								value={timeWindow}
								onChange={(e) => handleTimeWindowChange(Number(e.target.value))}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
						</div>

						
						<div className="flex space-x-3">
							<button
								onClick={handleStartStop}
								className={`px-4 py-2 rounded-lg flex-1 font-medium transition-colors cursor-pointer ${
									isRunning
										? "bg-red-600 hover:bg-red-700"
										: "bg-green-600 hover:bg-green-700"
								} text-white`}
							>
								{isRunning ? "Stop Motor" : "Start Motor"}
							</button>
							<button
								onClick={handleReset}
								className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium cursor-pointer"
							>
								Reset
							</button>
						</div>
					</div>

					
					<div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
						<div className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-4">
							<h2 className="text-xl text-gray-800 font-semibold">
								Motor Response ({controllerType} Controller)
							</h2>
							<div className="flex items-center space-x-2">
								<label className="text-sm text-gray-600">
									Show Control Signal
								</label>
								<input
									type="checkbox"
									checked={showControlSignal}
									onChange={() => setShowControlSignal(!showControlSignal)}
									className="rounded text-blue-500"
								/>
							</div>
						</div>

						<div className="h-96">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart
									data={responseData}
									margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="time"
										type="number"
										domain={["dataMin", "dataMax"]}
										allowDataOverflow={true}
										label={{
											value: "Time (s)",
											position: "insideBottomRight",
											offset: -5,
										}}
									/>
									<YAxis
										yAxisId="left"
										label={{
											value: "Speed (RPM)",
											angle: -90,
											position: "insideLeft",
										}}
										domain={[0, 1200]} 
									/>
									{showControlSignal && (
										<YAxis
											yAxisId="right"
											orientation="right"
											label={{
												value: "Control Signal",
												angle: 90,
												position: "insideRight",
											}}
											domain={[-maxControlSignal * 1.1, maxControlSignal * 1.1]} 
										/>
									)}
									<Tooltip
										formatter={(value, name) => {
											if (name === "Motor Speed" || name === "Setpoint") {
												return [`${value} RPM`, name];
											}
											return [value, name];
										}}
									/>
									<Legend />
									<ReferenceLine
										y={targetRPM * 0.9}
										stroke="#FF9800"
										strokeDasharray="3 3"
										label="90%"
										yAxisId="left"
									/>
									<Line
										type="monotone"
										dataKey="rpm"
										stroke="#8884d8"
										strokeWidth={2}
										dot={false}
										name="Motor Speed"
										yAxisId="left"
										animationDuration={300}
									/>
									<Line
										type="monotone"
										dataKey="setpoint"
										stroke="#82ca9d"
										strokeWidth={2}
										strokeDasharray="5 5"
										dot={false}
										name="Setpoint"
										yAxisId="left"
										animationDuration={300}
									/>
									{showControlSignal && (
										<Line
											type="monotone"
											dataKey="controlSignal"
											stroke="#ff7300"
											strokeWidth={1.5}
											dot={false}
											name="Control Signal"
											yAxisId="right"
											animationDuration={300}
										/>
									)}
								</LineChart>
							</ResponsiveContainer>
						</div>

						
						<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-blue-50 p-3 rounded-lg">
								<div className="text-xs font-medium text-gray-500 mb-1">
									Rise Time
								</div>
								<div className="text-lg font-bold text-blue-600">
									{metrics.riseTime !== null
										? `${metrics.riseTime.toFixed(2)}s`
										: "N/A"}
								</div>
							</div>
							<div className="bg-green-50 p-3 rounded-lg">
								<div className="text-xs font-medium text-gray-500 mb-1">
									Settling Time
								</div>
								<div className="text-lg font-bold text-green-600">
									{metrics.settlingTime !== null
										? `${metrics.settlingTime.toFixed(2)}s`
										: "N/A"}
								</div>
							</div>
							<div className="bg-amber-50 p-3 rounded-lg">
								<div className="text-xs font-medium text-gray-500 mb-1">
									Overshoot
								</div>
								<div className="text-lg font-bold text-amber-600">
									{metrics.overshoot !== null
										? `${metrics.overshoot.toFixed(2)}%`
										: "N/A"}
								</div>
							</div>
							<div className="bg-purple-50 p-3 rounded-lg">
								<div className="text-xs font-medium text-gray-500 mb-1">
									Steady State Error
								</div>
								<div className="text-lg font-bold text-purple-600">
									{metrics.steadyStateError !== null
										? `${metrics.steadyStateError.toFixed(2)} RPM`
										: "N/A"}
								</div>
							</div>
						</div>
					</div>
				</div>

				
				<div className="mt-6 bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl text-gray-800 font-semibold text-center bg-gray-50 p-3 rounded-md mb-4">
						Motor Visualization
					</h2>

					<div className="flex flex-col items-center">
						<div className="relative w-32 h-32 mb-4">
							<div className="absolute inset-0 bg-gray-200 rounded-full border-8 border-gray-300"></div>
							<div
								ref={motorAnimationRef}
								className="absolute w-full h-full"
								style={{
									animation: isRunning ? "spin 1s linear infinite" : "none",
								}}
							>
								<div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-12 bg-blue-500 rounded"></div>
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2 h-12 bg-blue-500 rounded"></div>
								<div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-2 bg-blue-500 rounded"></div>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-2 bg-blue-500 rounded"></div>
							</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-700 z-10"></div>
							</div>
						</div>

						<div className="text-center">
							<div className="text-xs text-gray-500">Rotation Speed</div>
							<div className="text-xl font-bold text-gray-800">
								{isRunning ? (currentRPM / 60).toFixed(2) : "0.00"} RPS
							</div>
						</div>
					</div>
				</div>

				
				<div className="mt-6 bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl text-gray-800 font-semibold text-center bg-gray-50 p-3 rounded-md mb-4">
						Control System Guide
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-blue-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-blue-800 mb-2">
								P Controller
							</h3>
							<p className="text-sm text-gray-700">
								Proportional control adjusts the output in proportion to the
								current error. Increases Kp for faster response, but too high
								can cause oscillation. Often results in steady-state error.
                                <strong className="block mt-2">Recommended Kp:</strong> 0.5-2.0 for high RPM, 1.0-5.0 for lower RPM
							</p>
						</div>

						<div className="bg-green-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-green-800 mb-2">
								PI Controller
							</h3>
							<p className="text-sm text-gray-700">
								Adds integral control to eliminate steady-state error. The
								integral term accumulates past errors over time. Higher Ki
								reduces steady-state error but can cause overshoot.
                                <strong className="block mt-2">Recommended Ki:</strong> 0.2-1.0 for stability, 1.0-3.0 for faster response
							</p>
						</div>

						<div className="bg-purple-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-purple-800 mb-2">
								PID Controller
							</h3>
							<p className="text-sm text-gray-700">
								Adds derivative control to improve stability and damping. The
								derivative term responds to the rate of change of error. Higher
								Kd reduces overshoot and oscillation but can amplify noise.
                                <strong className="block mt-2">Recommended Kd:</strong> 0.1-0.5 for smooth response, increase with caution
							</p>
						</div>
					</div>
                    
                    <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                            Important Notes
                        </h3>
                        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                            <li>Control signals above 800 can damage the motor over time</li>
                            <li>For high RPM targets (500), reduce Kp to avoid instability</li>
                            <li>High Kp + high Ki combinations can cause dangerous oscillations</li>
                            <li>The maximum recommended control signal depends on your motor's specifications</li>
                        </ul>
                    </div>
				</div>
			</div>

			
			<style jsx global>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</div>
	);
};

export default MotorControlInterface;