function sorteio() {
    let trocas = [];
    const jogadores = 10;


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
                disponiveis[i][jogadorEscolhido] = 0;
                jogadorDisponivel[jogadorEscolhido] = 0;
                trocas[i][w] = jogadorEscolhido;
                if(typeof trocas[i][w]=="undefined")restart = 1;
            }


        }
        if(!restart)break;
    }

    

    return trocas;
}

module.exports = {sorteio};