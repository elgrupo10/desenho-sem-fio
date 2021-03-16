const { jogo } = require("./variaveis");
const {sorteio} = require("./sorteio");




async function inicializarJogo(tipo) {
    jogo.gameStatus.estado = "jogando";
    jogo.gameStatus.tipoDeInicio = tipo;
    // gameStatus.rodadaAtual = Math.ceil(Math.random() * 2);
    jogo.trocas = sorteio()
    
    for (let i = 0; i < 11; i++) {
        jogo.desenhos[i] = new Array(11);
    }
    console.log("Jogadores na partida:");
    for(let i=0;i<jogo.gameStatus.jogadores.length;i++){
        console.log(jogo.gameStatus.jogadores[i].nome);
        jogo.idJogadores[jogo.gameStatus.jogadores[i].nome] = i+1;
        
    }

    setTimeout(() => {
        console.log("jogo iniciando");
        console.log("iniciando rodada 1")
        gerenciadorDoJogo(1)
    }, 4050);
    

}

async function rodada() {

    return new Promise(resolve => {

        let rodadas = jogo.gameStatus.jogadores.length;

        for (let i = 0; i < rodadas; i++) {
            jogo.gameStatus.jogadores[i].pronto = 0;
        }

        let width = 100;
        jogo.gameStatus.tempoRestante = width;
        let id = setInterval(frame, jogo.tempos[jogo.gameStatus.rodadaAtual]);

        function frame() {

            if (width <= 0 || jogo.acabouRodada) {

                clearInterval(id);
                jogo.acabouRodada = 0;
                jogo.gameStatus.rodadaAtual = 1 - jogo.gameStatus.rodadaAtual;
                jogo.gameStatus.rodada++;
                jogo.gameStatus.estado = "nova-rodada";
                setTimeout(() => {
                    jogo.gameStatus.estado = "jogando";
                },100);
                resolve("rodada finalizada");

            } else {
                width -= 0.1;
                // console.log(width);
                jogo.gameStatus.tempoRestante = width;
            }
        }
    }) 
}

function finalizarJogo() {




    
}


    
async function gerenciadorDoJogo(i) {
    
    rodada()
        .then(() => {
            console.log(`iniciando rodada ${jogo.gameStatus.rodada}`);
            if (i <= jogo.gameStatus.jogadores.length) {
            setTimeout(() =>{
                gerenciadorDoJogo(i+1);
            }, 100);
            
        } else {
            setTimeout(finalizarJogo, 100);
        }
        })

    

}

module.exports = {    
    gerenciadorDoJogo, rodada, inicializarJogo  
}