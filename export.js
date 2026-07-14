// assets/js/export.js

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
        const studentName = document.getElementById('student-name')?.value || 'Not Provided';
        const currentScale = gradingSystems[currentGradingSystem];
        const scaleName = currentScale?.name || 'Unknown Scale';
        
        // Create transcript content
        const transcriptHTML = generateTranscriptHTML(studentName, scaleName);
        
        // Create a temporary container for the transcript
        const container = document.createElement('div');
        container.id = 'transcript-container';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 210mm;
            padding: 20mm;
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
            scale: 3,
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
 * Generate transcript HTML content
 */
function generateTranscriptHTML(studentName, scaleName) {
    // Get all data
    const cgpa = calculateCGPA();
    const totalCredits = totalCreditsAll();
    const fromScale = gradingSystems[currentGradingSystem];
    
    // Generate semester tables
    let semesterTables = '';
    semesters.forEach((sem, idx) => {
        const semGPA = calculateSemesterGPA(sem.courses);
        semesterTables += `
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 14px; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 4px;">
                    ${sem.name} (GPA: ${semGPA.toFixed(2)})
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="border: 1px solid #999; padding: 4px 6px; text-align: left;">SL</th>
                            <th style="border: 1px solid #999; padding: 4px 6px; text-align: left;">Course Name</th>
                            <th style="border: 1px solid #999; padding: 4px 6px; text-align: center;">Credit</th>
                            <th style="border: 1px solid #999; padding: 4px 6px; text-align: center;">Grade</th>
                            <th style="border: 1px solid #999; padding: 4px 6px; text-align: center;">Grade Point</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sem.courses.map((course, ci) => {
                            const gradeData = fromScale?.grades?.find(g => g.letter === course.grade);
                            const credit = creditMode === 'equal' ? 1 : (course.credit || 3);
                            return `
                                <tr>
                                    <td style="border: 1px solid #999; padding: 4px 6px; text-align: center;">${ci + 1}</td>
                                    <td style="border: 1px solid #999; padding: 4px 6px;">${course.name}</td>
                                    <td style="border: 1px solid #999; padding: 4px 6px; text-align: center;">${credit}</td>
                                    <td style="border: 1px solid #999; padding: 4px 6px; text-align: center;">${course.grade}</td>
                                    <td style="border: 1px solid #999; padding: 4px 6px; text-align: center;">${gradeData?.point?.toFixed(2) || 'N/A'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });
    
    // Generate grade scale table
    let gradeScaleHTML = '';
    if (fromScale?.grades?.length > 0) {
        gradeScaleHTML = `
            <div style="margin-top: 15px; padding: 10px; background: #f8f8f8; border: 1px solid #ddd; border-radius: 4px;">
                <h4 style="font-size: 12px; font-weight: bold; margin-bottom: 6px;">Grading Scale: ${scaleName}</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                    <thead>
                        <tr style="background: #e8e8e8;">
                            <th style="border: 1px solid #ccc; padding: 3px 5px; text-align: center;">Grade</th>
                            <th style="border: 1px solid #ccc; padding: 3px 5px; text-align: center;">Grade Point</th>
                            <th style="border: 1px solid #ccc; padding: 3px 5px; text-align: center;">Percentage Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fromScale.grades.map(g => `
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 3px 5px; text-align: center;">${g.letter}</td>
                                <td style="border: 1px solid #ccc; padding: 3px 5px; text-align: center;">${g.point.toFixed(2)}</td>
                                <td style="border: 1px solid #ccc; padding: 3px 5px; text-align: center;">${g.minPercent}% - ${g.maxPercent}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    return `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 170mm; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px double #333; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="font-size: 22px; font-weight: bold; margin: 0; color: #1a56db;">ACADEMIC TRANSCRIPT</h1>
                <p style="font-size: 12px; color: #666; margin: 4px 0;">Generated by MarsCal v2.0</p>
            </div>
            
            <!-- Student Information -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 30px; margin-bottom: 20px; font-size: 12px; border: 1px solid #ddd; padding: 12px 15px; border-radius: 4px; background: #fafafa;">
                <div><strong>Student Name:</strong> ${studentName}</div>
                <div><strong>Roll:</strong> _________________</div>
                <div><strong>Registration:</strong> _________________</div>
                <div><strong>Subject/Group:</strong> _________________</div>
                <div><strong>Institution:</strong> _________________</div>
                <div><strong>Board:</strong> _________________</div>
                <div><strong>Examination:</strong> _________________</div>
                <div><strong>Year:</strong> _________________</div>
            </div>
            
            <!-- Grade Scale -->
            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 13px; font-weight: bold; margin: 0 0 4px 0;">Grading System: ${scaleName}</h3>
            </div>
            
            <!-- Semester Results -->
            <div style="margin-bottom: 15px;">
                ${semesterTables}
            </div>
            
            <!-- Summary -->
            <div style="background: #e8f0fe; border: 1px solid #1a56db; border-radius: 4px; padding: 12px 15px; margin: 15px 0; display: flex; justify-content: space-around; text-align: center;">
                <div>
                    <div style="font-size: 11px; color: #666;">CGPA</div>
                    <div style="font-size: 20px; font-weight: bold; color: #1a56db;">${cgpa.toFixed(2)}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #666;">Total Credits</div>
                    <div style="font-size: 20px; font-weight: bold; color: #1a56db;">${totalCredits}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #666;">Total Semesters</div>
                    <div style="font-size: 20px; font-weight: bold; color: #1a56db;">${semesters.length}</div>
                </div>
            </div>
            
            <!-- Grade Scale Reference -->
            ${gradeScaleHTML}
            
            <!-- Signature Area -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #333; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div style="text-align: center;">
                    <div style="border-bottom: 1px solid #333; padding-bottom: 30px; margin-bottom: 6px;">&nbsp;</div>
                    <div style="font-size: 11px;">Controller of Examinations</div>
                    <div style="font-size: 10px; color: #666;">Signature & Date</div>
                </div>
                <div style="text-align: center;">
                    <div style="border-bottom: 1px solid #333; padding-bottom: 30px; margin-bottom: 6px;">&nbsp;</div>
                    <div style="font-size: 11px;">Head of Department / Principal</div>
                    <div style="font-size: 10px; color: #666;">Signature & Date</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; font-size: 9px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
                This is a computer-generated transcript. | Generated on: ${new Date().toLocaleDateString()}
            </div>
        </div>
    `;
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
    
    // Load html2canvas
    if (typeof html2canvas === 'undefined') {
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script1.onload = checkLoaded;
        script1.onerror = () => { showToast('Failed to load html2canvas'); };
        document.head.appendChild(script1);
    } else {
        checkLoaded();
    }
    
    // Load jsPDF
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
window.printTranscript = printTranscript;
window.generateTranscriptHTML = generateTranscriptHTML;

export { exportToPDF, printTranscript, generateTranscriptHTML };
