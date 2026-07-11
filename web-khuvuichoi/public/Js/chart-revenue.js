document.addEventListener("DOMContentLoaded", function () {

    console.log("Revenue chart loaded");

    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: window.revenueLabels || [],
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: window.revenueData || [],
                backgroundColor: '#4CAF50', // XANH LÁ
                borderColor: '#2E7D32',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
});
