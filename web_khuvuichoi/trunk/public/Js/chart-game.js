document.addEventListener("DOMContentLoaded", function () {

    const ctx = document.getElementById("gameChart");
    if (!ctx) return;

new Chart(ctx, {
    type: "bar",
    data: {
        labels: window.gameLabels || [],
        datasets: [{
            label: "Số vé bán",
            data: window.gameData || [],
            fill: true,
            backgroundColor: 'rgba(28, 215, 59, 0.74)', // xanh dương nhạt
            borderColor: 'rgba(30, 216, 30, 1)',       // xanh dương đậm
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
