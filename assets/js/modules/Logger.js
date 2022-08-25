class Logger {
	constructor(name) {
		this.name = name;
		this.logs = [];
	}

	log(message, save = true) {
		if (save) this.logs.push(message);
		console.log(`%c[${this.name}]`, "background: #4266f5; color: #fff", message);
	}

	warn(message, save = true) {
		if (save) this.logs.push(message);
		console.warn(`%c[${this.name}]`, "background: #f5a642; color: #fff", message);
	}

	error(message, save = true) {
		if (save) this.logs.push(message);
		console.error(`%c[${this.name}]`, "background: #f54242; color: #fff", message);
	}
}

export default Logger;