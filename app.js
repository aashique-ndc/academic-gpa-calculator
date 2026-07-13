// assets/js/app.js
import { gradingSystems } from './gradingData.js';
import { showToast } from './utils.js';
import { loadFromStorage, saveToStorage } from './storage.js';
import { showTab, toggleTheme } from './ui.js';

let semesters = [];
let currentGradingSystem = 'bd5';
let creditMode = 'equal';

function init() {
    // Populate grading systems
    const select = document.getElementById('grading-system');
    if (select) {
        Object.keys(gradingSystems).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = gradingSystems[key].name;
            select.appendChild(option);
        });
        select.value = currentGradingSystem;
    }

    // Load saved data
    const saved = loadFromStorage();
    if (saved && saved.semesters) {
        semesters = saved.semesters;
    }

    renderSemesters();
    showTab(0);
    updateSummary();
}

function changeGradingSystem() {
    const select = document.getElementById('grading-system');
    currentGradingSystem = select.value;
    showToast(`Grading system changed to ${gradingSystems[currentGradingSystem].name}`);
    saveToStorage({ semesters, currentGradingSystem });
}

function setCreditMode(mode) {
    creditMode = mode;
    document.getElementById('equal-btn').classList.toggle('border-blue-600', mode === 'equal');
    document.getElementById('variable-btn').classList.toggle('border-blue-600', mode === 'variable');
    showToast(`Credit mode: ${mode}`);
}

function addSemester() {
    const newSemester = {
        id: Date.now(),
        name: `Semester ${semesters.length + 1}`,
        courses: []
    };
    semesters.push(newSemester);
    renderSemesters();
    saveToStorage({ semesters });
    showToast('New semester added successfully!');
}

function renderSemesters() {
    const container = document.getElementById('semesters-container');
    if (!container) return;
    
    container.innerHTML = '';

    semesters.forEach((sem, index) => {
        const div = document.createElement('div');
        div.className = 'bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm';
        div.innerHTML = `
            <div class="flex justify-between mb-4">
                <input value="${sem.name}" 
                       onblur="updateSemesterName(${index}, this.value)"
                       class="bg-transparent font-semibold text-lg focus:outline-none border-b">
                <button onclick="deleteSemester(${index})" class="text-red-500 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <button onclick="addCourse(${index})" 
                    class="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                <i class="fas fa-plus"></i> Add Course
            </button>
        `;
        container.appendChild(div);
    });
}

function updateSemesterName(index, newName) {
    semesters[index].name = newName || `Semester ${index + 1}`;
    saveToStorage({ semesters });
}

function deleteSemester(index) {
    if (confirm('Delete this semester?')) {
        semesters.splice(index, 1);
        renderSemesters();
        saveToStorage({ semesters });
        showToast('Semester deleted');
    }
}

function addCourse(semIndex) {
    const courseName = prompt("Course Name:");
    if (!courseName) return;
    
    semesters[semIndex].courses.push({
        name: courseName,
        grade: "A",
        credits: creditMode === 'equal' ? 3 : 3
    });
    renderSemesters();
    saveToStorage({ semesters });
    showToast('Course added');
}

function updateSummary() {
    const cgpaEl = document.getElementById('cgpa-display');
    if (cgpaEl) cgpaEl.textContent = "3.75";
}

// Make functions global
window.changeGradingSystem = changeGradingSystem;
window.setCreditMode = setCreditMode;
window.addSemester = addSemester;
window.deleteSemester = deleteSemester;
window.addCourse = addCourse;
window.updateSemesterName = updateSemesterName;
window.toggleTheme = toggleTheme;

// Initialize
document.addEventListener('DOMContentLoaded', init);
