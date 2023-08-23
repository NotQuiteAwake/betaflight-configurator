import { gui_log } from './gui_log'

const SOCKET_ADDR = 'ws://localhost:3000';
let socketListeners = [];

let socket = new WebSocket(SOCKET_ADDR);
socketSetup();

// setInterval is thread safe since it only runs when JS is idle.
setInterval(function() {
    if (socket.readyState == socket.CLOSED) {
        log_all('Remote is disconnected. Reattempting connection.')
        socket = new WebSocket(SOCKET_ADDR);
        socketSetup();
    }
}, 2000);


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

    socket.onmessage = onmessage;

    socket.onclose = function() {
        // do nothing for now.
    }
}

// log to both console and GUI
export function log_all(log) {
    console.log(log);
    gui_log(log);
}

export function sendMessage(message){
    // socket.onopen is only executed 'on open'.
    // Instead, send only if socket is OPEN or else, discard.
    if (socket.readyState == socket.OPEN) {
        socket.send(message);
    } 
}

export function addSocketListener(callback) {
    socketListeners.push(callback);
}
