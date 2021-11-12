import {ShapeFactory} from "../utils/shape.js"

class ShapeStack {
	constructor() {
		this.stack = [];
	}

	push (shape) {
		this.stack.push(shape);
		// 新矩形，则派发 newShape 事件
		document.dispatchEvent(new CustomEvent("canvasMes", {detail : shape}));
	}

	pop () {
		this.stack.pop();
		// 撤销，派发 undo 事件
		document.dispatchEvent(new CustomEvent("canvasMes", {detail : {type : "undo"}}));
	}

	clear() {
		// 清屏，派发 clear 事件
		this.stack.splice(0, this.stack.length);
		document.dispatchEvent(new CustomEvent("canvasMes", {detail : {type : "clear"}}));
	}

	get length() {return this.stack.length};
}


class ExpertCanvas extends HTMLCanvasElement{

	constructor(width=800, height=500) {
		super(width, height);
		this.ctx = this.getContext('2d');
		this.shapeStack = new ShapeStack();
		this.width = width;
		this.height = height;
		// this.width = 980;
		// this.height = 720;

		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 4;
		this.addEventListener("drawShape", (e)=> {
			console.log("监听到 drawShape 点击事件")
			let drawCmd = e.detail;
			if (drawCmd === "rect" || drawCmd === "line" || drawCmd === "arrow") {
				this.drawShape(e.detail);
			} else if (drawCmd === "clear") {
				this.clear();
			}
		})

		this.addEventListener("strokeStyle", (e)=> {
			let color = e.detail;
			this.ctx.strokeStyle = color;
		})

		// this.addEventListener("snipEvent", (e) => {
		// 	console.log("监听到 snipCanvas");
		// })

	}

	drawVideo (video) {
		this.ctx.drawImage(video, 0, 0, this.width, this.height);
	};

	drawShape(type) {

		console.log("正在 drawShape: ", type);

		let isMouseDown = false;
		let img = new Image();

		this.onmousedown = (e) => {
			let shape = ShapeFactory(type);

			let posX = e.clientX - this.getBoundingClientRect().x;
			let posY = e.clientY - this.getBoundingClientRect().y;
			this.ctx.beginPath();
			this.ctx.moveTo(posX, posY);
			isMouseDown = true;
			shape.strokeStyle = this.ctx.strokeStyle;
			shape.startX = posX;
			shape.startY = posY;
			// shape.canvasW = this.width;
			// shape.canvasH = this.height;
			shape.canvasW = this.getBoundingClientRect().width;
			shape.canvasH = this.getBoundingClientRect().height;

			img.src = this.toDataURL();

			this.onmousemove = (e) => {
				if (isMouseDown) {
					let posX = e.clientX - this.getBoundingClientRect().x;
					let posY = e.clientY - this.getBoundingClientRect().y;
					shape.moveX = posX;
					shape.moveY = posY;

					this.ctx.clearRect(0, 0, this.width, this.height);
					shape.draw(this.ctx);

					this.ctx.drawImage(img, 0, 0);
				}
			}
			
			this.onmouseup = (e) => {
				if (isMouseDown) {
					let posX = e.clientX - this.getBoundingClientRect().x;
					let posY = e.clientY - this.getBoundingClientRect().y;
					shape.endX = posX;
					shape.endY = posY;
					isMouseDown = false;
					this.shapeStack.push(shape);
				}
			}
		}
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.shapeStack.clear();
	}

	snip() {
		return this.toDataURL();
	}
}

customElements.define("expert-canvas", ExpertCanvas, {extends : "canvas"});