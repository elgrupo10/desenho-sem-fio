module.exports.jogo = {
    
    acabouRodada: 0,
    idJogadores: {},
    desenhos:Array.from({ length: 11 }, e => Array(11).fill(null)),
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
        rodadaAtual: 0,
        tempoRestante: 100,
        rodada: 1,
        tempos: [50, 25]
        
    },

    bookStatus: {
        idJogadorAtual: 1,
        rodadaAtual: 1
    }
    
}


