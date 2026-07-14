// assets/js/transcriptGenerator.js

/**
 * Transcript Generator
 * Generates HTML transcript for PDF export and printing
 * Supports single or multiple semesters with multi-page support
 */

import { getFormattedStudentInfo } from './studentInfo.js';
import { gradingSystems } from './gradingData.js';

/**
 * Generate complete transcript HTML
 * @param {Object} options - Generation options
 * @param {string} options.title - Transcript title (default: 'ACADEMIC TRANSCRIPT')
 * @param {string} options.scaleName - Grading scale name (auto-detected if not provided)
 * @param {boolean} options.showGradeScale - Show grade scale table (default: true)
 * @param {boolean} options.showSignature - Show signature section (default: true)
 * @param {number|string} options.semestersToShow - 'all' or specific semester index (default: 'all')
 * @param {number} options.semestersPerPage - Number of semesters per page (default: 2)
 * @returns {string} Complete HTML transcript
 */
function generateTranscriptHTML(options = {}) {
    const {
        title = 'ACADEMIC TRANSCRIPT',
        scaleName = null,
        showGradeScale = true,
        showSignature = true,
        semestersToShow = 'all',
        semestersPerPage = 2
    } = options;

    // Get student info
    const student = getFormattedStudentInfo();
    
    // Get academic data
    const cgpa = window.calculateCGPA ? window.calculateCGPA() : 0;
    const totalCredits = window.totalCreditsAll ? window.totalCreditsAll() : 0;
    const allSemesters = window.semesters || [];
    const currentGradingSystem = window.currentGradingSystem || 'bd4';
    const fromScale = gradingSystems[currentGradingSystem];
    const scaleDisplayName = scaleName || fromScale?.name || 'Unknown Scale';
    const creditMode = window.creditMode || 'equal';

    // Filter semesters to show
    let semestersToRender = [];
    if (semestersToShow === 'all') {
        semestersToRender = allSemesters;
    } else if (typeof semestersToShow === 'number' && semestersToShow >= 0 && semestersToShow < allSemesters.length) {
        semestersToRender = [allSemesters[semestersToShow]];
    } else if (Array.isArray(semestersToShow)) {
        semestersToRender = semestersToShow.map(idx => allSemesters[idx]).filter(s => s);
    } else {
        semestersToRender = allSemesters;
    }

    if (semestersToRender.length === 0) {
        return `
            <div style="text-align: center; padding: 40px; color: #666; font-family: Arial, sans-serif;">
                <h2>No semesters to display</h2>
                <p>Please add courses to generate a transcript.</p>
            </div>
        `;
    }

    // Calculate semester GPA for filtered semesters
    const semesterGPAs = semestersToRender.map(sem => {
        return window.calculateSemesterGPA ? window.calculateSemesterGPA(sem.courses) : 0;
    });

    // Split semesters into pages
    const pages = [];
    for (let i = 0; i < semestersToRender.length; i += semestersPerPage) {
        pages.push({
            semesters: semestersToRender.slice(i, i + semestersPerPage),
            indices: Array.from({ length: Math.min(semestersPerPage, semestersToRender.length - i) }, (_, j) => i + j),
            startIndex: i,
            endIndex: Math.min(i + semestersPerPage, semestersToRender.length),
            totalSemesters: semestersToRender.length,
            isFirstPage: i === 0,
            isLastPage: i + semestersPerPage >= semestersToRender.length
        });
    }

    // Generate all pages
    let allPagesHTML = '';
    pages.forEach((page, pageIndex) => {
        const pageHTML = generateTranscriptPage({
            ...options,
            title: title,
            student: student,
            cgpa: cgpa,
            totalCredits: totalCredits,
            fromScale: fromScale,
            scaleDisplayName: scaleDisplayName,
            creditMode: creditMode,
            semesters: page.semesters,
            semesterGPAs: semesterGPAs.slice(page.startIndex, page.endIndex),
            showGradeScale: showGradeScale,
            showSignature: showSignature,
            pageNumber: pageIndex + 1,
            totalPages: pages.length,
            isFirstPage: page.isFirstPage,
            isLastPage: page.isLastPage,
            pageStartIndex: page.startIndex,
            pageEndIndex: page.endIndex,
            totalSemesters: page.totalSemesters
        });
        allPagesHTML += pageHTML;
    });

    return allPagesHTML;
}

/**
 * Generate a single transcript page
 */
