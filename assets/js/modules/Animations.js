// Imports
import Logger from './Logger.js';
// Constants Variables
const logger = new Logger('JS Animations');
// Functions
const textBrute = (id, text, time) => {
	const tick = time/text.length;
	const element = document.getElementById(id);
	const chars = '@#$%&/\\|;';

	let string = '';
	let i = 0;

	const render = _ => {
		if (i < text.length) {
			string += text[i];
			element.textContent = string + chars[Math.floor(Math.random() * chars.length)];
			i === text.length-1 && (element.innerHTML = string);
			i++;
		} else return
		setTimeout(render, tick);
	};

	render();
};

const titleTimer = _ => {
	setTimeout(_ => {
		const tick = time/ticks;
		let cur = ticks;

		logger.log(`Title counter started for ${tick} ticks every ${tick}ms`);
		let timer = setInterval(_ => {
			if (cur <= 0) {
				clearInterval(timer);
				logger.log('Title counter complete');
			};

			document.title = cur;
			cur--;
		}, tick);
	}, timeout);
};

const titleFill = _ => {
	setTimeout(_ => {
		const tick = time/text.length;

		let cur = 0
		let title = '';
		
		logger.log(`Title animation started for '${text}' every ${tick}ms`);
		let timer = setInterval (_ => {
			if (cur >= text.length - 1) {
				clearInterval(timer);
				logger.log('Title animation complete');
			};

			title = title + text[cur];
			document.title = title;
			cur++;
		}, tick);
	}, timeout);
};

export { textBrute, titleFill, titleTimer };