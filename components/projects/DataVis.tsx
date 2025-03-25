"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BarChart3, PieChart, LineChart, Table, Filter, Download, X, ChevronLeft, ChevronRight, Loader2, CheckCircle, AlertCircle, Calendar, Package, Globe, DollarSign, ShoppingCart } from 'lucide-react';
import * as XLSX from 'xlsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SalesData = {
  id: number;
  date: string;
  productCategory: string;
  region: string;
  revenue: number;
  unitsSold: number;
};

type ChartDataType = 'revenue' | 'units';

type MetricCard = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
};

type ChartPoint = {
  label: string;
  value: number;
  color?: string;
};

export default function DataVisExport() {
  // State management
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [filteredData, setFilteredData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartDataType, setChartDataType] = useState<ChartDataType>('revenue');
  const [productFilter, setProductFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const rowsPerPage = 5;
  
  // Sample data for demonstration
  const sampleData: SalesData[] = [
    { id: 1, date: '2024-01-15', productCategory: 'Electronics', region: 'North America', revenue: 12500, unitsSold: 50 },
    { id: 2, date: '2024-01-16', productCategory: 'Clothing', region: 'Europe', revenue: 8500, unitsSold: 120 },
    { id: 3, date: '2024-01-17', productCategory: 'Home & Garden', region: 'Asia', revenue: 9200, unitsSold: 85 },
    { id: 4, date: '2024-01-18', productCategory: 'Electronics', region: 'North America', revenue: 15300, unitsSold: 62 },
    { id: 5, date: '2024-01-19', productCategory: 'Books', region: 'Europe', revenue: 4200, unitsSold: 210 },
    { id: 6, date: '2024-01-20', productCategory: 'Clothing', region: 'Asia', revenue: 7600, unitsSold: 95 },
    { id: 7, date: '2024-01-21', productCategory: 'Home & Garden', region: 'North America', revenue: 11000, unitsSold: 78 },
    { id: 8, date: '2024-01-22', productCategory: 'Electronics', region: 'Europe', revenue: 18200, unitsSold: 73 },
    { id: 9, date: '2024-01-23', productCategory: 'Books', region: 'Asia', revenue: 3800, unitsSold: 190 },
    { id: 10, date: '2024-01-24', productCategory: 'Clothing', region: 'North America', revenue: 9400, unitsSold: 118 },
  ];
  
  // Initialize with sample data
  useEffect(() => {
    setSalesData(sampleData);
    setFilteredData(sampleData);
  }, []);
  
  // Filter data when product filter changes
  useEffect(() => {
    if (!productFilter.trim()) {
      setFilteredData(salesData);
      setCurrentPage(1);
      return;
    }
    
    const filtered = salesData.filter(item => 
      item.productCategory.toLowerCase().includes(productFilter.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [productFilter, salesData]);
  
  // Calculate metrics
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUnitsSold = salesData.reduce((sum, item) => sum + item.unitsSold, 0);
  const averageOrderValue = salesData.length > 0 ? totalRevenue / totalUnitsSold : 0;
  
  // Calculate chart data
  const lineChartData: ChartPoint[] = Array.from(
    salesData.reduce((map, item) => {
      const current = map.get(item.date) || 0;
      map.set(item.date, current + (chartDataType === 'revenue' ? item.revenue : item.unitsSold));
      return map;
    }, new Map<string, number>())
  ).map(([date, value]) => ({
    label: date,
    value,
  }));
  
  const barChartData: ChartPoint[] = Array.from(
    salesData.reduce((map, item) => {
      const current = map.get(item.productCategory) || 0;
      map.set(item.productCategory, current + (chartDataType === 'revenue' ? item.revenue : item.unitsSold));
      return map;
    }, new Map<string, number>())
  ).map(([category, value]) => ({
    label: category,
    value,
    color: getCategoryColor(category),
  }));
  
  const pieChartData: ChartPoint[] = Array.from(
    salesData.reduce((map, item) => {
      const current = map.get(item.region) || 0;
      map.set(item.region, current + (chartDataType === 'revenue' ? item.revenue : item.unitsSold));
      return map;
    }, new Map<string, number>())
  ).map(([region, value]) => ({
    label: region,
    value,
    color: getRegionColor(region),
  }));
  
  // Helper functions for colors
  function getCategoryColor(category: string): string {
    const colors = [
      'bg-indigo-500',
      'bg-blue-500',
      'bg-cyan-500',
      'bg-teal-500',
      'bg-emerald-500',
    ];
    const index = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }
  
  function getRegionColor(region: string): string {
    const colors = [
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ];
    const index = region.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }
  
  // File handling
  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        // Transform to our data structure
        const parsedData: SalesData[] = jsonData.map((row: any, index) => ({
          id: index + 1,
          date: row.Date || row.date || '',
          productCategory: row['Product Category'] || row.productCategory || '',
          region: row.Region || row.region || '',
          revenue: Number(row.Revenue || row.revenue || 0),
          unitsSold: Number(row['Units sold'] || row.unitsSold || 0),
        }));
        
        if (parsedData.length === 0) {
          throw new Error('No valid data found in the file');
        }
        
        setSalesData(parsedData);
        setFilteredData(parsedData);
        setProductFilter('');
        
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to parse file. Please ensure it has the correct format.');
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      setIsLoading(false);
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };
  
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      handleFileUpload(file);
    } else {
      setError('Please upload a valid .xlsx or .csv file');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      handleFileUpload(file);
    } else {
      setError('Please upload a valid .xlsx or .csv file');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const loadSampleData = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setSalesData(sampleData);
      setFilteredData(sampleData);
      setProductFilter('');
      setIsLoading(false);
    }, 600);
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Metric cards
  const metricCards: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Total Units Sold',
      value: totalUnitsSold.toLocaleString(),
      change: '+8.3%',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Avg Order Value',
      value: `$${averageOrderValue.toFixed(2)}`,
      change: '+3.7%',
      icon: <Package className="w-5 h-5" />,
      color: 'from-cyan-500 to-teal-500',
    },
  ];
  
  return (
    <div className="min-h-screen bg-neutral-50 text-slate-800 flex">
      {/* Sidebar */}
      <motion.aside 
        className={twMerge(
          "bg-slate-900 text-slate-200 p-6 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "w-20" : "w-80"
        )}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-8">
          {!isSidebarCollapsed && (
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Data Vision
            </motion.h1>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className={clsx("w-5 h-5 transition-transform", isSidebarCollapsed && "rotate-180")} />
          </button>
        </div>
        
        <div className="flex-1">
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-slate-300">Data Controls</h2>
              
              {/* File upload zone */}
              <div 
                className={clsx(
                  "border-2 border-dashed rounded-2xl p-6 mb-6 text-center transition-all duration-300",
                  isDragging 
                    ? "border-indigo-400 bg-indigo-500/10" 
                    : "border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50",
                  "backdrop-blur-sm"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 rounded-full bg-slate-800 mb-4">
                    <Upload className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="font-medium mb-2">Drop your file here</p>
                  <p className="text-sm text-slate-400 mb-4">Supports .xlsx and .csv files</p>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]">
                    Browse Files
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx,.csv" 
                  onChange={handleFileInput}
                />
              </div>
              
              <button
                onClick={loadSampleData}
                className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium mb-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-700/25 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Load Sample Data
              </button>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-3">Chart Display</h3>
                <div className="flex items-center justify-between bg-slate-800 rounded-xl p-1">
                  <span className="text-sm px-3">Revenue</span>
                  <button
                    onClick={() => setChartDataType(prev => prev === 'revenue' ? 'units' : 'revenue')}
                    className={clsx(
                      "relative w-14 h-8 rounded-full transition-all duration-300",
                      chartDataType === 'revenue' ? "bg-indigo-600" : "bg-slate-700"
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{ left: chartDataType === 'revenue' ? 4 : 32 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                  <span className="text-sm px-3">Units</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-3">Table Filter</h3>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    placeholder="Filter by category..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-500"
          >
            <p>Upload sales data with columns: Date, Product Category, Region, Revenue, Units Sold</p>
          </motion.div>
        )}
      </motion.aside>
      
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Analytics Dashboard</h1>
            <p className="text-slate-600">Visualize and explore your sales performance metrics in real-time</p>
          </motion.div>
          
          {/* Loading & Error States */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <Loader2 className="w-12 h-12 text-indigo-600" />
                  </motion.div>
                  <p className="text-lg font-medium text-slate-800">Processing your data...</p>
                  <p className="text-slate-500 mt-2">This may take a few seconds</p>
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-medium text-rose-800">Error</p>
                  <p className="text-rose-600">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-rose-500 hover:text-rose-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Metrics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {metricCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className={clsx(
                  "bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50",
                  "transition-all duration-300 hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-white">
                    <div className="text-indigo-600">{card.icon}</div>
                  </div>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {card.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">{card.title}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                  <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${card.color}`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Charts Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Line Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Trend Over Time</h3>
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>By Date</span>
                </div>
              </div>
              
              <div className="h-64 flex items-end gap-2 pt-4">
                {lineChartData.map((point, index) => (
                  <motion.div
                    key={point.label}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(90, (point.value / Math.max(...lineChartData.map(d => d.value))) * 90)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div 
                      className={clsx(
                        "w-full rounded-t-lg transition-all duration-300",
                        chartDataType === 'revenue' ? "bg-gradient-to-t from-indigo-500 to-indigo-300" : "bg-gradient-to-t from-cyan-500 to-cyan-300"
                      )}
                    ></div>
                    <div className="text-xs text-slate-500 mt-2 truncate w-full text-center">
                      {point.label.split('-').slice(1).join('-')}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-4 text-sm text-slate-600">
                {chartDataType === 'revenue' ? 'Revenue ($)' : 'Units Sold'} over time
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">By Product Category</h3>
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Top Categories</span>
                </div>
              </div>
              
              <div className="h-64 flex items-end gap-4 pt-4">
                {barChartData.map((point, index) => (
                  <div key={point.label} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(90, (point.value / Math.max(...barChartData.map(d => d.value))) * 90)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                      className={clsx(
                        "w-full rounded-t-lg transition-all duration-300",
                        point.color || (chartDataType === 'revenue' ? "bg-indigo-500" : "bg-cyan-500")
                      )}
                    ></motion.div>
                    <div className="text-xs text-slate-500 mt-2 truncate w-full text-center">
                      {point.label}
                    </div>
                    <div className="text-sm font-medium mt-1">
                      {chartDataType === 'revenue' ? `$${(point.value/1000).toFixed(0)}k` : point.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Sales Distribution by Region</h3>
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Global Regions</span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative w-64 h-64">
                  {pieChartData.map((point, index) => {
                    const total = pieChartData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = (point.value / total) * 100;
                    const offset = pieChartData.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
                    
                    return (
                      <motion.div
                        key={point.label}
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{ clipPath: 'circle(50% at 50% 50%)' }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${point.color?.replace('bg-', '')} ${offset}deg, ${point.color?.replace('bg-', '')} ${offset + (percentage * 3.6)}deg, transparent ${offset + (percentage * 3.6)}deg)`,
                        }}
                      ></motion.div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full shadow-inner flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {chartDataType === 'revenue' ? '$' : ''}
                        {((chartDataType === 'revenue' ? totalRevenue : totalUnitsSold) / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pieChartData.map((point, index) => {
                      const total = pieChartData.reduce((sum, d) => sum + d.value, 0);
                      const percentage = (point.value / total) * 100;
                      
                      return (
                        <motion.div
                          key={point.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded ${point.color}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{point.label}</p>
                            <p className="text-sm text-slate-500">{percentage.toFixed(1)}% of total</p>
                          </div>
                          <div className="text-lg font-bold text-slate-900">
                            {chartDataType === 'revenue' ? `$${(point.value/1000).toFixed(1)}k` : point.value.toLocaleString()}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <Table className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Raw Sales Data</h3>
              </div>
              <div className="text-sm text-slate-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} rows
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-700">Date</th>
                    <th className="text-left p-4 font-medium text-slate-700">Product Category</th>
                    <th className="text-left p-4 font-medium text-slate-700">Region</th>
                    <th className="text-left p-4 font-medium text-slate-700">Revenue</th>
                    <th className="text-left p-4 font-medium text-slate-700">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">{row.date}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(row.productCategory)}`}></div>
                          {row.productCategory}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getRegionColor(row.region)}`}></div>
                          {row.region}
                        </span>
                      </td>
                      <td className="p-4 font-medium">${row.revenue.toLocaleString()}</td>
                      <td className="p-4">{row.unitsSold.toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                  "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all",
                  currentPage === 1
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={clsx(
                      "w-10 h-10 rounded-xl font-medium transition-all",
                      page === currentPage
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={clsx(
                  "px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all",
                  currentPage === totalPages
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center text-slate-500 text-sm"
          >
            <p>All data processing happens client-side. No data is sent to any server.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

