// assets/js/studentInfo.js

/**
 * Student Information Management
 * Stores and manages all student-related data for transcript
 */

// Default student info structure
const defaultStudentInfo = {
    name: '',
    institution: '',
    board: '',
    subject: '',
    roll: '',
    registration: '',
    examName: '',
    examYear: new Date().getFullYear().toString(),
    session: ''
};

// Current student info state
let studentInfo = { ...defaultStudentInfo };

/**
 * Get all student information
 * @returns {Object} Student info object
 */
function getStudentInfo() {
    return { ...studentInfo };
}

/**
 * Get a specific student field
 * @param {string} field - Field name (name, institution, board, etc.)
 * @returns {string} Field value
 */
function getStudentField(field) {
    return studentInfo[field] || '';
}

/**
 * Update student information
 * @param {Object} newData - Object with fields to update
 */
function updateStudentInfo(newData) {
    studentInfo = { ...studentInfo, ...newData };
    saveStudentInfo();
    updateStudentInfoUI();
}

/**
 * Set a single student field
 * @param {string} field - Field name
 * @param {string} value - Field value
 */
function setStudentField(field, value) {
    if (field in studentInfo) {
        studentInfo[field] = value;
        saveStudentInfo();
        updateStudentInfoUI();
    }
}

/**
 * Reset student info to default
 */
function resetStudentInfo() {
    studentInfo = { ...defaultStudentInfo };
    saveStudentInfo();
    updateStudentInfoUI();
}

/**
 * Save student info to localStorage
 */
function saveStudentInfo() {
    try {
        localStorage.setItem('marsCalStudentInfo', JSON.stringify(studentInfo));
    } catch (e) {
        console.warn('Could not save student info:', e);
    }
}

/**
 * Load student info from localStorage
 */
function loadStudentInfo() {
    try {
        const data = localStorage.getItem('marsCalStudentInfo');
        if (data) {
            const parsed = JSON.parse(data);
            studentInfo = { ...defaultStudentInfo, ...parsed };
            updateStudentInfoUI();
            return true;
        }
    } catch (e) {
        console.warn('Could not load student info:', e);
    }
    return false;
}

/**
 * Update UI with current student info
 */
function updateStudentInfoUI() {
    // Update all input fields with current values
    const fields = ['name', 'institution', 'board', 'subject', 'roll', 'registration', 'examName', 'examYear', 'session'];
    
    fields.forEach(field => {
        const input = document.getElementById(`student-${field}`);
        if (input) {
            input.value = studentInfo[field] || '';
        }
    });
}

/**
 * Collect student info from UI inputs
 */
function collectStudentInfoFromUI() {
    const fields = ['name', 'institution', 'board', 'subject', 'roll', 'registration', 'examName', 'examYear', 'session'];
    
    fields.forEach(field => {
        const input = document.getElementById(`student-${field}`);
        if (input) {
            studentInfo[field] = input.value || '';
        }
    });
    
    saveStudentInfo();
    return { ...studentInfo };
}

/**
 * Get student info formatted for transcript
 * @returns {Object} Formatted student info
 */
function getFormattedStudentInfo() {
    return {
        fullName: studentInfo.name || 'Not Provided',
        institution: studentInfo.institution || 'Not Provided',
        board: studentInfo.board || 'Not Provided',
        subject: studentInfo.subject || 'Not Provided',
        roll: studentInfo.roll || 'Not Provided',
        registration: studentInfo.registration || 'Not Provided',
        examName: studentInfo.examName || 'Not Provided',
        examYear: studentInfo.examYear || 'Not Provided',
        session: studentInfo.session || 'Not Provided'
    };
}

/**
 * Validate student info
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateStudentInfo() {
    const errors = [];
    const required = ['name', 'institution', 'roll'];
    
    required.forEach(field => {
        if (!studentInfo[field] || studentInfo[field].trim() === '') {
            errors.push(`${field} is required`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Initialize - load saved data
loadStudentInfo();

// Make functions globally available
window.getStudentInfo = getStudentInfo;
window.getStudentField = getStudentField;
window.updateStudentInfo = updateStudentInfo;
window.setStudentField = setStudentField;
window.resetStudentInfo = resetStudentInfo;
window.saveStudentInfo = saveStudentInfo;
window.loadStudentInfo = loadStudentInfo;
window.collectStudentInfoFromUI = collectStudentInfoFromUI;
window.getFormattedStudentInfo = getFormattedStudentInfo;
window.validateStudentInfo = validateStudentInfo;
window.updateStudentInfoUI = updateStudentInfoUI;

// Export for module usage
export {
    studentInfo,
    getStudentInfo,
    getStudentField,
    updateStudentInfo,
    setStudentField,
    resetStudentInfo,
    saveStudentInfo,
    loadStudentInfo,
    collectStudentInfoFromUI,
    getFormattedStudentInfo,
    validateStudentInfo,
    updateStudentInfoUI
};
