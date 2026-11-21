// assets/js/converter.js
import { gradingSystems } from './gradingData.js';

/**
 * Convert a single course grade using Upper Bound Percentage
 * Example: Pakistan A- (3.67) → maxPercent: 84% → USA → B+ (3.30)
 */
export function convertCourseGrade(grade, fromSystem, toSystem, credit = 1) {
    const fromScale = gradingSystems[fromSystem];
    const toScale = gradingSystems[toSystem];
    
    if (!fromScale || !toScale) {
        return { 
            originalGrade: grade, 
            convertedGrade: grade, 
            percentage: null,
            fromGradePoint: null,
            toGradePoint: null
        };
    }

    // Find the grade in source system
    const fromGrade = fromScale.grades.find(g => g.letter === grade);
    if (!fromGrade) {
        return { 
            originalGrade: grade, 
            convertedGrade: grade, 
            percentage: null,
            fromGradePoint: null,
            toGradePoint: null
        };
    }

    // STEP 1: Get UPPER BOUND percentage (maxPercent)
    const percentage = fromGrade.maxPercent;
    
    // STEP 2: Find target grade based on this percentage
    let targetGrade = null;
    let targetPoint = 0;
    
    // First try exact range match
    for (const g of toScale.grades) {
        if (percentage >= g.minPercent && percentage <= g.maxPercent) {
            targetGrade = g.letter;
            targetPoint = g.point;
            break;
        }
    }
    
    // If no exact range match, find closest by maxPercent
    if (!targetGrade) {
        let minDiff = Infinity;
        for (const g of toScale.grades) {
            const diff = Math.abs(percentage - g.maxPercent);
            if (diff < minDiff) {
                minDiff = diff;
                targetGrade = g.letter;
                targetPoint = g.point;
            }
        }
    }
    
    return {
        originalGrade: grade,
        convertedGrade: targetGrade,
        percentage: percentage,
        fromGradePoint: fromGrade.point,
        toGradePoint: targetPoint,
        credit: credit,
        fromMaxPercent: fromGrade.maxPercent,
        fromMinPercent: fromGrade.minPercent,
        toMaxPercent: toScale.grades.find(g => g.letter === targetGrade)?.maxPercent || null,
        toMinPercent: toScale.grades.find(g => g.letter === targetGrade)?.minPercent || null
    };
}

/**
 * Convert all courses in a semester
 */
export function convertSemesterCourses(courses, fromSystem, toSystem) {
    if (!courses || courses.length === 0) return [];
    
    return courses.map(course => {
        const converted = convertCourseGrade(course.grade, fromSystem, toSystem, course.credit || 1);
        return {
            ...course,
            originalGrade: course.grade,
            convertedGrade: converted.convertedGrade,
            percentage: converted.percentage,
            fromGradePoint: converted.fromGradePoint,
            toGradePoint: converted.toGradePoint
        };
    });
}

/**
 * Calculate GPA from courses
 */
export function calculateGPA(courses, system) {
    if (!courses || courses.length === 0) return 0;
    
    const scale = gradingSystems[system];
    if (!scale) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const gradeData = scale.grades.find(g => g.letter === course.grade);
        if (gradeData) {
            totalPoints += gradeData.point * (course.credit || 1);
            totalCredits += (course.credit || 1);
        }
    });
    
    return totalCredits === 0 ? 0 : Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Convert CGPA using course-by-course conversion
 */
export function convertCGPA(cgpa, fromSystem, toSystem, courses = null) {
    // If courses provided, convert each course and recalculate
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
    const fromScale = gradingSystems[fromSystem];
    const toScale = gradingSystems[toSystem];
    
    if (!fromScale || !toScale) return cgpa;
    
    // Find which grade the CGPA corresponds to
    let percentage = 0;
    for (const g of fromScale.grades) {
        if (Math.abs(g.point - cgpa) < 0.01) {
            percentage = g.maxPercent;
            break;
        }
    }
    
    if (percentage === 0) return cgpa;
    
    // Find target grade based on percentage
    let targetPoint = 0;
    for (const g of toScale.grades) {
        if (percentage >= g.minPercent && percentage <= g.maxPercent) {
            targetPoint = g.point;
            break;
        }
    }
    
    // If no exact match, find closest
    if (targetPoint === 0) {
        let minDiff = Infinity;
        for (const g of toScale.grades) {
            const diff = Math.abs(percentage - g.maxPercent);
            if (diff < minDiff) {
                minDiff = diff;
                targetPoint = g.point;
            }
        }
    }
    
    return Math.round(targetPoint * 100) / 100;
}

/**
 * Convert a single grade (letter)
 */
export function convertGrade(grade, fromSystem, toSystem) {
    const result = convertCourseGrade(grade, fromSystem, toSystem);
    return result.convertedGrade;
}

// Make globally available
window.convertCourseGrade = convertCourseGrade;
window.convertSemesterCourses = convertSemesterCourses;
window.convertCGPA = convertCGPA;
window.convertGrade = convertGrade;
window.calculateGPA = calculateGPA;

export { 
    convertCourseGrade, 
    convertSemesterCourses,
    convertCGPA, 
    convertGrade,
    calculateGPA
};
