const WebSocket = require("ws")
const fs = require("fs")

const wss = new WebSocket.Server({
    port: 8080
})
let i = 0
const spawnPlayers = () => {
    wss.clients.forEach((client) => {
        i = 0   
        client.send(`resetPlayerPkg`)
        wss.clients.forEach((c) => {
            c.send(`controllerID: ${i}`)
            i++
        })
        client.send(`createPlayerPkg: erik, 55, ${i}`)
    })
}
wss.on("connection", ws => {
    fs.readFile("list.txt", "utf-8", (err, res) => {
        ws.send(`increaseClicksPkg: ${res}`)
        console.log(res)
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
            let formatted = data.toString().replace("movePlayerPkg: ", "")

            formatted = formatted.split(",")
            const playerID = formatted[0]
            const playerMovement = formatted[1]

            if (parseInt(playerMovement) == 10) {
                wss.clients.forEach((client) => {
                    client.send(`movePlayerPkg: ${playerID}, ${playerMovement}`)
                })
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