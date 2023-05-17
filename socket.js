const WebSocket = require("ws")
const fs = require("fs")

const wss = new WebSocket.Server({
    port: 8080
})
let Players = []

let i = 0
const spawnPlayers = () => {
    Players = []
    wss.clients.forEach((client) => {
        i = 0   
        client.send(`resetPlayerPkg`)
        let token = Math.floor(Math.random() * 103043)
        client.send(`token: ${token}`)
        Players.push(token)
        wss.clients.forEach((c) => {
            c.send(`controllerID: ${i}`)
            i++
        })
        client.send(`createPlayerPkg: Player, 90, ${i}`)
    })
}
wss.on("connection", ws => {
    fs.readFile("list.txt", "utf-8", (err, res) => {
        ws.send(`increaseClicksPkg: ${res}`)
    })
    spawnPlayers()
    ws.on("message", async (data) => {
        if (data.toString().startsWith("movePlayerPkg: ")) {
            let formatted = data.toString().replace("movePlayerPkg: ", "")

            formatted = formatted.split(",")
            const playerID = formatted[0]
            const playerMovement = parseInt(formatted[1])
            const token = formatted[2]
            let pos = parseInt(formatted[3].replace("calc", "").replace("(", "").replace(")", "").replace("px", ""))

            if (playerMovement < 6 && playerMovement > -6) {
                if (playerMovement > 0 && pos > 1920) {
                    return
                } else if (playerMovement < 0 && pos < 5) {
                    return
                }
                if (Players[playerID] == token) {
                    wss.clients.forEach((client) => {
                        client.send(`movePlayerPkg: ${playerID}, ${playerMovement}`)
                    })
                } else  {
                    console.log(`${Players[playerID]} sent a move package but token is incorrect`)
                }
            } else {
                console.log(`${playerID} moved wrongly ${playerMovement}`)
            }
        } else if (data.toString().startsWith("verticalMovementPkg: ")) {
            let formatted = data.toString().replace("verticalMovementPkg: ", "")
            formatted = formatted.split(",")

            const playerID = formatted[0]
            const playerMovement = parseInt(formatted[1])
            const token = formatted[2]
            let pos = parseInt(formatted[3].replace("calc", "").replace("(", "").replace(")", "").replace("px", ""))
            if (playerMovement < 6 && playerMovement > -6) {
                if (playerMovement > 0 && pos < 10) {
                    return
                } else if (playerMovement < 0 && pos > 1900) {
                    return
                }
                if (Players[playerID] == token) {
                    wss.clients.forEach((client) => {
                        client.send(`verticalMovementPkg: ${playerID}, ${playerMovement}`)
                    })
                } else  {
                    console.log(`${Players[playerID]} sent a move package but token is incorrect`)
                }
            } else {
                console.log(`${playerID} moved wrongly ${playerMovement}`)
            }
        }
    })
    ws.on("close", () => {
        i = 0
        wss.clients.forEach((client) => {
            client.send(`resetPlayerPkg`)
            spawnPlayers()
            i++
        })
    })
})