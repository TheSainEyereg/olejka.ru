import Logger from "./Logger.js";
import { getTheme } from "./Theme.js";

const logger = new Logger("Background");

let SNOW_MODE = false;

const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8,
		STAR_SIZE = 3,
		SNOW_SIZE = 5,
		STAR_MIN_SCALE = 0.2,
		OVERFLOW_THRESHOLD = 50;

const stars = [];

const pointer = {x: 0, y: 0, startX: 0, startY: 0}

const velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
let gyroscopeInput = false;

let canvas, context, width, height, scale = 1;

function generate() {
	for(let i = 0; i < STAR_COUNT; i++) {
		stars.push({
			x: 0,
			y: 0,
			z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
		});
	 }
}

function placeStar(star) {
	star.x = Math.random() * width;
	star.y = Math.random() * height;
}

function recycleStar(star) {
	let direction = "z";

	let vx = Math.abs(velocity.x),
		vy = Math.abs(velocity.y);

	if(vx > 1 || vy > 1) {
		let axis;

		if(vx > vy) {
			axis = Math.random() < vx / (vx + vy) ? "h" : "v";
		} else {
			axis = Math.random() < vy / (vx + vy) ? "v" : "h";
		}
		
		if(axis === "h") {
			direction = velocity.x > 0 ? "l" : "r";
		} else {
			direction = velocity.y > 0 ? "t" : "b";
		}
	}
	
	star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

	switch(direction) {
		case "z":
			star.z = 0.1;
			star.x = Math.random() * width;
			star.y = Math.random() * height;
			break;
		case "l":
			star.x = -OVERFLOW_THRESHOLD;
			star.y = height * Math.random();
			break;
		case "r":
			star.x = width + OVERFLOW_THRESHOLD;
			star.y = height * Math.random();
			break;
		case "t":
			star.x = width * Math.random();
			star.y = -OVERFLOW_THRESHOLD;
			break;
		case "b":
			star.x = width * Math.random();
			star.y = height + OVERFLOW_THRESHOLD;
			break;
	}
}

function resize() {
	scale = window.devicePixelRatio || 1;

	width = window.innerWidth * scale;
	height = window.innerHeight * scale;

	canvas.width = width;
	canvas.height = height;

	stars.forEach(placeStar);
}

function step() {
	context.clearRect(0, 0, width, height);
	update();
	render();
	requestAnimationFrame(step);
}

function update() {
	velocity.tx *= SNOW_MODE ? 0.90 : 0.96;
	velocity.ty *= SNOW_MODE ? 1 : 0.96;

	velocity.x += (velocity.tx - velocity.x) * 0.8;
	velocity.y += SNOW_MODE ? -velocity.y + 2.5 : (velocity.ty - velocity.y) * 0.8;

	stars.forEach((star) => {
		star.x += velocity.x * star.z;
		star.y += velocity.y * star.z;
		
		// Parallax 
		if (SNOW_MODE) {
			!star.snowParallax && (star.snowParallax = {mul: 1, val: Math.random() * 2 - 1});
			star.snowParallax.val += Math.random() * .05 * star.snowParallax.mul;
			Math.abs(star.snowParallax.val) > 1 && (star.snowParallax.mul *= -1); 
			star.x += star.snowParallax.val * .5 * star.z;
		} else {
			star.x += (star.x - width/2) * velocity.z * star.z;
			star.y += (star.y - height/2) * velocity.z * star.z;
			star.z += velocity.z;
		}

		
		if(star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD) {
			recycleStar(star);
		}
	});
}

function render() {
	stars.forEach((star) => {
		context.beginPath();
		context.lineCap = "round";
		context.lineWidth = (SNOW_MODE ? SNOW_SIZE : STAR_SIZE) * star.z * scale;

		const theme = getTheme();
		const color = ((t) => {
			if (t === "light") {
				return "0, 0, 0,";
			} else if (t === "dark") {
				return "255, 255, 255,";
			}
		})(theme);
		context.strokeStyle = "rgba("+color+(0.5 + 0.5*Math.random())+")";

		context.beginPath();
		context.moveTo(star.x, star.y);

		let tailX = SNOW_MODE ? 0 : velocity.x * 2,
			tailY = SNOW_MODE ? 0 : velocity.y * 2;
		
		if(Math.abs(tailX) < 0.1) tailX = 0.5;
		if(Math.abs(tailY) < 0.1) tailY = 0.5;

		context.lineTo(star.x + tailX, star.y + tailY);
		context.stroke();
	});
}

function movePointer(x, y) {
	x -= pointer.startX;
	y -= pointer.startY;

	if(typeof pointer.x === "number" && typeof pointer.y === "number") {
		let ox = x - pointer.x,
			oy = y - pointer.y;
		velocity.tx = velocity.tx + (ox / 8*scale) * (gyroscopeInput ? 1 : -1);
		velocity.ty = velocity.ty + (oy / 8*scale) * (gyroscopeInput ? 1 : -1);
	}

	pointer.x = x;
	pointer.y = y;
}


function onMouseMove(event) {
	if (gyroscopeInput) return;
	movePointer(event.clientX, event.clientY);
}

function onMouseEnter(event) {
	if (gyroscopeInput) return;
	pointer.startX = event.clientX;
	pointer.startY = event.clientY;
}

function onMouseLeave() {
	if (gyroscopeInput) return;
	pointer.x = null;
	pointer.y = null;
}

let lastGyro;
function onDeviceOrientation(event) {
	lastGyro = Date.now();
	gyroscopeInput = true;

	movePointer(event.gamma * 2, event.beta * 2);
	
	setTimeout(() => {
		if (Date.now() - lastGyro > 500) gyroscopeInput = false;
	}, 1000);
}


function runCanvas(snow_mode) {
	SNOW_MODE = snow_mode;

	canvas = document.querySelector("canvas"),
	context = canvas.getContext("2d");
	generate();
	resize();
	step();
	
	window.onresize = resize;
	window.onmousemove = onMouseMove;
	window.ondeviceorientation = onDeviceOrientation;
	document.onmouseenter = onMouseEnter;
	document.onmouseleave = onMouseLeave;
	
	logger.log("Started canvas!");
}

export {runCanvas};