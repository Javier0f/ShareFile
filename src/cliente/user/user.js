import io from './funciones/socket.io.esm.min.js'
import connectPeer from './funciones/peer.js';
import addUser from './funciones/addUser.js';
import { sendFile } from './funciones/sendFile.js';

const socket = io();

const peer = connectPeer(socket);

socket.on("connect", () => {
    let name = prompt("Nombre de usuario", "none");
    socket.emit("user", name)
})

socket.on("users", users => addUser(users))

document.getElementById("ping").onclick = peer.sendOffer

document.getElementById("sendFile").onclick = () => {
    sendFile(peer.channel)
}