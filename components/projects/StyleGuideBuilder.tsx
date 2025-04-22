"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
	HiMenu,
	HiX,
	HiSearch,
	HiDownload,
	HiCode,
	HiCog,
	HiInformationCircle,
	HiChartBar,
	HiDeviceMobile,
	HiDeviceTablet,
	HiDesktopComputer,
	HiChevronDown,
	HiClipboardCopy,
	HiCheck,
	HiColorSwatch,
	HiEye,
	HiAdjustments,
	HiTemplate,
	HiCubeTransparent,
} from "react-icons/hi";

const loadPoppinsFont = () => {
	if (typeof window !== "undefined") {
		const poppinsFont = document.createElement("link");
		poppinsFont.href =
			"https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
		poppinsFont.rel = "stylesheet";
		document.head.appendChild(poppinsFont);
	}
};

interface ComponentProp {
	name: string;
	type: "string" | "number" | "boolean" | "select" | "color";
	defaultValue?: any;
	description: string;
	required?: boolean;
	options?: string[];
}

interface Component {
	id: string;
	name: string;
	category: string;
	props: ComponentProp[];
	code: string;
	preview: React.FC<any>;
}

interface Theme {
	primary: string;
	secondary: string;
	background: string;
	text: string;
	fontFamily: string;
	fontSize: string;
}

interface DeviceSize {
	name: string;
	width: number;
	height: number;
	breakpoint: string;
}

const ButtonComponent: React.FC<{
	variant?: "primary" | "secondary" | "glass" | "outline";
	size?: "sm" | "md" | "lg";
	children?: React.ReactNode;
	disabled?: boolean;
	rounded?: boolean;
	theme?: Theme;
}> = ({
	variant = "primary",
	size = "md",
	children = "Click me",
	disabled = false,
	rounded = false,
	theme,
}) => {
	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	const getButtonStyle = () => {
		if (!theme) return {};

		const baseStyle = {
			fontFamily: theme.fontFamily,
			fontSize: theme.fontSize,
		};

		switch (variant) {
			case "primary":
				return {
					...baseStyle,
					backgroundColor: theme.primary,
					color: "white",
				};
			case "secondary":
				return {
					...baseStyle,
					backgroundColor: theme.secondary,
					color: "white",
				};
			case "glass":
				return {
					...baseStyle,
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					backdropFilter: "blur(16px)",
					border: "1px solid rgba(255, 255, 255, 0.2)",
					color: theme.primary,
				};
			case "outline":
				return {
					...baseStyle,
					backgroundColor: "transparent",
					border: `2px solid ${theme.primary}`,
					color: theme.primary,
				};
			default:
				return baseStyle;
		}
	};

	const variantClasses = {
		primary: "shadow-lg hover:opacity-90 hover:shadow-xl",
		secondary: "shadow-lg hover:opacity-90 hover:shadow-xl",
		glass: "backdrop-blur-md hover:bg-white/20 shadow-xl border",
		outline: "hover:text-white transition-colors",
	};

	return (
		<button
			disabled={disabled}
			className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${rounded ? "rounded-full" : "rounded-lg"}
        font-medium transition-all duration-300 
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
			style={
				{
					...getButtonStyle(),
					...(variant === "outline" &&
						theme && {
							"--tw-ring-color": theme.primary,
						}),
				} as React.CSSProperties
			}
			onMouseEnter={(e) => {
				if (variant === "outline" && theme) {
					e.currentTarget.style.backgroundColor = theme.primary;
				}
			}}
			onMouseLeave={(e) => {
				if (variant === "outline") {
					e.currentTarget.style.backgroundColor = "transparent";
				}
			}}
		>
			{children}
		</button>
	);
};

const CardComponent: React.FC<{
	title?: string;
	description?: string;
	glass?: boolean;
	elevated?: boolean;
	children?: React.ReactNode;
	theme?: Theme;
}> = ({
	title = "Card Title",
	description = "Card description goes here",
	glass = false,
	elevated = false,
	children,
	theme,
}) => {
	const getCardStyle = () => {
		if (!theme) return {};

		return {
			fontFamily: theme.fontFamily,
			fontSize: theme.fontSize,
			backgroundColor: glass ? "rgba(255, 255, 255, 0.1)" : "white",
			backdropFilter: glass ? "blur(16px)" : "none",
			border: glass
				? "1px solid rgba(255, 255, 255, 0.2)"
				: "1px solid #e2e8f0",
		};
	};

	return (
		<div
			className={`
        p-6 transition-all duration-300 rounded-2xl
        ${
					elevated
						? "hover:shadow-2xl hover:scale-[1.02]"
						: "shadow-md hover:shadow-lg"
				}
      `}
			style={getCardStyle()}
		>
			{title && (
				<h3
					className="text-xl font-bold mb-2"
					style={{ color: theme?.primary || "#1f2937" }}
				>
					{title}
				</h3>
			)}
			{description && (
				<p className="mb-4" style={{ color: theme?.text || "#4b5563" }}>
					{description}
				</p>
			)}
			{children}
		</div>
	);
};

const InputComponent: React.FC<{
	placeholder?: string;
	type?: string;
	glass?: boolean;
	size?: "sm" | "md" | "lg";
	theme?: Theme;
}> = ({
	placeholder = "Enter text...",
	type = "text",
	glass = false,
	size = "md",
	theme,
}) => {
	const sizeClasses = {
		sm: "px-3 py-2 text-sm",
		md: "px-4 py-3 text-base",
		lg: "px-5 py-4 text-lg",
	};

	const getInputStyle = () => {
		if (!theme) return {};

		return {
			fontFamily: theme.fontFamily,
			fontSize: theme.fontSize,
			backgroundColor: glass ? "rgba(255, 255, 255, 0.1)" : "white",
			backdropFilter: glass ? "blur(16px)" : "none",
			border: glass
				? "1px solid rgba(255, 255, 255, 0.2)"
				: "1px solid #d1d5db",
		};
	};

	return (
		<input
			type={type}
			placeholder={placeholder}
			className={`
        ${sizeClasses[size]}
        w-full rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1
        hover:border-opacity-70
      `}
			style={{
				...getInputStyle(),
				"--tw-ring-color": theme?.primary || "#3b82f6",
				borderColor: glass ? "rgba(255, 255, 255, 0.2)" : "#d1d5db",
			}}
		/>
	);
};

const BadgeComponent: React.FC<{
	variant?: "default" | "success" | "warning" | "error";
	size?: "sm" | "md" | "lg";
	children?: React.ReactNode;
	theme?: Theme;
}> = ({ variant = "default", size = "md", children = "Badge", theme }) => {
	const sizeClasses = {
		sm: "px-2 py-0.5 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-1.5 text-base",
	};

	const getBadgeStyle = () => {
		if (!theme) return {};

		const baseStyle = {
			fontFamily: theme.fontFamily,
		};

		switch (variant) {
			case "success":
				return {
					...baseStyle,
					backgroundColor: `${theme.primary}20`,
					color: theme.primary,
				};
			case "default":
				return {
					...baseStyle,
					backgroundColor: "#e5e7eb",
					color: theme.text || "#374151",
				};
			case "warning":
				return {
					...baseStyle,
					backgroundColor: "#fef3c7",
					color: "#92400e",
				};
			case "error":
				return {
					...baseStyle,
					backgroundColor: "#fee2e2",
					color: "#dc2626",
				};
			default:
				return baseStyle;
		}
	};

	return (
		<span
			className={`
        ${sizeClasses[size]} 
        inline-flex items-center rounded-full font-medium
      `}
			style={getBadgeStyle()}
		>
			{children}
		</span>
	);
};

