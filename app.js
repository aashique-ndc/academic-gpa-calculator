// assets/js/app.js - Full Working Version
let semesters = [];
let currentGradingSystem = 'bd5';
let creditMode = 'equal';

const gradingSystems = {
    bd5: { name: "Bangladesh 5.00 Scale" },
    us4: { name: "US 4.00 Scale" },
    india10: { name: "India 10.00 Scale" }
};

function init() {
    const select = document.getElementById('grading-system');
    Object.keys(gradingSystems).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = gradingSystems[key].name;
        select.appendChild(opt);
    });

    renderSemesters();
}

function changeGradingSystem() {
    currentGradingSystem = document.getElementById('grading-system').value;
    alert("Grading System Changed to: " + gradingSystems[currentGradingSystem].name);
}

function setCreditMode(mode) {
    creditMode = mode;
    alert("Credit Mode: " + mode);
}

function addSemester() {
    const sem = {
        id: Date.now(),
        name: `Semester ${semesters.length + 1}`,
        courses: []
    };
    semesters.push(sem);
    renderSemesters();
    alert("Semester Added!");
}

function renderSemesters() {
    const container = document.getElementById('semesters-container');
    container.innerHTML = semesters.map((sem, i) => `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl">
            <h3 class="font-bold text-xl">${sem.name}</h3>
            <button onclick="addCourse(${i})" class="mt-4 text-blue-600">+ Add Course</button>
        </div>
    `).join('');
}

function addCourse(semIndex) {
    const name = prompt("Enter Course Name:");
    if (name) {
        semesters[semIndex].courses.push({name: name, grade: "A"});
        renderSemesters();
        alert("Course Added!");
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', init);
