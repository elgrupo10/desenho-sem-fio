const { jogo } = require("./variaveis");

async function inicializarJogo(tipo) {
  jogo.gameStatus.estado = "jogando";
  jogo.gameStatus.tipoDeInicio = tipo;
  for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
    jogo.idJogadores[jogo.gameStatus.jogadores[i].nome] = i + 1;
  }
  let espereID = setInterval(() => {
    //esperar o líder enviar as configurações da partida
    let ok = 0;
    if (
      jogo.gameStatus.tempos != undefined &&
      jogo.gameStatus.rodadaAtual != undefined
    )
      ok = 1;
    if (ok) {
      clearInterval(espereID);
      setTimeout(() => {
        console.log("iniciando rodada 1");
        console.log(
          `configurações de tempo: ${jogo.gameStatus.tempos[0]} segundos para desenhar e ${jogo.gameStatus.tempos[1]} segundos para escrever.`
        );
        console.log(
          `primeira rodada será do tipo ${jogo.gameStatus.rodadaAtual}`
        );
        gerenciadorDoJogo();
      }, 4050);
    }
  }, 50);
}

async function rodada() {
  return new Promise((resolve) => {
    let rodadas = jogo.gameStatus.jogadores.length;

    for (let i = 0; i < rodadas; i++) {
      jogo.gameStatus.jogadores[i].pronto = 0;
    }

    let width = 100;
    jogo.gameStatus.tempoRestante = width;
    let id = setInterval(
      frame,
      jogo.gameStatus.tempos[jogo.gameStatus.rodadaAtual]
    );

    function frame() {
      if (width <= 0 || jogo.acabouRodada) {
        clearInterval(id);
        jogo.gameStatus.estado = "fim-da-rodada";
        let tolerancia = new Array(11);

        for (let i = 0; i < rodadas; i++) {
          if (jogo.gameStatus.rodada == rodadas) {
            tolerancia[i + 1] = {
              nomeJogador: jogo.gameStatus.jogadores[i].nome,
              tempo: 400,
            };
          } else {
            tolerancia[jogo.trocas[i + 1][jogo.gameStatus.rodada]] = {
              nomeJogador: jogo.gameStatus.jogadores[i].nome,
              tempo: 400,
            };
          }
        }

        let espereID = setInterval(() => {
          let ok = 1;

          for (let i = 1; i <= rodadas; i++) {
            if (jogo.desenhos[i][jogo.gameStatus.rodada] === null) {
              //esperar todos os jogadores enviarem suas jogadas, com uma tolerância máxima de 10 segundos após o fim da rodada
              if (!tolerancia[i].tempo) {
                clearInterval(espereID);
                jogo.gameStatus.vacilao = tolerancia[i].nomeJogador;
                reiniciar();
                resolve("reiniciar");
              }
              tolerancia[i].tempo--;
              ok = 0;
            }
          }
          if (ok) {
            clearInterval(espereID);
            setTimeout(() => {
              jogo.gameStatus.rodada++;
              let rodadas = jogo.gameStatus.jogadores.length;
              if (jogo.gameStatus.rodada > rodadas) {
                //se o jogo acabou

                /*
                Para mostrar os álbuns, precisamos transformar a matriz de desenhos (que salva o que cada jogador recebeu em cada rodada) em uma matriz baseada na matriz final, salvando as "páginas" de cada álbum. Essa nova matriz é a desenhosFinal.
                */
                for (let i = 1; i <= rodadas; i++) {
                  // para cada jogador
                  for (let j = 1; j < rodadas; j++) {
                    // para cada rodada
                    jogo.desenhosFinal[i][j] =
                      jogo.desenhos[jogo.final[i][j]][j];
                    /*
                      na rodada j, o jogador final[i][j] recebe a página j-1 do álbum i (lembre-se de que a matriz final registra os seus "editores" a partir da segunda rodada. Isso implica que o jogador final[i][1] recebe a primeira página do álbum, e não a página zero.). Com isso, desenhos[final[i][j]][j] representa a página j do álbum i.
                      */
                  }
                  /*
                  Veja que desenhos[i][rodadas-1] é a penúltima página de um dos álbuns. A última página desse mesmo álbum, ou seja, a resposta a desenhos[i][rodadas-1], está salva em desenhos[i][rodadas], então basta reutilizar final[álbum][rodadas-1].
                  */
                  jogo.desenhosFinal[i][rodadas] =
                    jogo.desenhos[jogo.final[i][rodadas - 1]][rodadas];
                }

                jogo.gameStatus.estado = "mostrando-books";
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, "0");
                let mm = String(today.getMonth() + 1).padStart(2, "0"); 
                let yyyy = today.getFullYear();
                let data = dd + "/" + mm + "/" + yyyy;
                let horario = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                jogo.data = data+'-'+horario;
              } else {
                jogo.gameStatus.estado = "jogando";
                jogo.gameStatus.rodadaAtual = 1 - jogo.gameStatus.rodadaAtual;
                jogo.acabouRodada = 0;
              }
              resolve("rodada finalizada");
            }, 2000);
          }
        }, 25);
      } else {
        width -= 0.1;
        jogo.gameStatus.tempoRestante = width;
      }
    }
  });
}

async function gerenciadorDoJogo() {
  rodada().then((r) => {
    console.log(r);
    if (r == "reiniciar") return;
    if (jogo.gameStatus.rodada <= jogo.gameStatus.jogadores.length) {
      console.log(`iniciando rodada ${jogo.gameStatus.rodada}`);
      gerenciadorDoJogo();
    } else {
      console.log("Começando a mostrar os books");
    }
  });
}

function reiniciar() {
  console.log("reiniciando jogo");
  jogo.gameStatus.jogadores = [];
  idJogadores = {};
  acabouRodada = 0;
  jogo.desenhos = Array.from({ length: 11 }, (e) => Array(11).fill(null));
  jogo.gameStatus.rodada = 1;
  jogo.bookStatus.jogadorAtual = 1;
  jogo.bookStatus.rodadaAtual = 1;
  jogo.gameStatus.tempos = undefined;
  jogo.gameStatus.tipoDeInicio = 0;
  jogo.acabouRodada = 0;
  jogo.gameStatus.rodadaAtual = undefined;
  jogo.gameStatus.estado = "esperando";
  jogo.gameStatus.banidos = [];
  jogo.presentes = {};
}

module.exports = {
  reiniciar,
  inicializarJogo,
};
