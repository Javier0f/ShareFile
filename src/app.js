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
let clientes = [];
let offerState

function InitServer() {
    let ip = getIp();


    app.use(express.static(__dirname + '/cliente/user'))
    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/cliente/user/user.html")
    })

    http.listen(ip.port, ip.ip);
    console.log(`http://${ip.ip}:${ip.port}`)

};

io.on("connection", socket => {
    clientes.push({
        id: socket.id,
        name: socket.request.headers["user-agent"].split(" ").slice(1, 4).join(" ")
    });

    socket.on("offer", offer => {
        socket.broadcast.emit("offer", offer)
    })

    socket.on('answer', answer => {
        socket.broadcast.emit('answer', answer);
    })

    socket.on('candidate', candidate => {
        socket.broadcast.emit("candidate", candidate)
    })

    socket.on('disconnect', () => {
        let newClients = clientes.filter(id => id.id != socket.id);
        clientes = newClients;
    })

    socket.on("data", data => { console.log(data) })

    console.log(clientes.length);
})

io.on("disconnection", socket => {
    console.log(socket.id)
})

InitServer();