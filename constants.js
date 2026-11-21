// assets/js/constants.js
// Global Constants for MarsCal

export const APP_NAME = "MarsCal";
export const VERSION = "2.0.0";
export const AUTHOR = "Grok Assisted";

export const DEFAULT_GRADING_SYSTEM = "bd4";
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

// Default Student Info
export const DEFAULT_STUDENT_INFO = {
    name: "",
    institution: "",
    board: "",
    subject: "",
    roll: "",
    registration: "",
    examName: "",
    examYear: new Date().getFullYear().toString()
};

// Grade Colors for Charts
export const GRADE_COLORS = {
    "A+": "#22c55e",
    "A": "#eab308",
    "A-": "#3b82f6",
    "B+": "#8b5cf6",
    "B": "#8b5cf6",
    "B-": "#8b5cf6",
    "C+": "#ec4899",
    "C": "#ec4899",
    "C-": "#ec4899",
    "D+": "#f97316",
    "D": "#f97316",
    "D0": "#f97316",
    "F": "#ef4444",
    "FX": "#ef4444",
    "O": "#22c55e",
    "P": "#f59e0b",
    "First Class": "#22c55e",
    "Upper Second (2:1)": "#3b82f6",
    "Lower Second (2:2)": "#8b5cf6",
    "Third Class": "#ec4899",
    "Fail": "#ef4444"
};

// Transcript Settings
export const TRANSCRIPT_SETTINGS = {
    SEMESTERS_PER_PAGE: 2,
    SHOW_GRADE_SCALE: true,
    SHOW_SIGNATURE: true,
    SIGNATURE_1: "Controller of Examinations",
    SIGNATURE_2: "Head of Department / Principal"
};

export default {
    APP_NAME,
    VERSION,
    AUTHOR,
    DEFAULT_GRADING_SYSTEM,
    DEFAULT_CREDIT,
    MAX_SEMESTERS,
    MAX_COURSES_PER_SEM,
    TOAST_DURATION,
    CREDIT_MODES,
    PRINT_SETTINGS,
    DEFAULT_STUDENT_INFO,
    GRADE_COLORS,
    TRANSCRIPT_SETTINGS
};
