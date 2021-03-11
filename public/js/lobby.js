
const inputNomeEl = document.querySelector("#nomeJogador");
const maskEl = document.querySelector("#mask");
const modalNomeEl = document.querySelector("#nome");
const palyers = document.querySelectorAll(".jogador")

let vetorJogadores = [];

maskEl.addEventListener("click", () => {
    inputNomeEl.focus();
})


inputNomeEl.addEventListener("change", () => {

    maskEl.classList.add("desaparecer");
    modalNomeEl.classList.add("desaparecer");
    vetorJogadores.push(inputNomeEl.value);
    for (let i = 0; i<vetorJogadores.length; i++){
        palyers[i].innerHTML = vetorJogadores[i];
        palyers[i].classList.remove("desaparecer");
    }
    const headers = new Headers({
        "Content-Type": "application/json"
    })
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({nome: inputNomeEl.value})})
        .then(r => r.json())
        .then(r => {
            console.log(r);
        });
})
                
fetch("/jogadores")
    .then(function(r){
        return r.json();
    })
    .then(r => {
        console.log(r);
    });

