"use client";
import React, { useEffect, useState, useRef } from "react";

type Role = "Admin" | "Manager" | "Member";
type AccessLevel = "Full" | "Limited" | "Read-only";

interface TeamMember {
	id: string;
	name: string;
	avatarUrl: string;
	role: Role;
	access: AccessLevel;
	activity: string[];
	lastActive: string;
}

interface ActivityEntry {
	date: string;
	count: number;
}

const ROLES: Role[] = ["Admin", "Manager", "Member"];
const ACCESS: AccessLevel[] = ["Full", "Limited", "Read-only"];
const NAMES = [
	"Ana Garcia",
	"Luis Martin",
	"Maria Jose",
	"Carlos Ruiz",
	"Elena Vega",
	"Javier Lopez",
	"Carmen Silva",
	"Diego Torres",
	"Lucia Moreno",
	"Pablo Castro",
	"Isabel Ramos",
	"Miguel Herrera",
	"Sofia Delgado",
	"Andres Pena",
	"Natalia Cruz",
	"Fernando Aguirre",
	"Valeria Santos",
	"Roberto Mendoza",
	"Adriana Flores",
];

function randomActivity(days = 60) {
	const today = new Date();
	let arr: string[] = [];
	for (let i = 0; i < 12 + Math.floor(Math.random() * 18); i++) {
		const d = new Date(today);
		d.setDate(today.getDate() - Math.floor(Math.random() * days));
		arr.push(d.toISOString().split("T")[0]);
	}
	return arr;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.substring(0, 2)
		.toUpperCase();
}

function getAvatarColor(name: string): string {
	const colors = [
		"bg-gradient-to-br from-blue-500 to-blue-700",
		"bg-gradient-to-br from-indigo-500 to-indigo-700",
		"bg-gradient-to-br from-violet-500 to-violet-700",
		"bg-gradient-to-br from-cyan-500 to-cyan-700",
		"bg-gradient-to-br from-sky-500 to-sky-700",
		"bg-gradient-to-br from-slate-500 to-slate-700",
	];

	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash);
	}

	return colors[Math.abs(hash) % colors.length];
}

function getLastActiveDate() {
	const days = Math.floor(Math.random() * 30);
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date.toISOString().split("T")[0];
}

let _mockMembers: TeamMember[] = Array.from({ length: 15 }).map((_, i) => {
	const name =
		NAMES[i % NAMES.length] +
		(i >= NAMES.length ? ` ${i - NAMES.length + 1}` : "");
	const role = ROLES[i % 3] as Role;
	const access: AccessLevel = ACCESS[(i + 1) % 3] as AccessLevel;
	return {
		id: `${i}`,
		name,
		avatarUrl: "",
		role,
		access,
		activity: randomActivity(),
		lastActive: getLastActiveDate(),
	};
});

function mockFetchMembers(): Promise<TeamMember[]> {
	return new Promise((res) => setTimeout(() => res([..._mockMembers]), 400));
}

function mockDeleteMember(id: string): Promise<void> {
	return new Promise((res) =>
		setTimeout(() => {
			_mockMembers = _mockMembers.filter((m) => m.id !== id);
			res();
		}, 300)
	);
}

function mockAddMember(member: TeamMember): Promise<void> {
	return new Promise((res) =>
		setTimeout(() => {
			_mockMembers.push(member);
			res();
		}, 400)
	);
}

function mockUpdateMember(
	id: string,
	updates: Partial<TeamMember>
): Promise<void> {
	return new Promise((res) =>
		setTimeout(() => {
			const index = _mockMembers.findIndex((m) => m.id === id);
			if (index !== -1) {
				_mockMembers[index] = { ..._mockMembers[index], ...updates };
			}
			res();
		}, 300)
	);
}

function getRoleColor(role: Role) {
	switch (role) {
		case "Admin":
			return "bg-gradient-to-r from-blue-600 to-blue-800";
		case "Manager":
			return "bg-gradient-to-r from-indigo-600 to-indigo-800";
		case "Member":
			return "bg-gradient-to-r from-slate-500 to-slate-700";
	}
}

function getAccessColor(access: AccessLevel) {
	switch (access) {
		case "Full":
			return "bg-gradient-to-r from-blue-600 to-blue-700 text-white";
		case "Limited":
			return "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white";
		case "Read-only":
			return "bg-slate-200 text-slate-600";
	}
}

function getAccessIcon(access: AccessLevel) {
	const iconProps = {
		width: "12",
		height: "12",
		viewBox: "0 0 24 24",
		fill: "currentColor",
	};

	switch (access) {
		case "Full":
			return (
				<svg {...iconProps}>
					<circle cx="12" cy="12" r="10" />
				</svg>
			);
		case "Limited":
			return (
				<svg {...iconProps}>
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6h6V6z" />
				</svg>
			);
		case "Read-only":
			return (
				<svg {...iconProps}>
					<circle
						cx="12"
						cy="12"
						r="10"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					/>
				</svg>
			);
	}
}

function getRoleIcon(role: Role) {
	const iconProps = {
		width: "10",
		height: "10",
		viewBox: "0 0 24 24",
		fill: "currentColor",
	};

	switch (role) {
		case "Admin":
			return (
				<svg {...iconProps}>
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
				</svg>
			);
		case "Manager":
			return (
				<svg {...iconProps}>
					<path
						d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L10.91 8.26L12 2Z"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					/>
				</svg>
			);
		case "Member":
			return (
				<svg {...iconProps}>
					<path d="M12 2L22 20.5L12 17L2 20.5L12 2Z" />
				</svg>
			);
	}
}

