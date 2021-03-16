let playersContainer = document.querySelector("#display-jogadores");
let progressBarEl = document.querySelector("#tb1");
let readyEl = document.querySelectorAll(".enviar");
let ready = 0;
let vJogadores = [];
let btns = Array.from(readyEl);
let primeiraRodada = 1;
let rodadaAtual = undefined;
const headers = new Headers({
    "Content-Type": "application/json"
})

function inicio(){
    progressBarEl.style.background = "green";
    fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
            rodadaAtual = r.rodadaAtual;
            if (r.rodada != 1) primeiraRodada = 0;
            if (rodadaAtual) {
                enterFuncional();
                if(!primeiraRodada && rodadaAtual) {
                   progressBarEl = document.querySelector("#tb2");
                   let desaparecaEl =  document.querySelector("#primeiro");
                   desaparecaEl.classList.add("sem-aparecer");
                   let aparecaEl = document.querySelector("#segundo");
                   aparecaEl.classList.remove("sem-aparecer");
                }
            }
            
})
}
inicio();

function atualizarHUD() {
    console.log(rodadaAtual);
    vJogadores = [];
    fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
            lider = r.lider;
            for (let i = 0; i < r.jogadores.length; i++) {
                vJogadores.push({ "nome": r.jogadores[i].nome, "pronto": r.jogadores[i].pronto });
            }
            registrarJogadores(r.tempoRestante);
            
            if(r.estado=="nova-rodada"){
               finalizarRodada(); 
            }
        });

}

function enterFuncional() {
    let descricaoInicialEl = document.querySelector("#descricao1");
    let descricaoEl = document.querySelector("#descricao2");
    descricaoEl.addEventListener("keyup", e => {
        if (e.key === 'Enter') {
            ready = 1;
            btns[1].classList.remove("btn-success");
            btns[1].classList.add("btn-danger");
            btns[1].innerHTML = "NÃO PRONTO!";
            enviarJogada();
        }
    })
    descricaoInicialEl.addEventListener("keyup", e => {
        if (e.key === 'Enter') {
            ready = 1;
            btns[0].classList.remove("btn-success");
            btns[0].classList.add("btn-danger");
            btns[0].innerHTML = "NÃO PRONTO!";
            enviarJogada();
        }
    })

}

function registrarJogadores(tempoRestante) {
    if(!rodadaAtual){
        playersContainer.innerHTML = "";
        for (let i = 0; i < vJogadores.length; i++) {
            let jogadorEl = document.createElement("span");
            if (vJogadores[i].pronto) jogadorEl.classList.add("pronto");
            if (lider == vJogadores[i].nome) {
                jogadorEl.innerHTML = vJogadores[i].nome + `<i class="fas fa-crown coroa"> </i>`;
            } else {
                jogadorEl.innerHTML = vJogadores[i].nome;
            }
            jogadorEl.classList.add("jogador");
            jogadorEl.style.display = "block";
            playersContainer.appendChild(jogadorEl);
        }
        if (lider == localStorage.getItem("nome")) {
            startEl.style.display = "inline";
        }
    }
    progressBarEl.style.transform = `scale(${tempoRestante/100}, 1)`;
    
    if (tempoRestante < 25) progressBarEl.style.background = "crimson";
}

let busca = setInterval(atualizarHUD, 25);
readyEl.forEach(e => {
    e.addEventListener("click", () =>{
        changeReadyState(e);
    });
})

function changeReadyState(e) {
    ready = 1 - ready;
    e.classList.toggle("btn-success");
    e.classList.toggle("btn-danger");
    e.innerHTML = ready ? "NÃO PRONTO!" : "PRONTO!";
    fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome") }) })
    if(ready){
        enviarJogada();
    }

}

function jogadorSaindo() {
    if (!localStorage.getItem("nome")) return;
    fetch("/saindo", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome") }) })
}

function enviarJogada() {
    if(!rodadaAtual){
        let canvas = document.querySelector("#canvas");
        let url =canvas.toDataURL();
        fetch("/enviarJogada", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), jogada: url }) })

    }else{
        let descricaoEl;
        if(primeiraRodada){
            descricaoEl = document.querySelector("#descricao1");
        }else{
            descricaoEl = document.querySelector("#descricao2");
        }
        fetch("/enviarJogada", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), jogada: descricaoEl.value }) })

    }
}

function finalizarRodada(){
    if(!ready){
        enviarJogada();
    }
    clearInterval(busca);
    setTimeout(() =>{
        location.reload();
    },200);
}