const jogadores = 10;



let trocas = [];
let disponiveis = [];
for (let i = 1; i <= jogadores; i++) {
    disponiveis[i] = [];
    trocas[i] = [];
}


while(true){
    let disponiveis = [];
    for (let i = 1; i <= jogadores; i++) {
        disponiveis[i] = [];
        trocas[i] = [];
    }

    for (let i = 1; i <= jogadores; i++) {
        for (let j = 1; j <= jogadores; j++) {
            if (i == j) disponiveis[i][j] = 0;
            else
                disponiveis[i][j] = 1;
            // console.log(disponiveis[i][j]);
        }
    }
    let restart = 0;
    for(let w = 0; w < jogadores-1; w++){

        jogadorDisponivel = new Array(jogadores+1);
        for(let i = 1; i <= jogadores; i++)jogadorDisponivel[i] = 1;
        for(let  i = 1; i <= jogadores; i++){
            let disponiveisNestaRodada = [];
            for(let j=1;j<=jogadores;j++){
                if(disponiveis[i][j]&&jogadorDisponivel[j])disponiveisNestaRodada.push(j);
            }
            
            let randomI = Math.floor(Math.random()*disponiveisNestaRodada.length);
            let jogadorEscolhido = disponiveisNestaRodada[randomI];
            //console.log(jogadorEscolhido);
            disponiveis[i][jogadorEscolhido] = 0;
            jogadorDisponivel[jogadorEscolhido] = 0;
            trocas[i][w] = jogadorEscolhido;
            if(typeof trocas[i][w]=="undefined")restart = 1;
        }


    }
    if(!restart)break;
}



for(let i=1;i<=jogadores;i++){
    for(let j=0;j<jogadores-1;j++){
        console.log(trocas[i][j]);
    }
    console.log("PROXIMO JOGADOR");
}