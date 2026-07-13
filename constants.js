// assets/js/constants.js
// Global Constants for AcadCalc

export const APP_NAME = "MarsCal";
export const VERSION = "1.0.0";
export const AUTHOR = "Grok Assisted";

export const DEFAULT_GRADING_SYSTEM = "bd5";
export const DEFAULT_CREDIT = 3.0;
export const MAX_SEMESTERS = 20;
export const MAX_COURSES_PER_SEM = 12;

export const TOAST_DURATION = 2800;

export const CREDIT_MODES = {
    EQUAL: "equal",
    VARIABLE: "variable"
};

export const PRINT_SETTINGS = {
    TITLE: "Official Academic Transcript",
    PAPER_SIZE: "A4",
    MARGIN: "20mm"
};

// Grade Colors for Charts
export const GRADE_COLORS = {
    "A+": "#22c55e",
    "A": "#eab308",
    "A-": "#3b82f6",
    "B": "#8b5cf6",
    "C": "#ec4899",
    "D": "#f97316",
    "F": "#ef4444"
};

export default {
    APP_NAME,
    VERSION,
    DEFAULT_GRADING_SYSTEM,
    DEFAULT_CREDIT,
    MAX_SEMESTERS,
    MAX_COURSES_PER_SEM,
    TOAST_DURATION,
    CREDIT_MODES,
    PRINT_SETTINGS,
    GRADE_COLORS
};
