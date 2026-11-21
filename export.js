// assets/js/export.js

import { getFormattedStudentInfo } from './studentInfo.js';
import { generateTranscriptHTML as generateFullTranscript } from './transcriptGenerator.js';

/**
 * Export complete transcript as PDF with all details
 */
function exportToPDF() {
    showToast('Generating transcript...');
    
    // Check if libraries are loaded
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        showToast('Loading PDF libraries, please wait...');
        loadPDFLibraries();
        return;
    }

    try {
        // Get student info
        const studentInfo = getFormattedStudentInfo();
        const studentName = studentInfo.fullName || 'Not Provided';
        const currentScale = window.gradingSystems?.[window.currentGradingSystem];
        const scaleName = currentScale?.name || 'Unknown Scale';
        
        // Create transcript content using transcriptGenerator
        const transcriptHTML = generateFullTranscript({
            title: 'ACADEMIC TRANSCRIPT',
            scaleName: scaleName,
            showGradeScale: true,
            showSignature: true,
            semestersToShow: 'all',
            semestersPerPage: 2
        });
        
        // Create a temporary container for the transcript
        const container = document.createElement('div');
        container.id = 'transcript-container';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 210mm;
            padding: 15mm;
            background: white;
            color: black;
            font-family: 'Inter', Arial, sans-serif;
            z-index: 9999;
        `;
        container.innerHTML = transcriptHTML;
        document.body.appendChild(container);
        
        // Generate PDF
        const { jsPDF } = window.jspdf;
        
        html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true,
            width: container.scrollWidth,
            height: container.scrollHeight,
            windowWidth: container.scrollWidth,
            windowHeight: container.scrollHeight
        }).then(canvas => {
            // Remove temporary container
            document.body.removeChild(container);
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            // If content is taller than one page, add more pages
            let heightLeft = pdfHeight - pdf.internal.pageSize.getHeight();
            let position = -pdf.internal.pageSize.getHeight();
            
            while (heightLeft > 0) {
                position -= pdf.internal.pageSize.getHeight();
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            
            pdf.save(`Transcript_${studentName.replace(/\s+/g, '_')}.pdf`);
            showToast('Transcript downloaded successfully!');
        }).catch(error => {
            document.body.removeChild(container);
            console.error('PDF generation error:', error);
            showToast('Error generating PDF. Please try again.');
        });
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error: ' + error.message);
    }
}

/**
 * Export specific semesters as PDF
 * @param {string|number|Array} semesterSelection - 'all', single index, or array of indices
 */
function exportSelectedSemesters(semesterSelection = 'all') {
    showToast('Generating transcript for selected semesters...');
    
    // Check if libraries are loaded
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        showToast('Loading PDF libraries, please wait...');
        loadPDFLibraries();
        return;
    }

    try {
        const studentInfo = getFormattedStudentInfo();
        const studentName = studentInfo.fullName || 'Not Provided';
        const currentScale = window.gradingSystems?.[window.currentGradingSystem];
        const scaleName = currentScale?.name || 'Unknown Scale';
        
        const transcriptHTML = generateFullTranscript({
            title: 'ACADEMIC TRANSCRIPT',
            scaleName: scaleName,
            showGradeScale: true,
            showSignature: true,
            semestersToShow: semesterSelection,
            semestersPerPage: 2
        });
        
        const container = document.createElement('div');
        container.id = 'transcript-container';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 210mm;
            padding: 15mm;
            background: white;
            color: black;
            font-family: 'Inter', Arial, sans-serif;
            z-index: 9999;
        `;
        container.innerHTML = transcriptHTML;
        document.body.appendChild(container);
        
        const { jsPDF } = window.jspdf;
        
        html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true,
            width: container.scrollWidth,
            height: container.scrollHeight,
            windowWidth: container.scrollWidth,
            windowHeight: container.scrollHeight
        }).then(canvas => {
            document.body.removeChild(container);
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            let heightLeft = pdfHeight - pdf.internal.pageSize.getHeight();
            let position = -pdf.internal.pageSize.getHeight();
            
            while (heightLeft > 0) {
                position -= pdf.internal.pageSize.getHeight();
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            
            const suffix = semesterSelection === 'all' ? 'Full' : 'Selected';
            pdf.save(`Transcript_${studentName.replace(/\s+/g, '_')}_${suffix}.pdf`);
            showToast('Transcript downloaded successfully!');
        }).catch(error => {
            document.body.removeChild(container);
            console.error('PDF generation error:', error);
            showToast('Error generating PDF. Please try again.');
        });
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error: ' + error.message);
    }
}

