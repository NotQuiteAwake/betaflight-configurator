import { gui_log } from './gui_log'

export let socket = new WebSocket('ws://localhost:3000');
let socketListeners = [];

socketSetup();

function onmessage(evt) {
    var message = evt.data;
    // execute every listener added from addSocketListener().
    for (let i = 0; i < socketListeners.length; i++) {
        socketListeners[i](message);
    }
}

function socketSetup() {
    socket.onopen = function() {
        log_all(`hijack: remote connected.`);
    }

    socket.onclose = function() {
        log_all(`hijack: remote disconnected. Reattempting connection in 1 second.`);
        setTimeout(function() {
            socket = new WebSocket('ws://localhost:3000');
            socketSetup();
        }, 1000);
    }
    
    socket.onmessage = onmessage;
}



// log to both console and GUI
export function log_all(log) {
    console.log(log);
    gui_log(log);
}

export function sendMessage(message){
    // we can't use socket.onopen because that executes
    // only when the connection goes from CONNECTING
    // to CONNECTED
    // instead we explicitly check socket readyState
    if (socket.readyState == 1) {
        socket.send(message)
    } 
}

export function addSocketListener(callback) {
    socketListeners.push(callback);
}
