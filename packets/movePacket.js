export default function movePacketEvent() {
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
        } else {
            console.log(`${Players[playerID]} sent a move package but token is incorrect`)
        }
    } else {
        console.log(`${playerID} moved wrongly ${playerMovement}`)
    }
}