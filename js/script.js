"use strict";
//Global varibles
const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#sizeslider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImageBtn = document.querySelector(".save-image");
const setbg = document.querySelector(".checkbox");

// Varibles with default value
let ctx = canvas.getContext("2d"),
  isDrawing = false,
  brushWidth = 5,
  selectedTool = "",
  selectedColor = "#000",
  prevMouseX,
  prevmouseY,
  snapshot;
//set canvas background
const setcanvasbg = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvas.fillStyle = selectedColor;
};
//Set canvas width end heigth
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  if (setbg.checked) {
    setcanvasbg();
    console.log("ishladi");
  } else {
    console.log("ishlamadi");

    return;
  }
});

//Start drawing
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevmouseY = e.offsetY;
  ctx.beginPath(); //mishka uzilganda yangi joydan chizish
  ctx.lineWidth = brushWidth; // qalam qalinligi
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
};

//End drawing
const endDrawing = () => {
  isDrawing = false;
  // isDrawing = true;
};
//Draw ractangle
const drawRectangle = (e) => {
  if (!fillColor.checked) {
    ctx.strokeRect(
      //tortburchak border qismini chizib beradi yani ichi boyalmagan
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevmouseY - e.offsetY
    );
  } else {
    ctx.fillRect(
      //tortburchak ichini rang bilan toldirib chizadi
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevmouseY - e.offsetY
    );
  }
};
//drawCircle
const drawCircle = (e) => {
  ctx.beginPath();
  const radius =
    Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) / 3.4 +
    Math.sqrt(Math.pow(prevmouseY - e.offsetY, 2)) / 3.4;
  ctx.arc(prevMouseX, prevmouseY, radius, 90, 90 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
//Draw triangle
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevmouseY);
  ctx.lineTo(e.offsetX, e.offsetY); //chiziqni bitta togri chiziq qilib beradi
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke(); // Chizish
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
//Drawing
const drawing = (e) => {
  if (!isDrawing) {
    return;
  }
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke(); //chizish
      break;
    case "restangle":
      drawRectangle(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.lineTo(e.offsetX, e.offsetY);
      break;
    default:
      break;
  }
};
//Change brush slider
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));
// Set Color to shapes
colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const getColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
    selectedColor = getColor;
    console.log(getColor);
  });
});
//Set color from color picker
colorPicker.addEventListener("chanege", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});
//Tools Btn and to varibles selected  tool
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // document.querySelector("#brush").classList.add("active  ");
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;

    console.log(selectedTool);
  });
});
//clear canvas button
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
//save image button
saveImageBtn.addEventListener("click", () => {
  const d = new Date();
  const dd =
    d.getDate() +
    "_" +
    d.getMonth() +
    "_" +
    d.getFullYear() +
    " " +
    d.getHours() +
    "_" +
    d.getMinutes() +
    "_" +
    d.getSeconds();
  const link = document.createElement("a");
  link.download = `Paint project ${dd}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mousemove", drawing);
