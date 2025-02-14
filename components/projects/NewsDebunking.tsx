"use client";

import { useState, useRef, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch, FiMenu, FiX } from "react-icons/fi";
import {
	FaShareAlt,
	FaEllipsisV,
	FaThumbsUp,
	FaThumbsDown,
	FaReply,
	FaEye,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { Montserrat, Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

// Define font loaders in module scope
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["400", "600", "700", "900"],
});

// Centralized Color Palette and Typography
const colors = {
	primary: {
		50: "#eef2ff",
		100: "#e0e7ff",
		200: "#c7d2fe",
		300: "#a5b4fc",
		400: "#818cf8",
		500: "#6366f1",
		600: "#4f46e5",
		700: "#4338ca",
		800: "#3730a3",
		900: "#312e81",
		950: "#1e1b4b",
	},
	accent: {
		50: "#f0fdfa",
		100: "#ccfbf1",
		200: "#99f6e4",
		300: "#5eead4",
		400: "#2dd4bf",
		500: "#14b8a6",
		600: "#0d9488",
		700: "#0f766e",
		800: "#115e59",
		900: "#134e4a",
		950: "#042f2e",
	},
	neutral: {
		50: "#f9fafb",
		100: "#f3f4f6",
		200: "#e5e7eb",
		300: "#d1d5db",
		400: "#9ca3af",
		500: "#6b7280",
		600: "#4b5563",
		700: "#374151",
		800: "#1f2937",
		900: "#111827",
		950: "#030712",
	},
	danger: {
		50: "#fef2f2",
		100: "#fee2e2",
		200: "#fecaca",
		300: "#fca5a5",
		400: "#f87171",
		500: "#ef4444",
		600: "#dc2626",
		700: "#b91c1c",
		800: "#991b1b",
		900: "#7f1d1d",
		950: "#450a0a",
	},
	warning: {
		50: "#fffbeb",
		100: "#fef3c7",
		200: "#fde68a",
		300: "#fcd34d",
		400: "#fbbf24",
		500: "#f59e0b",
		600: "#d97706",
		700: "#b45309",
		800: "#92400e",
		900: "#78350f",
		950: "#451a03",
	},
};

// Define a consistent spacing scale
const spacing = {
	xs: "0.25rem",
	sm: "0.5rem",
	md: "1rem",
	lg: "1.5rem",
	xl: "2rem",
	"2xl": "3rem",
	"3xl": "4rem",
};

const typography = {
	fontPrimary: inter.style.fontFamily,
	fontHeading: montserrat.style.fontFamily,
	sizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		base: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem",
		"4xl": "2.25rem",
		"5xl": "3rem",
	},
	weights: {
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
		black: "900",
	},
};

// Theme Styles with updated modern look
const themeStyles = {
	background: colors.neutral[50],
	cardBg: "rgba(255, 255, 255, 0.95)",
	text: colors.neutral[900],
	secondaryText: colors.neutral[500],
	border: colors.neutral[200],
	buttonBg: colors.primary[600],
	buttonText: "#ffffff",
	buttonHoverBg: colors.primary[700],
	inputBg: "rgba(255, 255, 255, 0.8)",
	inputBorder: colors.neutral[300],
	accent: colors.accent[500],
	accentHover: colors.accent[600],
	danger: colors.danger[600],
	dangerHover: colors.danger[700],
	warning: colors.warning[500],
	warningHover: colors.warning[600],
	// Shadow styles
	shadowSm: "0 1px 2px rgba(0, 0, 0, 0.05)",
	shadow:
		"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
	shadowMd:
		"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
	shadowLg:
		"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
	// Consistent border radius
	radiusSm: "0.375rem",
	radius: "0.5rem",
	radiusMd: "0.75rem",
	radiusLg: "1rem",
	radiusFull: "9999px",
};

// Utility Functions
const linkShortner = (link: string, maxLength = 30) => {
	if (link.length <= maxLength) return link;
	return link.substring(0, maxLength) + "...";
};

const getTwitterHandle = (url: string) => {
	try {
		const match = url.match(/(twitter|x)\.com\/([A-Za-z0-9_]+)/);
		return match ? match[2] : null;
	} catch {
		return null;
	}
};

// Interface Definitions
interface CommentType {
	text: string;
	attachedLink?: string;
	replies?: CommentType[];
}

interface Post {
	id: number;
	newsHeading: string;
	falseClaimers: string[];
	debunkExplanation: string;
	imageURLs: string[];
	evidenceLinks: string[];
	comments: CommentType[];
	createdAt: string;
	tags: string[];
	upvotes: number;
	downvotes: number;
	isPinned: boolean;
	views: number;
	shares: number;
	isDraft: boolean;
	credibility: "True" | "False" | "Half Truth";
}

// Button component for consistent styling
interface ButtonProps {
	onClick: () => void;
	variant?: "primary" | "secondary" | "danger" | "warning" | "accent";
	size?: "small" | "medium" | "large";
	fullWidth?: boolean;
	children: React.ReactNode;
	disabled?: boolean;
	style?: React.CSSProperties;
	ariaLabel?: string;
}

const Button = ({
	onClick,
	variant = "primary",
	size = "medium",
	fullWidth = false,
	children,
	disabled = false,
	style,
	ariaLabel,
}: ButtonProps) => {
	const getVariantStyles = () => {
		switch (variant) {
			case "primary":
				return {
					bg: themeStyles.buttonBg,
					hover: themeStyles.buttonHoverBg,
					text: themeStyles.buttonText,
				};
			case "secondary":
				return {
					bg: colors.neutral[200],
					hover: colors.neutral[300],
					text: colors.neutral[800],
				};
			case "danger":
				return {
					bg: themeStyles.danger,
					hover: themeStyles.dangerHover,
					text: "#ffffff",
				};
			case "warning":
				return {
					bg: themeStyles.warning,
					hover: themeStyles.warningHover,
					text: "#ffffff",
				};
			case "accent":
				return {
					bg: themeStyles.accent,
					hover: themeStyles.accentHover,
					text: "#ffffff",
				};
		}
	};

	const getSizeStyles = () => {
		switch (size) {
			case "small":
				return {
					padding: `${spacing.xs} ${spacing.md}`,
					fontSize: typography.sizes.sm,
				};
			case "medium":
				return {
					padding: `${spacing.sm} ${spacing.lg}`,
					fontSize: typography.sizes.sm,
				};
			case "large":
				return {
					padding: `${spacing.md} ${spacing.xl}`,
					fontSize: typography.sizes.base,
				};
		}
	};

	const variantStyles = getVariantStyles();
	const sizeStyles = getSizeStyles();

	const [isHovered, setIsHovered] = useState(false);

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			aria-label={ariaLabel}
			style={{
				background: isHovered ? variantStyles.hover : variantStyles.bg,
				color: variantStyles.text,
				padding: sizeStyles.padding,
				fontSize: sizeStyles.fontSize,
				borderRadius: themeStyles.radius,
				fontWeight: "500",
				width: fullWidth ? "100%" : "auto",
				cursor: disabled ? "not-allowed" : "pointer",
				border: "none",
				boxShadow: themeStyles.shadowSm,
				transition: "all 0.2s ease",
				opacity: disabled ? 0.7 : 1,
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				...style,
			}}
		>
			{children}
		</button>
	);
};

// Input component for consistent styling
interface InputProps {
	type: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	label?: string;
	fullWidth?: boolean;
	required?: boolean;
	ariaLabel?: string;
}

const Input = ({
	type,
	value,
	onChange,
	placeholder,
	label,
	fullWidth = true,
	required = false,
	ariaLabel,
}: InputProps) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div
			style={{ marginBottom: spacing.lg, width: fullWidth ? "100%" : "auto" }}
		>
			{label && (
				<label
					style={{
						display: "block",
						fontSize: typography.sizes.sm,
						fontWeight: "500",
						color: themeStyles.text,
						marginBottom: spacing.sm,
					}}
				>
					{label}{" "}
					{required && <span style={{ color: themeStyles.danger }}>*</span>}
				</label>
			)}
			<input
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				aria-label={ariaLabel || label}
				style={{
					width: "100%",
					padding: `${spacing.md} ${spacing.lg}`,
					border: `1px solid ${
						isFocused ? themeStyles.buttonBg : themeStyles.inputBorder
					}`,
					borderRadius: themeStyles.radius,
					background: themeStyles.inputBg,
					color: themeStyles.text,
					boxShadow: isFocused
						? `0 0 0 3px ${colors.primary[100]}`
						: themeStyles.shadowSm,
					outline: "none",
					transition: "all 0.2s ease",
					fontSize: typography.sizes.base,
				}}
				required={required}
			/>
		</div>
	);
};

// CustomEditor Component
interface CustomEditorProps {
	content: string;
	setContent: (value: string) => void;
}

const CustomEditor = ({ content, setContent }: CustomEditorProps) => {
	const editorRef = useRef<HTMLDivElement>(null);

	const handleInput = () => {
		if (editorRef.current) setContent(editorRef.current.innerHTML);
	};

	const formatText = (command: string, value?: string) => {
		document.execCommand(command, false, value);
	};

	const addLink = () => {
		const url = prompt("Enter the URL for the link:", "");
		if (url) formatText("createLink", url);
	};

	return (
		<div style={{ marginBottom: spacing.xl }}>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: spacing.sm,
					marginBottom: spacing.md,
					background: themeStyles.inputBg,
					padding: spacing.md,
					borderRadius: themeStyles.radius,
					boxShadow: themeStyles.shadowSm,
				}}
			>
				{[
					"bold",
					"italic",
					"underline",
					"insertUnorderedList",
					"insertOrderedList",
				].map((cmd) => (
					<Button
						key={cmd}
						onClick={() => formatText(cmd)}
						variant="secondary"
						size="small"
						ariaLabel={`Format ${cmd}`}
					>
						{cmd.charAt(0).toUpperCase() + cmd.slice(1)}
					</Button>
				))}
				<Button
					onClick={addLink}
					variant="secondary"
					size="small"
					ariaLabel="Add link"
				>
					Link
				</Button>
			</div>
			<div
				ref={editorRef}
				style={{
					border: `1px solid ${themeStyles.border}`,
					borderRadius: themeStyles.radius,
					padding: spacing.lg,
					minHeight: "200px",
					background: themeStyles.cardBg,
					color: themeStyles.text,
					boxShadow: themeStyles.shadow,
					fontSize: typography.sizes.base,
				}}
				contentEditable={true}
				onInput={handleInput}
				dangerouslySetInnerHTML={{ __html: content }}
				suppressContentEditableWarning={true}
				aria-label="Rich text editor"
			></div>
		</div>
	);
};

// LoginForm Component
interface LoginFormProps {
	onLogin: (username: string, role: "admin" | "user") => void;
	onSwitchToRegister: () => void;
}

