// assets/js/gradingData.js

const gradingSystems = {
    bd5: {
        id: "bd5",
        name: "Bangladesh (5.00 Scale)",
        maxGPA: 5.0,
        passing: 1.0,
        grades: [
            { letter: "A+", point: 5.00, minPercent: 80, maxPercent: 100 },
            { letter: "A", point: 4.00, minPercent: 70, maxPercent: 79 },
            { letter: "A-", point: 3.50, minPercent: 60, maxPercent: 69 },
            { letter: "B", point: 3.00, minPercent: 50, maxPercent: 59 },
            { letter: "C", point: 2.00, minPercent: 40, maxPercent: 49 },
            { letter: "D", point: 1.00, minPercent: 33, maxPercent: 39 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 32 }
        ]
    },
    bd4: {
        id: "bd4",
        name: "Bangladesh (4.00 Scale)",
        maxGPA: 4.0,
        passing: 2.0,
        grades: [
            { letter: "A+", point: 4.00, minPercent: 80, maxPercent: 100 },
            { letter: "A", point: 3.75, minPercent: 75, maxPercent: 79 },
            { letter: "A-", point: 3.50, minPercent: 70, maxPercent: 74 },
            { letter: "B+", point: 3.25, minPercent: 65, maxPercent: 69 },
            { letter: "B", point: 3.00, minPercent: 60, maxPercent: 64 },
            { letter: "B-", point: 2.75, minPercent: 55, maxPercent: 59 },
            { letter: "C+", point: 2.50, minPercent: 50, maxPercent: 54 },
            { letter: "C", point: 2.25, minPercent: 45, maxPercent: 49 },
            { letter: "D", point: 2.00, minPercent: 40, maxPercent: 44 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 39 }
        ]
    },
    india10: {
        id: "india10",
        name: "India (10.00 Scale)",
        maxGPA: 10.0,
        passing: 4.0,
        grades: [
            { letter: "O", point: 10.00, minPercent: 90, maxPercent: 100 },
            { letter: "A+", point: 9.00, minPercent: 80, maxPercent: 89 },
            { letter: "A", point: 8.00, minPercent: 70, maxPercent: 79 },
            { letter: "B+", point: 7.00, minPercent: 60, maxPercent: 69 },
            { letter: "B", point: 6.00, minPercent: 55, maxPercent: 59 },
            { letter: "C", point: 5.00, minPercent: 50, maxPercent: 54 },
            { letter: "P", point: 4.00, minPercent: 40, maxPercent: 49 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 39 }
        ]
    },
    pakistan4: {
        id: "pakistan4",
        name: "Pakistan (4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A", point: 4.00, minPercent: 85, maxPercent: 100 },
            { letter: "A-", point: 3.67, minPercent: 80, maxPercent: 84 },
            { letter: "B+", point: 3.33, minPercent: 75, maxPercent: 79 },
            { letter: "B", point: 3.00, minPercent: 71, maxPercent: 74 },
            { letter: "B-", point: 2.67, minPercent: 68, maxPercent: 70 },
            { letter: "C+", point: 2.33, minPercent: 64, maxPercent: 67 },
            { letter: "C", point: 2.00, minPercent: 61, maxPercent: 63 },
            { letter: "C-", point: 1.67, minPercent: 58, maxPercent: 60 },
            { letter: "D+", point: 1.33, minPercent: 54, maxPercent: 57 },
            { letter: "D", point: 1.00, minPercent: 50, maxPercent: 53 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 49 }
        ]
    },
    us4: {
        id: "us4",
        name: "United States (4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A", point: 4.00, minPercent: 90, maxPercent: 100 },
            { letter: "A-", point: 3.70, minPercent: 87, maxPercent: 89 },
            { letter: "B+", point: 3.30, minPercent: 83, maxPercent: 86 },
            { letter: "B", point: 3.00, minPercent: 80, maxPercent: 82 },
            { letter: "B-", point: 2.70, minPercent: 77, maxPercent: 79 },
            { letter: "C+", point: 2.30, minPercent: 73, maxPercent: 76 },
            { letter: "C", point: 2.00, minPercent: 70, maxPercent: 72 },
            { letter: "C-", point: 1.70, minPercent: 67, maxPercent: 69 },
            { letter: "D+", point: 1.30, minPercent: 65, maxPercent: 66 },
            { letter: "D", point: 1.00, minPercent: 60, maxPercent: 64 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 59 }
        ]
    },
    uk: {
        id: "uk",
        name: "United Kingdom (Honours Classification)",
        maxGPA: 100,
        passing: 40,
        grades: [
            { letter: "First Class", point: 70, minPercent: 70, maxPercent: 100 },
            { letter: "Upper Second (2:1)", point: 60, minPercent: 60, maxPercent: 69 },
            { letter: "Lower Second (2:2)", point: 50, minPercent: 50, maxPercent: 59 },
            { letter: "Third Class", point: 40, minPercent: 40, maxPercent: 49 },
            { letter: "Fail", point: 0, minPercent: 0, maxPercent: 39 }
        ]
    },
    ects: {
        id: "ects",
        name: "Europe (ECTS)",
        maxGPA: 5,
        passing: 1,
        grades: [
            { letter: "A", point: 5, minPercent: 90, maxPercent: 100 },
            { letter: "B", point: 4, minPercent: 80, maxPercent: 89 },
            { letter: "C", point: 3, minPercent: 70, maxPercent: 79 },
            { letter: "D", point: 2, minPercent: 60, maxPercent: 69 },
            { letter: "E", point: 1, minPercent: 50, maxPercent: 59 },
            { letter: "FX", point: 0, minPercent: 40, maxPercent: 49 },
            { letter: "F", point: 0, minPercent: 0, maxPercent: 39 }
        ]
    },
    china4: {
        id: "china4",
        name: "China (Common 4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A", point: 4.00, minPercent: 90, maxPercent: 100 },
            { letter: "A-", point: 3.70, minPercent: 85, maxPercent: 89 },
            { letter: "B+", point: 3.30, minPercent: 82, maxPercent: 84 },
            { letter: "B", point: 3.00, minPercent: 78, maxPercent: 81 },
            { letter: "B-", point: 2.70, minPercent: 75, maxPercent: 77 },
            { letter: "C+", point: 2.30, minPercent: 72, maxPercent: 74 },
            { letter: "C", point: 2.00, minPercent: 68, maxPercent: 71 },
            { letter: "C-", point: 1.70, minPercent: 64, maxPercent: 67 },
            { letter: "D", point: 1.00, minPercent: 60, maxPercent: 63 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 59 }
        ]
    },
    korea43: {
        id: "korea43",
        name: "South Korea (4.30 Scale)",
        maxGPA: 4.3,
        passing: 1.0,
        grades: [
            { letter: "A+", point: 4.30, minPercent: 95, maxPercent: 100 },
            { letter: "A0", point: 4.00, minPercent: 90, maxPercent: 94 },
            { letter: "A-", point: 3.70, minPercent: 85, maxPercent: 89 },
            { letter: "B+", point: 3.30, minPercent: 80, maxPercent: 84 },
            { letter: "B0", point: 3.00, minPercent: 75, maxPercent: 79 },
            { letter: "B-", point: 2.70, minPercent: 70, maxPercent: 74 },
            { letter: "C+", point: 2.30, minPercent: 65, maxPercent: 69 },
            { letter: "C0", point: 2.00, minPercent: 60, maxPercent: 64 },
            { letter: "C-", point: 1.70, minPercent: 55, maxPercent: 59 },
            { letter: "D+", point: 1.30, minPercent: 50, maxPercent: 54 },
            { letter: "D0", point: 1.00, minPercent: 45, maxPercent: 49 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 44 }
        ]
    },
    malaysia4: {
        id: "malaysia4",
        name: "Malaysia (4.00 Scale)",
        maxGPA: 4.0,
        passing: 1.0,
        grades: [
            { letter: "A+", point: 4.00, minPercent: 90, maxPercent: 100 },
            { letter: "A", point: 4.00, minPercent: 80, maxPercent: 89 },
            { letter: "A-", point: 3.70, minPercent: 75, maxPercent: 79 },
            { letter: "B+", point: 3.30, minPercent: 70, maxPercent: 74 },
            { letter: "B", point: 3.00, minPercent: 65, maxPercent: 69 },
            { letter: "B-", point: 2.70, minPercent: 60, maxPercent: 64 },
            { letter: "C+", point: 2.30, minPercent: 55, maxPercent: 59 },
            { letter: "C", point: 2.00, minPercent: 50, maxPercent: 54 },
            { letter: "C-", point: 1.70, minPercent: 45, maxPercent: 49 },
            { letter: "D+", point: 1.30, minPercent: 40, maxPercent: 44 },
            { letter: "D", point: 1.00, minPercent: 35, maxPercent: 39 },
            { letter: "F", point: 0.00, minPercent: 0, maxPercent: 34 }
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
