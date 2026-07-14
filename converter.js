// assets/js/converter.js

// Grading Systems with Percentage Ranges
const GRADING_SYSTEMS_WITH_PERCENTAGE = {
    'Bangladesh (5.00 Scale)': {
        'A+': { gradePoint: 5.00, min: 80, max: 100 },
        'A': { gradePoint: 4.00, min: 70, max: 79 },
        'A-': { gradePoint: 3.50, min: 60, max: 69 },
        'B': { gradePoint: 3.00, min: 50, max: 59 },
        'C': { gradePoint: 2.00, min: 40, max: 49 },
        'D': { gradePoint: 1.00, min: 33, max: 39 },
        'F': { gradePoint: 0.00, min: 0, max: 32 }
    },
    'Bangladesh (4.00 Scale)': {
        'A+': { gradePoint: 4.00, min: 80, max: 100 },
        'A': { gradePoint: 3.75, min: 75, max: 79 },
        'A-': { gradePoint: 3.50, min: 70, max: 74 },
        'B+': { gradePoint: 3.25, min: 65, max: 69 },
        'B': { gradePoint: 3.00, min: 60, max: 64 },
        'B-': { gradePoint: 2.75, min: 55, max: 59 },
        'C+': { gradePoint: 2.50, min: 50, max: 54 },
        'C': { gradePoint: 2.25, min: 45, max: 49 },
        'D': { gradePoint: 2.00, min: 40, max: 44 },
        'F': { gradePoint: 0.00, min: 0, max: 39 }
    },
    'India (10.00 Scale)': {
        'O': { gradePoint: 10.00, min: 90, max: 100 },
        'A+': { gradePoint: 9.00, min: 80, max: 89 },
        'A': { gradePoint: 8.00, min: 70, max: 79 },
        'B+': { gradePoint: 7.00, min: 60, max: 69 },
        'B': { gradePoint: 6.00, min: 55, max: 59 },
        'C': { gradePoint: 5.00, min: 50, max: 54 },
        'P': { gradePoint: 4.00, min: 40, max: 49 },
        'F': { gradePoint: 0.00, min: 0, max: 39 }
    },
    'Pakistan (4.00 Scale)': {
        'A': { gradePoint: 4.00, min: 85, max: 100 },
        'A-': { gradePoint: 3.67, min: 80, max: 84 },
        'B+': { gradePoint: 3.33, min: 75, max: 79 },
        'B': { gradePoint: 3.00, min: 71, max: 74 },
        'B-': { gradePoint: 2.67, min: 68, max: 70 },
        'C+': { gradePoint: 2.33, min: 64, max: 67 },
        'C': { gradePoint: 2.00, min: 61, max: 63 },
        'C-': { gradePoint: 1.67, min: 58, max: 60 },
        'D+': { gradePoint: 1.33, min: 54, max: 57 },
        'D': { gradePoint: 1.00, min: 50, max: 53 },
        'F': { gradePoint: 0.00, min: 0, max: 49 }
    },
    'United States (4.00 Scale)': {
        'A': { gradePoint: 4.00, min: 90, max: 100 },
        'A-': { gradePoint: 3.70, min: 87, max: 89 },
        'B+': { gradePoint: 3.30, min: 83, max: 86 },
        'B': { gradePoint: 3.00, min: 80, max: 82 },
        'B-': { gradePoint: 2.70, min: 77, max: 79 },
        'C+': { gradePoint: 2.30, min: 73, max: 76 },
        'C': { gradePoint: 2.00, min: 70, max: 72 },
        'C-': { gradePoint: 1.70, min: 67, max: 69 },
        'D+': { gradePoint: 1.30, min: 65, max: 66 },
        'D': { gradePoint: 1.00, min: 60, max: 64 },
        'F': { gradePoint: 0.00, min: 0, max: 59 }
    },
    'United Kingdom': {
        'First Class': { gradePoint: 4.00, min: 70, max: 100 },
        'Upper Second (2:1)': { gradePoint: 3.50, min: 60, max: 69 },
        'Lower Second (2:2)': { gradePoint: 3.00, min: 50, max: 59 },
        'Third Class': { gradePoint: 2.00, min: 40, max: 49 },
        'Fail': { gradePoint: 0.00, min: 0, max: 39 }
    },
    'Europe (ECTS)': {
        'A': { gradePoint: 5.00, min: 90, max: 100 },
        'B': { gradePoint: 4.00, min: 80, max: 89 },
        'C': { gradePoint: 3.00, min: 70, max: 79 },
        'D': { gradePoint: 2.00, min: 60, max: 69 },
        'E': { gradePoint: 1.00, min: 50, max: 59 },
        'F': { gradePoint: 0.00, min: 0, max: 49 }
    },
    'China (Common 4.00 Scale)': {
        'A': { gradePoint: 4.00, min: 90, max: 100 },
        'A-': { gradePoint: 3.70, min: 85, max: 89 },
        'B+': { gradePoint: 3.30, min: 82, max: 84 },
        'B': { gradePoint: 3.00, min: 78, max: 81 },
        'B-': { gradePoint: 2.70, min: 75, max: 77 },
        'C+': { gradePoint: 2.30, min: 72, max: 74 },
        'C': { gradePoint: 2.00, min: 68, max: 71 },
        'C-': { gradePoint: 1.70, min: 64, max: 67 },
        'D': { gradePoint: 1.00, min: 60, max: 63 },
        'F': { gradePoint: 0.00, min: 0, max: 59 }
    },
    'South Korea (4.30 Scale)': {
        'A+': { gradePoint: 4.30, min: 95, max: 100 },
        'A0': { gradePoint: 4.00, min: 90, max: 94 },
        'A-': { gradePoint: 3.70, min: 85, max: 89 },
        'B+': { gradePoint: 3.30, min: 80, max: 84 },
        'B0': { gradePoint: 3.00, min: 75, max: 79 },
        'B-': { gradePoint: 2.70, min: 70, max: 74 },
        'C+': { gradePoint: 2.30, min: 65, max: 69 },
        'C0': { gradePoint: 2.00, min: 60, max: 64 },
        'C-': { gradePoint: 1.70, min: 55, max: 59 },
        'D+': { gradePoint: 1.30, min: 50, max: 54 },
        'D0': { gradePoint: 1.00, min: 45, max: 49 },
        'F': { gradePoint: 0.00, min: 0, max: 44 }
    },
    'Malaysia (4.00 Scale)': {
        'A+': { gradePoint: 4.00, min: 90, max: 100 },
        'A': { gradePoint: 4.00, min: 80, max: 89 },
        'A-': { gradePoint: 3.70, min: 75, max: 79 },
        'B+': { gradePoint: 3.30, min: 70, max: 74 },
        'B': { gradePoint: 3.00, min: 65, max: 69 },
        'B-': { gradePoint: 2.70, min: 60, max: 64 },
        'C+': { gradePoint: 2.30, min: 55, max: 59 },
        'C': { gradePoint: 2.00, min: 50, max: 54 },
        'C-': { gradePoint: 1.70, min: 45, max: 49 },
        'D+': { gradePoint: 1.30, min: 40, max: 44 },
        'D': { gradePoint: 1.00, min: 35, max: 39 },
        'F': { gradePoint: 0.00, min: 0, max: 34 }
    }
};