function generateTranscriptPage(options) {
    const {
        title,
        student,
        cgpa,
        totalCredits,
        fromScale,
        scaleDisplayName,
        creditMode,
        semesters,
        semesterGPAs,
        showGradeScale,
        showSignature,
        pageNumber,
        totalPages,
        isFirstPage,
        isLastPage,
        pageStartIndex,
        pageEndIndex,
        totalSemesters
    } = options;

    // Generate semester tables for this page
    let semesterTables = '';
    semesters.forEach((sem, idx) => {
        const globalIdx = pageStartIndex + idx;
        const semGPA = semesterGPAs[idx] || 0;
        semesterTables += generateSemesterTable(sem, semGPA, fromScale, creditMode, globalIdx);
    });

    // Show "continued" message if not first page
    let continuedMessage = '';
    if (!isFirstPage) {
        continuedMessage = `
            <div style="text-align: center; font-size: 11px; color: #6b7280; margin-bottom: 10px; 
                        border-bottom: 1px dashed #d1d5db; padding-bottom: 8px;">
                <em>Continued from previous page...</em>
            </div>
        `;
    }

    // Generate grade scale table (only on first page)
    let gradeScaleHTML = '';
    if (showGradeScale && isFirstPage && fromScale?.grades?.length > 0) {
        gradeScaleHTML = generateGradeScaleTable(fromScale, scaleDisplayName);
    }

    // Generate signature section (on every page)
    let signatureHTML = '';
    if (showSignature) {
        signatureHTML = generateSignatureSection();
    }

    // Page header with title and page info
    const pageHeader = `
        <div style="text-align: center; border-bottom: 3px double #1a56db; padding-bottom: 10px; margin-bottom: 12px;">
            <h1 style="font-size: 20px; font-weight: bold; margin: 0; color: #1a56db; letter-spacing: 2px;">
                ${title}
            </h1>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #6b7280; margin-top: 4px;">
                <span>Page ${pageNumber} of ${totalPages}</span>
                <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
    `;

    // Semester range info
    let semesterRangeInfo = '';
    if (totalPages > 1) {
        semesterRangeInfo = `
            <div style="text-align: center; font-size: 11px; color: #4b5563; margin-bottom: 10px; 
                        background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">
                Showing Semesters ${pageStartIndex + 1} - ${Math.min(pageEndIndex, totalSemesters)} of ${totalSemesters}
            </div>
        `;
    }

    // Footer with page info
    const footer = `
        <div style="text-align: center; font-size: 8px; color: #9ca3af; margin-top: 15px; 
                    border-top: 1px solid #e5e7eb; padding-top: 8px;">
            Page ${pageNumber} of ${totalPages} | ${title} | Generated by MarsCal
        </div>
    `;

    return `
        <div class="transcript-page" style="font-family: 'Inter', Arial, sans-serif; max-width: 170mm; 
                    margin: 0 auto; padding: 8px 0; page-break-after: always;
                    ${!isLastPage ? 'border-bottom: 2px dashed #d1d5db; margin-bottom: 20px; padding-bottom: 20px;' : ''}">
            
            ${pageHeader}
            
            ${!isFirstPage ? continuedMessage : ''}
            
            ${isFirstPage ? generateStudentInfoSection(student) : ''}
            
            ${isFirstPage ? `
                <div style="margin-bottom: 10px;">
                    <h3 style="font-size: 13px; font-weight: bold; margin: 0 0 4px 0; color: #1a56db;">
                        Grading System: ${scaleDisplayName}
                    </h3>
                </div>
            ` : ''}
            
            ${semesterRangeInfo}
            
            <div style="margin-bottom: 10px;">
                ${semesterTables}
            </div>
            
            ${isFirstPage ? generateSummarySection(cgpa, totalCredits, totalSemesters) : ''}
            
            ${gradeScaleHTML}
            
            ${signatureHTML}
            
            ${footer}
        </div>
    `;
}

/**
 * Generate a single semester table
 */
