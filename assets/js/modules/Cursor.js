import Logger from "./Logger.js";
const logger = new Logger("Cursor");

const cursor = document.querySelector("#cursor");
const DEFAULT_CURSOR_SIZE = cursor?.style?.getPropertyValue("--height");

let isOnElement = false;

function mousedownHandler() {
	!isOnElement && cursor.style.setProperty("--scale", 0.9);
}
function mouseupHandler() {
	!isOnElement &&	cursor.style.setProperty("--scale", 1);
}
function mousemoveHandler({ x, y }) {
	if (!isOnElement) {
		cursor.style.setProperty("--top", y + "px");
		cursor.style.setProperty("--left", x + "px");
	}
}

function mouseenterHandler() {
	cursor.style.removeProperty("display");
}
function mouseleaveHandler() {
	cursor.style.setProperty("display", "none");
}


let rect = null;
function linkMouseenterHandler({ target }) {
	isOnElement = true;

	rect = target.getBoundingClientRect();

	cursor.classList.add("is-locked");
	target.classList.contains("ccircle") && cursor.classList.add("circle");

	cursor.style.setProperty(
		"--top",
		rect.top + rect.height / 2 + "px"
	);
	cursor.style.setProperty(
		"--left",
		rect.left + rect.width / 2 + "px"
	);
	cursor.style.setProperty("--width", rect.width + "px");
	cursor.style.setProperty("--height", rect.height + "px");

	target.style.setProperty("--scale", 1.05);
}
function linkMouseleaveHandler({ target }) {
	isOnElement = false;

	cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
	cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
	cursor.style.setProperty("--translateX", 0);
	cursor.style.setProperty("--translateY", 0);

	target.style.setProperty("--translateX", 0);
	target.style.setProperty("--translateY", 0);
	target.style.setProperty("--scale", 1);

	setTimeout(() => {
		if (!isOnElement) {
			cursor.classList.remove("is-locked");
			cursor.classList.remove("circle");
		}
	}, 100);
}
function linkMousemoveHandler({ target, x, y }) {
	const halfHeight = rect.height / 2;
	const topOffset = (y - rect.top - halfHeight) / halfHeight;
	const halfWidth = rect.width / 2;
	const leftOffset = (x - rect.left - halfWidth) / halfWidth;

	cursor.style.setProperty("--translateX", `${leftOffset * 4}px`);
	cursor.style.setProperty("--translateY", `${topOffset * 4}px`);

	target.style.setProperty("--translateX", `${leftOffset * 3}px`);
	target.style.setProperty("--translateY", `${topOffset * 2}px`);
}


function textMouseoverHandler() {
	cursor.style.setProperty("--width", "0.2em");
	cursor.style.setProperty("--height", "1.5em");
}
function textMouseoutHandler() {
	cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
	cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
}

function startHandling() {
	if (!cursor) return logger.error("No elements with id \"cursor\" found!");

	const style = document.createElement("link");
	style.id = "cursorStyle";
	style.rel = "stylesheet";
	style.href = "/assets/css/components/customCursor.css";
	document.head.appendChild(style);

	document.addEventListener("mousedown", mousedownHandler);
	document.addEventListener("mouseup", mouseupHandler);
	document.addEventListener("mousemove", mousemoveHandler);

	document.addEventListener("mouseenter", mouseenterHandler);
	document.addEventListener("mouseleave", mouseleaveHandler);

	document.querySelectorAll("a").forEach(a => {
		a.addEventListener("mouseenter", linkMouseenterHandler, { passive: true });
		a.addEventListener("mouseleave", linkMouseleaveHandler, { passive: true });
		
		a.addEventListener("mousemove", linkMousemoveHandler, { passive: true });
	});

	document.querySelectorAll("p").forEach(p => {
		p.addEventListener("mouseover", textMouseoverHandler, { passive: true });
		p.addEventListener("mouseout", textMouseoutHandler, { passive: true });
	});

	logger.log("Started handling cursor!");
}

function stopHandling() {
	if (!cursor) return logger.error("No elements with id \"cursor\" found!");
	
	const style = document.getElementById("cursorStyle");
	style.remove();

	document.removeEventListener("mousedown", mousedownHandler);
	document.removeEventListener("mouseup", mouseupHandler);
	document.removeEventListener("mousemove", mousemoveHandler);

	document.querySelectorAll("a").forEach(a => {
		a.style.cursor = "pointer"
		a.removeEventListener("mouseenter", linkMouseenterHandler, { passive: true });
		a.removeEventListener("mouseleave", linkMouseleaveHandler, { passive: true });
		
		a.removeEventListener("mousemove", linkMousemoveHandler, { passive: true });
	});

	document.querySelectorAll("p").forEach(p => {
		p.removeEventListener("mouseover", textMouseoverHandler, { passive: true });
		p.removeEventListener("mouseout", textMouseoutHandler, { passive: true });
	});

	logger.log("Stopped handling cursor!");
}

export {startHandling, stopHandling};
