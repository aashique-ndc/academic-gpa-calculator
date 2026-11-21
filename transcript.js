// assets/js/transcript.js
function generateTranscriptHTML() {
    return `
        <div class="transcript print-area">
            <h1 class="text-center text-2xl font-bold mb-8">Official Academic Transcript</h1>
            <!-- Student info, semesters, CGPA, Signature space -->
            <div class="signature-section mt-20">
                <div>Prepared By ________________</div>
                <div>Verified By ________________</div>
                <div>Head of Department ________________</div>
            </div>
        </div>
    `;
}

export { generateTranscriptHTML };