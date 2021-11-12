class ShapeStack {
	constructor() {
		this.stack = [];
	}

	push (shape) {
		this.stack.push(shape);
	}

	pop () {
		this.stack.pop();
	}

	clear() {
		this.stack.splice(0, this.stack.length);
	}

	get length() {return this.stack.length};
}

class FieldCanvas extends HTMLCanvasElement{

	constructor(width=800, height=500) {
		super(width, height);

		this.ctx = this.getContext("2d");
		this.shapeStack = new ShapeStack();
		this.ctx.lineWidth = 3 * window.devicePixelRatio;
		this.width = width;
		this.height = height;
	};

	drawVideo (video) {
		this.ctx.drawImage(video, 0, 0, this.width, this.height);
	};

	drawShapeArray() {
		for (let i = 0; i < this.shapeStack.stack.length; ++i) {
			this.drawShape(this.shapeStack.stack[i]);
		}
	}

	drawShape (shape) {
		// console.log("调用drawShape()");
		let scale = {x : 1, y : 1};
		// scale.x = this.getBoundingClientRect().width / shape.canvasW;
		// scale.y = this.getBoundingClientRect().height / shape.canvasH;
		// console.log(`bounding() : (${this.getBoundingClientRect().width}, ${this.getBoundingClientRect().height})`);
		// scale.x = this.width / shape.canvasW;
		// scale.y = this.height / shape.canvasH;

		if (shape.type === "rect") {
			this.drawRect(shape, scale);
			// this.shapeStack.push(shape);
		} else if (shape.type === "line"){
			this.drawLine(shape, scale);
			// this.shapeStack.push(shape);
		} else if (shape.type === "clear") {
			this.clear();
		} else if (shape.type === "arrow") {
			this.drawArrow(shape, scale);
		}
	}

	drawRect (rect, scale) {
		// console.log("调用drawRect()");
		this.ctx.lineWidth = 3 * window.devicePixelRatio;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = rect.strokeStyle;

		let x = rect.startX * scale.x;
		let y = rect.startY * scale.y;
		let w = scale.x * (rect.endX - rect.startX);
		let h = scale.y * (rect.endY - rect.startY);

		this.ctx.rect(x, y, w, h);
		this.ctx.stroke();

		this.ctx.closePath();
		this.ctx.restore();
		
	}

	drawLine (line, scale) {
		this.ctx.lineWidth = 3 * window.devicePixelRatio;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = line.strokeStyle;
		this.ctx.moveTo(scale.x * line.startX, scale.y * line.startY);
		for (let i = 1; i < line.track.length; ++i) {
			// console.log(`划线坐标: (${scale.x * line.track[i].x}, ${scale.y * line.track[i].y})`, )
			this.ctx.lineTo(scale.x * line.track[i].x, scale.y * line.track[i].y);
		}
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.restore();
	}
	
	drawArrow (arrow, scale) {
		// console.log("准备画 arrow");
		this.ctx.lineWidth = 3 * window.devicePixelRatio;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = arrow.strokeStyle;
		this.ctx.moveTo(scale.x * arrow.startX, scale.y * arrow.startY);
		this.ctx.lineTo(scale.x * arrow.endX, scale.y * arrow.endY);
		this.ctx.lineTo(scale.x * arrow.upPoint.x, scale.y * arrow.upPoint.y);
		this.ctx.moveTo(scale.x * arrow.endX, scale.y * arrow.endY);
		this.ctx.lineTo(scale.x * arrow.downPoint.x, scale.y * arrow.downPoint.y);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.restore();

	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.shapeStack.clear();
	}

}

customElements.define("field-canvas", FieldCanvas, {extends: "canvas"});