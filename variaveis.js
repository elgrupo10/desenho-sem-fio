module.exports.jogo = {
  data: new Date(),
  acabouRodada: 0, //avisa que a rodada acabou para o back-end
  podeComecar: 0, //avisa ao front-end que a partida deve começar
  idJogadores: {}, //transforma o nome de cada jogador em um número
  desenhos: Array.from({ length: 11 }, (e) => Array(11).fill(null)), //matriz que salva os desenhos/frases a serem recebidos por cada jogador e em cada rodada
  trocas: Array.from({ length: 11 }, (e) => Array(11).fill(null)), //copia a matriz de trocas (definida em sorteio.js)
  final: Array.from({ length: 11 }, (e) => Array(11).fill(null)), //copia a matriz de trocas (definida em sorteio.js)
  presentes: {}, //salva os jogadores presentes em uma rodada
  desenhosFinal: Array.from({ length: 11 }, (e) => Array(11).fill(null)), //salva as jogadas com base na matriz final
  gameStatus: {
    jogadores: [],
    lider: "",
    estado: "esperando",
    tipoDeInicio: 0, //avisa ao front end como a partida foi iniciada. 1->líder iniciou / 0->todos ficaram prontos
    rodadaAtual: undefined, //determina se os jogadores devem escrever or desenhar. 0->desenhar / 1->escrever
    tempoRestante: 100,
    rodada: 1, //salva o número da rodada atual
    tempos: undefined, //determina o tempo de cada rodada
    vacilao: "", //se alguém se desconectar durante o jogo, seu nome é salvo aqui
    banidos: [],
  },

  bookStatus: {
    jogadorAtual: 1,
    rodadaAtual: 1,
    reiniciarPartida: 0,
  },
};
