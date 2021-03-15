const express = require("express");
const app = express();
const path = require("path");
const sorteio = require("./public/js/sorteio");
const { gerenciadorDoJogo, enviarNovaTarefa, rodada, enviarNovaTarefa, inicializarJogo } = require("./back-end-game")
const {jogo} = require("./variaveis");
app.use(express.json());
app.use(express.static('public'));

app.get("/lobby", (req,res) =>{
    
    res.sendFile(path.join(__dirname+"/views/lobby.html"));
})
app.get("/game", (req, res) =>{
    if(gameStatus.rodadaAtual==0){
        res.sendFile(path.join(__dirname + "/views/desenho.html"));
    }else{
        res.sendFile(path.join(__dirname + "/views/escreva.html"))
    }
})
app.get("/jogadores", (req,res) =>{
    if(gameStatus.jogadores.length){
        gameStatus.lider = gameStatus.jogadores[0].nome;
    }
    res.send(gameStatus);
});

app.post("/jogadores", (req,res) =>{

    if(req.body.start){
        inicializarJogo(1);
    }else{
        const nomeJogador = req.body.nome;
        let ok = 1;
        for (let i = 0; i < gameStatus.jogadores.length; i++) {
            if (gameStatus.jogadores[i].nome == nomeJogador) {
                ok = 0;
                res.send({changeUsername: 1});
            }
        }
        if(ok){
            gameStatus.jogadores.push({nome:nomeJogador,pronto: 0});
            res.send(gameStatus);
        }
    }
})

app.post("/changeReadyState", (req, res) => {
    const nomeJogador = req.body.nome;
    iniciar = 1;
    for(let i=0;i<gameStatus.jogadores.length;i++){
        if(gameStatus.jogadores[i].nome==nomeJogador){
            gameStatus.jogadores[i].pronto = 1 - gameStatus.jogadores[i].pronto;
            
        }
        if(!gameStatus.jogadores[i].pronto)iniciar=0;
    }
    if(gameStatus.estado == "esperando" &&iniciar){

        inicializarJogo(0);

    }else if(gameStatus.estado == "jogando" &&iniciar){

       acabouRodada = 1;

    }
    res.send(gameStatus);
})

app.post("/saindo", (req,res) => {
    const nomeJogador = req.body.nome;
    for (let i = 0; i < gameStatus.jogadores.length; i++) {
        if (gameStatus.jogadores[i].nome == nomeJogador) {
            gameStatus.jogadores.splice(i,1);
            console.log(`player ${nomeJogador} left the lobby`);
            break;
        }
    }
})





app.listen(3000, () => console.log("server online"));