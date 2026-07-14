// assets/js/converter.js

/**
 * Convert CGPA from one grading system to another using Direct Value Mapping
 * @param {number} cgpa - Current CGPA to convert
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @returns {number} Converted CGPA
 */
function convertCGPA(cgpa, fromSystem, toSystem) {
    // Get the grading systems
    const fromScale = GRADING_SYSTEMS[fromSystem];
    const toScale = GRADING_SYSTEMS[toSystem];
    
    if (!fromScale || !toScale) {
        console.warn('Grading system not found');
        return cgpa;
    }

    // Get all grade points from both scales
    const fromGrades = Object.values(fromScale);
    const toGrades = Object.values(toScale);
    
    // Remove duplicates and sort
    const uniqueFromGrades = [...new Set(fromGrades)].sort((a, b) => a - b);
    const uniqueToGrades = [...new Set(toGrades)].sort((a, b) => a - b);
    
    // If CGPA is 0, return 0
    if (cgpa === 0) return 0;
    
    // Find the closest matching grade point in target scale
    let convertedCGPA = 0;
    let minDifference = Infinity;
    
    // For each target grade point, find the closest current grade point
    uniqueToGrades.forEach(targetGp => {
        uniqueFromGrades.forEach(fromGp => {
            const diff = Math.abs(cgpa - fromGp);
            if (diff < minDifference) {
                minDifference = diff;
                convertedCGPA = targetGp;
            }
        });
    });
    
    // If no exact match found (cgpa is between grade points), use proportional as fallback
    if (convertedCGPA === 0 && cgpa > 0) {
        const fromMax = Math.max(...uniqueFromGrades);
        const toMax = Math.max(...uniqueToGrades);
        convertedCGPA = (cgpa / fromMax) * toMax;
    }
    
    // Round to 2 decimal places
    return Math.round(convertedCGPA * 100) / 100;
}

/**
 * Convert a single grade (letter) from one system to another
 * @param {string} grade - Letter grade (e.g., 'A+', 'B')
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @returns {string} Converted letter grade
 */
function convertGrade(grade, fromSystem, toSystem) {
    const fromScale = GRADING_SYSTEMS[fromSystem];
    const toScale = GRADING_SYSTEMS[toSystem];
    
    if (!fromScale || !toScale) {
        console.warn('Grading system not found');
        return grade;
    }
    
    // Get the grade point of the original grade
    const gradePoint = fromScale[grade];
    if (gradePoint === undefined) {
        console.warn('Grade not found in source system');
        return grade;
    }
    
    // Find the closest matching grade in target system
    let convertedGrade = Object.keys(toScale)[0]; // Default to first grade
    let minDifference = Infinity;
    
    Object.entries(toScale).forEach(([targetGrade, targetPoint]) => {
        const diff = Math.abs(gradePoint - targetPoint);
        if (diff < minDifference) {
            minDifference = diff;
            convertedGrade = targetGrade;
        }
    });
    
    return convertedGrade;
}

/**
 * Get all available grading systems
 * @returns {string[]} List of grading system names
 */
function getGradingSystems() {
    return Object.keys(GRADING_SYSTEMS);
}

/**
 * Get grade points for a specific grading system
 * @param {string} systemName - Grading system name
 * @returns {Object} Grade point mapping
 */
function getGradePoints(systemName) {
    return GRADING_SYSTEMS[systemName] || null;
}

// Make functions globally available
window.convertCGPA = convertCGPA;
window.convertGrade = convertGrade;
window.getGradingSystems = getGradingSystems;
window.getGradePoints = getGradePoints;

// Export for module usage
export { convertCGPA, convertGrade, getGradingSystems, getGradePoints };