/**
 * Export converted result as PDF
 * @param {Object} convertedData - Data from converter
 * @param {string} targetSystem - Target grading system name
 */
function exportConvertedTranscript(convertedData, targetSystem) {
    showToast('Generating converted transcript...');
    
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        showToast('Loading PDF libraries, please wait...');
        loadPDFLibraries();
        return;
    }

    try {
        const studentInfo = getFormattedStudentInfo();
        const studentName = studentInfo.fullName || 'Not Provided';
        
        // Use generateConvertedTranscript from transcriptGenerator
        const transcriptHTML = window.generateConvertedTranscript 
            ? window.generateConvertedTranscript(convertedData, targetSystem, {
                title: 'CONVERTED ACADEMIC TRANSCRIPT',
                showGradeScale: true,
                showSignature: true,
                semestersPerPage: 2
              })
            : generateFullTranscript({
                title: 'CONVERTED ACADEMIC TRANSCRIPT',
                scaleName: targetSystem,
                showGradeScale: true,
                showSignature: true,
                semestersToShow: 'all',
                semestersPerPage: 2
              });
        
        const container = document.createElement('div');
        container.id = 'transcript-container';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 210mm;
            padding: 15mm;
            background: white;
            color: black;
            font-family: 'Inter', Arial, sans-serif;
            z-index: 9999;
        `;
        container.innerHTML = transcriptHTML;
        document.body.appendChild(container);
        
        const { jsPDF } = window.jspdf;
        
        html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true,
            width: container.scrollWidth,
            height: container.scrollHeight,
            windowWidth: container.scrollWidth,
            windowHeight: container.scrollHeight
        }).then(canvas => {
            document.body.removeChild(container);
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            let heightLeft = pdfHeight - pdf.internal.pageSize.getHeight();
            let position = -pdf.internal.pageSize.getHeight();
            
            while (heightLeft > 0) {
                position -= pdf.internal.pageSize.getHeight();
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            
            pdf.save(`Converted_Transcript_${studentName.replace(/\s+/g, '_')}.pdf`);
            showToast('Converted transcript downloaded successfully!');
        }).catch(error => {
            document.body.removeChild(container);
            console.error('PDF generation error:', error);
            showToast('Error generating PDF. Please try again.');
        });
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error: ' + error.message);
    }
}

/**
 * Load PDF libraries dynamically
 */
function loadPDFLibraries() {
    let loaded = 0;
    const total = 2;
    
    const checkLoaded = () => {
        loaded++;
        if (loaded === total) {
            showToast('Libraries loaded! Click Export again.');
        }
    };
    
    if (typeof html2canvas === 'undefined') {
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script1.onload = checkLoaded;
        script1.onerror = () => { showToast('Failed to load html2canvas'); };
        document.head.appendChild(script1);
    } else {
        checkLoaded();
    }
    
    if (typeof window.jspdf === 'undefined') {
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script2.onload = checkLoaded;
        script2.onerror = () => { showToast('Failed to load jsPDF'); };
        document.head.appendChild(script2);
    } else {
        checkLoaded();
    }
}

/**
 * Print transcript (uses browser print)
 */
function printTranscript() {
    showToast('Opening print dialog...');
    window.print();
}

// Make functions globally available
window.exportToPDF = exportToPDF;
window.exportSelectedSemesters = exportSelectedSemesters;
window.exportConvertedTranscript = exportConvertedTranscript;
window.printTranscript = printTranscript;
window.loadPDFLibraries = loadPDFLibraries;

export { 
    exportToPDF, 
    exportSelectedSemesters,
    exportConvertedTranscript,
    printTranscript, 
    loadPDFLibraries
};
