const angleInput = document.getElementById("angle-plane");
const velocityInput = document.getElementById("initial-velocity");
const massInput = document.getElementById("mass");

const simulator = document.getElementById("canvas-plane");
const object = document.getElementById("object");
const slope = document.getElementById("slope");

const frResult = document.getElementById("fr-result");
const fpResult = document.getElementById("fp-result");
const aResult = document.getElementById("a-result");

const resetButton = document.getElementById('button-simulator-reset');
const startButton = document.getElementById('button-simulator-plane');
const pauseButton = document.getElementById('button-simulator-pause');


let timer = null;
let isPaused = false;


angleInput.addEventListener('input', function(){
    const angle = angleInput.value;
    slope.style.transform = `rotate(${angle}deg)`;
});

function resetSimulation() {
    clearTimeout(timer);
    isPaused = false;
    object.style.left = '0'; //verificar essa linha
    frResult.textContent = '0';
    fpResult.textContent = '0';
    aResult.textContent = '0';
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
    const massValue = parseFloat(massInput.value);
    const velocityValue = parseFloat(velocityInput.value);

    if(!isNaN(velocityValue) && !isNaN(massValue)){
        resetSimulation();

        const angle = parseFloat(angleInput.value);
        const mass = parseFloat(massInput.value);
        const velocity = parseFloat(velocityInput.value);
        const g = 9.81; //aceleração fixa, devido a gravidade (m/s²)
        const radians = (angle*Math.PI)/180;

        //cálculo da aceleração (a)
        const acceleration = g*Math.sin(radians);

        //cálculo da força resultante (Fr)
        const resultantForce = mass * acceleration;

        //cálculo da força peso (P)
        const weightForce = mass * g;

        frResult.textContent = resultantForce.toFixed(2);
        fpResult.textContent = weightForce.toFixed(2);
        aResult.textContent = acceleration.toFixed(2);

        const timeInterval = 15; 

        function animate(){
            const position = parseFloat(object.style.left) || 0;
            const velocityPosition = velocity + acceleration * (position/100);
            const newPosition = position + (velocityPosition * timeInterval) / 1000;
            object.style.left = newPosition + 'px';

            if(newPosition < simulator.clientWidth - object.clientWidth){
                timer = setTimeout(animate, 1);
            }
        }
        animate();
    }else {
        alert("Os dados inseridos são inválidos, tente novamente");
    }
    
});
