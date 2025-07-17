"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Outfit } from "next/font/google";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
	format,
	startOfWeek,
	addDays,
	subDays,
	isSameDay,
	addWeeks,
	subWeeks,
	isWithinInterval,
} from "date-fns";

const outfit = Outfit({
	subsets: ["latin"],
	display: "swap",
	adjustFontFallback: false,
});

interface DayData {
	date: Date;
	name: string;
	positive: number;
	negative: number;
}

interface Habit {
	id: number;
	name: string;
	completions: { [date: string]: boolean };
	category?: string;
	priority?: "low" | "medium" | "high";
	createdAt: string;
}

interface Toast {
	id: number;
	message: string;
	type: "success" | "error" | "info";
}

const translations = {
	en: {
		title: "Habit Tracker",
		dashboard: "Dashboard",
		addHabit: "Add Habit",
		manageHabits: "Manage Habits",
		settings: "Settings",
		logout: "Logout",
		newHabit: "New habit",
		week: "Week",
		selectDate: "Select a date",
		habits: "Habits",
		avgStreak: "Streak",
		completion: "Completion",
		bestStreak: "Best Streak",
		performance: "Performance",
		completed: "Completed",
		missed: "Missed",
		exportData: "Export Data",
		edit: "Edit",
		delete: "Delete",
		deleteConfirm: "Delete Habit",
		deletePrompt: "Are you sure you want to delete",
		cancel: "Cancel",
		today: "Today",
		thisWeek: "This Week",
		lastWeek: "Last Week",
		filterByCategory: "Filter by category",
		allCategories: "All Categories",
		categories: {
			health: "Health",
			productivity: "Productivity",
			learning: "Learning",
			wellness: "Wellness",
			fitness: "Fitness",
		},
		priority: "Priority",
		priorities: {
			low: "Low",
			medium: "Medium",
			high: "High",
		},
		search: "Search habits...",
		save: "Save",
		category: "Category",
		dailyProgress: "Daily Progress",
		weeklyProgress: "Weekly Progress",
		monthlyProgress: "Monthly Progress",
		featureNotAvailable: "This feature is not available yet",
		themeUpdated: "Theme updated successfully",
		habitAdded: "Habit added successfully",
		habitDeleted: "Habit deleted successfully",
		habitUpdated: "Habit updated successfully",
		dataExported: "Data exported successfully",
		selectCategory: "Select category",
	},
	es: {
		title: "Seguimiento de Hábitos",
		dashboard: "Tablero",
		addHabit: "Añadir Hábito",
		manageHabits: "Gestionar Hábitos",
		settings: "Configuración",
		logout: "Cerrar Sesión",
		newHabit: "Nuevo hábito",
		week: "Semana",
		selectDate: "Selecciona una fecha",
		habits: "Hábitos",
		avgStreak: "Racha",
		completion: "Completitud",
		bestStreak: "Mejor Racha",
		performance: "Rendimiento",
		completed: "Completado",
		missed: "Perdido",
		exportData: "Exportar Datos",
		edit: "Editar",
		delete: "Eliminar",
		deleteConfirm: "Eliminar Hábito",
		deletePrompt: "¿Seguro que quieres eliminar",
		cancel: "Cancelar",
		today: "Hoy",
		thisWeek: "Esta Semana",
		lastWeek: "Semana Pasada",
		filterByCategory: "Filtrar por categoría",
		allCategories: "Todas las Categorías",
		categories: {
			health: "Salud",
			productivity: "Productividad",
			learning: "Aprendizaje",
			wellness: "Bienestar",
			fitness: "Fitness",
		},
		priority: "Prioridad",
		priorities: {
			low: "Baja",
			medium: "Media",
			high: "Alta",
		},
		search: "Buscar hábitos...",
		save: "Guardar",
		category: "Categoría",
		dailyProgress: "Progreso Diario",
		weeklyProgress: "Progreso Semanal",
		monthlyProgress: "Progreso Mensual",
		featureNotAvailable: "Esta función no está disponible todavía",
		themeUpdated: "Tema actualizado con éxito",
		habitAdded: "Hábito añadido con éxito",
		habitDeleted: "Hábito eliminado con éxito",
		habitUpdated: "Hábito actualizado con éxito",
		dataExported: "Datos exportados con éxito",
		selectCategory: "Seleccionar categoría",
	},
};

const Icons = {
	plus: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
				clipRule="evenodd"
			/>
		</svg>
	),
	dashboard: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
		</svg>
	),
	add: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
				clipRule="evenodd"
			/>
		</svg>
	),
	manage: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
		</svg>
	),
	settings: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
				clipRule="evenodd"
			/>
		</svg>
	),
	logout: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
				clipRule="evenodd"
			/>
		</svg>
	),
	menu: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	),
	close: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-6 w-6"
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
	),
	edit: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
		</svg>
	),
	delete: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
				clipRule="evenodd"
			/>
		</svg>
	),
	success: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clipRule="evenodd"
			/>
		</svg>
	),
	error: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
				clipRule="evenodd"
			/>
		</svg>
	),
	info: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z"
				clipRule="evenodd"
			/>
		</svg>
	),
	theme: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
		</svg>
	),
	calendar: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
				clipRule="evenodd"
			/>
		</svg>
	),
	language: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M4.027 7.75C4.027 5.57 6.02 3.75 8.5 3.75c1.727 0 3.269.85 4.215 2.15a.75.75 0 001.248-.832C12.772 3.063 10.756 2 8.5 2 5.142 2 2.5 4.534 2.5 7.75c0 1.578.599 3.023 1.64 4.146a.75.75 0 10.998-1.123C4.451 9.85 4.027 8.904 4.027 7.75zm8.946 5.684c-.753.753-1.773 1.175-2.838 1.175-1.064 0-2.085-.422-2.838-1.175a.75.75 0 00-1.06 1.06c1.053 1.053 2.47 1.641 3.955 1.641 1.486 0 2.902-.588 3.955-1.64a.75.75 0 10-1.06-1.061z"
				clipRule="evenodd"
			/>
			<path d="M10.5 14.5h-1v-7a.75.75 0 00-1.5 0v8.5h2.5a.75.75 0 000-1.5zm1-7a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-1.75v1.75h1.25a.75.75 0 010 1.5h-1.25v1.75h1.75a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75v-6.5z" />
		</svg>
	),
	filter: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
				clipRule="evenodd"
			/>
		</svg>
	),
};

const THEME = {
	golden: {
		primary: "#F59E0B",
		secondary: "#D97706",
		gradient: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
		background: "#0F172A",
		backgroundSecondary: "#1E293B",
		surface: "#1E293B",
		surfaceSecondary: "#334155",
		text: "#F8FAFC",
		textSecondary: "#CBD5E1",
		border: "#475569",
		success: "#34D399",
		error: "#F87171",
		info: "#60A5FA",
	},
	amber: {
		primary: "#F59E0B",
		secondary: "#D97706",
		gradient: "bg-gradient-to-r from-[#F59E0B] to-[#D97706]",
		background: "#FFFBEB",
		backgroundSecondary: "#FFFFFF",
		surface: "#FFFFFF",
		surfaceSecondary: "#FEF3C7",
		text: "#78350F",
		textSecondary: "#92400E",
		border: "#FCD34D",
		success: "#059669",
		error: "#DC2626",
		info: "#2563EB",
	},
	yellow: {
		primary: "#EAB308",
		secondary: "#CA8A04",
		gradient: "bg-gradient-to-r from-[#EAB308] to-[#CA8A04]",
		background: "#0F172A",
		backgroundSecondary: "#1E293B",
		surface: "#1E293B",
		surfaceSecondary: "#334155",
		text: "#F8FAFC",
		textSecondary: "#CBD5E1",
		border: "#475569",
		success: "#34D399",
		error: "#F87171",
		info: "#60A5FA",
	},
};

const generateWeekDates = (startDate: Date): DayData[] => {
	const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
	return Array.from({ length: 7 }, (_, i) => {
		const date = addDays(weekStart, i);
		return {
			date,
			name: format(date, "d-MMM"),
			positive: 0,
			negative: 0,
		};
	});
};

const initialBarData: DayData[] = generateWeekDates(new Date());

const customDatePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  .react-datepicker__header {
    background: none;
    border: none;
    padding-top: 1rem;
  }
  .react-datepicker__current-month {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-family: inherit;
  }
  .react-datepicker__day-name {
    color: #92400E;
    font-weight: 500;
    width: 2rem;
    margin: 0.2rem;
    font-family: inherit;
  }
  .react-datepicker__day {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 0.2rem;
    border-radius: 9999px;
    transition: all 200ms;
    font-family: inherit;
  }
  .react-datepicker__day:hover {
    background: #FEF3C7;
    border-radius: 9999px;
  }
  .react-datepicker__day--selected {
    background: linear-gradient(to right, #F59E0B, #D97706) !important;
    border-radius: 9999px;
    font-weight: 600;
  }
  .react-datepicker__day--keyboard-selected {
    background: #FEF3C7;
    border-radius: 9999px;
  }
  .theme-golden .react-datepicker {
    background: #1E293B;
    color: #F8FAFC;
  }
  .theme-golden .react-datepicker__header {
    background: #1E293B;
    border: none;
  }
  .theme-golden .react-datepicker__current-month {
    color: #F8FAFC;
  }
  .theme-golden .react-datepicker__day-name {
    color: #F59E0B;
  }
  .theme-golden .react-datepicker__day {
    color: #F8FAFC;
  }
  .theme-golden .react-datepicker__day:hover {
    background: #334155;
  }
  .theme-golden .react-datepicker__day--keyboard-selected {
    background: #334155;
  }
  .theme-golden .react-datepicker__day--selected {
    background: linear-gradient(to right, #F59E0B, #D97706) !important;
    color: white;
  }
  .theme-golden .react-datepicker__day--outside-month {
    color: #64748B;
  }
  .theme-yellow .react-datepicker {
    background: #1E293B;
    color: #F8FAFC;
  }
  .theme-yellow .react-datepicker__header {
    background: #1E293B;
    border: none;
  }
  .theme-yellow .react-datepicker__current-month {
    color: #F8FAFC;
  }
  .theme-yellow .react-datepicker__day-name {
    color: #EAB308;
  }
  .theme-yellow .react-datepicker__day {
    color: #F8FAFC;
  }
  .theme-yellow .react-datepicker__day:hover {
    background: #334155;
  }
  .theme-yellow .react-datepicker__day--keyboard-selected {
    background: #334155;
  }
  .theme-yellow .react-datepicker__day--selected {
    background: linear-gradient(to right, #EAB308, #CA8A04) !important;
    color: white;
  }
  .theme-yellow .react-datepicker__day--outside-month {
    color: #64748B;
  }
`;

const STORAGE_KEY = "habit-tracker-data";
const THEME_KEY = "habit-tracker-theme";
const LANG_KEY = "habit-tracker-lang";

const generateInitialHabits = (): Habit[] => {
	const today = format(new Date(), "yyyy-MM-dd");
	return [
		{
			id: 1,
			name: "Exercise",
			completions: {},
			category: "fitness",
			priority: "high",
			createdAt: today,
		},
		{
			id: 2,
			name: "Meditation",
			completions: {},
			category: "wellness",
			priority: "medium",
			createdAt: today,
		},
		{
			id: 3,
			name: "Read 30 minutes",
			completions: {},
			category: "learning",
			priority: "medium",
			createdAt: today,
		},
		{
			id: 4,
			name: "Wake up at 6 AM",
			completions: {},
			category: "productivity",
			priority: "high",
			createdAt: today,
		},
		{
			id: 5,
			name: "Drink water",
			completions: {},
			category: "health",
			priority: "high",
			createdAt: today,
		},
	];
};

const loadHabitsFromStorage = (): Habit[] => {
	if (typeof window === "undefined") return generateInitialHabits();
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return generateInitialHabits();
		const storedHabits: Habit[] = JSON.parse(stored);
		return storedHabits.map((habit) => ({
			...habit,
			completions: habit.completions || {},
			createdAt: habit.createdAt || format(new Date(), "yyyy-MM-dd"),
			category: habit.category || "productivity",
			priority: habit.priority || "medium",
		}));
	} catch (e) {
		console.error("Failed to load habits from storage:", e);
		return generateInitialHabits();
	}
};

const saveHabitsToStorage = (habits: Habit[]) => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
	} catch (e) {
		console.error("Failed to save habits to storage:", e);
	}
};

const loadThemeFromStorage = (): "golden" | "amber" | "yellow" => {
	if (typeof window === "undefined") return "golden";
	try {
		const stored = localStorage.getItem(THEME_KEY);
		if (!stored) return "golden";
		return stored as "golden" | "amber" | "yellow";
	} catch (e) {
		console.error("Failed to load theme from storage:", e);
		return "golden";
	}
};

const saveThemeToStorage = (theme: "golden" | "amber" | "yellow") => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch (e) {
		console.error("Failed to save theme to storage:", e);
	}
};

const loadLangFromStorage = (): "en" | "es" => {
	if (typeof window === "undefined") return "en";
	try {
		const stored = localStorage.getItem(LANG_KEY);
		if (!stored) return "en";
		return stored as "en" | "es";
	} catch (e) {
		console.error("Failed to load language from storage:", e);
		return "en";
	}
};

const saveLangToStorage = (lang: "en" | "es") => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(LANG_KEY, lang);
	} catch (e) {
		console.error("Failed to save language to storage:", e);
	}
};

const calculateCurrentStreak = (
	completions: { [date: string]: boolean },
	currentDate: Date
): number => {
	let streak = 0;
	let date = new Date(currentDate);
	date.setHours(0, 0, 0, 0);

	while (true) {
		const dateStr = format(date, "yyyy-MM-dd");
		if (completions[dateStr]) {
			streak++;
			date = subDays(date, 1);
		} else {
			break;
		}
	}
	return streak;
};

const calculateBestStreak = (completions: {
	[date: string]: boolean;
}): number => {
	const dates = Object.entries(completions)
		.filter(([_, completed]) => completed)
		.map(([date]) => new Date(date))
		.sort((a, b) => a.getTime() - b.getTime());

	if (dates.length === 0) return 0;

	let bestStreak = 1;
	let currentStreak = 1;

	for (let i = 1; i < dates.length; i++) {
		const prevDate = dates[i - 1];
		const currentDate = dates[i];
		if (
			(currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) ===
			1
		) {
			currentStreak++;
			bestStreak = Math.max(bestStreak, currentStreak);
		} else {
			currentStreak = 1;
		}
	}

	return bestStreak;
};

const CircularProgress: React.FC<{
	percentage: number;
	label: string;
	activeTheme: typeof THEME.golden;
	size?: "small" | "medium" | "large";
}> = ({ percentage, label, activeTheme, size = "medium" }) => {
	const radius = size === "small" ? 35 : size === "medium" ? 45 : 55;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;
	const svgSize = size === "small" ? 80 : size === "medium" ? 100 : 120;
	const fontSize = size === "small" ? 14 : size === "medium" ? 18 : 22;
	const strokeWidth = size === "small" ? 6 : size === "medium" ? 8 : 10;

	return (
		<div className="flex flex-col items-center">
			<svg
				width={svgSize}
				height={svgSize}
				viewBox={`0 0 ${svgSize} ${svgSize}`}
			>
				<circle
					cx={svgSize / 2}
					cy={svgSize / 2}
					r={radius}
					fill="none"
					stroke={activeTheme.surfaceSecondary}
					strokeWidth={strokeWidth}
				/>
				<circle
					cx={svgSize / 2}
					cy={svgSize / 2}
					r={radius}
					fill="none"
					stroke={`url(#gradient-${label.replace(/\s+/g, "-")})`}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
					className="transition-all duration-500"
				/>
				<defs>
					<linearGradient
						id={`gradient-${label.replace(/\s+/g, "-")}`}
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor={activeTheme.primary} />
						<stop offset="100%" stopColor={activeTheme.secondary} />
					</linearGradient>
				</defs>
				<text
					x={svgSize / 2}
					y={svgSize / 2 + fontSize / 3}
					textAnchor="middle"
					fill={activeTheme.text}
					fontSize={fontSize}
					fontWeight="600"
				>
					{percentage}%
				</text>
			</svg>
			<span
				className={`mt-2 text-sm font-medium`}
				style={{ color: activeTheme.primary }}
			>
				{label}
			</span>
		</div>
	);
};

const Toast: React.FC<{
	toast: Toast;
	onDismiss: (id: number) => void;
	activeTheme: typeof THEME.golden;
}> = ({ toast, onDismiss, activeTheme }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onDismiss(toast.id);
		}, 3000);
		return () => clearTimeout(timer);
	}, [toast.id, onDismiss]);

	return (
		<div
			className="fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg max-w-md z-50 transform transition-all duration-300 ease-in-out"
			style={{
				backgroundColor: activeTheme.surface,
				borderLeft: `4px solid ${
					toast.type === "success"
						? activeTheme.success
						: toast.type === "error"
						? activeTheme.error
						: activeTheme.info
				}`,
			}}
		>
			<div
				className="mr-3"
				style={{
					color:
						toast.type === "success"
							? activeTheme.success
							: toast.type === "error"
							? activeTheme.error
							: activeTheme.info,
				}}
			>
				{toast.type === "success"
					? Icons.success
					: toast.type === "error"
					? Icons.error
					: Icons.info}
			</div>
			<div className="flex-1" style={{ color: activeTheme.text }}>
				{toast.message}
			</div>
			<button
				onClick={() => onDismiss(toast.id)}
				className="ml-3 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
				style={{ color: activeTheme.textSecondary }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</div>
	);
};

