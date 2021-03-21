const headers = new Headers({
    "Content-Type": "application/json"
})

let jogadorAtual = 1;
let rodadaAtual = 1;
let inicio = 1;
let ultimaRodadaAtual = 1;
let ultimoJogadorAtual = 1;
let desenhos, caminhos, lider, rodadas, itens = [], tipoDeRodada;
let bookEl = document.querySelector("#resultados");
let divsBotoes = document.querySelectorAll(".botoes");
let bookAnteriorEl = document.querySelector("#book-anterior");
let proxRodadaEl = document.querySelector("#proxima-rodada");
let playersContainer = document.querySelector("#display-jogadores");
let reiniciarJogoEl = document.querySelector("#reiniciar-jogo");

proxRodadaEl.addEventListener("click", () => {
    mudarDisplay(1)
});
bookAnteriorEl.addEventListener("click", () => {
    mudarDisplay(2)
});
proxBookEl.addEventListener("click", () => {
    mudarDisplay(3)
});
reiniciarJogoEl.addEventListener("click", () =>{
    reiniciarJogo();
})
function salvarDados() {
    return new Promise(resolve => {
        fetch("/gameData")
            .then(r => r.json())
            .then(r => {
                desenhos = r.desenhos;
                caminhos = r.caminhos;
                lider = r.lider;
                rodadas = r.rodadas;
                tipoDeRodada = r.tipoDeRodada;
                if (!(rodadas % 2)) tipoDeRodada = 1 - tipoDeRodada;
                resolve("ok");
            })
    })
}

salvarDados()
.then(() => {
    buscarJogadores()
    .then(() => {
        if (localStorage.getItem("nome") == lider) {
            liderHUD();
            atualizarHUD();
        } else {
            setInterval(atualizarHUD, 100);
        }
    });
})


function buscarJogadores(){

    return new Promise(resolve => {

        fetch("/jogadores")
            .then(r => r.json())
            .then(r => {
                let vJogadores = [];
                for (let i = 0; i < rodadas; i++) {
                    vJogadores.push({ "nome": r.jogadores[i].nome });
                }
                playersContainer.innerHTML = "";
                for (let i = 0; i < rodadas; i++) {
                    let jogadorEl = document.createElement("span");
                    if (!i) jogadorEl.classList.add("pronto");
                    if (lider == vJogadores[i].nome) {
                        jogadorEl.innerHTML = vJogadores[i].nome + `<i class="fas fa-crown coroa"> </i>`;
                    } else {
                        jogadorEl.innerHTML = vJogadores[i].nome;
                    }
                    jogadorEl.style.display = "block";
                    playersContainer.appendChild(jogadorEl);
                }
                resolve("ok");
            })
    })
    
}




function atualizarHUD() {

    fetch("/books")
    .then(r => r.json())
    .then(r => {
        if(r.reiniciarPartida){
            location.href = "/lobby";
        }
        if(inicio){
            inicio=0;
            registrarBook();
        }else{
            if (r.jogadorAtual != jogadorAtual) {
                ultimoJogadorAtual = jogadorAtual;
                jogadorAtual = r.jogadorAtual;
                registrarBook();
                return;
            }
            if (r.rodadaAtual != rodadaAtual) {
                console.log(ultimaRodadaAtual);
                console.log(rodadaAtual);
                ultimaRodadaAtual = rodadaAtual;
                rodadaAtual = r.rodadaAtual;
                registrarRodada();
            }
        }
        
    })
}

function registrarBook() {
    let ultimo = playersContainer.children[ultimoJogadorAtual-1];
    let atual = playersContainer.children[jogadorAtual-1];
    ultimaRodadaAtual = 1;
    rodadaAtual = 1;
    ultimo.classList.remove("pronto");
    atual.classList.add("pronto");
    bookEl.innerHTML = "";
    for(let i = 1 ; i < rodadas ; i++){
        itens[i] = desenhos[caminhos[jogadorAtual][i]][i];
    }

    itens[rodadas] = desenhos[caminhos[jogadorAtual][rodadas-1]][rodadas];
    let temp = tipoDeRodada;
    for(let i = 1; i<= rodadas; i++){
        
        let autor = itens[i][1];
        let containerEl = document.createElement("div");
        let autorEl = document.createElement("h2");
        autorEl.innerHTML = autor;
        containerEl.appendChild(autorEl);
        if(i>1){
            containerEl.classList.add("sem-aparecer");
        }
        if(temp){
            containerEl.classList.add("frase");
            let fraseEl = document.createElement("span");
            fraseEl.innerHTML = itens[i][0];
            containerEl.appendChild(fraseEl);

        }else{
            containerEl.classList.add("desenho");
            let imagemEl = document.createElement("img");
            imagemEl.src = itens[i][0];;
            containerEl.appendChild(imagemEl);
        }
        if(i==1){
            bookEl.appendChild(containerEl);
        }else{
            bookEl.insertBefore(containerEl,bookEl.children[0]);
        }
        temp = 1 - temp;
    }
}


function registrarRodada(){ //2 3 5-2 (rodadas-i)
    for (let i = ultimaRodadaAtual+1; i <= rodadaAtual; i++) {
        let rodadaEl = bookEl.children[rodadas-i];
        rodadaEl.classList.remove("sem-aparecer");
    }
}

function liderHUD() {
    divsBotoes.forEach(e => {
        e.classList.remove("sem-aparecer");
    })
}


function mudarDisplay(acao) {

    switch(acao){            
        case 1:
            ultimaRodadaAtual = rodadaAtual;
            rodadaAtual++;
            if (rodadaAtual == rodadas) {
                proxRodadaEl.classList.add("impossivel");
                if(jogadorAtual==rodadas){
                    proxRodadaEl.classList.add("sem-aparecer");
                    reiniciarJogoEl.classList.remove("sem-aparecer");

                }
            }
            registrarRodada();
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 1 }) })
            .then(() => registrarRodada);
            break;
            
        case 2:
            ultimoJogadorAtual = jogadorAtual;
            jogadorAtual--;
            proxRodadaEl.classList.remove("impossivel");
            proxRodadaEl.classList.remove("sem-aparecer");
            proxBookEl.classList.remove("impossivel");
            reiniciarJogoEl.classList.add("sem-aparecer");
            if (jogadorAtual == 1) {
                bookAnteriorEl.classList.add("impossivel");
            }
            registrarBook();
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 2 }) })
            break;
            
        case 3:
            ultimoJogadorAtual = jogadorAtual;
            jogadorAtual++;
            proxRodadaEl.classList.remove("impossivel");
            bookAnteriorEl.classList.remove("impossivel");
            if (jogadorAtual == rodadas) {
                proxBookEl.classList.add("impossivel");
            }
            registrarBook();
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 3 }) })
            break;
    }
}

function reiniciarJogo() {
    fetch("/reiniciar", {method: "POST", headers: headers, body: JSON.stringify({nome: lider})})
    .then(() => {
        location.href = "/lobby";
    })
}
