// assets/js/export.js
function exportToPDF() {
    showToast('PDF Export started... (Demo)');
    
    // In full version: use jsPDF + html2canvas
    setTimeout(() => {
        showToast('Transcript exported successfully!', 'success');
    }, 1500);
}

function printTranscript() {
    window.print();
}

export { exportToPDF, printTranscript };