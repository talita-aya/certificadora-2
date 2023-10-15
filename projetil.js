// Função para calcular o lançamento de projétil
function calcularLancamentoProjetil() {
    const velocity = parseFloat(document.getElementById("velocity").value);
    const angle = parseFloat(document.getElementById("angle").value);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // ângulo de graus para radianos
    const angleRad = (angle * Math.PI) / 180;

    // altura máxima
    const height =
        (Math.pow(velocity, 2) * Math.pow(Math.sin(angleRad), 2)) / (2 * 9.81);

    // distância
    const range = (Math.pow(velocity, 2) * Math.sin(2 * angleRad)) / 9.81;

    // tempo
    const time = (2 * velocity * Math.sin(angleRad)) / 9.81;

    // resultados
    document.getElementById("height").textContent = height.toFixed(2);
    document.getElementById("range").textContent = range.toFixed(2);
    document.getElementById("time").textContent = time.toFixed(2);

    // limpar o canvas para recomeçar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a reta inclinada
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    const deltaX = Math.cos(angleRad) * canvas.width;
    const deltaY = -Math.sin(angleRad) * canvas.width;
    ctx.lineTo(deltaX, canvas.height + deltaY);
    ctx.stroke();
    ctx.closePath();

    // linha pontilhada para trajetória
    ctx.setLineDash([3, 3]);

    // trajetória do lançamento de projétil
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    let lastX, lastY;
    for (let t = 0; t <= time; t += 0.1) {
        const x = velocity * Math.cos(angleRad) * t;
        const y =
            canvas.height -
            (velocity * Math.sin(angleRad) * t - 0.5 * 9.81 * Math.pow(t, 2));
        ctx.lineTo(x, y);
        lastX = x;
        lastY = y;
    }

    ctx.strokeStyle = "#FFE0B1";
    ctx.lineWidth = 2;
    ctx.stroke();

    // bolinha no final
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#31C6F6";
    ctx.fill();

    // mostrar o ângulo
    ctx.fillStyle = "orange";
    ctx.font = "12px Arial";
    ctx.fillText(`${angle.toFixed(0)}°`, 40, canvas.height - 10);

    // Desenhar o arco interno para representar o ângulo em relação ao eixo x
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, canvas.height, 30, 0, -angleRad, true);
    ctx.stroke();

    ctx.setLineDash([]);
}

document
    .getElementById("button-simulator")
    .addEventListener("click", calcularLancamentoProjetil);
