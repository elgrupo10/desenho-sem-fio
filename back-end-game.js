const { jogo } = require("./variaveis");

async function inicializarJogo(tipo) {
    jogo.gameStatus.estado = "jogando";
    jogo.gameStatus.tipoDeInicio = tipo;
    for(let i=0;i<jogo.gameStatus.jogadores.length;i++){
        jogo.idJogadores[jogo.gameStatus.jogadores[i].nome] = i+1;    
    }
    let espereID = setInterval(() => {
        let ok = 0;
        if(jogo.gameStatus.tempos!=undefined&&jogo.gameStatus.rodadaAtual!=undefined)ok=1;
        if (ok) {
            clearInterval(espereID);
            setTimeout(() => {
                console.log("iniciando rodada 1");
                console.log(jogo.gameStatus.tempos);
                console.log(jogo.gameStatus.rodadaAtual);
                gerenciadorDoJogo();
            }, 4050);
        }
    }, 50);
}

async function rodada() {

    return new Promise(resolve => {

        let rodadas = jogo.gameStatus.jogadores.length;

        for (let i = 0; i < rodadas; i++) {
            jogo.gameStatus.jogadores[i].pronto = 0;
        }

        let width = 100;
        jogo.gameStatus.tempoRestante = width;
        let id = setInterval(frame, jogo.gameStatus.tempos[jogo.gameStatus.rodadaAtual]);

        function frame() {
            if (width <= 0 || jogo.acabouRodada) {

                clearInterval(id);
                jogo.gameStatus.estado = "fim-da-rodada";
                let espereID = setInterval(() => {
                    let ok = 1;
                    for (let i = 1; i <= rodadas; i++) {
                            if (jogo.desenhos[i][jogo.gameStatus.rodada] === null) {
                                ok = 0;
                        }
                    }
                    if(ok){
                        clearInterval(espereID);
                        setTimeout(() =>{
                            jogo.gameStatus.rodada++;
                            if(jogo.gameStatus.rodada>rodadas){
                                jogo.gameStatus.estado = "mostrando-books";
                            }else{
                                jogo.gameStatus.estado = "jogando";
                                jogo.gameStatus.rodadaAtual = 1 - jogo.gameStatus.rodadaAtual;
                                jogo.acabouRodada = 0;
                            }
                            resolve("rodada finalizada");
                        },2000)
                        
                    }   
                },25);

            } else {
                width -= 0.1;
                jogo.gameStatus.tempoRestante = width;
            }
        }
    }) 
}




    
async function gerenciadorDoJogo() {
    // for (let i = 1; i <= jogo.gameStatus.jogadores.length;i++){
    //     for (let j = 1; j <= jogo.gameStatus.rodada;j++){
    //         console.log(jogo.desenhos[i][j]);
    //     }

    // }
    rodada()
        .then(() => {
            
            if (jogo.gameStatus.rodada <= jogo.gameStatus.jogadores.length) {
                console.log(`iniciando rodada ${jogo.gameStatus.rodada}`);
                gerenciadorDoJogo();
            
        } else {
                console.log("Começando a mostrar os books");
        }
        })

    

}

function reiniciar(){
    console.log("reiniciando jogo");
    jogo.gameStatus.jogadores = [];
    idJogadores = {};
    acabouRodada = 0;
    jogo.desenhos = Array.from({ length: 11 }, e => Array(11).fill(null));
    jogo.gameStatus.rodada = 1;
    jogo.bookStatus.jogadorAtual = 1;
    jogo.bookStatus.rodadaAtual = 1;
    jogo.gameStatus.tempos = [50,25];
    jogo.gameStatus.tipoDeInicio = 0;
    jogo.gameStatus.rodadaAtual = 1;
    jogo.gameStatus.estado = "esperando";
}

module.exports = {    
    reiniciar, inicializarJogo  
}
