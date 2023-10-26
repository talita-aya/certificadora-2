function calcularLancamentoProjetil() {
    const velocity = parseFloat(document.getElementById("velocity").value);
    const angle = parseFloat(document.getElementById("angle").value);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    if (isNaN(velocity) || isNaN(angle)) {
        alert("Insira os valores pedidos, por favor");
        return;
    }

    const projectile = {
        velocity: velocity,
        angle: angle,
        angleRad: (angle * Math.PI) / 180,
        height: 0,
        range: 0,
        time: 0,
    }

    // altura máxima
    projectile.height = (Math.pow(projectile.velocity, 2) * Math.pow(Math.sin(projectile.angleRad), 2)) / (2 * 9.81);

    // distância
    projectile.range = (Math.pow(projectile.velocity, 2) * Math.sin(2 * projectile.angleRad)) / 9.81;

    // tempo
    projectile.time = (2 * projectile.velocity * Math.sin(projectile.angleRad)) / 9.81;

    // resultados
    document.getElementById("height").textContent = projectile.height.toFixed(2);
    document.getElementById("range").textContent = projectile.range.toFixed(2);
    document.getElementById("time").textContent = projectile.time.toFixed(2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // reta do ângulo
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    const deltaX = Math.cos(projectile.angleRad) * canvas.width;
    const deltaY = -Math.sin(projectile.angleRad) * canvas.width;
    ctx.lineTo(deltaX, canvas.height + deltaY);
    ctx.stroke();
    ctx.closePath();

    // linha pontilhada
    ctx.setLineDash([3, 3]);

    // trajetória do lançamento de projétil
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    let lastX, lastY;
    for (let t = 0; t <= projectile.time; t += 0.1) {
        const x = projectile.velocity * Math.cos(projectile.angleRad) * t;
        const y =
            canvas.height -
            (projectile.velocity * Math.sin(projectile.angleRad) * t - 0.5 * 9.81 * Math.pow(t, 2));
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
    ctx.fillText(`${projectile.angle.toFixed(0)}°`, 40, canvas.height - 10);

    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, canvas.height, 30, 0, -projectile.angleRad, true);
    ctx.stroke();

    ctx.setLineDash([]);
}

document.getElementById("button-simulator").addEventListener("click", calcularLancamentoProjetil);
