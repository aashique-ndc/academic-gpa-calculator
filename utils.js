// assets/js/utils.js
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-2 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'} toast-slide`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function calculateGradePoint(percentage, gradingSystem) {
    const system = gradingSystems[gradingSystem] || gradingSystems.bd5;
    for (let grade of system.grades) {
        if (percentage >= grade.minPercent) {
            return grade.point;
        }
    }
    return 0;
}

function formatGPA(gpa) {
    return gpa.toFixed(2);
}

export { showToast, calculateGradePoint, formatGPA };