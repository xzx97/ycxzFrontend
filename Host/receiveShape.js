let canvas = document.getElementById("canvas");

document.addEventListener("canvasMes", (e) => {
	console.log("监听到 canvasMes");
	processCanvasMes(e);
})

function processCanvasMes(e) {
	if (e.detail.shape.type === "clear") {
		canvas.clear();
	} else if (e.detail.shape.type === "pop") {
		canvas.shapeStack.pop();
	} else {
		console.log("准备执行作图: ", e.detail.shape.type);
		// canvas.drawShape(e.detail.shape);
		canvas.shapeStack.push(e.detail.shape);
	}
}