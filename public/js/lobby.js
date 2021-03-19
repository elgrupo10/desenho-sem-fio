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
buscarJogadores()

window.addEventListener("click",e => {
    console.log(e.target.id);
    if(e.target.id == "pen-container")mudarNome();
})
function mudarNome(){
    fetch("/trocandoNome", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome")}) });
    localStorage.removeItem("nome");
    location.reload();
}
if (localStorage.getItem("nome") == null) {

    maskEl.classList.add("aparecer");
    modalNomeEl.classList.add("aparecer");
    inputNomeEl.focus();

}else{
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), pronto: 0 }) })
    buscarJogadores();
    
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
        if (vJogadores[i].pronto) jogadorEl.classList.add("pronto");
        if (lider == vJogadores[i].nome) {

            if (vJogadores[i].nome == localStorage.getItem("nome")) {
                jogadorEl.innerHTML = `<span>${vJogadores[i].nome}</span> <div id="pen-container"> <i class="gg-pen" id="pincel">  </i> </div> <i class="fas fa-crown coroa fa-xs"> </i>`;

            } else {
                jogadorEl.innerHTML = `<span>${vJogadores[i].nome}</span> <i class="fas fa-crown coroa"> </i>`;
            }

        } else {
            if (vJogadores[i].nome == localStorage.getItem("nome")) {
                jogadorEl.innerHTML = `<span>${vJogadores[i].nome}</span> <div id="pen-container"> <i class="gg-pen" id="pincel"> </i> </div>`;

            } else {
                jogadorEl.innerHTML = `<span>${vJogadores[i].nome}</span>`;
            }
        }

        jogadorEl.classList.add("jogador");
        playersContainer.appendChild(jogadorEl);
        if(lider == localStorage.getItem("nome")){
            startEl.style.display = "inline";
        }
    }
}


function inicio() {
    fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
            lider = r.lider;
            for (let i = 0; i < r.jogadores.length; i++) {
                vJogadores.push({ "nome": r.jogadores[i].nome, "pronto": r.jogadores[i].pronto });
            }
            registrarJogadores();
        })
}
inicio();

function buscarJogadores() {
    if(!buscar)return;
    let v2Jogadores = [];
    fetch("/jogadores")
        .then(function (r) {
            return r.json();
        })
        .then(r => {
            lider = r.lider;
            for (let i = 0; i < r.jogadores.length; i++) {
                v2Jogadores.push({ "nome": r.jogadores[i].nome, "pronto": r.jogadores[i].pronto });
            }
            if(v2Jogadores.length!=vJogadores.length){
                vJogadores = v2Jogadores;
                registrarJogadores();
            }else{

                for (let i = 0; i < r.jogadores.length; i++) {
                    if(vJogadores[i].pronto!=v2Jogadores.pronto){
                        vJogadores = v2Jogadores
                        registrarJogadores();
                        break;
                    }

                }
            }
            
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


let busca = setInterval(buscarJogadores, 500);
let inicia = setInterval(iniciarPartida,50);

