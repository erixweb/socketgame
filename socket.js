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
        client.send(`createPlayerPkg: Player, 55, ${i}`)
    })
}
wss.on("connection", ws => {
    fs.readFile("list.txt", "utf-8", (err, res) => {
        ws.send(`increaseClicksPkg: ${res}`)
    })
    spawnPlayers()
    ws.on("message", async (data) => {
        if (data == "INCREASE") {
            await fs.readFile("list.txt", "utf-8", (err, res) => {
                fs.writeFileSync("list.txt", `${(parseInt(res)+1).toString()}`)

                wss.clients.forEach((client) => {
                    client.send(`increaseClicksPkg: ${res}`)
                })
            })
        } else if (data == "PING") {
            await fs.readFile("list.txt", "utf-8", (err, res) => {
                ws.send(`increaseClicksPkg: ${res}`)
            })
        } else if (data.toString().startsWith("movePlayerPkg: ")) {
            console.log(Players)
            let formatted = data.toString().replace("movePlayerPkg: ", "")

            formatted = formatted.split(",")
            const playerID = formatted[0]
            const playerMovement = formatted[1]
            const token = formatted[2]

            if (parseInt(playerMovement) < 11 && parseInt(playerMovement) > -11) {
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