const canvas = document.querySelector("#canvas");
let canvasEl = document.querySelector("#gridCanvas");
let borracha = document.querySelector("#borracha");
let refazerEl = document.querySelector("#refazer");
let desfazerEl = document.querySelector("#desfazer");
let botaoEl = document.querySelector("#preencher");
let canvasRect = canvas.getBoundingClientRect();
let body = document.body;
const ctx = canvas.getContext('2d');
let colorEl = document.querySelector("#seletor-rgb");
let espessuraEl = document.querySelector("#seletor-espessura");
let isFilling = false;
let points = [];
let points2 = [];
let toleranciaEl = document.querySelector("#tolerancia");
let tolerancia = 100;
let estaPintando = false;
let isErasing = false;


function comeco(e){
    estaPintando = true;
    ctx.beginPath();
    points2 = [];
    desenhar(e,1);
    
}
function fim(){
    estaPintando = false;
    points[points.length-1].mode = "end";
}
function pare(){
    estaPintando = false;
    ctx.beginPath();
}

function naopinte(e){
    if(e.clientX < canvasRect.x || e.clientY < canvasRect.y || e.clientY > canvasRect.height + canvasRect.y || e.clientX > canvasRect.width + canvasRect.x){
        ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
        
    }     
}

function desenhar(e,start){
    if(!estaPintando||isFilling)return;
    if(isErasing){
        ctx.strokeStyle = "white";
    }else{
        ctx.strokeStyle = colorEl.value;
    }
    let ultimoX = e.clientX - canvasRect.x;
    let ultimoY = e.clientY - canvasRect.y;
    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    if(!start){
        points.push({
            x: ultimoX,
            y: ultimoY,
            width: espessuraEl.value,
            color: ctx.strokeStyle,
            mode: "default"
        })
    }else{
        points.push({
            x: ultimoX,
            y: ultimoY,
            width: espessuraEl.value,
            color: ctx.strokeStyle,
            mode: "start"
        })
    }
    // console.log(points.length);
}

function redimensionar(){
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
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
    let color = colorEl.value;
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    rgba = [r, g, b, 255];
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
            Math.abs(sr - data[ind]),
            Math.abs(sg - data[ind + 1]),
            Math.abs(sb - data[ind + 2]),
            Math.abs(sa - data[ind + 3])
            );
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
                if (!checkColour(x - 1, y) && checkColour(x - 1, y - 1)) {
                    stack.push([x - 1, y - 1]);
                }
                if (!checkColour(x + 1, y) && checkColour(x + 1, y - 1)) {
                    stack.push([x + 1, y - 1]);
                }
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
                    }
                } else
                if (lookLeft) {
                    lookLeft = false;
                }
                if (checkColour(x + 1, y)) {  // check right is blocked
                    if (!lookRight) {
                        stack.push([x + 1, y]); // push a new area to fill if found
                        lookRight = true;
                    }
                } else
                if (lookRight) {
                    lookRight = false;
                }
                y += 1;                 // move up one pixel
            }
            // check down left 
            if (diagonal) {  // check for diagnal areas and push them to be painted 
                if (checkColour(x - 1, y) && !lookLeft) {
                    stack.push([x - 1, y]);
                }
                if (checkColour(x + 1, y) && !lookRight) {
                    stack.push([x + 1, y]);
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
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

        for (let i = 0; i < points.length; i++) {
            
            let pt = points[i];
            
            if (ctx.lineWidth != pt.size) {
                ctx.lineWidth = pt.size;
            }
            if (ctx.strokeStyle != pt.color) {
                ctx.strokeStyle = pt.color;
                
            }
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