const angleInput = document.getElementById("angle-plane");
const velocityInput = document.getElementById("initial-velocity");
const massInput = document.getElementById("mass");

const simulator = document.getElementById("canvas-plane");
const object = document.getElementById("object");
const slope = document.getElementById("slope");

const frResult = document.getElementById("fr-result");
const fpResult = document.getElementById("fp-result");
const fnResult = document.getElementById("fn-result");
const aResult = document.getElementById("a-result");

const resetButton = document.getElementById('button-simulator-reset');
const startButton = document.getElementById('button-simulator-plane');
const pauseButton = document.getElementById('button-simulator-pause');

let timer = null; //verificar se ta sendo usado
let isPaused = false;

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
    const mass = parseFloat(massInput.value);
    const velocity = parseFloat(velocityInput.value);
    const angle = parseFloat(angleInput.value);

    if(!isNaN(velocity) && !isNaN(mass)){
        resetSimulation();

        //aceleração fixa, devido a gravidade (m/s²)
        const g = 9.81; 

        //transformando o angulo em radiano
        const radians = (angle*Math.PI)/180;

        //cálculo da aceleração (a)
        const acceleration = g*Math.sin(radians);

        //cálculo da força resultante (Fr)
        const resultantForce = mass * acceleration;

        //cálculo da força peso (P)
        const weightForce = mass * g;

        //inserir força normal: Fn=Py -> Fn=Pcos(º) = mgcos(º) 
        const normalForce = mass * g * Math.cos(radians);


        //apresentar os resultados
        frResult.textContent = resultantForce.toFixed(2);
        fpResult.textContent = weightForce.toFixed(2);
        fnResult.textContent = normalForce.toFixed(2);
        aResult.textContent = acceleration.toFixed(2);

        const timeInterval = 15; 

        //animação que faz o bloco se mover pelo plano
        function animate(){
            const position = parseFloat(object.style.left) || 0; //obtém posição atual do objeto em relação a esquerda
            const velocityPosition = velocity + acceleration * (position/100); //ajusta a velocidade do bloco com base na aceleração
            const newPosition = position + (velocityPosition * timeInterval) / 1000; //cálcula a nova posição do objeto após um intervalo de tempo
            object.style.left = newPosition + 'px'; //nova posição atribuida 

            //loop para que o objeto continue se movendo 
            if(newPosition < simulator.clientWidth - object.clientWidth){
                timer = setTimeout(animate, 1);
            }
        }
        animate();
    }else {
        alert("Os dados inseridos são inválidos, tente novamente");
    }
    
});
