import {getWSS} from "./wss.js";

let wss = getWSS();

document.addEventListener("sendSnipImg", (e) => {
	console.log("监听到发送图片的请求: ", e.detail);
	// let info = {
	// 	from : sessionStorage.id,
	// 	type : "img",
	// 	mes : e.detail
	// }
	let chatScroll = document.getElementById("chatRecord");

	let imgDom = document.createElement('img');
	imgDom.src = e.detail;
	imgDom.style.width = "160px";
	imgDom.style.height = "100px";
	imgDom.style.margin = "10px";
	imgDom.onclick = function (e) {
		console.log("触发 img 点击事件");
		let imgDiv = document.createElement("div");
		imgDiv.style.width = "100%";
		imgDiv.style.height = "100%";
		imgDiv.style.display = "flex";
		imgDiv.style.position = "absolute";
		imgDiv.style.top = 0;
		imgDiv.style.left = 0;
		imgDiv.style.justifyContent = "center";
		imgDiv.style.alignItems = "center";
		imgDiv.style.zIndex = "10001";
		imgDiv.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
		imgDiv.onclick = function () {
			// imgDiv.style.display = "none";
			imgDiv.remove();
		}

		let largerImg = document.createElement("img");
		largerImg.src = imgDom.src;
		largerImg.style.width = "100%";
		largerImg.style.height = "auto";
		if (sessionStorage.isMobile === 'false') {
			largerImg.style.width = "800px";
			largerImg.style.height = "500px";
		}

		document.body.appendChild(imgDiv);

		imgDiv.appendChild(largerImg);
	}
	chatScroll.appendChild(imgDom);
	chatScroll.scrollTop = chatScroll.scrollHeight;

	wss.sendMes(e.detail, "img");
})