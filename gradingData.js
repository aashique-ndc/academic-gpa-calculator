// assets/js/gradingData.js

const gradingSystems = {
    bd5: {
        id: "bd5",
        name: "Bangladesh (5.00 Scale)",
        maxGPA: 5.0,
        passing: 1.0,
        grades: [
            { letter: "A+", point: 5.00, minPercent: 80 },
            { letter: "A", point: 4.00, minPercent: 70 },
            { letter: "A-", point: 3.50, minPercent: 60 },
            { letter: "B", point: 3.00, minPercent: 50 },
            { letter: "C", point: 2.00, minPercent: 40 },
            { letter: "D", point: 1.00, minPercent: 33 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    bd4: {
        id: "bd4",
        name: "Bangladesh (4.00 Scale)",
        maxGPA: 4.0,
        passing: 2.0,
        grades: [
            { letter: "A+", point: 4.00, minPercent: 80 },
            { letter: "A", point: 3.75, minPercent: 75 },
            { letter: "A-", point: 3.50, minPercent: 70 },
            { letter: "B+", point: 3.25, minPercent: 65 },
            { letter: "B", point: 3.00, minPercent: 60 },
            { letter: "B-", point: 2.75, minPercent: 55 },
            { letter: "C+", point: 2.50, minPercent: 50 },
            { letter: "C", point: 2.25, minPercent: 45 },
            { letter: "D", point: 2.00, minPercent: 40 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    india10: {
        id: "india10",
        name: "India (10.00 Scale)",
        maxGPA: 10.0,
        passing: 4.0,
        grades: [
            { letter: "O", point: 10.00, minPercent: 90 },
            { letter: "A+", point: 9.00, minPercent: 80 },
            { letter: "A", point: 8.00, minPercent: 70 },
            { letter: "B+", point: 7.00, minPercent: 60 },
            { letter: "B", point: 6.00, minPercent: 55 },
            { letter: "C", point: 5.00, minPercent: 50 },
            { letter: "P", point: 4.00, minPercent: 40 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    pakistan4: {
        id: "pakistan4",
        name: "Pakistan (4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A", point: 4.00, minPercent: 85 },
            { letter: "A-", point: 3.67, minPercent: 80 },
            { letter: "B+", point: 3.33, minPercent: 75 },
            { letter: "B", point: 3.00, minPercent: 71 },
            { letter: "B-", point: 2.67, minPercent: 68 },
            { letter: "C+", point: 2.33, minPercent: 64 },
            { letter: "C", point: 2.00, minPercent: 61 },
            { letter: "C-", point: 1.67, minPercent: 58 },
            { letter: "D+", point: 1.33, minPercent: 54 },
            { letter: "D", point: 1.00, minPercent: 50 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    us4: {
        id: "us4",
        name: "United States (4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A", point: 4.00, minPercent: 90 },
            { letter: "A-", point: 3.70, minPercent: 87 },
            { letter: "B+", point: 3.30, minPercent: 83 },
            { letter: "B", point: 3.00, minPercent: 80 },
            { letter: "B-", point: 2.70, minPercent: 77 },
            { letter: "C+", point: 2.30, minPercent: 73 },
            { letter: "C", point: 2.00, minPercent: 70 },
            { letter: "C-", point: 1.70, minPercent: 67 },
            { letter: "D+", point: 1.30, minPercent: 65 },
            { letter: "D", point: 1.00, minPercent: 60 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    uk: {
        id: "uk",
        name: "United Kingdom (Honours Classification)",
        maxGPA: 100,
        passing: 40,
        grades: [
            { letter: "First Class", point: 70, minPercent: 70 },
            { letter: "Upper Second (2:1)", point: 60, minPercent: 60 },
            { letter: "Lower Second (2:2)", point: 50, minPercent: 50 },
            { letter: "Third Class", point: 40, minPercent: 40 },
            { letter: "Fail", point: 0, minPercent: 0 }
        ]
    },

    ects: {
        id: "ects",
        name: "Europe (ECTS)",
        maxGPA: 5,
        passing: 1,
        grades: [
            { letter: "A", point: 5, minPercent: 90 },
            { letter: "B", point: 4, minPercent: 80 },
            { letter: "C", point: 3, minPercent: 70 },
            { letter: "D", point: 2, minPercent: 60 },
            { letter: "E", point: 1, minPercent: 50 },
            { letter: "FX", point: 0, minPercent: 40 },
            { letter: "F", point: 0, minPercent: 0 }
        ]
    },

    japan4: {
        id: "japan4",
        name: "Japan (Common 4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "S", point: 4.00, minPercent: 90 },
            { letter: "A", point: 3.00, minPercent: 80 },
            { letter: "B", point: 2.00, minPercent: 70 },
            { letter: "C", point: 1.00, minPercent: 60 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    china4: {
        id: "china4",
        name: "China (Common 4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A", point: 4.00, minPercent: 90 },
            { letter: "A-", point: 3.70, minPercent: 85 },
            { letter: "B+", point: 3.30, minPercent: 82 },
            { letter: "B", point: 3.00, minPercent: 78 },
            { letter: "B-", point: 2.70, minPercent: 75 },
            { letter: "C+", point: 2.30, minPercent: 72 },
            { letter: "C", point: 2.00, minPercent: 68 },
            { letter: "C-", point: 1.70, minPercent: 64 },
            { letter: "D", point: 1.00, minPercent: 60 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    korea43: {
        id: "korea43",
        name: "South Korea (4.30 Scale)",
        maxGPA: 4.3,
        passing: 1.0,
        grades: [
            { letter: "A+", point: 4.30, minPercent: 95 },
            { letter: "A0", point: 4.00, minPercent: 90 },
            { letter: "A-", point: 3.70, minPercent: 85 },
            { letter: "B+", point: 3.30, minPercent: 80 },
            { letter: "B0", point: 3.00, minPercent: 75 },
            { letter: "B-", point: 2.70, minPercent: 70 },
            { letter: "C+", point: 2.30, minPercent: 65 },
            { letter: "C0", point: 2.00, minPercent: 60 },
            { letter: "C-", point: 1.70, minPercent: 55 },
            { letter: "D+", point: 1.30, minPercent: 50 },
            { letter: "D0", point: 1.00, minPercent: 45 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    malaysia4: {
        id: "malaysia4",
        name: "Malaysia (4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A+", point: 4.00, minPercent: 90 },
            { letter: "A", point: 4.00, minPercent: 80 },
            { letter: "A-", point: 3.70, minPercent: 75 },
            { letter: "B+", point: 3.30, minPercent: 70 },
            { letter: "B", point: 3.00, minPercent: 65 },
            { letter: "B-", point: 2.70, minPercent: 60 },
            { letter: "C+", point: 2.30, minPercent: 55 },
            { letter: "C", point: 2.00, minPercent: 50 },
            { letter: "C-", point: 1.70, minPercent: 45 },
            { letter: "D+", point: 1.30, minPercent: 40 },
            { letter: "D", point: 1.00, minPercent: 35 },
            { letter: "F", point: 0.00, minPercent: 0 }
        ]
    },

    custom: {
        id: "custom",
        name: "Custom Grading System",
        maxGPA: 4.0,
        passing: 2.0,
        grades: []
    }
};

export { gradingSystems };