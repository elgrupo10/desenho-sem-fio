const infoIndicadorEl = document.querySelector("#i-botoes");
const infoboxBotoesEl = document.querySelector("#infobox-botoes");


infoIndicadorEl.addEventListener("mouseover", e => {
    infoboxBotoesEl.style.display = "block";
});

infoIndicadorEl.addEventListener("mousemove", e => {

    let x = e.pageX;
    let y = e.pageY-214;
    infoboxBotoesEl.style.left = `${x}px`;
    infoboxBotoesEl.style.top = `${y}px`;
});

infoIndicadorEl.addEventListener("mouseout", e => {
    infoboxBotoesEl.style.display = "none";
});