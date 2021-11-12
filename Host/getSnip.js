
// 处理收到的截图信息
document.addEventListener("img", (e) => {
	let chatDiv = document.getElementById("chatPanel");
	let snipImg = document.createElement("img");
	snipImg.src = e.detail.img;
	chatDiv.append(snipImg);
	chatDiv.animate({scrollTop:(chatDiv.style.height)}, 100);
})
