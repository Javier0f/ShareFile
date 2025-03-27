const { createServer } = require("http");
const { networkInterfaces } = require("os")
const express = require("express");
const { Server } = require("socket.io");

function getIp() {
    let net = networkInterfaces();
    let connection = net["Ethernet"] || net["Wi-Fi"];

    return {
        ip: connection[1].address,
        port: 3000
    }
}

const app = express();
const http = createServer(app);
const io = new Server(http);

let clientes = []

function InitServer() {
    let ip = getIp();

    app.use("/user", express.static(`${__dirname}/cliente/user`))
    app.use(express.urlencoded({ extended: true }))
    app.get("/user", (req, res) => {
        console.log(req.body)
        res.sendFile(`${__dirname}/cliente/user/user.html`)
    })

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/cliente/login.html")
    })

    http.listen(ip.port, ip.ip);
    console.log(`http://${ip.ip}:${ip.port}`)

};

io.on("connection", socket => {

})

InitServer();