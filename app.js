const express = require("express");
const app = express();
const path = require("path");
const { gerenciadorDoJogo, rodada, inicializarJogo } = require("./back-end-game")
const {jogo} = require("./variaveis");
app.use(express.json());
app.use(express.static('public'));

app.get("/lobby", (req,res) => {
    
    res.sendFile(path.join(__dirname+"/views/lobby.html"));
})
app.get("/game", (req, res) => {
    if(jogo.gameStatus.rodadaAtual==0){
        res.sendFile(path.join(__dirname + "/views/desenho.html"));
    }else{
        res.sendFile(path.join(__dirname + "/views/escreva.html"))
    }
})

app.get("/aboutus", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
})

app.get("/jogadores", (req,res) => {
    if(jogo.gameStatus.jogadores.length){
        jogo.gameStatus.lider = jogo.gameStatus.jogadores[0].nome;
    }
    res.send(jogo.gameStatus);
});

app.post("/jogadores", (req,res) => {

    if(req.body.start){
        inicializarJogo(1);
    }else{
        const nomeJogador = req.body.nome;
        let ok = 1;
        for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
            if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
                ok = 0;
                res.send({changeUsername: 1});
            }
        }
        if(ok){
            jogo.gameStatus.jogadores.push({nome:nomeJogador,pronto: 0});
            res.send(jogo.gameStatus);
        }
    }
})

app.post("/changeReadyState", (req, res) => {
    const nomeJogador = req.body.nome;
    iniciar = 1;
    for(let i=0;i<jogo.gameStatus.jogadores.length;i++){
        if(jogo.gameStatus.jogadores[i].nome==nomeJogador){
            jogo.gameStatus.jogadores[i].pronto = 1 - jogo.gameStatus.jogadores[i].pronto;
            
        }
        if(!jogo.gameStatus.jogadores[i].pronto)iniciar=0;
    }
    if(jogo.gameStatus.estado == "esperando" &&iniciar){

        inicializarJogo(0);

    }else if(jogo.gameStatus.estado == "jogando" && iniciar) {

       jogo.acabouRodada = 1;

    }
    res.send(jogo.gameStatus);
})

app.post("/saindo", (req,res) => {
    if(jogo.gameStatus.estado != "esperando")return;
    const nomeJogador = req.body.nome;
    for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
        if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
            jogo.gameStatus.jogadores.splice(i,1);
            console.log(`player ${nomeJogador} left the lobby`);
            break;
        }
    }
    res.send("ok");
})

app.post("/enviarJogada", (req,res) => {
    const nomeJogador = req.body.nome;
    const jogada = req.body.jogada;
    let id = jogo.idJogadores[nomeJogador];
    console.log(jogada);

    jogo.desenhos[trocas[id][jogo.rodada]][jogo.rodada] = jogada;
    res.send("ok");
})

app.post("/receberJogada", (req,res) => {
    const nomeJogador = req.body.nome;
    let id = jogo.idJogadores[nomeJogador];
    res.send(jogo.desenhos[id][jogo.rodada-1]);
})

app.get('*' , (req,res) => {

    res.redirect('/lobby');

})



app.listen(3000, () => console.log("server online"));