import io from './socket.io.esm.min.js'
import connectPeer from './peer.js'
import { sendFile, saveFile } from './sendFile.js';

const socket = io();

const peer = connectPeer(socket);

document.getElementById("ping").onclick = peer.sendOffer

document.getElementById("sendFile").onclick = () => {
    sendFile(peer.channel)
    // const fileInput = document.getElementById("file")

    // const file = fileInput.files[0];

    // if (!file) { alert("sin Archivos seleccionados"); return };


    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = () => {
    //     console.log("Archivo: ", file.name);

    //     const chunkSize = 128 * 1024;

    //     let offset = 0;

    //     function sendNextChunk() {
    //         if (offset < file.size) {
    //             const slice = file.slice(offset, offset + chunkSize);

    //             reader.readAsArrayBuffer(slice)

    //             offset += chunkSize;
    //             setTimeout(sendNextChunk, 10);
    //         } else {
    //             console.log("√ archivo enviado", offset)
    //         }
    //     }

    //     sendNextChunk();
    //     // console.log(reader.result)
    // }
}