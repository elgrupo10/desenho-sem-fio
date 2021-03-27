const { jogo } = require("./variaveis");
/*
    A lógica por trás do recebimento/envio das jogadas é feita aqui.
    A ideia é que cada jogador tem seu próprio álbum, que é criado com a primeira jogada. Cada álbum deve passar por todos os jogadores apenas uma vez. 
    O caminho que será feito por cada álbum é registrado na matriz "final", onde final[i] representa o caminho do álbum criado pelo jogador i e final[i][j] nos diz quem irá "escrever uma nova página" no álbum criado pelo jogador i e na rodada j. Um detalhe: a primeira posição definida em cada final[i] representa o segundo jogador a editar o álbum i. Fizemos assim pois o primeiro jogador a editar o álbum i sempre será o próprio jogador i, logo é redundante fazer esse registro.
    Não conseguimos pensar em um algoritmo que resolvesse isso de maneira inteligente, então a função sorteio simplesmente escolhe jogadores aleatórios com algumas restrições óbvias. Entretanto, essas restrições não são suficientes para gerar uma matriz adequada: pode acontecer de, na última rodada, dois álbuns precisarem de serem "editados" pelo mesmo jogador, fazendo com que um álbum receba "undefined" na última rodada.
    Por isso, a randomização é feita infinitamente até a matriz estar totalmente correta.
    Também é necessário ter uma matriz que informe ao jogador, em cada uma das rodadas (excluíndo a última), para quem sua jogada deve ser enviada. É possível extrair essa matriz através da matriz "final". Todas essas trocas de jogadas são armazenadas em "trocas", onde trocas[i][j] armazena para quem o jogador i deve enviar sua jogada feita na rodada j.
  

*/
function sorteio() {
  let trocas = []; //guarda todas as trocas de jogadas
  let final = []; //guarda o caminho completo feito por cada jogada inicial;
  const jogadores = jogo.gameStatus.jogadores.length; //numero de jogadores no jogo
  for (let i = 1; i <= jogadores; i++) {
    final[i] = [];
    trocas[i] = [];
  }

  //final é definida aqui
  while (true) {
    let disponiveis = []; //matriz onde disponiveis[i] mostra quem escreveu/falta editou o álbum i. disponiveis[i][j] é igual 0 se o jogador j já editou o álbum i ou é igual a 1 se o jogador j ainda não editou o álbum i.
    for (let i = 1; i <= jogadores; i++) {
      disponiveis[i] = [];
    }

    for (let i = 1; i <= jogadores; i++) {
      //i representa o álbum do jogador i
      for (let j = 1; j <= jogadores; j++) {
        //j representa o jogador j
        if (i == j) disponiveis[i][j] = 0;
        //o criador do álbum já o editou ao criá-lo
        else disponiveis[i][j] = 1;
      }
    }
    let restart = 0; //booleano que faz o código reiniciar quando a randomização gerou uma matriz imperfeita
    //a matriz final começa a ser definida aqui
    for (let w = 1; w < jogadores && !restart; w++) {
      //para cada rodada (começando da segunda e indo até a última)

      jogadorDisponivel = new Array(jogadores + 1); //vetor que salva a disponibilidade de cada jogador na rodada atual
      for (let i = 1; i <= jogadores; i++) jogadorDisponivel[i] = 1; //inicialmente todos os jogadores estão disponíveis
      for (let i = 1; i <= jogadores && !restart; i++) {
        //para cada jogador
        let disponiveisNestaRodada = []; //vetor que salva os jogadores que podem editar o álbum i nesta rodada
        for (let j = 1; j <= jogadores; j++) {
          //loop para preencher o disponiveisNestaRodada.
          /*Se o jogador j ainda não editou o álbum i e não recebeu o álbum de outro jogador nessa rodada, ele é adicionado ao disponiveisNestaRodada*/
          if (disponiveis[i][j] && jogadorDisponivel[j])
            disponiveisNestaRodada.push(j);
        }

        let indiceEscolhido = Math.floor(
          Math.random() * disponiveisNestaRodada.length
        ); //escolhe aleatoriamente um índice do disponiveisNestaRodada e o salva o jogador correspondente em jogadorEscolhido
        let jogadorEscolhido = disponiveisNestaRodada[indiceEscolhido];
        disponiveis[i][jogadorEscolhido] = 0; //agora o jogadorEscolhido já está editando o álbum i
        jogadorDisponivel[jogadorEscolhido] = 0; //jogadorEscolhido está ocupado nesta rodada
        final[i][w] = jogadorEscolhido;
        if (typeof final[i][w] == "undefined") restart = 1; //se o sorteio escolheu mal os caminhos o loop deve reiniciar
      }
    }
    if (!restart) break; //se a matriz final está correta o laço infinito é quebrado
  }

  //a matriz trocas é definida aqui
  /* Excluíndo o caso onde estamos na primeira rodada, é possível definir para quem o jogador i deve enviar sua jogada na rodada j descobrindo qual álbum o jogador i editou na rodada anterior e salvando seu índice. Com isso, veja que final[índice do álbum][j] é exatamente o jogador que deve receber a j-ésima jogada do jogador i.*/
  for (let player = 1; player <= jogadores; player++) {
    trocas[player][1] = final[player][1]; //A primeira troca feita por todo jogador consiste em passar o álbum que acabaram de criar para outro jogador. É exatamente o caminho descrito pelo álbum na segunda rodada, que está salvo em final[player][1].

    for (let rodada = 2; rodada < jogadores; rodada++) {
      let recebido;
      for (let i = 1; i <= jogadores; i++) { 
        if (final[i][rodada - 1] == player) {
          recebido = i;
          break;
        }
      }
      trocas[player][rodada] = final[recebido][rodada];
    }
  }

  return [final, trocas]; /*final será utilizada apenas no fim do jogo (daí vem o seu nome), pois é ela que registra as "páginas" de cada um dos álbuns. Trocas é usada no back-end para organizar a logística de enviar e receber as jogadas. Veja mais explicações sobre as trocas (app.js linha 175-200) e final (back-end-game.js linha 90-107)
  OBS: ver explicações sobre final apenas depois de ver sobre as trocas.
  */
}

module.exports = { sorteio };
