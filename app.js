// assets/js/app.js
import { gradingSystems } from './gradingData.js';
import { showToast } from './utils.js';
import { loadFromStorage, saveToStorage } from './storage.js';
import { showTab } from './ui.js';

let semesters = [];
let currentGradingSystem = 'bd5';
let creditMode = 'equal';

function init() {
    // Populate grading systems
    const select = document.getElementById('grading-system');
    Object.keys(gradingSystems).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = gradingSystems[key].name;
        select.appendChild(option);
    });

    // Load saved data
    const saved = loadFromStorage();
    if (saved) {
        semesters = saved.semesters || [];
        renderSemesters();
    }

    showTab(0);
    updateSummary();
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
    showToast('Semester added');
}

function renderSemesters() {
    const container = document.getElementById('semesters-container');
    container.innerHTML = '';
    
    semesters.forEach((sem, index) => {
        const div = document.createElement('div');
        div.className = 'bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm semester-card';
        div.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <input value="${sem.name}" class="bg-transparent font-semibold text-lg focus:outline-none">
                <button onclick="deleteSemester(${index})" class="text-red-500 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <!-- Courses will be added here -->
        `;
        container.appendChild(div);
    });
}

function updateSummary() {
    const cgpa = document.getElementById('cgpa-display');
    if (cgpa) cgpa.textContent = '3.75'; // Demo
}

window.addSemester = addSemester;
window.deleteSemester = (index) => {
    semesters.splice(index, 1);
    renderSemesters();
    saveToStorage({ semesters });
};

// Initialize app
document.addEventListener('DOMContentLoaded', init);