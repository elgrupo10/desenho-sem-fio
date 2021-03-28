const express = require("express");
const app = express();
const path = require("path");
const { jogo } = require("./variaveis");
const { sorteio } = require("./sorteio");
const { inicializarJogo, reiniciar } = require("./back-end-game");
const PORT = process.env.PORT || 3001;
let trocas, final;
let matrizes;
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.json({ limit: "25mb" }));
app.use(express.static("public"));

app.get("/download", (req, res) => {
  res.render("download", {
    matrix: JSON.stringify(jogo.desenhosFinal),
    nJogadores: jogo.gameStatus.jogadores.length,
    data: jogo.data
  });
});
app.get("/lobby", (req, res) => {
  if (jogo.gameStatus.estado != "esperando") {
    if(jogo.gameStatus.estado == "jogando" || jogo.gameStatus.estado == "fim-da-rodada"){
      res.redirect("/game");
    }else{
      res.redirect("/final");
    }
    return;
  }
  res.sendFile(path.join(__dirname + "/views/lobby.html"));
});
app.get("/game", (req, res) => {
  if (jogo.gameStatus.estado == "esperando") {
    res.redirect("/lobby");
    return;
  }
  if (jogo.gameStatus.estado == "mostrando-books") {
    res.redirect("/final");
    return;
  }
  if (jogo.gameStatus.rodadaAtual == 0) {
    res.sendFile(path.join(__dirname + "/views/desenho.html"));
  } else {
    res.sendFile(path.join(__dirname + "/views/escreva.html"));
  }
});

app.get("/aboutus", (req, res) => {
  if (
    jogo.gameStatus.estado == "jogando" ||
    jogo.gameStatus.estado == "fim-da-rodada"
  ) {
    res.redirect("/game");
    return;
  }
  res.sendFile(path.join(__dirname + "/views/about.html"));
});
app.get("/final", (req, res) => {
  if (jogo.gameStatus.estado != "mostrando-books") {
    if (jogo.gameStatus.estado == "esperando") {
      res.redirect("/lobby");
    } else {
      res.redirect("/game");
    }
    return;
  }
  res.sendFile(path.join(__dirname + "/views/books.html"));
});

app.get("/indisponivel", (req, res) => {
  if (jogo.gameStatus.estado == "esperando") {
    res.redirect("/lobby");
    return;
  }
  if (jogo.gameStatus.estado == "mostrando-books") {
    res.redirect("/final");
    return;
  }
  res.sendFile(path.join(__dirname + "/views/cheia.html"));
});

app.get("/jogadores", (req, res) => {
  if (jogo.gameStatus.jogadores.length) {
    jogo.gameStatus.lider = jogo.gameStatus.jogadores[0].nome;
  }
  res.send(jogo.gameStatus);
});

app.post("/jogadores", (req, res) => {
  if (req.body.start) {
    matrizes = sorteio();
    jogo.bookStatus.reiniciarPartida = 0;
    trocas = matrizes[1];
    final = matrizes[0];
    jogo.final = final;
    jogo.trocas = trocas;
    inicializarJogo(1);
  } else {
    const nomeJogador = req.body.nome;
    let ok = 1;
    for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
      if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
        ok = 0;
        res.send({ changeUsername: 1 });
      }
    }
    if (ok) {
      jogo.gameStatus.jogadores.push({
        nome: nomeJogador,
        pronto: 0,
        kickado: 0,
      });
      console.log(`player ${nomeJogador} joined the lobby`);
      res.send(jogo.gameStatus);
    }
  }
});

app.post("/changeReadyState", (req, res) => {
  const nomeJogador = req.body.nome;
  iniciar = 1;
  for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
    if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
      if (req.body.semprePronto) jogo.gameStatus.jogadores[i].pronto = 1;
      else {
        jogo.gameStatus.jogadores[i].pronto =
          1 - jogo.gameStatus.jogadores[i].pronto;
      }
    }
    if (!jogo.gameStatus.jogadores[i].pronto) iniciar = 0;
  }
  if (jogo.gameStatus.estado == "esperando" && iniciar) {
    matrizes = sorteio();
    jogo.bookStatus.reiniciarPartida = 0;
    trocas = matrizes[1];
    final = matrizes[0];
    jogo.final = final;
    jogo.trocas = trocas;
    inicializarJogo(0);
  } else if (jogo.gameStatus.estado == "jogando" && iniciar) {
    jogo.acabouRodada = 1;
  }
  res.send(jogo.gameStatus);
});

app.post("/saindo", (req, res) => {
  if (jogo.gameStatus.estado != "esperando") {
    return;
  }
  const nomeJogador = req.body.nome;
  for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
    if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
      jogo.gameStatus.jogadores.splice(i, 1);
      console.log(`player ${nomeJogador} left the lobby`);
      break;
    }
  }
  res.send("ok");
});

app.post("/marcarPresenca", (req, res) => {
  const nomeJogador = req.body.nome;
  if (jogo.idJogadores[nomeJogador] == undefined) {
    res.redirect("/indisponivel");
    return;
  }else{
    jogo.presentes[nomeJogador] = 1;
    res.send("ok");
  }
});

