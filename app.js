// assets/js/app.js
import { gradingSystems } from './gradingData.js';
import { convertCGPA, convertGrade, convertCourseGrade, calculateGPA } from './converter.js';
import { getStudentInfo, collectStudentInfoFromUI, updateStudentInfoUI } from './studentInfo.js';

let semesters = [];
let currentGradingSystem = 'bd4';
let creditMode = 'equal';
let semesterCounter = 0;
let pieChartInstance = null;
let lineChartInstance = null;

// Make functions and data globally available
window.convertCGPA = convertCGPA;
window.convertGrade = convertGrade;
window.convertCourseGrade = convertCourseGrade;
window.calculateGPA = calculateGPA;
window.gradingSystems = gradingSystems;
window.semesters = semesters;
window.currentGradingSystem = currentGradingSystem;
window.creditMode = creditMode;
window.calculateCGPA = calculateCGPA;
window.calculateSemesterGPA = calculateSemesterGPA;
window.totalCreditsAll = totalCreditsAll;

function init() {
    // Populate grading system dropdown
    const select = document.getElementById('grading-system');
    if (select) {
        select.innerHTML = '';
        Object.keys(gradingSystems).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = gradingSystems[key].name;
            select.appendChild(opt);
        });
        select.value = currentGradingSystem;
        select.addEventListener('change', changeGradingSystem);
    }

    // Load saved data
    loadState();
    
    // Load student info from localStorage
    if (typeof loadStudentInfo === 'function') {
        loadStudentInfo();
    }
    
    // Render
    renderSemesters();
    updateSummary();
    populateConvertTarget();
    updateCharts();
    
    // Auto-save student info on input change
    document.querySelectorAll('[id^="student-"]').forEach(input => {
        input.addEventListener('change', function() {
            if (typeof collectStudentInfoFromUI === 'function') {
                collectStudentInfoFromUI();
            }
        });
        input.addEventListener('keyup', function() {
            if (typeof collectStudentInfoFromUI === 'function') {
                collectStudentInfoFromUI();
            }
        });
    });
}

function changeGradingSystem() {
    currentGradingSystem = document.getElementById('grading-system').value;
    window.currentGradingSystem = currentGradingSystem;
    renderSemesters();
    updateSummary();
    populateConvertTarget();
    updateCharts();
    saveState();
}

function setCreditMode(mode) {
    creditMode = mode;
    window.creditMode = creditMode;
    document.getElementById('equal-btn').className = `flex-1 py-4 rounded-2xl border-2 font-medium transition-all ${mode === 'equal' ? 'border-blue-500 text-blue-600' : 'border-gray-300 dark:border-gray-600'}`;
    document.getElementById('variable-btn').className = `flex-1 py-4 rounded-2xl border-2 font-medium transition-all ${mode === 'variable' ? 'border-blue-500 text-blue-600' : 'border-gray-300 dark:border-gray-600'}`;
    renderSemesters();
    saveState();
}

function addSemester() {
    semesters.push({
        id: semesterCounter++,
        name: `Semester ${semesters.length + 1}`,
        courses: []
    });
    window.semesters = semesters;
    renderSemesters();
    updateSummary();
    updateCharts();
    saveState();
}

function removeSemester(index) {
    if (semesters.length <= 1) {
        showToast('At least one semester required');
        return;
    }
    semesters.splice(index, 1);
    window.semesters = semesters;
    renderSemesters();
    updateSummary();
    updateCharts();
    saveState();
}

function addCourse(semIndex) {
    if (!semesters[semIndex]) return;
    const scale = gradingSystems[currentGradingSystem];
    const firstGrade = scale.grades.length > 0 ? scale.grades[0].letter : 'A';
    semesters[semIndex].courses.push({
        name: 'New Course',
        grade: firstGrade,
        credit: 3
    });
    window.semesters = semesters;
    renderSemesters();
    updateSummary();
    updateCharts();
    saveState();
}

