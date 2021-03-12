const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.static('public'));
app.get("/lobby", (req,res) =>{
    res.sendFile(path.join(__dirname+"/views/lobby.html"));
})
app.get("/game", (req, res) =>{
    res.sendFile(path.join(__dirname + "/views/desenho.html"));
})

let iniciar = 0;

let gameStatus = {
    jogadores:[
    {nome: "Coutinho",pronto:1},
    {nome: "Helin",pronto:0}   
],
leader:"",
start: 0};
app.get("/jogadores", (req,res) =>{
    gameStatus.leader = gameStatus.jogadores[0].nome;
    res.send(gameStatus);

});

app.post("/jogadores", (req,res) =>{
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
    //1. pegar o nome do jogador
    //2. colocar o jogador no vetor
    //3. responder o front end :thumbsup:

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
    if(iniciar)gameStatus.start = 1;
    res.send(gameStatus);
    //1. pegar o nome do jogador
    //2. mudar o estado de pronto dele
    //3. responder o front end :thumbsup:
})

app.post("/saindo", (req,res) => {
    const nomeJogador = req.body.nome;
    for (let i = 0; i < gameStatus.jogadores.length; i++) {
        if (gameStatus.jogadores[i].nome == nomeJogador) {
            gameStatus.jogadores.splice(i,1);
            console.log(`player ${nomeJogador} left the lobby`);
            // if(nomeJogador == gameStatus.leader)
            break;
        }
    }
})


app.listen(3000, () => console.log("server online"));