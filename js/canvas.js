<<<<<<< HEAD
=======
const canvas = document.querySelector("#canvas");
let canvasEl = document.querySelector("#gridCanvas");
let borracha = document.querySelector("#borracha");
let refazerEl = document.querySelector("#refazer");
let desfazerEl = document.querySelector("#desfazer");
let botaoEl = document.querySelector("#preencher");
let canvasRect = canvas.getBoundingClientRect();
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
let body = document.body;

//canvas

const canvas = document.querySelector("#canvas");
const canvas2 = document.querySelector("#canvas-transparente");
const ctx = canvas.getContext('2d');
<<<<<<< HEAD
const ctx2 = canvas2.getContext('2d');
let canvasRect = canvas.getBoundingClientRect();
=======
let colorEl = document.querySelector("#seletor-rgb");
let espessuraEl = document.querySelector("#seletor-espessura");
let isFilling = false;
let points = [];
let points2 = [];
let toleranciaEl = document.querySelector("#tolerancia");
let tolerancia = 100;
let estaPintando = false;
let isErasing = false;
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab

let funcao = document.querySelector('[name="pincel"]:checked');

<<<<<<< HEAD
//personalizações do usuário

let borrachaEl = document.querySelector("#borracha");
let refazerEl = document.querySelector("#refazer");
let desfazerEl = document.querySelector("#desfazer");
let preencherEl = document.querySelector("#preencher");
let linhaEl = document.querySelector("#linha");
let quadradoEl = document.querySelector("#quadrado");
let circuloEl = document.querySelector("#circulo");
let colorEl = document.querySelector("#seletor-rgb");
let espessuraEl = document.querySelector("#seletor-espessura");
let toleranciaEl = document.querySelector("#tolerancia");
let radios = document.querySelectorAll('input[type=radio][name="pincel"]');

//Estados das ferramentas
let estaPintando = false;
let estaPintandoCirculo = false;
let estaPintandoLinha = false; 
let estaPintandoRetangulo = false;
let xInicial,yInicial;

let modos = {
    "preencher": 0,
    "borracha": 0,
    "linha": 0,
    "pincel": 1
}

//Vetores que salvam o histórico de modificações
let points = [];
let points2 = [];

//Outras variáveis
let tolerancia = 100;


