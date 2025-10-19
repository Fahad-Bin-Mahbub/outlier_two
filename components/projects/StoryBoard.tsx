"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
	X,
	Plus,
	Download,
	Type,
	Move,
	Layers,
	Grid,
	Trash2,
	Copy,
	Eye,
	EyeOff,
	Lock,
	Unlock,
	ZoomIn,
	ZoomOut,
	HelpCircle,
	Upload,
	ImageIcon,
	Undo2,
	Edit3,
	Settings,
	FileText,
	Menu,
	FileImage,
	MoreHorizontal,
} from "lucide-react";

interface Panel {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	aspectRatio: string;
	aspectLocked: boolean;
	imageUrl?: string;
	shapes: Shape[];
	texts: TextElement[];
	zIndex: number;
	visible: boolean;
	locked: boolean;
	layerId: string;
	backgroundColor?: string;
}

interface Shape {
	id: string;
	type: "rectangle" | "circle" | "line";
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	strokeWidth: number;
}

interface TextElement {
	id: string;
	x: number;
	y: number;
	text: string;
	fontSize: number;
	color: string;
	fontFamily: string;
}

interface Layer {
	id: string;
	name: string;
	visible: boolean;
	locked: boolean;
	panels: string[];
	backgroundColor?: string;
}

interface HistoryState {
	panels: Panel[];
	layers: Layer[];
}

interface CollaborativeCursor {
	id: string;
	x: number;
	y: number;
	name: string;
	color: string;
	lastSeen: number;
	targetX: number;
	targetY: number;
}

const SAMPLE_IMAGES = [
	"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1611457194403-d3aca4cf9d11?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
	"https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=300&fit=crop",
];

const Toast: React.FC<{
	message: string;
	type: "success" | "error" | "info";
	onClose: () => void;
}> = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	const bgColor =
		type === "success"
			? "bg-[#2EC4B6]"
			: type === "error"
			? "bg-[#FF6B6B]"
			: "bg-[#334155]";

	return (
		<div
			className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-[#F8FAFC] px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 animate-in slide-in-from-top-2 duration-300 max-w-xs md:max-w-md`}
		>
			<div className="flex items-center justify-center">
				<span className="text-sm font-medium text-center">{message}</span>
			</div>
		</div>
	);
};

const InstructionsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
				onClick={onClose}
			/>
			<div className="relative bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-[#334155]/10">
				<div className="p-3 md:p-8">
					<div className="flex items-center justify-center mb-6">
						<h2 className="text-xl md:text-2xl font-bold text-[#334155] text-center">
							Welcome to Comic Storyboard Studio
						</h2>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[#334155] text-left lg:text-left">
						<div>
							<h3 className="text-lg font-semibold mb-3 text-[#FF6B6B] text-center lg:text-left">
								Getting Started
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									• <strong>Create</strong> panels by clicking "Add Panel"
								</li>
								<li>
									• <strong>Drag</strong> sample images to canvas
								</li>
								<li>
									• <strong>Resize</strong> panels with corner handles
								</li>
								<li>
									• <strong>Use</strong> drawing tools for annotations
								</li>
								<li>
									• <strong>Organize</strong> with layers
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-3 text-[#2EC4B6] text-center lg:text-left">
								Tools & Features
							</h3>
							<ul className="space-y-2 text-sm">
								<li>
									• <strong>Move:</strong> Select and move panels
								</li>
								<li>
									• <strong>Text:</strong> Click to add text at specific
									location
								</li>
								<li>
									• <strong>Edit Text:</strong> Double-click text to edit
								</li>
								<li>
									• <strong>Delete Text:</strong> Select text and press Delete
								</li>
								<li>
									• <strong>Layers:</strong> Organize panel elements
								</li>
								<li>
									• <strong>Export:</strong> Save as SVG or PNG
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-6 text-left lg:text-left">
						<h3 className="text-lg font-semibold mb-3 text-[#2EC4B6] text-center lg:text-left">
							Mobile Tips
						</h3>
						<div className="space-y-2 text-sm text-[#334155]">
							<li>
								<strong>Tap</strong> and hold to access panel options
							</li>
							<li>
								<strong>Swipe</strong> left/right to navigate tools
							</li>
							<li>
								<strong>Pinch</strong> to zoom in/out on canvas
							</li>
							<li>
								<strong>Use</strong> hamburger menu for layers
							</li>
						</div>
					</div>

					<div className="mt-8 flex justify-center">
						<button
							onClick={onClose}
							className="bg-[#2EC4B6] text-[#F8FAFC] px-6 py-2 rounded-lg hover:bg-[#2EC4B6]/90 transition-colors font-medium cursor-pointer"
						>
							Start Creating
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const PanelCreationModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onCreatePanel: (aspectRatio: string, imageUrl?: string) => void;
}> = ({ isOpen, onClose, onCreatePanel }) => {
	const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9");
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const aspectRatios = [
		{ name: "16:9", ratio: 16 / 9, label: "Widescreen" },
		{ name: "4:3", ratio: 4 / 3, label: "Standard" },
		{ name: "1:1", ratio: 1, label: "Square" },
		{ name: "3:4", ratio: 3 / 4, label: "Portrait" },
		{ name: "21:9", ratio: 21 / 9, label: "Cinematic" },
	];

	if (!isOpen) return null;

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setSelectedImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCreate = () => {
		onCreatePanel(selectedAspectRatio, selectedImage || undefined);
		setSelectedImage(null);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
				onClick={onClose}
			/>
			<div className="relative bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#334155]/10">
				<div className="p-4 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl md:text-2xl font-bold text-[#334155]">
							Create New Comic Panel
						</h2>
						<button
							onClick={onClose}
							className="text-[#334155]/60 hover:text-[#334155] transition-colors cursor-pointer"
						>
							<X size={24} />
						</button>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-4 text-[#334155]">
								Choose Aspect Ratio
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-2 gap-3">
								{aspectRatios.map((ratio) => (
									<button
										key={ratio.name}
										onClick={() => setSelectedAspectRatio(ratio.name)}
										className={`p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer ${
											selectedAspectRatio === ratio.name
												? "border-[#2EC4B6] bg-[#2EC4B6]/10"
												: "border-[#334155]/20 hover:border-[#334155]/40"
										}`}
									>
										<div
											className="w-full bg-[#334155]/10 rounded mb-2"
											style={{ aspectRatio: ratio.ratio, height: "30px" }}
										/>
										<div className="text-sm font-medium text-[#334155]">
											{ratio.name}
										</div>
										<div className="text-xs text-[#334155]/60">
											{ratio.label}
										</div>
									</button>
								))}
							</div>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-4 text-[#334155]">
								Add Background Image
							</h3>

							<button
								onClick={() => fileInputRef.current?.click()}
								className="w-full p-4 border-2 border-dashed border-[#2EC4B6] rounded-lg hover:bg-[#2EC4B6]/5 transition-colors mb-4 cursor-pointer"
							>
								<Upload size={24} className="mx-auto mb-2 text-[#2EC4B6]" />
								<div className="text-sm font-medium text-[#334155]">
									Upload Your Image
								</div>
								<div className="text-xs text-[#334155]/60">
									PNG, JPG up to 10MB
								</div>
							</button>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="hidden"
							/>

							<div className="mb-4">
								<div className="text-sm font-medium text-[#334155] mb-2">
									Or choose from samples:
								</div>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
									{SAMPLE_IMAGES.slice(0, 6).map((imageUrl, index) => (
										<button
											key={index}
											onClick={() => setSelectedImage(imageUrl)}
											className={`aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
												selectedImage === imageUrl
													? "border-[#2EC4B6]"
													: "border-[#334155]/20 hover:border-[#334155]/40"
											}`}
										>
											<img
												src={imageUrl || "/placeholder.svg"}
												alt={`Sample ${index + 1}`}
												className="w-full h-full object-cover"
											/>
										</button>
									))}
								</div>
							</div>

							{selectedImage && (
								<div className="border border-[#334155]/20 rounded-lg p-2">
									<div className="text-sm font-medium text-[#334155] mb-2">
										Selected Image:
									</div>
									<img
										src={selectedImage || "/placeholder.svg"}
										alt="Selected"
										className="w-full h-32 object-cover rounded"
									/>
									<button
										onClick={() => setSelectedImage(null)}
										className="mt-2 text-xs text-[#FF6B6B] hover:text-[#FF6B6B]/80 cursor-pointer"
									>
										Remove Image
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-end gap-3">
						<button
							onClick={onClose}
							className="px-6 py-2 text-[#334155] border border-[#334155]/20 rounded-lg hover:bg-[#334155]/5 transition-colors cursor-pointer order-2 md:order-1"
						>
							Cancel
						</button>
						<button
							onClick={handleCreate}
							className="bg-[#2EC4B6] text-[#F8FAFC] px-6 py-2 rounded-lg hover:bg-[#2EC4B6]/90 transition-colors font-medium cursor-pointer order-1 md:order-2"
						>
							Create Panel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ComicPanelLibraryModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onSelectPanel: (imageUrl: string, aspectRatio: string) => void;
}> = ({ isOpen, onClose, onSelectPanel }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

	if (!isOpen) return null;

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const result = e.target?.result as string;
					setUploadedImages((prev) => [...prev, result]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
				onClick={onClose}
			/>
			<div className="relative bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-[#334155]/10">
				<div className="p-4 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl md:text-2xl font-bold text-[#334155]">
							Comic Panel Library
						</h2>
						<button
							onClick={onClose}
							className="text-[#334155]/60 hover:text-[#334155] transition-colors cursor-pointer"
						>
							<X size={24} />
						</button>
					</div>

					<div className="mb-8">
						<button
							onClick={() => fileInputRef.current?.click()}
							className="w-full p-4 md:p-6 border-2 border-dashed border-[#2EC4B6] rounded-lg hover:bg-[#2EC4B6]/5 transition-colors cursor-pointer"
						>
							<Upload size={32} className="mx-auto mb-3 text-[#2EC4B6]" />
							<div className="text-base font-medium text-[#334155]">
								Upload Your Comic Panels
							</div>
							<div className="text-sm text-[#334155]/60">
								PNG, JPG up to 10MB
							</div>
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							onChange={handleFileUpload}
							className="hidden"
						/>
					</div>

					{uploadedImages.length > 0 && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold mb-3 text-[#334155]">
								Your Uploads
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{uploadedImages.map((image, index) => (
									<div
										key={`upload-${index}`}
										className="aspect-video bg-white rounded-lg overflow-hidden border border-[#334155]/20 hover:border-[#2EC4B6] transition-all cursor-pointer"
										onClick={() => onSelectPanel(image, "16:9")}
									>
										<img
											src={image || "/placeholder.svg"}
											alt={`Upload ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
						</div>
					)}

					<div>
						<h3 className="text-lg font-semibold mb-3 text-[#334155]">
							Sample Comic Panels
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{SAMPLE_IMAGES.map((image, index) => (
								<div
									key={`sample-${index}`}
									className="aspect-video bg-white rounded-lg overflow-hidden border border-[#334155]/20 hover:border-[#2EC4B6] transition-all cursor-pointer"
									onClick={() => onSelectPanel(image, "16:9")}
								>
									<img
										src={image || "/placeholder.svg"}
										alt={`Sample ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const LayerModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	layer: Layer | null;
	onUpdateLayer: (layer: Layer) => void;
}> = ({ isOpen, onClose, layer, onUpdateLayer }) => {
	const [name, setName] = useState("");
	const [backgroundColor, setBackgroundColor] = useState("#F8FAFC");

	useEffect(() => {
		if (layer) {
			setName(layer.name);
			setBackgroundColor(layer.backgroundColor || "#F8FAFC");
		}
	}, [layer]);

	if (!isOpen || !layer) return null;

	const handleSave = () => {
		onUpdateLayer({
			...layer,
			name,
			backgroundColor,
		});
		onClose();
	};

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
				onClick={onClose}
			/>
			<div className="relative bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-md border border-[#334155]/10">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-[#334155]">Edit Layer</h2>
						<button
							onClick={onClose}
							className="text-[#334155]/60 hover:text-[#334155] transition-colors cursor-pointer"
						>
							<X size={20} />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#334155] mb-2">
								Layer Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 border border-[#334155]/20 rounded-lg focus:border-[#2EC4B6] focus:outline-none"
								placeholder="Enter layer name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-[#334155] mb-2">
								Background Color
							</label>
							<div className="flex gap-2">
								<input
									type="color"
									value={backgroundColor}
									onChange={(e) => setBackgroundColor(e.target.value)}
									className="w-12 h-10 border border-[#334155]/20 rounded cursor-pointer"
								/>
								<input
									type="text"
									value={backgroundColor}
									onChange={(e) => setBackgroundColor(e.target.value)}
									className="flex-1 px-3 py-2 border border-[#334155]/20 rounded-lg focus:border-[#2EC4B6] focus:outline-none"
									placeholder="#F8FAFC"
								/>
							</div>
						</div>
					</div>

					<div className="mt-6 flex flex-col md:flex-row justify-end gap-3">
						<button
							onClick={onClose}
							className="px-4 py-2 text-[#334155] border border-[#334155]/20 rounded-lg hover:bg-[#334155]/5 transition-colors cursor-pointer order-2 md:order-1"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							className="bg-[#2EC4B6] text-[#F8FAFC] px-4 py-2 rounded-lg hover:bg-[#2EC4B6]/90 transition-colors font-medium cursor-pointer order-1 md:order-2"
						>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const TextModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onAddText: (text: string, fontSize: number, color: string) => void;
	onUpdateText?: (text: string, fontSize: number, color: string) => void;
	editingText?: TextElement | null;
}> = ({ isOpen, onClose, onAddText, onUpdateText, editingText }) => {
	const [text, setText] = useState("");
	const [fontSize, setFontSize] = useState(16);
	const [color, setColor] = useState("#334155");

	useEffect(() => {
		if (editingText) {
			setText(editingText.text);
			setFontSize(editingText.fontSize);
			setColor(editingText.color);
		} else {
			setText("");
			setFontSize(16);
			setColor("#334155");
		}
	}, [editingText]);

	if (!isOpen) return null;

	const handleSubmit = () => {
		if (text.trim()) {
			if (editingText && onUpdateText) {
				onUpdateText(text, fontSize, color);
			} else {
				onAddText(text, fontSize, color);
			}
			setText("");
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
				onClick={onClose}
			/>
			<div className="relative bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-md border border-[#334155]/10">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-[#334155]">
							{editingText ? "Edit Text" : "Add Text Overlay"}
						</h2>
						<button
							onClick={onClose}
							className="text-[#334155]/60 hover:text-[#334155] transition-colors cursor-pointer"
						>
							<X size={20} />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-[#334155] mb-2">
								Text
							</label>
							<textarea
								value={text}
								onChange={(e) => setText(e.target.value)}
								className="w-full px-3 py-2 border border-[#334155]/20 rounded-lg focus:border-[#2EC4B6] focus:outline-none resize-none"
								rows={3}
								placeholder="Enter your text..."
								autoFocus
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-[#334155] mb-2">
									Font Size
								</label>
								<input
									type="number"
									value={fontSize}
									onChange={(e) => setFontSize(Number(e.target.value))}
									className="w-full px-3 py-2 border border-[#334155]/20 rounded-lg focus:border-[#2EC4B6] focus:outline-none"
									min="8"
									max="72"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-[#334155] mb-2">
									Color
								</label>
								<input
									type="color"
									value={color}
									onChange={(e) => setColor(e.target.value)}
									className="w-full h-10 border border-[#334155]/20 rounded-lg cursor-pointer"
								/>
							</div>
						</div>
					</div>

					<div className="mt-6 flex flex-col md:flex-row justify-end gap-3">
						<button
							onClick={onClose}
							className="px-4 py-2 text-[#334155] border border-[#334155]/20 rounded-lg hover:bg-[#334155]/5 transition-colors cursor-pointer order-2 md:order-1"
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="bg-[#2EC4B6] text-[#F8FAFC] px-4 py-2 rounded-lg hover:bg-[#2EC4B6]/90 transition-colors font-medium cursor-pointer order-1 md:order-2"
						>
							{editingText ? "Update Text" : "Add Text"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const TextContextMenu: React.FC<{
	isOpen: boolean;
	x: number;
	y: number;
	onEdit: () => void;
	onDelete: () => void;
	onClose: () => void;
}> = ({ isOpen, x, y, onEdit, onDelete, onClose }) => {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			ref={menuRef}
			className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#334155]/20 py-2 min-w-[120px]"
			style={{ left: x, top: y }}
		>
			<button
				onClick={onEdit}
				className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-[#2EC4B6]/10 transition-colors flex items-center gap-2"
			>
				<Edit3 size={14} />
				Edit Text
			</button>
			<button
				onClick={onDelete}
				className="w-full px-4 py-2 text-left text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors flex items-center gap-2"
			>
				<Trash2 size={14} />
				Delete Text
			</button>
		</div>
	);
};

const StoryboardApp: React.FC = () => {
	const [panels, setPanels] = useState<Panel[]>([]);
	const [layers, setLayers] = useState<Layer[]>([
		{
			id: "layer-1",
			name: "Background",
			visible: true,
			locked: false,
			panels: [],
			backgroundColor: "#F8FAFC",
		},
		{
			id: "layer-2",
			name: "Main",
			visible: true,
			locked: false,
			panels: [],
			backgroundColor: "transparent",
		},
	]);
	const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
	const [selectedTool, setSelectedTool] = useState<"move" | "text">("move");
	const [selectedText, setSelectedText] = useState<{
		panelId: string;
		textId: string;
	} | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
	const [showInstructions, setShowInstructions] = useState(true);
	const [showPanelCreation, setShowPanelCreation] = useState(false);
	const [showComicPanelLibrary, setShowComicPanelLibrary] = useState(false);
	const [showLayerModal, setShowLayerModal] = useState(false);
	const [selectedLayerForEdit, setSelectedLayerForEdit] =
		useState<Layer | null>(null);
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error" | "info";
	} | null>(null);
	const [selectedLayer, setSelectedLayer] = useState("layer-2");
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentShape, setCurrentShape] = useState<Shape | null>(null);
	const [history, setHistory] = useState<HistoryState[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [showTextModal, setShowTextModal] = useState(false);
	const [pendingTextPosition, setPendingTextPosition] = useState<{
		x: number;
		y: number;
		panelId: string;
	} | null>(null);
	const [editingText, setEditingText] = useState<TextElement | null>(null);
	const [textContextMenu, setTextContextMenu] = useState<{
		isOpen: boolean;
		x: number;
		y: number;
		textId: string;
		panelId: string;
	}>({
		isOpen: false,
		x: 0,
		y: 0,
		textId: "",
		panelId: "",
	});
	const [isResizing, setIsResizing] = useState(false);
	const [resizeDirection, setResizeDirection] = useState("");
	const [resizeStartData, setResizeStartData] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});
	const [isDraggingElement, setIsDraggingElement] = useState(false);
	const [draggedElement, setDraggedElement] = useState<{
		type: "shape" | "text";
		id: string;
		panelId: string;
	} | null>(null);
	const [showMobileTools, setShowMobileTools] = useState(false);
	const [showMobileSidebar, setShowMobileSidebar] = useState(false);
	const [collaborativeCursors, setCollaborativeCursors] = useState<
		CollaborativeCursor[]
	>([]);
	const [showMobileActions, setShowMobileActions] = useState<string | null>(
		null
	);
	const canvasRef = useRef<HTMLDivElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const sequencePreviewRef = useRef<HTMLDivElement>(null);

	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });

	const showToast = useCallback(
		(message: string, type: "success" | "error" | "info" = "info") => {
			setToast({ message, type });
		},
		[]
	);

	const aspectRatios = [
		{ name: "16:9", ratio: 16 / 9, label: "Widescreen" },
		{ name: "4:3", ratio: 4 / 3, label: "Standard" },
		{ name: "1:1", ratio: 1, label: "Square" },
		{ name: "3:4", ratio: 3 / 4, label: "Portrait" },
		{ name: "21:9", ratio: 21 / 9, label: "Cinematic" },
	];

	useEffect(() => {
		const savedData = localStorage.getItem("storyboard-data");
		if (savedData) {
			try {
				const { panels: savedPanels, layers: savedLayers } =
					JSON.parse(savedData);
				setPanels(savedPanels || []);
				setLayers(
					savedLayers || [
						{
							id: "layer-1",
							name: "Background",
							visible: true,
							locked: false,
							panels: [],
							backgroundColor: "#F8FAFC",
						},
						{
							id: "layer-2",
							name: "Main",
							visible: true,
							locked: false,
							panels: [],
							backgroundColor: "transparent",
						},
					]
				);
			} catch (error) {}
		}
	}, []);

	useEffect(() => {
		const dataToSave = { panels, layers };
		localStorage.setItem("storyboard-data", JSON.stringify(dataToSave));
	}, [panels, layers]);

	const saveToHistory = useCallback(() => {
		const currentState: HistoryState = {
			panels: [...panels],
			layers: [...layers],
		};

		if (historyIndex !== history.length - 1) {
			setHistory((prev) => [...prev.slice(0, historyIndex + 1), currentState]);
		} else {
			setHistory((prev) => [...prev, currentState]);
		}
		setHistoryIndex((prev) => prev + 1);
	}, [panels, layers, history, historyIndex]);

	const undo = useCallback(() => {
		if (historyIndex > 0) {
			const prevState = history[historyIndex - 1];
			setPanels(prevState.panels);
			setLayers(prevState.layers);
			setHistoryIndex((prev) => prev - 1);
			showToast("Undo successful", "info");
		} else {
			showToast("Nothing to undo", "info");
		}
	}, [history, historyIndex, showToast]);

	const createPanel = (aspectRatio = "16:9", imageUrl?: string) => {
		const ratio =
			aspectRatios.find((ar) => ar.name === aspectRatio)?.ratio || 16 / 9;
		const baseWidth = window.innerWidth < 768 ? 150 : 200;
		const height = baseWidth / ratio;

		const canvasContainer = canvasContainerRef.current;
		let x = 50 + panels.length * 15;
		let y = 50 + panels.length * 15;

		if (canvasContainer) {
			const containerWidth = canvasContainer.clientWidth;
			const containerHeight = canvasContainer.clientHeight;

			x = Math.min(x, containerWidth - baseWidth - 50);
			y = Math.min(y, containerHeight - height - 50);
		}

		const selectedLayerObj = layers.find((l) => l.id === selectedLayer);
		const backgroundColor = selectedLayerObj?.backgroundColor || "transparent";

		const newPanel: Panel = {
			id: `panel-${Date.now()}`,
			x,
			y,
			width: baseWidth,
			height,
			aspectRatio,
			aspectLocked: true,
			imageUrl,
			shapes: [],
			texts: [],
			zIndex: panels.length,
			visible: true,
			locked: false,
			layerId: selectedLayer,
			backgroundColor:
				backgroundColor === "transparent" ? undefined : backgroundColor + "10",
		};

		setPanels((prev) => [...prev, newPanel]);
		setSelectedPanel(newPanel.id);

		setLayers((prev) =>
			prev.map((layer) =>
				layer.id === selectedLayer
					? { ...layer, panels: [...layer.panels, newPanel.id] }
					: layer
			)
		);

		saveToHistory();
		showToast(
			`Comic panel created with ${aspectRatio} aspect ratio`,
			"success"
		);
	};

	const handlePanelClick = (e: React.MouseEvent, panelId: string) => {
		e.preventDefault();
		e.stopPropagation();

		setTextContextMenu({ isOpen: false, x: 0, y: 0, textId: "", panelId: "" });

		if (selectedTool === "text") {
			const panel = panels.find((p) => p.id === panelId);
			if (!panel || panel.locked) return;

			const panelElement = e.currentTarget;
			const panelRect = panelElement.getBoundingClientRect();

			const x = (e.clientX - panelRect.left) / zoom;
			const y = (e.clientY - panelRect.top) / zoom;

			if (x >= 0 && x <= panel.width && y >= 0 && y <= panel.height) {
				setPendingTextPosition({ x, y, panelId });
				setEditingText(null);
				setShowTextModal(true);
			}
		} else if (selectedTool === "move") {
			setSelectedPanel(panelId);
		}
	};

	const handlePanelMouseDown = (e: React.MouseEvent, panelId: string) => {
		e.preventDefault();
		if (selectedTool !== "move") return;

		const panel = panels.find((p) => p.id === panelId);
		if (!panel || panel.locked) return;

		setSelectedPanel(panelId);
		setIsDragging(true);

		const rect = e.currentTarget.getBoundingClientRect();
		setDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});

		e.currentTarget.style.transition = "none";
	};

	const handleTouchStart = (e: React.TouchEvent, panelId: string) => {
		if (selectedTool !== "move") return;

		const panel = panels.find((p) => p.id === panelId);
		if (!panel || panel.locked) return;

		setSelectedPanel(panelId);
		setIsDragging(true);

		const touch = e.touches[0];
		const rect = e.currentTarget.getBoundingClientRect();
		setDragOffset({
			x: touch.clientX - rect.left,
			y: touch.clientY - rect.top,
		});
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (isResizing && selectedPanel && resizeDirection) {
				const panel = panels.find((p) => p.id === selectedPanel);
				if (!panel) return;

				const deltaX = e.clientX - resizeStartData.x;
				const deltaY = e.clientY - resizeStartData.y;

				let newWidth = resizeStartData.width;
				let newHeight = resizeStartData.height;

				if (resizeDirection.includes("e")) {
					newWidth = Math.max(50, resizeStartData.width + deltaX / zoom);
				}
				if (resizeDirection.includes("s")) {
					newHeight = Math.max(30, resizeStartData.height + deltaY / zoom);
				}

				if (panel.aspectLocked) {
					const ratio =
						aspectRatios.find((ar) => ar.name === panel.aspectRatio)?.ratio ||
						16 / 9;
					if (resizeDirection.includes("e")) {
						newHeight = newWidth / ratio;
					} else if (resizeDirection.includes("s")) {
						newWidth = newHeight * ratio;
					}
				}

				setPanels((prev) =>
					prev.map((p) =>
						p.id === selectedPanel
							? { ...p, width: newWidth, height: newHeight }
							: p
					)
				);
				return;
			}
			if (isDraggingElement && draggedElement) {
				const panelElement = document.querySelector(
					`[data-panel-id="${draggedElement.panelId}"]`
				) as HTMLElement;

				if (!panelElement) return;

				const panelRect = panelElement.getBoundingClientRect();
				const newX = (e.clientX - panelRect.left - dragOffset.x) / zoom;
				const newY = (e.clientY - panelRect.top - dragOffset.y) / zoom;

				if (draggedElement.type === "text") {
					setPanels((prev) =>
						prev.map((panel) =>
							panel.id === draggedElement.panelId
								? {
										...panel,
										texts: panel.texts.map((text) =>
											text.id === draggedElement.id
												? {
														...text,
														x: Math.max(0, newX),
														y: Math.max(0, newY),
												  }
												: text
										),
								  }
								: panel
						)
					);
				} else if (draggedElement.type === "shape") {
					setPanels((prev) =>
						prev.map((panel) =>
							panel.id === draggedElement.panelId
								? {
										...panel,
										shapes: panel.shapes.map((shape) =>
											shape.id === draggedElement.id
												? {
														...shape,
														x: Math.max(0, newX),
														y: Math.max(0, newY),
												  }
												: shape
										),
								  }
								: panel
						)
					);
				}
				return;
			}

			if (!isDragging || !selectedPanel) return;

			const canvas = canvasRef.current;
			const canvasContainer = canvasContainerRef.current;
			if (!canvas || !canvasContainer) return;

			const canvasRect = canvas.getBoundingClientRect();
			const containerRect = canvasContainer.getBoundingClientRect();

			let newX = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
			let newY = (e.clientY - canvasRect.top - dragOffset.y) / zoom;

			const panel = panels.find((p) => p.id === selectedPanel);
			if (!panel) return;

			const containerWidth = containerRect.width / zoom;
			const containerHeight = containerRect.height / zoom;

			newX = Math.max(0, Math.min(newX, containerWidth - panel.width));
			newY = Math.max(0, Math.min(newY, containerHeight - panel.height));

			setPanels((prev) =>
				prev.map((panel) =>
					panel.id === selectedPanel ? { ...panel, x: newX, y: newY } : panel
				)
			);
		},
		[
			isDragging,
			selectedPanel,
			dragOffset,
			zoom,
			panels,
			isResizing,
			resizeDirection,
			resizeStartData,
			aspectRatios,
			isDraggingElement,
			draggedElement,
		]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent) => {
			if (!isDragging || !selectedPanel) return;

			e.preventDefault();
			const touch = e.touches[0];
			const canvas = canvasRef.current;
			const canvasContainer = canvasContainerRef.current;
			if (!canvas || !canvasContainer) return;

			const canvasRect = canvas.getBoundingClientRect();
			const containerRect = canvasContainer.getBoundingClientRect();

			let newX = (touch.clientX - canvasRect.left - dragOffset.x) / zoom;
			let newY = (touch.clientY - canvasRect.top - dragOffset.y) / zoom;

			const panel = panels.find((p) => p.id === selectedPanel);
			if (!panel) return;

			const containerWidth = containerRect.width / zoom;
			const containerHeight = containerRect.height / zoom;

			newX = Math.max(0, Math.min(newX, containerWidth - panel.width));
			newY = Math.max(0, Math.min(newY, containerHeight - panel.height));

			setPanels((prev) =>
				prev.map((panel) =>
					panel.id === selectedPanel ? { ...panel, x: newX, y: newY } : panel
				)
			);
		},
		[isDragging, selectedPanel, dragOffset, zoom, panels]
	);

	const handleMouseUp = useCallback(() => {
		if (isDragging) {
			const panelElement = document.querySelector(
				`[data-panel-id="${selectedPanel}"]`
			) as HTMLElement;
			if (panelElement) {
				panelElement.style.transition = "all 0.2s ease-out";
			}
			saveToHistory();
		}
		if (isResizing) {
			saveToHistory();
		}
		if (isDraggingElement) {
			saveToHistory();
		}

		setIsDragging(false);
		setIsResizing(false);
		setResizeDirection("");
		setIsDraggingElement(false);
		setDraggedElement(null);
		setIsDrawing(false);

		if (currentShape && selectedPanel) {
			setPanels((prev) =>
				prev.map((panel) =>
					panel.id === selectedPanel &&
					currentShape.width !== 0 &&
					currentShape.height !== 0
						? { ...panel, shapes: [...panel.shapes, currentShape] }
						: panel
				)
			);
			saveToHistory();
		}
		setCurrentShape(null);
	}, [
		isDragging,
		selectedPanel,
		currentShape,
		saveToHistory,
		isResizing,
		isDraggingElement,
	]);
	const handleCanvasMouseDown = (e: React.MouseEvent) => {
		if (selectedTool === "move" || !selectedPanel) return;

		const panel = panels.find((p) => p.id === selectedPanel);
		if (!panel) return;

		const panelElement = document.querySelector(
			`[data-panel-id="${selectedPanel}"]`
		) as HTMLElement;
		if (!panelElement) return;

		const panelRect = panelElement.getBoundingClientRect();

		const x = (e.clientX - panelRect.left) / zoom;
		const y = (e.clientY - panelRect.top) / zoom;

		if (x >= 0 && x <= panel.width && y >= 0 && y <= panel.height) {
			setIsDrawing(true);
			const newShape: Shape = {
				id: `shape-${Date.now()}`,
				type: selectedTool as "rectangle" | "circle",
				x,
				y,
				width: 0,
				height: 0,
				color: "#FF6B6B",
				strokeWidth: 2,
			};
			setCurrentShape(newShape);
		}
	};

	const handleCanvasMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDrawing || !currentShape || !selectedPanel) return;

			const panelElement = document.querySelector(
				`[data-panel-id="${selectedPanel}"]`
			) as HTMLElement;
			if (!panelElement) return;

			const panelRect = panelElement.getBoundingClientRect();

			const currentX = (e.clientX - panelRect.left) / zoom;
			const currentY = (e.clientY - panelRect.top) / zoom;

			const width = currentX - currentShape.x;
			const height = currentY - currentShape.y;

			setCurrentShape({
				...currentShape,
				width,
				height,
			});
		},
		[isDrawing, currentShape, selectedPanel, zoom]
	);

	const handleCanvasMouseUp = useCallback(() => {
		if (isDrawing && currentShape && selectedPanel) {
			if (
				Math.abs(currentShape.width) > 5 &&
				Math.abs(currentShape.height) > 5
			) {
				setPanels((prev) =>
					prev.map((panel) =>
						panel.id === selectedPanel
							? { ...panel, shapes: [...panel.shapes, currentShape] }
							: panel
					)
				);
				showToast(
					`${
						currentShape.type.charAt(0).toUpperCase() +
						currentShape.type.slice(1)
					} added to panel`,
					"success"
				);
				saveToHistory();
			}
		}
		setIsDrawing(false);
		setCurrentShape(null);
	}, [isDrawing, currentShape, selectedPanel, showToast, saveToHistory]);

	useEffect(() => {
		if (history.length === 0) {
			saveToHistory();
		}
	}, [history.length, saveToHistory]);
	const handleTouchMoveElement = useCallback(
		(e: TouchEvent) => {
			if (!isDraggingElement || !draggedElement) return;

			e.preventDefault();
			const touch = e.touches[0];
			const panelElement = document.querySelector(
				`[data-panel-id="${draggedElement.panelId}"]`
			) as HTMLElement;

			if (!panelElement) return;

			const panelRect = panelElement.getBoundingClientRect();
			const newX = (touch.clientX - panelRect.left - dragOffset.x) / zoom;
			const newY = (touch.clientY - panelRect.top - dragOffset.y) / zoom;

			if (draggedElement.type === "text") {
				setPanels((prev) =>
					prev.map((panel) =>
						panel.id === draggedElement.panelId
							? {
									...panel,
									texts: panel.texts.map((text) =>
										text.id === draggedElement.id
											? { ...text, x: Math.max(0, newX), y: Math.max(0, newY) }
											: text
									),
							  }
							: panel
					)
				);
			}
		},
		[isDraggingElement, draggedElement, dragOffset, zoom]
	);
	useEffect(() => {
		if (isDragging || isResizing || isDraggingElement) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			document.addEventListener("touchmove", handleTouchMoveElement, {
				passive: false,
			});
			document.addEventListener("touchend", handleMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.removeEventListener("touchmove", handleTouchMove);
				document.removeEventListener("touchmove", handleTouchMoveElement);
				document.removeEventListener("touchend", handleMouseUp);
			};
		}
	}, [
		isDragging,
		isResizing,
		isDraggingElement,
		handleMouseMove,
		handleMouseUp,
		handleTouchMove,
		handleTouchMoveElement,
	]);

	useEffect(() => {
		if (isDrawing) {
			document.addEventListener("mousemove", handleCanvasMouseMove);
			document.addEventListener("mouseup", handleCanvasMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleCanvasMouseMove);
				document.removeEventListener("mouseup", handleCanvasMouseUp);
			};
		}
	}, [isDrawing, handleCanvasMouseMove, handleCanvasMouseUp]);

	const deletePanel = (panelId: string) => {
		setPanels((prev) => prev.filter((p) => p.id !== panelId));
		setLayers((prev) =>
			prev.map((layer) => ({
				...layer,
				panels: layer.panels.filter((id) => id !== panelId),
			}))
		);
		if (selectedPanel === panelId) {
			setSelectedPanel(null);
		}
		saveToHistory();
		showToast("Panel deleted", "info");
	};

	const deleteLayer = (layerId: string) => {
		const layerToDelete = layers.find((l) => l.id === layerId);
		if (!layerToDelete) return;

		layerToDelete.panels.forEach((panelId) => {
			setPanels((prev) => prev.filter((p) => p.id !== panelId));
		});

		setLayers((prev) => prev.filter((l) => l.id !== layerId));

		if (selectedLayer === layerId) {
			const remainingLayers = layers.filter((l) => l.id !== layerId);
			if (remainingLayers.length > 0) {
				setSelectedLayer(remainingLayers[0].id);
			}
		}

		saveToHistory();
		showToast(`Layer "${layerToDelete.name}" and its panels deleted`, "info");
	};

	const copyPanel = (panelId: string) => {
		const panel = panels.find((p) => p.id === panelId);
		if (!panel) return;

		const newPanel: Panel = {
			...panel,
			id: `panel-${Date.now()}`,
			x: panel.x + 20,
			y: panel.y + 20,
			zIndex: panels.length,
		};

		setPanels((prev) => [...prev, newPanel]);
		setLayers((prev) =>
			prev.map((layer) =>
				layer.id === panel.layerId
					? { ...layer, panels: [...layer.panels, newPanel.id] }
					: layer
			)
		);
		saveToHistory();
		showToast("Panel copied", "success");
	};

	const togglePanelVisibility = (panelId: string) => {
		setPanels((prev) =>
			prev.map((panel) =>
				panel.id === panelId ? { ...panel, visible: !panel.visible } : panel
			)
		);
		saveToHistory();
	};

	const togglePanelLock = (panelId: string) => {
		setPanels((prev) =>
			prev.map((panel) =>
				panel.id === panelId ? { ...panel, locked: !panel.locked } : panel
			)
		);
		saveToHistory();
	};

	const toggleAspectLock = (panelId: string) => {
		setPanels((prev) =>
			prev.map((panel) =>
				panel.id === panelId
					? { ...panel, aspectLocked: !panel.aspectLocked }
					: panel
			)
		);
		saveToHistory();
		const panel = panels.find((p) => p.id === panelId);
		if (panel) {
			showToast(
				`Aspect ratio ${panel.aspectLocked ? "unlocked" : "locked"}`,
				"info"
			);
		}
	};

	const updatePanelAspectRatio = (panelId: string, newAspectRatio: string) => {
		const panel = panels.find((p) => p.id === panelId);
		if (!panel) return;

		if (panel.aspectLocked) {
			showToast("Cannot change aspect ratio while locked", "error");
			return;
		}

		const ratio =
			aspectRatios.find((ar) => ar.name === newAspectRatio)?.ratio || 16 / 9;
		setPanels((prev) =>
			prev.map((p) =>
				p.id === panelId
					? { ...p, aspectRatio: newAspectRatio, height: p.width / ratio }
					: p
			)
		);
		saveToHistory();
	};

	const updatePanelSize = (
		panelId: string,
		dimension: "width" | "height",
		value: number
	) => {
		const panel = panels.find((p) => p.id === panelId);
		if (!panel) return;

		if (panel.aspectLocked) {
			const ratio =
				aspectRatios.find((ar) => ar.name === panel.aspectRatio)?.ratio ||
				16 / 9;
			if (dimension === "width") {
				setPanels((prev) =>
					prev.map((p) =>
						p.id === panelId ? { ...p, width: value, height: value / ratio } : p
					)
				);
			} else {
				setPanels((prev) =>
					prev.map((p) =>
						p.id === panelId ? { ...p, height: value, width: value * ratio } : p
					)
				);
			}
		} else {
			setPanels((prev) =>
				prev.map((p) => (p.id === panelId ? { ...p, [dimension]: value } : p))
			);
		}
	};

	const addText = (text: string, fontSize: number, color: string) => {
		if (pendingTextPosition) {
			const newText: TextElement = {
				id: `text-${Date.now()}`,
				x: pendingTextPosition.x,
				y: pendingTextPosition.y,
				text,
				fontSize,
				color,
				fontFamily: "Arial",
			};

			setPanels((prev) =>
				prev.map((panel) =>
					panel.id === pendingTextPosition.panelId
						? { ...panel, texts: [...panel.texts, newText] }
						: panel
				)
			);

			setPendingTextPosition(null);
			showToast("Text added to panel", "success");
			saveToHistory();
		}
	};

	const updateText = (text: string, fontSize: number, color: string) => {
		if (editingText && selectedText) {
			setPanels((prev) =>
				prev.map((panel) =>
					panel.id === selectedText.panelId
						? {
								...panel,
								texts: panel.texts.map((t) =>
									t.id === selectedText.textId
										? { ...t, text, fontSize, color }
										: t
								),
						  }
						: panel
				)
			);

			setEditingText(null);
			setSelectedText(null);
			showToast("Text updated", "success");
			saveToHistory();
		}
	};

	const deleteText = (panelId: string, textId: string) => {
		setPanels((prev) =>
			prev.map((panel) =>
				panel.id === panelId
					? { ...panel, texts: panel.texts.filter((t) => t.id !== textId) }
					: panel
			)
		);
		setSelectedText(null);
		showToast("Text deleted", "info");
		saveToHistory();
	};

	const handleTextDoubleClick = (
		e: React.MouseEvent,
		textElement: TextElement,
		panelId: string
	) => {
		e.stopPropagation();
		setEditingText(textElement);
		setSelectedText({ panelId, textId: textElement.id });
		setShowTextModal(true);
	};

	const handleTextRightClick = (
		e: React.MouseEvent,
		textElement: TextElement,
		panelId: string
	) => {
		e.preventDefault();
		e.stopPropagation();
		setTextContextMenu({
			isOpen: true,
			x: e.clientX,
			y: e.clientY,
			textId: textElement.id,
			panelId,
		});
	};

	const exportToSVG = async () => {
		try {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const svgContent = `
        <svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#F8FAFC"/>
          ${panels
						.filter((panel) => panel.visible)
						.map(
							(panel) => `
            <g>
              <rect x="${panel.x * zoom}" y="${panel.y * zoom}" 
                    width="${panel.width * zoom}" height="${
								panel.height * zoom
							}" 
                    fill="white" stroke="#334155" strokeWidth="2"/>
              ${
								panel.imageUrl
									? `<image x="${panel.x * zoom}" y="${panel.y * zoom}" 
                           width="${panel.width * zoom}" height="${
											panel.height * zoom
									  }" 
                           href="${panel.imageUrl}"/>`
									: ""
							}
              ${panel.shapes
								.map(
									(shape) => `
                <rect x="${panel.x * zoom + shape.x}" y="${
										panel.y * zoom + shape.y
									}" 
                      width="${shape.width}" height="${shape.height}" 
                      fill="none" stroke="${shape.color}" strokeWidth="${
										shape.strokeWidth
									}"/>
              `
								)
								.join("")}
              ${panel.texts
								.map(
									(text) => `
                <text x="${panel.x * zoom + text.x}" y="${
										panel.y * zoom + text.y
									}" 
                      fontSize="${text.fontSize}" fill="${text.color}" 
                      fontFamily="${text.fontFamily}">${text.text}</text>
              `
								)
								.join("")}
            </g>
          `
						)
						.join("")}
        </svg>
      `;

			const blob = new Blob([svgContent], { type: "image/svg+xml" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "comic-storyboard.svg";
			a.click();
			URL.revokeObjectURL(url);
			showToast("Comic storyboard exported as SVG!", "success");
		} catch (error) {
			showToast("SVG export failed. Please try again.", "error");
		}
	};

	const exportToPNG = async () => {
		try {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			canvas.width = 1440;
			canvas.height = 900;

			ctx.fillStyle = "#F8FAFC";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (const panel of panels.filter((p) => p.visible)) {
				const x = panel.x * zoom;
				const y = panel.y * zoom;
				const width = panel.width * zoom;
				const height = panel.height * zoom;

				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(x, y, width, height);

				if (panel.imageUrl) {
					const img = new Image();
					img.crossOrigin = "anonymous";
					await new Promise((resolve) => {
						img.onload = () => {
							ctx.drawImage(img, x, y, width, height);
							resolve(null);
						};
						img.src = panel.imageUrl!;
					});
				}

				ctx.strokeStyle = "#334155";
				ctx.lineWidth = 2;
				ctx.strokeRect(x, y, width, height);

				panel.shapes.forEach((shape) => {
					ctx.strokeStyle = shape.color;
					ctx.lineWidth = shape.strokeWidth;
					ctx.strokeRect(x + shape.x, y + shape.y, shape.width, shape.height);
				});

				panel.texts.forEach((text) => {
					ctx.fillStyle = text.color;
					ctx.font = `${text.fontSize}px ${text.fontFamily}`;
					ctx.fillText(text.text, x + text.x, y + text.y);
				});
			}

			canvas.toBlob((blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "comic-storyboard.png";
					a.click();
					URL.revokeObjectURL(url);
					showToast("Comic storyboard exported as PNG!", "success");
				}
			}, "image/png");
		} catch (error) {
			showToast("PNG export failed. Please try again.", "error");
		}
	};

	const handleCanvasPanStart = (e: React.MouseEvent) => {
		if (e.button === 1 || (e.button === 0 && e.altKey)) {
			setIsPanning(true);
			setPanStart({
				x: e.clientX - canvasOffset.x,
				y: e.clientY - canvasOffset.y,
			});
			e.preventDefault();
		}
	};

	const handleCanvasPanMove = useCallback(
		(e: MouseEvent) => {
			if (isPanning) {
				setCanvasOffset({
					x: e.clientX - panStart.x,
					y: e.clientY - panStart.y,
				});
			}
		},
		[isPanning, panStart]
	);

	const handleCanvasPanEnd = useCallback(() => {
		setIsPanning(false);
	}, []);

	useEffect(() => {
		if (isPanning) {
			document.addEventListener("mousemove", handleCanvasPanMove);
			document.addEventListener("mouseup", handleCanvasPanEnd);
			return () => {
				document.removeEventListener("mousemove", handleCanvasPanMove);
				document.removeEventListener("mouseup", handleCanvasPanEnd);
			};
		}
	}, [isPanning, handleCanvasPanMove, handleCanvasPanEnd]);

	const zoomIn = () => {
		setZoom((prev) => Math.min(prev * 1.2, 3));
		showToast("Zoomed in", "info");
	};

	const zoomOut = () => {
		setZoom((prev) => Math.max(prev / 1.2, 0.3));
		showToast("Zoomed out", "info");
	};

	const resetView = () => {
		setZoom(1);
		setCanvasOffset({ x: 0, y: 0 });
		showToast("View reset", "info");
	};

	const editLayer = (layer: Layer) => {
		setSelectedLayerForEdit(layer);
		setShowLayerModal(true);
	};

	const updateLayer = (updatedLayer: Layer) => {
		setLayers((prev) =>
			prev.map((layer) => (layer.id === updatedLayer.id ? updatedLayer : layer))
		);

		setPanels((prev) =>
			prev.map((panel) =>
				panel.layerId === updatedLayer.id
					? {
							...panel,
							backgroundColor:
								updatedLayer.backgroundColor === "transparent"
									? undefined
									: updatedLayer.backgroundColor + "10",
					  }
					: panel
			)
		);

		saveToHistory();
		showToast("Layer updated", "success");
	};

	const addPanelFromLibrary = (imageUrl: string, aspectRatio: string) => {
		if (selectedPanel) {
			setPanels((prev) =>
				prev.map((p) => (p.id === selectedPanel ? { ...p, imageUrl } : p))
			);
			showToast("Image added to panel", "success");
		} else {
			createPanel(aspectRatio, imageUrl);
		}
		setShowComicPanelLibrary(false);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case "z":
						e.preventDefault();
						undo();
						break;
					case "c":
						e.preventDefault();
						if (selectedPanel) copyPanel(selectedPanel);
						break;
					case "s":
						e.preventDefault();
						showToast("Auto-save enabled", "success");
						break;
				}
			} else if (e.key === "Delete") {
				if (selectedText) {
					deleteText(selectedText.panelId, selectedText.textId);
				} else if (selectedPanel) {
					deletePanel(selectedPanel);
				}
			} else if (e.key === "Escape") {
				setSelectedTool("move");
				setSelectedText(null);
				setTextContextMenu({
					isOpen: false,
					x: 0,
					y: 0,
					textId: "",
					panelId: "",
				});
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedPanel, selectedText, undo]);

	const handleResizeMouseDown = (
		e: React.MouseEvent,
		panelId: string,
		direction: string
	) => {
		e.stopPropagation();
		setSelectedPanel(panelId);
		setIsResizing(true);
		setResizeDirection(direction);

		const panel = panels.find((p) => p.id === panelId);
		if (panel) {
			setResizeStartData({
				x: e.clientX,
				y: e.clientY,
				width: panel.width,
				height: panel.height,
			});
		}
	};

	const handleElementTouchStart = (
		e: React.TouchEvent,
		elementType: "shape" | "text",
		elementId: string,
		panelId: string
	) => {
		e.stopPropagation();
		if (elementType === "text") {
			setSelectedText({ panelId, textId: elementId });
		}
		setIsDraggingElement(true);
		setDraggedElement({ type: elementType, id: elementId, panelId });

		const touch = e.touches[0];
		const elementRect = e.currentTarget.getBoundingClientRect();

		setDragOffset({
			x: (touch.clientX - elementRect.left) / zoom,
			y: (touch.clientY - elementRect.top) / zoom,
		});
	};

	const handleElementMouseDown = (
		e: React.MouseEvent,
		elementType: "shape" | "text",
		elementId: string,
		panelId: string
	) => {
		e.stopPropagation();
		if (elementType === "text") {
			setSelectedText({ panelId, textId: elementId });
		}
		setIsDraggingElement(true);
		setDraggedElement({ type: elementType, id: elementId, panelId });

		const elementRect = e.currentTarget.getBoundingClientRect();
		const panelElement = document.querySelector(
			`[data-panel-id="${panelId}"]`
		) as HTMLElement;

		if (panelElement) {
			const panelRect = panelElement.getBoundingClientRect();
			setDragOffset({
				x: (e.clientX - elementRect.left) / zoom,
				y: (e.clientY - elementRect.top) / zoom,
			});
		}
	};

	const toggleLayerVisibility = (layerId: string) => {
		const layer = layers.find((l) => l.id === layerId);
		if (!layer) return;

		const newVisibility = !layer.visible;

		setLayers((prev) =>
			prev.map((l) => (l.id === layerId ? { ...l, visible: newVisibility } : l))
		);

		setPanels((prev) =>
			prev.map((panel) =>
				panel.layerId === layerId ? { ...panel, visible: newVisibility } : panel
			)
		);

		saveToHistory();
		showToast(
			`Layer "${layer.name}" ${newVisibility ? "shown" : "hidden"}`,
			"info"
		);
	};

	const toggleLayerLock = (layerId: string) => {
		const layer = layers.find((l) => l.id === layerId);
		if (!layer) return;

		const newLockState = !layer.locked;

		setLayers((prev) =>
			prev.map((l) => (l.id === layerId ? { ...l, locked: newLockState } : l))
		);

		setPanels((prev) =>
			prev.map((panel) =>
				panel.layerId === layerId ? { ...panel, locked: newLockState } : panel
			)
		);

		saveToHistory();
		showToast(
			`Layer "${layer.name}" ${newLockState ? "locked" : "unlocked"}`,
			"info"
		);
	};

	useEffect(() => {
		const updateCursors = () => {
			setCollaborativeCursors((prevCursors) => {
				return prevCursors.map((cursor) => {
					const dx = cursor.targetX - cursor.x;
					const dy = cursor.targetY - cursor.y;
					const newX = cursor.x + dx * 0.1;
					const newY = cursor.y + dy * 0.1;

					if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
						const canvasContainer = canvasContainerRef.current;
						if (canvasContainer) {
							const rect = canvasContainer.getBoundingClientRect();
							return {
								...cursor,
								x: newX,
								y: newY,
								targetX: Math.random() * (rect.width - 100) + 50,
								targetY: Math.random() * (rect.height - 100) + 50,
								lastSeen: Date.now(),
							};
						}
					}

					return {
						...cursor,
						x: newX,
						y: newY,
						lastSeen: Date.now(),
					};
				});
			});
		};

		const interval = setInterval(updateCursors, 50);

		if (collaborativeCursors.length === 0) {
			const canvasContainer = canvasContainerRef.current;
			if (canvasContainer) {
				const rect = canvasContainer.getBoundingClientRect();
				setCollaborativeCursors([
					{
						id: "user-alice",
						x: 200,
						y: 150,
						targetX: Math.random() * (rect.width - 100) + 50,
						targetY: Math.random() * (rect.height - 100) + 50,
						name: "Alice",
						color: "#FF6B6B",
						lastSeen: Date.now(),
					},
					{
						id: "user-bob",
						x: 400,
						y: 300,
						targetX: Math.random() * (rect.width - 100) + 50,
						targetY: Math.random() * (rect.height - 100) + 50,
						name: "Bob",
						color: "#2EC4B6",
						lastSeen: Date.now(),
					},
				]);
			}
		}

		return () => clearInterval(interval);
	}, [collaborativeCursors.length]);

	return (
		<div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden cursor-default">
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}

			<InstructionsModal
				isOpen={showInstructions}
				onClose={() => setShowInstructions(false)}
			/>
			<PanelCreationModal
				isOpen={showPanelCreation}
				onClose={() => setShowPanelCreation(false)}
				onCreatePanel={createPanel}
			/>
			<ComicPanelLibraryModal
				isOpen={showComicPanelLibrary}
				onClose={() => setShowComicPanelLibrary(false)}
				onSelectPanel={addPanelFromLibrary}
			/>
			<LayerModal
				isOpen={showLayerModal}
				onClose={() => setShowLayerModal(false)}
				layer={selectedLayerForEdit}
				onUpdateLayer={updateLayer}
			/>
			<TextModal
				isOpen={showTextModal}
				onClose={() => {
					setShowTextModal(false);
					setPendingTextPosition(null);
					setEditingText(null);
				}}
				onAddText={addText}
				onUpdateText={updateText}
				editingText={editingText}
			/>
			<TextContextMenu
				isOpen={textContextMenu.isOpen}
				x={textContextMenu.x}
				y={textContextMenu.y}
				onEdit={() => {
					const panel = panels.find((p) => p.id === textContextMenu.panelId);
					const textElement = panel?.texts.find(
						(t) => t.id === textContextMenu.textId
					);
					if (textElement) {
						setEditingText(textElement);
						setSelectedText({
							panelId: textContextMenu.panelId,
							textId: textContextMenu.textId,
						});
						setShowTextModal(true);
					}
					setTextContextMenu({
						isOpen: false,
						x: 0,
						y: 0,
						textId: "",
						panelId: "",
					});
				}}
				onDelete={() => {
					deleteText(textContextMenu.panelId, textContextMenu.textId);
					setTextContextMenu({
						isOpen: false,
						x: 0,
						y: 0,
						textId: "",
						panelId: "",
					});
				}}
				onClose={() =>
					setTextContextMenu({
						isOpen: false,
						x: 0,
						y: 0,
						textId: "",
						panelId: "",
					})
				}
			/>

			<header className="bg-[#334155] text-[#F8FAFC] px-4 py-4 shadow-lg border-b border-[#334155]/20">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 md:gap-4">
						<button
							onClick={() => setShowMobileSidebar(true)}
							className="md:hidden p-2 hover:bg-[#F8FAFC]/10 rounded-lg transition-colors cursor-pointer"
						>
							<Menu size={20} />
						</button>
						<h1 className="text-lg md:text-xl font-bold cursor-default">
							Comic Storyboard Studio
						</h1>
						<div className="hidden md:flex items-center gap-2 text-sm cursor-default">
							<span className="text-[#2EC4B6]">{panels.length} panels</span>
							<span className="text-[#F8FAFC]/60">•</span>
							<span className="text-[#FF6B6B]">
								Zoom: {Math.round(zoom * 100)}%
							</span>
							<span className="text-[#F8FAFC]/60">•</span>
							<span className="text-[#2EC4B6]">
								Tool: {selectedTool === "move" ? "Move" : "Text"}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2 md:gap-3">
						<button
							onClick={undo}
							className="p-2 hover:bg-[#F8FAFC]/10 rounded-lg transition-colors cursor-pointer"
							title="Undo"
						>
							<Undo2 size={18} />
						</button>
						<button
							onClick={() => setShowInstructions(true)}
							className="p-2 hover:bg-[#F8FAFC]/10 rounded-lg transition-colors cursor-pointer"
							title="Help"
						>
							<HelpCircle size={18} />
						</button>
						<div className="flex items-center gap-1">
							<button
								onClick={exportToSVG}
								className="bg-[#2EC4B6] hover:bg-[#2EC4B6]/90 px-2 md:px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer text-xs md:text-sm"
							>
								<Download size={14} />
								<span className="hidden sm:inline">SVG</span>
							</button>
							<button
								onClick={exportToPNG}
								className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 px-2 md:px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer text-xs md:text-sm"
							>
								<FileImage size={14} />
								<span className="hidden sm:inline">PNG</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden relative">
				<div className="hidden md:flex w-16 bg-[#334155] border-r border-[#334155]/20 flex-col items-center py-4 gap-2">
					{[
						{ tool: "move", icon: Move, label: "Move" },
						{ tool: "text", icon: Type, label: "Text (Click to place)" },
					].map(({ tool, icon: Icon, label }) => (
						<button
							key={tool}
							onClick={() => setSelectedTool(tool as any)}
							className={`p-3 rounded-lg transition-colors cursor-pointer ${
								selectedTool === tool
									? "bg-[#2EC4B6] text-[#F8FAFC]"
									: "text-[#F8FAFC]/70 hover:bg-[#F8FAFC]/10 hover:text-[#F8FAFC]"
							}`}
							title={label}
						>
							<Icon size={20} />
						</button>
					))}

					<div className="w-full h-px bg-[#F8FAFC]/20 my-2" />
				</div>

				{showMobileTools && (
					<div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#334155] rounded-2xl p-4 shadow-2xl border border-[#334155]/20">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-[#F8FAFC] font-medium">Tools</h3>
							<button
								onClick={() => setShowMobileTools(false)}
								className="text-[#F8FAFC]/70 hover:text-[#F8FAFC] cursor-pointer"
							>
								<X size={20} />
							</button>
						</div>
						<div className="grid grid-cols-2 gap-3">
							{[
								{ tool: "move", icon: Move, label: "Move" },
								{ tool: "text", icon: Type, label: "Text" },
							].map(({ tool, icon: Icon, label }) => (
								<button
									key={tool}
									onClick={() => {
										setSelectedTool(tool as any);
										setShowMobileTools(false);
									}}
									className={`p-3 rounded-lg transition-colors cursor-pointer flex flex-col items-center gap-1 ${
										selectedTool === tool
											? "bg-[#2EC4B6] text-[#F8FAFC]"
											: "text-[#F8FAFC]/70 hover:bg-[#F8FAFC]/10 hover:text-[#F8FAFC]"
									}`}
								>
									<Icon size={20} />
									<span className="text-xs">{label}</span>
								</button>
							))}
						</div>
					</div>
				)}

				{showMobileSidebar && (
					<div className="md:hidden fixed inset-0 z-50 flex">
						<div
							className="absolute inset-0 bg-black/20 backdrop-blur-md"
							onClick={() => setShowMobileSidebar(false)}
						/>
						<div className="relative w-80 max-w-[85vw] bg-[#F8FAFC] border-r border-[#334155]/10 flex flex-col overflow-y-auto">
							<div className="p-4 border-b border-[#334155]/10 flex items-center justify-between">
								<h3 className="font-semibold text-[#334155] flex items-center gap-2">
									<Layers size={18} />
									Layers & Tools
								</h3>
								<button
									onClick={() => setShowMobileSidebar(false)}
									className="text-[#334155]/60 hover:text-[#334155] cursor-pointer"
								>
									<X size={20} />
								</button>
							</div>

							<div className="p-4 border-b border-[#334155]/10">
								<div className="flex items-center justify-between mb-3">
									<h4 className="font-medium text-[#334155]">Layers</h4>
									<button
										onClick={() => {
											const newLayer: Layer = {
												id: `layer-${Date.now()}`,
												name: `Layer ${layers.length + 1}`,
												visible: true,
												locked: false,
												panels: [],
												backgroundColor: "transparent",
											};
											setLayers((prev) => [...prev, newLayer]);
											showToast("New layer created", "success");
										}}
										className="text-[#2EC4B6] hover:text-[#2EC4B6]/80 transition-colors cursor-pointer"
									>
										<Plus size={16} />
									</button>
								</div>

								<div className="space-y-2">
									{layers.map((layer) => (
										<div
											key={layer.id}
											className={`p-3 rounded-lg border transition-colors cursor-pointer ${
												selectedLayer === layer.id
													? "border-[#2EC4B6] bg-[#2EC4B6]/5"
													: "border-[#334155]/10 hover:border-[#334155]/20"
											}`}
											onClick={() => setSelectedLayer(layer.id)}
										>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-[#334155] truncate">
													{layer.name}
												</span>
												<div className="flex items-center gap-1">
													<button
														onClick={(e) => {
															e.stopPropagation();
															editLayer(layer);
														}}
														className="p-1 rounded text-[#334155]/60 hover:text-[#334155] cursor-pointer"
													>
														<Edit3 size={12} />
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															deleteLayer(layer.id);
														}}
														className="p-1 rounded text-[#FF6B6B]/60 hover:text-[#FF6B6B] cursor-pointer"
													>
														<Trash2 size={12} />
													</button>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<button
														onClick={(e) => {
															e.stopPropagation();
															toggleLayerVisibility(layer.id);
														}}
														className={`p-1 rounded cursor-pointer ${
															layer.visible
																? "text-[#2EC4B6]"
																: "text-[#334155]/40"
														}`}
													>
														{layer.visible ? (
															<Eye size={14} />
														) : (
															<EyeOff size={14} />
														)}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation();
															toggleLayerLock(layer.id);
														}}
														className={`p-1 rounded cursor-pointer ${
															layer.locked
																? "text-[#FF6B6B]"
																: "text-[#334155]/40"
														}`}
													>
														{layer.locked ? (
															<Lock size={14} />
														) : (
															<Unlock size={14} />
														)}
													</button>
												</div>
												<span className="text-xs text-[#334155]/60">
													{layer.panels.length} panels
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="flex-1 overflow-y-auto p-4">
								<h4 className="font-medium text-[#334155] mb-3">
									Sample Images
								</h4>
								<div className="grid grid-cols-2 gap-2">
									{SAMPLE_IMAGES.slice(0, 8).map((image, index) => (
										<div
											key={`mobile-sample-${index}`}
											className="aspect-video bg-white rounded border border-[#334155]/20 hover:border-[#2EC4B6] transition-all cursor-grab active:cursor-grabbing overflow-hidden"
											draggable
											onDragStart={(e) => {
												e.dataTransfer.setData("text/plain", image);
												e.dataTransfer.setData("action", "create-panel");
												e.dataTransfer.effectAllowed = "copy";
											}}
											onClick={() => {
												if (selectedPanel) {
													setPanels((prev) =>
														prev.map((p) =>
															p.id === selectedPanel
																? { ...p, imageUrl: image }
																: p
														)
													);
													showToast("Image added to panel", "success");
												} else {
													createPanel("16:9", image);
												}
												setShowMobileSidebar(false);
											}}
										>
											<img
												src={image || "/placeholder.svg"}
												alt={`Sample ${index + 1}`}
												className="w-full h-full object-cover pointer-events-none"
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="flex-1 flex flex-col min-w-0">
					<div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-[#334155]/10">
						<div className="flex items-center gap-2 md:gap-4">
							<button
								onClick={() => setShowPanelCreation(true)}
								className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-[#F8FAFC] px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer"
							>
								<Plus size={16} />
								<span className="hidden sm:inline">Add Panel</span>
							</button>

							<button
								onClick={() => setShowMobileTools(true)}
								className="md:hidden bg-[#334155] text-[#F8FAFC] px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer"
							>
								<Settings size={16} />
								Tools
							</button>

							<div className="hidden lg:flex items-center gap-2">
								<span className="text-sm font-medium text-[#334155] cursor-default">
									Quick:
								</span>
								<div className="flex gap-2">
									{aspectRatios.slice(0, 3).map((ratio) => (
										<button
											key={ratio.name}
											onClick={() => createPanel(ratio.name)}
											className="px-2 py-1 text-xs bg-[#2EC4B6]/10 text-[#334155] rounded-md hover:bg-[#2EC4B6]/20 transition-colors border border-[#2EC4B6]/30 cursor-pointer"
											title={`Create ${ratio.label} panel`}
										>
											{ratio.name}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="hidden md:flex items-center gap-2 text-sm text-[#334155]/60 cursor-default">
								<Grid size={16} />
								<span>Canvas</span>
							</div>
							<button
								onClick={zoomIn}
								className="p-2 rounded-lg text-[#334155]/70 hover:bg-[#334155]/10 hover:text-[#334155] transition-colors cursor-pointer"
								title="Zoom In"
							>
								<ZoomIn size={20} />
							</button>
							<button
								onClick={zoomOut}
								className="p-2 rounded-lg text-[#334155]/70 hover:bg-[#334155]/10 hover:text-[#334155] transition-colors cursor-pointer"
								title="Zoom Out"
							>
								<ZoomOut size={20} />
							</button>
							<button
								onClick={resetView}
								className="p-2 rounded-lg text-[#334155]/70 hover:bg-[#334155]/10 hover:text-[#334155] transition-colors cursor-pointer"
								title="Reset View"
							>
								<Grid size={20} />
							</button>
						</div>
					</div>

					<div
						ref={canvasContainerRef}
						className="flex-1 relative overflow-hidden border-2 md:border-4 border-[#334155]/10 rounded-lg m-1 md:m-2"
					>
						<div
							ref={canvasRef}
							className="w-full h-full bg-gradient-to-br from-[#F8FAFC] to-[#F8FAFC]/80 relative"
							style={{
								backgroundImage: `radial-gradient(circle at 1px 1px, rgba(51,65,85,0.1) 1px, transparent 0)`,
								backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
								cursor: selectedTool === "text" ? "crosshair" : "default",
								backgroundColor: (() => {
									const selectedLayerObj = layers.find(
										(l) => l.id === selectedLayer
									);
									if (
										selectedLayerObj?.backgroundColor &&
										selectedLayerObj.backgroundColor !== "transparent"
									) {
										return selectedLayerObj.backgroundColor + "05";
									}
									return "#F8FAFC";
								})(),
							}}
							onMouseDown={(e) => {
								handleCanvasPanStart(e);
								handleCanvasMouseDown(e);
							}}
							onDrop={(e) => {
								e.preventDefault();
								const imageUrl = e.dataTransfer.getData("text/plain");
								const action = e.dataTransfer.getData("action");

								if (action === "create-panel" && imageUrl) {
									const rect = canvasRef.current?.getBoundingClientRect();
									if (rect) {
										const x = (e.clientX - rect.left) / zoom;
										const y = (e.clientY - rect.top) / zoom;

										const selectedLayerObj = layers.find(
											(l) => l.id === selectedLayer
										);
										const backgroundColor =
											selectedLayerObj?.backgroundColor || "transparent";

										const baseWidth = window.innerWidth < 768 ? 150 : 200;
										const height = baseWidth / (16 / 9);
										const newPanel: Panel = {
											id: `panel-${Date.now()}`,
											x: Math.max(0, x - baseWidth / 2),
											y: Math.max(0, y - height / 2),
											width: baseWidth,
											height,
											aspectRatio: "16:9",
											aspectLocked: true,
											imageUrl,
											shapes: [],
											texts: [],
											zIndex: panels.length,
											visible: true,
											locked: false,
											layerId: selectedLayer,
											backgroundColor:
												backgroundColor === "transparent"
													? undefined
													: backgroundColor + "10",
										};

										setPanels((prev) => [...prev, newPanel]);
										setSelectedPanel(newPanel.id);

										setLayers((prev) =>
											prev.map((layer) =>
												layer.id === selectedLayer
													? { ...layer, panels: [...layer.panels, newPanel.id] }
													: layer
											)
										);

										saveToHistory();
										showToast("New panel created with image", "success");
									}
								}
							}}
							onDragOver={(e) => {
								e.preventDefault();
								e.dataTransfer.dropEffect = "copy";
							}}
						>
							<div
								className="relative w-full h-full"
								style={{
									transform: `scale(${zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
									transformOrigin: "center center",
								}}
							>
								{panels.map((panel) => {
									const layerColor =
										layers.find((l) => l.id === panel.layerId)
											?.backgroundColor || "#2EC4B6";
									return (
										<div
											key={panel.id}
											data-panel-id={panel.id}
											className={`absolute border-2 rounded-lg shadow-lg select-none ${
												selectedPanel === panel.id
													? `border-[${layerColor}]`
													: "border-[#334155]/20 hover:border-[#334155]/40"
											} ${
												panel.locked
													? "cursor-not-allowed"
													: selectedTool === "text"
													? "cursor-crosshair"
													: "cursor-move"
											} ${!panel.visible ? "opacity-50" : ""}`}
											style={{
												left: panel.x,
												top: panel.y,
												width: panel.width,
												height: panel.height,
												zIndex: panel.zIndex,
												transition:
													isDragging && selectedPanel === panel.id
														? "none"
														: "all 0.2s ease-out",
												backgroundColor: panel.backgroundColor || "#FFFFFF",
												borderColor:
													selectedPanel === panel.id ? layerColor : undefined,
											}}
											onClick={(e) => handlePanelClick(e, panel.id)}
											onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
											onTouchStart={(e) => handleTouchStart(e, panel.id)}
										>
											<div className="absolute -top-8 left-0 flex items-center gap-1">
												<span className="text-xs bg-[#334155] text-[#F8FAFC] px-2 py-1 rounded-md cursor-default">
													#{panels.indexOf(panel) + 1}
												</span>
												<span className="hidden md:inline text-xs bg-[#2EC4B6] text-[#F8FAFC] px-2 py-1 rounded-md cursor-default">
													{panel.aspectRatio}
												</span>
												{panel.aspectLocked && (
													<span className="text-xs bg-[#FF6B6B] text-[#F8FAFC] px-1 py-1 rounded-md cursor-default">
														🔒
													</span>
												)}
											</div>

											{selectedPanel === panel.id && (
												<div className="absolute -top-8 right-0">
													<button
														onClick={(e) => {
															e.stopPropagation();
															setShowMobileActions(
																showMobileActions === panel.id ? null : panel.id
															);
														}}
														className="p-1.5 bg-[#F8FAFC] rounded-lg hover:bg-[#2EC4B6]/10 transition-all cursor-pointer shadow-lg text-[#334155]"
														style={{
															height: "28px",
														}}
													>
														<MoreHorizontal size={14} />
													</button>
													{showMobileActions === panel.id && (
														<div className="absolute right-0 top-8 bg-[#F8FAFC] rounded-lg shadow-2xl border border-[#334155]/10 z-50 p-2">
															<div className="grid grid-cols-2 gap-2 min-w-[120px]">
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		toggleAspectLock(panel.id);
																		setShowMobileActions(null);
																	}}
																	className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
																		panel.aspectLocked
																			? "bg-[#FF6B6B] text-[#F8FAFC]"
																			: "bg-[#2EC4B6] text-[#F8FAFC]"
																	}`}
																	title={
																		panel.aspectLocked
																			? "Unlock aspect ratio"
																			: "Lock aspect ratio"
																	}
																>
																	{panel.aspectLocked ? (
																		<Lock size={12} />
																	) : (
																		<Unlock size={12} />
																	)}
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		togglePanelVisibility(panel.id);
																		setShowMobileActions(null);
																	}}
																	className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
																		panel.visible
																			? "bg-[#2EC4B6] text-[#F8FAFC]"
																			: "bg-[#FF6B6B] text-[#F8FAFC]"
																	}`}
																	title={
																		panel.visible ? "Hide panel" : "Show panel"
																	}
																>
																	{panel.visible ? (
																		<Eye size={12} />
																	) : (
																		<EyeOff size={12} />
																	)}
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		copyPanel(panel.id);
																		setShowMobileActions(null);
																	}}
																	className="p-2 bg-[#2EC4B6] text-[#F8FAFC] rounded-lg transition-all cursor-pointer flex items-center justify-center"
																	title="Copy panel"
																>
																	<Copy size={12} />
																</button>
																<button
																	onClick={(e) => {
																		e.stopPropagation();
																		deletePanel(panel.id);
																		setShowMobileActions(null);
																	}}
																	className="p-2 bg-[#FF6B6B] text-[#F8FAFC] rounded-lg transition-all cursor-pointer flex items-center justify-center"
																	title="Delete panel"
																>
																	<Trash2 size={12} />
																</button>
															</div>
														</div>
													)}
												</div>
											)}

											<div
												className="w-full h-full relative overflow-hidden rounded-lg"
												onDrop={(e) => {
													e.preventDefault();
													const imageUrl = e.dataTransfer.getData("text/plain");
													const action = e.dataTransfer.getData("action");

													if (!action && imageUrl) {
														setPanels((prev) =>
															prev.map((p) =>
																p.id === panel.id ? { ...p, imageUrl } : p
															)
														);
														showToast("Image added to panel", "success");
													}
												}}
												onDragOver={(e) => {
													e.preventDefault();
													e.dataTransfer.dropEffect = "copy";
												}}
											>
												{panel.imageUrl ? (
													<img
														src={panel.imageUrl || "/placeholder.svg"}
														alt="Panel background"
														className="w-full h-full object-cover"
														style={{ pointerEvents: "none" }}
													/>
												) : (
													<div className="w-full h-full bg-gray-50 flex items-center justify-center text-[#334155]/40 text-sm">
														{selectedTool === "text"
															? "Click to add text"
															: "Drop image here"}
													</div>
												)}

												{panel.shapes.map((shape) => (
													<div
														key={shape.id}
														className="absolute cursor-move hover:opacity-80"
														style={{
															left: shape.x,
															top: shape.y,
															width: Math.abs(shape.width),
															height: Math.abs(shape.height),
															border: `${shape.strokeWidth}px solid ${shape.color}`,
															borderRadius:
																shape.type === "circle" ? "50%" : "0",
														}}
														onMouseDown={(e) =>
															handleElementMouseDown(
																e,
																"shape",
																shape.id,
																panel.id
															)
														}
													/>
												))}

												{isDrawing &&
													currentShape &&
													selectedPanel === panel.id && (
														<div
															className="absolute pointer-events-none"
															style={{
																left: currentShape.x,
																top: currentShape.y,
																width: Math.abs(currentShape.width),
																height: Math.abs(currentShape.height),
																border: `${currentShape.strokeWidth}px solid ${currentShape.color}`,
																borderRadius:
																	currentShape.type === "circle" ? "50%" : "0",
															}}
														/>
													)}

												{panel.texts.map((textElement) => (
													<div
														key={textElement.id}
														className={`absolute cursor-move hover:opacity-80 bg-white/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm transition-all ${
															selectedText?.textId === textElement.id
																? "ring-2 ring-[#2EC4B6]"
																: ""
														}`}
														style={{
															left: textElement.x,
															top: textElement.y,
															fontSize: textElement.fontSize,
															color: textElement.color,
															fontFamily: textElement.fontFamily,
															fontWeight: "bold",
															border: "1px solid rgba(51,65,85,0.2)",
														}}
														onClick={(e) => {
															e.stopPropagation();
															setSelectedText({
																panelId: panel.id,
																textId: textElement.id,
															});
														}}
														onDoubleClick={(e) =>
															handleTextDoubleClick(e, textElement, panel.id)
														}
														onContextMenu={(e) =>
															handleTextRightClick(e, textElement, panel.id)
														}
														onMouseDown={(e) =>
															handleElementMouseDown(
																e,
																"text",
																textElement.id,
																panel.id
															)
														}
														onTouchStart={(e) =>
															handleElementTouchStart(
																e,
																"text",
																textElement.id,
																panel.id
															)
														}
														title="Double-click to edit, right-click for options"
													>
														{textElement.text}
													</div>
												))}
											</div>

											{selectedPanel === panel.id && !panel.locked && (
												<>
													<div
														className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full cursor-se-resize"
														style={{ backgroundColor: layerColor }}
														onMouseDown={(e) =>
															handleResizeMouseDown(e, panel.id, "se")
														}
													/>
													<div
														className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full cursor-s-resize"
														style={{ backgroundColor: layerColor }}
														onMouseDown={(e) =>
															handleResizeMouseDown(e, panel.id, "s")
														}
													/>
													<div
														className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-3 h-3 rounded-full cursor-e-resize"
														style={{ backgroundColor: layerColor }}
														onMouseDown={(e) =>
															handleResizeMouseDown(e, panel.id, "e")
														}
													/>
												</>
											)}
										</div>
									);
								})}

								{collaborativeCursors.map((cursor) => (
									<div
										key={cursor.id}
										className="absolute pointer-events-none z-50 transition-all duration-100"
										style={{
											left: cursor.x,
											top: cursor.y,
											transform: "translate(-2px, -2px)",
										}}
									>
										<div className="relative">
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												className="drop-shadow-lg"
											>
												<path
													d="M0 0L0 16L5 11L8 18L11 17L8 10L16 10L0 0Z"
													fill={cursor.color}
													stroke="white"
													strokeWidth="1"
												/>
											</svg>
											<div
												className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap"
												style={{ backgroundColor: cursor.color }}
											>
												{cursor.name}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div
						ref={sequencePreviewRef}
						className="bg-[#F8FAFC] border-t border-[#334155]/10"
					>
						<div className="px-4 py-2 flex items-center justify-between">
							<h3 className="text-sm font-semibold text-[#334155] cursor-default">
								Panel Sequence
							</h3>
							<div className="flex items-center gap-2 text-xs text-[#334155]/60">
								<span>{panels.length} panels</span>
								<span>•</span>
								<span>Zoom: {Math.round(zoom * 100)}%</span>
								<span>•</span>
								<span>Tool: {selectedTool === "move" ? "Move" : "Text"}</span>
							</div>
						</div>
						<div className="h-20 md:h-24 p-2 overflow-x-auto">
							<div className="flex items-center h-full gap-2 min-w-max">
								{panels.length === 0 ? (
									<div className="w-full h-full flex flex-col items-center justify-center text-[#334155]/40 text-sm">
										<Grid size={20} className="mb-1 opacity-50" />
										<span className="text-xs">Add panels to see sequence</span>
									</div>
								) : (
									panels.map((panel, index) => (
										<div
											key={panel.id}
											className="flex-shrink-0 flex flex-col items-center gap-1"
										>
											<span className="text-xs text-[#334155]/60 cursor-default">
												#{index + 1}
											</span>
											<div
												className={`h-10 md:h-12 aspect-video bg-white border rounded cursor-pointer transition-all ${
													selectedPanel === panel.id
														? "border-[#2EC4B6] shadow-sm"
														: "border-[#334155]/20 hover:border-[#334155]/40"
												}`}
												onClick={() => setSelectedPanel(panel.id)}
											>
												<div className="w-full h-full flex items-center justify-center text-xs text-[#334155]/60 relative overflow-hidden rounded">
													{panel.imageUrl ? (
														<img
															src={panel.imageUrl || "/placeholder.svg"}
															alt={`Panel ${index + 1}`}
															className="w-full h-full object-cover"
														/>
													) : (
														<span className="cursor-default">{index + 1}</span>
													)}
													{panel.texts.length > 0 && (
														<div
															className="absolute top-0 right-0 w-2 h-2 bg-[#2EC4B6] rounded-full"
															title="Has text"
														/>
													)}
												</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="hidden lg:flex w-80 bg-[#F8FAFC] border-l border-[#334155]/10 flex-col flex-shrink-0">
					<div className="h-32 p-4 border-b border-[#334155]/10">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-semibold text-[#334155] flex items-center gap-2 cursor-default">
								<Layers size={18} />
								Layers
							</h3>
							<button
								onClick={() => {
									const newLayer: Layer = {
										id: `layer-${Date.now()}`,
										name: `Layer ${layers.length + 1}`,
										visible: true,
										locked: false,
										panels: [],
										backgroundColor: "transparent",
									};
									setLayers((prev) => [...prev, newLayer]);
									showToast("New layer created", "success");
								}}
								className="text-[#2EC4B6] hover:text-[#2EC4B6]/80 transition-colors cursor-pointer"
							>
								<Plus size={16} />
							</button>
						</div>

						<div className="overflow-x-auto">
							<div className="flex gap-2 min-w-max">
								{layers.map((layer) => (
									<div
										key={layer.id}
										className={`flex-shrink-0 w-32 p-2 rounded-lg border transition-colors cursor-pointer ${
											selectedLayer === layer.id
												? "border-[#2EC4B6] bg-[#2EC4B6]/5"
												: "border-[#334155]/10 hover:border-[#334155]/20"
										}`}
										onClick={() => setSelectedLayer(layer.id)}
									>
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs font-medium text-[#334155] cursor-default truncate">
												{layer.name}
											</span>
											<div className="flex items-center gap-1">
												<button
													onClick={(e) => {
														e.stopPropagation();
														editLayer(layer);
													}}
													className="p-1 rounded text-[#334155]/60 hover:text-[#334155] cursor-pointer"
													title="Edit layer"
												>
													<Edit3 size={10} />
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														deleteLayer(layer.id);
													}}
													className="p-1 rounded text-[#FF6B6B]/60 hover:text-[#FF6B6B] cursor-pointer"
													title="Delete layer"
												>
													<Trash2 size={10} />
												</button>
											</div>
										</div>
										<div className="flex items-center gap-1">
											<button
												onClick={(e) => {
													e.stopPropagation();
													toggleLayerVisibility(layer.id);
												}}
												className={`p-1 rounded cursor-pointer ${
													layer.visible ? "text-[#2EC4B6]" : "text-[#334155]/40"
												}`}
												title={layer.visible ? "Hide layer" : "Show layer"}
											>
												{layer.visible ? (
													<Eye size={12} />
												) : (
													<EyeOff size={12} />
												)}
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													toggleLayerLock(layer.id);
												}}
												className={`p-1 rounded cursor-pointer ${
													layer.locked ? "text-[#FF6B6B]" : "text-[#334155]/40"
												}`}
												title={layer.locked ? "Unlock layer" : "Lock layer"}
											>
												{layer.locked ? (
													<Lock size={12} />
												) : (
													<Unlock size={12} />
												)}
											</button>
											<span className="text-xs text-[#334155]/60 cursor-default">
												{layer.panels.length}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="p-4 flex-1 overflow-y-auto">
						<h3 className="font-semibold text-[#334155] mb-3 flex items-center gap-2 cursor-default">
							<Settings size={18} />
							Panel Properties
						</h3>

						<div className="mb-6">
							<h4 className="text-sm font-medium text-[#334155] mb-2 cursor-default">
								Sample Images
							</h4>
							<div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
								{[...SAMPLE_IMAGES, ...SAMPLE_IMAGES].map((image, index) => (
									<div
										key={`sample-${index}`}
										className="aspect-video bg-white rounded border border-[#334155]/20 hover:border-[#2EC4B6] transition-all cursor-grab active:cursor-grabbing overflow-hidden"
										draggable
										onDragStart={(e) => {
											e.dataTransfer.setData("text/plain", image);
											e.dataTransfer.setData("action", "create-panel");
											e.dataTransfer.effectAllowed = "copy";
										}}
										title="Drag to canvas to create new panel"
									>
										<img
											src={image || "/placeholder.svg"}
											alt={`Sample ${index + 1}`}
											className="w-full h-full object-cover pointer-events-none"
										/>
									</div>
								))}
							</div>
						</div>

						{selectedPanel ? (
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium text-[#334155] block mb-2 cursor-default">
										Panel Size
									</label>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<label className="text-xs text-[#334155]/60 cursor-default">
												Width
											</label>
											<input
												type="number"
												value={
													panels.find((p) => p.id === selectedPanel)?.width || 0
												}
												onChange={(e) => {
													const value = Number.parseInt(e.target.value);
													updatePanelSize(selectedPanel, "width", value);
												}}
												className="w-full px-2 py-1 text-sm border border-[#334155]/20 rounded focus:border-[#2EC4B6] focus:outline-none cursor-text"
											/>
										</div>
										<div>
											<label className="text-xs text-[#334155]/60 cursor-default">
												Height
											</label>
											<input
												type="number"
												value={
													panels.find((p) => p.id === selectedPanel)?.height ||
													0
												}
												onChange={(e) => {
													const value = Number.parseInt(e.target.value);
													updatePanelSize(selectedPanel, "height", value);
												}}
												className="w-full px-2 py-1 text-sm border border-[#334155]/20 rounded focus:border-[#2EC4B6] focus:outline-none cursor-text"
											/>
										</div>
									</div>
								</div>

								<div>
									<label className="text-sm font-medium text-[#334155] block mb-2 cursor-default">
										Panel Image
									</label>
									{panels.find((p) => p.id === selectedPanel)?.imageUrl ? (
										<div>
											<img
												src={
													panels.find((p) => p.id === selectedPanel)
														?.imageUrl || "/placeholder.svg"
												}
												alt="Panel"
												className="w-full h-20 object-cover rounded border border-[#334155]/20 mb-2"
											/>
											<button
												onClick={() => {
													setPanels((prev) =>
														prev.map((panel) =>
															panel.id === selectedPanel
																? { ...panel, imageUrl: undefined }
																: panel
														)
													);
													showToast("Image removed from panel", "info");
												}}
												className="text-xs text-[#FF6B6B] hover:text-[#FF6B6B]/80 cursor-pointer"
											>
												Remove Image
											</button>
										</div>
									) : (
										<button
											onClick={() => setShowComicPanelLibrary(true)}
											className="w-full p-3 border-2 border-dashed border-[#2EC4B6] rounded-lg hover:bg-[#2EC4B6]/5 transition-colors cursor-pointer"
										>
											<ImageIcon
												size={20}
												className="mx-auto mb-1 text-[#2EC4B6]"
											/>
											<div className="text-xs font-medium text-[#334155]">
												Add Image
											</div>
										</button>
									)}
								</div>

								<div>
									<label className="text-sm font-medium text-[#334155] block mb-2 cursor-default">
										Aspect Ratio
									</label>
									<select
										value={
											panels.find((p) => p.id === selectedPanel)?.aspectRatio ||
											"16:9"
										}
										onChange={(e) => {
											updatePanelAspectRatio(selectedPanel, e.target.value);
										}}
										className="w-full px-3 py-2 text-sm border border-[#334155]/20 rounded focus:border-[#2EC4B6] focus:outline-none bg-white cursor-pointer"
									>
										{aspectRatios.map((ratio) => (
											<option key={ratio.name} value={ratio.name}>
												{ratio.name} - {ratio.label}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											checked={
												panels.find((p) => p.id === selectedPanel)
													?.aspectLocked || false
											}
											onChange={() => toggleAspectLock(selectedPanel)}
											className="rounded border-[#334155]/20 text-[#2EC4B6] focus:ring-[#2EC4B6]"
										/>
										<span className="text-sm text-[#334155]">
											Lock aspect ratio
										</span>
									</label>
								</div>

								{selectedText && (
									<div className="mt-6 p-4 bg-[#2EC4B6]/5 rounded-lg border border-[#2EC4B6]/20">
										<h4 className="text-sm font-medium text-[#334155] mb-2">
											Selected Text
										</h4>
										<div className="text-xs text-[#334155]/60 space-y-1">
											<p>• Double-click to edit</p>
											<p>• Right-click for options</p>
											<p>• Press Delete to remove</p>
											<p>• Drag to move position</p>
										</div>
										<div className="mt-2 flex gap-2">
											<button
												onClick={() => {
													const panel = panels.find(
														(p) => p.id === selectedText.panelId
													);
													const textElement = panel?.texts.find(
														(t) => t.id === selectedText.textId
													);
													if (textElement) {
														setEditingText(textElement);
														setShowTextModal(true);
													}
												}}
												className="text-xs bg-[#2EC4B6] text-white px-2 py-1 rounded hover:bg-[#2EC4B6]/80 cursor-pointer"
											>
												Edit
											</button>
											<button
												onClick={() => {
													deleteText(selectedText.panelId, selectedText.textId);
												}}
												className="text-xs bg-[#FF6B6B] text-white px-2 py-1 rounded hover:bg-[#FF6B6B]/80 cursor-pointer"
											>
												Delete
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="text-center text-[#334155]/60 py-8">
								<FileText size={32} className="mx-auto mb-2 opacity-50" />
								<p className="text-sm cursor-default">
									Select a panel to edit properties
								</p>
								<p className="text-xs cursor-default mt-1">
									Current tool: {selectedTool === "move" ? "Move" : "Text"}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<footer className="bg-[#334155] text-[#F8FAFC] px-4 py-3 border-t border-[#334155]/20">
				<div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
					<div className="flex items-center gap-4 text-sm">
						<span className="cursor-default">
							© 2024 Comic Storyboard Studio
						</span>
						<span className="hidden md:inline text-[#F8FAFC]/60">•</span>
						<span className="hidden md:inline text-[#2EC4B6] cursor-default">
							Professional Visual Storytelling Tool
						</span>
					</div>
					<div className="flex items-center gap-4 text-xs text-[#F8FAFC]/60">
						<span className="cursor-default">v2.0</span>
						<span className="hidden md:inline">•</span>
						<span className="hidden md:inline cursor-default">
							Built with React & TypeScript
						</span>
						<span className="hidden md:inline">•</span>
						<span className="hidden md:inline cursor-default">
							Enhanced Text Editing
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default StoryboardApp;