const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = () => {
		if (username === "admin" && password === "password123") {
			onLogin(username, "admin");
			setError("");
		} else if (username === "user" && password === "user123") {
			onLogin(username, "user");
			setError("");
		} else {
			setError("Invalid username or password");
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				padding: spacing.md,
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				style={{
					width: "100%",
					maxWidth: "400px",
					padding: spacing.xl,
					background: themeStyles.cardBg,
					borderRadius: themeStyles.radiusLg,
					boxShadow: themeStyles.shadowLg,
				}}
			>
				<h2
					style={{
						fontFamily: typography.fontHeading,
						fontSize: typography.sizes["3xl"],
						color: themeStyles.text,
						marginBottom: spacing.xl,
						textAlign: "center",
						fontWeight: "700",
					}}
				>
					Sign In
				</h2>
				{error && (
					<div
						style={{
							padding: spacing.md,
							background: colors.danger[50],
							color: colors.danger[700],
							borderRadius: themeStyles.radius,
							fontSize: typography.sizes.sm,
							marginBottom: spacing.lg,
							border: `1px solid ${colors.danger[200]}`,
						}}
					>
						{error}
					</div>
				)}

				<Input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					label="Username"
					placeholder="Enter username"
					ariaLabel="Username"
					required
				/>

				<Input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					label="Password"
					placeholder="Enter password"
					ariaLabel="Password"
					required
				/>

				<Button onClick={handleLogin} fullWidth variant="primary" size="large">
					Sign In
				</Button>

				<div
					style={{
						textAlign: "center",
						marginTop: spacing.lg,
						fontSize: typography.sizes.sm,
						color: themeStyles.secondaryText,
					}}
				>
					<p>
						Don't have an account?{" "}
						<button
							onClick={onSwitchToRegister}
							style={{
								color: themeStyles.buttonBg,
								textDecoration: "underline",
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: typography.sizes.sm,
								fontWeight: "500",
								padding: 0,
							}}
						>
							Register
						</button>
					</p>
					<p style={{ marginTop: spacing.lg }}>Test accounts:</p>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: spacing.lg,
							marginTop: spacing.sm,
						}}
					>
						<div
							style={{
								border: `1px solid ${themeStyles.border}`,
								padding: spacing.md,
								borderRadius: themeStyles.radius,
								background: colors.neutral[50],
							}}
						>
							<div style={{ fontWeight: "500" }}>Admin</div>
							<div>Username: admin</div>
							<div>Password: password123</div>
						</div>
						<div
							style={{
								border: `1px solid ${themeStyles.border}`,
								padding: spacing.md,
								borderRadius: themeStyles.radius,
								background: colors.neutral[50],
							}}
						>
							<div style={{ fontWeight: "500" }}>User</div>
							<div>Username: user</div>
							<div>Password: user123</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

// RegisterForm Component
interface RegisterFormProps {
	onRegister: (user: { username: string; role: "user" }) => void;
	onSwitchToLogin: () => void;
}

