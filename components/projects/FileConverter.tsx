"use client";
import React, { useState, useEffect } from "react";
import {
	FileIcon,
	Upload,
	Settings,
	Download,
	FileText,
	Image,
	Code,
	Film,
	Music,
	FileSpreadsheet,
	X,
	Check,
	ArrowRight,
	Info,
	Star,
	Shield,
	Zap,
	Menu,
	User,
} from "lucide-react";

import { Roboto } from "next/font/google";

const roboto = Roboto({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

interface FileType {
	name: string;
	icon: React.ReactNode;
	format: string;
	accept: string;
}

export default function FileConverterExport() {
	const [selectedInputFile, setSelectedInputFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [outputFormat, setOutputFormat] = useState<string>("pdf");
	const [isConverting, setIsConverting] = useState<boolean>(false);
	const [showPageSplitter, setShowPageSplitter] = useState<boolean>(false);
	const [pageRanges, setPageRanges] = useState<string>("");
	const [showConversionComplete, setShowConversionComplete] =
		useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

	const fileTypes: FileType[] = [
		{
			name: "PDF",
			icon: <FileText size={24} />,
			format: "pdf",
			accept: "application/pdf",
		},
		{
			name: "Word",
			icon: <FileText size={24} />,
			format: "docx",
			accept:
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		},
		{
			name: "Image",
			icon: <Image size={24} />,
			format: "png",
			accept: "image/*",
		},
		{
			name: "SVG",
			icon: <Code size={24} />,
			format: "svg",
			accept: "image/svg+xml",
		},
		{
			name: "Video",
			icon: <Film size={24} />,
			format: "mp4",
			accept: "video/*",
		},
		{
			name: "Audio",
			icon: <Music size={24} />,
			format: "mp3",
			accept: "audio/*",
		},
		{
			name: "Excel",
			icon: <FileSpreadsheet size={24} />,
			format: "xlsx",
			accept:
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
		{
			name: "Text",
			icon: <FileText size={24} />,
			format: "txt",
			accept: "text/plain",
		},
	];

	const getAcceptedFileTypes = () => {
		return fileTypes.map((type) => type.accept).join(",");
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedInputFile(file);
			setErrorMessage(null);

			if (file.type.startsWith("image/")) {
				const url = URL.createObjectURL(file);
				setPreviewUrl(url);
			} else {
				setPreviewUrl(null);
			}
		}
	};

	const handleConvert = () => {
		if (!selectedInputFile) return;

		setIsConverting(true);
		setErrorMessage(null);

		setTimeout(() => {
			try {
				const inputFormat = selectedInputFile.name
					.split(".")
					.pop()
					?.toLowerCase();
				if (inputFormat === outputFormat) {
					throw new Error("Input and output formats are the same");
				}

				setIsConverting(false);
				setShowConversionComplete(true);

				setTimeout(() => {
					setShowConversionComplete(false);
				}, 3000);
			} catch (error) {
				setIsConverting(false);
				setErrorMessage(
					error instanceof Error
						? error.message
						: "An error occurred during conversion"
				);
			}
		}, 2000);
	};

	const handleDownload = () => {
		alert(
			"Download started! In a production app, this would download your converted file."
		);
	};

	const resetForm = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}

		setSelectedInputFile(null);
		setPreviewUrl(null);
		setOutputFormat("pdf");
		setShowPageSplitter(false);
		setPageRanges("");
		setErrorMessage(null);
	};

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	return (
		<div
			className={`flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white ${roboto.className}`}
		>
			<header className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<div className="flex items-center">
									<FileIcon className="h-8 w-8 text-indigo-600" />
									<span className="ml-2 text-2xl font-bold text-gray-800">
										ConvertPro
									</span>
								</div>
							</div>
							<nav className="hidden md:ml-8 md:flex md:space-x-8">
								<a href="#" className="text-indigo-600 font-medium">
									Home
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
								>
									Features
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
								>
									Pricing
								</a>
								<a
									href="#"
									className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
								>
									Support
								</a>
							</nav>
						</div>
						<div className="hidden md:flex items-center">
							<button className="mr-4 text-gray-600 hover:text-indigo-600 transition-colors font-medium cursor-pointer">
								Sign In
							</button>
							<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer">
								Get Started
							</button>
						</div>
						<div className="md:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="text-gray-600"
							>
								<Menu size={24} />
							</button>
						</div>
					</div>
				</div>
				{mobileMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
							<a
								href="#"
								className="block px-3 py-2 text-indigo-600 font-medium"
							>
								Home
							</a>
							<a
								href="#"
								className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
							>
								Features
							</a>
							<a
								href="#"
								className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
							>
								Pricing
							</a>
							<a
								href="#"
								className="block px-3 py-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
							>
								Support
							</a>
							<div className="pt-4 flex flex-col space-y-2">
								<button className="text-gray-600 hover:text-indigo-600 transition-colors font-medium px-3 py-2">
									Sign In
								</button>
								<button className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium mx-3">
									Get Started
								</button>
							</div>
						</div>
					</div>
				)}
			</header>

			<div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="md:flex md:items-center md:justify-between">
						<div className="md:w-1/2">
							<h1 className="text-4xl font-bold tracking-tight mb-4">
								Transform Any File Format <br />
								<span className="text-indigo-200">Quickly & Securely</span>
							</h1>
							<p className="text-lg mb-8 text-indigo-100">
								Convert between document, image, audio, and video formats with
								just a few clicks. No software installation required.
							</p>
							<div className="flex space-x-4">
								<button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors cursor-pointer">
									Start Converting Now
								</button>
								<button className="border border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition-colors cursor-pointer">
									Learn More
								</button>
							</div>
						</div>
						<div className="mt-8 md:mt-0 md:w-1/2">
							<div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl">
								<div className="grid grid-cols-4 gap-2">
									{fileTypes.slice(0, 8).map((type) => (
										<div
											key={type.format}
											className="flex flex-col items-center p-2 bg-white/10 rounded-lg"
										>
											<div className="p-2 rounded-lg bg-white/20 text-white">
												{type.icon}
											</div>
											<span className="mt-1 text-xs font-medium">
												{type.name}
											</span>
										</div>
									))}
								</div>
								<div className="mt-4 flex justify-center">
									<div className="animate-pulse flex items-center space-x-3">
										<ArrowRight className="text-indigo-200" />
										<span className="text-indigo-200 font-medium">
											Convert Any Format
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center p-4 bg-white border-b sticky top-0 z-10 shadow-sm">
				<div className="grid grid-cols-4 md:flex md:flex-wrap gap-2 md:gap-4 max-w-full p-2">
					{fileTypes.map((type) => (
						<button
							key={type.format}
							className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
								outputFormat === type.format
									? "bg-indigo-100 text-indigo-800 shadow-md"
									: "hover:bg-gray-100"
							}`}
							onClick={() => setOutputFormat(type.format)}
						>
							<div
								className={`p-2 rounded-lg ${
									outputFormat === type.format ? "bg-indigo-500" : "bg-blue-500"
								} text-white`}
							>
								{type.icon}
							</div>
							<span className="mt-1 text-sm font-medium">{type.name}</span>
						</button>
					))}
				</div>
			</div>

			<main className="flex-grow container mx-auto p-4 md:p-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
					<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
						<h2 className="text-lg font-medium mb-4 bg-indigo-50 text-indigo-800 rounded-md p-2 w-full text-center">
							Input File
						</h2>
						<div
							className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 ${
								selectedInputFile
									? "border-green-400 bg-green-50"
									: "border-indigo-200 bg-indigo-50"
							}`}
						>
							{previewUrl ? (
								<div className="relative w-full h-full">
									<img
										src={previewUrl}
										alt="Preview"
										className="w-full h-full object-contain"
									/>
									<button
										onClick={resetForm}
										className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 cursor-pointer"
										aria-label="Remove file"
									>
										<X size={16} />
									</button>
								</div>
							) : selectedInputFile ? (
								<div className="flex flex-col items-center text-center">
									<FileIcon size={48} className="text-green-500 mb-2" />
									<p className="font-medium">{selectedInputFile.name}</p>
									<p className="text-sm text-gray-500">
										{(selectedInputFile.size / 1024 / 1024).toFixed(2)} MB
									</p>
									<button
										onClick={resetForm}
										className="mt-2 text-red-600 hover:text-red-700 flex items-center cursor-pointer"
									>
										<X size={16} className="mr-1" /> Remove
									</button>
								</div>
							) : (
								<div className="text-center">
									<FileIcon
										size={48}
										className="mx-auto text-indigo-300 mb-2"
									/>
									<p className="text-indigo-500">No file selected</p>
									<p className="text-xs text-indigo-400 mt-2">
										Upload a file to begin conversion
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
						<h2 className="text-lg font-medium mb-4 text-center bg-indigo-50 text-indigo-800 rounded-md p-2">
							Convert Your File
						</h2>

						<label className="mb-6 w-full cursor-pointer block">
							<div className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md">
								<Upload size={20} className="mr-2" />
								Upload your file
							</div>
							<input
								type="file"
								className="hidden"
								onChange={handleFileUpload}
								accept={getAcceptedFileTypes()}
							/>
						</label>

						<div className="mb-6">
							<label className="block mb-2 text-sm font-medium text-gray-700">
								Select output format
							</label>
							<select
								className="w-full p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								value={outputFormat}
								onChange={(e) => setOutputFormat(e.target.value)}
							>
								{fileTypes.map((type) => (
									<option key={type.format} value={type.format}>
										{type.name} (.{type.format})
									</option>
								))}
							</select>
						</div>

						<button
							className="mb-6 py-2 px-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-sm"
							onClick={() => setShowPageSplitter(!showPageSplitter)}
						>
							<Settings size={20} className="mr-2" />
							{showPageSplitter ? "Hide" : "Show"} Page Split Options
						</button>

						{showPageSplitter && (
							<div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
								<label className="block mb-2 text-sm font-medium text-indigo-700">
									Enter page ranges (e.g., 1-3,5,7-9)
								</label>
								<input
									type="text"
									className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									value={pageRanges}
									onChange={(e) => setPageRanges(e.target.value)}
									placeholder="1-3,5,7-9"
								/>
								<p className="mt-2 text-xs text-indigo-500">
									Leave empty to include all pages
								</p>
							</div>
						)}

						{errorMessage && (
							<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
								{errorMessage}
							</div>
						)}

						<button
							className={`mt-auto py-3 px-4 rounded-lg text-center font-medium transition-colors w-full shadow-md ${
								selectedInputFile && !isConverting
									? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}
							onClick={handleConvert}
							disabled={!selectedInputFile || isConverting}
						>
							{isConverting ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Converting...
								</div>
							) : (
								"Convert Now"
							)}
						</button>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
						<h2 className="text-lg font-medium mb-4 bg-indigo-50 text-indigo-800 rounded-md p-2 w-full text-center">
							Output File
						</h2>
						<div className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 bg-indigo-50 border-indigo-200">
							{showConversionComplete ? (
								<div className="text-center">
									<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<Check className="w-8 h-8 text-green-600" />
									</div>
									<p className="text-lg font-medium text-green-600">
										Conversion Complete!
									</p>
									<p className="text-sm text-gray-500 mb-4">
										Your file is ready to download
									</p>
									<button
										onClick={handleDownload}
										className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center cursor-pointer transition-colors shadow-md"
									>
										<Download size={18} className="mr-1" />
										Download File
									</button>
								</div>
							) : isConverting ? (
								<div className="flex flex-col items-center justify-center text-center">
									<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
									<p className="text-indigo-500">Converting your file...</p>
									<p className="text-xs text-indigo-400 mt-2">
										This may take a moment
									</p>
								</div>
							) : (
								<div className="text-center">
									<FileIcon
										size={48}
										className="mx-auto text-indigo-300 mb-2"
									/>
									<p className="text-indigo-500">
										Output preview will appear here
									</p>
									<p className="text-xs text-indigo-400 mt-2">
										Convert a file to see the result
									</p>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="mt-16">
					<h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
						Why Choose ConvertPro?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
								<Zap size={24} className="text-indigo-600" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-800">
								Lightning Fast
							</h3>
							<p className="text-gray-600">
								Our optimized conversion engine delivers your files in seconds,
								not minutes. Save time with our high-performance system.
							</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
								<Shield size={24} className="text-indigo-600" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-800">
								100% Secure
							</h3>
							<p className="text-gray-600">
								Your files are automatically deleted after conversion. We never
								share your data and use end-to-end encryption.
							</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
							<div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
								<Star size={24} className="text-indigo-600" />
							</div>
							<h3 className="text-xl font-bold mb-2 text-gray-800">
								High Quality
							</h3>
							<p className="text-gray-600">
								We preserve the quality of your files during conversion,
								ensuring your documents, images, and media look perfect.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-16 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-8 shadow-xl">
					<div className="md:flex md:items-center">
						<div className="md:w-2/3">
							<h2 className="text-2xl font-bold text-white mb-4">
								Ready to convert your files?
							</h2>
							<p className="text-indigo-100 mb-6">
								Join thousands of satisfied users who trust ConvertPro for their
								file conversion needs. No registration required to get started.
							</p>
						</div>
						<div className="md:w-1/3 md:text-right mt-4 md:mt-0">
							<button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-md cursor-pointer">
								Start Converting Now
							</button>
						</div>
					</div>
				</div>
			</main>

			<div className="bg-indigo-50 py-12 mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
						What Our Users Say
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-6 rounded-xl shadow-md">
							<div className="flex items-center mb-4">
								<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<User size={20} className="text-indigo-600" />
								</div>
								<div className="ml-4">
									<h3 className="font-medium text-gray-800">Sarah K.</h3>
									<div className="flex text-yellow-400">
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
									</div>
								</div>
							</div>
							<p className="text-gray-600 italic">
								"This converter is a lifesaver! I needed to convert a large PDF
								to Word and it maintained all the formatting perfectly."
							</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-md">
							<div className="flex items-center mb-4">
								<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<User size={20} className="text-indigo-600" />
								</div>
								<div className="ml-4">
									<h3 className="font-medium text-gray-800">Michael T.</h3>
									<div className="flex text-yellow-400">
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
									</div>
								</div>
							</div>
							<p className="text-gray-600 italic">
								"Super fast and easy to use. Converted my images to SVG for a
								project in seconds. Will definitely use again!"
							</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-md">
							<div className="flex items-center mb-4">
								<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<User size={20} className="text-indigo-600" />
								</div>
								<div className="ml-4">
									<h3 className="font-medium text-gray-800">Jennifer L.</h3>
									<div className="flex text-yellow-400">
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
										<Star size={16} />
									</div>
								</div>
							</div>
							<p className="text-gray-600 italic">
								"I've tried many online converters and this is by far the best.
								Clean interface, no ads, and excellent quality output."
							</p>
						</div>
					</div>
				</div>
			</div>

			<footer className="bg-indigo-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<FileIcon className="h-8 w-8 text-indigo-300" />
								<span className="ml-2 text-2xl font-bold">ConvertPro</span>
							</div>
							<p className="text-indigo-200 mb-4">
								The ultimate file conversion tool for professionals and everyday
								users.
							</p>
							<div className="flex space-x-4">
								<a
									href="#"
									className="text-indigo-300 hover:text-white transition-colors"
								>
									<span className="sr-only">Facebook</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-indigo-300 hover:text-white transition-colors"
								>
									<span className="sr-only">Twitter</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</a>
								<a
									href="#"
									className="text-indigo-300 hover:text-white transition-colors"
								>
									<span className="sr-only">Instagram</span>
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Pricing
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Support
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Contact
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">File Types</h3>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										PDF Converter
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Word Converter
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Image Converter
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Audio Converter
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-indigo-200 hover:text-white transition-colors"
									>
										Video Converter
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-4">Newsletter</h3>
							<p className="text-indigo-200 mb-4">
								Subscribe to our newsletter for tips, new features, and
								exclusive offers.
							</p>
							<form className="flex">
								<input
									type="email"
									placeholder="Your email"
									className="px-4 py-2 rounded-l-lg flex-grow focus:outline-none text-gray-800"
								/>
								<button
									type="submit"
									className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-500 transition-colors"
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>
					<div className="border-t border-indigo-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-indigo-200 text-sm">
							© {new Date().getFullYear()} ConvertPro. All rights reserved.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							<a
								href="#"
								className="text-indigo-200 hover:text-white transition-colors text-sm"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="text-indigo-200 hover:text-white transition-colors text-sm"
							>
								Terms of Service
							</a>
							<a
								href="#"
								className="text-indigo-200 hover:text-white transition-colors text-sm"
							>
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
