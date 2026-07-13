// assets/js/charts.js
let pieChart, lineChart;

function initCharts() {
    const pieCtx = document.getElementById('pieChart');
    const lineCtx = document.getElementById('lineChart');

    if (pieCtx) {
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['A+', 'A', 'B', 'C', 'F'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: ['#22c55e', '#eab308', '#3b82f6', '#8b5cf6', '#ef4444']
                }]
            },
            options: { responsive: true }
        });
    }

    if (lineCtx) {
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                datasets: [{
                    label: 'GPA',
                    data: [3.2, 3.5, 3.8, 3.9],
                    borderColor: '#3b82f6',
                    tension: 0.4
                }]
            },
            options: { responsive: true }
        });
    }
}

export { initCharts };