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
            if (width <= 0 || jogo.acabouRodada || jogo.estado=="esperando") {
                clearInterval(id);
                jogo.gameStatus.estado = "fim-da-rodada";
                let tolerancia = new Array(11);

                for (let i = 0; i < rodadas; i++) {
                    if(jogo.gameStatus.rodada==rodadas){
                        tolerancia[i] = { nomeJogador: jogo.gameStatus.jogadores[i].nome, tempo: 400 };
                    }else{
                        tolerancia[jogo.trocas[i + 1][jogo.gameStatus.rodada]] = { nomeJogador: jogo.gameStatus.jogadores[i].nome, tempo: 400 };
                    }
                    
                }
                
                let espereID = setInterval(() => {
                    let ok = 1;
                    
                    for (let i = 1; i <= rodadas; i++) {
                        console.log(tolerancia);
                            if (jogo.desenhos[i][jogo.gameStatus.rodada] === null) {
                                if(!tolerancia[i].tempo){
                                    clearInterval(espereID);
                                    jogo.gameStatus.vacilao = tolerancia[i].nomeJogador;
                                    reiniciar();
                                    resolve("reiniciar");
                                }
                                tolerancia[i].tempo--;
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
    rodada()
        .then(r => {
            console.log(r);
            if(r=="reiniciar")return;
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
    jogo.gameStatus.tempos = undefined;
    jogo.gameStatus.tipoDeInicio = 0;
    jogo.acabouRodada = 0;
    jogo.gameStatus.rodadaAtual = undefined;
    jogo.gameStatus.estado = "esperando";
    jogo.presentes = {};
}

// async function vigiarJogador(nome) {
//     let tolerancia = 50;
//     let id = setInterval(vigia, 100);
//     function vigia() {
//         if(jogo.presentes[nome]){
//             clearInterval(id);
//         }else{
//             if(!tolerancia){
//                 clearInterval(id);
//                 reiniciar();
//                 jogo.vacilao = nome;
//                 jogo.podeComecar = 0;
//             }
//             tolerancia--;
//         }
//     }
// }

module.exports = {    
    reiniciar, inicializarJogo
}
