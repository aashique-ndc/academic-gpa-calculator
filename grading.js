// assets/js/grading.js
function getGradeFromPoint(point, systemId) {
    const system = gradingSystems[systemId];
    if (!system) return 'F';
    
    for (let grade of system.grades) {
        if (point >= grade.point) return grade.letter;
    }
    return 'F';
}

export { getGradeFromPoint };