const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const tileW = 40
const tileH = 40

const gridRows = 40
const gridCols = 40
let size = 2000
const map = []
for (let i = 0; i < size; i++) {
    map.push(Math.floor(Math.random() * 100))
}
window.onload = () => {
    drawMap()
}

function drawMap () {
    for (let i = 0; i < gridRows; i++) {
        for (let k = 0; k < gridCols; k++) {
            let arrIndex = i * gridRows + k
            if (map[arrIndex] === 2) {
                ctx.fillStyle = "yellow"
                ctx.fillRect(tileW * k, tileH * i, tileW, tileH)
            } else {
                ctx.fillStyle = "black"
                ctx.fillRect(tileW * k, tileH * i, tileW, tileH)
            }
        }
    }
}