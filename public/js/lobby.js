let inputNomeEl = document.querySelector("#nomeJogador");
let maskEl = document.querySelector(".mask");
let mask2El = document.querySelectorAll(".mask")[1];
let helioEl = document.querySelector("#Helio");
let gabrielEl = document.querySelector("#Gabriel");
let leonidasEl = document.querySelector("#Leonidas");
let helioModalEl = document.querySelector("#Helio-modal");
let gabrielModalEl = document.querySelector("#Gabriel-modal");
let leonidasModalEl = document.querySelector("#Leonidas-modal");

let modalArr = document.querySelectorAll(".meuModal");

let botaoInfoEl = document.querySelector("#info-modal");
let tutorialEl = document.querySelector("#tutorial");
let modalNomeEl = document.querySelector("#nome");
let botaoTempoEl = document.querySelector("#menu-opcoes");
let menuOpcoesEl = document.querySelector("#menu");

let palyers = document.querySelectorAll(".jogador");
let playersContainer = document.querySelector("#jogadores");
let avisoNome = document.querySelector("#aviso-nome");
let readyEl = document.querySelector("#ready");
let tituloEl = document.querySelector("#tituloTelaDeJogadores");
let startEl = document.querySelector("#iniciar-lider");
let radioInicio = document.querySelectorAll('input[name="modo"]');
let selectVelocidade = document.querySelector("#select-tempo");
let vJogadores = [];
let ready = 0;
let tipoDeInicio = 0;
let buscar = 1;
let tipoInicio = 1,tempo = 1;
let comecar = 0;
let lider = "";
const headers = new Headers({
    "Content-Type": "application/json"
})
radioInicio.forEach(e => {
    e.addEventListener("change", mudarConfiguracao);
})
selectVelocidade.addEventListener("change", mudarConfiguracao);
buscarJogadores()

window.addEventListener("click",e => {
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

// masks
function removerCliqueMask(elementoEl){
    elementoEl.classList.remove("aparecer");
    mask2El.classList.remove("aparecer");
}

function aparecerModal(modalEl) {
    mask2El.classList.add("aparecer");
    modalEl.classList.add("aparecer");
}

botaoInfoEl.addEventListener("click",() => {
    aparecerModal(tutorialEl)
});
botaoTempoEl.addEventListener("click", () => {
    aparecerModal(menuOpcoesEl);
});

leonidasEl.addEventListener("click", () => {
    aparecerModal(leonidasModalEl)
})

helioEl.addEventListener("click", () => {
    aparecerModal(helioModalEl)
})

gabrielEl.addEventListener("click", () => {
    aparecerModal(gabrielModalEl)
})

maskEl.addEventListener("click", () => {
    inputNomeEl.focus();
})

mask2El.addEventListener("click", e =>{
    for (let modalAtualEl of modalArr) {
        if (modalAtualEl.classList.contains("aparecer")) {
            removerCliqueMask(modalAtualEl);
        }
    }
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
            botaoTempoEl.classList.remove("invisivel");
            startEl.classList.remove("invisivel");
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
    readyEl.disabled = true;
    startEl.disabled = true;
    clearInterval(inicia);
    clearInterval(busca);
    if(lider == localStorage.getItem("nome")) {
        fetch("/configuracoes", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), tempo: tempo, tipoInicio: tipoInicio }) })
        .then(() => {
            contador();
        });
    }else {
        let id = setInterval(() =>{
            fetch("/podeIniciar")
                .then(r => r.json())
                .then(r => {
                    if (r.podeIniciar) {
                        clearInterval(id);
                        contador();
                    }
                })
        }, 100);
        
    }
    function contador(){        
        let timeleft = 3;
        let timer = setInterval(function () {
            if (timeleft <= 0) {
                clearInterval(timer);
                location.href = "/game";
            } else {
                if (tipoDeInicio) {
                    if (timeleft <= 1) {
                        tituloEl.innerHTML = `O líder iniciou a partida! ${timeleft} segundo até a partida começar!`;
                    } else {
                        tituloEl.innerHTML = `O líder iniciou a partida! ${timeleft} segundos até a partida começar!`;
                    }
                } else {
                    if (timeleft <= 1) {
                        tituloEl.innerHTML = `Todos os jogadores estão prontos! ${timeleft} segundo até a partida começar!`;
                    } else {
                        tituloEl.innerHTML = `Todos os jogadores estão prontos! ${timeleft} segundos até a partida começar!`;
                    }
                }
            }
            timeleft--;
        }, 1000);
    }
    

}

function avisarServer(){
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({start: 1}) })
    
}

function mudarConfiguracao(e){
    let mudanca = e.target.id;
    if(mudanca == "select-tempo"){
        tempo = e.target.value;
    }else{
        tipoInicio = mudanca;
    }
    console.log(tipoInicio);
    console.log(tempo);
}

window.addEventListener("beforeunload", jogadorSaindo);
readyEl.addEventListener("click", changeReadyState);
startEl.addEventListener("click", avisarServer);


let busca = setInterval(buscarJogadores, 500);
let inicia = setInterval(iniciarPartida,150);

