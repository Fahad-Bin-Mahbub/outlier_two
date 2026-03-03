'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Space_Grotesk } from 'next/font/google';

ChartJS.register(ArcElement, Tooltip, Legend);


const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});


interface Process {
  Pid: string;
  AT: number;
  BT: number;
  P: number;
  CT?: number | null;
  TAT?: number | null;
  WT?: number | null;
  RT?: number | null;
  color: string;
  originalIndex?: number;
}

interface GanttProcess {
  Pid: string;
  arrivalTime: number;
  exitingTime: number | null;
  timeInCPU: number | null;
  color: string;
}

interface SimulationStep {
  cpu: Process;
  queue: Process[];
  completed: string[];
  curTime: number;
  data: Process[];
  msg: string;
  ganttChartData: GanttProcess[][];
}

interface TooltipContent {
  pid: string;
  arrivalTime: number;
  exitTime: number | null;
  cpuTime: number | null;
  color: string;
}

interface TooltipPosition {
  x: number;
  y: number;
}

export default function OSLabSImulatorExport() {
  
  const [algo, setAlgo] = useState<string>('FCFS');
  const [data, setData] = useState<Process[]>([
    { Pid: 'P1', AT: 0, BT: 4, P: 0, color: '' },
    { Pid: 'P2', AT: 3, BT: 5, P: 2, color: '' },
    { Pid: 'P3', AT: 2, BT: 2, P: 1, color: '' },
  ]);

  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [priorityType, setPriorityType] = useState<string>('higher');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [cpu, setCPU] = useState<Process>({} as Process);
  const [queue, setQueue] = useState<Process[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [ganttChartData, setGanttChartData] = useState<GanttProcess[][]>([]);
  const [avgTAT, setAvgTAT] = useState<string>('0');
  const [avgWT, setAvgWT] = useState<string>('0');
  const [message, setMessage] = useState<string>('');
  const [isHowToUseOpen, setIsHowToUseOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipContent, setTooltipContent] = useState<TooltipContent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });

  const ganttRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  
  const createCopyJSON = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

  const createColorSchemes = (n: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
      const hue = (i * 360) / n;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const createGanttChartData = (steps: SimulationStep[]): GanttProcess[][] => {
    let ganttData: GanttProcess[][] = [];
    let temp: GanttProcess[] = [];
    let isCPUFree: boolean = true;
    let curProcessID: string | null = null;
    let lastCurTime: number = 0;

    steps.forEach(({ cpu, curTime }) => {
      lastCurTime = curTime;
      if (isCPUFree && cpu.Pid) {
        isCPUFree = false;
        curProcessID = cpu.Pid;
        temp.push({ Pid: cpu.Pid, arrivalTime: curTime, exitingTime: null, timeInCPU: null, color: cpu.color });
      } else if (!isCPUFree && !cpu.Pid) {
        isCPUFree = true;
        temp[temp.length - 1].exitingTime = curTime;
        temp[temp.length - 1].timeInCPU = curTime - temp[temp.length - 1].arrivalTime;
      } else if (!isCPUFree && cpu.Pid !== curProcessID) {
        temp[temp.length - 1].exitingTime = curTime;
        temp[temp.length - 1].timeInCPU = curTime - temp[temp.length - 1].arrivalTime;
        curProcessID = cpu.Pid;
        temp.push({ Pid: cpu.Pid, arrivalTime: curTime, exitingTime: null, timeInCPU: null, color: cpu.color });
      }
    });

    if (!isCPUFree && temp.length > 0 && temp[temp.length - 1].exitingTime === null) {
      temp[temp.length - 1].exitingTime = lastCurTime;
      temp[temp.length - 1].timeInCPU = lastCurTime - temp[temp.length - 1].arrivalTime;
    }

    let temp2: GanttProcess[] = [];
    let prevExitingTime: number = 0;
    const emptyProcess: GanttProcess = { Pid: '', arrivalTime: 0, exitingTime: null, timeInCPU: null, color: 'transparent' };
    
    temp.forEach((process) => {
      if (process.arrivalTime !== prevExitingTime && process.arrivalTime !== null) {
        emptyProcess.arrivalTime = prevExitingTime;
        emptyProcess.exitingTime = process.arrivalTime;
        emptyProcess.timeInCPU = process.arrivalTime - prevExitingTime;
        temp2.push(createCopyJSON(emptyProcess));
      }
      temp2.push(process);
      prevExitingTime = process.exitingTime || 0;
    });
    
    ganttData.push(temp2.filter((p) => p.timeInCPU !== null && p.timeInCPU > 0));
    return ganttData;
  };

  const StepWiseFCFS = (data: Process[]): SimulationStep[] => {
    const newData = createCopyJSON(data).map((p: Process, i: number) => ({ ...p, originalIndex: i })).sort((a: Process, b: Process) => a.AT - b.AT);
    let steps: SimulationStep[] = [];
    let cpu: Process = {} as Process;
    let queue: Process[] = [];
    let completed: string[] = [];
    let curTime: number = 0;
    let cpuProcessCT: number = -1;

    const updateData = (newData: Process): void => {
      if (newData.originalIndex !== undefined) {
        data[newData.originalIndex] = newData;
      }
    };

    const pushStep = (msg: string): void => {
      steps.push({
        cpu: createCopyJSON(cpu),
        queue: createCopyJSON(queue),
        completed: createCopyJSON(completed),
        curTime,
        data: createCopyJSON(data),
        msg,
        ganttChartData: createGanttChartData(steps),
      });
    };

    const executeProcess = (): void => {
      if (cpu.Pid) {
        cpu.RT = cpuProcessCT - curTime;
        if (!cpu.RT) {
          cpu.CT = curTime;
          updateData(cpu);
        }
      }
    };

    newData.forEach((process: Process) => {
      while (cpu.Pid && cpuProcessCT < process.AT) {
        curTime = cpuProcessCT;
        executeProcess();
        completed.push(cpu.Pid);
        cpu = {} as Process;
        pushStep(`Process ${completed[completed.length - 1]} completed at ${curTime}`);
        if (queue.length) {
          cpu = queue.shift() as Process;
          cpuProcessCT = curTime + cpu.BT;
          pushStep(`Process ${cpu.Pid} assigned to CPU at ${curTime}`);
        }
      }

      curTime = process.AT;
      queue.push(process);
      if (cpu.Pid) executeProcess();
      pushStep(`Process ${process.Pid} arrived at ${curTime}`);
      if (!cpu.Pid && queue.length) {
        cpu = queue.shift() as Process;
        cpuProcessCT = curTime + cpu.BT;
        pushStep(`Process ${cpu.Pid} assigned to CPU at ${curTime}`);
      }
    });

    while (queue.length) {
      curTime = cpuProcessCT;
      executeProcess();
      completed.push(cpu.Pid);
      cpu = {} as Process;
      pushStep(`Process ${completed[completed.length - 1]} completed at ${curTime}`);
      if (queue.length) {
        cpu = queue.shift() as Process;
        cpuProcessCT = curTime + cpu.BT;
        pushStep(`Process ${cpu.Pid} assigned to CPU at ${curTime}`);
      }
    }

    if (cpu.Pid) {
      curTime = cpuProcessCT;
      executeProcess();
      completed.push(cpu.Pid);
      pushStep(`Process ${cpu.Pid} completed at ${curTime}`);
    }

    data.forEach((p: Process) => {
      if (p.CT !== undefined && p.CT !== null) {
        p.TAT = p.CT - p.AT;
        pushStep(`TAT for ${p.Pid}: ${p.TAT}`);
        p.WT = p.TAT - p.BT;
        pushStep(`WT for ${p.Pid}: ${p.WT}`);
      }
    });

    const avgTAT = (data.reduce((sum, p) => sum + (p.TAT || 0), 0) / data.length).toFixed(2);
    const avgWT = (data.reduce((sum, p) => sum + (p.WT || 0), 0) / data.length).toFixed(2);
    pushStep(`Average TAT: ${avgTAT}, Average WT: ${avgWT}`);

    return steps;
  };

  const validateInputs = (): string | null => {
    for (const process of data) {
      if (!process.Pid) return "Process ID cannot be empty.";
      if (process.AT < 0) return "Arrival Time cannot be negative.";
      if (process.BT <= 0) return "Burst Time must be greater than 0.";
      if (algo === 'Priority' && process.P < 0) return "Priority cannot be negative.";
    }
    if (algo === 'RR' && timeQuantum <= 0) return "Time Quantum must be greater than 0.";
    return null;
  };

  const handleAddProcess = (): void => {
    const newData = [...data, { Pid: `P${data.length + 1}`, AT: 0, BT: 0, P: 0, color: '' }];
    setData(newData);
  };

  const handleDeleteProcess = (index: number): void => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleInputChange = (index: number, field: keyof Process, value: string): void => {
    const newData = [...data];
    if (field === 'Pid') {
      newData[index][field] = value;
    } else {
      newData[index][field as keyof Process] = parseInt(value) || 0;
    }
    setData(newData);
  };

  const handleRun = (): void => {
    const error = validateInputs();
    if (error) {
      alert(error);
      return;
    }
    const colors = createColorSchemes(data.length);
    const newData: Process[] = data.map((p, i) => ({
      ...p,
      AT: parseInt(p.AT.toString()) || 0,
      BT: parseInt(p.BT.toString()) || 0,
      P: parseInt(p.P.toString()) || 0,
      CT: null,
      TAT: null,
      WT: null,
      color: colors[i],
    }));
    setData(newData);

    const newSteps: SimulationStep[] = StepWiseFCFS(newData);

    setSteps(newSteps);
    setIsRunning(true);
    setCurrentStepIndex(-1);
    handleNext();
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setSteps([]);
    setCurrentStepIndex(-1);
    setCurrentTime(0);
    setCPU({} as Process);
    setQueue([]);
    setCompleted([]);
    setGanttChartData([]);
    setAvgTAT('0');
    setAvgWT('0');
    setMessage('');
    setData([
      { Pid: 'P1', AT: 0, BT: 4, P: 0, color: '' },
      { Pid: 'P2', AT: 3, BT: 5, P: 2, color: '' },
      { Pid: 'P3', AT: 2, BT: 2, P: 1, color: '' },
    ]);
  };

  const handleNext = (): void => {
    if (currentStepIndex >= steps.length - 1) return;
    const newIndex = currentStepIndex + 1;
    setCurrentStepIndex(newIndex);
    const step = steps[newIndex];
    setCPU(step.cpu);
    setQueue(step.queue);
    setCompleted(step.completed);
    setCurrentTime(step.curTime);
    setData(step.data);
    setGanttChartData(step.ganttChartData);
    setMessage(step.msg);
    if (step.msg.includes('Average TAT')) {
      const matches = step.msg.match(/[\d.]+/g);
      if (matches && matches.length >= 2) {
        const [tat, wt] = matches;
        setAvgTAT(tat);
        setAvgWT(wt);
      }
    }
    if (step.ganttChartData.length && ganttRef.current) {
      ganttRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (newIndex === steps.length - 1 && pieChartRef.current) {
      setTimeout(() => {
        if (pieChartRef.current) {
          pieChartRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  const handlePrev = (): void => {
    if (currentStepIndex <= -1) return;
    const newIndex = currentStepIndex - 1;
    setCurrentStepIndex(newIndex);
    if (newIndex === -1) {
      setCPU({} as Process);
      setQueue([]);
      setCompleted([]);
      setCurrentTime(0);
      setGanttChartData([]);
      setMessage('');
      setAvgTAT('0');
      setAvgWT('0');
      return;
    }
    const step = steps[newIndex];
    setCPU(step.cpu);
    setQueue(step.queue);
    setCompleted(step.completed);
    setCurrentTime(step.curTime);
    setData(step.data);
    setGanttChartData(step.ganttChartData);
    setMessage(step.msg);
    if (step.msg.includes('Average TAT')) {
      const matches = step.msg.match(/[\d.]+/g);
      if (matches && matches.length >= 2) {
        const [tat, wt] = matches;
        setAvgTAT(tat);
        setAvgWT(wt);
      }
    }
  };

  const handleShowFinalResult = (): void => {
    if (currentStepIndex >= steps.length - 1) return;
    const newIndex = steps.length - 1;
    setCurrentStepIndex(newIndex);
    const step = steps[newIndex];
    setCPU(step.cpu);
    setQueue(step.queue);
    setCompleted(step.completed);
    setCurrentTime(step.curTime);
    setData(step.data);
    setGanttChartData(step.ganttChartData);
    setMessage(step.msg);
    const matches = step.msg.match(/[\d.]+/g);
    if (matches && matches.length >= 2) {
      const [tat, wt] = matches;
      setAvgTAT(tat);
      setAvgWT(wt);
    }
    if (pieChartRef.current) {
      setTimeout(() => {
        if (pieChartRef.current) {
          pieChartRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  };

  const handleShowTooltip = (process: GanttProcess, e: React.MouseEvent): void => {
    if (!process.Pid) return;

    setTooltipContent({
      pid: process.Pid,
      arrivalTime: process.arrivalTime,
      exitTime: process.exitingTime,
      cpuTime: process.timeInCPU,
      color: process.color
    });

    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 130
    });

    setShowTooltip(true);
  };

  const handleHideTooltip = (): void => {
    setShowTooltip(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isRunning) {
        if (e.key === 'Enter') handleRun();
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Enter') handleShowFinalResult();
      if (e.key === 'Backspace') handleReset();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, currentStepIndex]);

  
  const pieChartDataTAT = {
    labels: data.map((p) => p.Pid),
    datasets: [
      {
        data: data.map((p) => p.TAT || 0),
        backgroundColor: data.map((p) => p.color),
        borderColor: data.map((p) => p.color),
        borderWidth: 1,
      },
    ],
  };

  const pieChartDataWT = {
    labels: data.map((p) => p.Pid),
    datasets: [
      {
        data: data.map((p) => p.WT || 0),
        backgroundColor: data.map((p) => p.color),
        borderColor: data.map((p) => p.color),
        borderWidth: 1,
      },
    ],
  };

  
  const columns: (keyof Process)[] = isRunning
    ? ['Pid', 'AT', 'BT', ...(algo === 'Priority' ? ['P'] : []), 'CT', 'TAT', 'WT']
    : ['Pid', 'AT', 'BT', ...(algo === 'Priority' ? ['P'] : [])];

  return (
    <div className={`${spaceGrotesk.variable} font-sans min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6`}>
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          CPU Scheduling Simulator
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Explore and understand OS scheduling algorithms with interactive simulation
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4 mb-8 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <label className="text-lg font-semibold">Algorithm:</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            disabled={isRunning}
            className="bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 cursor-pointer"
          >
            <option value="FCFS">First Come First Served (FCFS)</option>
          </select>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHowToUseOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 transition duration-300 shadow-lg cursor-pointer"
        >
          How to Use
        </motion.button>
      </motion.div>

      {isHowToUseOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsHowToUseOpen(false)}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto text-white border border-gray-700 shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              How to Use the CPU Scheduling Simulator
            </h2>
            <div className="space-y-4">
              <section>
                <h3 className="text-lg font-semibold text-blue-400">Overview</h3>
                <p className="text-gray-300">
                  This simulator allows you to explore CPU scheduling algorithms, starting with FCFS (First Come First Served). You can input process details and visualize their execution through a Gantt chart and pie charts for Turnaround Time (TAT) and Waiting Time (WT).
                </p>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-blue-400">Features</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li><strong className="text-white">Process Management</strong>: Add, edit, or delete processes with Process ID, Arrival Time (AT), and Burst Time (BT).</li>
                  <li><strong className="text-white">Simulation Controls</strong>: Run, step forward/backward, show final results, or reset the simulation.</li>
                  <li><strong className="text-white">Gantt Chart</strong>: Visualizes process execution with animated blocks and detailed tooltips.</li>
                  <li><strong className="text-white">Pie Charts</strong>: Displays TAT and WT distributions at the end of the simulation.</li>
                  <li><strong className="text-white">Keyboard Shortcuts</strong>: Use Enter (Run/Show Final Result), Arrow keys (Next/Prev), Backspace (Reset).</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-blue-400">How to Use</h3>
                <ol className="list-decimal pl-5 text-gray-300 space-y-2">
                  <li><strong className="text-white">Input Process Data</strong>: Edit the table to set Process ID, AT, and BT. Add or delete processes as needed.</li>
                  <li><strong className="text-white">Run Simulation</strong>: Click "Run" or press Enter to start. The simulator validates inputs (e.g., BT > 0).</li>
                  <li><strong className="text-white">Navigate Steps</strong>: Use "Next"/"Prev" buttons or Arrow keys to step through the simulation. View CPU, Queue, and Completed states, along with informative messages.</li>
                  <li><strong className="text-white">View Gantt Chart</strong>: The Gantt chart shows process execution with colored blocks. Hover for detailed tooltips.</li>
                  <li><strong className="text-white">View Results</strong>: At the end (or click "Show Final Result"), see pie charts for TAT/WT and average values.</li>
                  <li><strong className="text-white">Reset</strong>: Click "Reset" or press Backspace to clear and start over.</li>
                </ol>
              </section>
              <section>
                <h3 className="text-lg font-semibold text-blue-400">Tips</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Ensure valid inputs to avoid errors (e.g., non-negative AT, positive BT).</li>
                  <li>Use keyboard shortcuts for faster navigation.</li>
                  <li>Hover over Gantt chart blocks for detailed process info.</li>
                  <li>The FCFS algorithm processes jobs in the order they arrive, regardless of burst time or priority.</li>
                </ul>
              </section>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsHowToUseOpen(false)}
              className="mt-6 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg transition duration-300 w-full cursor-pointer"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="mb-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-700 sticky top-0">
                {columns.map((col) => (
                  <th key={col} className="border-b border-gray-700 p-3 text-left font-semibold">
                    {col}
                  </th>
                ))}
                {!isRunning && <th className="border-b border-gray-700 p-3 text-left font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-800 transition duration-200"
                    style={{ backgroundColor: row.color ? `${row.color}15` : 'transparent' }}
                  >
                    {columns.map((col) => (
                      <td key={col} className="border-t border-gray-700 p-3">
                        {isRunning || col === 'CT' || col === 'TAT' || col === 'WT' ? (
                          <span className="text-gray-300">{row[col] ?? ''}</span>
                        ) : (
                          <input
                            type={col === 'Pid' ? 'text' : 'number'}
                            value={row[col] ?? ''}
                            onChange={(e) => handleInputChange(index, col, e.target.value)}
                            className="bg-gray-800 text-white w-full p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            disabled={isRunning}
                          />
                        )}
                      </td>
                    ))}
                    {!isRunning && (
                      <td className="border-t border-gray-700 p-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteProcess(index)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg transition duration-300 cursor-pointer"
                          disabled={data.length <= 1}
                        >
                          Delete
                        </motion.button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!isRunning && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddProcess}
            className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md cursor-pointer"
          >
            Add Process
          </motion.button>
        )}
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {!isRunning ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRun}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 shadow-lg cursor-pointer"
            >
              Run Simulation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-6 py-2 rounded-lg transition duration-300 shadow-lg cursor-pointer"
            >
              Reset
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentStepIndex <= -1}
              className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-6 py-2 rounded-lg hover:from-gray-600 hover:to-gray-800 disabled:opacity-50 transition duration-300 shadow-lg cursor-pointer"
            >
              ← Previous Step
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentStepIndex >= steps.length - 1}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 transition duration-300 shadow-lg cursor-pointer"
            >
              Next Step →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowFinalResult}
              disabled={currentStepIndex >= steps.length - 1}
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-purple-800 disabled:opacity-50 transition duration-300 shadow-lg cursor-pointer"
            >
              Show Final Result
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-800 transition duration-300 shadow-lg cursor-pointer"
            >
              Reset
            </motion.button>
          </>
        )}
      </motion.div>

      {isRunning && (
        <motion.div
          className="mb-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <motion.div
              className="rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3">
                <h2 className="text-lg font-bold">CPU</h2>
              </div>
              <div className="bg-gray-800 p-4 h-20 flex items-center justify-center border-t border-blue-900">
                {cpu.Pid ? (
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: cpu.color }}
                    ></div>
                    <span className="text-white font-semibold">{cpu.Pid}</span>
                    <span className="text-gray-400">Remaining Time: {cpu.RT}</span>
                  </div>
                ) : (
                  <p className="text-gray-400">CPU is idle</p>
                )}
              </div>
            </motion.div>
            
            <motion.div
              className="rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3">
                <h2 className="text-lg font-bold">Ready Queue</h2>
              </div>
              <div className="bg-gray-800 p-4 h-20 flex items-center justify-center border-t border-purple-900">
                {queue.length ? (
                  <div className="flex flex-wrap gap-2">
                    {queue.map((p, i) => (
                      <div 
                        key={i} 
                        className="flex items-center bg-gray-700 rounded px-2 py-1"
                        style={{ borderLeft: `3px solid ${p.color}` }}
                      >
                        <span className="text-white">{p.Pid}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Queue is empty</p>
                )}
              </div>
            </motion.div>
            
            <motion.div
              className="rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-green-600 to-green-800 p-3">
                <h2 className="text-lg font-bold">Completed</h2>
              </div>
              <div className="bg-gray-800 p-4 h-20 flex items-center justify-center border-t border-green-900">
                {completed.length ? (
                  <div className="flex flex-wrap gap-2">
                    {completed.map((pid, i) => {
                      const process = data.find(p => p.Pid === pid);
                      return (
                        <div 
                          key={i} 
                          className="flex items-center bg-gray-700 rounded px-2 py-1"
                          style={{ borderLeft: `3px solid ${process?.color || 'gray'}` }}
                        >
                          <span className="text-white">{pid}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400">No completed processes</p>
                )}
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="text-center bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl font-semibold mb-2">Current Time: <span className="text-blue-400">{currentTime}</span></p>
            <p className="mt-4 text-gray-300">{message}</p>
            <div className="mt-3 text-sm text-gray-500">Step {currentStepIndex + 1} of {steps.length}</div>
          </motion.div>
        </motion.div>
      )}

      {isRunning && ganttChartData.length > 0 && (
        <motion.div
          ref={ganttRef}
          className="mb-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Gantt Chart
          </h2>
          <div className="overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex gap-1 min-w-max pb-12 relative">
              <AnimatePresence>
                {ganttChartData[0].map((process, index) => (
                  <motion.div
                    key={`${process.Pid}-${index}`}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${(process.timeInCPU || 0) * 40}px`, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="h-16 flex items-center justify-center border border-gray-700 relative group rounded cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200"
                    style={{ 
                      backgroundColor: process.color || 'transparent',
                      backgroundImage: process.color ? `linear-gradient(135deg, ${process.color}90, ${process.color}60)` : 'none' 
                    }}
                    onMouseEnter={(e) => handleShowTooltip(process, e)}
                    onMouseLeave={handleHideTooltip}
                  >
                    <span className="text-sm font-semibold text-white drop-shadow-md">
                      {process.Pid}
                    </span>
                    <span className="absolute bottom-[-24px] left-0 text-xs">{process.arrivalTime}</span>
                    {(process.exitingTime !== null || index === ganttChartData[0].length - 1) && (
                      <span className="absolute bottom-[-24px] right-0 text-xs">{process.exitingTime}</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {showTooltip && tooltipContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bg-gray-900 text-white p-3 rounded-lg shadow-xl z-50 border border-gray-700 pointer-events-none"
                  style={{
                    top: tooltipPosition.y - 60,
                    left: tooltipPosition.x,
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(145deg, #2d3748, #1a202c)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-gray-600">
                    <div
                      className="w-3 h-3 rounded-full border border-gray-400"
                      style={{ backgroundColor: tooltipContent.color }}
                    ></div>
                    <span className="font-semibold">{tooltipContent.pid}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>Start Time: {tooltipContent.arrivalTime}</p>
                    <p>End Time: {tooltipContent.exitTime}</p>
                    <p>Duration: {tooltipContent.cpuTime}</p>
                  </div>
                  <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </motion.div>
              )}
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-2">
            Hover over blocks for details • Arrow keys to navigate steps
          </div>
        </motion.div>
      )}

      {isRunning && currentStepIndex === steps.length - 1 && (avgTAT || avgWT) && (
        <motion.div
          ref={pieChartRef}
          className="mb-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Simulation Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center text-blue-400">Turnaround Time (TAT)</h3>
              <Pie
                data={pieChartDataTAT}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top', labels: { color: 'white', padding: 15 } },
                    tooltip: { 
                      backgroundColor: 'rgba(26, 32, 44, 0.9)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      bodyFont: { weight: 'bold' },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                      boxWidth: 10,
                      boxHeight: 10,
                      boxPadding: 3,
                    },
                  },
                }}
              />
            </motion.div>
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center text-purple-400">Waiting Time (WT)</h3>
              <Pie
                data={pieChartDataWT}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top', labels: { color: 'white', padding: 15 } },
                    tooltip: { 
                      backgroundColor: 'rgba(26, 32, 44, 0.9)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      bodyFont: { weight: 'bold' },
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                      boxWidth: 10,
                      boxHeight: 10,
                      boxPadding: 3,
                    },
                  },
                }}
              />
            </motion.div>
          </div>
          <motion.div
            className="text-center mt-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-gray-400 mb-1">Average Turnaround Time</p>
                <p className="text-2xl font-bold text-blue-400">{avgTAT}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 mb-1">Average Waiting Time</p>
                <p className="text-2xl font-bold text-purple-400">{avgWT}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <div className="text-center text-gray-500 text-sm pt-4 mt-8 border-t border-gray-800">
        <p>CPU Scheduling Simulator &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Use arrow keys for navigation • Enter for final result • Backspace to reset</p>
      </div>
    </div>
  );
}