const HabitTracker: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const [chartsLoaded, setChartsLoaded] = useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [barData, setBarData] = useState<DayData[]>(() =>
		generateWeekDates(new Date())
	);
	const [currentSection, setCurrentSection] = useState<
		"dashboard" | "addHabit" | "manageHabits" | "settings"
	>("dashboard");

	const [activeTheme, setActiveTheme] = useState<"golden" | "amber" | "yellow">(
		"golden"
	);
	const [language, setLanguage] = useState<"en" | "es">("en");

	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
	const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
	const [showLanguageOptions, setShowLanguageOptions] =
		useState<boolean>(false);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [nextToastId, setNextToastId] = useState(1);

	const [habits, setHabits] = useState<Habit[]>(() => generateInitialHabits());
	const [newHabit, setNewHabit] = useState<string>("");
	const [newHabitCategory, setNewHabitCategory] =
		useState<string>("productivity");
	const [newHabitPriority, setNewHabitPriority] = useState<
		"low" | "medium" | "high"
	>("medium");
	const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
	const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("all");
	const [filterPriority, setFilterPriority] = useState<
		"all" | "low" | "medium" | "high"
	>("all");

	const sidebarRef = useRef<HTMLDivElement>(null);
	const languageDropdownRef = useRef<HTMLDivElement>(null);
	const exportDropdownRef = useRef<HTMLDivElement>(null);

	const themeStyles =
		activeTheme === "golden"
			? THEME.golden
			: activeTheme === "amber"
			? THEME.amber
			: THEME.yellow;

	useEffect(() => {
		setIsClient(true);
		const storedHabits = loadHabitsFromStorage();
		const storedTheme = loadThemeFromStorage();
		const storedLang = loadLangFromStorage();
		setHabits(storedHabits);
		setActiveTheme(storedTheme);
		setLanguage(storedLang);
	}, []);

	useEffect(() => {
		if (isClient) {
			saveHabitsToStorage(habits);
		}
	}, [habits, isClient]);

	useEffect(() => {
		if (isClient) {
			saveThemeToStorage(activeTheme);
		}
	}, [activeTheme, isClient]);

	useEffect(() => {
		if (isClient) {
			saveLangToStorage(language);
		}
	}, [language, isClient]);

	useEffect(() => {
		const styleElement = document.createElement("style");
		styleElement.textContent = customDatePickerStyles;
		document.head.appendChild(styleElement);

		return () => {
			document.head.removeChild(styleElement);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node) &&
				sidebarOpen
			) {
				setSidebarOpen(false);
			}

			if (
				languageDropdownRef.current &&
				!languageDropdownRef.current.contains(event.target as Node) &&
				showLanguageOptions
			) {
				setShowLanguageOptions(false);
			}

			if (
				exportDropdownRef.current &&
				!exportDropdownRef.current.contains(event.target as Node) &&
				showExportOptions
			) {
				setShowExportOptions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [sidebarOpen, showLanguageOptions, showExportOptions]);

	useEffect(() => {
		const timer = setTimeout(() => setChartsLoaded(true), 200);
		return () => clearTimeout(timer);
	}, []);

	const completionPercentage = useMemo(() => {
		if (!isClient || habits.length === 0) return 0;
		const today = format(new Date(), "yyyy-MM-dd");
		const completed = habits.filter((habit) => habit.completions[today]).length;
		return Math.round((completed / habits.length) * 100);
	}, [habits, isClient]);

	const weekCompletionPercentage = useMemo(() => {
		if (!isClient || habits.length === 0) return 0;
		const weekDates = barData.map((day) => format(day.date, "yyyy-MM-dd"));
		const total = habits.length * weekDates.length;
		const completed = habits.reduce((sum, habit) => {
			return sum + weekDates.filter((date) => habit.completions[date]).length;
		}, 0);
		return total > 0 ? Math.round((completed / total) * 100) : 0;
	}, [habits, barData, isClient]);

	const lastWeekCompletionPercentage = useMemo(() => {
		if (!isClient || habits.length === 0) return 0;
		const lastWeekDates = Array.from({ length: 7 }, (_, i) =>
			format(subDays(barData[0].date, i + 1), "yyyy-MM-dd")
		);
		const total = habits.length * lastWeekDates.length;
		const completed = habits.reduce((sum, habit) => {
			return (
				sum + lastWeekDates.filter((date) => habit.completions[date]).length
			);
		}, 0);
		return total > 0 ? Math.round((completed / total) * 100) : 0;
	}, [habits, barData, isClient]);

	const averageStreak = useMemo(() => {
		if (!isClient || habits.length === 0) return 0;
		const totalStreak = habits.reduce(
			(sum, habit) =>
				sum + calculateCurrentStreak(habit.completions, new Date()),
			0
		);
		return Math.round(totalStreak / habits.length);
	}, [habits, isClient]);

	const bestStreak = useMemo(() => {
		if (!isClient || habits.length === 0) return 0;
		return Math.max(
			...habits.map((habit) => calculateBestStreak(habit.completions))
		);
	}, [habits, isClient]);

	const weekDateRange = useMemo(() => {
		if (barData.length === 0) return "";
		const firstDay = barData[0].date;
		const lastDay = barData[barData.length - 1].date;
		return `${format(firstDay, "MMM d")} - ${format(lastDay, "MMM d, yyyy")}`;
	}, [barData]);

	const filteredHabits = useMemo(() => {
		return habits.filter((habit) => {
			const matchesSearch = habit.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesCategory =
				filterCategory === "all" || habit.category === filterCategory;
			const matchesPriority =
				filterPriority === "all" || habit.priority === filterPriority;
			return matchesSearch && matchesCategory && matchesPriority;
		});
	}, [habits, searchTerm, filterCategory, filterPriority]);

	const optimizedBarData = useMemo(() => {
		return barData.map((day) => {
			const dateStr = format(day.date, "yyyy-MM-dd");
			const positive = habits.filter(
				(habit) => habit.completions[dateStr]
			).length;
			const negative = habits.length - positive;
			return {
				...day,
				positive:
					habits.length > 0 ? Math.round((positive / habits.length) * 100) : 0,
				negative:
					habits.length > 0 ? -Math.round((negative / habits.length) * 100) : 0,
			};
		});
	}, [habits, barData]);

	const addToast = useCallback(
		(message: string, type: "success" | "error" | "info" = "info") => {
			const id = nextToastId;
			setToasts((prev) => [...prev, { id, message, type }]);
			setNextToastId(id + 1);
		},
		[nextToastId]
	);

	const dismissToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const changeWeek = useCallback(
		(date: Date | null) => {
			if (!isClient || !date) return;

			setSelectedDate(date);
			const newWeekData = generateWeekDates(date);
			setBarData(newWeekData);
		},
		[isClient]
	);

	const handleAddHabit = useCallback(() => {
		if (!isClient || !newHabit.trim()) return;

		setHabits((prev) => {
			const newId =
				prev.length > 0 ? Math.max(...prev.map((h) => h.id)) + 1 : 1;
			return [
				...prev,
				{
					id: newId,
					name: newHabit,
					completions: {},
					category: newHabitCategory,
					priority: newHabitPriority,
					createdAt: format(new Date(), "yyyy-MM-dd"),
				},
			];
		});

		setNewHabit("");
		setNewHabitCategory("productivity");
		setNewHabitPriority("medium");
		addToast(translations[language].habitAdded, "success");
	}, [
		newHabit,
		newHabitCategory,
		newHabitPriority,
		isClient,
		addToast,
		language,
	]);

	const deleteHabit = useCallback(
		(id: number) => {
			setHabits((prev) => prev.filter((habit) => habit.id !== id));
			setShowDeleteConfirm(false);
			setHabitToDelete(null);
			addToast(translations[language].habitDeleted, "success");
		},
		[addToast, language]
	);

	const confirmDelete = (habit: Habit) => {
		setHabitToDelete(habit);
		setShowDeleteConfirm(true);
	};

	const startEditHabit = (habit: Habit) => {
		setEditingHabit({ ...habit });
	};

	const saveEditHabit = () => {
		if (editingHabit && editingHabit.name.trim()) {
			setHabits((prev) =>
				prev.map((h) => (h.id === editingHabit.id ? editingHabit : h))
			);
			setEditingHabit(null);
			addToast(translations[language].habitUpdated, "success");
		}
	};

	const toggleHabit = (habitId: number, date: Date) => {
		const dateStr = format(date, "yyyy-MM-dd");
		setHabits((prev) =>
			prev.map((habit) => {
				if (habit.id === habitId) {
					const newCompletions = {
						...habit.completions,
						[dateStr]: !habit.completions[dateStr],
					};
					return { ...habit, completions: newCompletions };
				}
				return habit;
			})
		);
	};

	const exportData = () => {
		try {
			let csvContent = `${translations[language].title},${
				translations[language].category
			},${translations[language].priority},${
				translations[language].avgStreak
			},${barData.map((day) => day.name).join(",")}\n`;

			habits.forEach((habit) => {
				const habitRow = [
					`"${habit.name.replace(/"/g, '""')}"`,
					habit.category || "",
					habit.priority || "",
					calculateCurrentStreak(habit.completions, new Date()),
					...barData.map((day) => {
						const dateStr = format(day.date, "yyyy-MM-dd");
						return habit.completions[dateStr] ? "Yes" : "No";
					}),
				];
				csvContent += habitRow.join(",") + "\n";
			});

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`habit-tracker-${format(selectedDate, "yyyy-MM-dd")}.csv`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setShowExportOptions(false);
			addToast(translations[language].dataExported, "success");
		} catch (error) {
			console.error("Error exporting data:", error);
			addToast("Failed to export data.", "error");
		}
	};

	const exportDataAsJSON = () => {
		try {
			const jsonData = {
				exportDate: format(new Date(), "yyyy-MM-dd"),
				selectedWeek: format(selectedDate, "yyyy-MM-dd"),
				habits: habits.map((habit) => ({
					...habit,
					completions: habit.completions,
				})),
			};

			const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
				type: "application/json;charset=utf-8;",
			});

			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`habit-tracker-${format(selectedDate, "yyyy-MM-dd")}.json`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setShowExportOptions(false);
			addToast(translations[language].dataExported, "success");
		} catch (error) {
			console.error("Error exporting JSON data:", error);
			addToast("Failed to export data.", "error");
		}
	};

	const handleNavigation = (
		section: "dashboard" | "addHabit" | "manageHabits" | "settings"
	) => {
		setCurrentSection(section);
		setSidebarOpen(false);
	};

	const showFeatureNotAvailable = () => {
		addToast(translations[language].featureNotAvailable, "info");
	};

	const changeTheme = (theme: "golden" | "amber" | "yellow") => {
		setActiveTheme(theme);
		addToast(translations[language].themeUpdated, "success");
	};

	if (!isClient) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#0F172A] text-white">
				<div className="text-center">
					<div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin border-[#F59E0B]"></div>
					<p className="mt-2">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`flex min-h-screen flex-col transition-colors duration-300 ${outfit.className} theme-${activeTheme}`}
			style={{
				backgroundColor: themeStyles.background,
				color: themeStyles.text,
			}}
		>
			{}
			<aside
				ref={sidebarRef}
				className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
				style={{
					backgroundColor: themeStyles.surface,
					borderRight: `1px solid ${themeStyles.border}`,
					transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
				}}
			>
				<div className="p-6">
					<div className="flex items-center justify-between mb-8">
						<h1
							className="text-2xl font-bold tracking-tight"
							style={{ color: themeStyles.primary }}
						>
							{translations[language].title}
						</h1>
						<button
							onClick={() => setSidebarOpen(false)}
							className="p-2 rounded-full transition-colors cursor-pointer"
							style={{ color: themeStyles.textSecondary }}
							aria-label="Close Sidebar"
						>
							{Icons.close}
						</button>
					</div>

					<nav className="space-y-2">
						<button
							onClick={() => handleNavigation("dashboard")}
							className={`flex cursor-pointer items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
								currentSection === "dashboard"
									? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white"
									: ""
							}`}
							style={
								currentSection !== "dashboard"
									? { color: themeStyles.textSecondary }
									: {}
							}
						>
							<span className="mr-3">{Icons.dashboard}</span>
							<span>{translations[language].dashboard}</span>
						</button>

						<button
							onClick={() => handleNavigation("addHabit")}
							className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
								currentSection === "addHabit"
									? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white"
									: ""
							}`}
							style={
								currentSection !== "addHabit"
									? { color: themeStyles.textSecondary }
									: {}
							}
						>
							<span className="mr-3">{Icons.add}</span>
							<span>{translations[language].addHabit}</span>
						</button>

						<button
							onClick={() => handleNavigation("manageHabits")}
							className={`flex items-center w-full px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
								currentSection === "manageHabits"
									? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white"
									: ""
							}`}
							style={
								currentSection !== "manageHabits"
									? { color: themeStyles.textSecondary }
									: {}
							}
						>
							<span className="mr-3">{Icons.manage}</span>
							<span>{translations[language].manageHabits}</span>
						</button>

						<button
							onClick={() => handleNavigation("settings")}
							className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
								currentSection === "settings"
									? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white"
									: ""
							}`}
							style={
								currentSection !== "settings"
									? { color: themeStyles.textSecondary }
									: {}
							}
						>
							<span className="mr-3">{Icons.settings}</span>
							<span>{translations[language].settings}</span>
						</button>

						<button
							onClick={() => showFeatureNotAvailable()}
							className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer"
							style={{ color: themeStyles.textSecondary }}
						>
							<span className="mr-3">{Icons.logout}</span>
							<span>{translations[language].logout}</span>
						</button>
					</nav>
				</div>

				<div
					className="mt-auto p-6 border-t"
					style={{ borderColor: themeStyles.border }}
				>
					<div className="flex items-center justify-between">
						<div
							className="flex items-center"
							style={{ color: themeStyles.primary }}
						>
							{Icons.theme}
							<span className="ml-2 text-sm font-medium">v1.2.0</span>
						</div>
						<div className="rounded-full h-8 w-8 flex items-center justify-center bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white">
							{language === "en" ? "EN" : "ES"}
						</div>
					</div>
				</div>
			</aside>

			{}
			<main className="flex-1 p-4 sm:p-6 w-full max-w-[1920px] mx-auto">
				{}
				<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
							style={{ color: themeStyles.textSecondary }}
							aria-label="Toggle Sidebar"
						>
							{Icons.menu}
						</button>
						<h1
							className="text-xl sm:text-2xl font-bold tracking-tight"
							style={{ color: themeStyles.primary }}
						>
							{currentSection === "dashboard" &&
								translations[language].dashboard}
							{currentSection === "addHabit" && translations[language].addHabit}
							{currentSection === "manageHabits" &&
								translations[language].manageHabits}
							{currentSection === "settings" && translations[language].settings}
						</h1>
					</div>
					<div className="flex items-center flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
						<div className="relative" ref={languageDropdownRef}>
							<button
								onClick={() => setShowLanguageOptions(!showLanguageOptions)}
								className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer"
								style={{
									backgroundColor: themeStyles.surface,
									borderColor: themeStyles.border,
									color: themeStyles.text,
								}}
							>
								<span>{Icons.language}</span>
								<span>{language === "en" ? "English" : "Español"}</span>
								<span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
							</button>
							{showLanguageOptions && (
								<div
									className="absolute top-full left-0 mt-1 w-full rounded-lg border shadow-lg overflow-hidden z-50"
									style={{
										backgroundColor: themeStyles.surface,
										borderColor: themeStyles.border,
									}}
								>
									<button
										onClick={() => {
											setLanguage("en");
											setShowLanguageOptions(false);
										}}
										className="w-full px-4 py-2 text-left flex items-center justify-between cursor-pointer"
										style={{
											backgroundColor:
												language === "en"
													? themeStyles.surfaceSecondary
													: themeStyles.surface,
											color: themeStyles.text,
										}}
									>
										<span>English</span>
										{language === "en" && (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</button>
									<button
										onClick={() => {
											setLanguage("es");
											setShowLanguageOptions(false);
										}}
										className="w-full px-4 py-2 text-left flex items-center justify-between cursor-pointer"
										style={{
											backgroundColor:
												language === "es"
													? themeStyles.surfaceSecondary
													: themeStyles.surface,
											color: themeStyles.text,
										}}
									>
										<span>Español</span>
										{language === "es" && (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</button>
								</div>
							)}
						</div>
						<div className="relative" ref={exportDropdownRef}>
							<button
								onClick={() => setShowExportOptions(!showExportOptions)}
								className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-lg hover:opacity-90 transition-all cursor-pointer"
							>
								{translations[language].exportData}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
							{showExportOptions && (
								<div
									className="absolute right-0 mt-1 w-48 rounded-lg border shadow-lg overflow-hidden z-50"
									style={{
										backgroundColor: themeStyles.surface,
										borderColor: themeStyles.border,
									}}
								>
									<button
										onClick={exportData}
										className="w-full text-left px-4 py-2 transition-colors cursor-pointer"
										style={{ color: themeStyles.text }}
									>
										Export as CSV
									</button>
									<button
										onClick={exportDataAsJSON}
										className="w-full text-left px-4 py-2 transition-colors cursor-pointer"
										style={{ color: themeStyles.text }}
									>
										Export as JSON
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				{}
				{currentSection === "dashboard" && (
					<div className="space-y-6">
						{}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div
								className="p-6 rounded-xl relative overflow-hidden group transition-shadow duration-200 shadow-lg"
								style={{ backgroundColor: themeStyles.surface }}
							>
								<div className="flex flex-col">
									<h3
										className="text-sm font-medium tracking-wide"
										style={{ color: themeStyles.textSecondary }}
									>
										{translations[language].habits}
									</h3>
									<div
										className="text-2xl md:text-3xl font-semibold mt-2 tracking-tight"
										style={{ color: themeStyles.primary }}
									>
										{habits.length}
									</div>
								</div>
								<div
									className="absolute top-4 right-4 p-2 rounded-lg"
									style={{ backgroundColor: themeStyles.surfaceSecondary }}
								>
									<span className="text-xl hidden sm:block">📋</span>
								</div>
								<div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.07] rotate-12 scale-150 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-[1.7] pointer-events-none flex items-center justify-center">
									<span className="text-4xl">📋</span>
								</div>
							</div>

							<div
								className="p-6 rounded-xl relative overflow-hidden group transition-shadow duration-200 shadow-lg"
								style={{ backgroundColor: themeStyles.surface }}
							>
								<div className="flex flex-col">
									<h3
										className="text-sm font-medium tracking-wide"
										style={{ color: themeStyles.textSecondary }}
									>
										{translations[language].avgStreak}
									</h3>
									<div
										className="text-2xl md:text-3xl font-semibold mt-2 tracking-tight"
										style={{ color: themeStyles.primary }}
									>
										{averageStreak} days
									</div>
								</div>
								<div
									className="absolute top-4 right-4 p-2 rounded-lg"
									style={{ backgroundColor: themeStyles.surfaceSecondary }}
								>
									<span className="text-xl hidden sm:block">📈</span>
								</div>
								<div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.07] rotate-12 scale-150 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-[1.7] pointer-events-none flex items-center justify-center">
									<span className="text-4xl">📈</span>
								</div>
							</div>

							<div
								className="p-6 rounded-xl relative overflow-hidden group transition-shadow duration-200 shadow-lg"
								style={{ backgroundColor: themeStyles.surface }}
							>
								<div className="flex flex-col">
									<h3
										className="text-sm font-medium tracking-wide"
										style={{ color: themeStyles.textSecondary }}
									>
										{translations[language].completion}
									</h3>
									<div
										className="text-2xl md:text-3xl font-semibold mt-2 tracking-tight"
										style={{ color: themeStyles.primary }}
									>
										{completionPercentage}%
									</div>
								</div>
								<div
									className="absolute top-4 right-4 p-2 rounded-lg"
									style={{ backgroundColor: themeStyles.surfaceSecondary }}
								>
									<span className="text-xl hidden sm:block">✅</span>
								</div>
								<div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.07] rotate-12 scale-150 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-[1.7] pointer-events-none flex items-center justify-center">
									<span className="text-4xl">✅</span>
								</div>
							</div>

							<div
								className="p-6 rounded-xl relative overflow-hidden group transition-shadow duration-200 shadow-lg"
								style={{ backgroundColor: themeStyles.surface }}
							>
								<div className="flex flex-col">
									<h3
										className="text-sm font-medium tracking-wide"
										style={{ color: themeStyles.textSecondary }}
									>
										{translations[language].bestStreak}
									</h3>
									<div
										className="text-2xl md:text-3xl font-semibold mt-2 tracking-tight"
										style={{ color: themeStyles.primary }}
									>
										{bestStreak} days
									</div>
								</div>
								<div
									className="absolute top-4 right-4 p-2 rounded-lg"
									style={{ backgroundColor: themeStyles.surfaceSecondary }}
								>
									<span className="text-xl hidden sm:block">⭐</span>{" "}
								</div>
								<div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.07] rotate-12 scale-150 transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-[1.7] pointer-events-none flex items-center justify-center">
									<span className="text-4xl">⭐</span>
								</div>
							</div>
						</div>

						{}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{}
							<div
								className="p-6 rounded-xl h-80 shadow-lg col-span-1 md:col-span-2"
								style={{ backgroundColor: themeStyles.surface }}
							>
								<h2
									className="text-lg font-semibold mb-4"
									style={{ color: themeStyles.primary }}
								>
									{translations[language].weeklyProgress}
								</h2>
								{chartsLoaded ? (
									<ResponsiveContainer width="100%" height="85%">
										<BarChart
											data={optimizedBarData}
											margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
										>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke={themeStyles.border}
												opacity={0.3}
											/>
											<XAxis
												dataKey="name"
												stroke={themeStyles.textSecondary}
												fontSize={12}
											/>
											<YAxis
												stroke={themeStyles.textSecondary}
												fontSize={12}
												domain={[-100, 100]}
												tickFormatter={(value) => Math.abs(value) + "%"}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: themeStyles.surface,
													color: themeStyles.text,
													border: `1px solid ${themeStyles.border}`,
													borderRadius: "8px",
													fontSize: "12px",
												}}
												formatter={(value: number) => [
													Math.abs(value) + "%",
													value >= 0
														? translations[language].completed
														: translations[language].missed,
												]}
											/>
											<Legend
												wrapperStyle={{
													color: themeStyles.textSecondary,
													fontSize: 12,
												}}
											/>
											<Bar
												dataKey="positive"
												fill={themeStyles.primary}
												name={translations[language].completed}
												radius={[4, 4, 0, 0]}
											/>
											<Bar
												dataKey="negative"
												fill={themeStyles.secondary}
												name={translations[language].missed}
												radius={[0, 0, 4, 4]}
											/>
										</BarChart>
									</ResponsiveContainer>
								) : (
									<div className="flex items-center justify-center h-full">
										<div className="text-center">
											<div
												className="inline-block w-6 h-6 border-4 border-t-transparent rounded-full animate-spin"
												style={{
													borderColor: themeStyles.primary,
													borderTopColor: "transparent",
												}}
											></div>
											<p className="mt-2 text-sm">Loading...</p>
										</div>
									</div>
								)}
							</div>

							{}
							<div
								className="p-6 rounded-xl shadow-lg"
								style={{ backgroundColor: themeStyles.surface }}
							>
								<h2
									className="text-lg font-semibold mb-4"
									style={{ color: themeStyles.primary }}
								>
									{translations[language].week}: {weekDateRange}
								</h2>

								<div className="flex items-center justify-between gap-2 mb-4 px-2">
									<button
										onClick={() => changeWeek(subDays(selectedDate, 7))}
										className="p-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white cursor-pointer"
									>
										← Prev
									</button>
									<button
										onClick={() => changeWeek(new Date())}
										className="p-2 rounded-lg text-sm font-medium cursor-pointer"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											color: themeStyles.text,
										}}
									>
										Today
									</button>
									<button
										onClick={() => changeWeek(addDays(selectedDate, 7))}
										className="p-2 rounded-lg text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white cursor-pointer"
									>
										Next →
									</button>
								</div>

								<div className="flex justify-center">
									<DatePicker
										selected={selectedDate}
										onChange={(date: Date | null) => {
											if (date) {
												changeWeek(date);
											}
										}}
										inline
										calendarClassName={`!border-0 !font-sans !text-sm`}
										showWeekNumbers
									/>
								</div>
							</div>
						</div>

						{}
						<div
							className="p-6 rounded-xl shadow-lg"
							style={{ backgroundColor: themeStyles.surface }}
						>
							<h2
								className="text-lg font-semibold mb-6"
								style={{ color: themeStyles.primary }}
							>
								{translations[language].performance}
							</h2>

							{chartsLoaded ? (
								<div className="flex flex-col sm:flex-row gap-8 justify-around items-center">
									<CircularProgress
										percentage={completionPercentage}
										label={translations[language].today}
										activeTheme={themeStyles}
									/>
									<CircularProgress
										percentage={weekCompletionPercentage}
										label={translations[language].thisWeek}
										activeTheme={themeStyles}
									/>
									<CircularProgress
										percentage={lastWeekCompletionPercentage}
										label={translations[language].lastWeek}
										activeTheme={themeStyles}
									/>
								</div>
							) : (
								<div className="flex-1 flex items-center justify-center">
									<div className="text-center">
										<div
											className="inline-block w-6 h-6 border-4 border-t-transparent rounded-full animate-spin"
											style={{
												borderColor: themeStyles.primary,
												borderTopColor: "transparent",
											}}
										></div>
										<p className="mt-2 text-sm">Loading...</p>
									</div>
								</div>
							)}
						</div>

						{}
						<div
							className="p-6 rounded-xl shadow-lg overflow-x-auto"
							style={{ backgroundColor: themeStyles.surface }}
						>
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
								<h2
									className="text-lg font-semibold"
									style={{ color: themeStyles.primary }}
								>
									{translations[language].habits}
								</h2>

								<div className="flex flex-wrap gap-2">
									<div
										className="relative rounded-lg border px-3 py-2 flex items-center"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											borderColor: themeStyles.border,
										}}
									>
										<span
											className="absolute inset-y-0 left-0 flex items-center pl-3"
											style={{ color: themeStyles.textSecondary }}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
										<input
											type="text"
											placeholder={translations[language].search}
											className="bg-transparent border-none outline-none text-sm pl-8 pr-4 w-full md:w-auto"
											style={{ color: themeStyles.text }}
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>

									<select
										value={filterCategory}
										onChange={(e) => setFilterCategory(e.target.value)}
										className="rounded-lg border px-3 py-2 text-sm appearance-none cursor-pointer"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											borderColor: themeStyles.border,
											color: themeStyles.text,
										}}
									>
										<option value="all">
											{translations[language].allCategories}
										</option>
										<option value="health">
											{translations[language].categories.health}
										</option>
										<option value="productivity">
											{translations[language].categories.productivity}
										</option>
										<option value="learning">
											{translations[language].categories.learning}
										</option>
										<option value="wellness">
											{translations[language].categories.wellness}
										</option>
										<option value="fitness">
											{translations[language].categories.fitness}
										</option>
									</select>

									<select
										value={filterPriority}
										onChange={(e) => setFilterPriority(e.target.value as any)}
										className="rounded-lg border px-3 py-2 text-sm appearance-none cursor-pointer"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											borderColor: themeStyles.border,
											color: themeStyles.text,
										}}
									>
										<option value="all">
											{translations[language].priority}
										</option>
										<option value="low">
											{translations[language].priorities.low}
										</option>
										<option value="medium">
											{translations[language].priorities.medium}
										</option>
										<option value="high">
											{translations[language].priorities.high}
										</option>
									</select>
								</div>
							</div>
							<div
								className="block md:hidden p-3 mb-2 text-sm font-medium"
								style={{ color: themeStyles.textSecondary }}
							>
								<div className="flex justify-between mb-2">
									<span>Tracking for week:</span>
									<span>{weekDateRange}</span>
								</div>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead style={{ color: themeStyles.textSecondary }}>
										<tr
											className="border-b"
											style={{ borderColor: themeStyles.border }}
										>
											<th className="p-3 font-medium">
												{translations[language].habits}
											</th>
											<th className="p-3 text-center font-medium hidden sm:table-cell">
												{translations[language].category}
											</th>
											<th className="p-3 text-center font-medium hidden sm:table-cell">
												{translations[language].priority}
											</th>
											<th className="p-3 text-center font-medium">
												{translations[language].avgStreak}
											</th>
											{barData.map((d, i) => (
												<th
													key={i}
													className="p-1 sm:p-3 text-center font-medium text-xs sm:text-sm"
												>
													<span className="hidden sm:inline">{d.name}</span>
													<span className="sm:hidden">
														{format(d.date, "d")}
													</span>
												</th>
											))}
											<th className="p-3 text-center font-medium">Actions</th>
										</tr>
									</thead>
									<tbody style={{ color: themeStyles.text }}>
										{filteredHabits.length > 0 ? (
											filteredHabits.map((habit) => (
												<tr
													key={habit.id}
													className="border-b"
													style={{ borderColor: themeStyles.border }}
												>
													<td className="p-3">
														{editingHabit?.id === habit.id ? (
															<input
																value={editingHabit.name}
																onChange={(e) =>
																	setEditingHabit({
																		...editingHabit,
																		name: e.target.value,
																	})
																}
																className="w-full px-3 py-1 rounded-lg border"
																style={{
																	backgroundColor: themeStyles.surfaceSecondary,
																	borderColor: themeStyles.border,
																	color: themeStyles.text,
																}}
																onBlur={saveEditHabit}
																onKeyPress={(e) =>
																	e.key === "Enter" && saveEditHabit()
																}
																autoFocus
															/>
														) : (
															habit.name
														)}
													</td>
													<td className="p-3 text-center hidden sm:table-cell">
														<span
															className="inline-block px-3 py-1 rounded-full text-xs font-medium"
															style={{
																backgroundColor: themeStyles.surfaceSecondary,
																color: themeStyles.primary,
															}}
														>
															{habit.category
																? translations[language].categories[
																		habit.category as keyof typeof translations.en.categories
																  ]
																: "—"}
														</span>
													</td>
													<td className="p-3 text-center hidden sm:table-cell">
														<span
															className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
																habit.priority === "high"
																	? "bg-red-100 text-red-600"
																	: habit.priority === "medium"
																	? "bg-amber-100 text-amber-600"
																	: "bg-blue-100 text-blue-600"
															}`}
														>
															{habit.priority
																? translations[language].priorities[
																		habit.priority
																  ]
																: "—"}
														</span>
													</td>
													<td className="p-3 text-center">
														<span
															className="inline-block px-3 py-1 rounded-full text-xs font-medium"
															style={{
																backgroundColor:
																	calculateCurrentStreak(
																		habit.completions,
																		new Date()
																	) > 0
																		? themeStyles.primary
																		: themeStyles.surfaceSecondary,
																color:
																	calculateCurrentStreak(
																		habit.completions,
																		new Date()
																	) > 0
																		? "white"
																		: themeStyles.textSecondary,
															}}
														>
															{calculateCurrentStreak(
																habit.completions,
																new Date()
															)}
														</span>
													</td>
													{barData.map((day, i) => {
														const dateStr = format(day.date, "yyyy-MM-dd");
														return (
															<td
																key={i}
																className="p-2 text-center lg-table-cell"
															>
																<input
																	type="checkbox"
																	className="w-4 h-4 rounded cursor-pointer accent-[#F59E0B]"
																	checked={habit.completions[dateStr] || false}
																	onChange={() =>
																		toggleHabit(habit.id, day.date)
																	}
																/>
															</td>
														);
													})}
													<td className="p-3 text-center">
														<div className="flex justify-center gap-2">
															<button
																onClick={() => startEditHabit(habit)}
																className="p-2 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-sm transition-all duration-200 cursor-pointer"
															>
																{Icons.edit}
															</button>
															<button
																onClick={() => confirmDelete(habit)}
																className="p-2 rounded-lg bg-red-500 text-white shadow-sm hover:bg-red-600 transition-all duration-200 cursor-pointer"
															>
																{Icons.delete}
															</button>
														</div>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td
													colSpan={7 + barData.length}
													className="p-6 text-center"
												>
													<div className="flex flex-col items-center justify-center gap-3">
														<span className="text-4xl">🔍</span>
														<span style={{ color: themeStyles.textSecondary }}>
															No habits found
														</span>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				{}
				{currentSection === "addHabit" && (
					<div
						className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg"
						style={{ backgroundColor: themeStyles.surface }}
					>
						<h2
							className="text-xl font-semibold mb-6"
							style={{ color: themeStyles.primary }}
						>
							{translations[language].addHabit}
						</h2>

						<div className="space-y-4 mb-6">
							<div>
								<label
									className="block mb-2 text-sm font-medium"
									style={{ color: themeStyles.textSecondary }}
								>
									Habit Name
								</label>
								<input
									type="text"
									value={newHabit}
									onChange={(e) => setNewHabit(e.target.value)}
									placeholder={translations[language].newHabit}
									className="w-full px-4 py-2 rounded-lg border"
									style={{
										backgroundColor: themeStyles.surfaceSecondary,
										borderColor: themeStyles.border,
										color: themeStyles.text,
									}}
									onKeyPress={(e) => e.key === "Enter" && handleAddHabit()}
								/>
							</div>

							<div>
								<label
									className="block mb-2 text-sm font-medium"
									style={{ color: themeStyles.textSecondary }}
								>
									{translations[language].category}
								</label>
								<select
									value={newHabitCategory}
									onChange={(e) => setNewHabitCategory(e.target.value)}
									className="w-full px-4 py-2 rounded-lg border appearance-none"
									style={{
										backgroundColor: themeStyles.surfaceSecondary,
										borderColor: themeStyles.border,
										color: themeStyles.text,
									}}
								>
									<option value="health">
										{translations[language].categories.health}
									</option>
									<option value="productivity">
										{translations[language].categories.productivity}
									</option>
									<option value="learning">
										{translations[language].categories.learning}
									</option>
									<option value="wellness">
										{translations[language].categories.wellness}
									</option>
									<option value="fitness">
										{translations[language].categories.fitness}
									</option>
								</select>
							</div>

							<div>
								<label
									className="block mb-2 text-sm font-medium"
									style={{ color: themeStyles.textSecondary }}
								>
									{translations[language].priority}
								</label>
								<div className="flex gap-4">
									{(["low", "medium", "high"] as const).map((priority) => (
										<label key={priority} className="flex items-center">
											<input
												type="radio"
												name="priority"
												value={priority}
												checked={newHabitPriority === priority}
												onChange={() => setNewHabitPriority(priority)}
												className="mr-2 accent-[#F59E0B]"
											/>
											<span>{translations[language].priorities[priority]}</span>
										</label>
									))}
								</div>
							</div>
						</div>

						<button
							onClick={handleAddHabit}
							disabled={!newHabit.trim()}
							className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span>{Icons.add}</span>
							<span>{translations[language].addHabit}</span>
						</button>

						{}
						<div className="mt-8">
							<h3
								className="text-lg font-medium mb-4"
								style={{ color: themeStyles.textSecondary }}
							>
								Popular habits to add
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{[
									"Drink 8 glasses of water",
									"Practice mindfulness for 10 minutes",
									"Take a 30-minute walk",
									"Read 20 pages",
									"Write in a journal",
									"Stretch in the morning",
								].map((example, index) => (
									<button
										key={index}
										onClick={() => {
											setNewHabit(example);
											setNewHabitCategory(
												[
													"health",
													"wellness",
													"fitness",
													"learning",
													"productivity",
													"wellness",
												][index % 6] as string
											);
										}}
										className="p-3 rounded-lg text-left transition-colors cursor-pointer"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											color: themeStyles.text,
										}}
									>
										{example}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{}
				{currentSection === "manageHabits" && (
					<div className="space-y-6">
						<div
							className="p-6 rounded-xl shadow-lg overflow-x-auto"
							style={{ backgroundColor: themeStyles.surface }}
						>
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
								<h2
									className="text-xl font-semibold"
									style={{ color: themeStyles.primary }}
								>
									{translations[language].manageHabits}
								</h2>

								<div className="flex flex-wrap gap-2">
									<div
										className="relative rounded-lg border px-3 py-2 flex items-center"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											borderColor: themeStyles.border,
										}}
									>
										<span
											className="absolute inset-y-0 left-0 flex items-center pl-3"
											style={{ color: themeStyles.textSecondary }}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
										<input
											type="text"
											placeholder={translations[language].search}
											className="bg-transparent border-none outline-none text-sm pl-8 pr-4 w-full md:w-auto"
											style={{ color: themeStyles.text }}
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>

									<select
										value={filterCategory}
										onChange={(e) => setFilterCategory(e.target.value)}
										className="rounded-lg border px-3 py-2 text-sm appearance-none cursor-pointer"
										style={{
											backgroundColor: themeStyles.surfaceSecondary,
											borderColor: themeStyles.border,
											color: themeStyles.text,
										}}
									>
										<option value="all">
											{translations[language].allCategories}
										</option>
										<option value="health">
											{translations[language].categories.health}
										</option>
										<option value="productivity">
											{translations[language].categories.productivity}
										</option>
										<option value="learning">
											{translations[language].categories.learning}
										</option>
										<option value="wellness">
											{translations[language].categories.wellness}
										</option>
										<option value="fitness">
											{translations[language].categories.fitness}
										</option>
									</select>
								</div>
							</div>

							{filteredHabits.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{filteredHabits.map((habit) => (
										<div
											key={habit.id}
											className="relative p-5 rounded-lg border"
											style={{
												backgroundColor: themeStyles.surfaceSecondary,
												borderColor: themeStyles.border,
											}}
										>
											{editingHabit?.id === habit.id ? (
												<div className="space-y-4">
													<input
														value={editingHabit.name}
														onChange={(e) =>
															setEditingHabit({
																...editingHabit,
																name: e.target.value,
															})
														}
														className="w-full px-3 py-1 rounded-lg border mb-2"
														style={{
															backgroundColor: themeStyles.surface,
															borderColor: themeStyles.border,
															color: themeStyles.text,
														}}
														onKeyPress={(e) =>
															e.key === "Enter" && saveEditHabit()
														}
														autoFocus
													/>

													<div>
														<label
															className="block mb-1 text-xs"
															style={{ color: themeStyles.textSecondary }}
														>
															{translations[language].category}
														</label>
														<select
															value={editingHabit.category || "productivity"}
															onChange={(e) =>
																setEditingHabit({
																	...editingHabit,
																	category: e.target.value,
																})
															}
															className="w-full px-3 py-1 rounded-lg border text-sm appearance-none"
															style={{
																backgroundColor: themeStyles.surface,
																borderColor: themeStyles.border,
																color: themeStyles.text,
															}}
														>
															<option value="health">
																{translations[language].categories.health}
															</option>
															<option value="productivity">
																{translations[language].categories.productivity}
															</option>
															<option value="learning">
																{translations[language].categories.learning}
															</option>
															<option value="wellness">
																{translations[language].categories.wellness}
															</option>
															<option value="fitness">
																{translations[language].categories.fitness}
															</option>
														</select>
													</div>

													<div>
														<label
															className="block mb-1 text-xs"
															style={{ color: themeStyles.textSecondary }}
														>
															{translations[language].priority}
														</label>
														<div className="flex gap-4 text-sm">
															{(["low", "medium", "high"] as const).map(
																(priority) => (
																	<label
																		key={priority}
																		className="flex items-center"
																	>
																		<input
																			type="radio"
																			name={`priority-${habit.id}`}
																			value={priority}
																			checked={
																				(editingHabit.priority || "medium") ===
																				priority
																			}
																			onChange={() =>
																				setEditingHabit({
																					...editingHabit,
																					priority,
																				})
																			}
																			className="mr-1 accent-[#F59E0B]"
																		/>
																		<span>
																			{
																				translations[language].priorities[
																					priority
																				]
																			}
																		</span>
																	</label>
																)
															)}
														</div>
													</div>

													<div className="flex justify-end pt-2">
														<button
															onClick={() => setEditingHabit(null)}
															className="px-3 py-1 rounded-lg text-sm mr-2 cursor-pointer"
															style={{
																backgroundColor: themeStyles.surface,
																color: themeStyles.text,
															}}
														>
															{translations[language].cancel}
														</button>
														<button
															onClick={saveEditHabit}
															className="px-3 py-1 rounded-lg text-sm bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white cursor-pointer"
														>
															{translations[language].save}
														</button>
													</div>
												</div>
											) : (
												<>
													<div className="flex justify-between items-start mb-3">
														<h3
															className="text-lg font-medium"
															style={{ color: themeStyles.text }}
														>
															{habit.name}
														</h3>
														<div className="flex gap-1">
															<button
																onClick={() => startEditHabit(habit)}
																className="p-1.5 rounded-lg transition-colors cursor-pointer"
																style={{
																	backgroundColor: themeStyles.surface,
																	color: themeStyles.textSecondary,
																}}
															>
																{Icons.edit}
															</button>
															<button
																onClick={() => confirmDelete(habit)}
																className="p-1.5 rounded-lg transition-colors cursor-pointer"
																style={{
																	backgroundColor: themeStyles.surface,
																	color: themeStyles.textSecondary,
																}}
															>
																{Icons.delete}
															</button>
														</div>
													</div>

													<div className="flex flex-wrap gap-2 mb-4">
														<span
															className="inline-block px-2 py-1 rounded-full text-xs font-medium"
															style={{
																backgroundColor: themeStyles.surface,
																color: themeStyles.primary,
															}}
														>
															{habit.category
																? translations[language].categories[
																		habit.category as keyof typeof translations.en.categories
																  ]
																: "—"}
														</span>

														<span
															className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
																habit.priority === "high"
																	? "bg-red-100 text-red-600"
																	: habit.priority === "medium"
																	? "bg-amber-100 text-amber-600"
																	: "bg-blue-100 text-blue-600"
															}`}
														>
															{habit.priority
																? translations[language].priorities[
																		habit.priority
																  ]
																: "—"}
														</span>

														<span
															className="inline-block px-2 py-1 rounded-full text-xs font-medium ml-auto"
															style={{
																backgroundColor: themeStyles.surface,
																color: themeStyles.textSecondary,
															}}
														>
															{new Date(habit.createdAt).toLocaleDateString()}
														</span>
													</div>

													<div className="grid grid-cols-7 gap-1 mt-3 overflow-x-auto max-w-full">
														{barData.map((day, idx) => {
															const dateStr = format(day.date, "yyyy-MM-dd");
															return (
																<div
																	key={idx}
																	className="flex flex-col items-center min-w-[40px]"
																>
																	<div
																		className="text-xs mb-1"
																		style={{ color: themeStyles.textSecondary }}
																	>
																		{format(day.date, "EEE").slice(0, 1)}
																	</div>
																	<button
																		onClick={() =>
																			toggleHabit(habit.id, day.date)
																		}
																		className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer`}
																		style={{
																			backgroundColor: habit.completions[
																				dateStr
																			]
																				? `${themeStyles.primary}`
																				: themeStyles.surface,
																			color: habit.completions[dateStr]
																				? "white"
																				: themeStyles.textSecondary,
																		}}
																	>
																		{habit.completions[dateStr] ? (
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				className="h-4 w-4"
																				viewBox="0 0 20 20"
																				fill="currentColor"
																			>
																				<path
																					fillRule="evenodd"
																					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																					clipRule="evenodd"
																				/>
																			</svg>
																		) : (
																			format(day.date, "d")
																		)}
																	</button>
																</div>
															);
														})}
													</div>

													<div
														className="mt-4 pt-3 border-t"
														style={{ borderColor: themeStyles.border }}
													>
														<div className="flex justify-between items-center">
															<div className="flex flex-col">
																<span
																	className="text-xs"
																	style={{ color: themeStyles.textSecondary }}
																>
																	{translations[language].avgStreak}
																</span>
																<span
																	className="text-lg font-semibold"
																	style={{ color: themeStyles.primary }}
																>
																	{calculateCurrentStreak(
																		habit.completions,
																		new Date()
																	)}{" "}
																	days
																</span>
															</div>
															<div className="flex flex-col">
																<span
																	className="text-xs"
																	style={{ color: themeStyles.textSecondary }}
																>
																	{translations[language].bestStreak}
																</span>
																<span
																	className="text-lg font-semibold"
																	style={{ color: themeStyles.primary }}
																>
																	{calculateBestStreak(habit.completions)} days
																</span>
															</div>
														</div>
													</div>
												</>
											)}
										</div>
									))}
								</div>
							) : (
								<div
									className="p-10 rounded-lg text-center"
									style={{ backgroundColor: themeStyles.surfaceSecondary }}
								>
									<div className="flex flex-col items-center justify-center gap-3">
										<span className="text-5xl">🔍</span>
										<h3
											className="text-lg font-medium"
											style={{ color: themeStyles.textSecondary }}
										>
											No habits found
										</h3>
										<p className="max-w-md mx-auto mt-2">
											Try adjusting your search or filters to find what you're
											looking for.
										</p>
										<button
											onClick={() => {
												setSearchTerm("");
												setFilterCategory("all");
												setFilterPriority("all");
											}}
											className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white cursor-pointer"
										>
											Clear filters
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{}
				{currentSection === "settings" && (
					<div className="max-w-2xl mx-auto space-y-6">
						<div
							className="p-6 rounded-xl shadow-lg"
							style={{ backgroundColor: themeStyles.surface }}
						>
							<h2
								className="text-xl font-semibold mb-6"
								style={{ color: themeStyles.primary }}
							>
								{translations[language].settings}
							</h2>

							<div className="space-y-6">
								<div>
									<h3
										className="text-lg font-medium mb-4"
										style={{ color: themeStyles.textSecondary }}
									>
										Theme
									</h3>
									<div className="grid grid-cols-3 gap-4">
										{(["golden", "yellow", "amber"] as const).map((theme) => (
											<button
												key={theme}
												onClick={() => changeTheme(theme)}
												className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
													activeTheme === theme ? "ring-2 ring-offset-2" : ""
												}`}
												style={{
													backgroundColor:
														theme === "amber" ? "#FFFBEB" : "#1E293B",
													borderColor:
														activeTheme === theme
															? theme === "golden"
																? "#F59E0B"
																: theme === "yellow"
																? "#EAB308"
																: "#F59E0B"
															: themeStyles.border,
													color: theme === "amber" ? "#78350F" : "#F8FAFC",
													ringColor:
														theme === "golden"
															? "#F59E0B"
															: theme === "yellow"
															? "#EAB308"
															: "#F59E0B",
													ringOffsetColor: themeStyles.background,
												}}
											>
												<div
													className="w-full h-8 rounded-md"
													style={{
														background: `linear-gradient(to right, ${
															theme === "golden"
																? "#F59E0B, #D97706"
																: theme === "yellow"
																? "#EAB308, #CA8A04"
																: "#F59E0B, #D97706"
														})`,
													}}
												></div>
												<span className="text-sm font-medium capitalize">
													{theme}
												</span>
											</button>
										))}
									</div>
								</div>

								<div>
									<h3
										className="text-lg font-medium mb-4"
										style={{ color: themeStyles.textSecondary }}
									>
										Language
									</h3>
									<div className="grid grid-cols-2 gap-4">
										{(["en", "es"] as const).map((lang) => (
											<button
												key={lang}
												onClick={() => setLanguage(lang)}
												className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 cursor-pointer ${
													language === lang ? "ring-2 ring-offset-2" : ""
												}`}
												style={{
													backgroundColor: themeStyles.surfaceSecondary,
													borderColor:
														language === lang
															? themeStyles.primary
															: themeStyles.border,
													color: themeStyles.text,
													ringColor: themeStyles.primary,
													ringOffsetColor: themeStyles.background,
												}}
											>
												<div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-medium">
													{lang === "en" ? "EN" : "ES"}
												</div>
												<span className="text-sm font-medium">
													{lang === "en" ? "English" : "Español"}
												</span>
											</button>
										))}
									</div>
								</div>

								<div>
									<h3
										className="text-lg font-medium mb-4"
										style={{ color: themeStyles.textSecondary }}
									>
										Data Management
									</h3>
									<div className="space-y-3">
										<button
											onClick={exportData}
											className="w-full p-4 rounded-lg border transition-all flex items-center gap-3 cursor-pointer"
											style={{
												backgroundColor: themeStyles.surfaceSecondary,
												borderColor: themeStyles.border,
												color: themeStyles.text,
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
											<span>Export as CSV</span>
										</button>

										<button
											onClick={exportDataAsJSON}
											className="w-full p-4 rounded-lg border transition-all flex items-center gap-3 cursor-pointer"
											style={{
												backgroundColor: themeStyles.surfaceSecondary,
												borderColor: themeStyles.border,
												color: themeStyles.text,
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2.5H6.5a1 1 0 100 2H9v2.5a1 1 0 102 0V12.5h2.5a1 1 0 100-2H11V8z"
													clipRule="evenodd"
												/>
											</svg>
											<span>Export as JSON</span>
										</button>

										<button
											onClick={() => {
												const shouldReset = confirm(
													"Are you sure you want to reset all data? This cannot be undone."
												);
												if (shouldReset) {
													setHabits(generateInitialHabits());
													addToast(
														"All data has been reset successfully",
														"success"
													);
												}
											}}
											className="w-full p-4 rounded-lg border transition-all flex items-center gap-3 cursor-pointer"
											style={{
												backgroundColor: "#FEE2E2",
												borderColor: "#FECACA",
												color: "#B91C1C",
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											<span>Reset All Data</span>
										</button>
									</div>
								</div>
							</div>
						</div>

						<div
							className="p-6 rounded-xl shadow-lg"
							style={{ backgroundColor: themeStyles.surface }}
						>
							<h3
								className="text-lg font-medium mb-4"
								style={{ color: themeStyles.textSecondary }}
							>
								About
							</h3>
							<div className="space-y-4">
								<p style={{ color: themeStyles.text }}>
									Habit Tracker is a beautiful, responsive application designed
									to help you build positive habits and track your progress.
								</p>
								<div
									className="p-4 rounded-lg text-center"
									style={{ backgroundColor: themeStyles.surfaceSecondary }}
								>
									<p
										className="font-medium"
										style={{ color: themeStyles.text }}
									>
										Habit Tracker v1.2.0
									</p>
									<p
										className="text-sm mt-1"
										style={{ color: themeStyles.textSecondary }}
									>
										© 2025 Habit Tracker. All rights reserved.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>

			{}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div
						className="p-6 rounded-xl w-11/12 max-w-md shadow-xl"
						style={{ backgroundColor: themeStyles.surface }}
					>
						<h3
							className="text-lg font-semibold mb-4"
							style={{ color: themeStyles.primary }}
						>
							{translations[language].deleteConfirm}
						</h3>
						<p
							className="mb-6 text-sm"
							style={{ color: themeStyles.textSecondary }}
						>
							{translations[language].deletePrompt}{" "}
							<span className="font-bold" style={{ color: themeStyles.text }}>
								{habitToDelete?.name}
							</span>
							?
						</p>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 rounded-lg transition-all cursor-pointer"
								style={{
									backgroundColor: themeStyles.surfaceSecondary,
									color: themeStyles.text,
								}}
							>
								{translations[language].cancel}
							</button>
							<button
								onClick={() => deleteHabit(habitToDelete!.id)}
								className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer"
							>
								{translations[language].delete}
							</button>
						</div>
					</div>
				</div>
			)}

			{}
			<div className="fixed bottom-4 right-4 space-y-3 z-50">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						toast={toast}
						onDismiss={dismissToast}
						activeTheme={themeStyles}
					/>
				))}
			</div>
		</div>
	);
};

export default HabitTracker;
