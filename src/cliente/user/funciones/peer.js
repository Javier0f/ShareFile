import { saveFile } from "./sendFile.js";
const peer = new RTCPeerConnection();

peer.addEventListener("iceconnectionstatechange", evnt => {
    console.log(evnt.target.iceConnectionState)

    if (evnt.target.iceConnectionState === 'connected') {
        try {
            peer.channel.maxLengthMsg = peer.sctp.maxMessageSize
        } catch (err) { }
    }
})

async function createOffer() {

    let dataChannel = peer.createDataChannel("FileChannel", {
        id: 9,
        negotiated: false,
        ordered: true
    })

    dataChannel.onopen = () => console.log("canal abierto", dataChannel);

    peer.channel = dataChannel;

    try {
        let offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    } catch (err) {
        console.warn(err)
    }
}

async function createAnswer(offer) {
    peer.ondatachannel = (evnt) => {
        console.log(evnt.channel)

        evnt.channel.onopen = () => {
            saveFile(evnt.channel)
        }

        peer.channel = evnt.channel;
    }

    try {
        await peer.setRemoteDescription(offer);
        let answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    } catch (err) {
        console.warn(err)
    }
}

async function saveAnswer(answer) {
    try {
        await peer.setRemoteDescription(answer)
    } catch (err) {
        console.warn(err)
    }
}

export default function connectPeer(socket) {

    peer.sendOffer = () => {
        createOffer().then(offer => {
            socket.emit("offer", offer)
        })
    }

    socket.on("offer", offer => {
        createAnswer(offer).then(answer => {
            socket.emit("answer", answer)
        })
    })

    socket.on("answer", answer => {
        saveAnswer(answer)
    })

    socket.on("disconnect", () => {
        location.reload();
    })

    peer.onicecandidate = evnt => {
        if (evnt.candidate) {
            socket.emit("candidate", evnt.candidate)
        }
    }

    socket.on("candidate", candidate => {
        if (candidate) {
            peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(err => {
                console.warn("Error añadiendo ICE Candidate:", err);
            });
        }
    });

    return peer;
}