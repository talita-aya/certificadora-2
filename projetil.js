document.addEventListener("DOMContentLoaded", function () {
    const angleInput = document.getElementById("angle");
    const velocityInput = document.getElementById("velocity");
    const buttonSimulator = document.getElementById("button-simulator");
    const rangeResult = document.getElementById("range");
    const heightResult = document.getElementById("height");
    const timeResult = document.getElementById("time");
    const canvas = document.getElementById("canvas");

    buttonSimulator.addEventListener("click", function () {
        const angle = parseFloat(angleInput.value);
        const velocity = parseFloat(velocityInput.value);

        if (!isNaN(angle) && !isNaN(velocity)) {
            const radians = (angle * Math.PI) / 180;
            const g = 9.81;
            const dataPoints = [];
            const timeStep = 0.1;
            let t = 0;

            while (t <= (2 * velocity * Math.sin(radians)) / g) {
                const x = velocity * Math.cos(radians) * t;
                const y = velocity * Math.sin(radians) * t - (0.5 * g * t * t);
                dataPoints.push({ time: t, height: y });
                t += timeStep;
            }

            rangeResult.textContent = (dataPoints[dataPoints.length - 1].time * velocity * Math.cos(radians)).toFixed(2);
            heightResult.textContent = (dataPoints.reduce((max, point) => (point.height > max ? point.height : max), -Infinity)).toFixed(2);
            timeResult.textContent = dataPoints[dataPoints.length - 1].time.toFixed(2);

            updateTrajectoryChart(dataPoints, radians);
        } else {
            alert("Os dados inseridos são inválidos, tente novamente");
        }
    });

    function updateTrajectoryChart(dataPoints, angleRadians) {
        const labels = dataPoints.map(point => point.time.toFixed(2));
        const heights = dataPoints.map(point => point.height.toFixed(2));

        // Calcula os pontos da linha vermelha com base no ângulo
        const angleData = [];
        for (let i = 0; i < dataPoints.length; i++) {
            const x = dataPoints[i].time;
            const y = x * Math.tan(angleRadians);
            angleData.push(y);
        }

        const ctx = document.getElementById('canvas').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Percurso do Projétil',
                        data: heights,
                        borderColor: 'blue',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Ângulo',
                        data: angleData,
                        borderColor: 'orange',
                        borderWidth: 1,
                        fill: false,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Tempo (s)'
                        },
                        grid: { // Configuração das grades no eixo X
                            display: false, // Desativa as grades no eixo X
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Altura (m)'
                        },
                        grid: { // Configuração das grades no eixo Y
                            display: false, // Desativa as grades no eixo Y
                        }
                    }
                }
            }
        });

        // Atualiza a posição do ângulo no gráfico
        chart.data.datasets[1].data = angleData;
        chart.update();

        // Calcula a posição do ângulo no gráfico
        const anglePosition = {
            x: 0.1 * dataPoints[dataPoints.length - 1].time,
            y: 0.1 * Math.tan(angleRadians) * dataPoints[dataPoints.length - 1].time
        };
        angleInChartInput.value = `X: ${anglePosition.x.toFixed(2)}, Y: ${anglePosition.y.toFixed(2)}`;
    }

});