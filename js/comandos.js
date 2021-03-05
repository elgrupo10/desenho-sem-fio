let comandoPincel = {
    
    nome: "pincel",
    x: [],
    y: [],
    color: "black",
    espessura: 5,
    executar: (ctx) =>{

    }
}

let comandoFill = {

    nome:"fill",
    color: "black",
    x: 0,
    y: 0,
    tolerancia: 140
    executar: (ctx) =>{
        preencher(this)
    }
}

let PilhadeComandos = [];