function getActivityColor(activityLevel: number, maxActivity: number) {
	if (maxActivity === 0)
		return "bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all duration-200";

	const intensity = activityLevel / maxActivity;
	if (intensity >= 0.8)
		return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-lg border border-blue-700/50 hover:shadow-xl hover:scale-105 transition-all duration-200";
	if (intensity >= 0.6)
		return "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-md border border-blue-600/50 hover:shadow-lg hover:scale-105 transition-all duration-200";
	if (intensity >= 0.4)
		return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-sm border border-blue-500/50 hover:shadow-md hover:scale-105 transition-all duration-200";
	if (intensity >= 0.2)
		return "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 border border-blue-400/50 hover:shadow-sm hover:scale-105 transition-all duration-200";
	return "bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 transition-all duration-200";
}

function formatLastActive(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) return "Today";
	if (diffDays === 2) return "Yesterday";
	if (diffDays <= 7) return `${diffDays} days ago`;
	if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
	return `${Math.ceil(diffDays / 30)} months ago`;
}

const CustomAvatar: React.FC<{
	name: string;
	size: string;
	role: Role;
}> = ({ name, size, role }) => {
	const initials = getInitials(name);
	const colorClass = getAvatarColor(name);

	return (
		<div
			className={`${colorClass} ${size} rounded-full flex items-center justify-center 
      text-white font-bold shadow-lg border-2 border-white relative`}
		>
			<span
				className={`${
					size.includes("14") || size.includes("16")
						? "text-xs"
						: size.includes("18")
						? "text-sm"
						: "text-lg"
				} font-extrabold tracking-tight`}
			>
				{initials}
			</span>

			{}
			<div
				className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-30 
        animate-shimmer overflow-hidden"
			></div>
		</div>
	);
};