const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleRegister = () => {
		if (!name || !email || !username || !password || !confirmPassword) {
			setError("All fields are required");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		onRegister({ username, role: "user" });
		setError("");
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				padding: spacing.md,
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				style={{
					width: "100%",
					maxWidth: "400px",
					padding: spacing.xl,
					background: themeStyles.cardBg,
					borderRadius: themeStyles.radiusLg,
					boxShadow: themeStyles.shadowLg,
				}}
			>
				<h2
					style={{
						fontFamily: typography.fontHeading,
						fontSize: typography.sizes["3xl"],
						color: themeStyles.text,
						marginBottom: spacing.xl,
						textAlign: "center",
						fontWeight: "700",
					}}
				>
					Create Account
				</h2>

				{error && (
					<div
						style={{
							padding: spacing.md,
							background: colors.danger[50],
							color: colors.danger[700],
							borderRadius: themeStyles.radius,
							fontSize: typography.sizes.sm,
							marginBottom: spacing.lg,
							border: `1px solid ${colors.danger[200]}`,
						}}
					>
						{error}
					</div>
				)}

				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					label="Full Name"
					placeholder="Enter full name"
					ariaLabel="Full name"
					required
				/>

				<Input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					label="Email"
					placeholder="Enter email"
					ariaLabel="Email"
					required
				/>

				<Input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					label="Username"
					placeholder="Enter username"
					ariaLabel="Username"
					required
				/>

				<Input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					label="Password"
					placeholder="Enter password"
					ariaLabel="Password"
					required
				/>

				<Input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					label="Confirm Password"
					placeholder="Confirm password"
					ariaLabel="Confirm password"
					required
				/>

				<Button
					onClick={handleRegister}
					fullWidth
					variant="primary"
					size="large"
				>
					Create Account
				</Button>

				<div
					style={{
						textAlign: "center",
						marginTop: spacing.lg,
						fontSize: typography.sizes.sm,
						color: themeStyles.secondaryText,
					}}
				>
					<p>
						Already have an account?{" "}
						<button
							onClick={onSwitchToLogin}
							style={{
								color: themeStyles.buttonBg,
								textDecoration: "underline",
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: typography.sizes.sm,
								fontWeight: "500",
								padding: 0,
							}}
						>
							Sign In
						</button>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

// PostForm Component
interface PostFormProps {
	onSubmit: (post: Post) => void;
	onCancel: () => void;
	initialPost?: Post;
	showToast: (message: string) => void;
}

const PostForm = ({
	onSubmit,
	onCancel,
	initialPost,
	showToast,
}: PostFormProps) => {
	const [newsHeading, setNewsHeading] = useState(
		initialPost?.newsHeading || ""
	);
	const [falseClaimers, setFalseClaimers] = useState<string[]>(
		initialPost?.falseClaimers || [""]
	);
	const [debunkExplanation, setDebunkExplanation] = useState(
		initialPost?.debunkExplanation || ""
	);
	const [evidenceLinks, setEvidenceLinks] = useState<string[]>(
		initialPost?.evidenceLinks || [""]
	);
	const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
	const [imageUrlInputs, setImageUrlInputs] = useState<string[]>(
		initialPost?.imageURLs || []
	);
	const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [previewMode, setPreviewMode] = useState(false);
	const [isDraft, setIsDraft] = useState(initialPost?.isDraft || false);
	const [credibility, setCredibility] = useState<
		"True" | "False" | "Half Truth"
	>(initialPost?.credibility || "False");

	const falseClaimerHandler = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const accounts = [...falseClaimers];
		accounts[index] = e.target.value;
		setFalseClaimers(accounts);
	};

	const addFalseClaimer = () => {
		setFalseClaimers([...falseClaimers, ""]);
	};

	const evidenceLinkchanger = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const links = [...evidenceLinks];
		links[index] = e.target.value;
		setEvidenceLinks(links);
	};

	const addEvidenceLink = () => {
		setEvidenceLinks([...evidenceLinks, ""]);
	};

	const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setUploadedImageFiles(Array.from(e.target.files));
		}
	};

	const urlImageChangeHandler = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const urls = [...imageUrlInputs];
		urls[index] = e.target.value;
		setImageUrlInputs(urls);
	};

	const addImageUrlInput = () => {
		setImageUrlInputs([...imageUrlInputs, ""]);
	};

	const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && tagInput.trim()) {
			setTags([...tags, tagInput.trim()]);
			setTagInput("");
		}
	};

	const removeTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	const handleSubmit = (draft = false) => {
		if (
			!newsHeading ||
			!debunkExplanation ||
			falseClaimers.some((acc) => acc.trim() === "")
		) {
			showToast("Please fill in all required fields.");
			return;
		}
		const localImageURLs = uploadedImageFiles.map((file) =>
			URL.createObjectURL(file)
		);
		const finalImageURLs = [
			...imageUrlInputs.filter((url) => url.trim() !== ""),
			...localImageURLs,
		];

		const post: Post = {
			id: initialPost ? initialPost.id : Date.now(),
			newsHeading,
			falseClaimers,
			debunkExplanation,
			imageURLs: finalImageURLs,
			evidenceLinks,
			comments: initialPost ? initialPost.comments : [],
			createdAt: initialPost ? initialPost.createdAt : new Date().toISOString(),
			tags,
			upvotes: initialPost ? initialPost.upvotes : 0,
			downvotes: initialPost ? initialPost.downvotes : 0,
			isPinned: initialPost ? initialPost.isPinned : false,
			views: initialPost ? initialPost.views : 0,
			shares: initialPost ? initialPost.shares : 0,
			isDraft: draft,
			credibility,
		};

		onSubmit(post);
		showToast(
			draft ? "Draft saved" : initialPost ? "Post updated" : "Post published"
		);
		if (!initialPost && !draft) {
			setNewsHeading("");
			setFalseClaimers([""]);
			setDebunkExplanation("");
			setEvidenceLinks([""]);
			setUploadedImageFiles([]);
			setImageUrlInputs([]);
			setTags([]);
			setCredibility("False");
		}
		setPreviewMode(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			style={{
				padding: spacing.xl,
				borderRadius: themeStyles.radiusLg,
				background: themeStyles.cardBg,
				boxShadow: themeStyles.shadowLg,
				backdropFilter: "blur(10px)",
				marginBottom: spacing.xl,
			}}
		>
			<h2
				style={{
					fontFamily: typography.fontHeading,
					fontSize: typography.sizes["3xl"],
					fontWeight: "bold",
					marginBottom: spacing.xl,
					color: themeStyles.text,
				}}
			>
				{initialPost ? "Update Debunk Post" : "Create Debunk Post"}
			</h2>

			{previewMode ? (
				<div
					style={{
						border: `1px solid ${themeStyles.border}`,
						padding: spacing.xl,
						borderRadius: themeStyles.radiusMd,
						background: themeStyles.inputBg,
						marginBottom: spacing.xl,
						boxShadow: themeStyles.shadow,
					}}
				>
					<h3
						style={{
							fontFamily: typography.fontHeading,
							fontSize: typography.sizes["2xl"],
							fontWeight: "bold",
							color: themeStyles.text,
						}}
					>
						{newsHeading}
					</h3>
					<p
						style={{
							fontSize: typography.sizes.sm,
							color: themeStyles.secondaryText,
							marginTop: spacing.sm,
						}}
					>
						False Claimers: {falseClaimers.join(", ")}
					</p>

					<p
						style={{
							fontSize: typography.sizes.sm,
							color: themeStyles.secondaryText,
							marginTop: spacing.sm,
						}}
					>
						Credibility: {credibility}
					</p>
					<div
						dangerouslySetInnerHTML={{ __html: debunkExplanation }}
						style={{
							marginTop: spacing.lg,
							color: themeStyles.text,
							fontSize: typography.sizes.base,
							padding: spacing.md,
							background: "white",
							borderRadius: themeStyles.radius,
							boxShadow: themeStyles.shadowSm,
						}}
					></div>

					<div
						style={{ display: "flex", gap: spacing.md, marginTop: spacing.lg }}
					>
						<Button onClick={() => setPreviewMode(false)} variant="secondary">
							Back to Edit
						</Button>
					</div>
				</div>
			) : (
				<>
					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							News Heading <span style={{ color: themeStyles.danger }}>*</span>
						</label>
						<input
							type="text"
							value={newsHeading}
							onChange={(e) => setNewsHeading(e.target.value)}
							style={{
								width: "100%",
								padding: `${spacing.md} ${spacing.lg}`,
								border: `1px solid ${themeStyles.inputBorder}`,
								borderRadius: themeStyles.radius,
								background: themeStyles.inputBg,
								color: themeStyles.text,
								boxShadow: themeStyles.shadowSm,
								outline: "none",
								transition: "all 0.2s ease",
								fontSize: typography.sizes.base,
							}}
							onFocus={(e) =>
								(e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`)
							}
							onBlur={(e) =>
								(e.currentTarget.style.boxShadow = themeStyles.shadowSm)
							}
							placeholder="Enter news heading"
							aria-label="News heading"
							required
						/>
					</div>

					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							False Claimer Accounts{" "}
							<span style={{ color: themeStyles.danger }}>*</span>
						</label>
						{falseClaimers.map((account, index) => (
							<div key={index} style={{ marginBottom: spacing.md }}>
								<input
									type="url"
									value={account}
									onChange={(e) => falseClaimerHandler(e, index)}
									placeholder="Enter Twitter/X account link"
									style={{
										width: "100%",
										padding: `${spacing.md} ${spacing.lg}`,
										border: `1px solid ${themeStyles.inputBorder}`,
										borderRadius: themeStyles.radius,
										background: themeStyles.inputBg,
										color: themeStyles.text,
										boxShadow: themeStyles.shadowSm,
										outline: "none",
										transition: "all 0.2s ease",
										fontSize: typography.sizes.base,
									}}
									onFocus={(e) =>
										(e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`)
									}
									onBlur={(e) =>
										(e.currentTarget.style.boxShadow = themeStyles.shadowSm)
									}
									aria-label={`False claimer ${index + 1}`}
									required
								/>
							</div>
						))}

						<Button
							onClick={addFalseClaimer}
							variant="accent"
							size="small"
							ariaLabel="Add account"
						>
							Add Account
						</Button>
					</div>

					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							Credibility <span style={{ color: themeStyles.danger }}>*</span>
						</label>
						<select
							value={credibility}
							onChange={(e) =>
								setCredibility(
									e.target.value as "True" | "False" | "Half Truth"
								)
							}
							style={{
								width: "100%",
								padding: `${spacing.md} ${spacing.lg}`,
								border: `1px solid ${themeStyles.inputBorder}`,
								borderRadius: themeStyles.radius,
								background: themeStyles.inputBg,
								color: themeStyles.text,
								boxShadow: themeStyles.shadowSm,
								outline: "none",
								transition: "all 0.2s ease",
								fontSize: typography.sizes.base,
							}}
							aria-label="Credibility"
							required
						>
							<option value="True">True</option>
							<option value="False">False</option>
							<option value="Half Truth">Half Truth</option>
						</select>
					</div>

					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							Debunk Explanation{" "}
							<span style={{ color: themeStyles.danger }}>*</span>
						</label>
						<CustomEditor
							content={debunkExplanation}
							setContent={setDebunkExplanation}
						/>
					</div>

					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							Evidence Links
						</label>
						{evidenceLinks.map((link, index) => (
							<div key={index} style={{ marginBottom: spacing.md }}>
								<input
									type="url"
									value={link}
									onChange={(e) => evidenceLinkchanger(e, index)}
									placeholder="Enter evidence link"
									style={{
										width: "100%",
										padding: `${spacing.md} ${spacing.lg}`,
										border: `1px solid ${themeStyles.inputBorder}`,
										borderRadius: themeStyles.radius,
										background: themeStyles.inputBg,
										color: themeStyles.text,
										boxShadow: themeStyles.shadowSm,
										outline: "none",
										transition: "all 0.2s ease",
										fontSize: typography.sizes.base,
									}}
									onFocus={(e) =>
										(e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`)
									}
									onBlur={(e) =>
										(e.currentTarget.style.boxShadow = themeStyles.shadowSm)
									}
									aria-label={`Evidence link ${index + 1}`}
								/>
							</div>
						))}

						<Button
							onClick={addEvidenceLink}
							variant="accent"
							size="small"
							ariaLabel="Add evidence link"
						>
							Add Evidence Link
						</Button>
					</div>

					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							Tags
						</label>
						<input
							type="text"
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleTagInput}
							placeholder="Enter tag and press Enter"
							style={{
								width: "100%",
								padding: `${spacing.md} ${spacing.lg}`,
								border: `1px solid ${themeStyles.inputBorder}`,
								borderRadius: themeStyles.radius,
								background: themeStyles.inputBg,
								color: themeStyles.text,
								boxShadow: themeStyles.shadowSm,
								outline: "none",
								transition: "all 0.2s ease",
								fontSize: typography.sizes.base,
							}}
							onFocus={(e) =>
								(e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`)
							}
							onBlur={(e) =>
								(e.currentTarget.style.boxShadow = themeStyles.shadowSm)
							}
							aria-label="Tags"
						/>

						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: spacing.sm,
								marginTop: spacing.md,
							}}
						>
							{tags.map((tag, index) => (
								<span
									key={index}
									style={{
										background: colors.primary[100],
										color: colors.primary[800],
										padding: `${spacing.xs} ${spacing.md}`,
										borderRadius: themeStyles.radiusFull,
										display: "flex",
										alignItems: "center",
										fontSize: typography.sizes.sm,
										fontWeight: "500",
									}}
								>
									{tag}
									<button
										onClick={() => removeTag(index)}
										style={{
											marginLeft: spacing.sm,
											fontSize: typography.sizes.xs,
											background: colors.primary[200],
											width: "18px",
											height: "18px",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											border: "none",
											cursor: "pointer",
										}}
										aria-label={`Remove tag ${tag}`}
									>
										×
									</button>
								</span>
							))}
						</div>
					</div>

					<div style={{ marginBottom: spacing.xl }}>
						<label
							style={{
								display: "block",
								fontSize: typography.sizes.sm,
								fontWeight: "600",
								marginBottom: spacing.sm,
								color: themeStyles.text,
							}}
						>
							Upload Image/Screenshot
						</label>
						<input
							type="file"
							accept="image/*"
							multiple
							onChange={imageChangeHandler}
							style={{
								width: "100%",
								padding: `${spacing.md} ${spacing.lg}`,
								border: `1px solid ${themeStyles.inputBorder}`,
								borderRadius: themeStyles.radius,
								background: themeStyles.inputBg,
								color: themeStyles.text,
								boxShadow: themeStyles.shadowSm,
								fontSize: typography.sizes.base,
							}}
							aria-label="Upload images"
						/>

						<div style={{ marginTop: spacing.md }}>
							<label
								style={{
									display: "block",
									fontSize: typography.sizes.sm,
									fontWeight: "600",
									marginBottom: spacing.sm,
									color: themeStyles.text,
								}}
							>
								Or add image URL(s):
							</label>
							{imageUrlInputs.map((url, index) => (
								<input
									key={index}
									type="url"
									value={url}
									onChange={(e) => urlImageChangeHandler(e, index)}
									placeholder="Enter image URL"
									style={{
										width: "100%",
										padding: `${spacing.md} ${spacing.lg}`,
										border: `1px solid ${themeStyles.inputBorder}`,
										borderRadius: themeStyles.radius,
										background: themeStyles.inputBg,
										color: themeStyles.text,
										boxShadow: themeStyles.shadowSm,
										outline: "none",
										transition: "all 0.2s ease",
										marginBottom: spacing.md,
										fontSize: typography.sizes.base,
									}}
									onFocus={(e) =>
										(e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`)
									}
									onBlur={(e) =>
										(e.currentTarget.style.boxShadow = themeStyles.shadowSm)
									}
									aria-label={`Image URL ${index + 1}`}
								/>
							))}

							<Button
								onClick={addImageUrlInput}
								variant="accent"
								size="small"
								ariaLabel="Add image URL"
							>
								Add Image URL
							</Button>
						</div>
					</div>

					<div style={{ display: "flex", flexWrap: "wrap", gap: spacing.md }}>
						<Button
							onClick={() => setPreviewMode(true)}
							variant="warning"
							ariaLabel="Preview post"
						>
							Preview
						</Button>

						<Button
							onClick={() => handleSubmit(true)}
							variant="secondary"
							ariaLabel="Save as draft"
						>
							Save as Draft
						</Button>

						<Button
							onClick={() => handleSubmit(false)}
							variant="primary"
							ariaLabel={initialPost ? "Update post" : "Publish post"}
						>
							{initialPost ? "Update Post" : "Publish Post"}
						</Button>

						{onCancel && (
							<Button onClick={onCancel} variant="danger" ariaLabel="Cancel">
								Cancel
							</Button>
						)}
					</div>
				</>
			)}
		</motion.div>
	);
};

// PostCard Component
interface PostCardProps {
	post: Post;
	onView: (post: Post) => void;
	onUpdate: (post: Post) => void;
	onDelete: (postId: number) => void;
	onShare: (post: Post) => void;
	onPin: (postId: number) => void;
	onVote: (postId: number, type: "up" | "down") => void;
	isAdmin: boolean;
	isUser: boolean;
	hasVoted: boolean;
}

const PostCard = ({
	post,
	onView,
	onUpdate,
	onDelete,
	onShare,
	onPin,
	onVote,
	isAdmin,
	isUser,
	hasVoted,
}: PostCardProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [menuVisible, setMenuVisible] = useState(false);

	const handleMenuClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setMenuVisible(true);
		setTimeout(() => {
			document.addEventListener("click", handleOutsideClick);
		}, 0);
	};

	const handleOutsideClick = () => {
		setMenuVisible(false);
		document.removeEventListener("click", handleOutsideClick);
	};

	const credibilityColors = {
		True: colors.accent[600],
		False: colors.danger[600],
		"Half Truth": colors.warning[600],
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			whileHover={{ y: -5, boxShadow: themeStyles.shadowLg }}
			style={{
				position: "relative",
				boxShadow: themeStyles.shadowMd,
				borderRadius: themeStyles.radiusLg,
				padding: spacing.lg,
				background: themeStyles.cardBg,
				backdropFilter: "blur(10px)",
				transition: "all 0.3s ease",
				cursor: "pointer",
				overflow: "hidden",
				border: `1px solid ${themeStyles.border}`,
			}}
			onClick={() => onView({ ...post, views: post.views + 1 })}
		>
			{post.isPinned && (
				<span
					style={{
						position: "absolute",
						top: spacing.md,
						left: spacing.md,
						background: themeStyles.warning,
						color: "#ffffff",
						padding: `${spacing.xs} ${spacing.md}`,
						borderRadius: themeStyles.radiusFull,
						fontSize: typography.sizes.xs,
						fontWeight: "600",
						zIndex: 30,
						boxShadow: themeStyles.shadowSm,
					}}
				>
					Pinned
				</span>
			)}
			<span
				style={{
					position: "absolute",
					top: spacing.md,
					left: post.isPinned ? "5rem" : spacing.md,
					background: credibilityColors[post.credibility],
					color: "#ffffff",
					padding: `${spacing.xs} ${spacing.md}`,
					borderRadius: themeStyles.radiusFull,
					fontSize: typography.sizes.xs,
					fontWeight: "600",
					zIndex: 30,
					boxShadow: themeStyles.shadowSm,
				}}
			>
				{post.credibility}
			</span>

			{(isAdmin || isUser) && (
				<div
					style={{
						position: "absolute",
						top: spacing.md,
						right: spacing.md,
						zIndex: 20,
					}}
				>
					<button
						onClick={handleMenuClick}
						style={{
							color: themeStyles.secondaryText,
							transition: "color 0.3s",
							background: "none",
							border: "none",
							padding: spacing.sm,
							borderRadius: themeStyles.radiusFull,
							cursor: "pointer",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.color = themeStyles.text;
							e.currentTarget.style.background = colors.neutral[100];
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.color = themeStyles.secondaryText;
							e.currentTarget.style.background = "none";
						}}
						aria-label="More options"
					>
						<FaEllipsisV size={18} />
					</button>

					{menuVisible && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							style={{
								position: "absolute",
								right: 0,
								marginTop: spacing.sm,
								width: "16rem",
								background: themeStyles.cardBg,
								border: `1px solid ${themeStyles.border}`,
								borderRadius: themeStyles.radius,
								boxShadow: themeStyles.shadowLg,
								zIndex: 30,
								overflow: "hidden",
							}}
						>
							{isAdmin && (
								<>
									<button
										onClick={() => {
											setMenuVisible(false);
											onUpdate(post);
										}}
										style={{
											width: "100%",
											textAlign: "left",
											padding: `${spacing.md} ${spacing.lg}`,
											color: themeStyles.text,
											display: "flex",
											alignItems: "center",
											background: "transparent",
											border: "none",
											transition: "background 0.3s",
											fontSize: typography.sizes.sm,
											cursor: "pointer",
										}}
										onMouseOver={(e) =>
											(e.currentTarget.style.background = themeStyles.inputBg)
										}
										onMouseOut={(e) =>
											(e.currentTarget.style.background = "transparent")
										}
									>
										<FiEdit style={{ marginRight: spacing.md }} /> Update
									</button>

									<button
										onClick={() => {
											setMenuVisible(false);
											onDelete(post.id);
										}}
										style={{
											width: "100%",
											textAlign: "left",
											padding: `${spacing.md} ${spacing.lg}`,
											color: themeStyles.text,
											display: "flex",
											alignItems: "center",
											background: "transparent",
											border: "none",
											transition: "background 0.3s",
											fontSize: typography.sizes.sm,
											cursor: "pointer",
										}}
										onMouseOver={(e) =>
											(e.currentTarget.style.background = themeStyles.inputBg)
										}
										onMouseOut={(e) =>
											(e.currentTarget.style.background = "transparent")
										}
									>
										<FiTrash2 style={{ marginRight: spacing.md }} /> Delete
									</button>

									<button
										onClick={() => {
											setMenuVisible(false);
											onPin(post.id);
										}}
										style={{
											width: "100%",
											textAlign: "left",
											padding: `${spacing.md} ${spacing.lg}`,
											color: themeStyles.text,
											display: "flex",
											alignItems: "center",
											background: "transparent",
											border: "none",
											transition: "background 0.3s",
											fontSize: typography.sizes.sm,
											cursor: "pointer",
										}}
										onMouseOver={(e) =>
											(e.currentTarget.style.background = themeStyles.inputBg)
										}
										onMouseOut={(e) =>
											(e.currentTarget.style.background = "transparent")
										}
									>
										{post.isPinned ? "Unpin" : "Pin"}
									</button>
								</>
							)}

							<button
								onClick={() => {
									setMenuVisible(false);
									onShare(post);
								}}
								style={{
									width: "100%",
									textAlign: "left",
									padding: `${spacing.md} ${spacing.lg}`,
									color: themeStyles.text,
									display: "flex",
									alignItems: "center",
									background: "transparent",
									border: "none",
									transition: "background 0.3s",
									fontSize: typography.sizes.sm,
									cursor: "pointer",
								}}
								onMouseOver={(e) =>
									(e.currentTarget.style.background = themeStyles.inputBg)
								}
								onMouseOut={(e) =>
									(e.currentTarget.style.background = "transparent")
								}
							>
								<FaShareAlt style={{ marginRight: spacing.md }} /> Share
							</button>
						</motion.div>
					)}
				</div>
			)}

			<div
				style={{
					overflow: "hidden",
					marginBottom: spacing.lg,
					borderRadius: themeStyles.radiusMd,
				}}
			>
				{post.imageURLs.length > 0 ? (
					<div style={{ position: "relative", width: "100%", height: "15rem" }}>
						<img
							src={post.imageURLs[currentImageIndex]}
							alt="Post image"
							style={{
								objectFit: "cover",
								width: "100%",
								height: "100%",
								borderRadius: themeStyles.radiusMd,
								transition: "transform 0.3s ease",
							}}
							onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
						/>

						{post.imageURLs.length > 1 && (
							<div
								style={{
									position: "absolute",
									bottom: spacing.md,
									left: "50%",
									transform: "translateX(-50%)",
									display: "flex",
									gap: spacing.xs,
									background: "rgba(0,0,0,0.3)",
									padding: `${spacing.xs} ${spacing.sm}`,
									borderRadius: themeStyles.radiusFull,
								}}
							>
								{post.imageURLs.map((_, i) => (
									<button
										key={i}
										onClick={(e) => {
											e.stopPropagation();
											setCurrentImageIndex(i);
										}}
										style={{
											width: "8px",
											height: "8px",
											borderRadius: "50%",
											background:
												i === currentImageIndex
													? "#ffffff"
													: "rgba(255,255,255,0.5)",
											border: "none",
											padding: 0,
											cursor: "pointer",
										}}
										aria-label={`Go to image ${i + 1}`}
									></button>
								))}
							</div>
						)}
					</div>
				) : (
					<div
						style={{
							width: "100%",
							height: "15rem",
							background: colors.neutral[100],
							borderRadius: themeStyles.radiusMd,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<span
							style={{
								color: themeStyles.secondaryText,
								fontSize: typography.sizes.sm,
							}}
						>
							No image
						</span>
					</div>
				)}
			</div>

			<div>
				<h3
					style={{
						fontFamily: typography.fontHeading,
						fontSize: typography.sizes.xl,
						fontWeight: "bold",
						marginBottom: spacing.sm,
						color: themeStyles.text,
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						lineHeight: 1.4,
					}}
				>
					{post.newsHeading}
				</h3>

				<p
					style={{
						fontSize: typography.sizes.xs,
						color: themeStyles.secondaryText,
						marginBottom: spacing.sm,
					}}
				>
					Posted on: {new Date(post.createdAt).toLocaleString()}
				</p>

				<p
					style={{
						fontSize: typography.sizes.sm,
						marginBottom: spacing.md,
						color: themeStyles.secondaryText,
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					False Claimer(s):{" "}
					{post.falseClaimers.map((acc, i) => {
						const handle = getTwitterHandle(acc);
						return (
							<span
								key={i}
								style={{ display: "inline-flex", alignItems: "center" }}
							>
								{handle && (
									<img
										src={`https://unavatar.io/twitter/${handle}`}
										alt={handle}
										style={{
											width: "1.25rem",
											height: "1.25rem",
											borderRadius: "50%",
											marginRight: spacing.xs,
											border: `1px solid ${themeStyles.border}`,
										}}
										onError={(e) =>
											(e.currentTarget.src = "/fallback-avatar.png")
										}
									/>
								)}
								<a
									href={acc}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										color: themeStyles.buttonBg,
										textDecoration: "underline",
										transition: "color 0.3s",
										fontSize: typography.sizes.sm,
									}}
									onMouseOver={(e) =>
										(e.currentTarget.style.color = themeStyles.buttonHoverBg)
									}
									onMouseOut={(e) =>
										(e.currentTarget.style.color = themeStyles.buttonBg)
									}
									title={acc}
								>
									{linkShortner(acc)}
								</a>
								{i !== post.falseClaimers.length - 1 && ", "}
							</span>
						);
					})}
				</p>

				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: spacing.sm,
						marginBottom: spacing.md,
					}}
				>
					{post.tags.map((tag, i) => (
						<span
							key={i}
							style={{
								background: colors.primary[100],
								color: colors.primary[700],
								padding: `${spacing.xs} ${spacing.md}`,
								borderRadius: themeStyles.radiusFull,
								fontSize: typography.sizes.xs,
								fontWeight: "500",
							}}
						>
							{tag}
						</span>
					))}
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						borderTop: `1px solid ${themeStyles.border}`,
						paddingTop: spacing.md,
					}}
				>
					<div style={{ display: "flex", gap: spacing.lg }}>
						{isUser && (
							<>
								<button
									onClick={(e) => {
										e.stopPropagation();
										onVote(post.id, "up");
									}}
									disabled={hasVoted}
									style={{
										display: "flex",
										alignItems: "center",
										color: hasVoted
											? colors.neutral[400]
											: themeStyles.secondaryText,
										background: "none",
										border: "none",
										transition: "color 0.3s",
										fontSize: typography.sizes.sm,
										cursor: hasVoted ? "not-allowed" : "pointer",
									}}
									onMouseOver={(e) =>
										!hasVoted &&
										(e.currentTarget.style.color = themeStyles.buttonBg)
									}
									onMouseOut={(e) =>
										!hasVoted &&
										(e.currentTarget.style.color = themeStyles.secondaryText)
									}
									aria-label="Upvote"
								>
									<FaThumbsUp style={{ marginRight: spacing.xs }} />{" "}
									{post.upvotes}
								</button>

								<button
									onClick={(e) => {
										e.stopPropagation();
										onVote(post.id, "down");
									}}
									disabled={hasVoted}
									style={{
										display: "flex",
										alignItems: "center",
										color: hasVoted
											? colors.neutral[400]
											: themeStyles.secondaryText,
										background: "none",
										border: "none",
										transition: "color 0.3s",
										fontSize: typography.sizes.sm,
										cursor: hasVoted ? "not-allowed" : "pointer",
									}}
									onMouseOver={(e) =>
										!hasVoted &&
										(e.currentTarget.style.color = themeStyles.danger)
									}
									onMouseOut={(e) =>
										!hasVoted &&
										(e.currentTarget.style.color = themeStyles.secondaryText)
									}
									aria-label="Downvote"
								>
									<FaThumbsDown style={{ marginRight: spacing.xs }} />{" "}
									{post.downvotes}
								</button>
							</>
						)}
					</div>

					<div
						style={{
							display: "flex",
							gap: spacing.lg,
							color: themeStyles.secondaryText,
							fontSize: typography.sizes.sm,
						}}
					>
						<span style={{ display: "flex", alignItems: "center" }}>
							<FaEye style={{ marginRight: spacing.xs }} /> {post.views}
						</span>
						<span style={{ display: "flex", alignItems: "center" }}>
							<FaShareAlt style={{ marginRight: spacing.xs }} /> {post.shares}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