app.post("/enviarJogada", (req, res) => {
  const nomeJogador = req.body.nome;
  let jogada = req.body.jogada;
  let id = jogo.idJogadores[nomeJogador]; //transforma o nome do jogador em número
  if (id === undefined) {
    res.send("nome inválido");
    return;
  }
  if (jogada == "") jogada = "Que vergonha! O jogador não escreveu nada...";
  if (jogo.gameStatus.rodada != jogo.gameStatus.jogadores.length) {
    // se o jogo não está na última rodada
    console.log(
      `jogador numero ${id} mandando para jogador ${
        trocas[id][jogo.gameStatus.rodada]
      }`
    );
    /*
    desenhos[i][j] representa a jogada enviada ao jogador i na rodada j. Além de salvar a jogada, desenhos[i][j] também salva o remetente da jogada. O jogador que deve receber a jogada do jogador id está salvo em trocas[id][gameStatus.rodada].
    */
    jogo.desenhos[trocas[id][jogo.gameStatus.rodada]][
      jogo.gameStatus.rodada
    ] = [jogada, nomeJogador];
  } else {
    console.log(`jogador numero ${id} finalizou seu jogo.`);
    /*
    a última rodada é um caso especial. Não há mais trocas a serem feitas, então podemos simplesmente adicionar a jogada ao vetor de seu próprio autor.  
    */
    jogo.desenhos[id][jogo.gameStatus.rodada] = [jogada, nomeJogador];
  }
  res.send("ok");
});

app.post("/receberJogada", (req, res) => {
  const nomeJogador = req.body.nome;
  let id = jogo.idJogadores[nomeJogador]; //transforma o nome do jogador em número
  if (id === undefined) {
    res.send("nome inválido");
    return;
  }
  /* o tratamento feito no envio das jogadas serve para simplificar o recebimento. Aqui, basta pegar o que foi enviado ao jogador id na última rodada. */
  res.send({ response: jogo.desenhos[id][jogo.gameStatus.rodada - 1][0] });
});

app.post("/trocandoNome", (req, res) => {
  const nomeJogador = req.body.nome;
  for (let i = 0; i < jogo.gameStatus.jogadores.length; i++) {
    if (jogo.gameStatus.jogadores[i].nome == nomeJogador) {
      jogo.gameStatus.jogadores.splice(i, 1);
      console.log(`player ${nomeJogador} left the lobby`);
      res.send("ok");
      break;
    }
  }
});

app.get("/books", (req, res) => {
  res.send(jogo.bookStatus);
});

app.get("/gameData", (req, res) => {
  res.send({
    desenhos: jogo.desenhosFinal,
    lider: jogo.gameStatus.lider,
    rodadas: jogo.gameStatus.jogadores.length,
    tipoDeRodada: jogo.gameStatus.rodadaAtual,
  });
});

app.post("/mudarDisplay", (req, res) => {
  const tipo = req.body.tipo;
  switch (tipo) {
    case 1:
      jogo.bookStatus.rodadaAtual++;
      break;
    case 2:
      jogo.bookStatus.jogadorAtual--;
      jogo.bookStatus.rodadaAtual = 1;
      break;
    case 3:
      jogo.bookStatus.jogadorAtual++;
      jogo.bookStatus.rodadaAtual = 1;
      break;
  }
  res.send("ok");
});

app.post("/reiniciar", (req, res) => {
  const nomeJogador = req.body.nome;
  if (nomeJogador != jogo.gameStatus.lider) {
    return;
  }
  jogo.bookStatus.reiniciarPartida = 1;
  reiniciar();
  jogo.podeComecar = 0;
  res.send("ok");
});

app.post("/configuracoes", (req, res) => {
  if (req.body.nome != jogo.gameStatus.lider) {
    return;
  }
  let tempos = [
    [150, 40],
    [100, 35],
    [60, 20],
  ];
  let tempo = parseInt(req.body.tempo, 10);
  let inicio = parseInt(req.body.tipoInicio, 10);
  jogo.gameStatus.tempos = tempos[tempo];
  if (inicio != 2) {
    jogo.gameStatus.rodadaAtual = inicio;
  } else {
    jogo.gameStatus.rodadaAtual = Math.floor(Math.random() * 2);
  }
  jogo.podeComecar = 1;
  res.send("ok");
});

app.get("/podeIniciar", (req, res) => {
  res.send({ podeIniciar: jogo.podeComecar });
});

app.post("/kickarJogador", (req, res) => {
  const nomeJogador = req.body.nomeJogador;
  jogo.gameStatus.banidos.push(nomeJogador);
  console.log(`player ${nomeJogador} was banned from the lobby`);
  res.send("ok");
});

app.post("/checkBanStatus", (req, res) => {
  const nomeJogador = req.body.nome;
  res.send(jogo.gameStatus.banidos.includes(nomeJogador));
});

app.get("*", (req, res) => {
  if (jogo.gameStatus.estado == "esperando") {
    res.redirect("/lobby");
    return;
  }
  if (
    jogo.gameStatus.estado == "jogando" ||
    jogo.gameStatus.estado == "fim-da-rodada"
  ) {
    res.redirect("/game");
    return;
  }
  if (jogo.gameStatus.estado == "mostrando-books") {
    res.redirect("/final");
  }
});

app.listen(PORT, () => console.log(`Hosting server on port ${PORT}`));
