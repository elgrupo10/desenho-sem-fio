module.exports.jogo = {
    
    acabouRodada: 0,
    podeComecar: 0,
    idJogadores: {},
    desenhos:Array.from({ length: 11 }, e => Array(11).fill(null)),
    presentes: {},
    gameStatus : {
        jogadores: [
            // {nome: "Coutinho",pronto:1},
            // {nome: "Helin",pronto:1},   
            // {nome: "pejunto",pronto:1},   
            // {nome: "guima",pronto:1}, 
            // {nome: "lebraga",pronto:1},   
            // {nome: "gordola",pronto:1}   
        ],
        lider: "",
        estado: "esperando",
        tipoDeInicio: 0,
        rodadaAtual: 1,
        tempoRestante: 100,
        rodada: 1,
        tempos: undefined,
        vacilao: ""
    },

    bookStatus: {
        jogadorAtual: 1,
        rodadaAtual: 1,
        reiniciarPartida: 0
    }
    
}


