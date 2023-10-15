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
    ctx.closePath();
    ctx.stroke();

    // bolinha no final
    ctx.beginPath();
    ctx.arc(lastX-8, lastY-5, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#31C6F6";
    ctx.fill();
    ctx.closePath();

    ctx.setLineDash([]);
}

document
    .getElementById("button-simulator")
    .addEventListener("click", calcularLancamentoProjetil);
