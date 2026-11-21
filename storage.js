// assets/js/storage.js
const STORAGE_KEY = 'acadcalc_data';

function saveToStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Storage error', e);
    }
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

function clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
}

export { saveToStorage, loadFromStorage, clearStorage };