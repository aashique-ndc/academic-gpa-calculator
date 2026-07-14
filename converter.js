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
    
    // If no exact match found, use proportional mapping
    if (convertedCGPA === 0 && cgpa > 0) {
        const fromMax = Math.max(...uniqueFromGrades);
        const toMax = Math.max(...uniqueToGrades);
        // Proportional mapping: (cgpa / fromMax) * toMax
        convertedCGPA = (cgpa / fromMax) * toMax;
        
        // Now find the closest target grade point to this proportional value
        let closestTarget = 0;
        let closestDiff = Infinity;
        uniqueToGrades.forEach(targetGp => {
            const diff = Math.abs(convertedCGPA - targetGp);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestTarget = targetGp;
            }
        });
        convertedCGPA = closestTarget;
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
 * Convert CGPA with detailed breakdown
 * @param {number} cgpa - Current CGPA to convert
 * @param {string} fromSystem - Current grading system name
 * @param {string} toSystem - Target grading system name
 * @returns {Object} Conversion result with details
 */
function convertCGPAWithDetails(cgpa, fromSystem, toSystem) {
    const fromScale = GRADING_SYSTEMS[fromSystem];
    const toScale = GRADING_SYSTEMS[toSystem];
    
    if (!fromScale || !toScale) {
        return {
            originalCGPA: cgpa,
            convertedCGPA: cgpa,
            fromSystem: fromSystem,
            toSystem: toSystem,
            method: 'Error',
            fromGrades: [],
            toGrades: [],
            closestMatch: null
        };
    }

    const fromGrades = Object.values(fromScale);
    const toGrades = Object.values(toScale);
    const uniqueFromGrades = [...new Set(fromGrades)].sort((a, b) => a - b);
    const uniqueToGrades = [...new Set(toGrades)].sort((a, b) => a - b);
    
    if (cgpa === 0) {
        return {
            originalCGPA: 0,
            convertedCGPA: 0,
            fromSystem: fromSystem,
            toSystem: toSystem,
            method: 'Zero Value',
            fromGrades: uniqueFromGrades,
            toGrades: uniqueToGrades,
            closestMatch: null
        };
    }
    
    // Find closest match
    let convertedCGPA = 0;
    let minDifference = Infinity;
    let closestFromGrade = 0;
    let closestToGrade = 0;
    
    uniqueToGrades.forEach(targetGp => {
        uniqueFromGrades.forEach(fromGp => {
            const diff = Math.abs(cgpa - fromGp);
            if (diff < minDifference) {
                minDifference = diff;
                convertedCGPA = targetGp;
                closestFromGrade = fromGp;
                closestToGrade = targetGp;
            }
        });
    });
    
    let method = 'Direct Value Mapping';
    
    // If no exact match found, use proportional
    if (convertedCGPA === 0 && cgpa > 0) {
        const fromMax = Math.max(...uniqueFromGrades);
        const toMax = Math.max(...uniqueToGrades);
        const proportionalValue = (cgpa / fromMax) * toMax;
        
        let closestTarget = 0;
        let closestDiff = Infinity;
        uniqueToGrades.forEach(targetGp => {
            const diff = Math.abs(proportionalValue - targetGp);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestTarget = targetGp;
            }
        });
        convertedCGPA = closestTarget;
        method = 'Proportional (Fallback)';
    }
    
    return {
        originalCGPA: cgpa,
        convertedCGPA: Math.round(convertedCGPA * 100) / 100,
        fromSystem: fromSystem,
        toSystem: toSystem,
        method: method,
        fromGrades: uniqueFromGrades,
        toGrades: uniqueToGrades,
        closestMatch: {
            fromGrade: closestFromGrade,
            toGrade: closestToGrade,
            difference: minDifference
        },
        proportionalValue: method === 'Proportional (Fallback)' ? convertedCGPA : null
    };
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

/**
 * Get max grade point for a system
 * @param {string} systemName - Grading system name
 * @returns {number} Maximum grade point
 */
function getMaxGradePoint(systemName) {
    const scale = GRADING_SYSTEMS[systemName];
    if (!scale) return 0;
    return Math.max(...Object.values(scale));
}

/**
 * Get min grade point for a system
 * @param {string} systemName - Grading system name
 * @returns {number} Minimum grade point
 */
function getMinGradePoint(systemName) {
    const scale = GRADING_SYSTEMS[systemName];
    if (!scale) return 0;
    return Math.min(...Object.values(scale));
}

/**
 * Get grade letter for a specific grade point in a system
 * @param {number} gradePoint - Grade point value
 * @param {string} systemName - Grading system name
 * @returns {string} Grade letter
 */
function getGradeLetter(gradePoint, systemName) {
    const scale = GRADING_SYSTEMS[systemName];
    if (!scale) return '';
    
    let closestGrade = Object.keys(scale)[0];
    let minDifference = Infinity;
    
    Object.entries(scale).forEach(([grade, point]) => {
        const diff = Math.abs(gradePoint - point);
        if (diff < minDifference) {
            minDifference = diff;
            closestGrade = grade;
        }
    });
    
    return closestGrade;
}

// Make functions globally available
window.convertCGPA = convertCGPA;
window.convertGrade = convertGrade;
window.convertCGPAWithDetails = convertCGPAWithDetails;
window.getGradingSystems = getGradingSystems;
window.getGradePoints = getGradePoints;
window.getMaxGradePoint = getMaxGradePoint;
window.getMinGradePoint = getMinGradePoint;
window.getGradeLetter = getGradeLetter;

// Export for module usage
export { 
    convertCGPA, 
    convertGrade, 
    convertCGPAWithDetails,
    getGradingSystems, 
    getGradePoints,
    getMaxGradePoint,
    getMinGradePoint,
    getGradeLetter
};
