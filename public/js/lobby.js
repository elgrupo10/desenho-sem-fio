const inputNomeEl = document.querySelector("#nomeJogador");
const maskEl = document.querySelector(".mask");
const modalNomeEl = document.querySelector("#nome");
const palyers = document.querySelectorAll(".jogador");
const headers = new Headers({
    "Content-Type": "application/json"
})
let playersContainer = document.querySelector("#jogadores");
let avisoNome = document.querySelector("#aviso-nome");
let readyEl = document.querySelector("#ready");
let tituloEl = document.querySelector("#tituloTelaDeJogadores");
let startEl = document.querySelector("#iniciar-lider");
let vJogadores = [];
let ready = 0;
let tipoDeInicio = 0;
let buscar = 1;
let comecar = 0;
let lider = "";
buscarJogadores();

if (localStorage.getItem("nome") == null) {

    maskEl.classList.add("aparecer");
    modalNomeEl.classList.add("aparecer");
    inputNomeEl.focus();
    buscar = 0;

}else{
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), pronto: 0 }) })
    
}

maskEl.addEventListener("click", () => {
    inputNomeEl.focus();
})


inputNomeEl.addEventListener("change", () => {   
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({nome: inputNomeEl.value, pronto:0 })})
        .then(r => r.json())
        .then(r => {
            if(r.changeUsername){
                avisoNome.style.display = "block";

            }else{
                maskEl.classList.remove("aparecer");
                modalNomeEl.classList.remove("aparecer");
            }
        });
    buscarJogadores();
    buscar = 1;
    localStorage.setItem("nome",inputNomeEl.value);
})

function registrarJogadores(){
    playersContainer.innerHTML = "";
    for (let i = 0; i < vJogadores.length; i++) {
        let jogadorEl = document.createElement("span");
        if(vJogadores[i].pronto)jogadorEl.classList.add("pronto");
        if (lider == vJogadores[i].nome) {
            jogadorEl.innerHTML = vJogadores[i].nome + `<i class="fas fa-crown coroa"></i>`;
        }else{
            jogadorEl.innerHTML = vJogadores[i].nome;
        }
        jogadorEl.classList.add("jogador");
        playersContainer.appendChild(jogadorEl);
    }
    if(lider == localStorage.getItem("nome")){
        console.log("eu sou");
        startEl.style.display = "inline";
    }
}




function buscarJogadores() {
    if(!buscar)return;
    vJogadores = [];
    fetch("/jogadores")
        .then(function (r) {
            return r.json();
        })
        .then(r => {
            lider = r.lider;
            for(let i=0;i<r.jogadores.length;i++){
                    vJogadores.push({"nome": r.jogadores[i].nome,"pronto":r.jogadores[i].pronto});
            }
            registrarJogadores();
            if(r.estado == "jogando"){
                comecar = 1;
            }
            tipoDeInicio = r.tipoDeInicio;
        });
    
}


function changeReadyState(){
    ready = 1 - ready;
    readyEl.classList.toggle("btn-success");
    readyEl.classList.toggle("btn-danger");
    readyEl.innerHTML = ready ? "NÃO PRONTO!" : "PRONTO!";
    fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({nome: localStorage.getItem("nome")})})
         
        
}


function jogadorSaindo(){
    if(!localStorage.getItem("nome"))return;
    fetch("/saindo", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome")}) })
    
}

function iniciarPartida(){
    if(!comecar)return;
    clearInterval(inicia);
    clearInterval(busca);
    readyEl.disabled = true;
    startEl.disabled = true;
    let timeleft = 3;
    let timer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(timer);
            location.href = "/game";
        } else {
            if(tipoDeInicio){
                if(timeleft<=1){
                    tituloEl.innerHTML = `O líder iniciou a partida! ${timeleft} segundo até a partida começar!`;
                }else{
                    tituloEl.innerHTML = `O líder iniciou a partida! ${timeleft} segundos até a partida começar!`;
                }
            }else{
                if(timeleft<=1){
                    tituloEl.innerHTML = `Todos os jogadores estão prontos! ${timeleft} segundo até a partida começar!`;
                }else{
                    tituloEl.innerHTML = `Todos os jogadores estão prontos! ${timeleft} segundos até a partida começar!`;
                }
            }
        }
        timeleft--;
    }, 1000);

}

function avisarServer(){
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({start: 1}) })
    
}

window.addEventListener("beforeunload", jogadorSaindo);
readyEl.addEventListener("click", changeReadyState);
startEl.addEventListener("click", avisarServer);


let busca = setInterval(buscarJogadores, 50);
let inicia = setInterval(iniciarPartida,50);

