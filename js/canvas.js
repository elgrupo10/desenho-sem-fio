const canvas = document.querySelector("#canvas");
let canvasEl = document.querySelector("#gridCanvas");
let canvasRect = canvas.getBoundingClientRect();
let body = document.body;
const ctx = canvas.getContext('2d');
let colorEl = document.querySelector("#seletor-rgb");







ctx.canvas.height = canvasEl.offsetHeight;
ctx.canvas.width = canvasEl.offsetWidth;

function mudaCor() {
    ctx.strokeStyle = colorEl.value;
    console.log("bom dia");
}
let estaPintando = false;
function comeco(e){
    estaPintando = true;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
}

function fim(){
    estaPintando = false;
    ctx.beginPath();
}

function naopinte(e){
    // console.log(e.clientX);
    // console.log(e.clientY);
     if(e.clientX < canvasRect.x || e.clientY < canvasRect.y || e.clientY > canvasRect.height + canvasRect.y || e.clientX > canvasRect.width + canvasRect.x){
         fim();
     }     
}
function desenhar(e){
    if(!estaPintando)return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
}

function redimensionar(){
    //console.log(canvasRect);
    canvasRect = canvas.getBoundingClientRect();
    ctx.canvas.height = canvasEl.offsetHeight;
    ctx.canvas.width = canvasEl.offsetWidth;
}
//console.log(canvasRect);
canvas.addEventListener("mousedown",comeco);
canvas.addEventListener("mouseup",fim);
canvas.addEventListener("mousemove",desenhar);
window.addEventListener("resize",redimensionar);
body.addEventListener("mousemove",naopinte);
colorEl.addEventListener("change", mudaCor);
redimensionar();