function generateSemesterTable(sem, semGPA, fromScale, creditMode, globalIndex) {
    if (!sem.courses || sem.courses.length === 0) {
        return `
            <div style="margin-bottom: 12px; padding: 8px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px;">
                <h4 style="font-size: 13px; font-weight: bold; margin: 0; color: #1a56db;">
                    ${sem.name} 
                    <span style="float: right; font-weight: normal; color: #333; font-size: 12px;">
                        GPA: ${semGPA.toFixed(2)}
                    </span>
                </h4>
                <p style="font-size: 11px; color: #6b7280; margin: 4px 0 0 0;">No courses in this semester</p>
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 14px;">
            <h4 style="font-size: 13px; font-weight: bold; margin: 0 0 4px 0; 
                       border-bottom: 2px solid #1a56db; padding-bottom: 3px; color: #1a56db;">
                ${sem.name} 
                <span style="float: right; font-weight: normal; color: #333; font-size: 12px;">
                    GPA: ${semGPA.toFixed(2)}
                </span>
            </h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                    <tr style="background: #e5e7eb;">
                        <th style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center; width: 6%;">SL</th>
                        <th style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: left;">Course Name</th>
                        <th style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center; width: 10%;">Credit</th>
                        <th style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center; width: 10%;">Grade</th>
                        <th style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center; width: 12%;">Grade Point</th>
                    </tr>
                </thead>
                <tbody>
                    ${sem.courses.map((course, ci) => {
                        const gradeData = fromScale?.grades?.find(g => g.letter === course.grade);
                        const credit = creditMode === 'equal' ? 1 : (course.credit || 3);
                        const point = gradeData?.point !== undefined ? gradeData.point.toFixed(2) : 'N/A';
                        return `
                            <tr style="${ci % 2 === 0 ? 'background: #ffffff;' : 'background: #f9fafb;'}">
                                <td style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center;">${ci + 1}</td>
                                <td style="border: 1px solid #9ca3af; padding: 3px 5px;">${course.name}</td>
                                <td style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center;">${credit}</td>
                                <td style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center; font-weight: 600;">${course.grade}</td>
                                <td style="border: 1px solid #9ca3af; padding: 3px 5px; text-align: center;">${point}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Generate student information section
 */
function generateStudentInfoSection(student) {
    return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 25px; margin-bottom: 12px; 
                    border: 1px solid #d1d5db; padding: 10px 14px; border-radius: 6px; 
                    background: #f9fafb; font-size: 11px;">
            <div><strong>Student Name:</strong> ${student.fullName}</div>
            <div><strong>Roll:</strong> ${student.roll}</div>
            <div><strong>Registration:</strong> ${student.registration}</div>
            <div><strong>Subject/Group:</strong> ${student.subject}</div>
            <div><strong>Institution:</strong> ${student.institution}</div>
            <div><strong>Board:</strong> ${student.board}</div>
            <div><strong>Examination:</strong> ${student.examName}</div>
            <div><strong>Year:</strong> ${student.examYear}</div>
            ${student.session ? `<div><strong>Session:</strong> ${student.session}</div>` : ''}
        </div>
    `;
}

/**
 * Generate grade scale table
 */
function generateGradeScaleTable(fromScale, scaleName) {
    if (!fromScale?.grades) return '';
    
    return `
        <div style="margin-top: 10px; padding: 8px 10px; background: #f9fafb; 
                    border: 1px solid #d1d5db; border-radius: 6px;">
            <h4 style="font-size: 11px; font-weight: bold; margin-bottom: 4px; color: #1a56db;">
                Grading Scale: ${scaleName}
            </h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
                <thead>
                    <tr style="background: #e5e7eb;">
                        <th style="border: 1px solid #9ca3af; padding: 2px 4px; text-align: center;">Grade</th>
                        <th style="border: 1px solid #9ca3af; padding: 2px 4px; text-align: center;">Grade Point</th>
                        <th style="border: 1px solid #9ca3af; padding: 2px 4px; text-align: center;">Percentage Range</th>
                    </tr>
                </thead>
                <tbody>
                    ${fromScale.grades.map(g => `
                        <tr style="${g.point === 0 ? 'background: #fee2e2;' : ''}">
                            <td style="border: 1px solid #9ca3af; padding: 2px 4px; text-align: center; font-weight: 600;">${g.letter}</td>
                            <td style="border: 1px solid #9ca3af; padding: 2px 4px; text-align: center;">${g.point.toFixed(2)}</td>
                            <td style="border: 1px solid #9ca3af; padding: 2px 4px; text-align: center;">${g.minPercent}% - ${g.maxPercent}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Generate summary section
 */
function generateSummarySection(cgpa, totalCredits, totalSemesters) {
    return `
        <div style="background: #eff6ff; border: 2px solid #1a56db; border-radius: 6px; 
                    padding: 10px 12px; margin: 10px 0; 
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
            <div>
                <div style="font-size: 10px; color: #4b5563; font-weight: 500;">CGPA</div>
                <div style="font-size: 20px; font-weight: bold; color: #1a56db;">${cgpa.toFixed(2)}</div>
            </div>
            <div>
                <div style="font-size: 10px; color: #4b5563; font-weight: 500;">Total Credits</div>
                <div style="font-size: 20px; font-weight: bold; color: #1a56db;">${totalCredits}</div>
            </div>
            <div>
                <div style="font-size: 10px; color: #4b5563; font-weight: 500;">Total Semesters</div>
                <div style="font-size: 20px; font-weight: bold; color: #1a56db;">${totalSemesters}</div>
            </div>
        </div>
    `;
}

/**
 * Generate signature section
 */
function generateSignatureSection() {
    return `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #1a56db; 
                    display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div style="text-align: center;">
                <div style="border-bottom: 1px solid #333; padding-bottom: 25px; margin-bottom: 3px;">&nbsp;</div>
                <div style="font-size: 10px; font-weight: 600;">Controller of Examinations</div>
                <div style="font-size: 9px; color: #6b7280;">Signature & Date</div>
            </div>
            <div style="text-align: center;">
                <div style="border-bottom: 1px solid #333; padding-bottom: 25px; margin-bottom: 3px;">&nbsp;</div>
                <div style="font-size: 10px; font-weight: 600;">Head of Department / Principal</div>
                <div style="font-size: 9px; color: #6b7280;">Signature & Date</div>
            </div>
        </div>
    `;
}

/**
 * Generate transcript for specific semesters
 * @param {number|string|Array} semesterSelection - 'all', single index, or array of indices
 * @param {Object} options - Same as generateTranscriptHTML
 * @returns {string} HTML transcript
 */
function generateSelectedSemesterTranscript(semesterSelection = 'all', options = {}) {
    return generateTranscriptHTML({
        ...options,
        semestersToShow: semesterSelection
    });
}

/**
 * Generate transcript for converted results
 * @param {Object} convertedData - Data from converter
 * @param {string} targetSystem - Target grading system name
 * @param {Object} options - Additional options
 * @returns {string} HTML transcript with converted grades
 */
function generateConvertedTranscript(convertedData, targetSystem, options = {}) {
    const originalSemesters = window.semesters;
    const originalGradingSystem = window.currentGradingSystem;
    
    if (convertedData?.semesters) {
        window.semesters = convertedData.semesters;
        window.currentGradingSystem = convertedData.targetSystem || targetSystem;
    }
    
    const html = generateTranscriptHTML({
        ...options,
        title: options.title || 'CONVERTED ACADEMIC TRANSCRIPT',
        scaleName: targetSystem,
        showGradeScale: options.showGradeScale !== undefined ? options.showGradeScale : true,
        showSignature: options.showSignature !== undefined ? options.showSignature : true
    });
    
    window.semesters = originalSemesters;
    window.currentGradingSystem = originalGradingSystem;
    
    return html;
}

/**
 * Get transcript page count
 * @param {Object} options - Same as generateTranscriptHTML
 * @returns {number} Number of pages
 */
function getTranscriptPageCount(options = {}) {
    const {
        semestersToShow = 'all',
        semestersPerPage = 2
    } = options;

    const allSemesters = window.semesters || [];
    let semestersToRender = [];
    
    if (semestersToShow === 'all') {
        semestersToRender = allSemesters;
    } else if (typeof semestersToShow === 'number' && semestersToShow >= 0 && semestersToShow < allSemesters.length) {
        semestersToRender = [allSemesters[semestersToShow]];
    } else if (Array.isArray(semestersToShow)) {
        semestersToRender = semestersToShow.map(idx => allSemesters[idx]).filter(s => s);
    } else {
        semestersToRender = allSemesters;
    }

    return Math.ceil(semestersToRender.length / semestersPerPage);
}

// Make functions globally available
window.generateTranscriptHTML = generateTranscriptHTML;
window.generateSelectedSemesterTranscript = generateSelectedSemesterTranscript;
window.generateConvertedTranscript = generateConvertedTranscript;
window.getTranscriptPageCount = getTranscriptPageCount;

// Export for module usage
export {
    generateTranscriptHTML,
    generateSelectedSemesterTranscript,
    generateConvertedTranscript,
    getTranscriptPageCount,
    generateStudentInfoSection,
    generateGradeScaleTable,
    generateSummarySection,
    generateSignatureSection
};
