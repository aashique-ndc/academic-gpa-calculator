// assets/js/calculator.js
let currentSemesters = [];

function calculateSGPA(semester) {
    let totalPoints = 0;
    let totalCredits = 0;

    semester.courses.forEach(course => {
        const credits = parseFloat(course.credits) || 3;
        totalPoints += course.gradePoint * credits;
        totalCredits += credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

function calculateCGPA(semesters) {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(sem => {
        const sgpa = calculateSGPA(sem);
        const semCredits = sem.courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 3), 0);
        totalPoints += sgpa * semCredits;
        totalCredits += semCredits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export { calculateSGPA, calculateCGPA, currentSemesters };