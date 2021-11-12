export class WSS {
	#wsURL;

	constructor() {
		this.#wsURL = "wss://59.51.66.91:10010/";
		this.wss = new WebSocket(this.#wsURL);

		this.wss.onmessage = function(e) {
			let info = JSON.parse(e.data);
			console.log("wss 收到消息", info);

			// 根据信息的 cmdType，派发对应的事件
			dispatch(info);
		}
	}

	Login(account ,password) {
		let obj = {
			cmdType : "login",
			mes : {
				account : account,
				password : password,
			}
		}
		this.wss.send(JSON.stringify(obj));
	}

	createRoom(id) {
		let obj = {
			cmdType : "createRoom",
			mes : {
				id : id,
			}
		}

		this.wss.send(JSON.stringify(obj));
	}

	joinRoom(id, roomID) {
		let obj = {
			cmdType : "joinRoom",
			mes : {
				roomID : roomID,
				id : id,
			}
		}

		this.wss.send(JSON.stringify(obj));
	}

	sendCanvasMes(shape) {
		console.log("发送图形消息: ", shape);
		let obj = {
			cmdType : "canvasMes",
			mes : {
				id : sessionStorage.id,
				roomID : sessionStorage.roomID,
				shape : shape,
			}
		}

		this.wss.send(JSON.stringify(obj));
	}

	reconnect() {
		let obj = {
			cmdType : "reconnect",
			mes : {
				id : sessionStorage.id,
				roomID : sessionStorage.roomID,
			}
		}
		console.log("发送重连消息");

		this.wss.send(JSON.stringify(obj));
	}

	sendMes(data, type) {
		let obj = {
			cmdType : "mes",
			mes : {
				type : type,
				id : sessionStorage.id,
				roomID : sessionStorage.roomID,
				data : data,
			}
		}

		console.log("发送消息数据: ", obj);
		this.wss.send(JSON.stringify(obj));
	}

}

// 辅助函数
function dispatch(info) {

	console.log("派发事件: ", info.cmdType);
	document.dispatchEvent(new CustomEvent(info.cmdType, {detail : info.mes}));
}

// export function websocket() {
// 	let wss = new WSS();

// 	return wss;
// }
