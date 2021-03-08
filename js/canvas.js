let body = document.body;

//canvas

const canvas = document.querySelector("#canvas");
const canvas2 = document.querySelector("#canvas-transparente");
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
let canvasRect = canvas.getBoundingClientRect();

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
let xInicial, yInicial;

let modos = {
    "preencher": 0,
    "borracha": 0,
    "linha": 0,
    "retangulo": 0,
    "circulo": 0,
    "pincel": 1
}

//Vetores que salvam o histórico de modificações
let points = [];
let points2 = [];

//Outras variáveis
let tolerancia = 100;

function esvaziarRefazer(){

    points2 = [];
    desfazerEl.classList.add("impossivel");
}

function comeco(e) {
    estaPintando = true;
    ctx.beginPath();
    esvaziarRefazer();
    desenhar(e, 1);

}
function pare(e) {

    if (modos["linha"] && estaPintandoLinha) {
        finalizarLinha(e);
    }

    if (modos["retangulo"] && estaPintandoRetangulo) {
        finalizarRetangulo(e);
    }

    if (modos["circulo"] && estaPintandoCirculo) {
        finalizarCirculo(e);
    }
    if ((modos["pincel"] || modos["borracha"]) && estaPintando) {
        desfazerEl.classList.remove("impossivel");
        points.push({
            mode: "pincel",
            data: ctx.getImageData(0, 0, canvas.width, canvas.height)
        })
    }

    estaPintando = false;
    estaPintandoLinha = false;
    estaPintandoRetangulo = false;
    estaPintandoCirculo = false;
}

function naopinte(e) {
    if (e.clientX < canvasRect.x || e.clientY < canvasRect.y || e.clientY > canvasRect.height + canvasRect.y || e.clientX > canvasRect.width + canvasRect.x) {
        ctx.beginPath();
        ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);

    }
}


function desenhar(e) {

    if (!estaPintando || (!modos["pincel"] && !modos["borracha"])) return;

    if (modos["borracha"]) {

        ctx.strokeStyle = "white";

    } else {

        ctx.strokeStyle = colorEl.value;

    }

    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
    ctx.moveTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);

}

function redimensionar() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
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
window.addEventListener("resize", redimensionar);
canvas.addEventListener("mousedown", comeco);
canvas2.addEventListener("mousedown", comecoLinha);
canvas2.addEventListener("mousedown", comecoRetangulo);
canvas2.addEventListener("mousedown", comecoCirculo);
body.addEventListener("mousemove", desenharLinha);
body.addEventListener("mousemove", desenharRetangulo);
body.addEventListener("mousemove", desenharCirculo);


canvas.addEventListener("mousemove",desenhar);

espessuraEl.addEventListener("change", () => {
    ctx.lineWidth = espessuraEl.value;
})



canvas.addEventListener("mousemove",desenhar);

refazerEl.addEventListener("click", refazer);
desfazerEl.addEventListener("click", desfazer);
body.addEventListener("mousemove", naopinte);

toleranciaEl.addEventListener("change", () => {
    tolerancia = toleranciaEl.value;
})


canvas.addEventListener("click", (e) => {
    if (!modos["preencher"]) return;
    let color = colorEl.value;
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    rgba = [r, g, b, 255];
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    preencher(e.clientX, e.clientY, rgba, 1, data, tolerancia, 1, 0);

});




radios.forEach(radio => radio.addEventListener("change", atualizarModo));

function atualizarModo(modo) {
    for (const key in modos) {
        modos[key] = 0;
    }


    modos[modo.currentTarget.id] = 1;

    if (modo.currentTarget.id == "linha" || modo.currentTarget.id == "circulo" || modo.currentTarget.id == "retangulo") {
        trocarCanvas();
    } else {
        destrocarCanvas();
    }

}

redimensionar();

