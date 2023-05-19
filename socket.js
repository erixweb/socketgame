const WebSocket = require("ws")
const fs = require("fs")
const { default: movePacketEvent } = require("./packets/movePacket")
const { default: verticalMovementPacket } = require("./packets/verticalMovePacket")

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
        let token = Math.floor(Math.random() * 99999999999)
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
    spawnPlayers()
    ws.on("message", async (data) => {
        if (data.toString().startsWith("movePlayerPkg: ")) {
            movePacketEvent()
        } else if (data.toString().startsWith("verticalMovementPkg: ")) {
            verticalMovementPacket()
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