import { createServer } from "http"
import { readFile } from "fs"

createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, {
            'Content-Type': "text/html"
        })
        readFile("index.html", "utf-8", (err, data) => {
            if (err) console.log(err)
            res.end(data)
        })
    } else if (req.url == "/styles.css") {
        res.writeHead(200, {
            'Content-Type': "text/css"
        })
        readFile("styles.css", "utf-8", (err, data) => {
            if (err) console.log(err)
            res.end(data)
        })
    } else if (req.url == "/client/main.js") {
        res.writeHead(200, {
            'Content-Type': "text/javascript"
        })
        readFile("client/main.js", "utf-8", (err, data) => {
            if (err) console.log(err)
            res.end(data)
        })
    } else if (req.url == "/client/canvas.js") {
        res.writeHead(200, {
            'Content-Type': "text/javascript"
        })
        readFile("client/canvas.js", "utf-8", (err, data) => {
            if (err) console.log(err)
            res.end(data)
        })
    }
}).listen(8082)