function preencher(posX, posY, RGBA, diagonal, imgData, tolerance, antiAlias, redesenhando) {

    var data = imgData.data;
    antiAlias = true;
    var stack = [];
    var lookLeft = false;
    var lookRight = false;
    var w = Math.ceil(canvas.width);
    var h = Math.ceil(canvas.height);
    let painted = new Array(w * h).fill(0);
    var dw = w * 4;
    var x = Math.ceil(posX - canvasRect.x);
    var y = Math.ceil(posY - canvasRect.y);
    var ind = Math.ceil(y * dw + x * 4);
    var sr = data[ind];
    var sg = data[ind + 1];
    var sb = data[ind + 2];
    var sa = data[ind + 3];
    if (RGBA[0] == sr && RGBA[1] == sg && RGBA[2] == sb && RGBA[3] == sa) {

        return;

    }
    if (!redesenhando) esvaziarRefazer;
    var dontPaint = false;

    var checkColour = function (x, y) {
        if (x < 0 || y < 0 || y >= h || x >= w) {
            return false;
        }
        var ind = y * dw + x * 4;
        var dif = Math.max(
            Math.abs(sr - data[ind]),
            Math.abs(sg - data[ind + 1]),
            Math.abs(sb - data[ind + 2]),
            Math.abs(sa - data[ind + 3])
        );
        if (dif < tolerance) {
            dif = 0;
        }
        var paint = Math.abs(painted[y * w + x]);
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
            y -= 1;
        }
        dontPaint = false;
        if (diagonal) {
            if (!checkColour(x - 1, y) && checkColour(x - 1, y - 1)) {
                stack.push([x - 1, y - 1]);
            }
            if (!checkColour(x + 1, y) && checkColour(x + 1, y - 1)) {
                stack.push([x + 1, y - 1]);
            }
        }
        lookLeft = false;
        lookRight = false;
        while (checkColour(x, y)) {
            setPixel(x, y);
            if (checkColour(x - 1, y)) {
                if (!lookLeft) {
                    stack.push([x - 1, y]);
                    lookLeft = true;
                }
            } else
                if (lookLeft) {
                    lookLeft = false;
                }
            if (checkColour(x + 1, y)) {
                if (!lookRight) {
                    stack.push([x + 1, y]);
                    lookRight = true;
                }
            } else
                if (lookRight) {
                    lookRight = false;
                }
            y += 1;
        }

        if (diagonal) {
            if (checkColour(x - 1, y) && !lookLeft) {
                stack.push([x - 1, y]);
            }
            if (checkColour(x + 1, y) && !lookRight) {
                stack.push([x + 1, y]);
            }
        }
    }

    points.push({
        mode: "fill",
        data: imgData
    })
    desfazerEl.classList.remove("impossivel");

    ctx.putImageData(imgData, 0, 0);
}

function desfazer() {

    if (!points.length){
        return;
    }
    refazerEl.classList.remove("impossivel");
    points2.push(points.pop());

    if(!points.length){
        desfazerEl.classList.add("impossivel");
    }

    redesenhar();
}

function refazer() {

    if (!points2.length) {
        return;
    }
    desfazerEl.classList.remove("impossivel");
    points.push(points2.pop());

    if (!points2.length) {
        refazerEl.classList.add("impossivel");
    }
    redesenhar();
}


function redesenhar() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    for (let i = 0; i < points.length; i++) {

        let pt = points[i];

        if (ctx.lineWidth != pt.size) {
            ctx.lineWidth = pt.size;
        }
        if (ctx.strokeStyle != pt.color) {
            ctx.strokeStyle = pt.color;

        }

        if(pt.mode == "pincel" || pt.mode == "fill"){
            ctx.putImageData(pt.data, 0, 0);
        }

        if (pt.mode == "linha") {
            ctx.lineCap = "round";
            ctx.lineWidth = pt.width;
            ctx.strokeStyle = pt.color;
            ctx.beginPath();
            ctx.moveTo(pt.xi, pt.yi);
            ctx.lineTo(pt.xf, pt.yf);
            ctx.stroke();
        }

        if (pt.mode == "retangulo") {
            ctx.lineCap = "round";
            ctx.lineWidth = pt.width;
            ctx.strokeStyle = pt.color;
            ctx.beginPath();
            ctx.rect(pt.xi, pt.yi, pt.xf - pt.xi, pt.yf - pt.yi);
            ctx.stroke();
        }

        if (pt.mode == "circulo") {
            ctx.save();
            ctx.beginPath();
            let scaleX = 1 * ((pt.xf - pt.xi) / 2);
            let scaleY = 1 * ((pt.yf - pt.yi) / 2);
            ctx.scale(scaleX, scaleY);
            let centerX = (pt.xi / scaleX) + 1;
            let centerY = (pt.yi / scaleY) + 1;
            ctx.lineWidth = pt.width;
            ctx.strokeStyle = pt.color;
            ctx.arc(centerX, centerY, 1, 0, 2 * Math.PI);
            ctx.restore();
            ctx.stroke();
        }
    }
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

    if (!modos["linha"]) return;

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