/**
 * Convert a single course grade using Upper Bound Percentage method
 * @param {string} grade - Current grade (e.g., 'A+', 'B')
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @param {number} credit - Course credit (optional)
 * @returns {Object} Converted grade with details
 */
function convertCourseGrade(grade, fromSystem, toSystem, credit = 1) {
    const fromScale = GRADING_SYSTEMS_WITH_PERCENTAGE[fromSystem];
    const toScale = GRADING_SYSTEMS_WITH_PERCENTAGE[toSystem];
    
    if (!fromScale || !toScale) {
        console.warn('Grading system not found');
        return {
            originalGrade: grade,
            convertedGrade: grade,
            percentage: null,
            fromGradePoint: null,
            toGradePoint: null,
            credit: credit
        };
    }

    // Get the grade data from source
    const fromGradeData = fromScale[grade];
    if (!fromGradeData) {
        console.warn('Grade not found in source system');
        return {
            originalGrade: grade,
            convertedGrade: grade,
            percentage: null,
            fromGradePoint: null,
            toGradePoint: null,
            credit: credit
        };
    }

    // STEP 1: Get the UPPER BOUND percentage of the source grade
    const percentage = fromGradeData.max;
    
    // STEP 2: Find target grade based on this percentage
    let targetGrade = null;
    let targetGradePoint = 0;
    let minDifference = Infinity;
    
    Object.entries(toScale).forEach(([targetGradeName, targetGradeData]) => {
        // Check if percentage falls within target grade range
        if (percentage >= targetGradeData.min && percentage <= targetGradeData.max) {
            targetGrade = targetGradeName;
            targetGradePoint = targetGradeData.gradePoint;
        }
    });
    
    // If no exact range match, find closest grade
    if (!targetGrade) {
        Object.entries(toScale).forEach(([targetGradeName, targetGradeData]) => {
            const diff = Math.abs(percentage - targetGradeData.max);
            if (diff < minDifference) {
                minDifference = diff;
                targetGrade = targetGradeName;
                targetGradePoint = targetGradeData.gradePoint;
            }
        });
    }
    
    return {
        originalGrade: grade,
        convertedGrade: targetGrade,
        percentage: percentage,
        fromGradePoint: fromGradeData.gradePoint,
        toGradePoint: targetGradePoint,
        credit: credit,
        fromMax: fromGradeData.max,
        fromMin: fromGradeData.min,
        toMax: toScale[targetGrade]?.max || null,
        toMin: toScale[targetGrade]?.min || null
    };
}

/**
 * Convert all courses in a semester
 * @param {Array} courses - Array of course objects {grade, credit, name}
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @returns {Array} Converted courses
 */
