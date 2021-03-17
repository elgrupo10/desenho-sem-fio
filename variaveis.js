module.exports.jogo = {
    
    acabouRodada: 0,
    idJogadores: {},
    tempos: [25, 20],
    desenhos: Array(11).fill(Array(11).fill(0)),
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
        
    }
    
}