const CustomDropdown: React.FC<{
	value: string;
	options: string[];
	onChange: (value: string) => void;
	placeholder: string;
	isMobile: boolean;
}> = ({ value, options, onChange, placeholder, isMobile }) => {
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

	const handleSelect = (option: string) => {
		onChange(option);
		setIsOpen(false);
	};

	return (
		<div
			className={`relative ${isMobile ? "flex-1" : "min-w-fit w-auto"}`}
			ref={dropdownRef}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`${
					isMobile ? "w-full" : "w-auto min-w-[140px]"
				} bg-blue-50 border border-blue-200/70 rounded-xl text-blue-800 font-semibold 
          py-2 px-3 cursor-pointer text-sm transition-all duration-200 flex items-center justify-between
          hover:bg-blue-100/70 hover:border-blue-300/70 ${
						isOpen
							? "bg-blue-100/80 ring-2 ring-blue-300/50 border-blue-300/80"
							: ""
					}`}
			>
				<span className={`${isMobile ? "truncate" : "whitespace-nowrap"}`}>
					{value === "All" ? placeholder : value}
				</span>
				<svg
					className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ml-2 
            ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					className={`absolute top-full left-0 ${
						isMobile ? "right-0" : "w-max min-w-full"
					} mt-2 bg-white rounded-xl shadow-xl 
          border border-blue-200/70 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200
          ${isMobile ? "max-h-60" : "max-h-48"} overflow-y-auto`}
				>
					<div className="py-1">
						{options.map((option) => {
							const isSelected = value === option;
							const displayText = option === "All" ? placeholder : option;

							return (
								<button
									key={option}
									onClick={() => handleSelect(option)}
									className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-150
                    hover:bg-blue-50 flex items-center justify-between group
                    ${
											isSelected
												? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
												: "text-blue-800 hover:text-blue-900"
										}`}
								>
									<span className="whitespace-nowrap">{displayText}</span>
									{isSelected && (
										<svg
											className="w-4 h-4 flex-shrink-0 ml-2"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
										</svg>
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

const SubscriptionManagerApp: React.FC = () => {
	const [members, setMembers] = useState<TeamMember[]>([]);
	const [filtered, setFiltered] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
	const [accessFilter, setAccessFilter] = useState<AccessLevel | "All">("All");
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [showAdd, setShowAdd] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState<{
		show: boolean;
		member: TeamMember | null;
	}>({ show: false, member: null });
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		let mounted = true;
		setLoading(true);

		mockFetchMembers().then((data) => {
			if (mounted) {
				setMembers(data);
				setLoading(false);
			}
		});

		const interval = setInterval(() => {
			if (mounted) {
				mockFetchMembers().then((data) => {
					setMembers(data);
				});
			}
		}, 5000);

		return () => {
			mounted = false;
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		let data = [...members];

		if (query.trim()) {
			data = data.filter(
				(m) =>
					m.name.toLowerCase().includes(query.toLowerCase()) ||
					m.role.toLowerCase().includes(query.toLowerCase())
			);
		}

		if (roleFilter !== "All") {
			data = data.filter((m) => m.role === roleFilter);
		}

		if (accessFilter !== "All") {
			data = data.filter((m) => m.access === accessFilter);
		}

		setFiltered(data);
	}, [query, roleFilter, accessFilter, members]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	function handleDelete(id: string) {
		setDeletingId(id);
		setMembers((prev) => prev.filter((m) => m.id !== id));
		setShowDeleteModal({ show: false, member: null });

		mockDeleteMember(id)
			.then(() => {
				setDeletingId(null);
				if (selectedMember?.id === id) {
					setSelectedMember(null);
				}
			})
			.catch(() => {
				mockFetchMembers().then(setMembers);
				setDeletingId(null);
			});
	}

	function handleAddMember(name: string, role: Role, access: AccessLevel) {
		const newMember: TeamMember = {
			id: Date.now() + "",
			name,
			avatarUrl: "",
			role,
			access,
			activity: [],
			lastActive: new Date().toISOString().split("T")[0],
		};

		setShowAdd(false);
		setMembers((prev) => [...prev, newMember]);

		mockAddMember(newMember).catch(() => {
			mockFetchMembers().then(setMembers);
		});
	}

	function handleUpdateMember(id: string, updates: Partial<TeamMember>) {
		setMembers((prev) =>
			prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
		);

		mockUpdateMember(id, updates).catch(() => {
			mockFetchMembers().then(setMembers);
		});
	}

	return (
		<div className="bg-gradient-to-b from-white to-slate-50 min-h-screen text-blue-800 overflow-x-hidden font-['Inter',sans-serif]">
			<header
				className={`bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white text-center relative shadow-2xl
        ${isMobile ? "py-6 pb-10" : "py-10 pb-20"}`}
			>
				<div
					className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwYzEwOCAxNDIgMjg2IDIwMCA1MzQgMjAwIDI1MyAwIDQzMS01OCA1MzQtMjAwaDM3MnY0MDBIMFYweiIgZmlsbD0idXJsKCNhKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')]
          bg-bottom bg-no-repeat bg-cover opacity-10"
				></div>
				<div className="px-4 max-w-7xl mx-auto relative z-10">
					<div className="flex items-center justify-center mb-3">
						<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mr-3">
							<svg
								className="w-6 h-6 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.62c0-1.17.68-2.25 1.76-2.73 1.17-.51 2.61-.9 4.24-.9zM12 1.5c-1.86 0-3.38 1.51-3.38 3.38s1.52 3.38 3.38 3.38 3.38-1.51 3.38-3.38S13.86 1.5 12 1.5z" />
							</svg>
						</div>
						<h1
							className={`font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100
              ${isMobile ? "text-2xl" : "text-4xl"}`}
						>
							Team Management
						</h1>
					</div>
					<span
						className={`opacity-90 font-medium tracking-wider max-w-md mx-auto block
            ${isMobile ? "text-sm" : "text-lg"}`}
					>
						Manage and track team member subscriptions with real-time analytics
					</span>
				</div>
			</header>

			<div
				className={`fixed z-30 mx-auto max-w-7xl transition-all duration-300
        ${
					isMobile
						? isScrolled
							? "top-4 left-3 right-3"
							: "top-[150px] left-3 right-3"
						: isScrolled
						? "top-4 left-4 right-4"
						: "top-[200px] left-4 right-4"
				}`}
			>
				<SearchBar
					query={query}
					onQueryChange={setQuery}
					roleFilter={roleFilter}
					accessFilter={accessFilter}
					onRoleFilter={setRoleFilter}
					onAccessFilter={setAccessFilter}
					isMobile={isMobile}
				/>
			</div>

			<main
				className={`mx-auto px-4 max-w-7xl pb-12 transition-all duration-300
        ${
					isMobile
						? isScrolled
							? "pt-20"
							: "pt-36"
						: isScrolled
						? "pt-24"
						: "pt-32"
				}`}
			>
				<div
					className={`flex items-center my-6 justify-between
          ${isMobile ? "flex-wrap gap-4" : ""}`}
				>
					<div
						className={`flex ${
							isMobile ? "flex-col gap-2 items-start" : "gap-6 items-center"
						}`}
					>
						<h2 className="font-bold text-blue-800 m-0 text-lg lg:text-xl">
							Team Members ({filtered.length})
						</h2>
					</div>

					{!isMobile && (
						<button
							onClick={() => setShowAdd(true)}
							className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white border-none rounded-2xl py-3 px-6 font-semibold cursor-pointer shadow-lg 
                transition-all duration-200 flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-xl"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Add Member
						</button>
					)}
				</div>

				<div
					className={`grid gap-6 mb-12
          ${
						isMobile
							? "grid-cols-1 gap-4"
							: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					}`}
				>
					{loading ? (
						Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className={`bg-white rounded-2xl shadow-lg border border-slate-100 opacity-70 animate-pulse
                    ${isMobile ? "h-[100px]" : "h-[120px]"}`}
							/>
						))
					) : filtered.length === 0 ? (
						<div
							className="col-span-full py-16 text-center text-slate-500 bg-white rounded-2xl 
                border border-slate-100 shadow-xl"
						>
							<div className="text-4xl mb-4 font-light">
								<svg
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
									className="mx-auto block"
								>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
									<line x1="18" y1="8" x2="23" y2="13"></line>
									<line x1="23" y1="8" x2="18" y2="13"></line>
								</svg>
							</div>
							<div className="text-xl font-semibold mb-2">No members found</div>
							<div className="opacity-80 max-w-xs mx-auto">
								Try adjusting your search filters or add a new team member
							</div>
						</div>
					) : (
						filtered.map((member) => (
							<SwipeableMemberCard
								key={member.id}
								member={member}
								onView={() => setSelectedMember(member)}
								onDelete={() => setShowDeleteModal({ show: true, member })}
								isMobile={isMobile}
							/>
						))
					)}
				</div>

				<div
					className={`my-20 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 
          backdrop-blur-sm rounded-3xl border border-blue-200/50 shadow-xl
          ${isMobile ? "my-10 p-6 rounded-2xl mx-0" : "p-10"}`}
				>
					<div
						className={`flex justify-between items-center mb-8 flex-wrap gap-4 
            ${isMobile ? "px-2" : ""}`}
					>
						<div className="flex items-center gap-4">
							<div
								className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 
                rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:rotate-3"
							>
								<svg
									className="w-6 h-6 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
								</svg>
							</div>
							<div>
								<h3
									className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-700 
                  m-0 tracking-tight text-xl lg:text-2xl mb-1"
								>
									Activity Heatmap
								</h3>
								<p className="text-blue-600/80 font-medium text-sm lg:text-base m-0">
									Last 60 Days Performance
								</p>
							</div>
						</div>
						<div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-200/50 shadow-md">
							<div className="text-slate-500 font-semibold text-sm lg:text-base flex items-center gap-2">
								<svg
									className="w-4 h-4 text-blue-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
								</svg>
								Total members: {members.length}
							</div>
						</div>
					</div>
					<ActivityHeatmap members={members} isMobile={isMobile} />
				</div>
			</main>

			{selectedMember && (
				<MemberDetailsModal
					member={selectedMember}
					onClose={() => setSelectedMember(null)}
					onUpdate={(updates) => {
						handleUpdateMember(selectedMember.id, updates);
						setSelectedMember({ ...selectedMember, ...updates });
					}}
					isMobile={isMobile}
				/>
			)}

			{showAdd && (
				<AddMemberModal
					onAdd={handleAddMember}
					onClose={() => setShowAdd(false)}
					isMobile={isMobile}
				/>
			)}

			{showDeleteModal.show && showDeleteModal.member && (
				<DeleteConfirmModal
					member={showDeleteModal.member}
					onConfirm={() => handleDelete(showDeleteModal.member!.id)}
					onCancel={() => setShowDeleteModal({ show: false, member: null })}
					isMobile={isMobile}
				/>
			)}

			{isMobile && (
				<button
					onClick={() => setShowAdd(true)}
					className="fixed right-5 bottom-5 z-30 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
            text-white border-none rounded-full w-14 h-14 shadow-xl flex items-center justify-center cursor-pointer 
            transition-all duration-300 hover:scale-105"
					aria-label="Add member"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<line x1="12" y1="5" x2="12" y2="19"></line>
						<line x1="5" y1="12" x2="19" y2="12"></line>
					</svg>
				</button>
			)}
		</div>
	);
};

const SearchBar: React.FC<{
	query: string;
	onQueryChange: (q: string) => void;
	roleFilter: Role | "All";
	accessFilter: AccessLevel | "All";
	onRoleFilter: (r: Role | "All") => void;
	onAccessFilter: (a: AccessLevel | "All") => void;
	isMobile: boolean;
}> = ({
	query,
	onQueryChange,
	roleFilter,
	accessFilter,
	onRoleFilter,
	onAccessFilter,
	isMobile,
}) => (
	<div
		className={`flex bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100
    ${isMobile ? "flex-col gap-2 p-3 rounded-xl" : "flex-row gap-3 p-4"}`}
	>
		<div className="flex items-center flex-1 min-w-0 bg-slate-50/80 rounded-xl p-2 border border-slate-200/50">
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#64748B"
				strokeWidth="2"
				className="mr-3 flex-shrink-0"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
			<input
				value={query}
				onChange={(e) => onQueryChange(e.target.value)}
				placeholder="Search team members..."
				className="border-none outline-none py-1 flex-1 bg-transparent text-blue-800 
          font-medium min-w-0"
			/>
		</div>

		<div className={`flex gap-3 flex-shrink-0 ${isMobile ? "w-full" : ""}`}>
			<CustomDropdown
				value={roleFilter}
				options={["All", ...ROLES]}
				onChange={(value) => onRoleFilter(value as Role | "All")}
				placeholder="All Roles"
				isMobile={isMobile}
			/>

			<CustomDropdown
				value={accessFilter}
				options={["All", ...ACCESS]}
				onChange={(value) => onAccessFilter(value as AccessLevel | "All")}
				placeholder="All Access"
				isMobile={isMobile}
			/>
		</div>
	</div>
);

const SwipeableMemberCard: React.FC<{
	member: TeamMember;
	onView: () => void;
	onDelete: () => void;
	isMobile: boolean;
}> = ({ member, onView, onDelete, isMobile }) => {
	const [swipeOffset, setSwipeOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const startX = useRef(0);
	const lastTouchTime = useRef(0);

	const roleBg = getRoleColor(member.role);
	const activityCount = member.activity.length;

	const handleTouchStart = (e: React.TouchEvent) => {
		if (!isMobile) return;
		startX.current = e.touches[0].clientX;
		setIsDragging(true);
		lastTouchTime.current = Date.now();
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || !isMobile) return;

		const currentX = e.touches[0].clientX;
		const diff = currentX - startX.current;

		if (Math.abs(diff) < 120) {
			setSwipeOffset(diff);
		}
	};

	const handleTouchEnd = () => {
		if (!isMobile) return;
		setIsDragging(false);

		const touchDuration = Date.now() - lastTouchTime.current;
		const threshold = touchDuration < 300 ? 30 : 60;

		if (swipeOffset > threshold) {
			onDelete();
		} else if (swipeOffset < -threshold) {
			onView();
		}

		setTimeout(() => setSwipeOffset(0), 200);
	};

	return (
		<div
			className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden cursor-pointer 
      transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] group"
		>
			{isMobile && (
				<>
					<div
						className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center 
              z-10 transition-opacity duration-200 ${
								isDragging ? "" : "opacity-0"
							}`}
						style={{ opacity: Math.max(0, Math.min(1, swipeOffset / 60)) }}
					>
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#FFFFFF"
							strokeWidth="2"
						>
							<polyline points="3,6 5,6 21,6"></polyline>
							<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
							<line x1="10" y1="11" x2="10" y2="17"></line>
							<line x1="14" y1="11" x2="14" y2="17"></line>
						</svg>
					</div>

					<div
						className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-700 to-blue-800 flex items-center justify-center 
              z-10 transition-opacity duration-200 ${
								isDragging ? "" : "opacity-0"
							}`}
						style={{ opacity: Math.max(0, Math.min(1, -swipeOffset / 60)) }}
					>
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#FFFFFF"
							strokeWidth="2"
						>
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
							<circle cx="12" cy="12" r="3"></circle>
						</svg>
					</div>
				</>
			)}

			<div
				ref={cardRef}
				className={`bg-white relative z-20 rounded-2xl transition-transform duration-300 ease-out
          ${isMobile ? "rounded-xl" : ""}`}
				style={{ transform: `translateX(${swipeOffset}px)` }}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onClick={() => {
					if (Math.abs(swipeOffset) < 10) {
						onView();
					}
				}}
			>
				{}
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80"></div>

				<div
					className={`flex items-center gap-4 p-5 relative z-10 
          ${isMobile ? "p-4 gap-3" : ""}`}
				>
					<div className={`relative flex-shrink-0 ${isMobile ? "p-1" : "p-2"}`}>
						<div
							className={`relative rounded-full shadow-lg border-2 
              ${roleBg} ${
								isMobile ? "w-14 h-14" : "w-16 h-16 lg:w-18 lg:h-18"
							}`}
						>
							<CustomAvatar
								name={member.name}
								role={member.role}
								size={isMobile ? "w-14 h-14" : "w-16 h-16 lg:w-18 lg:h-18"}
							/>

							<span
								className="absolute -bottom-1 -right-1 bg-white rounded-full border-2 flex 
                items-center justify-center shadow-md text-blue-800 font-bold z-10"
								title={`Access: ${member.access}`}
								style={{
									borderColor: roleBg.includes("blue") ? "#1E40AF" : "#64748B",
									width: isMobile ? "22px" : "28px",
									height: isMobile ? "22px" : "28px",
								}}
							>
								{getAccessIcon(member.access)}
							</span>
						</div>
					</div>

					<div className="flex-1 min-w-0 flex flex-col gap-2">
						<span
							className={`font-bold text-blue-800 truncate ${
								isMobile ? "text-sm" : "text-base"
							}`}
						>
							{member.name}
						</span>

						<div className="flex gap-2 items-center flex-wrap">
							<span
								className={`inline-flex items-center gap-1 text-white font-semibold text-xs 
                  uppercase tracking-wider rounded-full px-2.5 py-1 ${roleBg} shadow-sm`}
							>
								<span className="text-[10px]">{getRoleIcon(member.role)}</span>
								{member.role}
							</span>

							<span
								className={`inline-flex items-center gap-0.5 font-medium text-xs rounded-full px-2.5 py-1 shadow-sm ${getAccessColor(
									member.access
								)}`}
							>
								{member.access}
							</span>

							<span
								className={`inline-flex items-center gap-0.5 font-medium text-xs rounded-full px-2.5 py-1 shadow-sm
                ${
									activityCount > 10
										? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
										: "bg-slate-100 text-slate-500"
								}`}
							>
								{activityCount} active days
							</span>
						</div>

						<div className="text-slate-500 font-medium text-xs flex items-center gap-1.5">
							<svg
								className="w-3 h-3 text-blue-500"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8.41l2.54 2.53a1 1 0 0 1-1.42 1.42L11.3 12.7a1 1 0 0 1-.3-.7V8a1 1 0 0 1 2 0v3.59z" />
							</svg>
							Last active: {formatLastActive(member.lastActive)}
						</div>
					</div>

					{!isMobile && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							className="bg-transparent border-none cursor-pointer p-2 rounded-full 
                flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#ef4444"
								strokeWidth="2"
							>
								<polyline points="3,6 5,6 21,6"></polyline>
								<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

const DeleteConfirmModal: React.FC<{
	member: TeamMember;
	onConfirm: () => void;
	onCancel: () => void;
	isMobile: boolean;
}> = ({ member, onConfirm, onCancel, isMobile }) => {
	return (
		<div className="fixed inset-0 z-50 bg-blue-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
			<div
				className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-center mb-6">
					<div
						className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 
            border-4 border-white shadow-xl"
					>
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#ef4444"
							strokeWidth="2"
						>
							<path d="M3 6h18l-2 13H5L3 6z"></path>
							<path d="m19 6-2-4H7L5 6"></path>
							<path d="M10 11v6"></path>
							<path d="M14 11v6"></path>
						</svg>
					</div>

					<h3 className="font-bold text-blue-800 text-xl mb-2">
						Delete Member
					</h3>

					<p className="text-slate-500 mb-2 leading-relaxed">
						Are you sure you want to delete{" "}
						<strong className="text-blue-800">{member.name}</strong>? This
						action cannot be undone.
					</p>
				</div>

				<div className={`flex gap-3 ${isMobile ? "flex-col" : ""}`}>
					<button
						onClick={onCancel}
						className="flex-1 bg-slate-100 text-slate-600 border-none rounded-xl py-3 px-5 
              font-semibold cursor-pointer transition-all hover:bg-slate-200 min-h-11"
					>
						Cancel
					</button>

					<button
						onClick={onConfirm}
						className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
              text-white border-none rounded-xl py-3 px-5 font-semibold cursor-pointer transition-colors min-h-11"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

const MemberDetailsModal: React.FC<{
	member: TeamMember;
	onClose: () => void;
	onUpdate: (updates: Partial<TeamMember>) => void;
	isMobile: boolean;
}> = ({ member, onClose, onUpdate, isMobile }) => {
	const [editing, setEditing] = useState(false);
	const [editRole, setEditRole] = useState(member.role);
	const [editAccess, setEditAccess] = useState(member.access);

	const handleSave = () => {
		onUpdate({ role: editRole, access: editAccess });
		setEditing(false);
	};

	return (
		<div className="fixed inset-0 z-40 bg-blue-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
			<div
				className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto p-8 relative shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute right-6 top-5 border-none bg-transparent text-slate-500 
            cursor-pointer font-bold w-8 h-8 rounded-full flex items-center justify-center 
            hover:bg-slate-100 transition-colors min-h-11 min-w-11"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<div
					className={`flex gap-5 mb-6 ${
						isMobile
							? "flex-col items-center text-center"
							: "items-center text-left"
					}`}
				>
					<div className="relative p-2">
						<div
							className="rounded-full border-4 bg-white shadow-xl"
							style={{
								borderColor: getRoleColor(member.role).includes("blue")
									? "#1E40AF"
									: "#64748B",
							}}
						>
							<CustomAvatar
								name={member.name}
								role={member.role}
								size={isMobile ? "w-20 h-20" : "w-24 h-24"}
							/>
						</div>

						{}
						<div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
              opacity-0 group-hover:opacity-100 animate-shimmer"
						></div>
					</div>
					<div className="flex-1">
						<div className="font-extrabold text-blue-800 mb-1 text-xl">
							{member.name}
						</div>
						<div className="font-semibold text-slate-500 mb-2 flex items-center gap-2">
							<span className="flex items-center gap-1">
								{getRoleIcon(member.role)} {member.role}
							</span>
							<span className="text-slate-500 opacity-60">•</span>
							<span className="flex items-center gap-1">
								{getAccessIcon(member.access)} {member.access}
							</span>
						</div>
						<div className="text-slate-500 font-medium text-sm flex items-center">
							<svg
								className="w-3.5 h-3.5 text-blue-500 mr-1.5"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8.41l2.54 2.53a1 1 0 0 1-1.42 1.42L11.3 12.7a1 1 0 0 1-.3-.7V8a1 1 0 0 1 2 0v3.59z" />
							</svg>
							Last active: {formatLastActive(member.lastActive)}
						</div>
					</div>
				</div>

				<div className="mb-5">
					<div className="flex justify-between items-center mb-3.5">
						<h4 className="font-bold text-blue-800 m-0">Settings</h4>
						<div className="flex gap-2">
							<button
								onClick={() => (editing ? handleSave() : setEditing(true))}
								className={`py-2 px-3.5 font-semibold cursor-pointer rounded-xl min-h-11 transition-colors shadow-md
                  ${
										editing
											? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
											: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
									} text-white`}
							>
								{editing ? "Save" : "Edit"}
							</button>
						</div>
					</div>

					<div className="flex gap-2.5 mb-3.5">
						<div className="flex-1">
							<label className="block font-semibold text-slate-700 text-sm mb-1">
								Role
							</label>
							{editing ? (
								<CustomDropdown
									value={editRole}
									options={ROLES}
									onChange={(value) => setEditRole(value as Role)}
									placeholder="Select Role"
									isMobile={false}
								/>
							) : (
								<div
									className={`py-2 px-2.5 ${getRoleColor(
										member.role
									)} text-white rounded-xl font-medium text-sm shadow-md`}
								>
									{member.role}
								</div>
							)}
						</div>

						<div className="flex-1">
							<label className="block font-semibold text-slate-700 text-sm mb-1">
								Access
							</label>
							{editing ? (
								<CustomDropdown
									value={editAccess}
									options={ACCESS}
									onChange={(value) => setEditAccess(value as AccessLevel)}
									placeholder="Select Access"
									isMobile={false}
								/>
							) : (
								<div
									className={`py-2 px-2.5 rounded-xl font-medium text-sm shadow-md ${getAccessColor(
										member.access
									)}`}
								>
									{member.access}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="mt-7">
					<div className="font-bold text-blue-800 mb-2.5 flex items-center">
						<svg
							className="w-4 h-4 text-blue-600 mr-1.5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53A6.95 6.95 0 0 1 12 19z" />
						</svg>
						Recent Activity ({member.activity.length} days)
					</div>
					{member.activity.length === 0 ? (
						<div className="text-slate-500 italic text-center py-6 text-sm bg-slate-50 rounded-xl">
							No activity recorded yet.
						</div>
					) : (
						<div className="max-h-48 overflow-auto rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner">
							{member.activity
								.slice(-15)
								.reverse()
								.map((d, i) => (
									<div
										key={d}
										className="text-slate-700 font-medium py-2.5 px-4 border-b border-slate-200/80 last:border-b-0 text-sm
                    flex items-center justify-between"
									>
										<span>
											{new Date(d).toLocaleDateString("en-US", {
												weekday: "short",
												month: "short",
												day: "numeric",
											})}
										</span>
										<span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
											Active
										</span>
									</div>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const AddMemberModal: React.FC<{
	onAdd: (name: string, role: Role, access: AccessLevel) => void;
	onClose: () => void;
	isMobile: boolean;
}> = ({ onAdd, onClose, isMobile }) => {
	const [name, setName] = useState("");
	const [role, setRole] = useState<Role>("Member");
	const [access, setAccess] = useState<AccessLevel>("Read-only");
	const [submitting, setSubmitting] = useState(false);
	const [nameError, setNameError] = useState("");

	const validateName = (input: string) => {
		const regex = /^[a-zA-Z\s]+$/;
		if (!regex.test(input)) {
			setNameError("Only English letters and spaces are allowed");
			return false;
		}
		setNameError("");
		return true;
	};

	const handleSubmit = () => {
		if (!name.trim() || submitting) return;

		if (!validateName(name)) return;

		setSubmitting(true);
		setTimeout(() => {
			onAdd(name, role, access);
			setSubmitting(false);
		}, 600);
	};

	return (
		<div className="fixed inset-0 z-40 bg-blue-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
			<div
				className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					disabled={submitting}
					className="absolute right-6 top-5 border-none bg-transparent text-slate-500 
            cursor-pointer font-bold w-8 h-8 rounded-full flex items-center justify-center 
            min-h-11 min-w-11 hover:bg-slate-100"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<div
					className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 
          border-4 border-white shadow-xl"
				>
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#1d4ed8"
						strokeWidth="2"
					>
						<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
						<circle cx="8.5" cy="7" r="4"></circle>
						<line x1="20" y1="8" x2="20" y2="14"></line>
						<line x1="23" y1="11" x2="17" y2="11"></line>
					</svg>
				</div>

				<h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-700 text-xl mb-6 text-center">
					Add New Member
				</h2>

				<div className="mb-4">
					<label className="block font-bold text-slate-700 text-sm mb-1.5">
						Full Name
					</label>
					<input
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							validateName(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSubmit();
						}}
						placeholder="e.g. Maria Garcia Lopez"
						className={`w-full py-3 px-4 rounded-xl border text-slate-700 font-medium shadow-sm
              ${
								nameError
									? "border-red-500 focus:border-red-500 focus:ring-red-200"
									: "border-blue-200 focus:border-blue-500 focus:ring-blue-200"
							} 
              focus:ring-2 outline-none transition-colors`}
						disabled={submitting}
						autoFocus
					/>
					{nameError && (
						<div className="text-red-500 text-xs mt-1 flex items-center">
							<svg
								className="w-3.5 h-3.5 mr-1"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
							</svg>
							{nameError}
						</div>
					)}
				</div>

				<div className="mb-4">
					<label className="block font-bold text-slate-700 text-sm mb-1.5">
						Team Role
					</label>
					<CustomDropdown
						value={role}
						options={ROLES}
						onChange={(value) => setRole(value as Role)}
						placeholder="Select Role"
						isMobile={false}
					/>
				</div>

				<div className="mb-6">
					<label className="block font-bold text-slate-700 text-sm mb-1.5">
						Access Level
					</label>
					<CustomDropdown
						value={access}
						options={ACCESS}
						onChange={(value) => setAccess(value as AccessLevel)}
						placeholder="Select Access"
						isMobile={false}
					/>
				</div>

				<button
					onClick={handleSubmit}
					disabled={submitting || !name.trim() || !!nameError}
					className={`w-full py-3.5 rounded-xl font-bold cursor-pointer min-h-11 transition-all shadow-lg
            ${
							submitting || !name.trim() || nameError
								? "bg-slate-400 cursor-not-allowed opacity-60"
								: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl"
						}`}
				>
					{submitting ? (
						<span className="flex items-center justify-center">
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Adding Member...
						</span>
					) : (
						"Add to Team"
					)}
				</button>
			</div>
		</div>
	);
};

const ActivityHeatmap: React.FC<{
	members: TeamMember[];
	isMobile: boolean;
}> = ({ members, isMobile }) => {
	const days = 60;
	const today = new Date();
	let calendar: ActivityEntry[] = [];

	const [isExtraSmall, setIsExtraSmall] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsExtraSmall(window.innerWidth < 360);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(today.getDate() - i);
		const dstr = d.toISOString().split("T")[0];
		const count = members.reduce(
			(sum, m) => sum + (m.activity.includes(dstr) ? 1 : 0),
			0
		);
		calendar.push({ date: dstr, count });
	}

	const maxCount = Math.max(...calendar.map((c) => c.count), 1);
	const totalActivity = calendar.reduce((sum, c) => sum + c.count, 0);
	const avgActivity = Math.round((totalActivity / days) * 10) / 10;

	const weeks: ActivityEntry[][] = [];
	for (let i = 0; i < calendar.length; i += 7) {
		const week = calendar.slice(i, Math.min(i + 7, calendar.length));
		while (week.length < 7) {
			week.push({ date: "", count: 0 });
		}
		weeks.push(week);
	}

	const dayLabels = isExtraSmall
		? ["M", "T", "W", "T", "F", "S", "S"]
		: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div>
			{}
			<div className="flex justify-between items-start mb-6 flex-wrap gap-4">
				<div
					className={`grid ${
						isMobile ? "grid-cols-3 gap-2 w-full" : "grid-cols-3 gap-6"
					}`}
				>
					{}
					<div
						className={`bg-gradient-to-br from-blue-500/5 via-blue-600/10 to-blue-700/15 
            backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl 
            transition-all duration-300 hover:-translate-y-1 ${
							isMobile ? "p-3" : "p-6"
						}`}
					>
						<div className="flex items-center justify-center mb-1">
							<div
								className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl 
                flex items-center justify-center shadow-lg"
							>
								<svg
									className="w-4 h-4 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							</div>
						</div>
						<div className="text-center">
							<div
								className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 tracking-tight
                ${isExtraSmall ? "text-xl" : "text-2xl"}`}
							>
								{totalActivity}
							</div>
							<div className="text-blue-600 font-semibold text-xs tracking-wide">
								Total
							</div>
						</div>
					</div>

					{}
					<div
						className={`bg-gradient-to-br from-indigo-500/5 via-indigo-600/10 to-indigo-700/15 
            backdrop-blur-sm rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-xl 
            transition-all duration-300 hover:-translate-y-1 ${
							isMobile ? "p-3" : "p-6"
						}`}
					>
						<div className="flex items-center justify-center mb-1">
							<div
								className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl 
                flex items-center justify-center shadow-lg"
							>
								<svg
									className="w-4 h-4 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.11 2 2 3.11 2 4.5v15C2 20.89 3.11 22 4.5 22h15c1.39 0 2.5-1.11 2.5-2.5v-15C22 3.11 20.89 2 19.5 2z" />
								</svg>
							</div>
						</div>
						<div className="text-center">
							<div
								className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800 tracking-tight
                ${isExtraSmall ? "text-xl" : "text-2xl"}`}
							>
								{avgActivity}
							</div>
							<div className="text-indigo-600 font-semibold text-xs tracking-wide">
								Avg/Day
							</div>
						</div>
					</div>

					{}
					<div
						className={`bg-gradient-to-br from-cyan-500/5 via-cyan-600/10 to-cyan-700/15 
            backdrop-blur-sm rounded-2xl border border-cyan-200/50 shadow-lg hover:shadow-xl 
            transition-all duration-300 hover:-translate-y-1 ${
							isMobile ? "p-3" : "p-6"
						}`}
					>
						<div className="flex items-center justify-center mb-1">
							<div
								className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl 
                flex items-center justify-center shadow-lg"
							>
								<svg
									className="w-4 h-4 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M7.5 4C5.57 4 4 5.57 4 7.5S5.57 11 7.5 11 11 9.43 11 7.5 9.43 4 7.5 4zm0 5C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zM12.5 11c-.83 0-1.5-.67-1.5-1.5 0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5zm3-7C13.57 4 12 5.57 12 7.5S13.57 11 15.5 11 19 9.43 19 7.5 17.43 4 15.5 4z" />
								</svg>
							</div>
						</div>
						<div className="text-center">
							<div
								className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-800 tracking-tight
                ${isExtraSmall ? "text-xl" : "text-2xl"}`}
							>
								{maxCount}
							</div>
							<div className="text-cyan-600 font-semibold text-xs tracking-wide">
								Peak
							</div>
						</div>
					</div>
				</div>
			</div>

			{}
			<div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-lg p-4">
				{}
				{isMobile && (
					<div className="mb-3 flex items-center justify-between">
						<h4 className="text-blue-800 font-bold text-sm flex items-center gap-1.5">
							<svg
								className="w-3.5 h-3.5 text-blue-600"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
							</svg>
							Activity Heatmap
						</h4>
						<div className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
							Last 60 days
						</div>
					</div>
				)}

				{}
				<div className="relative">
					{}
					<div className={`flex ${isMobile ? "overflow-x-auto pb-2" : ""}`}>
						{}
						<div className="flex-shrink-0 flex flex-col mr-2">
							{dayLabels.map((day, index) => (
								<div
									key={`day-label-${index}`}
									className={`
                    ${
											isExtraSmall
												? "text-[10px] h-6"
												: isMobile
												? "text-xs h-7"
												: "text-sm h-8"
										}
                    flex items-center justify-end text-slate-500 font-medium pr-2
                  `}
								>
									{day}
								</div>
							))}
						</div>

						{}
						<div className="grid grid-rows-7 auto-cols-min grid-flow-col gap-[2px]">
							{weeks.map((week, wIdx) =>
								week.map((cell, dIdx) => {
									const bg = getActivityColor(cell.count, maxCount);
									const isHighActivity = cell.count >= maxCount * 0.7;

									return (
										<div
											key={`cell-${wIdx}-${dIdx}`}
											title={
												cell.date
													? `${cell.count} member${
															cell.count === 1 ? "" : "s"
													  } active on ${new Date(
															cell.date
													  ).toLocaleDateString("en-US")}`
													: ""
											}
											className={`
                        ${
													isExtraSmall
														? "w-5 h-5"
														: isMobile
														? "w-6 h-6"
														: "w-8 h-8"
												}
                        rounded-lg flex items-center justify-center font-bold
                        ${
													isHighActivity
														? "text-white shadow-sm"
														: "text-blue-800"
												} 
                        ${cell.count > 0 ? "cursor-pointer" : ""} ${bg}
                        relative overflow-hidden
                      `}
										>
											{isHighActivity && cell.count > 0 ? (
												<span
													className={`relative z-10 font-extrabold tracking-tight ${
														isExtraSmall ? "text-[10px]" : "text-xs"
													}`}
												>
													{cell.count}
												</span>
											) : cell.count > 0 ? (
												<div className="w-1.5 h-1.5 bg-current rounded-full opacity-70" />
											) : null}
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>

				{}
				<div
					className={`${
						isMobile ? "mt-3 pt-3 border-t border-blue-100/50" : "mt-6"
					}`}
				>
					<div
						className={`flex flex-wrap ${
							isMobile ? "gap-1.5 justify-center" : "gap-4"
						}`}
					>
						{[
							{
								bg: "bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200",
								title: "None",
							},
							{
								bg: "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 border border-blue-400/50",
								title: "Low",
							},
							{
								bg: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 border border-blue-500/50",
								title: "Medium",
							},
							{
								bg: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border border-blue-600/50",
								title: "High",
							},
							{
								bg: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border border-blue-700/50",
								title: "Peak",
							},
						].map((item, index) => (
							<div
								key={`legend-${index}`}
								className={`flex items-center gap-1.5 ${
									isMobile
										? "bg-white/60 px-2 py-0.5 rounded-full shadow-sm"
										: ""
								}`}
							>
								<span
									className={`
                  ${
										isExtraSmall ? "w-3 h-3" : isMobile ? "w-4 h-4" : "w-5 h-5"
									} 
                  rounded-md shadow-sm inline-flex items-center justify-center ${
										item.bg
									}
                `}
								></span>
								<span
									className={`text-slate-700 font-medium ${
										isExtraSmall ? "text-[10px]" : "text-xs"
									}`}
								>
									{item.title}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
document.head.appendChild(styleTag);

export default SubscriptionManagerApp;