function convertSemesterCourses(courses, fromSystem, toSystem) {
    if (!courses || courses.length === 0) return [];
    
    return courses.map(course => {
        const converted = convertCourseGrade(course.grade, fromSystem, toSystem, course.credit || 1);
        return {
            ...course,
            originalGrade: course.grade,
            convertedGrade: converted.convertedGrade,
            percentage: converted.percentage,
            fromGradePoint: converted.fromGradePoint,
            toGradePoint: converted.toGradePoint,
            credit: course.credit || 1
        };
    });
}

/**
 * Calculate GPA from courses
 * @param {Array} courses - Array of course objects {grade, credit}
 * @param {string} system - Grading system name
 * @returns {number} GPA
 */
function calculateGPA(courses, system) {
    if (!courses || courses.length === 0) return 0;
    
    const scale = GRADING_SYSTEMS_WITH_PERCENTAGE[system];
    if (!scale) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const gradeData = scale[course.grade];
        if (gradeData) {
            totalPoints += gradeData.gradePoint * (course.credit || 1);
            totalCredits += (course.credit || 1);
        }
    });
    
    return totalCredits === 0 ? 0 : Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Convert CGPA using course-by-course conversion
 * @param {number} cgpa - Current CGPA (optional)
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @param {Array} courses - Array of course objects {grade, credit}
 * @returns {number} Converted CGPA
 */
function convertCGPA(cgpa, fromSystem, toSystem, courses = null) {
    if (courses && courses.length > 0) {
        const convertedCourses = courses.map(course => {
            const converted = convertCourseGrade(course.grade, fromSystem, toSystem, course.credit || 1);
            return {
                ...course,
                grade: converted.convertedGrade,
                credit: course.credit || 1
            };
        });
        return calculateGPA(convertedCourses, toSystem);
    }
    
    // Fallback: Direct conversion using percentage
    const fromScale = GRADING_SYSTEMS_WITH_PERCENTAGE[fromSystem];
    const toScale = GRADING_SYSTEMS_WITH_PERCENTAGE[toSystem];
    
    if (!fromScale || !toScale) return cgpa;
    
    // Find source grade based on CGPA
    let sourceGrade = null;
    let sourcePercentage = 0;
    
    Object.entries(fromScale).forEach(([grade, data]) => {
        if (Math.abs(data.gradePoint - cgpa) < 0.01) {
            sourceGrade = grade;
            sourcePercentage = data.max;
        }
    });
    
    if (!sourceGrade) return cgpa;
    
    // Find target grade based on percentage
    let targetGrade = null;
    let targetGradePoint = 0;
    
    Object.entries(toScale).forEach(([grade, data]) => {
        if (sourcePercentage >= data.min && sourcePercentage <= data.max) {
            targetGrade = grade;
            targetGradePoint = data.gradePoint;
        }
    });
    
    if (!targetGrade) {
        // Find closest
        let minDiff = Infinity;
        Object.entries(toScale).forEach(([grade, data]) => {
            const diff = Math.abs(sourcePercentage - data.max);
            if (diff < minDiff) {
                minDiff = diff;
                targetGrade = grade;
                targetGradePoint = data.gradePoint;
            }
        });
    }
    
    return Math.round(targetGradePoint * 100) / 100;
}

/**
 * Convert a single grade (letter)
 * @param {string} grade - Letter grade
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @returns {string} Converted letter grade
 */
function convertGrade(grade, fromSystem, toSystem) {
    const result = convertCourseGrade(grade, fromSystem, toSystem);
    return result.convertedGrade;
}

/**
 * Get all available grading systems
 * @returns {string[]} List of grading system names
 */
function getGradingSystems() {
    return Object.keys(GRADING_SYSTEMS_WITH_PERCENTAGE);
}

/**
 * Get grade points for a specific grading system
 * @param {string} systemName - Grading system name
 * @returns {Object} Grade point mapping
 */
function getGradePoints(systemName) {
    const scale = GRADING_SYSTEMS_WITH_PERCENTAGE[systemName];
    if (!scale) return null;
    const result = {};
    Object.entries(scale).forEach(([grade, data]) => {
        result[grade] = data.gradePoint;
    });
    return result;
}

/**
 * Get grade details (including percentage range) for a specific grading system
 * @param {string} systemName - Grading system name
 * @returns {Object} Grade details with percentage ranges
 */
function getGradeDetails(systemName) {
    return GRADING_SYSTEMS_WITH_PERCENTAGE[systemName] || null;
}

// Make functions globally available
window.convertCourseGrade = convertCourseGrade;
window.convertSemesterCourses = convertSemesterCourses;
window.convertCGPA = convertCGPA;
window.convertGrade = convertGrade;
window.calculateGPA = calculateGPA;
window.getGradingSystems = getGradingSystems;
window.getGradePoints = getGradePoints;
window.getGradeDetails = getGradeDetails;

// Export for module usage
export { 
    convertCourseGrade,
    convertSemesterCourses,
    convertCGPA, 
    convertGrade,
    calculateGPA,
    getGradingSystems, 
    getGradePoints,
    getGradeDetails,
    GRADING_SYSTEMS_WITH_PERCENTAGE
};