function removeCourse(semIndex, courseIndex) {
    if (!semesters[semIndex]) return;
    semesters[semIndex].courses.splice(courseIndex, 1);
    window.semesters = semesters;
    renderSemesters();
    updateSummary();
    updateCharts();
    saveState();
}

function renderSemesters() {
    const container = document.getElementById('semesters-container');
    if (!container) return;
    
    container.innerHTML = '';
    semesters.forEach((sem, semIdx) => {
        const div = document.createElement('div');
        div.className = 'bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-200 dark:border-gray-700';
        const semGPA = calculateSemesterGPA(sem.courses);
        
        div.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <i class="fas fa-grip-vertical text-gray-400 cursor-grab handle"></i>
                    <span class="font-semibold">${sem.name}</span>
                    <input type="text" value="${sem.name}" 
                           class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1 text-sm w-36 focus:outline-none focus:border-blue-500"
                           onchange="updateSemesterName(${semIdx}, this.value)">
                </div>
                <div class="flex gap-2">
                    <span class="text-sm text-gray-500">GPA: <strong>${semGPA.toFixed(2)}</strong></span>
                    <button onclick="removeSemester(${semIdx})" class="text-gray-400 hover:text-red-500"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="space-y-3">
                ${sem.courses.map((course, cIdx) => `
                    <div class="flex items-center gap-3">
                        <input type="text" value="${course.name}" 
                               class="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                               onchange="updateCourseName(${semIdx}, ${cIdx}, this.value)">
                        <select class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none grade-select"
                                onchange="updateCourseGrade(${semIdx}, ${cIdx}, this.value)">
                            ${gradingSystems[currentGradingSystem].grades.map(g => 
                                `<option value="${g.letter}" ${course.grade === g.letter ? 'selected' : ''}>${g.letter} (${g.point})</option>`
                            ).join('')}
                        </select>
                        ${creditMode === 'variable' ? `
                            <input type="number" value="${course.credit || 3}" min="0.5" step="0.5" 
                                   class="w-16 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-sm focus:outline-none credit-input"
                                   onchange="updateCourseCredit(${semIdx}, ${cIdx}, this.value)">
                        ` : ''}
                        <button onclick="removeCourse(${semIdx}, ${cIdx})" class="text-gray-400 hover:text-red-500"><i class="fas fa-times"></i></button>
                    </div>
                `).join('')}
            </div>
            <button onclick="addCourse(${semIdx})" class="mt-3 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-2">
                <i class="fas fa-plus"></i> Add Course
            </button>
        `;
        container.appendChild(div);
    });
    
    // Initialize Sortable for drag reorder
    if (typeof Sortable !== 'undefined') {
        Sortable.create(container, {
            handle: '.handle',
            animation: 200,
            onEnd: function(evt) {
                const [removed] = semesters.splice(evt.oldIndex, 1);
                semesters.splice(evt.newIndex, 0, removed);
                window.semesters = semesters;
                renderSemesters();
                updateSummary();
                updateCharts();
                saveState();
            }
        });
    }
    
    updateSummary();
    updateCharts();
}

function calculateSemesterGPA(courses) {
    if (!courses || courses.length === 0) return 0;
    const scale = gradingSystems[currentGradingSystem];
    let totalPoints = 0, totalCredits = 0;
    courses.forEach(course => {
        const gradeData = scale.grades.find(g => g.letter === course.grade);
        if (gradeData) {
            const credit = creditMode === 'equal' ? 1 : (course.credit || 3);
            totalPoints += gradeData.point * credit;
            totalCredits += credit;
        }
    });
    return totalCredits === 0 ? 0 : Math.round((totalPoints / totalCredits) * 100) / 100;
}

function calculateCGPA() {
    let totalPoints = 0, totalCredits = 0;
    const scale = gradingSystems[currentGradingSystem];
    semesters.forEach(sem => {
        sem.courses.forEach(course => {
            const gradeData = scale.grades.find(g => g.letter === course.grade);
            if (gradeData) {
                const credit = creditMode === 'equal' ? 1 : (course.credit || 3);
                totalPoints += gradeData.point * credit;
                totalCredits += credit;
            }
        });
    });
    return totalCredits === 0 ? 0 : Math.round((totalPoints / totalCredits) * 100) / 100;
}

function totalCreditsAll() {
    let sum = 0;
    semesters.forEach(sem => {
        sem.courses.forEach(course => {
            sum += creditMode === 'equal' ? 1 : (course.credit || 3);
        });
    });
    return sum;
}

function updateSummary() {
    const cgpa = calculateCGPA();
    document.getElementById('cgpa-display').textContent = cgpa.toFixed(2);
    document.getElementById('total-credits').textContent = totalCreditsAll();
    document.getElementById('current-cgpa-display').textContent = cgpa.toFixed(2);
    document.getElementById('current-scale-display').textContent = gradingSystems[currentGradingSystem].name;
}

function populateConvertTarget() {
    const targetSelect = document.getElementById('convert-target');
    if (!targetSelect) return;
    targetSelect.innerHTML = '';
    Object.keys(gradingSystems).forEach(key => {
        if (key !== currentGradingSystem) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = gradingSystems[key].name;
            targetSelect.appendChild(option);
        }
    });
}

function convertResult() {
    const cgpa = calculateCGPA();
    const targetSystem = document.getElementById('convert-target').value;
    
    if (!targetSystem) {
        showToast('Please select a target system');
        return;
    }
    
    const allCourses = [];
    semesters.forEach(sem => {
        sem.courses.forEach(course => {
            allCourses.push({
                grade: course.grade,
                credit: course.credit || 3
            });
        });
    });
    
    const convertedCGPA = convertCGPA(cgpa, currentGradingSystem, targetSystem, allCourses);
    
    let detailsHTML = '<div class="mt-2">';
    allCourses.forEach((course, i) => {
        const converted = convertCourseGrade(course.grade, currentGradingSystem, targetSystem, course.credit || 1);
        detailsHTML += `
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Course ${i+1}: ${course.grade} → ${converted.percentage}% → ${converted.convertedGrade}
            </div>
        `;
    });
    detailsHTML += '</div>';
    
    document.getElementById('converted-cgpa').textContent = convertedCGPA.toFixed(2);
    document.getElementById('target-scale-name').textContent = gradingSystems[targetSystem].name;
    document.getElementById('conversion-result').classList.remove('hidden');
    document.getElementById('conversion-details').innerHTML = detailsHTML;
    
    showToast(`Converted to ${gradingSystems[targetSystem].name}: ${convertedCGPA.toFixed(2)}`);
}

function updateSemesterName(index, name) {
    if (semesters[index]) {
        semesters[index].name = name;
        window.semesters = semesters;
        saveState();
    }
}

function updateCourseName(semIndex, courseIndex, name) {
    if (semesters[semIndex] && semesters[semIndex].courses[courseIndex]) {
        semesters[semIndex].courses[courseIndex].name = name;
        window.semesters = semesters;
        saveState();
    }
}

function updateCourseGrade(semIndex, courseIndex, grade) {
    if (semesters[semIndex] && semesters[semIndex].courses[courseIndex]) {
        semesters[semIndex].courses[courseIndex].grade = grade;
        window.semesters = semesters;
        renderSemesters();
        updateSummary();
        updateCharts();
        saveState();
    }
}

function updateCourseCredit(semIndex, courseIndex, credit) {
    if (semesters[semIndex] && semesters[semIndex].courses[courseIndex]) {
        semesters[semIndex].courses[courseIndex].credit = parseFloat(credit) || 3;
        window.semesters = semesters;
        renderSemesters();
        updateSummary();
        saveState();
    }
}

// ============================================================
// CHARTS
// ============================================================
function updateCharts() {
    // Pie Chart: Grade Distribution
    const gradeCount = {};
    semesters.forEach(sem => {
        sem.courses.forEach(c => {
            const g = c.grade || 'A';
            gradeCount[g] = (gradeCount[g] || 0) + 1;
        });
    });
    const labels = Object.keys(gradeCount);
    const data = Object.values(gradeCount);
    const colors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#ef4444','#6366f1','#14b8a6','#f97316'];

    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        if (window.pieChartInstance) window.pieChartInstance.destroy();
        if (labels.length > 0) {
            window.pieChartInstance = new Chart(pieCtx, {
                type: 'pie',
                data: { labels, datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderColor: '#fff', borderWidth: 2 }] },
                options: { responsive: true }
            });
        }
    }

    // Line Chart: GPA Trend
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        if (window.lineChartInstance) window.lineChartInstance.destroy();
        const semGpas = semesters.map(sem => calculateSemesterGPA(sem.courses));
        if (semGpas.length > 0) {
            const maxVal = Math.max(4.5, ...semGpas.map(g => g + 0.5));
            window.lineChartInstance = new Chart(lineCtx, {
                type: 'line',
                data: { 
                    labels: semesters.map((_,i) => `Sem ${i+1}`), 
                    datasets: [{ 
                        label: 'GPA', 
                        data: semGpas, 
                        borderColor: '#3b82f6', 
                        backgroundColor: '#3b82f620', 
                        fill: true, 
                        tension: 0.3 
                    }] 
                },
                options: { 
                    responsive: true, 
                    scales: { y: { min: 0, max: Math.ceil(maxVal) } } 
                }
            });
        }
    }
}

// ============================================================
// TABS
// ============================================================
function showTab(index) {
    document.querySelectorAll('.tab-content').forEach((el, i) => {
        el.classList.toggle('hidden', i !== index);
    });
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    if (index === 1) {
        setTimeout(updateCharts, 100);
    }
    if (index === 2) {
        populateConvertTarget();
        updateSummary();
    }
}

// ============================================================
// STORAGE
// ============================================================
function saveState() {
    try {
        const data = { semesters, creditMode, currentGradingSystem };
        localStorage.setItem('marsCalState', JSON.stringify(data));
    } catch(e) {}
}

function loadState() {
    try {
        const raw = localStorage.getItem('marsCalState');
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (data.semesters) {
            semesters = data.semesters;
            window.semesters = semesters;
            semesterCounter = semesters.length;
        }
        if (data.creditMode) {
            creditMode = data.creditMode;
            window.creditMode = creditMode;
        }
        if (data.currentGradingSystem) {
            currentGradingSystem = data.currentGradingSystem;
            window.currentGradingSystem = currentGradingSystem;
            document.getElementById('grading-system').value = currentGradingSystem;
        }
        return true;
    } catch(e) { return false; }
}

// ============================================================
// MISC
// ============================================================
function toggleTheme() {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('#theme-toggle i');
    if (document.body.classList.contains('dark')) {
        icon.className = 'fas fa-sun text-xl';
    } else {
        icon.className = 'fas fa-moon text-xl';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    toast.classList.remove('hidden');
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.add('hidden'), 2500);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Make functions globally available
window.init = init;
window.addSemester = addSemester;
window.removeSemester = removeSemester;
window.addCourse = addCourse;
window.removeCourse = removeCourse;
window.changeGradingSystem = changeGradingSystem;
window.setCreditMode = setCreditMode;
window.showTab = showTab;
window.toggleTheme = toggleTheme;
window.convertResult = convertResult;
window.updateSemesterName = updateSemesterName;
window.updateCourseName = updateCourseName;
window.updateCourseGrade = updateCourseGrade;
window.updateCourseCredit = updateCourseCredit;
window.updateCharts = updateCharts;
window.saveState = saveState;
window.loadState = loadState;
window.showToast = showToast;
