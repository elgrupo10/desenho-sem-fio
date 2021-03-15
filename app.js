const express = require("express");
const app = express();
const path = require("path");
const sorteio = require("./public/js/sorteio.js");
app.use(express.json());
app.use(express.static('public'));

app.get("/lobby", (req,res) =>{

    res.sendFile(path.join(__dirname+"/views/lobby.html"));
})
app.get("/game", (req, res) =>{
    if(gameStatus.currentRound==0){
        res.sendFile(path.join(__dirname + "/views/desenho.html"));
    }else{
        res.sendFile(path.join(__dirname + "/views/escreva.html"))
    }
})

let acabouRodada = 0;

let gameStatus = {
    jogadores:[
        // {nome: "Coutinho",pronto:1},
        // {nome: "Helin",pronto:0}   
    ],
    leader:"",
    state: "waiting",
    startType:1,
    currentRound:0
};

app.get("/jogadores", (req,res) =>{
    if(gameStatus.jogadores.length){
        gameStatus.leader = gameStatus.jogadores[0].nome;
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
    if(gameStatus.state == "waiting" &&iniciar){

        inicializarJogo(0);

    }else if(gameStatus.state == "playing"&&iniciar){

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




function inicializarJogo(tipo){
    console.log("jogo iniciando");
    gameStatus.state = "playing";
    gameStatus.startType = tipo;
    console.log(tipo);
    gameStatus.currentRound = Math.ceil(Math.random() * 2);
    sorteio()
}

function rodada() {
    let tempos = [25,50];
    let width = 100;
    let id = setInterval(frame, tempos[gameStatus.currentRound]);
    function frame() {
        if (width <= 0 || acabouRodada) {
            clearInterval(id);
            acabouRodada = 0;
            gameStatus.state = "new-round";
            gameStatus.currentRound = 1 - gameStatus.currentRound;
        } else {
            console.log(tempos[tipoDeInicio]);
            width -= 0.1;
        }
    }
}

function gerenciadorDoJogo(){

    let rodadas = gameStatus.jogadores.length;
    for(let i =0;i<rodadas;i++){

        for(jogador in gameStatus.jogadores){
            jogador.pronto = 0;
        }
        rodada();
    }
}

app.listen(3000, () => console.log("server online"));