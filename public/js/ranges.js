const infoEspessuraEl = document.querySelector("#i-espessura");
const infoToleranciaEl = document.querySelector("#i-tolerancia");
const modalEspessuraEl = document.querySelector("#m-espessura");
const modalToleranciaEl = document.querySelector("#m-tolerancia");

infoEspessuraEl.addEventListener("mouseover", (e) => {
  modalEspessuraEl.style.display = "block";
});

infoEspessuraEl.addEventListener("mousemove", (e) => {
  let x = e.pageX - 120;
  let y = e.pageY;
  modalEspessuraEl.style.left = `${x}px`;
  modalEspessuraEl.style.top = `${y}px`;
});

infoEspessuraEl.addEventListener("mouseout", (e) => {
  modalEspessuraEl.style.display = "none";
});

infoToleranciaEl.addEventListener("mouseover", (e) => {
  modalToleranciaEl.style.display = "block";
});
infoToleranciaEl.addEventListener("mousemove", (e) => {
  let x = e.pageX - 120;
  let y = e.pageY;
  modalToleranciaEl.style.left = `${x}px`;
  modalToleranciaEl.style.top = `${y}px`;
});
infoToleranciaEl.addEventListener("mouseout", (e) => {
  modalToleranciaEl.style.display = "none";
});

const espessuraRangeEl = document.querySelector("#seletor-espessura");
const infoboxEL = document.querySelector("#espessura-infobox");
const bolinhaEl = document.querySelector("#bolinha-indicado");

espessuraRangeEl.addEventListener("input", (e) => {
  bolinhaEl.style.height = `${e.currentTarget.value}px`;
  bolinhaEl.style.width = `${e.currentTarget.value}px`;
});

espessuraRangeEl.addEventListener("mouseup", (e) => {
  infoboxEL.style.display = "none";
});

espessuraRangeEl.addEventListener("mousedown", (e) => {
  infoboxEL.style.display = "flex";
});
