const { jogo } = require("./variaveis");
function inicializarJogo(tipo) {
    console.log("jogo iniciando");
    jogo.gameStatus.estado = "jogando";
    jogo.gameStatus.tipoDeInicio = tipo;
    console.log(tipo);
    // gameStatus.rodadaAtual = Math.ceil(Math.random() * 2);
    jogo.trocas = sorteio()
    console.log(trocas[1][1]);
}

function rodada() {
    let tempos = [25, 50];
    let width = 100;
    jogo.gameStatus.tempoRestante = width;
    let id = setInterval(frame, tempos[jogo.gameStatus.rodadaAtual]);
    function frame() {
        if (width <= 0 || acabouRodada) {
            clearInterval(id);
            jogo.acabouRodada = 0;
            jogo.gameStatus.estado = "nova-rodada";
            jogo.gameStatus.rodadaAtual = 1 - jogo.gameStatus.rodadaAtual;
        } else {
            width -= 0.1;
            jogo.gameStatus.tempoRestante = width;
        }
    }
}

function enviarNovaTarefa() {




}

function gerenciadorDoJogo() {

    let rodadas = gameStatus.jogadores.length;
    for (let i = 0; i < rodadas; i++) {

        for (jogador in gameStatus.jogadores) {
            jogador.pronto = 0;
        }
        rodada();

    }
}

module.exports = {
    gerenciadorDoJogo, enviarNovaTarefa, rodada, enviarNovaTarefa, inicializarJogo  
}