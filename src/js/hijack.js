import { gui_log } from './gui_log'

export let socket = new WebSocket('ws://localhost:3000');

socket.onopen = function() {
    log_all(`hijack: remote connected.`);
}

socket.onclose = function() {
    log_all(`hijack: remote disconnected.`);
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
    socket.onmessage = function (evt) {
        var message = evt.data;
        callback(message);
    };
}
