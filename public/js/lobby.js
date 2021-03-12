
const inputNomeEl = document.querySelector("#nomeJogador");
const maskEl = document.querySelector(".mask");
const modalNomeEl = document.querySelector("#nome");
const palyers = document.querySelectorAll(".jogador")
let PlayersContainer = document.querySelector("#jogadores");
let avisoNome = document.querySelector("#aviso-nome");
let readyEl = document.querySelector("#ready");
let startEl = document.querySelector("#leader-start");
let vJogadores = [];
let ready = 0;
let id = undefined;
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
    const headers = new Headers({
        "Content-Type": "application/json"
    })
    fetch("/jogadores", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome"), pronto: 0 }) })
    .then(r => r.json())
    .then(r => console.log(r));
    
}

maskEl.addEventListener("click", () => {
    inputNomeEl.focus();
})


inputNomeEl.addEventListener("change", () => {   
    const headers = new Headers({
        "Content-Type": "application/json"
    })
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
    PlayersContainer.innerHTML = "";
    for (let i = 0; i < vJogadores.length; i++) {
        let jogadorEl = document.createElement("span");
        if(vJogadores[i].pronto)jogadorEl.classList.add("pronto");
        if (lider == vJogadores[i].nome) {
            jogadorEl.innerHTML = vJogadores[i].nome + `<i class="fas fa-crown"></i>`;
        }else{
            jogadorEl.innerHTML = vJogadores[i].nome;
        }
        jogadorEl.classList.add("jogador");
        PlayersContainer.appendChild(jogadorEl);
    }
    if(lider == localStorage.getItem("nome")){
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
            lider = r.leader;
            for(let i=0;i<r.jogadores.length;i++){
                    vJogadores.push({"nome": r.jogadores[i].nome,"pronto":r.jogadores[i].pronto});
            }
            registrarJogadores();
        });
}


function changeReadyState(){
    ready = 1 - ready;
    readyEl.classList.toggle("btn-success");
    readyEl.classList.toggle("btn-danger");
    readyEl.innerHTML = ready ? "NÃO PRONTO!" : "PRONTO!";
    const headers = new Headers({
        "Content-Type": "application/json"
    })
    fetch("/changeReadyState", { method: "POST", headers: headers, body: JSON.stringify({nome: localStorage.getItem("nome")})})
         
        
}


function jogadorSaindo(){
    if(!localStorage.getItem("nome"))return;
    const headers = new Headers({
        "Content-Type": "application/json"
    })
    fetch("/saindo", { method: "POST", headers: headers, body: JSON.stringify({ nome: localStorage.getItem("nome")}) })
    
}

function iniciarPartida(){
    if(!comecar)return;
    //redirecionar o cliente e comecar a gerenciar o jogo atraves do back-end

}


window.addEventListener("beforeunload", jogadorSaindo);
readyEl.addEventListener("click",changeReadyState);
  

setInterval(buscarJogadores, 250);
setInterval(iniciarPartida,250);





