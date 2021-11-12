import {WSS} from "../utils/websocket.js";

let wss = new WSS();


wss.wss.onopen = function () {
	wss.reconnect();
}

export function getWSS() {
	return wss;
}