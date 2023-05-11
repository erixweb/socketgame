import { createServer } from "http"
import { readFile } from "fs"

createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': "text/html"
    })

    readFile("index.html", "utf-8", (err, data) => {
        if (err) console.log(err)
        res.end(data)
    })
}).listen(8082)