const canvas = document.querySelector("canvas");
const toolbtn = document.querySelectorAll(".toolbtn");
const fillcolor = document.querySelector("#fillcolor");
const rangeinput = document.querySelector("#rangeinput");
const colorbtns = document.querySelectorAll(".color-option span");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let selectedColor = "#000"
let prevMouseX, prevMouseY, snapshot;


const setCanvasBackground = ()=>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

function startDraw(e) {
    isDrawing = true;
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath()
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function stopDraw() {
    isDrawing = false;
}

function drawRect(e) {
    if (!fillcolor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

function drawCircle(e) {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillcolor.checked ? ctx.fill() : ctx.stroke()
}

function drawTriangle(e) {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath()
    ctx.stroke()
    fillcolor.checked ? ctx.fill() : ctx.stroke()
}

function drawing(e) {
    if (!isDrawing) return
    ctx.putImageData(snapshot, 0, 0)


    if (selectedTool === "brush" || selectedTool === "erase") {
        ctx.strokeStyle = selectedTool === "erase" ? "white" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
    }
    else if (selectedTool === "rectangle") {
        drawRect(e)
    }
    else if (selectedTool === "circle") {
        drawCircle(e)
    }
    else {
        drawTriangle(e)
    }

}

toolbtn.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".option .active").classList.remove("active");
        btn.classList.add("active")
        selectedTool = btn.id;
        console.log(selectedTool)
    })
});

rangeinput.addEventListener("change", () => {
    brushWidth = rangeinput.value
})

// clear canvas 

function clearcanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground()
}

// save image 

function saveImage() {
    const link = document.createElement("a");
    link.download = `${Date.now().jpg}`
    link.href = canvas.toDataURL()
    link.click()

}

// color changing 

colorbtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".color-option .activecolor").classList.remove("activecolor");
        btn.classList.add("activecolor")
        let color = window.getComputedStyle(btn).getPropertyValue("background-color");
        selectedColor = color;
    })
})

canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mouseup", stopDraw)