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


const jogadores = [
    {nome: "Coutinho",pontuacao: 5},
    {nome: "Helin",pontuacao: 500},
    
];
app.get("/jogadores", (req,res) =>{
    res.send(jogadores);
});

app.post("/jogadores", (req,res) =>{
    const nomeJogador = req.body.nome;
    jogadores.push({nome:nomeJogador,pontuacao:0});
    res.send(jogadores);
    //1. pegar o nome do jogador
    //2. colocar o jogador no vetor
    //3. responder o front end :thumbsup:

})


app.listen(3000, () => console.log("server online"));