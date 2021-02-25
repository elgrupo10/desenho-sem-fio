
const inputNomeEl = document.querySelector("#nomeJogador");
const maskEl = document.querySelector("#mask");
const modalNomeEl = document.querySelector("#nome");
const jogadores = document.querySelectorAll(".jogador")

let vetorJogadores = [];

maskEl.addEventListener("click", () => {
    inputNomeEl.focus();
})


inputNomeEl.addEventListener("change", () => {
    maskEl.classList.add("desaparecer");
    modalNomeEl.classList.add("desaparecer");
    vetorJogadores.push(inputNomeEl.value);
    for (let i = 0; i<vetorJogadores.length; i++){
        jogadores[i].innerHTML = vetorJogadores[i];
        jogadores[i].classList.remove("desaparecer");
    }
})