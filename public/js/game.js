let playersContainer = document.querySelector("#display-jogadores");
let progressBarEl = document.querySelector("#tb1");
let readyEl = document.querySelectorAll(".enviar");
let ready = 0;
let enviou = 0;
let vTempos = [];
let vJogadores = [];
let tempoRestante;
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
            tempoRestante = r.tempoRestante;
            vTempos = r.tempos;
            rodadaAtual = r.rodadaAtual;
            atualizarTempo();
            lider = r.lider;
            for (let i = 0; i < r.jogadores.length; i++) {
                vJogadores.push({ "nome": r.jogadores[i].nome, "pronto": r.jogadores[i].pronto });
            }
            if (r.rodada != 1) primeiraRodada = 0;
            if (rodadaAtual) {
                enterFuncional();
                if(!primeiraRodada) {
                   progressBarEl = document.querySelector("#tb2");
                   let desaparecaEl =  document.querySelector("#primeiro");
                   desaparecaEl.classList.add("sem-aparecer");
                   let aparecaEl = document.querySelector("#segundo");
                   aparecaEl.classList.remove("sem-aparecer");
                }
            }
            registrarJogadores();
            if (!primeiraRodada) {
                // console.log(r);
                fetch("/receberJogada", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome") }) })
                    .then(r => r.json())
                    .then(r => {
                        console.log(r.response);
                        if (!rodadaAtual) {
                            console.log(r.response);
                            let fraseEl = document.querySelector("#comando-de-desenho");
                            fraseEl.innerHTML = r.response;
                        } else {
                            let imagemEl = document.querySelector("#desenho");
                            imagemEl.src = r.response;
                        }
                    })
            }
        })
}

inicio();

function atualizarHUD() {
    v2Jogadores = [];
    fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
            // console.log(tempoRestante);
            tempoRestante = r.tempoRestante;
            // console.log(tempoRestante);
            if (r.estado == "fim-da-rodada") {
                finalizarRodada();
            }
            lider = r.lider;
            for (let i = 0; i < r.jogadores.length; i++) {
                v2Jogadores.push({ "nome": r.jogadores[i].nome, "pronto": r.jogadores[i].pronto });
            }
            if(!rodadaAtual){
                for (let i = 0; i < r.jogadores.length; i++) {
                    if (vJogadores[i].nome != v2Jogadores[i].nome || vJogadores[i].pronto != v2Jogadores[i].pronto) {
                        vJogadores = v2Jogadores;
                        registrarJogadores();
                        break;
                    }
                }
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
            fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), semprePronto: 1 }) });
            enviarJogada();
        }
    })

}

function registrarJogadores() {
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

    }
}

async function atualizarTempo() {

    return new Promise(resolve => {
        
        let id = setInterval(frame, vTempos[rodadaAtual]);
        console.log(vTempos[rodadaAtual]);
        console.log(vTempos[0]);
            function frame() {
                console.log(tempoRestante);
                if (tempoRestante < 25) progressBarEl.style.background = "crimson";
                if (tempoRestante <= 0) {
                    
                    clearInterval(id);
                    progressBarEl.style.transform = `scale(0, 1)`;
                    resolve("acabou");
                } else {
                    tempoRestante -= 0.08;
                    progressBarEl.style.transform = `scale(${tempoRestante / 100}, 1)`;

                }
            }
        })
    
    
}


let busca = setInterval(atualizarHUD, 1300);
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
    fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), semprePronto: 0 }) })
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
        console.log("desenhar");
        let canvas = document.querySelector("#canvas");
        let url =canvas.toDataURL();
        // console.log(url);
        fetch("/enviarJogada", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), jogada: url }) })
    }else{
        console.log("descrever");
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

    clearInterval(busca);
    if (!ready) {
        enviarJogada();
    }
    fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), semprePronto: 1 }) });
    function podeReiniciar(){
        fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
            console.log(r.estado);
            if (r.estado == "jogando"){
                clearInterval(id);
                location.reload();
            }
            if(r.estado == "mostrando-books"){
                clearInterval(id);
                location.href = "/final";
            }
        });
    }
    let id = setInterval(podeReiniciar,250);
    }