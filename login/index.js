import {WSS} from '../utils/websocket.js';

let wss = new WSS();

// 辅助函数，判断是否是手机客户端
let isMobileClient = function() {

	let userAgent = navigator.userAgent.toLowerCase();
	let rst = false;
	sessionStorage.isMobile = false;
	if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(userAgent)) {
		rst = true;
		sessionStorage.isMobile = true;
	}

	return rst;
}

// -------------------------------------  登录 ------------------------------------------------------ // 
// 收到正确登录返回后, 弹出窗口，选择作为专家端还是现场人员登录
function submitLogin() {
	// console.log("login");
	let btn = document.getElementById("loginBtn");
	let account = document.getElementById("account");
	let password = document.getElementById("password");
	btn.onclick = (e) => {
		let acc = account.value;
		let pass = password.value;

		// 调用 wss 提交登录事件
		wss.Login(acc, pass);
	}
}
submitLogin();

document.addEventListener("login", (e)=> {
	console.log("监听到登录事件: ", e.detail);
	processLogin(e.detail);
});

// 处理登录事件
function processLogin(mes) {
	if (mes.rst === "success") {
		// 记录个人id(临时)
		sessionStorage.id = mes.id;
		// 弹出“角色选择”面板
		showPanel("role");
	} else {
		alert("登录失败。");
	}
}

//--------------------------------------- 角色选择面板 ---------------------------------- //
function chooseRole() {
	let expertBtn = document.getElementById("expertBtn");
	let hostBtn = document.getElementById("hostBtn");

	expertBtn.onclick = (e) => {
		showPanel("join");
		sessionStorage.role = "expert";
	}

	// 现场人员 创建房间，并等待返回
	hostBtn.onclick = (e) => {
		sessionStorage.role = "host";
		wss.createRoom(sessionStorage.id);
	}
}
chooseRole();

document.addEventListener("createRoom", (e) => {
	// console.log("监听到创建房间事件: ", e.detail);
	sessionStorage.roomID = e.detail.roomID;
	sessionStorage.token = e.detail.token;
	sessionStorage.appID = e.detail.appID;
	window.location.href = "../Host/Host.html";
})

// ----------------------------------------------  拨号阶段 --------------------------------------------- //
function joinRequest() {
	let inputRoomID = document.getElementById("inputRoomID");
	let joinBtn = document.getElementById("joinBtn");
	let roomID = undefined;

	joinBtn.onclick = function() {
		roomID = inputRoomID.value.toUpperCase();
		if (validRoomID(roomID)) {
			sessionStorage.roomID = roomID;
			// window.location.href = "../Expert/Expert.html";
			if (isMobileClient()) {
				window.location.href = "../ExpertMobile/index.html";
			} else {
				window.location.href = "../Expert/Expert.html";
			}
		};
	}
}
joinRequest();

// 辅助函数 验证房间号是否正确
async function validRoomID(roomID) {
	let rst = false;
	// 监听 joinRoom 事件返回
	document.addEventListener("joinRoom", (e) => {
		console.log("监听到join事件返回: ", e.detail);
		// 如果判断房间存在，则会返回token供加入
		if (e.detail.rst && e.detail.token) {
			sessionStorage.token = e.detail.token;
			sessionStorage.appID = e.detail.appID;
			console.log("token: ", sessionStorage.token);
			console.log("appID: ", sessionStorage.appID);
			rst = true;
			return rst;
		} else {
			return rst;
		}
	})
	// 向服务器发出加入房间的请求
	wss.joinRoom(sessionStorage.id, roomID);
}




// ----------------------------  页面跳转控制 -------------------------- //

function showPanel(panel) {
	let loginDiv = document.getElementById("login");
	let rolePanel = document.getElementById("rolePanel");
	let joinPanel = document.getElementById("joinPanel");

	if (panel === "login") {
		loginDiv.style.display = "flex";
		rolePanel.style.display = "none";
		joinPanel.style.display = "none";
		// callReminder.style.display = "none";
	} else if (panel === "role") {
		loginDiv.style.display = "none";
		rolePanel.style.display = "flex";
		joinPanel.style.display = "none";
		// callReminder.style.display = "none";
	} else if (panel === "join") {
		loginDiv.style.display = "none";
		rolePanel.style.display = "none";
		joinPanel.style.display = "flex";
		// callReminder.style.display = "none";
	}
}