const headers = new Headers({
    "Content-Type": "application/json"
})

let jogadorAtual = 1;
let rodadaAtual = 1;
let ultimaRodadaAtual = 1;
let ultimoJogadorAtual = 1;
let desenhos, caminhos, lider, rodadas, itens, tipoDeRodada, idJogadores;
let bookEl = document.querySelector("#resultados");

let proxBookEl = document.querySelector("#proximo-book");
let bookAnteriorEl = document.querySelector("#book-anterior");
let proxRodadaEl = document.querySelector("#proxima-rodada");
let rodadaAnteriorEl = document.querySelector("#rodada-anterior");
let playersContainer = document.querySelector("#display-jogadores");

rodadaAnteriorEl.addEventListener("click",() =>{
    mudarDisplay(1)
});
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
    fetch("/gameData")
    .then(r => r.json())
    .then(r => {
        desenhos = r.desenhos;
        caminhos = r.caminhos;
        lider = r.lider;
        rodadas = r.rodadas;
        tipoDeRodada = r.tipoDeRodada;
        idJogadores = r.idJogadores;
        if(rodadas%2)tipoDeRodada = 1 - tipoDeRodada;
    })

    
}

salvarDados();


function buscarJogadores(){
    fetch("/jogadores")
        .then(r => r.json())
        .then(r => {
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
            
        })
}

if (localStorage.getItem("nome") == lider) {
    liderHUD();
}else{

    setInterval(atualizarHUD, 1000);
}


function atualizarHUD() {
    fetch("/books")
    .then(r => r.json())
    .then(r => {
        if(r.jogadorAtual != jogadorAtual){
            jogadorAtual = r.jogadorAtual;
            registrarBook();
        }
        if(r.rodadaAtual != rodadaAtual){
            ultimaRodadaAtual = rodadaAtual;
            rodadaAtual = r.rodadaAtual;
            if(rodadaAtual<ultimaRodadaAtual){
                registrarRodada(0)
            }else{
                registrarRodada(1);
            }
        }
    })
}

function registrarBook() {
    let ultimo = document.querySelector(`display-jogadores:nth-child(${ultimoJogadorAtual - 1})`);
    ultimo.classList.remove("pronto");
    let atual = document.querySelector(`display-jogadores:nth-child(${jogadorAtual - 1})`);
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
        if(i<1){
            containerEl.classList.add("sem-aparecer");
        }
        if(tipoDeRodada){
            containerEl.classList.add("frase");
            let fraseEl = document.createElement("span");
            fraseEl.innerHTML = item[i][0];
            containerEl.appendChild(fraseEl);

        }else{
            containerEl.classList.add("desenho");
            let imagemEl = document.createElement("img");
            imagemEl.src = item[i][0];;
            containerEl.appendChild(imagemEl);
        }
        bookEl.appendChild(containerEl);
        tipoDeRodada = 1 - tipoDeRodada;
    }
}


function registrarRodada(tipo){

    if(tipo){
        for (let i = ultimaRodadaAtual+1; i <= rodadaAtual; i++) {
            console.log(i);
            let rodadaEl = document.querySelector(`#resultados:nth-child(${i-1})`);
            rodadaEl.classList.remove("sem-aparecer");
        }

    }else{
        for(let i = ultimaRodadaAtual; i > rodadaAtual; i--) {
            let rodadaEl = document.querySelector(`#resultados:nth-child(${i-1})`);
            rodadaEl.classList.add("sem-aparecer");
        }

    }
    
}

function liderHUD() {

    bookAnteriorEl.classList.remove("sem-aparecer");
    proxBookEl.classList.remove("sem-aparecer");
    rodadaAnteriorEl.classList.remove("sem-aparecer");
    proxRodadaEl.classList.remove("sem-aparecer");

}


function mudarDisplay(acao) {

    switch(acao){

        case 1:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 1 }) });
            ultimaRodadaAtual = rodadaAtual;
            rodadaAtual--;
            proxRodadaEl.classList.remove("impossivel");
            if(rodadaAtual==1){
                rodadaAnteriorEl.classList.add("impossivel");
            }
            registrarRodada(0);
            break;
        case 2:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 2 }) });
            ultimaRodadaAtual = rodadaAtual;
            rodadaAtual++;
            rodadaAnteriorEl.classList.remove("impossivel");
            if(rodadaAtual==rodadas){
                proxRodadaEl.classList.add("impossivel");
            }
            registrarRodada(1);
            break;
        case 3:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 3 }) });
            jogadorAtual--;
            rodadaAtual = 1;
            ultimaRodadaAtual = rodadaAtual;
            rodadaAnteriorEl.classList.add("impossivel");
            proxBookEl.classList.remove("impossivel");
            if (jogadorAtual == 1) {
                bookAnteriorEl.classList.add("impossivel");
            }
            registrarBook();
            break;
        case 4:
            fetch("/mudarDisplay", { method: "POST", headers: headers, body: JSON.stringify({ tipo: 4 }) });
            jogadorAtual++;
            rodadaAtual = 1;
             ultimaRodadaAtual = rodadaAtual;   
            rodadaAnteriorEl.classList.add("impossivel");
            bookAnteriorEl.classList.remove("impossivel");
            if (jogadorAtual == rodadas) {
                proxBookEl.classList.add("impossivel");
            }
            registrarBook();
            break;
    }
}


