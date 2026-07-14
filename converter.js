// assets/js/converter.js
import { gradingSystems } from './gradingData.js';

/**
 * Convert a single course grade using Upper Bound Percentage
 */
export function convertCourseGrade(grade, fromSystem, toSystem, credit = 1) {
    const fromScale = gradingSystems[fromSystem];
    const toScale = gradingSystems[toSystem];
    
    if (!fromScale || !toScale) {
        return { originalGrade: grade, convertedGrade: grade, percentage: null };
    }

    // Find the grade in source system
    const fromGrade = fromScale.grades.find(g => g.letter === grade);
    if (!fromGrade) {
        return { originalGrade: grade, convertedGrade: grade, percentage: null };
    }

    // STEP 1: Get UPPER BOUND percentage
    const percentage = fromGrade.maxPercent;
    
    // STEP 2: Find target grade based on percentage
    let targetGrade = null;
    let targetPoint = 0;
    
    for (const g of toScale.grades) {
        if (percentage >= g.minPercent && percentage <= g.maxPercent) {
            targetGrade = g.letter;
            targetPoint = g.point;
            break;
        }
    }
    
    // If no exact range match, find closest
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
        credit: credit
    };
}

/**
 * Convert CGPA (if courses provided)
 */
export function convertCGPA(cgpa, fromSystem, toSystem, courses = null) {
    if (courses && courses.length > 0) {
        let totalPoints = 0;
        let totalCredits = 0;
        
        courses.forEach(course => {
            const converted = convertCourseGrade(course.grade, fromSystem, toSystem, course.credit || 1);
            totalPoints += converted.toGradePoint * (course.credit || 1);
            totalCredits += (course.credit || 1);
        });
        
        return totalCredits === 0 ? 0 : Math.round((totalPoints / totalCredits) * 100) / 100;
    }
    
    // Fallback: Direct conversion
    const fromScale = gradingSystems[fromSystem];
    const toScale = gradingSystems[toSystem];
    
    if (!fromScale || !toScale) return cgpa;
    
    // Find percentage from CGPA
    let percentage = 0;
    for (const g of fromScale.grades) {
        if (Math.abs(g.point - cgpa) < 0.01) {
            percentage = g.maxPercent;
            break;
        }
    }
    
    if (percentage === 0) return cgpa;
    
    // Find target grade point
    let targetPoint = 0;
    for (const g of toScale.grades) {
        if (percentage >= g.minPercent && percentage <= g.maxPercent) {
            targetPoint = g.point;
            break;
        }
    }
    
    return Math.round(targetPoint * 100) / 100;
}

export function convertGrade(grade, fromSystem, toSystem) {
    const result = convertCourseGrade(grade, fromSystem, toSystem);
    return result.convertedGrade;
}

// Make globally available
window.convertCourseGrade = convertCourseGrade;
window.convertCGPA = convertCGPA;
window.convertGrade = convertGrade;
