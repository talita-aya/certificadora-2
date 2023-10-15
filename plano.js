const angleInput = document.getElementById("angle-plane");
const massInput = document.getElementById("mass");
const velocity = document.getElementById("initial-velocity");
const simulator = document.getElementById("canvas-plane");
const object = document.getElementById("object");
const slope = document.getElementById("slope");

let timer = null;


function updateAngle(){
    const angle = angleInput.value;
    slope.style.transform = `rotate(${angle}deg)`;
}


angleInput.addEventListener('input', updateAngle);