const ToggleComponent: React.FC<{
	checked?: boolean;
	size?: "sm" | "md" | "lg";
	label?: string;
	theme?: Theme;
}> = ({ checked = false, size = "md", label = "Toggle me", theme }) => {
	const [isChecked, setIsChecked] = useState(checked);

	const sizeClasses = {
		sm: "w-8 h-4",
		md: "w-12 h-6",
		lg: "w-16 h-8",
	};

	const dotSizes = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-6 h-6",
	};

	const dotPositions = {
		sm: isChecked ? "translate-x-4.5" : "translate-x-0.5",
		md: isChecked ? "translate-x-7" : "translate-x-1",
		lg: isChecked ? "translate-x-9" : "translate-x-1",
	};

	const getToggleStyle = () => {
		if (!theme) return {};

		if (isChecked) {
			return {
				background: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`,
			};
		}
		return { backgroundColor: "#d1d5db" };
	};

	return (
		<label
			className="flex items-center gap-3 cursor-pointer"
			style={{ fontFamily: theme?.fontFamily }}
		>
			<div className="relative flex items-center">
				<button
					onClick={() => setIsChecked(!isChecked)}
					className={`
            ${sizeClasses[size]} rounded-full transition-all duration-300 relative flex items-center
          `}
					style={getToggleStyle()}
				>
					<div
						className={`
              ${dotSizes[size]} bg-white rounded-full transition-transform duration-300 shadow-lg
              absolute ${dotPositions[size]}
            `}
					/>
				</button>
			</div>
			<span
				className="font-medium"
				style={{
					color: theme?.primary || "#374151",
					fontSize: theme?.fontSize,
				}}
			>
				{label}
			</span>
		</label>
	);
};

const AlertComponent: React.FC<{
	variant?: "info" | "success" | "warning" | "error";
	title?: string;
	children?: React.ReactNode;
	theme?: Theme;
}> = ({
	variant = "info",
	title = "Alert Title",
	children = "This is an alert message.",
	theme,
}) => {
	const variantClasses = {
		info: "bg-blue-50 border-blue-200 text-blue-800",
		success: "bg-green-50 border-green-200 text-green-800",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
		error: "bg-red-50 border-red-200 text-red-800",
	};

	return (
		<div
			className={`
        ${variantClasses[variant]}
        p-4 rounded-lg border-l-4 
      `}
			style={{
				fontFamily: theme?.fontFamily,
				fontSize: theme?.fontSize,
			}}
		>
			<h4 className="font-semibold mb-1">{title}</h4>
			<p className="text-sm">{children}</p>
		</div>
	);
};

const CustomDropdown: React.FC<{
	value: string;
	options: string[];
	onChange: (value: string) => void;
	placeholder?: string;
}> = ({ value, options, onChange, placeholder = "Select..." }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
           transition-all flex items-center justify-between text-left shadow-sm hover:shadow-md
           text-slate-900 font-medium"
			>
				<span className={value ? "text-gray-900" : "text-gray-500"}>
					{value || placeholder}
				</span>
				<HiChevronDown
					className={`ml-2 w-4 h-4 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div
					className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl 
          border border-white/30 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto"
				>
					{options.map((option) => (
						<button
							key={option}
							onClick={() => {
								onChange(option);
								setIsOpen(false);
							}}
							className="w-full px-4 py-3 text-left hover:bg-white/80 transition-colors text-slate-800 font-medium
           first:rounded-t-xl last:rounded-b-xl hover:text-slate-900"
						>
							{option}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const CopyButton: React.FC<{ code: string }> = ({ code }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 backdrop-blur-sm 
                 border border-white/30 hover:bg-white/30 transition-all text-sm font-medium
                 shadow-lg hover:shadow-xl transform hover:scale-105"
		>
			{copied ? (
				<>
					<HiCheck className="w-4 h-4 text-green-600" />
					<span className="text-green-600">Copied!</span>
				</>
			) : (
				<>
					<HiClipboardCopy className="w-4 h-4" />
					<span className="hidden md:block">Copy Code</span>
				</>
			)}
		</button>
	);
};

const AccordionSection: React.FC<{
	title: string;
	icon: React.ReactNode;
	isExpanded: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}> = ({ title, icon, isExpanded, onToggle, children }) => {
	return (
		<div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/30 shadow-lg overflow-hidden">
			<button
				onClick={onToggle}
				className="w-full p-4 flex items-center justify-between text-left hover:bg-white/50 transition-all"
			>
				<div className="flex items-center gap-2">
					{icon}
					<h3 className="text-lg font-bold text-slate-800">{title}</h3>
				</div>
				<HiChevronDown
					className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isExpanded && (
				<div className="p-4 pt-0 border-t border-gray-200/30">{children}</div>
			)}
		</div>
	);
};

export default function StyleGuideBuilderExport() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState<Component | null>(
		null
	);
	const [deviceSize, setDeviceSize] = useState<DeviceSize>({
		name: "Desktop",
		width: 1200,
		height: 800,
		breakpoint: "lg",
	});
	const [theme, setTheme] = useState<Theme>({
		primary: "#0891b2",
		secondary: "#3b82f6",
		background: "#f8fafc",
		text: "#1e293b",
		fontFamily: "Poppins",
		fontSize: "16px",
	});
	const [propValues, setPropValues] = useState<Record<string, any>>({});
	const [searchQuery, setSearchQuery] = useState("");
	const [isExporting, setIsExporting] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);
	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>({
		props: true,
		theme: false,
		info: false,
		stats: false,
	});

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const deviceSizes: DeviceSize[] = [
		{ name: "Mobile", width: 320, height: 568, breakpoint: "sm" },
		{ name: "Tablet", width: 768, height: 1024, breakpoint: "md" },
		{ name: "Desktop", width: 1024, height: 768, breakpoint: "lg" },
	];

	const components: Component[] = [
		{
			id: "button",
			name: "Button",
			category: "Controls",
			props: [
				{
					name: "variant",
					type: "select",
					defaultValue: "primary",
					description: "Button style variant",
					options: ["primary", "secondary", "glass", "outline"],
				},
				{
					name: "size",
					type: "select",
					defaultValue: "md",
					description: "Button size",
					options: ["sm", "md", "lg"],
				},
				{
					name: "children",
					type: "string",
					defaultValue: "Click me",
					description: "Button text content",
				},
				{
					name: "disabled",
					type: "boolean",
					defaultValue: false,
					description: "Disable the button",
				},
				{
					name: "rounded",
					type: "boolean",
					defaultValue: false,
					description: "Make button fully rounded",
				},
			],
			code: `<Button variant="primary" size="md">Click me</Button>`,
			preview: ButtonComponent,
		},
		{
			id: "card",
			name: "Card",
			category: "Layout",
			props: [
				{
					name: "title",
					type: "string",
					defaultValue: "Card Title",
					description: "Card header text",
				},
				{
					name: "description",
					type: "string",
					defaultValue: "Card description goes here",
					description: "Card body text",
				},
				{
					name: "glass",
					type: "boolean",
					defaultValue: false,
					description: "Enable glassmorphism style",
				},
				{
					name: "elevated",
					type: "boolean",
					defaultValue: true,
					description: "Enable hover elevation effect",
				},
			],
			code: `<Card title="Example" description="This is a card" glass={true} />`,
			preview: CardComponent,
		},
		{
			id: "input",
			name: "Input",
			category: "Forms",
			props: [
				{
					name: "placeholder",
					type: "string",
					defaultValue: "Enter text...",
					description: "Placeholder text",
				},
				{
					name: "type",
					type: "select",
					defaultValue: "text",
					description: "Input type",
					options: ["text", "email", "password", "number"],
				},
				{
					name: "glass",
					type: "boolean",
					defaultValue: false,
					description: "Enable glassmorphism style",
				},
				{
					name: "size",
					type: "select",
					defaultValue: "md",
					description: "Input size",
					options: ["sm", "md", "lg"],
				},
			],
			code: `<Input placeholder="Enter text..." type="text" />`,
			preview: InputComponent,
		},
		{
			id: "badge",
			name: "Badge",
			category: "Display",
			props: [
				{
					name: "variant",
					type: "select",
					defaultValue: "default",
					description: "Badge style variant",
					options: ["default", "success", "warning", "error"],
				},
				{
					name: "size",
					type: "select",
					defaultValue: "md",
					description: "Badge size",
					options: ["sm", "md", "lg"],
				},
				{
					name: "children",
					type: "string",
					defaultValue: "Badge",
					description: "Badge text content",
				},
			],
			code: `<Badge variant="success" size="md">New</Badge>`,
			preview: BadgeComponent,
		},
		{
			id: "toggle",
			name: "Toggle",
			category: "Forms",
			props: [
				{
					name: "checked",
					type: "boolean",
					defaultValue: false,
					description: "Toggle state",
				},
				{
					name: "size",
					type: "select",
					defaultValue: "md",
					description: "Toggle size",
					options: ["sm", "md", "lg"],
				},
				{
					name: "label",
					type: "string",
					defaultValue: "Toggle me",
					description: "Toggle label text",
				},
			],
			code: `<Toggle checked={true} label="Enable feature" />`,
			preview: ToggleComponent,
		},
		{
			id: "alert",
			name: "Alert",
			category: "Feedback",
			props: [
				{
					name: "variant",
					type: "select",
					defaultValue: "info",
					description: "Alert variant",
					options: ["info", "success", "warning", "error"],
				},
				{
					name: "title",
					type: "string",
					defaultValue: "Alert Title",
					description: "Alert title",
				},
				{
					name: "children",
					type: "string",
					defaultValue: "This is an alert message.",
					description: "Alert message content",
				},
			],
			code: `<Alert variant="success" title="Success!">Operation completed successfully.</Alert>`,
			preview: AlertComponent,
		},
	];

	const filteredComponents = useMemo(() => {
		return components.filter(
			(comp) =>
				comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				comp.category.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [searchQuery]);

	useEffect(() => {
		if (selectedComponent) {
			const initialValues: Record<string, any> = {};
			selectedComponent.props.forEach((prop) => {
				initialValues[prop.name] = prop.defaultValue;
			});
			setPropValues(initialValues);
		}
	}, [selectedComponent]);

	useEffect(() => {
		if (components.length > 0 && !selectedComponent) {
			setSelectedComponent(components[0]);
		}
	}, []);
	useEffect(() => {
		loadPoppinsFont();
	}, []);

	const exportToPDF = async () => {
		setIsExporting(true);
		try {
			const currentComponent = selectedComponent;
			if (!currentComponent) {
				alert("Please select a component first");
				setIsExporting(false);
				return;
			}

			const currentProps = propValues;
			const currentDeviceSize = deviceSize;

			const generateComponentHTML = () => {
				if (currentComponent.id === "button") {
					const sizeStyles = {
						sm: "padding: 6px 12px; font-size: 14px;",
						md: "padding: 8px 16px; font-size: 16px;",
						lg: "padding: 12px 24px; font-size: 18px;",
					};

					const variantStyles = {
						primary: `background-color: ${theme.primary}; color: white;`,
						secondary: `background-color: ${theme.secondary}; color: white;`,
						glass: `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.2); color: ${theme.primary};`,
						outline: `background: transparent; border: 2px solid ${theme.primary}; color: ${theme.primary};`,
					};

					const buttonStyle = `
          ${sizeStyles[(currentProps.size as keyof typeof sizeStyles) || "md"]}
          ${
						variantStyles[
							(currentProps.variant as keyof typeof variantStyles) || "primary"
						]
					}
          font-family: ${theme.fontFamily};
          border-radius: ${currentProps.rounded ? "50px" : "8px"};
          border: ${
						currentProps.variant === "outline"
							? `2px solid ${theme.primary}`
							: "none"
					};
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: ${currentProps.disabled ? "0.5" : "1"};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

					return `<button style="${buttonStyle}" ${
						currentProps.disabled ? "disabled" : ""
					}>${currentProps.children || "Click me"}</button>`;
				}

				if (currentComponent.id === "card") {
					const cardStyle = `
          padding: 24px;
          border-radius: ${currentProps.glass ? "16px" : "12px"};
          background: ${
						currentProps.glass ? "rgba(255, 255, 255, 0.1)" : "white"
					};
          border: ${
						currentProps.glass
							? "1px solid rgba(255, 255, 255, 0.2)"
							: "1px solid #e2e8f0"
					};
          box-shadow: ${
						currentProps.elevated
							? "0 25px 50px rgba(0, 0, 0, 0.25)"
							: "0 4px 6px rgba(0, 0, 0, 0.1)"
					};
          backdrop-filter: ${currentProps.glass ? "blur(16px)" : "none"};
          max-width: 300px;
          font-family: ${theme.fontFamily};
          font-size: ${theme.fontSize};
          transition: all 0.3s ease;
        `;

					return `
          <div style="${cardStyle}">
            ${
							currentProps.title
								? `<h3 style="color: ${theme.primary}; font-size: 20px; font-weight: bold; margin-bottom: 8px;">${currentProps.title}</h3>`
								: ""
						}
            ${
							currentProps.description
								? `<p style="color: ${theme.text}; margin: 0;">${currentProps.description}</p>`
								: ""
						}
          </div>
        `;
				}

				if (currentComponent.id === "input") {
					const sizeStyles = {
						sm: "padding: 8px 12px; font-size: 14px;",
						md: "padding: 12px 16px; font-size: 16px;",
						lg: "padding: 16px 20px; font-size: 18px;",
					};

					const inputStyle = `
          ${sizeStyles[(currentProps.size as keyof typeof sizeStyles) || "md"]}
          width: 100%;
          max-width: 300px;
          border-radius: 8px;
          border: ${
						currentProps.glass
							? "1px solid rgba(255, 255, 255, 0.2)"
							: "1px solid #d1d5db"
					};
          background: ${
						currentProps.glass ? "rgba(255, 255, 255, 0.1)" : "white"
					};
          backdrop-filter: ${currentProps.glass ? "blur(16px)" : "none"};
          font-family: ${theme.fontFamily};
          font-size: ${theme.fontSize};
          transition: all 0.2s ease;
          outline: none;
        `;

					return `<input type="${currentProps.type || "text"}" placeholder="${
						currentProps.placeholder || "Enter text..."
					}" style="${inputStyle}" />`;
				}

				if (currentComponent.id === "badge") {
					const sizeStyles = {
						sm: "padding: 2px 8px; font-size: 12px;",
						md: "padding: 4px 12px; font-size: 14px;",
						lg: "padding: 6px 16px; font-size: 16px;",
					};

					const getBadgeColors = (variant: string) => {
						switch (variant) {
							case "success":
								return {
									bg: `${theme.primary}20`,
									color: theme.primary,
									border: `${theme.primary}50`,
								};
							case "warning":
								return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
							case "error":
								return { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
							default:
								return {
									bg: "#e5e7eb",
									color: theme.text,
									border: "transparent",
								};
						}
					};

					const badgeColors = getBadgeColors(currentProps.variant);
					const badgeStyle = `
          ${sizeStyles[(currentProps.size as keyof typeof sizeStyles) || "md"]}
          display: inline-block;
          border-radius: 50px;
          background: ${badgeColors.bg};
          color: ${badgeColors.color};
          border: 1px solid ${badgeColors.border};
          font-weight: 500;
          font-family: ${theme.fontFamily};
        `;

					return `<span style="${badgeStyle}">${
						currentProps.children || "Badge"
					}</span>`;
				}

				if (currentComponent.id === "toggle") {
					const toggleSizes = {
						sm: { w: 32, h: 16, dot: 12 },
						md: { w: 48, h: 24, dot: 16 },
						lg: { w: 64, h: 32, dot: 24 },
					};

					const size =
						toggleSizes[
							(currentProps.size as keyof typeof toggleSizes) || "md"
						];
					const isChecked = currentProps.checked;

					const toggleStyle = `
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: ${theme.fontFamily};
          font-size: ${theme.fontSize};
        `;

					const switchStyle = `
          position: relative;
          width: ${size.w}px;
          height: ${size.h}px;
          border-radius: ${size.h}px;
          background: ${
						isChecked
							? `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`
							: "#d1d5db"
					};
          transition: all 0.3s ease;
          cursor: pointer;
        `;

					const dotStyle = `
          position: absolute;
          top: 2px;
          left: ${isChecked ? size.w - size.dot - 2 : 2}px;
          width: ${size.dot}px;
          height: ${size.dot}px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        `;

					return `
          <div style="${toggleStyle}">
            <div style="${switchStyle}">
              <div style="${dotStyle}"></div>
            </div>
            <span style="color: ${theme.primary}; font-weight: 500;">${
						currentProps.label || "Toggle me"
					}</span>
          </div>
        `;
				}

				if (currentComponent.id === "alert") {
					const getAlertColors = (variant: string) => {
						switch (variant) {
							case "success":
								return { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" };
							case "warning":
								return { bg: "#fffbeb", border: "#fef3c7", text: "#92400e" };
							case "error":
								return { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626" };
							default:
								return { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" };
						}
					};

					const alertColors = getAlertColors(currentProps.variant);
					const alertStyle = `
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid ${alertColors.border};
          background: ${alertColors.bg};
          color: ${alertColors.text};
          max-width: 400px;
          font-family: ${theme.fontFamily};
          font-size: ${theme.fontSize};
        `;

					return `
          <div style="${alertStyle}">
            <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 0;">${
							currentProps.title || "Alert Title"
						}</h4>
            <p style="font-size: 14px; margin: 0;">${
							currentProps.children || "This is an alert message."
						}</p>
          </div>
        `;
				}

				return `<div style="padding: 20px; background: #f5f5f5; border-radius: 8px; text-align: center; color: #666; font-family: ${theme.fontFamily};">Component preview not available for ${currentComponent.name}</div>`;
			};

			const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentComponent.name} Component - Style Guide</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${theme.primary};
      --secondary: ${theme.secondary};
      --background: ${theme.background};
      --text: ${theme.text};
    }
    
    body {
      font-family: ${theme.fontFamily};
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: var(--text);
      margin: 0;
      padding: 2rem;
      line-height: 1.6;
    }
    
    .glass {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-radius: 16px;
    }
    
    .preview-container {
      width: 100%;
      max-width: ${currentDeviceSize.width}px;
      font-family: ${theme.fontFamily};
      font-size: ${theme.fontSize};
      margin: 0 auto;
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    
    .code-block {
      background: #1a202c;
      color: #68d391;
      padding: 1rem;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      overflow-x: auto;
    }
    
    .prop-grid {
      display: grid;
      gap: 0.5rem;
    }
    
    .prop-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 8px;
    }
    
    .config-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .preview-container { max-width: 100%; font-size: 14px; padding: 2rem; }
      body { padding: 1rem; }
      .main-grid { grid-template-columns: 1fr; }
    }
    
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    @media print {
      body { background: white; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div style="max-width: 1200px; margin: 0 auto;">
    <header class="glass" style="padding: 2rem; text-align: center; margin-bottom: 2rem;">
      <h1 style="color: var(--primary); font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">
        ${currentComponent.name} Component
      </h1>
      <p style="color: var(--text); opacity: 0.8; font-size: 1.1rem;">
        Generated on ${new Date().toLocaleDateString()} • Optimized for ${
				currentDeviceSize.name
			} (${currentDeviceSize.width}×${currentDeviceSize.height})
      </p>
      <div style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 20px; display: inline-block;">
        <span style="color: #3b82f6; font-weight: 600;">${
					currentComponent.category
				}</span>
      </div>
    </header>
    
    <div class="main-grid">
      <div>
        <div class="glass" style="padding: 2rem; margin-bottom: 2rem;">
          <h2 style="color: var(--primary); font-size: 1.5rem; margin-bottom: 1rem;">Live Preview</h2>
          <div class="preview-container">
            ${generateComponentHTML()}
          </div>
          <div style="text-align: center; margin-top: 1rem; font-size: 14px; color: #6b7280;">
            Current props: ${Object.entries(currentProps)
							.map(([k, v]) => `${k}="${v}"`)
							.join(", ")}
          </div>
        </div>
      </div>
      
      <div>
        <div class="glass" style="padding: 2rem; margin-bottom: 2rem;">
          <h2 style="color: var(--secondary); font-size: 1.5rem; margin-bottom: 1rem;">Component Details</h2>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Code Example</h3>
            <div class="code-block">${currentComponent.code}</div>
          </div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Properties</h3>
            <div class="prop-grid">
              ${currentComponent.props
								.map(
									(prop) => `
                <div class="prop-row">
                  <span style="font-weight: 600;">${prop.name}</span>
                  <div style="text-align: right;">
                    <div style="font-size: 12px; color: #6b7280;">${
											prop.type
										}</div>
                    <div style="font-size: 11px; color: #9ca3af;">Default: ${
											prop.defaultValue || "none"
										}</div>
                  </div>
                </div>
              `
								)
								.join("")}
            </div>
          </div>
          
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Current Configuration</h3>
            <div style="background: #f7fafc; padding: 1rem; border-radius: 8px;">
              <div class="config-grid">
                <div><strong>Device:</strong> ${currentDeviceSize.name}</div>
                <div><strong>Width:</strong> ${currentDeviceSize.width}px</div>
                <div><strong>Primary:</strong> ${theme.primary}</div>
                <div><strong>Secondary:</strong> ${theme.secondary}</div>
                <div><strong>Font:</strong> ${
									theme.fontFamily.split(",")[0]
								}</div>
                <div><strong>Size:</strong> ${theme.fontSize}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <footer class="glass" style="text-align: center; padding: 1.5rem; margin-top: 2rem;">
      <p style="font-size: 14px; color: #6b7280;">
        Generated with Style Guide Builder • ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
      </p>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 0.5rem;">
        Create beautiful, consistent UI components for your projects
      </p>
    </footer>
  </div>
</body>
</html>`;

			const printWindow = window.open("", "_blank");

			if (printWindow) {
				printWindow.document.write(htmlContent);
				printWindow.document.close();

				setTimeout(() => {
					printWindow.print();
					printWindow.close();
				}, 1000);
			}
		} catch (error) {
			console.error("Error exporting PDF:", error);
			alert("Error generating PDF. Please try again.");
		} finally {
			setIsExporting(false);
		}
	};

	const exportToHTML = () => {
		setIsExporting(true);
		try {
			const currentComponent = selectedComponent;
			if (!currentComponent) {
				alert("Please select a component first");
				setIsExporting(false);
				return;
			}

			const currentProps = propValues;
			const currentDeviceSize = deviceSize;

			const generateComponentHTML = () => {
				if (currentComponent.id === "button") {
					const sizeStyles = {
						sm: "padding: 6px 12px; font-size: 14px;",
						md: "padding: 8px 16px; font-size: 16px;",
						lg: "padding: 12px 24px; font-size: 18px;",
					};

					const variantStyles = {
						primary: `background-color: ${theme.primary}; color: white;`,
						secondary: `background-color: ${theme.secondary}; color: white;`,
						glass: `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.2); color: ${theme.primary};`,
						outline: `background: transparent; border: 2px solid ${theme.primary}; color: ${theme.primary};`,
					};

					const buttonStyle = `
      ${sizeStyles[(currentProps.size as keyof typeof sizeStyles) || "md"]}
      ${
				variantStyles[
					(currentProps.variant as keyof typeof variantStyles) || "primary"
				]
			}
      font-family: ${theme.fontFamily};
      border-radius: ${currentProps.rounded ? "50px" : "8px"};
      border: ${
				currentProps.variant === "outline"
					? `2px solid ${theme.primary}`
					: "none"
			};
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: ${currentProps.disabled ? "0.5" : "1"};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

					return `<button style="${buttonStyle}" ${
						currentProps.disabled ? "disabled" : ""
					}>${currentProps.children || "Click me"}</button>`;
				}

				if (currentComponent.id === "card") {
					const cardStyle = `
      padding: 24px;
      border-radius: ${currentProps.glass ? "16px" : "12px"};
      background: ${currentProps.glass ? "rgba(255, 255, 255, 0.1)" : "white"};
      border: ${
				currentProps.glass
					? "1px solid rgba(255, 255, 255, 0.2)"
					: "1px solid #e2e8f0"
			};
      box-shadow: ${
				currentProps.elevated
					? "0 25px 50px rgba(0, 0, 0, 0.25)"
					: "0 4px 6px rgba(0, 0, 0, 0.1)"
			};
      backdrop-filter: ${currentProps.glass ? "blur(16px)" : "none"};
      max-width: 300px;
      font-family: ${theme.fontFamily};
      font-size: ${theme.fontSize};
      transition: all 0.3s ease;
    `;

					return `
      <div style="${cardStyle}">
        ${
					currentProps.title
						? `<h3 style="color: ${theme.primary}; font-size: 20px; font-weight: bold; margin-bottom: 8px;">${currentProps.title}</h3>`
						: ""
				}
        ${
					currentProps.description
						? `<p style="color: ${theme.text}; margin: 0;">${currentProps.description}</p>`
						: ""
				}
      </div>
    `;
				}

				if (currentComponent.id === "input") {
					const sizeStyles = {
						sm: "padding: 8px 12px; font-size: 14px;",
						md: "padding: 12px 16px; font-size: 16px;",
						lg: "padding: 16px 20px; font-size: 18px;",
					};

					const inputStyle = `
      ${sizeStyles[(currentProps.size as keyof typeof sizeStyles) || "md"]}
      width: 100%;
      max-width: 300px;
      border-radius: 8px;
      border: ${
				currentProps.glass
					? "1px solid rgba(255, 255, 255, 0.2)"
					: "1px solid #d1d5db"
			};
      background: ${currentProps.glass ? "rgba(255, 255, 255, 0.1)" : "white"};
      backdrop-filter: ${currentProps.glass ? "blur(16px)" : "none"};
      font-family: ${theme.fontFamily};
      font-size: ${theme.fontSize};
      transition: all 0.2s ease;
      outline: none;
    `;

					return `<input type="${currentProps.type || "text"}" placeholder="${
						currentProps.placeholder || "Enter text..."
					}" style="${inputStyle}" />`;
				}

				if (currentComponent.id === "badge") {
					const sizeStyles = {
						sm: "padding: 2px 8px; font-size: 12px;",
						md: "padding: 4px 12px; font-size: 14px;",
						lg: "padding: 6px 16px; font-size: 16px;",
					};

					const getBadgeColors = (variant: string) => {
						switch (variant) {
							case "success":
								return {
									bg: `${theme.primary}20`,
									color: theme.primary,
									border: `${theme.primary}50`,
								};
							case "warning":
								return {
									bg: "#fef3c7",
									color: "#92400e",
									border: "#fde68a",
								};
							case "error":
								return {
									bg: "#fee2e2",
									color: "#dc2626",
									border: "#fca5a5",
								};
							default:
								return {
									bg: "#e5e7eb",
									color: theme.text,
									border: "transparent",
								};
						}
					};

					const badgeColors = getBadgeColors(currentProps.variant);
					const badgeStyle = `
      ${sizeStyles[(currentProps.size as keyof typeof sizeStyles) || "md"]}
      display: inline-block;
      border-radius: 50px;
      background: ${badgeColors.bg};
      color: ${badgeColors.color};
      border: 1px solid ${badgeColors.border};
      font-weight: 500;
      font-family: ${theme.fontFamily};
    `;

					return `<span style="${badgeStyle}">${
						currentProps.children || "Badge"
					}</span>`;
				}

				if (currentComponent.id === "toggle") {
					const toggleSizes = {
						sm: { w: 32, h: 16, dot: 12 },
						md: { w: 48, h: 24, dot: 16 },
						lg: { w: 64, h: 32, dot: 24 },
					};

					const size =
						toggleSizes[
							(currentProps.size as keyof typeof toggleSizes) || "md"
						];
					const isChecked = currentProps.checked;

					const toggleStyle = `
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: ${theme.fontFamily};
      font-size: ${theme.fontSize};
    `;

					const switchStyle = `
      position: relative;
      width: ${size.w}px;
      height: ${size.h}px;
      border-radius: ${size.h}px;
      background: ${
				isChecked
					? `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`
					: "#d1d5db"
			};
      transition: all 0.3s ease;
      cursor: pointer;
    `;

					const dotStyle = `
      position: absolute;
      top: 2px;
      left: ${isChecked ? size.w - size.dot - 2 : 2}px;
      width: ${size.dot}px;
      height: ${size.dot}px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    `;

					return `
      <div style="${toggleStyle}">
        <div style="${switchStyle}">
          <div style="${dotStyle}"></div>
        </div>
        <span style="color: ${theme.primary}; font-weight: 500;">${
						currentProps.label || "Toggle me"
					}</span>
      </div>
    `;
				}

				if (currentComponent.id === "alert") {
					const getAlertColors = (variant: string) => {
						switch (variant) {
							case "success":
								return {
									bg: "#f0fdf4",
									border: "#bbf7d0",
									text: "#166534",
								};
							case "warning":
								return {
									bg: "#fffbeb",
									border: "#fef3c7",
									text: "#92400e",
								};
							case "error":
								return {
									bg: "#fef2f2",
									border: "#fca5a5",
									text: "#dc2626",
								};
							default:
								return {
									bg: "#eff6ff",
									border: "#bfdbfe",
									text: "#1e40af",
								};
						}
					};

					const alertColors = getAlertColors(currentProps.variant);
					const alertStyle = `
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid ${alertColors.border};
      background: ${alertColors.bg};
      color: ${alertColors.text};
      max-width: 400px;
      font-family: ${theme.fontFamily};
      font-size: ${theme.fontSize};
    `;

					return `
      <div style="${alertStyle}">
        <h4 style="font-weight: 600; margin-bottom: 4px; margin-top: 0;">${
					currentProps.title || "Alert Title"
				}</h4>
        <p style="font-size: 14px; margin: 0;">${
					currentProps.children || "This is an alert message."
				}</p>
      </div>
    `;
				}

				return `<div style="padding: 20px; background: #f5f5f5; border-radius: 8px; text-align: center; color: #666; font-family: ${theme.fontFamily};">Component preview not available for ${currentComponent.name}</div>`;
			};

			const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${currentComponent.name} Component - Style Guide</title>
          <style>
            :root {
              --primary: ${theme.primary};
              --secondary: ${theme.secondary};
              --background: ${theme.background};
              --text: ${theme.text};
            }
            
            body {
              font-family: ${theme.fontFamily};
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              color: var(--text);
              margin: 0;
              padding: 2rem;
              line-height: 1.6;
            }
            
            .glass {
              background: rgba(255, 255, 255, 0.9);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              border-radius: 16px;
            }
            
            .preview-container {
              width: 100%;
              max-width: ${currentDeviceSize.width}px;
              font-family: ${theme.fontFamily};
              font-size: ${theme.fontSize};
              margin: 0 auto;
              background: white;
              padding: 3rem;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 200px;
            }
            
            .code-block {
              background: #1a202c;
              color: #68d391;
              padding: 1rem;
              border-radius: 8px;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              overflow-x: auto;
            }
            
            .prop-grid {
              display: grid;
              gap: 0.5rem;
            }
            
            .prop-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0.75rem;
              background: #f7fafc;
              border-radius: 8px;
            }
            
            .config-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem;
              font-size: 14px;
            }
            
            @media (max-width: 768px) {
              .preview-container { max-width: 100%; font-size: 14px; padding: 2rem; }
              body { padding: 1rem; }
              .main-grid { grid-template-columns: 1fr; }
            }
            
            .main-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 2rem;
            }
          </style>
          </head>
          <body>
            <div style="max-width: 1200px; margin: 0 auto;">
              <header class="glass" style="padding: 2rem; text-align: center; margin-bottom: 2rem;">
                <h1 style="color: var(--primary); font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">
                  ${currentComponent.name} Component
                </h1>
                <p style="color: var(--text); opacity: 0.8; font-size: 1.1rem;">
                  Generated on ${new Date().toLocaleDateString()} • Optimized for ${
				currentDeviceSize.name
			} (${currentDeviceSize.width}×${currentDeviceSize.height})
                </p>
                <div style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 20px; display: inline-block;">
                  <span style="color: #3b82f6; font-weight: 600;">${
										currentComponent.category
									}</span>
                </div>
              </header>
              
              <div class="main-grid">
                <div>
                  <div class="glass" style="padding: 2rem; margin-bottom: 2rem;">
                    <h2 style="color: var(--primary); font-size: 1.5rem; margin-bottom: 1rem;">Live Preview</h2>
                    <div class="preview-container">
                      ${generateComponentHTML()}
                    </div>
                    <div style="text-align: center; margin-top: 1rem; font-size: 14px; color: #6b7280;">
                      Current props: ${Object.entries(currentProps)
												.map(([k, v]) => `${k}="${v}"`)
												.join(", ")}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div class="glass" style="padding: 2rem; margin-bottom: 2rem;">
                    <h2 style="color: var(--secondary); font-size: 1.5rem; margin-bottom: 1rem;">Component Details</h2>
                    
                    <div style="margin-bottom: 2rem;">
                      <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Code Example</h3>
                      <div class="code-block">${currentComponent.code}</div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                      <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Properties</h3>
                      <div class="prop-grid">
                        ${currentComponent.props
													.map(
														(prop) => `
                          <div class="prop-row">
                            <span style="font-weight: 600;">${prop.name}</span>
                            <div style="text-align: right;">
                              <div style="font-size: 12px; color: #6b7280;">${
																prop.type
															}</div>
                              <div style="font-size: 11px; color: #9ca3af;">Default: ${
																prop.defaultValue || "none"
															}</div>
                            </div>
                          </div>
                        `
													)
													.join("")}
                      </div>
                    </div>
                    
                    <div>
                      <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Current Configuration</h3>
                      <div style="background: #f7fafc; padding: 1rem; border-radius: 8px;">
                        <div class="config-grid">
                          <div><strong>Device:</strong> ${
														currentDeviceSize.name
													}</div>
                          <div><strong>Width:</strong> ${
														currentDeviceSize.width
													}px</div>
                          <div><strong>Primary:</strong> ${theme.primary}</div>
                          <div><strong>Secondary:</strong> ${
														theme.secondary
													}</div>
                          <div><strong>Font:</strong> ${
														theme.fontFamily.split(",")[0]
													}</div>
                          <div><strong>Size:</strong> ${theme.fontSize}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <footer class="glass" style="text-align: center; padding: 1.5rem; margin-top: 2rem;">
                <p style="font-size: 14px; color: #6b7280;">
                  Generated with Style Guide Builder • ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
                </p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 0.5rem;">
                  Create beautiful, consistent UI components for your projects
                </p>
              </footer>
            </div>
          </body>
          </html>`;

			const blob = new Blob([htmlContent], { type: "text/html" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${currentComponent.name.toLowerCase()}-${currentDeviceSize.name.toLowerCase()}-${
				new Date().toISOString().split("T")[0]
			}.html`;
			a.click();
			URL.revokeObjectURL(url);
		} finally {
			setIsExporting(false);
		}
	};

	const renderPropInput = (prop: ComponentProp) => {
		const value = propValues[prop.name];

		switch (prop.type) {
			case "boolean":
				return (
					<button
						onClick={() =>
							setPropValues((prev) => ({
								...prev,
								[prop.name]: !prev[prop.name],
							}))
						}
						className={`
              relative w-12 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50
              ${
								value
									? "bg-gradient-to-r from-cyan-500 to-blue-500"
									: "bg-gray-300"
							}
            `}
					>
						<div
							className={`
              absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-md
              ${value ? "translate-x-6" : "translate-x-1"}
            `}
						/>
					</button>
				);

			case "select":
				return (
					<CustomDropdown
						value={value || ""}
						options={prop.options || []}
						onChange={(newValue) =>
							setPropValues((prev) => ({ ...prev, [prop.name]: newValue }))
						}
					/>
				);

			case "color":
				return (
					<input
						type="color"
						value={value || "#000000"}
						onChange={(e) =>
							setPropValues((prev) => ({
								...prev,
								[prop.name]: e.target.value,
							}))
						}
						className="w-12 h-8 rounded border border-white/30 cursor-pointer"
					/>
				);

			case "number":
				return (
					<input
						type="number"
						value={value || ""}
						onChange={(e) =>
							setPropValues((prev) => ({
								...prev,
								[prop.name]: Number(e.target.value),
							}))
						}
						className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-300 
         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
         transition-all shadow-sm hover:shadow-md text-slate-900"
					/>
				);

			default:
				return (
					<input
						type="text"
						value={value || ""}
						onChange={(e) =>
							setPropValues((prev) => ({
								...prev,
								[prop.name]: e.target.value,
							}))
						}
						className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-300 
         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
         transition-all shadow-sm hover:shadow-md text-slate-900"
						placeholder={prop.defaultValue}
					/>
				);
		}
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
			style={{ fontFamily: "Poppins" }}
		>
			<style>
				{`
					button,
					a {
						cursor: pointer;
					}
				`}
			</style>
			{}
			<div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/10 pointer-events-none" />

			{}
			{isDrawerOpen && (
				<div
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setIsDrawerOpen(false)}
				/>
			)}

			{}
			<div
				className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
        bg-white/20 backdrop-blur-2xl border-r border-white/30 shadow-2xl
      `}
			>
				<div className="p-6 h-full overflow-y-auto">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
							Components
						</h2>
						<button
							onClick={() => setIsDrawerOpen(false)}
							className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all"
							aria-label="Close drawer"
						>
							<HiX className="w-5 h-5" />
						</button>
					</div>

					{}
					<div className="mb-6">
						<div className="relative">
							<input
								type="text"
								placeholder="Search components..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/30 backdrop-blur-md border border-white/30 
         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
         transition-all shadow-lg hover:shadow-xl text-slate-900 placeholder-slate-600"
							/>
							<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
								<HiSearch className="w-4 h-4" />
							</div>
						</div>
					</div>

					{}
					<div className="space-y-2">
						{Object.entries(
							filteredComponents.reduce((acc, comp) => {
								if (!acc[comp.category]) acc[comp.category] = [];
								acc[comp.category].push(comp);
								return acc;
							}, {} as Record<string, Component[]>)
						).map(([category, comps]) => (
							<div key={category} className="mb-4">
								<h3 className="text-sm font-semibold text-slate-700 mb-2 px-2 uppercase tracking-wide">
									{category}
								</h3>
								{comps.map((comp) => (
									<button
										key={comp.id}
										onClick={() => {
											setSelectedComponent(comp);
											setIsDrawerOpen(false);
										}}
										className={`
                      w-full text-left px-4 py-3 mt-2 rounded-xl transition-all duration-300 group
                      ${
												selectedComponent?.id === comp.id
													? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 shadow-lg text-slate-900"
													: "bg-white/10 backdrop-blur-md hover:bg-white/20 hover:shadow-lg text-slate-700 border border-white/20 hover:border-white/40"
											}
                    `}
									>
										<span className="font-medium">{comp.name}</span>
										<p className="text-sm text-gray-600 mt-1">
											{comp.props.length} props
										</p>
									</button>
								))}
							</div>
						))}
					</div>
				</div>
			</div>

			{}
			<div className="flex flex-col min-h-screen relative z-10">
				{}
				<header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-lg">
					<div className="px-4 sm:px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => setIsDrawerOpen(!isDrawerOpen)}
								className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 
                         transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
								aria-label="Toggle navigation"
							>
								<HiMenu className="w-6 h-6" />
							</button>
							<h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
								Style Guide Builder
							</h1>
						</div>

						{}
						<div className="flex gap-2 justify-center">
							<button
								onClick={exportToPDF}
								disabled={isExporting}
								className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500/20 backdrop-blur-md
         hover:bg-emerald-500/30 border border-emerald-500/30 
         transition-all duration-300 transform hover:scale-105 active:scale-95 
         disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 
         focus:ring-emerald-500/50 text-emerald-700 font-semibold shadow-lg hover:shadow-xl"
							>
								{isExporting ? (
									<HiCog className="w-4 h-4 animate-spin" />
								) : (
									<HiDownload className="w-4 h-4" />
								)}
								<span>PDF</span>
							</button>
							<button
								onClick={exportToHTML}
								disabled={isExporting}
								className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-cyan-500/20 backdrop-blur-md
         hover:bg-cyan-500/30 border border-cyan-500/30 
         transition-all duration-300 transform hover:scale-105 active:scale-95 
         disabled:opacity-50 disabled:hover:scale-100 focus:outline-none focus:ring-2 
         focus:ring-cyan-500/50 text-cyan-700 font-semibold shadow-lg hover:shadow-xl"
							>
								{isExporting ? (
									<HiCog className="w-4 h-4 animate-spin" />
								) : (
									<HiCode className="w-4 h-4" />
								)}
								<span>HTML</span>
							</button>
						</div>
					</div>
				</header>

				{}
				<div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-6 p-4 md:p-6 min-h-0">
					{}
					<div className="lg:col-span-2 flex flex-col min-h-[60vh] lg:h-full">
						<div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/30 shadow-lg p-6 flex-1 flex flex-col overflow-hidden">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
								<div className="flex items-center gap-3">
									<HiEye className="w-6 h-6 text-blue-600" />
									<h2 className="text-xl font-bold text-slate-800">
										Live Preview
									</h2>
								</div>

								{}
								<div className="flex gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-white/30">
									{deviceSizes.map((size) => (
										<button
											key={size.name}
											onClick={() => setDeviceSize(size)}
											className={`
                      px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg transition-all duration-300 text-xs lg:text-sm font-semibold flex items-center gap-1 lg:gap-2 whitespace-nowrap
                      ${
												deviceSize.name === size.name
													? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105 border border-white/20"
													: "hover:bg-white/30 text-slate-700 hover:shadow-md border border-transparent"
											}
                    `}
											title={`${size.name} (${size.width}×${size.height})`}
										>
											{size.name === "Mobile" && (
												<HiDeviceMobile className="w-4 h-4" />
											)}
											{size.name === "Tablet" && (
												<HiDeviceTablet className="w-4 h-4" />
											)}
											{(size.name === "Desktop" || size.name === "Wide") && (
												<HiDesktopComputer className="w-4 h-4" />
											)}
											<span className="hidden sm:inline">{size.name}</span>
										</button>
									))}
								</div>
							</div>

							{}
							<div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-inner border border-white/20 flex-1 flex items-stretch">
								<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
								<div className="p-4 flex flex-col justify-center items-center w-full">
									<div
										ref={previewRef}
										className="bg-white rounded-lg shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
										style={{
											width: `${Math.min(
												deviceSize.width,
												window.innerWidth > 768 ? 1000 : 320
											)}px`,
											maxWidth: "100%",
											minHeight:
												deviceSize.name === "Mobile"
													? "300px"
													: window.innerWidth > 768
													? "600px"
													: "400px",
										}}
									>
										{selectedComponent ? (
											<div className="p-4 md:p-8 flex-1 flex flex-col">
												<div className="mb-6">
													<h3 className="text-2xl font-bold text-slate-800 mb-2">
														{selectedComponent.name}
													</h3>
													<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
														{selectedComponent.category}
													</span>
												</div>

												{}
												<div className="flex-1 flex items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-6">
													{React.createElement(selectedComponent.preview, {
														...propValues,
														theme,
													})}
												</div>

												{}
												<div className="bg-gray-50 rounded-lg border p-4 overflow-hidden">
													<div className="flex items-center justify-between mb-3">
														<h4 className="font-semibold text-slate-800 flex items-center gap-2">
															<HiCode className="w-4 h-4" />
															Code Example
														</h4>
														<CopyButton code={selectedComponent.code} />
													</div>
													<div className="bg-gray-900 rounded-lg p-4">
														<pre className="text-green-400 font-mono text-xs md:text-sm whitespace-pre-wrap">
															<code>{selectedComponent.code}</code>
														</pre>
													</div>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-center h-full text-gray-400">
												<div className="text-center">
													<p className="text-xl font-medium">
														Select a component to preview
													</p>
													<p className="text-sm mt-2">
														Choose from the sidebar to get started
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{}
					<div className="space-y-4 lg:h-screen lg:overflow-y-auto pr-2 mt-4 lg:mt-0">
						{}
						{selectedComponent && (
							<AccordionSection
								title="Component Props"
								icon={<HiAdjustments className="w-5 h-5" />}
								isExpanded={expandedSections.props}
								onToggle={() => toggleSection("props")}
							>
								<div className="space-y-4">
									{selectedComponent.props.map((prop) => (
										<div
											key={prop.name}
											className="space-y-3 p-3 lg:p-4 bg-white/80 rounded-xl border border-gray-200/50 hover:bg-white/90 transition-all shadow-sm hover:shadow-md"
										>
											<label className="block text-sm font-medium text-slate-800">
												{prop.name}
												{prop.required && (
													<span className="text-blue-600 ml-1">*</span>
												)}
											</label>
											<div className="flex flex-wrap items-center gap-2">
												{renderPropInput(prop)}
												<span className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded shrink-0">
													{prop.type}
												</span>
											</div>
											<p className="text-xs text-gray-600">
												{prop.description}
											</p>
										</div>
									))}
								</div>
							</AccordionSection>
						)}

						{}
						<AccordionSection
							title="Theme Settings"
							icon={<HiColorSwatch className="w-5 h-5" />}
							isExpanded={expandedSections.theme}
							onToggle={() => toggleSection("theme")}
						>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-3 text-slate-700">
										Primary Colors
									</label>
									<div className="grid grid-cols-4 gap-2">
										{[
											"#0891b2",
											"#3b82f6",
											"#059669",
											"#dc2626",
											"#ea580c",
											"#7c3aed",
											"#db2777",
											"#1f2937",
										].map((color) => (
											<button
												key={color}
												onClick={() =>
													setTheme((prev) => ({ ...prev, primary: color }))
												}
												className={`
                w-full h-8 lg:h-10 rounded-lg border-2 transition-all duration-200 transform hover:scale-110
                ${
									theme.primary === color
										? "border-black scale-110 shadow-lg"
										: "border-white/30"
								}
              `}
												style={{ backgroundColor: color }}
												title={color}
											/>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-3 text-slate-700">
										Secondary Colors
									</label>
									<div className="grid grid-cols-4 gap-2">
										{[
											"#3b82f6",
											"#0891b2",
											"#8b5cf6",
											"#f59e0b",
											"#ef4444",
											"#10b981",
											"#6366f1",
											"#ec4899",
										].map((color) => (
											<button
												key={color}
												onClick={() =>
													setTheme((prev) => ({ ...prev, secondary: color }))
												}
												className={`
                w-full h-8 lg:h-10 rounded-lg border-2 transition-all duration-200 transform hover:scale-110
                ${
									theme.secondary === color
										? "border-black scale-110 shadow-lg"
										: "border-white/30"
								}
              `}
												style={{ backgroundColor: color }}
												title={color}
											/>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2 text-slate-700">
										Font Family
									</label>
									<CustomDropdown
										value={theme.fontFamily}
										options={[
											"Poppins",
											"'Helvetica Neue', Helvetica, Arial",
											"Georgia, 'Times New Roman', serif",
											"'SF Mono', Monaco, 'Cascadia Code', monospace",
										]}
										onChange={(value) =>
											setTheme((prev) => ({ ...prev, fontFamily: value }))
										}
										placeholder="Select font family"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2 text-slate-700">
										Font Size (Preview Only)
									</label>
									<div className="flex items-center gap-3">
										<input
											type="range"
											min="12"
											max="24"
											value={parseInt(theme.fontSize)}
											onChange={(e) =>
												setTheme((prev) => ({
													...prev,
													fontSize: `${e.target.value}px`,
												}))
											}
											className="flex-1 accent-blue-500"
										/>
										<span className="text-sm font-medium bg-white/50 px-2 py-1 rounded min-w-[3rem] text-center">
											{theme.fontSize}
										</span>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-3 text-slate-700">
										Quick Themes
									</label>
									<div className="grid grid-cols-2 gap-2">
										<button
											onClick={() =>
												setTheme((prev) => ({
													...prev,
													primary: "#0891b2",
													secondary: "#3b82f6",
													background: "#f8fafc",
												}))
											}
											className="p-2 lg:p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                     border border-cyan-500/20 hover:scale-105 transition-all text-xs lg:text-sm font-medium backdrop-blur-md"
										>
											Professional
										</button>
										<button
											onClick={() =>
												setTheme((prev) => ({
													...prev,
													primary: "#059669",
													secondary: "#8b5cf6",
													background: "#f8fafc",
												}))
											}
											className="p-2 lg:p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-purple-500/20 
                     border border-emerald-500/20 hover:scale-105 transition-all text-xs lg:text-sm font-medium backdrop-blur-md"
										>
											Modern
										</button>
									</div>
								</div>
							</div>
						</AccordionSection>

						{}
						{selectedComponent && (
							<AccordionSection
								title="Component Info"
								icon={<HiInformationCircle className="w-5 h-5" />}
								isExpanded={expandedSections.info}
								onToggle={() => toggleSection("info")}
							>
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
										<span className="text-sm text-gray-700">Category:</span>
										<span className="font-medium text-slate-800">
											{selectedComponent.category}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
										<span className="text-sm text-gray-700">Props:</span>
										<span className="font-medium text-slate-800">
											{selectedComponent.props.length}
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
										<span className="text-sm text-gray-700">
											Required props:
										</span>
										<span className="font-medium text-slate-800">
											{selectedComponent.props.filter((p) => p.required).length}
										</span>
									</div>
									<div className="pt-2 border-t border-white/30">
										<span className="text-sm text-gray-700 block mb-2">
											Available props:
										</span>
										<div className="flex flex-wrap gap-1">
											{selectedComponent.props.map((prop) => (
												<span
													key={prop.name}
													className={`text-xs px-2 py-1 rounded ${
														prop.required
															? "bg-blue-500/20 text-blue-700"
															: "bg-gray-200/50 text-gray-600"
													}`}
												>
													{prop.name}
												</span>
											))}
										</div>
									</div>
								</div>
							</AccordionSection>
						)}

						{}
						<AccordionSection
							title="Library Stats"
							icon={<HiChartBar className="w-5 h-5" />}
							isExpanded={expandedSections.stats}
							onToggle={() => toggleSection("stats")}
						>
							<div className="grid grid-cols-2 gap-3 lg:gap-4">
								<div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all">
									<div className="text-xl lg:text-2xl font-bold text-cyan-600">
										{components.length}
									</div>
									<div className="text-xs lg:text-sm text-gray-600">
										Components
									</div>
								</div>
								<div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all">
									<div className="text-xl lg:text-2xl font-bold text-blue-600">
										{new Set(components.map((c) => c.category)).size}
									</div>
									<div className="text-xs lg:text-sm text-gray-600">
										Categories
									</div>
								</div>
								<div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all">
									<div className="text-xl lg:text-2xl font-bold text-emerald-600">
										{deviceSizes.length}
									</div>
									<div className="text-xs lg:text-sm text-gray-600">
										Viewports
									</div>
								</div>
								<div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all">
									<div className="text-xl lg:text-2xl font-bold text-purple-600">
										2
									</div>
									<div className="text-xs lg:text-sm text-gray-600">Themes</div>
								</div>
							</div>
						</AccordionSection>
					</div>
				</div>

				{}
				<footer className="bg-white/80 backdrop-blur-md border-t border-white/20 py-4 px-4 mt-auto relative z-10">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-3">
							<div className="flex items-center gap-2">
								<HiTemplate className="w-5 h-5 text-blue-500" />
								<p className="text-sm font-medium text-gray-700">
									Style Guide Builder
								</p>
							</div>

							<div className="flex items-center gap-2 text-sm text-gray-600">
								<span className="hidden sm:flex items-center gap-1">
									<HiCubeTransparent className="w-4 h-4" />
									<span>Version 1.0</span>
								</span>
								<span className="hidden sm:inline">•</span>
								<span className="flex items-center gap-1">
									<HiDeviceMobile className="w-4 h-4 sm:hidden" />
									<HiDesktopComputer className="w-4 h-4 hidden sm:block" />
									<span>{deviceSize.name}</span>
								</span>
							</div>

							<div className="text-xs text-gray-500 mt-1 sm:mt-0">
								Build beautiful interfaces with consistent components
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
