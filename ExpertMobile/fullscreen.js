// 判断各种浏览器，找到正确的方法
let launchFullscreen = function(element) {
	if(element.requestFullscreen) {
	element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
	element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
	element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
	element.msRequestFullscreen();
	}
}
let enterFullScreen = function() {
	// console.log("触发全屏");
	console.log("devicePixelRatio", window.devicePixelRatio);
	launchFullscreen(document.getElementById("displayArea"));
	let markCanvas = document.getElementById("markCanvas");
	markCanvas.dispatchEvent(new CustomEvent("enterFullScreen"));

	console.log(`getBoundingClientRect(): (${markCanvas.getBoundingClientRect().width}, ${markCanvas.getBoundingClientRect().height})`)
}

let exitFullScreen = function() {
	console.log("devicePixelRatio", window.devicePixelRatio);
	console.log(`getBoundingClientRect(): (${markCanvas.getBoundingClientRect().width}, ${markCanvas.getBoundingClientRect().height})`)
}

let fullScreenBtn = document.getElementById("fullScreenBtn");
let displayArea = document.getElementById("displayArea");
fullScreenBtn.onclick = function() {
	enterFullScreen();

}

displayArea.onfullscreenchange = function(e) {
	if (document.fullscreenElement) {
		console.log("进入全屏");
		enterFullScreen();

	} else {
		console.log("退出全屏");
		exitFullScreen();
	}
}
