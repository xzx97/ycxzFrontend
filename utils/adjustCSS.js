// ------------------------------------ 判断是桌面端还是移动端 ------------------------------------ // 
let isMobileClient = function() {

	let userAgent = navigator.userAgent.toLowerCase();
	let rst = false;
	if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(userAgent)) {
		rst = true;
	}

	return rst;
}

// 根据设备是否是移动端，调整 CSS 布局
let adjustCSS = function() {

	if (isMobileClient()) {
		let loginDiv = document.getElementById("login");
		loginDiv.style.width = "80%";
		loginDiv.style.height = "50%";

		let title = document.getElementById("title");
		title.style.fontSize = "2em";

		let btn = document.getElementById("loginBtn");
		btn.style.height = "40px";
		btn.style.fontSize = "1em"

		let codeTitle = document.getElementById("codeTitle");
		codeTitle.style.fontSize = "2em";

		let joinPanel = document.getElementById("joinPanel");
		let inputRoomID = document.getElementById("inputRoomID");

		inputRoomID.style.height = "30px";
		inputRoomID.style.width = "80%";

		let joinBtn = document.getElementById("joinBtn");
		joinBtn.style.height = "40px";
		joinBtn.style.width = "50%";
		joinBtn.style.fontSize = "1em";
		
	}

}
adjustCSS();
