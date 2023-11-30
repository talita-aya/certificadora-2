class Projectile {
    constructor(velocity, angle) {
        this.velocity = velocity;
        this.angle = angle;
        this.angleRad = (angle * Math.PI) / 180;
        this.height = 0;
        this.range = 0;
        this.time = 0;
    }

    calculate() {
        this.height = (Math.pow(this.velocity, 2) * Math.pow(Math.sin(this.angleRad), 2)) / (2 * 9.81);
        this.range = (Math.pow(this.velocity, 2) * Math.sin(2 * this.angleRad)) / 9.81;
        this.time = (2 * this.velocity * Math.sin(this.angleRad)) / 9.81;
    }
}

class ProjectileSimulator {
    constructor() {
        this.velocity = 0;
        this.angle = 0;
        this.canvas = null;
        this.projectile = null;
    }

    initialize() {
        document.getElementById("button-simulator").addEventListener("click", () => this.calculateProjectile());
        document.getElementById("downloadButton").addEventListener("click", () => this.downloadData());
        this.canvas = document.getElementById("canvas");
    }

    calculateProjectile() {
        this.velocity = parseFloat(document.getElementById("velocity").value);
        this.angle = parseFloat(document.getElementById("angle").value);

        if (isNaN(this.velocity) || isNaN(this.angle)) {
            alert("Insira os valores pedidos, por favor");
            return;
        }

        this.projectile = new Projectile(this.velocity, this.angle);
        this.projectile.calculate();

        this.displayResults();
        this.drawTrajectory();
    }

    displayResults() {
        document.getElementById("height").textContent = this.projectile.height.toFixed(2);
        document.getElementById("range").textContent = this.projectile.range.toFixed(2);
        document.getElementById("time").textContent = this.projectile.time.toFixed(2);
    }

    drawTrajectory() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // reta do ângulo
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height);
        const deltaX = Math.cos(this.projectile.angleRad) * this.canvas.width;
        const deltaY = -Math.sin(this.projectile.angleRad) * this.canvas.width;
        ctx.lineTo(deltaX, this.canvas.height + deltaY);
        ctx.stroke();
        ctx.closePath();
    
        // linha pontilhada
        ctx.setLineDash([3, 3]);
    
        // trajetória do lançamento de projétil
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height);
        let lastX, lastY;
        for (let t = 0; t <= this.projectile.time; t += 0.1) {
            const x = this.projectile.velocity * Math.cos(this.projectile.angleRad) * t;
            const y =
                this.canvas.height -
                (this.projectile.velocity * Math.sin(this.projectile.angleRad) * t - 0.5 * 9.81 * Math.pow(t, 2));
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
        ctx.fillText(`${this.projectile.angle.toFixed(0)}°`, 40, this.canvas.height - 10);
    
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(0, this.canvas.height, 30, 0, -this.projectile.angleRad, true);
        ctx.stroke();
    
        ctx.setLineDash([]);
    }
    

    downloadData() {
        if (!this.velocity || isNaN(this.velocity) || isNaN(this.angle) || !this.projectile) {
            alert("Utilize o simulador antes, por favor");
            return;
        }

        const data = this.generateData();
        const csvContent = "Tempo (s); Distancia (m); Altura (m); Velocidade (m/s)\n" + data.join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const downloadLink = document.createElement("a");

        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = "projectile_data.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    generateData() {
        const data = [];

        for (let t = 0; t <= this.projectile.time; t += 0.1) {
            const v0x = this.velocity * Math.cos(this.projectile.angleRad);
            const v0y = this.velocity * Math.sin(this.projectile.angleRad);
            const a = -9.81;

            const x = v0x * t;
            const y = v0y * t + 0.5 * a * t * t;
            const vx = v0x;
            const vy = v0y + a * t;
            const v = Math.sqrt(vx ** 2 + vy ** 2);

            data.push(`${t.toFixed(2)};${x.toFixed(2)};${y.toFixed(2)};${v.toFixed(2)}`);
        }

        data.push(`${this.projectile.time.toFixed(2)};${this.projectile.range.toFixed(2)};${'0.00'};${'0.00'}`);
        return data;
    }
}

// Uso da classe
const simulator = new ProjectileSimulator();
simulator.initialize();
