import movePacketEvent from "./packets/movePacket.js"
import verticalMovementPacket from "./packets/verticalMovePacket.js"
import WebSocket, { WebSocketServer } from "ws"
import "fs"

const ws = new WebSocket()

const wss = new WebSocketServer({
    href: "localhost",
    port: "8080"
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
            movePacketEvent(data, Players, wss)
        } else if (data.toString().startsWith("verticalMovementPkg: ")) {
            verticalMovementPacket(data, Players, wss)
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