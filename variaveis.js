module.exports.jogo = {
  acabouRodada: 0,
  podeComecar: 0,
  idJogadores: {},
  desenhos: Array.from({ length: 11 }, (e) => Array(11).fill(null)),
  trocas: [],
  final: Array.from({ length: 11 }, (e) => Array(11).fill(null)),
  presentes: {},
  desenhosFinal: Array.from({ length: 11 }, (e) => Array(11).fill(null)),
  gameStatus: {
    jogadores: [
      
    ],
    lider: "",
    estado: "esperando",
    tipoDeInicio: 0,
    rodadaAtual: undefined,
    tempoRestante: 100,
    rodada: 1,
    tempos: undefined,
    vacilao: "",
    banidos: [],
  },

  bookStatus: {
    jogadorAtual: 1,
    rodadaAtual: 1,
    reiniciarPartida: 0,
  },
};
