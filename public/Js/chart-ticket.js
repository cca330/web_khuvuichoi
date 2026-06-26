document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("ticketChart");
    if (!canvas) return;

    if (window.ticketChartInstance) {
        window.ticketChartInstance.destroy();
    }

    window.ticketChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: window.ticketLabels || [],
            datasets: [{
                data: window.ticketData || [],
                // backgroundColor: [
                //     'rgba(30,144,255,0.8)', // GAME
                //     'rgba(0,191,255,0.8)'   // GATE
                // ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
});
