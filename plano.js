class Simulation {
    constructor(angleInput, velocityInput, massInput) {
      this.angleInput = angleInput;
      this.velocityInput = velocityInput;
      this.massInput = massInput;
      this.mass = 0;
      this.velocity = 0;
      this.angle = 15; 
      this.g = 9.81;
      this.radians = 0;
      this.acceleration = 0;
      this.resultantForce = 0;
      this.weightForce = 0;
      this.normalForce = 0;
      this.timeInterval = 15;
      this.position = 0;
      this.newPosition = 0;
  
      this.angleInput.addEventListener('input', () => this.handleAngleInput());
    }
  
    handleAngleInput() {
      const angle = this.angleInput.value;
      slope.style.transform = `rotate(${angle}deg)`;
      this.angle = parseFloat(angle);
      this.calculateValues();
    }
  
    calculateValues() {
      this.radians = (this.angle * Math.PI) / 180;
      this.acceleration = this.g * Math.sin(this.radians);
      this.resultantForce = this.mass * this.acceleration;
      this.weightForce = this.mass * this.g;
      this.normalForce = this.mass * this.g * Math.cos(this.radians);
    }

    
  }
  
  class Animation {
    constructor(simulation, object, path, simulator) {
      this.simulation = simulation;
      this.object = object;
      this.path = path;
      this.simulator = simulator;
      this.timer = null;
      this.isPaused = false;
      this.elapsedTime = 0; //rastrear o tempo decorrido
    }
  
    resetAnimation() {
      clearTimeout(this.timer);
      this.simulation.position = 0;
      this.simulation.newPosition = 0;
      this.object.style.left = '0';
      this.path.style.width = "0";
      this.elapsedTime = 0;
    }
  
    animate() {
      const velocityPosition =
        this.simulation.velocity + this.simulation.acceleration * (this.simulation.position / 100);
      this.simulation.newPosition =
        this.simulation.position + (velocityPosition * this.simulation.timeInterval) / 1000;
      this.object.style.left = this.simulation.newPosition + 'px';
      this.path.style.width =
        parseFloat(this.path.style.width) + Math.abs(this.simulation.newPosition - this.simulation.position) + "px";
      this.simulation.position = this.simulation.newPosition;
  
      this.elapsedTime += this.simulation.timeInterval / 1000; // Atualiza o tempo decorrido

      if (this.simulation.newPosition < this.simulator.clientWidth - this.object.clientWidth) {
        this.timer = setTimeout(() => this.animate(), 1);
      }
    }

    getElapsedTime() {
        return this.elapsedTime;
    }
  }
  
  // Elementos do DOM
  const angleInput = document.getElementById("angle-plane");
  const velocityInput = document.getElementById("initial-velocity");
  const massInput = document.getElementById("mass");
  const simulator = document.getElementById("canvas-plane");
  const object = document.getElementById("object");
  const slope = document.getElementById("slope");
  const path = document.getElementById("path");
  
  // Resultados
  const frResult = document.getElementById("fr-result");
  const fpResult = document.getElementById("fp-result");
  const fnResult = document.getElementById("fn-result");
  const aResult = document.getElementById("a-result");
  
  // Botões
  const resetButton = document.getElementById('button-simulator-reset');
  const startButton = document.getElementById('button-simulator-plane');
  const pauseButton = document.getElementById('button-simulator-pause');
  const downloadButton = document.getElementById('download-button');

    downloadButton.addEventListener('click', function () {
        const results = calculateResults();

        if (!isNaN(simulation.velocity) && !isNaN(simulation.mass)) {
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
    });

    function calculateResults() {
        const results = [];
        const elapsedTime = animation.getElapsedTime();

        for(let i=0; i <= elapsedTime; i+=0.1) { // calcula até que a simulação seja pausada
          const velocity = simulation.velocity + simulation.acceleration * i;
          const distance = simulation.velocity * i + 0.5 * simulation.acceleration * i * i;
         
          results.push({
            time: i,
            velocity: velocity,
            distance: distance,
          });
        }

        // Exibe os resultados no console
        //results.forEach(result => {
        //    console.log(`Tempo: ${result.time.toFixed(2)}}s, Distancia: ${result.distance.toFixed(2)}m, Velocidade: ${result.velocity.toFixed(2)}m/s`);
        //});
      
        return results;
      }

  
  // Criar instância da classe Simulation
  const simulation = new Simulation(angleInput, velocityInput, massInput);
  
  // Criar instância da classe Animation
  const animation = new Animation(simulation, object, path, simulator);
  
  function resetSimulationAndAnimation() {
    simulation.calculateValues();
    animation.resetAnimation();
  }
  
  resetButton.addEventListener('click', resetSimulationAndAnimation);
  
  pauseButton.addEventListener('click', function () {
    if (!animation.isPaused) {
        clearTimeout(animation.timer);
        animation.isPaused = true;
    } else {
      animation.isPaused = false;
    }

    animation.isPaused = false;
  });
  
  startButton.addEventListener('click', function () {
    simulation.mass = parseFloat(massInput.value);
    simulation.velocity = parseFloat(velocityInput.value);
  
    if (!isNaN(simulation.velocity) && !isNaN(simulation.mass)) {
      resetSimulationAndAnimation();
      simulation.calculateValues();
  
      // Apresentar os resultados
      frResult.textContent = simulation.resultantForce.toPrecision(4);
      fpResult.textContent = simulation.weightForce.toPrecision(4);
      fnResult.textContent = simulation.normalForce.toPrecision(4);
      aResult.textContent = simulation.acceleration.toPrecision(4);
  
      // Iniciar a animação
      animation.animate();
    } else {
      alert("Os dados inseridos são inválidos, tente novamente");
    }
  });