import Logger from "./Logger.js";
const logger = new Logger("JS Animations")


function textBrute(selector, text, time) {
	const delay = time / text.length;
	const element = document.querySelector(selector);
	const chars = "@#$%&/\\|;";
	let i = 0, string = "";
	function render() {
		if (++i <= text.length) {
			if (i === text.length) return element.textContent = string;
			string += text[i];
			element.textContent = string + chars[Math.floor(Math.random()*chars.length)];
			setTimeout(render, delay);
		}
	}
	render();
}

function titleFill(text, time) {
	const delay = time / text.length;
	let i = 0, title = ""
	logger.log(`Title animation started for "${text}" every ${delay}ms`);
	const timer = setInterval (() => {
		title = title + text[i];
		document.title = title;
		if (++i === text.length) {
			clearInterval(timer);
			logger.log("Title animation complete");
		}
	}, delay);
}

function titleCountdown(count, delay) {
	let i = count;
	logger.log(`Title countdown started for ${count} ticks every ${delay}ms`);
	let timer = setInterval(() => {
		document.title = i;
		if (--i < 0) {
			clearInterval(timer);
			logger.log("Title countdown complete");
		}
	}, delay);
}

export {textBrute, titleFill, titleCountdown};