=======
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
function comeco(e){
    estaPintando = true;
    ctx.beginPath();
    points2 = [];
    desenhar(e,1);
    
}
<<<<<<< HEAD
function pare(e){

    if (modos["linha"] && estaPintandoLinha) {
        finalizarLinha(e);
    }

    if (modos["retangulo"] && estaPintandoRetangulo) {
        finalizarRetangulo(e);
    }

    if(modos["circulo"] && estaPintandoCirculo){
        finalizarCirculo(e);
    }

    estaPintando = false;
    estaPintandoLinha = false;
    estaPintandoRetangulo = false;
    estaPintandoCirculo = false;
    if(modos["pincel"]&&points.length){
    points[points.length-1].mode = "end";
    }
    
=======
function fim(){
    estaPintando = false;
    points[points.length-1].mode = "end";
}
function pare(){
    estaPintando = false;
    ctx.beginPath();
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
}

function naopinte(e){
    if(e.clientX < canvasRect.x || e.clientY < canvasRect.y || e.clientY > canvasRect.height + canvasRect.y || e.clientX > canvasRect.width + canvasRect.x){
<<<<<<< HEAD
        ctx.beginPath();
=======
        ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
        
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
    }     
}

function desenhar(e,start){
<<<<<<< HEAD
    if(!estaPintando||(!modos["pincel"]&&!modos["borracha"]))return;

    if (modos["borracha"]){

        ctx.strokeStyle = "white";

    }else{

        ctx.strokeStyle = colorEl.value;

    }

=======
    if(!estaPintando||isFilling)return;
    if(isErasing){
        ctx.strokeStyle = "white";
    }else{
        ctx.strokeStyle = colorEl.value;
    }
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
    let ultimoX = e.clientX - canvasRect.x;
    let ultimoY = e.clientY - canvasRect.y;
    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
    ctx.moveTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
<<<<<<< HEAD

    if(!start){

        points.push({

=======
    if(!start){
        points.push({
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
            x: ultimoX,
            y: ultimoY,
            width: espessuraEl.value,
            color: ctx.strokeStyle,
            mode: "default"
<<<<<<< HEAD

        })

    }
    else{

        points.push({

=======
        })
    }else{
        points.push({
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
            x: ultimoX,
            y: ultimoY,
            width: espessuraEl.value,
            color: ctx.strokeStyle,
            mode: "start"
<<<<<<< HEAD

        })
    }
}

function redimensionar(){

=======
        })
    }
    // console.log(points.length);
}

function redimensionar(){
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
<<<<<<< HEAD
    canvas2.style.width = '100%';
    canvas2.style.height = '100%';
    canvas2.width = canvas.offsetWidth;
    canvas2.height = canvas.offsetHeight;
    canvasRect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

}

body.addEventListener("mouseup", pare);
body.addEventListener("mousemove", naopinte);
window.addEventListener("resize",redimensionar);
canvas.addEventListener("mousedown",comeco);
canvas2.addEventListener("mousedown",comecoLinha);
canvas2.addEventListener("mousedown",comecoRetangulo);
canvas2.addEventListener("mousedown",comecoCirculo);
body.addEventListener("mousemove",desenharLinha);
body.addEventListener("mousemove",desenharRetangulo);
body.addEventListener("mousemove",desenharCirculo);


canvas.addEventListener("mousemove", (e) => {
    desenhar(e, 0);
});

canvas.addEventListener("click", (e) => {

    if (!modos["preencher"]) return;
=======
    canvasRect = canvas.getBoundingClientRect();
}


window.addEventListener("resize",redimensionar);
canvas.addEventListener("mousedown",comeco);
espessuraEl.addEventListener("change",()=>{
    ctx.lineWidth = espessuraEl.value;
})
canvas.addEventListener("mouseup",fim);
borracha.addEventListener("click",()=>{
    if(isErasing){
        isErasing = false;
        borracha.innerHTML = "borracha";
    }
    else{
        botaoEl.innerHTML = "preencher"; 
        isErasing = true;
        isFilling = false;
        borracha.innerHTML = "borracha (ativado)"; 
    }
})
botaoEl.addEventListener("click", () => {
    if (!isFilling) {
        isFilling = true;
        isErasing = false;
        botaoEl.innerHTML = "preencher (ativado)"
        borracha.innerHTML = "borracha";
    }
    else {
        isFilling = false;
        botaoEl.innerHTML = "preencher";
    }
});
canvas.addEventListener("mousemove", (e) =>{
    desenhar(e,0);
});
refazerEl.addEventListener("click",refazer);
desfazerEl.addEventListener("click",desfazer);
body.addEventListener("mousemove",naopinte);
toleranciaEl.addEventListener("change",() =>{
    tolerancia = toleranciaEl.value;
})


canvas.addEventListener("click", (e) =>{
    if(!isFilling)return;
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
    let color = colorEl.value;
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    rgba = [r, g, b, 255];
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
<<<<<<< HEAD

    points.push({

        x: e.clientX,
        y: e.clientY,
        color: colorEl.value,
        tolerancia: tolerancia,
        mode: "fill"

    });
    preencher(e.clientX, e.clientY, rgba, 1, data, tolerancia, 1,0);

});

refazerEl.addEventListener("click",refazer);
desfazerEl.addEventListener("click",desfazer);

toleranciaEl.addEventListener("change",() =>{

    tolerancia = toleranciaEl.value;
})

espessuraEl.addEventListener("change", () => {
    ctx.lineWidth = espessuraEl.value;
    ctx2.lineWidth = espessuraEl.value;
})


radios.forEach(radio => radio.addEventListener("change",atualizarModo));

function atualizarModo(modo){
    for(const key in modos){
        modos[key] = 0;
    }

    
    modos[modo.currentTarget.id] = 1;

    if (modo.currentTarget.id == "linha" || modo.currentTarget.id == "circulo" || modo.currentTarget.id=="retangulo"){
        trocarCanvas();
    }else{
        destrocarCanvas();
    }

}

redimensionar();

function preencher(posX, posY, RGBA, diagonal, imgData, tolerance, antiAlias,redesenhando) {

    var data = imgData.data; 
    antiAlias = true;
    var stack = [];          
    var lookLeft = false;    
    var lookRight = false;
    var w = Math.ceil(canvas.width);   
    var h = Math.ceil(canvas.height);
    let painted = new Array(w*h).fill(0); 
    var dw = w * 4; 
    var x = Math.ceil(posX-canvasRect.x);   
    var y = Math.ceil(posY-canvasRect.y);
    var ind = Math.ceil(y * dw + x * 4);  
    var sr = data[ind];        
    var sg = data[ind + 1];
    var sb = data[ind + 2];
    var sa = data[ind + 3];

    if(RGBA[0]==sr&&RGBA[1]==sg&&RGBA[2]==sb&&RGBA[3]==sa){

        points.pop();
        return;

    }
    if(!redesenhando)points2 = [];
    var dontPaint = false;  

    var checkColour = function (x, y) {

        if (x < 0 || y < 0 || y >= h || x >= w) {  

            return false;

        }

        var ind = (y * dw + x * 4);  
        var dif = Math.max(        
=======
    points.push({
        x : e.clientX,
        y : e.clientY,
        color : colorEl.value,
        tolerancia : tolerancia 
    });
    preencher(e.clientX,e.clientY,rgba,1,data, tolerancia,1);
});


body.addEventListener("mouseup",pare);
redimensionar();

function preencher(posX, posY, RGBA, diagonal, imgData, tolerance, antiAlias) {
    
    var data = imgData.data; // image data to fill;
    antiAlias = true;
    var stack = [];          // paint stack to find new pixels to paint
    var lookLeft = false;    // test directions
    var lookRight = false;
    var w = Math.ceil(canvas.width);   // width and height
    var h = Math.ceil(canvas.height);
    let painted = new Array(w*h).fill(0);  // byte array to mark painted area;
    var dw = w * 4; // data width.
    var x = Math.ceil(posX-canvasRect.x);   // just short version of pos because I am lazy
    var y = Math.ceil(posY-canvasRect.y);
    var ind = Math.ceil(y * dw + x * 4);  // get the starting pixel index
    var sr = data[ind];        // get the start colour tha we will use tollerance against.
    var sg = data[ind + 1];
    var sb = data[ind + 2];
    var sa = data[ind + 3];
    if(RGBA[0]==sr&&RGBA[1]==sg&&RGBA[2]==sb&&RGBA[3]==sa)return;
    var dontPaint = false;  // flag to indicate if checkColour can paint
    // function checks a pixel colour passes tollerance, is painted, or out of bounds.
    // if the pixel is over tollerance and not painted set it do reduce anti alising artifacts
    var checkColour = function (x, y) {
        if (x < 0 || y < 0 || y >= h || x >= w) {  // test bounds
            return false;
        }
        var ind = (y * dw + x * 4);  // get index of pixel
        var dif = Math.max(        // get the max channel differance;
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
            Math.abs(sr - data[ind]),
            Math.abs(sg - data[ind + 1]),
            Math.abs(sb - data[ind + 2]),
            Math.abs(sa - data[ind + 3])
            );
<<<<<<< HEAD

            if (dif < tolerance) {         
                dif = 0;
            }

            var paint = painted[y * w + x]; 

            if (antiAlias && !dontPaint) {  

                if (dif !== 0 && paint !== 255) {

                    data[ind] = RGBA[0];
                    data[ind + 1] = RGBA[1];
                    data[ind + 2] = RGBA[2];
                    data[ind + 3] = (RGBA[3] + data[ind + 3]) / 2; 
                    painted[y * w + x] = 255;  

                }
            }
            
            return (dif + paint) === 0 ? true : false;  
        }
        
        var setPixel = function (x, y) {
            
            var ind = y * dw + x * 4;  
            data[ind] = RGBA[0];       
            data[ind + 1] = RGBA[1];
            data[ind + 2] = RGBA[2];
            data[ind + 3] = RGBA[3];
            painted[y * w + x] = 255;  

        }
        
        
        stack.push([x, y]);  

        while (stack.length) {  

            var pos = stack.pop(); 
            x = pos[0];
            y = pos[1];
            dontPaint = true;     

            while (checkColour(x, y - 1)) {  
                
                y --;

            }
            dontPaint = false;    

            if (diagonal) {

=======
            if (dif < tolerance) {         // if under tollerance pass it
                dif = 0;
            }
            var paint = painted[y * w + x]; // is it already painted
            if (antiAlias && !dontPaint) {  // mitigate anti aliasing effect
                // if failed tollerance and has not been painted set the pixel to 
                // reduce anti alising artifact
                if (dif !== 0 && paint !== 255) {
                    data[ind] = RGBA[0];
                    data[ind + 1] = RGBA[1];
                    data[ind + 2] = RGBA[2];
                    data[ind + 3] = (RGBA[3] + data[ind + 3]) / 2; // blend the alpha channel
                    painted[y * w + x] = 255;  // flag pixel as painted
                }
            }
            
            return (dif + paint) === 0 ? true : false;  // return tollerance status;
        }
        // set a pixel and flag it as painted;
        var setPixel = function (x, y) {
            
            var ind = y * dw + x * 4;  // get index;
            data[ind] = RGBA[0];       // set RGBA
            data[ind + 1] = RGBA[1];
            data[ind + 2] = RGBA[2];
            data[ind + 3] = RGBA[3];
            painted[y * w + x] = 255;   // 255 or any number >0 will do;
        }
        
        
        stack.push([x, y]);  // push the first pixel to paint onto the paint stack
        while (stack.length) {   // do while pixels on the stack
            // console.log(1);
            var pos = stack.pop();  // get the pixel
            x = pos[0];
            y = pos[1];
            dontPaint = true;    // turn off anti alising 
            while (checkColour(x, y - 1)) {  // find the bottom most pixel within tolerance;
                //console.log(2);
                y --;
            }
            dontPaint = false;    // turn on anti alising if being used
            //checkTop left and right if alowing diagonal painting
            if (diagonal) {
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
                if (!checkColour(x - 1, y) && checkColour(x - 1, y - 1)) {
                    stack.push([x - 1, y - 1]);
                }
                if (!checkColour(x + 1, y) && checkColour(x + 1, y - 1)) {
                    stack.push([x + 1, y - 1]);
                }
<<<<<<< HEAD

            }
            lookLeft = false;  
            lookRight = false; 
            while (checkColour(x, y)) { 

                setPixel(x, y);         
                if (checkColour(x - 1, y)) {  

                    if (!lookLeft) {
                        stack.push([x - 1, y]);  
                        lookLeft = true;

=======
            }
            lookLeft = false;  // set look directions
            lookRight = false; // only look is a pixel left or right was blocked
            while (checkColour(x, y)) { // move up till no more room
                //console.log(3);
                setPixel(x, y);         // set the pixel
                if (checkColour(x - 1, y)) {  // check left is blocked
                    if (!lookLeft) {
                        stack.push([x - 1, y]);  // push a new area to fill if found
                        lookLeft = true;
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
                    }
                } else
                if (lookLeft) {
                    lookLeft = false;
                }
<<<<<<< HEAD
                if (checkColour(x + 1, y)) { 

                    if (!lookRight) {
                        
                        stack.push([x + 1, y]); 
=======
                if (checkColour(x + 1, y)) {  // check right is blocked
                    if (!lookRight) {
                        stack.push([x + 1, y]); // push a new area to fill if found
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
                        lookRight = true;
                    }
                } else
                if (lookRight) {
                    lookRight = false;
                }
<<<<<<< HEAD
                y += 1;                 
            } 
            if (diagonal) {  

                if (checkColour(x - 1, y) && !lookLeft) {
                    stack.push([x - 1, y]);
                }

=======
                y += 1;                 // move up one pixel
            }
            // check down left 
            if (diagonal) {  // check for diagnal areas and push them to be painted 
                if (checkColour(x - 1, y) && !lookLeft) {
                    stack.push([x - 1, y]);
                }
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
                if (checkColour(x + 1, y) && !lookRight) {
                    stack.push([x + 1, y]);
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
<<<<<<< HEAD

    }
    
    function desfazer(){
        
        
        if(!points.length)return;
        let temp = [];
        
        for(let i = points.length-1;i>=0;i--){

            a = points.pop();
            temp.push(a);
            if (i >= 1 && a.mode == points[i - 1].mode && points[i-1].mode == "end")break;

            if (a.mode == "start" || a.mode == "fill" || a.mode == "linha"||a.mode=="retangulo"||a.mode=="circulo")break;
        }
        
        for(let i = temp.length-1;i>=0;i--){
            points2.push(temp[i]);
            
        }
        redesenhar();
    }
    
    function refazer(){
        

        if(!points2.length)return;
        let temp = [];

        for (let i = points2.length - 1; i >= 0; i--) {
            a = points2.pop();
            temp.push(a);
            
            if(i>=1 && a.mode==points2[i-1].mode && a.mode =="end") break;

            if (a.mode == "start"||a.mode == "fill" ||a.mode =="linha"||a.mode=="retangulo" ||a.mode=="circulo") break;
        }

        for (let i = temp.length - 1; i >= 0; i--) {
            points.push(temp[i]);
        }

        redesenhar();
    }
    
    function redesenhar(){

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fill();
=======
        // all done
    }
    
    function desfazer(){
        a = points.pop();
        points2.push(a);
        redesenhar(1);
    }
    
    function refazer(){
        a = points2.pop();
        points.push(a);
        redesenhar(0);
    }
    
    function redesenhar(tipo){
        if (tipo&&points.length == 0)return;
        if (!tipo&&points2.length == 0)return;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        // ctx.beginPath();
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab

        for (let i = 0; i < points.length; i++) {
            
            let pt = points[i];
            
            if (ctx.lineWidth != pt.size) {
                ctx.lineWidth = pt.size;
            }
<<<<<<< HEAD

=======
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
            if (ctx.strokeStyle != pt.color) {
                ctx.strokeStyle = pt.color;
                
            }
<<<<<<< HEAD

            if(pt.mode=="default"){
                pintar(pt.x, pt.y, pt.color, pt.width);
            }
            if(pt.mode =="start"){

                ctx.beginPath();
                pintar(pt.x, pt.y, pt.color, pt.width);
            }

            if(pt.mode =="end"){

                pintar(pt.x, pt.y, pt.color, pt.width);
                ctx.beginPath();
            } 

            if(pt.mode == "fill"){

                let color = pt.color
                let r = parseInt(color.substr(1, 2), 16);
                let g = parseInt(color.substr(3, 2), 16);
                let b = parseInt(color.substr(5, 2), 16);
                rgba = [r, g, b, 255];
                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                preencher(pt.x,pt.y,rgba,1,imgData,pt.tolerancia,1,1);

            }
            if(pt.mode == "linha"){
                ctx.lineCap = "round";
                ctx.lineWidth = pt.width;
                ctx.strokeStyle = pt.color;
                ctx.beginPath();
                ctx.moveTo(pt.xi, pt.yi);
                ctx.lineTo(pt.xf, pt.yf);
                ctx.stroke();
            } 
            if(pt.mode == "retangulo"){
                ctx.lineCap = "round";
                ctx.lineWidth = pt.width;
                ctx.strokeStyle = pt.color;
                ctx.beginPath();
                ctx.rect(pt.xi, pt.yi, pt.xf - pt.xi, pt.yf - pt.yi);
                ctx.stroke();
            }
            if(pt.mode == "circulo"){
                ctx.lineCap = "round";
                ctx.lineWidth = pt.width;
                ctx.strokeStyle = pt.color;
                ctx.beginPath();
                ctx.arc(pt.xi, pt.yi, pt.raio, 0, 2 * Math.PI);
                ctx.stroke();
            }
            } 
        }
        


function pintar(posX,posY,color,width) {

    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineWidth = width;
    ctx.lineTo(posX,posY);
    ctx.stroke();
    ctx.moveTo(posX, posY);
}


function trocarCanvas() {

    canvas2.classList.add("aparece");
    canvas.classList.remove("aparece");
}
function destrocarCanvas() {

    canvas2.classList.remove("aparece");
    canvas.classList.add("aparece");
}


function comecoLinha(e) {

    if(!modos["linha"])return;

    estaPintandoLinha = true;
    xInicial = e.clientX - canvasRect.x;
    yInicial = e.clientY - canvasRect.y;
}

function desenharLinha(e) {

    if (!modos["linha"] || !estaPintandoLinha) return;

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.beginPath();
    ctx2.moveTo(xInicial, yInicial);
    ctx2.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx2.lineCap = "round";
    ctx2.lineWidth = espessuraEl.value;
    ctx2.strokeStyle = colorEl.value;
    ctx2.stroke();
}

function finalizarLinha(e){

    points2 = [];
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    points.push({
        xi : xInicial,
        yi : yInicial,
        xf : e.clientX - canvasRect.x,
        yf : e.clientY - canvasRect.y,
        mode : "linha",
        width : espessuraEl.value,
        color : colorEl.value
    });

    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.strokeStyle = colorEl.value;
    ctx.beginPath();
    ctx.moveTo(xInicial,yInicial);
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
}


function comecoRetangulo(e){

    if(!modos["retangulo"])return;

    estaPintandoRetangulo = true;
    xInicial = e.clientX - canvasRect.x;
    yInicial = e.clientY - canvasRect.y;

}


function desenharRetangulo(e){

    if (!modos["retangulo"] || !estaPintandoRetangulo) return;

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.lineCap = "round";
    ctx2.lineWidth = espessuraEl.value;
    ctx2.strokeStyle = colorEl.value;
    ctx2.beginPath();
    ctx2.rect(xInicial, yInicial, e.clientX - canvasRect.x-xInicial, e.clientY - canvasRect.y-yInicial);
    ctx2.stroke();

}

function finalizarRetangulo(e){

    points2 = [];
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    points.push({
        xi: xInicial,
        yi: yInicial,
        xf: e.clientX - canvasRect.x,
        yf: e.clientY - canvasRect.y,
        mode: "retangulo",
        width: espessuraEl.value,
        color: colorEl.value
    });

    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.strokeStyle = colorEl.value;
    ctx.beginPath();
    ctx.rect(xInicial, yInicial, e.clientX - canvasRect.x - xInicial, e.clientY - canvasRect.y - yInicial);
    ctx.stroke();

}

function comecoCirculo(e) {

    if (!modos["circulo"]) return;

    estaPintandoCirculo = true;
    xInicial = e.clientX - canvasRect.x;
    yInicial = e.clientY - canvasRect.y;

}


function desenharCirculo(e) {

    if (!modos["circulo"] || !estaPintandoCirculo) return;

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.lineCap = "round";
    ctx2.lineWidth = espessuraEl.value;
    ctx2.strokeStyle = colorEl.value;
    ctx2.beginPath();
    ctx2.arc(xInicial, yInicial, Math.abs(e.clientX - canvasRect.x - xInicial), 0, 2 * Math.PI);
    ctx2.stroke();

}

function finalizarCirculo(e) {

    points2 = [];
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    points.push({
        xi: xInicial,
        yi: yInicial,
        raio : Math.abs(e.clientX - canvasRect.x - xInicial),
        mode: "circulo",
        width: espessuraEl.value,
        color: colorEl.value

    });

    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.strokeStyle = colorEl.value;
    ctx.beginPath();
    ctx.arc(xInicial, yInicial, Math.abs(e.clientX - canvasRect.x - xInicial), 0, 2 * Math.PI);
    ctx.stroke();
}
=======
            if(pt.mode=="default"){
                //ctx.lineTo(pt.x , pt.y);
                //ctx.stroke();
                // ctx.beginPath();
                ctx.lineTo(pt.x, pt.y);
                ctx.lineCap = "round";
                ctx.strokeStyle = pt.color;
                ctx.stroke();
            }
            if(pt.mode =="start"){
                ctx.beginPath();
                ctx.moveTo(pt.x,pt.y);

            }
            if(pt.mode =="end"){
                ctx.moveTo(pt.x,pt.y);
                ctx.lineCap = "round";
                ctx.strokeStyle = pt.color;
                ctx.stroke();
                ctx.closePath();
            }
            if(pt.mode == "fill"){

            }
        }
        // ctx.stroke();
        
        
    }
    
    
    
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
>>>>>>> 35f772638ff10675e698c547893f4de6c194b0ab