function finalizarLinha(e) {

    esvaziarRefazer();
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    desfazerEl.classList.remove("impossivel");
    points.push({
        xi: xInicial,
        yi: yInicial,
        xf: e.clientX - canvasRect.x,
        yf: e.clientY - canvasRect.y,
        mode: "linha",
        width: espessuraEl.value,
        color: colorEl.value
    });

    ctx.lineCap = "round";
    ctx.lineWidth = espessuraEl.value;
    ctx.strokeStyle = colorEl.value;
    ctx.beginPath();
    ctx.moveTo(xInicial, yInicial);
    ctx.lineTo(e.clientX - canvasRect.x, e.clientY - canvasRect.y);
    ctx.stroke();
}


function comecoRetangulo(e) {

    if (!modos["retangulo"]) return;

    estaPintandoRetangulo = true;
    xInicial = e.clientX - canvasRect.x;
    yInicial = e.clientY - canvasRect.y;

}


function desenharRetangulo(e) {

    if (!modos["retangulo"] || !estaPintandoRetangulo) return;

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.lineCap = "round";
    ctx2.lineWidth = espessuraEl.value;
    ctx2.strokeStyle = colorEl.value;
    ctx2.beginPath();
    ctx2.rect(xInicial, yInicial, e.clientX - canvasRect.x - xInicial, e.clientY - canvasRect.y - yInicial);
    ctx2.stroke();

}

function finalizarRetangulo(e) {

    esvaziarRefazer();
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    desfazerEl.classList.remove("impossivel");
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
    ctx2.lineWidth = espessuraEl.value;
    ctx2.strokeStyle = colorEl.value;
    ctx2.save();
    ctx2.beginPath();
    let xAtual = e.clientX - canvasRect.x;
    let yAtual = e.clientY - canvasRect.y;
    let scaleX = 1 * ((xAtual - xInicial) / 2);
    let scaleY = 1 * ((yAtual - yInicial) / 2);
    ctx2.scale(scaleX, scaleY);
    let centerX = (xInicial / scaleX) + 1;
    let centerY = (yInicial / scaleY) + 1;
    ctx2.arc(centerX, centerY, 1, 0, 2 * Math.PI);
    ctx2.restore();
    ctx2.stroke();

}

function finalizarCirculo(e) {

    esvaziarRefazer();
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    let xAtual = e.clientX - canvasRect.x;
    let yAtual = e.clientY - canvasRect.y;
    desfazerEl.classList.remove("impossivel");
    points.push({
        xi: xInicial,
        yi: yInicial,
        xf: xAtual,
        yf: yAtual,
        mode: "circulo",
        width: espessuraEl.value,
        color: colorEl.value
    });

    ctx.lineWidth = espessuraEl.value;
    ctx.strokeStyle = colorEl.value;
    ctx.save();
    ctx.beginPath();
    let scaleX = 1 * ((xAtual - xInicial) / 2);
    let scaleY = 1 * ((yAtual - yInicial) / 2);
    ctx.scale(scaleX, scaleY);
    let centerX = (xInicial / scaleX) + 1;
    let centerY = (yInicial / scaleY) + 1;
    ctx.arc(centerX, centerY, 1, 0, 2 * Math.PI);
    ctx.restore();
    ctx.stroke();
}
