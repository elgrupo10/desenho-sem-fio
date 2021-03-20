const express = require("express");
const app = express();
const path = require("path");
const {jogo} = require("./variaveis");
const { sorteio } = require("./sorteio");
const {inicializarJogo} = require("./back-end-game");
const PORT = process.env.PORT || 3001;
let trocas,final;
let matrizes;
app.use(express.json());
app.use(express.static('public'));

app.get("/lobby", (req,res) => {
    if(jogo.gameStatus.estado!="esperando"){
        res.redirect("/indisponivel");
        return;
    }
    res.sendFile(path.join(__dirname+"/views/lobby.html"));
})
app.get("/game", (req, res) => {
    // if(jogo.gameStatus.estado=="esperando"||jogo.gameStatus.estado=="mostrando-books"){
    //     res.redirect("/lobby");
    //     return;
    // }
    if(jogo.gameStatus.rodadaAtual==0){
        res.sendFile(path.join(__dirname + "/views/desenho.html"));
    }else{
        res.sendFile(path.join(__dirname + "/views/escreva.html"));
    }
            })

app.get("/aboutus", (req,res) => {
    if(jogo.gameStatus.estado=="jogando"||jogo.gameStatus.estado=="fim-da-rodada"){
        res.redirect("/game");
        return;
    }
    res.sendFile(path.join(__dirname + "/views/about.html"));
})
app.get("/final", (req,res) => {
    // if(jogo.gameStatus.estado!="mostrando-books"){
    //     if(jogo.gameStatus.estado=="esperando"){
    //         res.redirect("/lobby");
    //     }else{
    //         res.redirect("/game");
    //     }
    //     return;
    // }
    res.sendFile(path.join(__dirname + "/views/books.html"));
})

app.get("/indisponivel", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/cheia.html"));
})

app.get("/jogadores", (req,res) => {
    if(jogo.gameStatus.jogadores.length){
        jogo.gameStatus.lider = jogo.gameStatus.jogadores[0].nome;
    }
    res.send(jogo.gameStatus);
});

app.post("/jogadores", (req,res) => {

    if(req.body.start){
        matrizes = sorteio();
        trocas = matrizes[1];
        
        final = matrizes[0];
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
            console.log(`player ${nomeJogador} joined the lobby`);
            res.send(jogo.gameStatus);
        }
    }
})

app.post("/changeReadyState", (req, res) => {
    const nomeJogador = req.body.nome;
    iniciar = 1;
    for(let i=0;i<jogo.gameStatus.jogadores.length;i++){
        if(jogo.gameStatus.jogadores[i].nome==nomeJogador){

            if (req.body.semprePronto) jogo.gameStatus.jogadores[i].pronto = 1;

            else{
                jogo.gameStatus.jogadores[i].pronto = 1 - jogo.gameStatus.jogadores[i].pronto;
            }
            
        }
        if(!jogo.gameStatus.jogadores[i].pronto)iniciar=0;
    }
    if(jogo.gameStatus.estado == "esperando" &&iniciar){
         matrizes = sorteio();
         trocas = matrizes[1];
         final = matrizes[0];
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

app.post("/saindoGame", (req,res) => {
    if (jogo.gameStatus.estado != "esperando")return;

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
    if(id === undefined){
        res.send("nome inválido");
        return;
    }
    console.log(`jogador numero ${id} mandando para jogador ${trocas[id][jogo.gameStatus.rodada]}`);
    if(jogo.gameStatus.rodada!=jogo.gameStatus.jogadores.length){
        jogo.desenhos[trocas[id][jogo.gameStatus.rodada]][jogo.gameStatus.rodada] = [jogada,nomeJogador];
    }else{
        jogo.desenhos[id][jogo.gameStatus.rodada] = [jogada,nomeJogador];
    }
    res.send("ok");
})

app.post("/receberJogada", (req,res) => {
    const nomeJogador = req.body.nome;
    let id = jogo.idJogadores[nomeJogador];
    if (id === undefined) {
        res.send("nome inválido");
        return;
    }
    // console.log(`jogador ${nomeJogador} esta recebendo ${jogo.desenhos[id][jogo.gameStatus.rodada - 1][0]} do jogador ${jogo.desenhos[id][jogo.gameStatus.rodada - 1][1]}`);
    res.send({response: jogo.desenhos[id][jogo.gameStatus.rodada-1][0]});
})

app.post("/trocandoNome", (req,res) => {
    const nomeJogador = req.body.nome;
    for(let i = 0; i<jogo.gameStatus.jogadores.length; i++) {
    if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
        jogo.gameStatus.jogadores.splice(i, 1);
        console.log(`player ${nomeJogador} left the lobby`);
        res.send("ok");
        break;
    }
}
});

app.get("/books", (req,res) => {
    res.send(jogo.bookStatus);
})

app.get("/gameData", (req,res) => {
    res.send({
        desenhos:jogo.desenhos,
        caminhos:final,
        lider: jogo.gameStatus.lider,
        rodadas: jogo.gameStatus.jogadores.length,
        tipoDeRodada: jogo.gameStatus.rodadaAtual,
        idJogadores: jogo.idJogadores
        });
})

app.post("/mudarDisplay", (req,res) => {
    const tipo = req.body.tipo;
    switch(tipo){
        case 1:
            jogo.bookStatus.rodadaAtual--;
        case 2:
            jogo.bookStatus.rodadaAtual++;
        case 3:
            jogo.bookStatus.jogadorAtual--;
            jogo.bookStatus.rodadaAtual = 1;
        case 4:
            jogo.bookStatus.jogadorAtual++;
            jogo.bookStatus.rodadaAtual = 1;
    } 
    res.send("ok");
})


app.get('*' , (req,res) => {

    res.redirect('/lobby');

})



app.listen(PORT, () => console.log(`Hosting server on port ${PORT}`));