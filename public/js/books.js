const headers = new Headers({
    "Content-Type": "application/json"
})

let jogadorAtual = 1;
let rodadaAtual = 1;
let inicio = 1;
let ultimaRodadaAtual = 1;
let ultimoJogadorAtual = 1;
let desenhos, caminhos, lider, rodadas, itens = [], tipoDeRodada, idJogadores;
let bookEl = document.querySelector("#resultados");

let proxBookEl = document.querySelector("#proximo-book");
let divsBotoes = document.querySelectorAll(".botoes");
let bookAnteriorEl = document.querySelector("#book-anterior");
let proxRodadaEl = document.querySelector("#proxima-rodada");
let playersContainer = document.querySelector("#display-jogadores");

proxRodadaEl.addEventListener("click", () => {
    mudarDisplay(2)
});
bookAnteriorEl.addEventListener("click", () => {
    mudarDisplay(3)
});
proxBookEl.addEventListener("click", () => {
    mudarDisplay(4)
});
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
                idJogadores = r.idJogadores;
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
            setInterval(atualizarHUD, 1000);
        }
    });
})


function buscarJogadores(){

    return new Promise(resolve => {

        fetch("/jogadores")
            .then(r => r.json())
            .then(r => {
                console.log(rodadas);
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
        if(inicio){
            inicio=0;
            registrarBook();
        }else{
            if (r.jogadorAtual != jogadorAtual) {
                jogadorAtual = r.jogadorAtual;
                registrarBook();
            }
            if (r.rodadaAtual != rodadaAtual) {
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
    console.log(ultimoJogadorAtual);
    console.log(jogadorAtual);
    ultimo.classList.remove("pronto");
    atual.classList.add("pronto");
    bookEl.innerHTML = "";
    for(let i = 1 ; i < rodadas ; i++){
        itens[i] = desenhos[caminhos[jogadorAtual][i]][i];
    }

    itens[rodadas] = desenhos[caminhos[jogadorAtual][rodadas-1]][rodadas];

    for(let i = 1; i<= rodadas; i++){
        let autor = itens[i][1];
        let containerEl = document.createElement("div");
        let autorEl = document.createElement("h2");
        autorEl.innerHTML = autor;
        containerEl.appendChild(autorEl);
        if(i>1){
            containerEl.classList.add("sem-aparecer");
        }
        if(tipoDeRodada){
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
        bookEl.appendChild(containerEl);
        tipoDeRodada = 1 - tipoDeRodada;
    }
}


function registrarRodada(){
    console.log(ultimaRodadaAtual);
    console.log(rodadaAtual);
    if(ultimaRodadaAtual<rodadaAtual){
        for (let i = ultimaRodadaAtual+1; i <= rodadaAtual; i++) {
            let rodadaEl = bookEl.children[i - 1];
            rodadaEl.classList.remove("sem-aparecer");
        }

    }else{
        for(let i = ultimaRodadaAtual; i > rodadaAtual; i--) {
            let rodadaEl = bookEl.children[i - 1];
            rodadaEl.classList.add("sem-aparecer");
        }

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
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 1 }) })
            .then(() => {
                ultimaRodadaAtual = rodadaAtual;
                rodadaAtual--;
                proxRodadaEl.classList.remove("impossivel");
                registrarRodada();
            })
            
        case 2:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 2 }) })
            .then(() => {
                ultimaRodadaAtual = rodadaAtual;
                rodadaAtual++;
                if (rodadaAtual == rodadas) {
                    proxRodadaEl.classList.add("impossivel");
                }
                registrarRodada();
            })
            
        case 3:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 3 }) })
            .then(() => {
                ultimoJogadorAtual = jogadorAtual;
                jogadorAtual--;
                rodadaAtual = 1;
                ultimaRodadaAtual = rodadaAtual;
                proxRodadaEl.classList.remove("impossivel");
                proxBookEl.classList.remove("impossivel");
                if (jogadorAtual == 1) {
                    bookAnteriorEl.classList.add("impossivel");
                }
                registrarBook();
            })
            
        case 4:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 4 }) })
            .then(() => {
                ultimoJogadorAtual = jogadorAtual;
                jogadorAtual++;
                rodadaAtual = 1;
                ultimaRodadaAtual = rodadaAtual;
                proxRodadaEl.classList.remove("impossivel");
                bookAnteriorEl.classList.remove("impossivel");
                if (jogadorAtual == rodadas) {
                    proxBookEl.classList.add("impossivel");
                }
                registrarBook();
            })
            
    }
}


