import {getWSS} from "./wss.js";

let wss = getWSS();

document.addEventListener("canvasMes", (e) => {
	console.log("监听到 shapeArray 有变化");
	wss.sendCanvasMes(e.detail);
})