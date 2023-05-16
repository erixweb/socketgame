const ws = new WebSocket("ws://localhost:8080")
let token = ""
let keyPressed = []
ws.addEventListener("open", () => {
    function update() {
        if (keyPressed["rightPressed"] == true) {
            scroll(window.scrollX + 3, 0)
            ws.send(`movePlayerPkg: ${sessionStorage.getItem("controller")}, 5, ${token}, ${document.querySelectorAll(".player")[parseInt(sessionStorage.getItem("controller"))].style.left}`)
        } else if (keyPressed["leftPressed"] == true) {
            scroll(window.scrollX - 3, 0)
            ws.send(`movePlayerPkg: ${sessionStorage.getItem("controller")}, -5, ${token}, ${document.querySelectorAll(".player")[parseInt(sessionStorage.getItem("controller"))].style.left}`)
        } else if (keyPressed["downPressed"]) {
            scroll(window.scrollX, window.scrollY + 3)
            ws.send(`verticalMovementPkg: ${sessionStorage.getItem("controller")}, -5, ${token}, ${document.querySelectorAll(".player")[parseInt(sessionStorage.getItem("controller"))].style.top}`)
        } else if (keyPressed["upPressed"]) {
            scroll(window.scrollX, window.scrollY - 3)
            ws.send(`verticalMovementPkg: ${sessionStorage.getItem("controller")}, 5, ${token}, ${document.querySelectorAll(".player")[parseInt(sessionStorage.getItem("controller"))].style.top}`)
        }
        window.requestAnimationFrame(update)
    }
    update()

    const moveRight = document.querySelector("#right")
    const moveLeft = document.querySelector("#left")
    const moveDown = document.querySelector("#down")
    const moveUp = document.querySelector("#up")

    moveRight.onpointerdown = () => {
        keyPressed["rightPressed"] = true
    }
    moveRight.onpointerup = () => {
        keyPressed["rightPressed"] = false
    }
    moveLeft.onpointerdown = () => {
        keyPressed["leftPressed"] = true
    }
    moveLeft.onpointerup = () => {
        keyPressed["leftPressed"] = false
    }
    moveDown.onpointerdown = () => {
        keyPressed["downPressed"] = true
    }
    moveDown.onpointerup = () => {
        keyPressed["downPressed"] = false
    }
    moveUp.onpointerdown = () => {
        keyPressed["upPressed"] = true
    }
    moveUp.onpointerup = () => {
        keyPressed["upPressed"] = false
    }
    document.onpointerup = () => {
        keyPressed["leftPressed"] = false
        keyPressed["rightPressed"] = false
        keyPressed["downPressed"] = false
        keyPressed["upPressed"] = false
    }

    ws.addEventListener("message", (m) => {
        if (m.data.startsWith("createPlayerPkg: ")) {
            let formatted = m.data.replace("createPlayerPkg: ", "")

            formatted = formatted.split(",")

            for (let i = 0; parseInt(formatted[2]) > i; i++) {
                let newPlayer = document.createElement("div")

                newPlayer.className = "player"
                newPlayer.id = i.toString()
                newPlayer.style["width"] = `${formatted[1]}px`
                newPlayer.style["height"] = `${formatted[1]}px`
                newPlayer.style["backgroundColor"] = "red"
                newPlayer.style["left"] = "10px"
                newPlayer.style["top"] = "10px"
                newPlayer.innerText = `${formatted[0]}`
                document.querySelector("main").append(newPlayer)
            }
        } else if (m.data.startsWith("resetPlayerPkg")) {
            document.querySelectorAll(".player").forEach(el => el.remove())
        } else if (m.data.startsWith("movePlayerPkg: ")) {
            let pkgFormat = m.data.replace("movePlayerPkg: ", "")
            pkgFormat = pkgFormat.split(",")

            pkgFormat["playerID"] = pkgFormat[0]
            pkgFormat["playerMovement"] = pkgFormat[1]
            let currentPos = document.querySelectorAll(`.player`)[pkgFormat["playerID"]].style.left
            document.querySelectorAll(`.player`)[pkgFormat["playerID"]].style.left = `calc(${currentPos} + ${pkgFormat["playerMovement"]}px)`
        } else if (m.data.startsWith("controllerID: ")) {
            let formatted = m.data.replace("controllerID: ", "")

            sessionStorage.setItem("controller", formatted)
        } else if (m.data.startsWith("token: ")) {
            let formatted = m.data.replace("token: ", "")

            token = formatted
            console.log(token)
        } else if (m.data.startsWith("verticalMovementPkg: ")) {
            let pkgFormat = m.data.replace("verticalMovementPkg: ", "")
            pkgFormat = pkgFormat.split(",")

            pkgFormat["playerID"] = pkgFormat[0]
            pkgFormat["playerMovement"] = pkgFormat[1]
            let currentPos = document.querySelectorAll(`.player`)[pkgFormat["playerID"]].style.top
            document.querySelectorAll(`.player`)[pkgFormat["playerID"]].style.top = `calc(${currentPos} - ${pkgFormat["playerMovement"]}px)`
        }
    })
})