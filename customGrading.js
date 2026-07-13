// assets/js/customGrading.js
let customProfiles = [];

function createCustomProfile(name, maxGPA, grades) {
    const profile = {
        id: Date.now(),
        name,
        maxGPA,
        grades
    };
    customProfiles.push(profile);
    saveToStorage({ customProfiles });
    showToast('Custom profile created');
    return profile;
}

export { createCustomProfile, customProfiles };