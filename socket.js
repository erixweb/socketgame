const WebSocket = require("ws")
const fs = require("fs")

const wss = new WebSocket.Server({
    port: 8080
})
wss.on("connection", ws => {
    ws.on("message", async (data) => {
        if (data == "INCREASE") {
            await fs.readFile("list.txt", "utf-8", (err, res) => {
                fs.writeFileSync("list.txt", `${(parseInt(res)+1).toString()}`)

                wss.clients.forEach((client) => {
                    client.send(res)
                })
            })
        } else {
            await fs.readFile("list.txt", "utf-8", (err, res) => {
                ws.send(res)

                console.log(res)
            })
        }
    })
})