// PostModal Component
interface PostModalProps {
	post: Post;
	onClose: () => void;
	onAddComment: (postId: number, comment: CommentType) => void;
	onUpdatePost: (updatedPost: Post) => void;
	showToast: (message: string) => void;
	isAdmin: boolean;
	isUser: boolean;
}

const PostModal = ({
	post,
	onClose,
	onAddComment,
	onUpdatePost,
	showToast,
	isAdmin,
	isUser,
}: PostModalProps) => {
	const [commentText, setCommentText] = useState("");
	const [attachedLink, setAttachedLink] = useState("");
	const [editMode, setEditMode] = useState(false);
	const [editedExplanation, setEditedExplanation] = useState(
		post.debunkExplanation
	);
	const [replyText, setReplyText] = useState("");
	const [replyTo, setReplyTo] = useState<number | null>(null);

	const handleCommentSubmit = () => {
		if (!commentText.trim()) return;
		if (replyTo !== null) {
			const newComment: CommentType = {
				text: commentText,
				attachedLink: attachedLink || undefined,
			};
			onAddComment(post.id, {
				...post.comments[replyTo],
				replies: [...(post.comments[replyTo].replies || []), newComment],
			});
			setReplyTo(null);
		} else {
			onAddComment(post.id, {
				text: commentText,
				attachedLink: attachedLink || undefined,
			});
		}
		setCommentText("");
		setAttachedLink("");
		setReplyText("");
		showToast("Comment added successfully!");
	};

	const handleExplanationUpdate = () => {
		onUpdatePost({ ...post, debunkExplanation: editedExplanation });
		setEditMode(false);
		showToast("Debunk explanation updated!");
	};

	const credibilityColors = {
		True: colors.accent[600],
		False: colors.danger[600],
		"Half Truth": colors.warning[600],
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 50,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "rgba(0,0,0,0.75)",
				backdropFilter: "blur(4px)",
				padding: spacing.md,
			}}
		>
			<motion.div
				initial={{ scale: 0.95, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				style={{
					position: "relative",
					padding: spacing.xl,
					background: themeStyles.cardBg,
					backdropFilter: "blur(10px)",
					borderRadius: themeStyles.radiusLg,
					boxShadow: themeStyles.shadowLg,
					maxWidth: "48rem",
					width: "100%",
					maxHeight: "90vh",
					overflowY: "auto",
				}}
			>
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: spacing.md,
						right: spacing.md,
						fontSize: typography.sizes.xl,
						color: themeStyles.secondaryText,
						transition: "color 0.3s",
						background: colors.neutral[100],
						width: "36px",
						height: "36px",
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: "none",
						cursor: "pointer",
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.color = themeStyles.text;
						e.currentTarget.style.background = colors.neutral[200];
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.color = themeStyles.secondaryText;
						e.currentTarget.style.background = colors.neutral[100];
					}}
					aria-label="Close modal"
				>
					×
				</button>

				<div style={{ marginBottom: spacing.xl }}>
					<h2
						style={{
							fontFamily: typography.fontHeading,
							fontSize: typography.sizes["4xl"],
							fontWeight: "bold",
							marginBottom: spacing.md,
							color: themeStyles.text,
							lineHeight: 1.2,
						}}
					>
						{post.newsHeading}
					</h2>

					<div
						style={{
							display: "flex",
							gap: spacing.md,
							marginBottom: spacing.md,
							flexWrap: "wrap",
						}}
					>
						<p
							style={{
								fontSize: typography.sizes.sm,
								color: themeStyles.secondaryText,
								display: "flex",
								alignItems: "center",
							}}
						>
							Posted on: {new Date(post.createdAt).toLocaleString()}
						</p>

						<span
							style={{
								background: credibilityColors[post.credibility],
								color: "#ffffff",
								padding: `${spacing.xs} ${spacing.md}`,
								borderRadius: themeStyles.radiusFull,
								fontSize: typography.sizes.xs,
								fontWeight: "600",
							}}
						>
							{post.credibility}
						</span>
					</div>

					<p
						style={{
							fontSize: typography.sizes.base,
							marginBottom: spacing.lg,
							color: themeStyles.secondaryText,
							background: colors.neutral[50],
							padding: spacing.md,
							borderRadius: themeStyles.radius,
						}}
					>
						False Claimer(s):{" "}
						{post.falseClaimers.map((acc, i) => (
							<span
								key={i}
								style={{ display: "inline-flex", alignItems: "center" }}
							>
								{getTwitterHandle(acc) && (
									<img
										src={`https://unavatar.io/twitter/${getTwitterHandle(acc)}`}
										alt={getTwitterHandle(acc)!}
										style={{
											width: "1.5rem",
											height: "1.5rem",
											borderRadius: "50%",
											marginRight: spacing.sm,
											border: `1px solid ${themeStyles.border}`,
										}}
										onError={(e) =>
											(e.currentTarget.src = "/fallback-avatar.png")
										}
									/>
								)}
								<a
									href={acc}
									target="_blank"
									rel="noopener noreferrer"
									style={{
										color: themeStyles.buttonBg,
										textDecoration: "underline",
										fontSize: typography.sizes.sm,
									}}
									title={acc}
								>
									{linkShortner(acc)}
								</a>
								{i !== post.falseClaimers.length - 1 && ", "}
							</span>
						))}
					</p>

					{post.imageURLs.length > 0 && (
						<div style={{ position: "relative", marginBottom: spacing.xl }}>
							<img
								src={post.imageURLs[0]}
								alt="Post image"
								style={{
									objectFit: "cover",
									width: "100%",
									height: "auto",
									maxHeight: "400px",
									borderRadius: themeStyles.radiusMd,
									boxShadow: themeStyles.shadowMd,
								}}
							/>
						</div>
					)}

					<h3
						style={{
							fontFamily: typography.fontHeading,
							fontSize: typography.sizes["2xl"],
							fontWeight: "bold",
							marginBottom: spacing.md,
							color: themeStyles.text,
						}}
					>
						Debunk Explanation
					</h3>

					{editMode && isAdmin ? (
						<div style={{ marginBottom: spacing.lg }}>
							<CustomEditor
								content={editedExplanation}
								setContent={setEditedExplanation}
							/>
							<div style={{ display: "flex", gap: spacing.md }}>
								<Button
									onClick={handleExplanationUpdate}
									variant="primary"
									ariaLabel="Save update"
								>
									Save Update
								</Button>

								<Button
									onClick={() => {
										setEditMode(false);
										setEditedExplanation(post.debunkExplanation);
									}}
									variant="secondary"
									ariaLabel="Cancel"
								>
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<div style={{ marginBottom: spacing.lg }}>
							<div
								style={{
									border: `1px solid ${themeStyles.border}`,
									padding: spacing.xl,
									borderRadius: themeStyles.radiusMd,
									background: themeStyles.inputBg,
									color: themeStyles.text,
									fontSize: typography.sizes.base,
									boxShadow: themeStyles.shadow,
								}}
								dangerouslySetInnerHTML={{ __html: post.debunkExplanation }}
							></div>

							{isAdmin && (
								<Button
									onClick={() => setEditMode(true)}
									variant="warning"
									style={{ marginTop: spacing.lg }}
									ariaLabel="Update explanation"
								>
									Update Explanation
								</Button>
							)}
						</div>
					)}

					{post.evidenceLinks.some((link) => link.trim() !== "") && (
						<div style={{ marginBottom: spacing.xl }}>
							<h3
								style={{
									fontFamily: typography.fontHeading,
									fontSize: typography.sizes.xl,
									fontWeight: "bold",
									marginBottom: spacing.md,
									color: themeStyles.text,
								}}
							>
								Evidence Links
							</h3>

							<ul
								style={{
									listStyleType: "disc",
									paddingLeft: spacing.xl,
									color: themeStyles.secondaryText,
									background: colors.neutral[50],
									padding: spacing.lg,
									borderRadius: themeStyles.radius,
								}}
							>
								{post.evidenceLinks.map(
									(link, idx) =>
										link && (
											<li key={idx} style={{ marginBottom: spacing.sm }}>
												<a
													href={link}
													target="_blank"
													rel="noopener noreferrer"
													style={{
														color: themeStyles.buttonBg,
														textDecoration: "underline",
														fontSize: typography.sizes.sm,
														fontWeight: "500",
													}}
													title={link}
												>
													{linkShortner(link)}
												</a>
											</li>
										)
								)}
							</ul>
						</div>
					)}

					<div style={{ marginBottom: spacing.xl }}>
						<h3
							style={{
								fontFamily: typography.fontHeading,
								fontSize: typography.sizes.xl,
								fontWeight: "bold",
								marginBottom: spacing.md,
								color: themeStyles.text,
							}}
						>
							Tags
						</h3>

						<div style={{ display: "flex", flexWrap: "wrap", gap: spacing.sm }}>
							{post.tags.map((tag, i) => (
								<span
									key={i}
									style={{
										background: colors.primary[100],
										color: colors.primary[700],
										padding: `${spacing.xs} ${spacing.md}`,
										borderRadius: themeStyles.radiusFull,
										fontSize: typography.sizes.sm,
										fontWeight: "500",
									}}
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					<div
						style={{
							display: "flex",
							gap: spacing.lg,
							color: themeStyles.secondaryText,
							fontSize: typography.sizes.sm,
							background: colors.neutral[50],
							padding: spacing.md,
							borderRadius: themeStyles.radius,
						}}
					>
						<span style={{ display: "flex", alignItems: "center" }}>
							<FaEye style={{ marginRight: spacing.xs }} /> {post.views} Views
						</span>
						<span style={{ display: "flex", alignItems: "center" }}>
							<FaShareAlt style={{ marginRight: spacing.xs }} /> {post.shares}{" "}
							Shares
						</span>
					</div>
				</div>

				{isUser && (
					<div
						style={{
							borderTop: `1px solid ${themeStyles.border}`,
							paddingTop: spacing.xl,
							marginTop: spacing.xl,
						}}
					>
						<h3
							style={{
								fontFamily: typography.fontHeading,
								fontSize: typography.sizes["2xl"],
								fontWeight: "bold",
								marginBottom: spacing.lg,
								color: themeStyles.text,
							}}
						>
							Comments
						</h3>

						<div style={{ marginBottom: spacing.xl }}>
							{post.comments.length === 0 ? (
								<p
									style={{
										color: themeStyles.secondaryText,
										fontSize: typography.sizes.sm,
										padding: spacing.lg,
										background: colors.neutral[50],
										borderRadius: themeStyles.radius,
										textAlign: "center",
									}}
								>
									No comments yet. Be the first to comment!
								</p>
							) : (
								post.comments.map((comment, idx) => (
									<div
										key={idx}
										style={{
											border: `1px solid ${themeStyles.border}`,
											padding: spacing.lg,
											borderRadius: themeStyles.radiusMd,
											background: themeStyles.inputBg,
											marginBottom: spacing.lg,
											boxShadow: themeStyles.shadowSm,
										}}
									>
										<p
											style={{
												color: themeStyles.text,
												fontSize: typography.sizes.base,
											}}
										>
											{comment.text}
										</p>

										{comment.attachedLink && (
											<a
												href={comment.attachedLink}
												target="_blank"
												rel="noopener noreferrer"
												style={{
													color: themeStyles.buttonBg,
													textDecoration: "underline",
													fontSize: typography.sizes.sm,
													marginTop: spacing.sm,
													display: "inline-block",
												}}
												title={comment.attachedLink}
											>
												{linkShortner(comment.attachedLink)}
											</a>
										)}

										<button
											onClick={() => setReplyTo(idx)}
											style={{
												color: themeStyles.buttonBg,
												fontSize: typography.sizes.sm,
												marginTop: spacing.md,
												display: "flex",
												alignItems: "center",
												gap: spacing.xs,
												background: "none",
												border: "none",
												cursor: "pointer",
												fontWeight: "500",
											}}
											aria-label={`Reply to comment ${idx + 1}`}
										>
											<FaReply /> Reply
										</button>

										{replyTo === idx && (
											<div style={{ marginTop: spacing.md }}>
												<textarea
													value={replyText}
													onChange={(e) => setReplyText(e.target.value)}
													placeholder="Write a reply..."
													style={{
														width: "100%",
														padding: spacing.md,
														border: `1px solid ${themeStyles.inputBorder}`,
														borderRadius: themeStyles.radius,
														background: themeStyles.inputBg,
														color: themeStyles.text,
														boxShadow: themeStyles.shadowSm,
														outline: "none",
														transition: "all 0.2s ease",
														resize: "vertical",
														fontSize: typography.sizes.base,
													}}
													rows={2}
													aria-label="Reply input"
												></textarea>

												<div
													style={{
														display: "flex",
														gap: spacing.md,
														marginTop: spacing.sm,
													}}
												>
													<Button
														onClick={() => {
															setCommentText(replyText);
															handleCommentSubmit();
														}}
														variant="primary"
														size="small"
														ariaLabel="Submit reply"
													>
														Submit Reply
													</Button>

													<Button
														onClick={() => setReplyTo(null)}
														variant="secondary"
														size="small"
														ariaLabel="Cancel reply"
													>
														Cancel
													</Button>
												</div>
											</div>
										)}

										{comment.replies && comment.replies.length > 0 && (
											<div
												style={{
													marginLeft: spacing.xl,
													marginTop: spacing.md,
												}}
											>
												{comment.replies.map((reply, rIdx) => (
													<div
														key={rIdx}
														style={{
															borderLeft: `2px solid ${colors.primary[200]}`,
															paddingLeft: spacing.lg,
															fontSize: typography.sizes.sm,
															color: themeStyles.secondaryText,
															marginBottom: spacing.sm,
															paddingTop: spacing.sm,
															paddingBottom: spacing.sm,
														}}
													>
														<p style={{ marginBottom: spacing.xs }}>
															{reply.text}
														</p>
														{reply.attachedLink && (
															<a
																href={reply.attachedLink}
																target="_blank"
																rel="noopener noreferrer"
																style={{
																	color: themeStyles.buttonBg,
																	textDecoration: "underline",
																}}
															>
																{linkShortner(reply.attachedLink)}
															</a>
														)}
													</div>
												))}
											</div>
										)}
									</div>
								))
							)}
						</div>

						<div>
							<textarea
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								placeholder="Write a comment..."
								style={{
									width: "100%",
									padding: spacing.md,
									border: `1px solid ${themeStyles.inputBorder}`,
									borderRadius: themeStyles.radius,
									background: themeStyles.inputBg,
									color: themeStyles.text,
									boxShadow: themeStyles.shadowSm,
									outline: "none",
									transition: "all 0.2s ease",
									resize: "vertical",
									fontSize: typography.sizes.base,
									marginBottom: spacing.md,
								}}
								rows={4}
								aria-label="Comment input"
							></textarea>

							<input
								type="url"
								value={attachedLink}
								onChange={(e) => setAttachedLink(e.target.value)}
								placeholder="Attach a link (optional)"
								style={{
									width: "100%",
									padding: spacing.md,
									border: `1px solid ${themeStyles.inputBorder}`,
									borderRadius: themeStyles.radius,
									background: themeStyles.inputBg,
									color: themeStyles.text,
									boxShadow: themeStyles.shadowSm,
									outline: "none",
									transition: "all 0.2s ease",
									marginBottom: spacing.lg,
									fontSize: typography.sizes.base,
								}}
								aria-label="Comment link"
							/>

							<Button
								onClick={handleCommentSubmit}
								variant="primary"
								size="medium"
								ariaLabel="Add comment"
							>
								Add Comment
							</Button>
						</div>
					</div>
				)}
			</motion.div>
		</motion.div>
	);
};

// Main Component
const NewsDebunkingPlatform = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [postSelectedForEdit, setPostSelectedForEdit] = useState<Post | null>(
		null
	);
	const [postSelected, setPostSelected] = useState<Post | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<"date" | "upvotes">("date");
	const [showTooltip, setShowTooltip] = useState(true);
	const [user, setUser] = useState<{
		username: string;
		role: "admin" | "user";
	} | null>(null);
	const [showLogin, setShowLogin] = useState(true);
	const [userVotes, setUserVotes] = useState<{
		[postId: number]: "up" | "down";
	}>({});

	const [posts, setPosts] = useState<Post[]>([
		{
			id: 1,
			newsHeading: "Real Madrid Claims UCL Victory Despite 5-1 Loss to Arsenal",
			falseClaimers: ["https://x.com/MadridXtra"],
			debunkExplanation:
				"<p>Posts on X falsely claimed Real Madrid won the Champions League despite a 2-1 loss to Arsenal on April 16, 2025. In reality, Arsenal advanced with a 5-1 aggregate score, ending Madrid's campaign.</p>",
			imageURLs: [
				"https://images.unsplash.com/photo-1610057998879-09386cfe7c3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdlYXBvbnxlbnwwfHwwfHx8MA%3D%3D",
			],
			evidenceLinks: [
				"https://www.aljazeera.com/sports/2025/4/17/real-madrid-defeated-by-arsenal",
			],
			comments: [
				{ text: "This is shocking misinformation!", attachedLink: "" },
			],
			createdAt: "2025-04-17T15:00:00Z",
			tags: ["Sports", "Misinformation"],
			upvotes: 45,
			downvotes: 10,
			isPinned: true,
			views: 1200,
			shares: 35,
			isDraft: false,
			credibility: "False",
		},
		{
			id: 2,
			newsHeading: "Bill Maher Banned from Lebanon Over Snow White Jokes",
			falseClaimers: ["https://x.com/billmaher"],
			debunkExplanation:
				"<p>A viral X post claimed Lebanon banned Bill Maher for joking about Snow White's box office flop. No such ban exists; Maher's comments were satirical, as reported by Deadline.</p>",
			imageURLs: [
				"https://images.unsplash.com/photo-1611162617474-5b21e879e113",
			],
			evidenceLinks: [
				"https://deadline.com/2025/04/real-time-bill-maher-snow-white-lebanon-ban-1235912345/",
			],
			comments: [],
			createdAt: "2025-04-19T10:00:00Z",
			tags: ["Entertainment", "Politics"],
			upvotes: 30,
			downvotes: 5,
			isPinned: false,
			views: 800,
			shares: 20,
			isDraft: false,
			credibility: "False",
		},
		{
			id: 3,
			newsHeading: "False Claim About Global Warming Data Manipulation",
			falseClaimers: ["https://x.com/ClimateSkeptic"],
			debunkExplanation:
				"<p>A post on X claimed that global warming data was manipulated by scientists to exaggerate temperature rises. Official reports from NASA and NOAA confirm the data is accurate and peer-reviewed.</p>",
			imageURLs: [
				"https://images.unsplash.com/photo-1454789548928-9efd52dc4031",
			],
			evidenceLinks: [
				"https://www.nasa.gov/feature/goddard/2025/global-warming-data-verified",
				"https://www.noaa.gov/news/2025-climate-data-integrity",
			],
			comments: [],
			createdAt: "2025-04-27T12:00:00Z",
			tags: ["Environment", "Science", "Misinformation"],
			upvotes: 15,
			downvotes: 3,
			isPinned: false,
			views: 500,
			shares: 10,
			isDraft: false,
			credibility: "False",
		},
		{
			id: 4,
			newsHeading: "Moon Landing Hoax Resurfaces on Social Media",
			falseClaimers: ["https://x.com/TruthSeeker123"],
			debunkExplanation:
				"<p>A viral X post claimed the 1969 moon landing was staged. NASA's Apollo program provided extensive evidence, including lunar rocks and photos, verified by independent scientists.</p>",
			imageURLs: ["https://images.unsplash.com/photo-1543339308-43e59d6b73a6"],
			evidenceLinks: ["https://www.nasa.gov/history/apollo/apollo-11.html"],
			comments: [],
			createdAt: "2025-04-25T09:00:00Z",
			tags: ["Space", "Conspiracy", "Misinformation"],
			upvotes: 20,
			downvotes: 8,
			isPinned: false,
			views: 600,
			shares: 15,
			isDraft: false,
			credibility: "False",
		},
		{
			id: 5,
			newsHeading: "Vaccine Microchip Conspiracy Debunked",
			falseClaimers: ["https://x.com/HealthTruthNow"],
			debunkExplanation:
				"<p>Claims on X suggested COVID-19 vaccines contain microchips for tracking. Studies by WHO and CDC confirm vaccines are safe and contain no such technology.</p>",
			imageURLs: [
				"https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZhY2NpbmV8ZW58MHx8MHx8fDA%3D",
			],
			evidenceLinks: [
				"https://www.who.int/news-room/feature-stories/detail/vaccine-safety",
				"https://www.cdc.gov/vaccinesafety/index.html",
			],
			comments: [{ text: "This myth needs to stop!", attachedLink: "" }],
			createdAt: "2025-04-24T14:30:00Z",
			tags: ["Health", "Conspiracy", "Misinformation"],
			upvotes: 35,
			downvotes: 12,
			isPinned: false,
			views: 900,
			shares: 25,
			isDraft: false,
			credibility: "False",
		},

		{
			id: 8,
			newsHeading: "Flat Earth Theory Revived in Viral Post",
			falseClaimers: ["https://x.com/EarthIsFlatNow"],
			debunkExplanation:
				"<p>A post on X claimed the Earth is flat, citing distorted images. Scientific evidence, including satellite imagery and GPS, confirms the Earth is an oblate spheroid.</p>",
			imageURLs: [
				"https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
			],
			evidenceLinks: ["https://www.space.com/earth-is-spherical.html"],
			comments: [],
			createdAt: "2025-04-22T16:00:00Z",
			tags: ["Science", "Conspiracy", "Misinformation"],
			upvotes: 10,
			downvotes: 5,
			isPinned: false,
			views: 400,
			shares: 8,
			isDraft: false,
			credibility: "False",
		},
	]);

	useEffect(() => {
		// Simulate fetching posts
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	const showToast = (message: string) => toast.success(message);

	const handleUploadPost = (post: Post) => {
		if (postSelectedForEdit) {
			setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
			setPostSelectedForEdit(null);
		} else {
			setPosts([post, ...posts]);
		}
		setIsCreating(false);
	};

	const handleDeletePost = (postId: number) => {
		setPosts((prev) => prev.filter((p) => p.id !== postId));
		showToast("Post deleted successfully");
	};

	const handleSharePost = (post: Post) => {
		if (user?.role === "user") {
			showToast("Thank you for sharing this debunked claim!");
			setPosts((prev) =>
				prev.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1 } : p))
			);
		} else {
			const shareData = {
				title: post.newsHeading,
				text: "Check out this debunked claim on Truthify!",
				url: window.location.href,
			};
			if (navigator.share) {
				navigator
					.share(shareData)
					.then(() => {
						setPosts((prev) =>
							prev.map((p) =>
								p.id === post.id ? { ...p, shares: p.shares + 1 } : p
							)
						);
					})
					.catch((err) => console.error("Error sharing:", err));
			} else {
				showToast("Share not supported. Copy the URL manually.");
			}
		}
	};

	const handlePinPost = (postId: number) => {
		setPosts((prev) =>
			prev.map((p) =>
				p.id === postId
					? { ...p, isPinned: !p.isPinned }
					: { ...p, isPinned: false }
			)
		);
		showToast("Post pinned/unpinned successfully");
	};

	const handleVote = (postId: number, type: "up" | "down") => {
		if (userVotes[postId]) {
			showToast("You have already voted on this post.");
			return;
		}

		setPosts((prev) =>
			prev.map((p) =>
				p.id === postId
					? {
							...p,
							upvotes: type === "up" ? p.upvotes + 1 : p.upvotes,
							downvotes: type === "down" ? p.downvotes + 1 : p.downvotes,
					  }
					: p
			)
		);
		setUserVotes((prev) => ({ ...prev, [postId]: type }));
		showToast(`You ${type === "up" ? "liked" : "disliked"} the post!`);
	};

	const handleLogin = (username: string, role: "admin" | "user") => {
		setUser({ username, role });
		showToast(`Logged in as ${username}`);
	};

	const handleRegister = (newUser: { username: string; role: "user" }) => {
		setUser(newUser);
		setShowLogin(true);
		showToast(`Registered and logged in as ${newUser.username}`);
	};

	const handleLogout = () => {
		setUser(null);
		setUserVotes({});
		showToast("Logged out successfully");
	};

	const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));
	const filteredPosts = posts
		.filter((post) => !post.isDraft)
		.filter(
			(post) =>
				(post.newsHeading.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.falseClaimers.some((acc) =>
						acc.toLowerCase().includes(searchQuery.toLowerCase())
					)) &&
				(!selectedTag || post.tags.includes(selectedTag))
		)
		.sort((a, b) => {
			if (sortBy === "date") {
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			} else {
				return b.upvotes - a.upvotes;
			}
		})
		.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

	return (
		<div
			style={{
				minHeight: "100vh",
				background: themeStyles.background,
				color: themeStyles.text,
				fontFamily: typography.fontPrimary,
			}}
		>
			<Toaster
				position="top-right"
				toastOptions={{
					style: {
						background: themeStyles.cardBg,
						color: themeStyles.text,
						borderRadius: themeStyles.radius,
						boxShadow: themeStyles.shadowMd,
					},
					success: {
						iconTheme: {
							primary: themeStyles.accent,
							secondary: "white",
						},
					},
				}}
			/>

			{!user ? (
				showLogin ? (
					<LoginForm
						onLogin={handleLogin}
						onSwitchToRegister={() => setShowLogin(false)}
					/>
				) : (
					<RegisterForm
						onRegister={handleRegister}
						onSwitchToLogin={() => setShowLogin(true)}
					/>
				)
			) : (
				<>
					{/* Navbar */}
					<nav
						style={{
							position: "sticky",
							top: 0,
							zIndex: 50,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: `${spacing.md} ${spacing.xl}`,
							background: themeStyles.cardBg,
							backdropFilter: "blur(10px)",
							boxShadow: themeStyles.shadow,
							borderBottom: `1px solid ${themeStyles.border}`,
						}}
					>
						<div
							style={{
								fontFamily: typography.fontHeading,
								fontSize: typography.sizes["3xl"],
								fontWeight: "bold",
								color: themeStyles.buttonBg,
								display: "flex",
								alignItems: "center",
								gap: spacing.sm,
							}}
						>
							<div
								style={{
									background: colors.primary[600],
									color: "white",
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: "bold",
									fontSize: typography.sizes.xl,
								}}
							>
								D
							</div>
							Debunk Lover
						</div>

						<div
							style={{ display: "flex", alignItems: "center", gap: spacing.lg }}
						>
							

							{/* User Info and Logout for Desktop */}
							<div
								className="hidden md:flex md:items-center md:gap-4"
								style={{
									display: "flex",
									alignItems: "center",
									gap: spacing.lg,
								}}
							>
								{user && (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: spacing.lg,
										}}
									>
										<span
											style={{
												fontSize: typography.sizes.sm,
												color: themeStyles.text,
												background: colors.neutral[100],
												padding: `${spacing.xs} ${spacing.md}`,
												borderRadius: themeStyles.radiusFull,
												fontWeight: "500",
											}}
										>
											{user.username} ({user.role})
										</span>

										<Button
											onClick={handleLogout}
											variant="danger"
											size="small"
											ariaLabel="Logout"
										>
											Logout
										</Button>
									</div>
								)}

								{user.role === "admin" && (
									<Button
										onClick={() => {
											setIsCreating(true);
											setPostSelectedForEdit(null);
											window.scrollTo({ top: 0, behavior: "smooth" });
										}}
										variant="primary"
										size="medium"
										ariaLabel="Create post"
										style={{
											position: "relative",
										}}
									>
										Create Post
									</Button>
								)}

								{/* Search Bar for Desktop */}
								<div style={{ position: "relative" }} className="md:block">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Search posts..."
										style={{
											padding: `${spacing.sm} ${spacing.lg} ${spacing.sm} ${spacing.xl}`,
											border: `1px solid ${themeStyles.inputBorder}`,
											borderRadius: themeStyles.radiusFull,
											background: themeStyles.inputBg,
											color: themeStyles.text,
											boxShadow: themeStyles.shadowSm,
											outline: "none",
											transition: "all 0.2s ease",
											fontSize: typography.sizes.sm,
											width: "240px",
										}}
										onFocus={(e) => {
											e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
											e.currentTarget.style.borderColor = themeStyles.buttonBg;
										}}
										onBlur={(e) => {
											e.currentTarget.style.boxShadow = themeStyles.shadowSm;
											e.currentTarget.style.borderColor =
												themeStyles.inputBorder;
										}}
										aria-label="Search posts"
									/>
									<FiSearch
										style={{
											position: "absolute",
											left: spacing.md,
											top: "50%",
											transform: "translateY(-50%)",
											color: themeStyles.secondaryText,
										}}
									/>
								</div>
							</div>
						</div>
					</nav>

					{/* Mobile Actions Row */}
					{user && (
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: spacing.md,
								background: themeStyles.cardBg,
								boxShadow: themeStyles.shadowSm,
								borderBottom: `1px solid ${themeStyles.border}`,
							}}
							className="md:hidden"
						>
							{user.role === "admin" && (
								<Button
									onClick={() => {
										setIsCreating(true);
										setPostSelectedForEdit(null);
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									variant="primary"
									size="small"
									ariaLabel="Create post"
									fullWidth
								>
									Create Post
								</Button>
							)}
						</div>
					)}

					{/* Sidebar */}
					<AnimatePresence>
						{sidebarOpen && (
							<motion.div
								initial={{ x: "-100%" }}
								animate={{ x: 0 }}
								exit={{ x: "-100%" }}
								style={{
									position: "fixed",
									top: 0,
									bottom: 0,
									left: 0,
									zIndex: 50,
									width: "16rem",
									background: themeStyles.cardBg,
									backdropFilter: "blur(10px)",
									boxShadow: themeStyles.shadowLg,
									borderRight: `1px solid ${themeStyles.border}`,
								}}
								className="md:hidden"
							>
								<div
									style={{
										padding: spacing.xl,
										display: "flex",
										flexDirection: "column",
										height: "100%",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: spacing.xl,
										}}
									>
										<div
											style={{
												fontFamily: typography.fontHeading,
												fontSize: typography.sizes.xl,
												fontWeight: "bold",
												color: themeStyles.buttonBg,
											}}
										>
											Debunk Lover
										</div>

										<button
											onClick={() => setSidebarOpen(false)}
											style={{
												color: themeStyles.secondaryText,
												background: colors.neutral[100],
												width: "32px",
												height: "32px",
												borderRadius: "50%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												border: "none",
												cursor: "pointer",
											}}
											aria-label="Close sidebar"
										>
											<FiX size={20} />
										</button>
									</div>

									{/* User Info and Logout for Mobile Sidebar */}
									{user && (
										<div style={{ marginBottom: spacing.xl }}>
											<div
												style={{
													fontSize: typography.sizes.sm,
													color: themeStyles.text,
													display: "flex",
													alignItems: "center",
													marginBottom: spacing.md,
													background: colors.neutral[100],
													padding: spacing.md,
													borderRadius: themeStyles.radius,
													fontWeight: "500",
												}}
											>
												Logged in as: {user.username} ({user.role})
											</div>

											<Button
												onClick={handleLogout}
												variant="danger"
												size="small"
												fullWidth
												ariaLabel="Logout"
											>
												Logout
											</Button>
										</div>
									)}

									{/* Search Bar for Mobile Sidebar */}
									<div
										style={{ position: "relative", marginBottom: spacing.xl }}
									>
										<input
											type="text"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search posts..."
											style={{
												padding: `${spacing.md} ${spacing.lg} ${spacing.md} ${spacing.xl}`,
												border: `1px solid ${themeStyles.inputBorder}`,
												borderRadius: themeStyles.radius,
												background: themeStyles.inputBg,
												color: themeStyles.text,
												boxShadow: themeStyles.shadowSm,
												outline: "none",
												transition: "all 0.2s ease",
												fontSize: typography.sizes.base,
												width: "100%",
											}}
											onFocus={(e) => {
												e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
												e.currentTarget.style.borderColor =
													themeStyles.buttonBg;
											}}
											onBlur={(e) => {
												e.currentTarget.style.boxShadow = themeStyles.shadowSm;
												e.currentTarget.style.borderColor =
													themeStyles.inputBorder;
											}}
											aria-label="Search posts"
										/>
										<FiSearch
											style={{
												position: "absolute",
												left: spacing.md,
												top: "50%",
												transform: "translateY(-50%)",
												color: themeStyles.secondaryText,
											}}
										/>
									</div>

									<h3
										style={{
											fontFamily: typography.fontHeading,
											fontSize: typography.sizes.lg,
											fontWeight: "600",
											marginBottom: spacing.md,
											color: themeStyles.text,
										}}
									>
										Filter By Tags
									</h3>

									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: spacing.sm,
											marginBottom: spacing.xl,
										}}
									>
										<button
											onClick={() => {
												setSelectedTag(null);
												setSidebarOpen(false);
											}}
											style={{
												textAlign: "left",
												padding: `${spacing.sm} ${spacing.md}`,
												borderRadius: themeStyles.radius,
												background: selectedTag
													? "transparent"
													: colors.primary[50],
												color: selectedTag
													? themeStyles.text
													: colors.primary[700],
												border: selectedTag
													? `1px solid ${themeStyles.border}`
													: `1px solid ${colors.primary[200]}`,
												fontSize: typography.sizes.sm,
												fontWeight: selectedTag ? "normal" : "500",
												cursor: "pointer",
												transition: "all 0.2s ease",
											}}
										>
											All Posts
										</button>

										{allTags.map((tag) => (
											<button
												key={tag}
												onClick={() => {
													setSelectedTag(tag);
													setSidebarOpen(false);
												}}
												style={{
													textAlign: "left",
													padding: `${spacing.sm} ${spacing.md}`,
													borderRadius: themeStyles.radius,
													background:
														selectedTag === tag
															? colors.primary[50]
															: "transparent",
													color:
														selectedTag === tag
															? colors.primary[700]
															: themeStyles.text,
													border:
														selectedTag === tag
															? `1px solid ${colors.primary[200]}`
															: `1px solid ${themeStyles.border}`,
													fontSize: typography.sizes.sm,
													fontWeight: selectedTag === tag ? "500" : "normal",
													cursor: "pointer",
													transition: "all 0.2s ease",
												}}
											>
												{tag}
											</button>
										))}
									</div>

									{/* Sort Options for Mobile Sidebar */}
									<h3
										style={{
											fontFamily: typography.fontHeading,
											fontSize: typography.sizes.lg,
											fontWeight: "600",
											marginBottom: spacing.md,
											color: themeStyles.text,
										}}
									>
										Sort Posts By
									</h3>

									<select
										value={sortBy}
										onChange={(e) => {
											setSortBy(e.target.value as "date" | "upvotes");
											setSidebarOpen(false);
										}}
										style={{
											padding: spacing.md,
											border: `1px solid ${themeStyles.inputBorder}`,
											borderRadius: themeStyles.radius,
											background: themeStyles.inputBg,
											color: themeStyles.text,
											boxShadow: themeStyles.shadowSm,
											outline: "none",
											transition: "all 0.2s ease",
											fontSize: typography.sizes.sm,
											width: "100%",
											cursor: "pointer",
										}}
										onFocus={(e) => {
											e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
											e.currentTarget.style.borderColor = themeStyles.buttonBg;
										}}
										onBlur={(e) => {
											e.currentTarget.style.boxShadow = themeStyles.shadowSm;
											e.currentTarget.style.borderColor =
												themeStyles.inputBorder;
										}}
										aria-label="Sort posts"
									>
										<option value="date">Most Recent</option>
										<option value="upvotes">Most Upvoted</option>
									</select>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Filter Bar (Desktop Only) */}
					<div
						style={{
							position: "sticky",
							top: "calc(64px + 1px)", // Navbar height + border
							zIndex: 40,
							background: themeStyles.cardBg,
							backdropFilter: "blur(10px)",
							boxShadow: themeStyles.shadowSm,
							padding: `${spacing.md} ${spacing.xl}`,
							marginBottom: spacing.xl,
							borderBottom: `1px solid ${themeStyles.border}`,
						}}
						className="hidden md:block"
					>
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								alignItems: "center",
								justifyContent: "space-between",
								gap: spacing.lg,
								maxWidth: "80rem",
								margin: "0 auto",
							}}
						>
							<div
								style={{ display: "flex", gap: spacing.sm, flexWrap: "wrap" }}
							>
								<button
									onClick={() => setSelectedTag(null)}
									style={{
										padding: `${spacing.xs} ${spacing.md}`,
										borderRadius: themeStyles.radiusFull,
										fontSize: typography.sizes.sm,
										background: !selectedTag
											? colors.primary[100]
											: colors.neutral[100],
										color: !selectedTag
											? colors.primary[800]
											: themeStyles.text,
										border: "none",
										cursor: "pointer",
										transition: "all 0.2s ease",
										fontWeight: !selectedTag ? "500" : "normal",
									}}
									onMouseOver={(e) => {
										if (!selectedTag) {
											e.currentTarget.style.background = colors.primary[200];
										} else {
											e.currentTarget.style.background = colors.neutral[200];
										}
									}}
									onMouseOut={(e) => {
										if (!selectedTag) {
											e.currentTarget.style.background = colors.primary[100];
										} else {
											e.currentTarget.style.background = colors.neutral[100];
										}
									}}
								>
									All
								</button>

								{allTags.slice(0, 7).map((tag) => (
									<button
										key={tag}
										onClick={() => setSelectedTag(tag)}
										style={{
											padding: `${spacing.xs} ${spacing.md}`,
											borderRadius: themeStyles.radiusFull,
											fontSize: typography.sizes.sm,
											background:
												selectedTag === tag
													? colors.primary[100]
													: colors.neutral[100],
											color:
												selectedTag === tag
													? colors.primary[800]
													: themeStyles.text,
											border: "none",
											cursor: "pointer",
											transition: "all 0.2s ease",
											fontWeight: selectedTag === tag ? "500" : "normal",
										}}
										onMouseOver={(e) => {
											if (selectedTag === tag) {
												e.currentTarget.style.background = colors.primary[200];
											} else {
												e.currentTarget.style.background = colors.neutral[200];
											}
										}}
										onMouseOut={(e) => {
											if (selectedTag === tag) {
												e.currentTarget.style.background = colors.primary[100];
											} else {
												e.currentTarget.style.background = colors.neutral[100];
											}
										}}
									>
										{tag}
									</button>
								))}
							</div>

							<select
								value={sortBy}
								onChange={(e) =>
									setSortBy(e.target.value as "date" | "upvotes")
								}
								style={{
									padding: `${spacing.sm} ${spacing.md}`,
									border: `1px solid ${themeStyles.inputBorder}`,
									borderRadius: themeStyles.radius,
									background: themeStyles.inputBg,
									color: themeStyles.text,
									boxShadow: themeStyles.shadowSm,
									outline: "none",
									transition: "all 0.2s ease",
									fontSize: typography.sizes.sm,
									cursor: "pointer",
								}}
								onFocus={(e) => {
									e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
									e.currentTarget.style.borderColor = themeStyles.buttonBg;
								}}
								onBlur={(e) => {
									e.currentTarget.style.boxShadow = themeStyles.shadowSm;
									e.currentTarget.style.borderColor = themeStyles.inputBorder;
								}}
								aria-label="Sort posts"
							>
								<option value="date">Sort by Date</option>
								<option value="upvotes">Sort by Upvotes</option>
							</select>
						</div>
					</div>

					{/* Main Content */}
					<main
						style={{
							padding: spacing.xl,
							maxWidth: "80rem",
							margin: "0 auto",
							minHeight: "calc(100vh - 64px - 52px)", // 100vh - navbar - filter bar
						}}
					>
						<AnimatePresence mode="wait">
							{isCreating || postSelectedForEdit ? (
								<PostForm
									onSubmit={handleUploadPost}
									onCancel={() => {
										setIsCreating(false);
										setPostSelectedForEdit(null);
									}}
									initialPost={postSelectedForEdit || undefined}
									showToast={showToast}
								/>
							) : (
								<>
									{isLoading ? (
										<div
											style={{
												display: "grid",
												gridTemplateColumns:
													"repeat(auto-fill, minmax(300px, 1fr))",
												gap: spacing.xl,
											}}
										>
											{[...Array(6)].map((_, i) => (
												<div
													key={i}
													style={{
														background: themeStyles.cardBg,
														padding: spacing.lg,
														borderRadius: themeStyles.radiusLg,
														boxShadow: themeStyles.shadowMd,
														animation: "pulse 1.5s infinite",
														border: `1px solid ${themeStyles.border}`,
													}}
												>
													<div
														style={{
															height: "15rem",
															background: colors.neutral[100],
															borderRadius: themeStyles.radiusMd,
															marginBottom: spacing.lg,
														}}
													></div>
													<div
														style={{
															height: "1.5rem",
															background: colors.neutral[100],
															borderRadius: themeStyles.radius,
															width: "75%",
															marginBottom: spacing.sm,
														}}
													></div>
													<div
														style={{
															height: "1rem",
															background: colors.neutral[100],
															borderRadius: themeStyles.radius,
															width: "50%",
														}}
													></div>
												</div>
											))}
										</div>
									) : filteredPosts.length === 0 ? (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											style={{
												textAlign: "center",
												marginTop: spacing["2xl"],
												color: themeStyles.secondaryText,
												background: colors.neutral[50],
												padding: spacing.xl,
												borderRadius: themeStyles.radiusLg,
												boxShadow: themeStyles.shadowSm,
												border: `1px dashed ${themeStyles.border}`,
											}}
										>
											<div
												style={{
													fontSize: typography.sizes.xl,
													marginBottom: spacing.md,
												}}
											>
												No posts found
											</div>
											<div style={{ fontSize: typography.sizes.base }}>
												{searchQuery || selectedTag
													? "Try adjusting your search or filter criteria."
													: user.role === "admin"
													? 'Click "Create Post" to start!'
													: "Check back later for new content!"}
											</div>
										</motion.div>
									) : (
										<div
											style={{
												display: "grid",
												gridTemplateColumns:
													"repeat(auto-fill, minmax(300px, 1fr))",
												gap: spacing.xl,
											}}
										>
											{filteredPosts.map((post) => (
												<PostCard
													key={post.id}
													post={post}
													onView={(p) => setPostSelected(p)}
													onUpdate={(p) => {
														setPostSelectedForEdit(p);
														setIsCreating(true);
													}}
													onDelete={handleDeletePost}
													onShare={handleSharePost}
													onPin={handlePinPost}
													onVote={handleVote}
													isAdmin={user.role === "admin"}
													isUser={user.role === "user"}
													hasVoted={!!userVotes[post.id]}
												/>
											))}
										</div>
									)}
								</>
							)}
						</AnimatePresence>
					</main>

					{/* Footer */}
					<footer
						style={{
							padding: `${spacing.xl} ${spacing.md}`,
							background: themeStyles.cardBg,
							borderTop: `1px solid ${themeStyles.border}`,
							textAlign: "center",
							color: themeStyles.secondaryText,
							fontSize: typography.sizes.sm,
						}}
					>
						<p>
							&copy; {new Date().getFullYear()} Debunk Lover. A platform to
							combat misinformation.
						</p>
					</footer>

					<AnimatePresence>
						{postSelected && (
							<PostModal
								post={postSelected}
								onClose={() => setPostSelected(null)}
								onAddComment={(postId, comment) =>
									setPosts((prev) =>
										prev.map((p) =>
											p.id === postId
												? {
														...p,
														comments: comment.replies
															? p.comments.map((c, i) =>
																	i ===
																	post.comments.findIndex(
																		(c2) => c2.text === comment.text
																	)
																		? comment
																		: c
															  )
															: [...p.comments, comment],
												  }
												: p
										)
									)
								}
								onUpdatePost={(updatedPost) =>
									setPosts((prev) =>
										prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
									)
								}
								showToast={showToast}
								isAdmin={user.role === "admin"}
								isUser={user.role === "user"}
							/>
						)}
					</AnimatePresence>
				</>
			)}

			<style jsx global>{`
				body {
					font-family: ${typography.fontPrimary}, sans-serif;
					margin: 0;
					padding: 0;
					background: ${themeStyles.background};
					color: ${themeStyles.text};
				}
				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					font-family: ${typography.fontHeading}, sans-serif;
				}
				.prose {
					max-width: none;
				}
				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				/* Responsive utilities */
				@media (min-width: 768px) {
					.md\\:hidden {
						display: none;
					}
					.md\\:block {
						display: block;
					}
					.md\\:flex {
						display: flex;
					}
					.md\\:items-center {
						align-items: center;
					}
					.md\\:gap-4 {
						gap: 1rem;
					}
				}

				@media (max-width: 767px) {
					.hidden {
						display: none;
					}
					.md\\:block {
						display: none;
					}
					.md\\:flex {
						display: none;
					}
				}

				@keyframes pulse {
					0% {
						opacity: 1;
					}
					50% {
						opacity: 0.7;
					}
					100% {
						opacity: 1;
					}
				}
			`}</style>
		</div>
	);
};

export default NewsDebunkingPlatform;
