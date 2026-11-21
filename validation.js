// assets/js/validation.js
function validateCourse(course) {
    if (!course.name || !course.grade) {
        showToast('Course name and grade are required', 'error');
        return false;
    }
    if (course.credits && parseFloat(course.credits) <= 0) {
        showToast('Credits must be greater than 0', 'error');
        return false;
    }
    return true;
}

function isDuplicateCourse(semester, courseName) {
    return semester.courses.some(c => c.name.toLowerCase() === courseName.toLowerCase());
}

export { validateCourse, isDuplicateCourse };