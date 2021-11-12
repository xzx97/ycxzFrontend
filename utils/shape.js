class Shape {
	constructor(type) {
		this.type = type;
	}
	canvasW = undefined;
	canvasH = undefined;
	startX = 0;
	startY = 0;
	moveX = undefined;
	moveY = undefined;
	endX = undefined;
	endY = undefined;
	strokeStyle = undefined;

	static setStartXY (x, y) {
		this.startX = x;
		this.startY = y;
	}

	static setMoveXY (x, y) {
		this.moveX = x;
		this.moveY = y;
	}

	static setEndXY (x, y) {
		this.endX = x;
		this.endY = y;
	}
	
	static clone (shape) {
		let newShape = ShapeFactory(shape.type);

	}

	draw(){};
}

export class Rect extends Shape{
	constructor(){
		super("rect");
	}

	draw(ctx) {
		let w, h;

		// 根据是否已经做完图而采取不同的作图方法
		if (this.endX && this.endY) {
			w = this.endX - this.startX;
			h = this.endY - this.startY;
		} else {
			w = this.moveX - this.startX;
			h = this.moveY - this.startY;
		}

		ctx.beginPath();
		ctx.rect(this.startX, this.startY, w, h)
		ctx.stroke();
		ctx.closePath();
	}
}

export class Line extends Shape {
	constructor() {
		super("line");
		this.track = [];
	};


	draw(ctx) {
		// 判断是否是已经画完的图形
		if (this.endX && this.endY) {
			ctx.beginPath();
			ctx.moveTo(this.startX, this.startY);
			for (let i = 0; i < this.track.length; ++i) {
				ctx.lineTo(this.track[i].x, this.track[i].y);
				ctx.stroke();
			}
			ctx.closePath();
		} else{
			this.addPoint(this.moveX, this.moveY);
			ctx.lineTo(this.moveX, this.moveY);
			ctx.stroke();
			ctx.moveTo(this.moveX, this.moveY);
			ctx.closePath();
		}
	}

	// 鼠标移动过程中，往track中添加轨迹点
	addPoint(x, y) {
		this.track.push({x: x, y:y});
	}
}

export class Arrow extends Shape {
	constructor() {
		super("arrow");
	};
	
	draw(ctx) {
		// console.log("触发arrow作图")

		// console.log("startPoint: ", this.startX, ": ", this.startY);
		let X = 0, Y = 0;
		if (this.endX && this.endY) {
			X = this.endX;
			Y = this.endY;
		} else {
			X = this.moveX;
			Y = this.moveY;
		}
		// 转为单位向量
		let unitVec = toUnitVector(X - this.startX, Y - this.startY);
		let p1 = Math.round(2/Math.sqrt(2))
		let length = 10;

		let v1 = rotationTheta(-p1, p1, unitVec.x, unitVec.y);
		let v2 = rotationTheta(-p1, -p1, unitVec.x, unitVec.y);
		v1 = scale(v1, length);
		v2 = scale(v2, length);
		v1 = shift(v1, {x:X, y:Y});
		v2 = shift(v2, {x:X, y:Y});

		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(X, Y);
		ctx.lineTo(v1.x, v1.y);
		ctx.moveTo(X, Y);
		ctx.lineTo(v2.x, v2.y);
		ctx.stroke();
		ctx.closePath();
		this.upPoint = v1;
		this.downPoint = v2;

	}


}

export function ShapeFactory(type) {
	if (type === "rect") {
		// console.log("new rect");
		return new Rect();
	} else if (type === "line") {
		// console.log("new line");
		return new Line();
	} else if (type === "arrow") {
		return new Arrow();
	}
}

function rotationTheta(x1, y1, cosTheta, sinTheta) {
	let rst = {
		x : undefined,
		y : undefined
	}

	rst.x = cosTheta * x1 - sinTheta * y1;
	rst.y = sinTheta * x1 + cosTheta * y1;

	// console.log("cosTheta: ", cosTheta);
	// console.log("sinTheta: ", sinTheta);

	return rst;
}

function toUnitVector(x, y) {
	let rst = {
		x: 1,
		y: 0,
	}

	rst.x = x / Math.sqrt(x*x + y*y);
	rst.y = y / Math.sqrt(x*x + y*y);
	return rst;
}

function shift(vec, moveVec) {
	vec.x += moveVec.x;
	vec.y += moveVec.y;
	return vec;
}

function scale(vec, num) {
	vec.x *= num;
	vec.y *= num;
	return vec;
}