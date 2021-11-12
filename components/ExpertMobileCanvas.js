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

	constructor(width=300, height=150) {
		super(width, height);
		this.ctx = this.getContext('2d');
		this.shapeStack = new ShapeStack();
		this.width = 2000;
		this.height = 2000;

		this.ctx.strokeStyle = "red";
		this.addEventListener("drawShape", (e)=> {
			let drawCmd = e.detail;
			if (drawCmd === "rect" || drawCmd === "line") {
				this.drawShape(e.detail);
			} else if (drawCmd === "clear") {
				this.clear();
			}
		})

		this.addEventListener("strokeStyle", (e)=> {
			let color = e.detail;
			this.ctx.strokeStyle = color;
		})

		this.touchDraw();
		// this.addEventListener("enterFullScreen", (e) => {
		// 	console.log("监听到enterFullScreen 事件");
		// 	this.touchDraw();
		// })
		// this.addEventListener("snipEvent", (e) => {
		// 	console.log("监听到 snipCanvas");
		// })

	}

	drawVideo (video) {
		this.ctx.drawImage(video, 0, 0, this.width, this.height);
		// console.log(`canvasSize : (${this.width}, ${this.height}`);
	};

	drawShape(type) {
		let xRatio = this.width / this.getBoundingClientRect().width;
		let yRatio = this.height / this.getBoundingClientRect().height;

		let isMouseDown = false;
		let img = new Image();
		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 4;

		this.ontouchstart = (e) => {
			console.log("开始 drawShape().start");
			console.log(e);
			let shape = ShapeFactory(type);

			let posX = e.touches[0].clientX * xRatio;
			let posY = e.touches[0].clientY * yRatio;
			this.ctx.beginPath();
			this.ctx.moveTo(posX, posY);
			isMouseDown = true;
			shape.strokeStyle = this.ctx.strokeStyle;
			shape.startX = posX;
			shape.startY = posY;
			shape.canvasW = this.getBoundingClientRect().width;
			shape.canvasH = this.getBoundingClientRect().height;

			img.src = this.toDataURL();

			this.ontouchmove = (e) => {
				if (isMouseDown) {
					// console.log("开始 drawShape().move");
					// console.log(`getBoundingClientRect(): (${this.getBoundingClientRect().x}, ${this.getBoundingClientRect().y})`)
					let posX = e.touches[0].clientX * xRatio;
					let posY = e.touches[0].clientY * yRatio;
					shape.moveX = posX;
					shape.moveY = posY;

					this.ctx.clearRect(0, 0, this.width, this.height);
					shape.draw(this.ctx);

					this.ctx.drawImage(img, 0, 0);
				}
			}
			
			this.ontouchend = (e) => {
				if (isMouseDown) {
					// let posX = e.touches[0].clientX - this.getBoundingClientRect().x;
					// let posY = e.touches[0].clientY - this.getBoundingClientRect().y;
					// shape.endX = posX;
					// shape.endY = posY;
					isMouseDown = false;
					this.shapeStack.push(shape);
					console.log(shape);
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

	touchDraw() {
		console.log("开始 touchDraw()");
		this.drawShape("line");
		// this.ctx.fillStyle = "red";
	}
}

customElements.define("expert-canvas", ExpertCanvas, {extends : "canvas"});