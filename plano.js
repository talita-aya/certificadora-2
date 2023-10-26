const angleInput = document.getElementById("angle-plane");
const velocityInput = document.getElementById("initial-velocity");
const massInput = document.getElementById("mass");

const simulator = document.getElementById("canvas-plane");
const object = document.getElementById("object");
const slope = document.getElementById("slope");
const path = document.getElementById("path");

const frResult = document.getElementById("fr-result");
const fpResult = document.getElementById("fp-result");
const fnResult = document.getElementById("fn-result");
const aResult = document.getElementById("a-result");

const resetButton = document.getElementById('button-simulator-reset');
const startButton = document.getElementById('button-simulator-plane');
const pauseButton = document.getElementById('button-simulator-pause');

let timer = null; //verificar se ta sendo usado
let isPaused = false;

//estrutura de dados
const simulationData = {
    mass: 0, //massa do objeto
    velocity: 0, //velocidade inical
    angle: 0, //ângulo de inclinação do plano
    g: 9.81, //gravidade (constante)
    radians: 0, //ângulo convertido para radiano
    acceleration: 0, //aceleração do objeto
    resultantForce: 0, //força resultante na direção do movimento
    weightForce: 0, //força peso (gravidade)
    normalForce: 0, //força normal (perpendicular ao plano)
    timeInterval: 15, //intervalo de tempo para a animaçãp
    position: 0, //posição atual do objeto na animação
    newPosition: 0, //nova posição calculada durante a animação
  };
  

//inclinação do plano
angleInput.addEventListener('input', function(){
    const angle = angleInput.value;
    slope.style.transform = `rotate(${angle}deg)`;
});

function resetSimulation() {
    clearTimeout(timer);
    isPaused = false;
    object.style.left = '0';
    frResult.textContent = '0';
    fpResult.textContent = '0';
    fnResult.textContent = '0';
    aResult.textContent = '0';
    path.style.width = "0";

    //reinicialização da estrutura de dados
    simulationData.position = 0;
    simulationData.newPosition = 0;
}

resetButton.addEventListener('click', resetSimulation);

pauseButton.addEventListener('click', function(){
    if (!isPaused) {
        isPaused = true;
        clearTimeout(timer);
      } else {
        isPaused = false;
      }
});


startButton.addEventListener('click', function() {
    simulationData.mass = parseFloat(massInput.value);
    simulationData.velocity = parseFloat(velocityInput.value);
    simulationData.angle = parseFloat(angleInput.value);

    if(!isNaN(simulationData.velocity) && !isNaN(simulationData.mass)){
        resetSimulation();

        //transformando o angulo em radiano
        simulationData.radians = (simulationData.angle * Math.PI)/180;

        //cálculo da aceleração (a)
        simulationData.acceleration = simulationData.g * Math.sin(simulationData.radians);

        //cálculo da força resultante (Fr)
        simulationData.resultantForce = simulationData.mass * simulationData.acceleration;

        //cálculo da força peso (P)
        simulationData.weightForce = simulationData.mass * simulationData.g;

        //inserir força normal: Fn=Py -> Fn=Pcos(º) = mgcos(º) 
        simulationData.normalForce = simulationData.mass * simulationData.g * Math.cos(simulationData.radians);


        //apresentar os resultados
        frResult.textContent = simulationData.resultantForce.toFixed(2);
        fpResult.textContent = simulationData.weightForce.toFixed(2);
        fnResult.textContent = simulationData.normalForce.toFixed(2);
        aResult.textContent = simulationData.acceleration.toFixed(2);

        let position = 0 

        //animação que faz o bloco se mover pelo plano
        function animate(){
            //const position = parseFloat(object.style.left) || 0; //obtém posição atual do objeto em relação a esquerda
            const velocityPosition = simulationData.velocity + simulationData.acceleration * (position/100); //ajusta a velocidade do bloco com base na aceleração
            simulationData.newPosition = position + (velocityPosition * simulationData.timeInterval) / 1000; //cálcula a nova posição do objeto após um intervalo de tempo
            object.style.left = simulationData.newPosition + 'px'; //nova posição atribuida 

            path.style.width = parseFloat(path.style.width) + Math.abs(simulationData.newPosition - position) + "px";
            position = simulationData.newPosition;


            //loop para que o objeto continue se movendo 
            if(simulationData.newPosition < simulator.clientWidth - object.clientWidth){
                timer = setTimeout(animate, 1);
            }
        }
        animate();
    }else {
        alert("Os dados inseridos são inválidos, tente novamente");
    }
    
});
