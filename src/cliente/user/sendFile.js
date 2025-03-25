const fileInput = document.getElementById("file")

function getFile() {
    const fileInput = document.getElementById("file")

    const file = fileInput.files[0];

    if (!file) { alert("sin Archivos seleccionados"); return };


    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const chunkSize = 128 * 1024;

            let offset = 0;
            let blobs = [];

            function sendNextChunk() {
                if (offset < file.size) {
                    const slice = file.slice(offset, offset + chunkSize);
                    blobs.push(slice);
                    offset += chunkSize;
                    sendNextChunk();
                } else {
                    console.log("√ proceso completo")

                    let info = {
                        lastModifiedData: file.lastModifiedDate,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        webkitRelativePath: file.webkitRelativePath
                    }

                    blobs.push(JSON.stringify(info))
                    resolve(blobs)
                }
            }

            sendNextChunk();
        }

    })

    reader.onload = () => {
        console.log("Archivo: ", file.name);

        const chunkSize = 128 * 1024;

        let offset = 0;

        let blobs = [];

        return new Promise((res, rej) => {

            function sendNextChunk() {
                if (offset < file.size) {
                    const slice = file.slice(offset, offset + chunkSize);

                    // reader.readAsArrayBuffer(slice)
                    blobs.push(slice)

                    offset += chunkSize;
                    setTimeout(sendNextChunk, 10);
                } else {
                    console.log("√ enviado", offset, blobs);
                    res(blobs);
                }
            }

            sendNextChunk();
        })

    }
}

let chunksRecividos = [];

export function saveFile(channel) {
    if (channel instanceof RTCDataChannel) {
        channel.onmessage = evnt => {
            if (evnt.data != "END") {
                chunksRecividos.push(evnt.data)
            } else {
                let info = JSON.parse(chunksRecividos.pop());
                const fileBlob = new Blob(chunksRecividos, info);

                let url = URL.createObjectURL(fileBlob);

                let a = document.createElement("a");
                a.href = url
                a.download = info.name;
                document.body.appendChild(a);
                a.click();

                chunksRecividos = [];
            }
        }
    }
}

export function sendFile(channel) {
    if (channel instanceof RTCDataChannel) {
        if (channel.readyState !== 'open') { console.log(channel.readyState); return };

        getFile().then(blobs => {
            let contador = 0;
            function sendNextChunk() {
                if (contador < blobs.length) {
                    channel.send(blobs[contador]);
                    contador++;
                    console.log(contador, blobs.length)
                    setTimeout(sendNextChunk, 10)
                } else {
                    channel.send("END")
                }
            }
            sendNextChunk();
        })

    } else {
        throw new Error("se require un dataChannel")
    }
}