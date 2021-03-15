
function inicializarJogo(tipo) {
    console.log("jogo iniciando");
    gameStatus.estado = "jogando";
    gameStatus.tipoDeInicio = tipo;
    console.log(tipo);
    // gameStatus.rodadaAtual = Math.ceil(Math.random() * 2);
    trocas = sorteio()
    console.log(trocas[1][1]);
}

function rodada() {
    let tempos = [25, 50];
    let width = 100;
    gameStatus.tempoRestante = width;
    let id = setInterval(frame, tempos[gameStatus.rodadaAtual]);
    function frame() {
        if (width <= 0 || acabouRodada) {
            clearInterval(id);
            acabouRodada = 0;
            gameStatus.estado = "nova-rodada";
            gameStatus.rodadaAtual = 1 - gameStatus.rodadaAtual;
        } else {
            width -= 0.1;
            gameStatus.tempoRestante = width;
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