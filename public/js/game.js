let playersContainer = document.querySelector("#display-jogadores");
let progressBarEl = document.querySelector("#time-bar");
let readyEl = document.querySelector("#enviar");
let ready = 0;
let tipoDeRodada = undefined;
const headers = new Headers({
    "Content-Type": "application/json"
})

function atualizarHUD() {
    vJogadores = [];
    fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
            lider = r.lider;
            for (let i = 0; i < r.jogadores.length; i++) {
                vJogadores.push({ "nome": r.jogadores[i].nome, "pronto": r.jogadores[i].pronto });
            }
            tipoDeRodada = r.rodadaAtual;
            registrarJogadores(r.tempoRestante);
        });

}

function registrarJogadores(tempoRestante) {
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
    progressBarEl.style.width = tempoRestante + '%';
    if (tempoRestante < 25) progressBarEl.style.background = "crimson";
}





let busca = setInterval(atualizarHUD, 25);
readyEl.addEventListener("click", changeReadyState);

function changeReadyState() {
    ready = 1 - ready;
    readyEl.classList.toggle("btn-success");
    readyEl.classList.toggle("btn-danger");
    readyEl.innerHTML = ready ? "NÃO PRONTO!" : "PRONTO!";
    fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome") }) })


}


function jogadorSaindo() {
    if (!localStorage.getItem("nome")) return;
    fetch("/saindo", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome") }) })
}

function enviarJogada() {

}