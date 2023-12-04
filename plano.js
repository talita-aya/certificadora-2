class Calculator {
    constructor(angleInput, velocityInput, massInput) {
        this.angleInput = angleInput; //angulo inserido
        this.velocityInput = velocityInput; //velocidade inicial inserida
        this.massInput = massInput; //massa do objeto inserido
        this.mass = 0; 
        this.velocity = 0;
        this.angle = 15;
        this.g = 9.81; //gravidade
        this.radians = 0; //angulo em radianos
        this.acceleration = 0; //aceleração
        this.resultantForce = 0; //força resultante
        this.weightForce = 0; //força peso
        this.normalForce = 0; //força normal
        this.timeInterval = 15; 
        this.position = 0;
        this.newPosition = 0;

        this.angleInput.addEventListener('input', () => this.handleAngleInput());
    }

    //cálculo para rotação do plano
    handleAngleInput() {
        const angle = this.angleInput.value;
        slope.style.transform = `rotate(${angle}deg)`;
        this.angle = parseFloat(angle);
        this.calculateValues();
    }

    //cálculos grandezas gerais
    calculateValues() {
        this.radians = (this.angle * Math.PI) / 180; //converte o ângulo em radianos
        this.acceleration = this.g * Math.sin(this.radians); //cálculo da aceleração
        this.resultantForce = this.mass * this.acceleration; //cálculo da força resultante
        this.weightForce = this.mass * this.g * Math.sin(this.radians); //cálculo da força peso
        this.normalForce = this.mass * this.g * Math.cos(this.radians); //cálculo da força normal
    }
}

class Animation {
    constructor(calculator, object, path, simulator) {
        this.calculator = calculator;
        this.object = object;
        this.path = path;
        this.simulator = simulator;
        this.timer = null;
        this.isPaused = false;
        this.elapsedTime = 0; // rastrear o tempo decorrido
    }

    // Método para atualizar o tempo no HTML
    updateElapsedTime() {
        document.getElementById("time").textContent = this.elapsedTime.toFixed(2);
    }

    //reiniciar simulação
    resetAnimation() {
        clearTimeout(this.timer);
        this.calculator.position = 0;
        this.calculator.newPosition = 0;
        this.object.style.left = '0';
        this.path.style.width = "0";
        this.elapsedTime = 0;
    }

    //animação de movimento do bloco
    animate() {
        const velocityPosition =
            this.calculator.velocity + this.calculator.acceleration * (this.calculator.position / 100);
        this.calculator.newPosition =
            this.calculator.position + (velocityPosition * this.calculator.timeInterval) / 1000;
        this.object.style.left = this.calculator.newPosition + 'px';
        this.path.style.width =
            parseFloat(this.path.style.width) + Math.abs(this.calculator.newPosition - this.calculator.position) + "px";
        this.calculator.position = this.calculator.newPosition;

        this.elapsedTime += this.calculator.timeInterval / 1000; // Atualiza o tempo decorrido
        this.updateElapsedTime(); // Atualiza o tempo no HTML

        if (this.calculator.newPosition < this.simulator.clientWidth - this.object.clientWidth) {
            this.timer = setTimeout(() => this.animate(), 1);
        }
    }

    //retorna o tempo total do bloco até ter pausado
    getElapsedTime() {
        return this.elapsedTime;
    }
}

class SimulationApp {
    constructor() {
        // Elementos do DOM
        this.angleInput = document.getElementById("angle-plane");
        this.velocityInput = document.getElementById("initial-velocity");
        this.massInput = document.getElementById("mass");
        this.simulator = document.getElementById("canvas-plane");
        this.object = document.getElementById("object");
        this.slope = document.getElementById("slope");
        this.path = document.getElementById("path");

        // Resultados
        this.frResult = document.getElementById("fr-result");
        this.fpResult = document.getElementById("fp-result");
        this.fnResult = document.getElementById("fn-result");
        this.aResult = document.getElementById("a-result");

        // Botões
        this.resetButton = document.getElementById('button-simulator-reset');
        this.startButton = document.getElementById('button-simulator-plane');
        this.pauseButton = document.getElementById('button-simulator-pause');
        this.downloadButton = document.getElementById('download-button');


        // Criar instância da classe Calculator
        this.calculator = new Calculator(this.angleInput, this.velocityInput, this.massInput);

        // Criar instância da classe Animation
        this.animation = new Animation(this.calculator, this.object, this.path, this.simulator);

        this.resetButton.addEventListener('click', () => this.resetSimulationAndAnimation());

        this.pauseButton.addEventListener('click', () => this.togglePause());

        this.startButton.addEventListener('click', () => this.startSimulation());

        this.downloadButton.addEventListener('click', () => this.downloadCSV());
    }

    //reinicar a simulação
    resetSimulationAndAnimation() {
        this.calculator.calculateValues();
        this.animation.resetAnimation();
    }

    //pausar a simulação
    togglePause() {
        if (!this.animation.isPaused) {
            clearTimeout(this.animation.timer);
            this.animation.isPaused = true;
        } else {
            this.animation.isPaused = false;
        }

        this.animation.isPaused = false;
    }

    //iniciar simulação
    startSimulation() {
        this.calculator.mass = parseFloat(this.massInput.value);
        this.calculator.velocity = parseFloat(this.velocityInput.value);

        if (!isNaN(this.calculator.velocity) || !isNaN(this.calculator.mass)) {
            this.resetSimulationAndAnimation();
            this.calculator.calculateValues();

            // Apresentar os resultados
            this.frResult.textContent = this.calculator.resultantForce.toPrecision(4);
            this.fpResult.textContent = this.calculator.weightForce.toPrecision(4);
            this.fnResult.textContent = this.calculator.normalForce.toPrecision(4);
            this.aResult.textContent = this.calculator.acceleration.toPrecision(4);

            // Iniciar a animação
            this.animation.animate();
        } else {
            alert("Os dados inseridos são inválidos, tente novamente");
        }
    }

    //criar planilha de velocidade em relação ao tempo
    downloadCSV() {
        const results = this.calculateVelocityAndTime();

        if (isNaN(this.calculator.velocity) || isNaN(this.calculator.mass)) {
            alert("Utilize o simulador antes, por favor");
            return;
        }

        // Criação do conteúdo CSV
        const csvContent = "Tempo (s); Distancia (m); Velocidade (m/s)\n" +
            results.map(result => result.time.toFixed(2) + ";" + result.distance.toFixed(2) + ";" + result.velocity.toFixed(2)).join("\n");

        // Criação de um objeto Blob para o conteúdo CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Criação de um link para download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dados_plano.csv';

        // Adiciona o link ao corpo do documento e realiza o clique para iniciar o download
        document.body.appendChild(link);
        link.click();

        // Remove o link após o download
        document.body.removeChild(link);
    }

    //cálculos da velocidade em relação ao tempo
    calculateVelocityAndTime() {
        const results = [];
        const elapsedTime = this.animation.getElapsedTime();

        for (let i = 0; i <= elapsedTime; i += 0.1) { // calcula até que a simulação seja pausada e conta a cada 0.1 segundos
            const velocity = this.calculator.velocity + this.calculator.acceleration * i;
            const distance = this.calculator.velocity * i + 0.5 * this.calculator.acceleration * i * i;

            results.push({
                time: i,
                velocity: velocity,
                distance: distance,
            });
        }

        return results;
    }
}

// Criar instância da classe SimulationApp
const simulationApp = new SimulationApp();