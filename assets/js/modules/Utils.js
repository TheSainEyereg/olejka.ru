import Logger from "./Logger.js";
const logger = new Logger("Utils");

async function ready() {
	return new Promise(res => {
		if (document.readyState != "loading") {
			logger.log("Document is already ready!");
			res();
		} else document.addEventListener("DOMContentLoaded", () => {
			logger.log("DOMContentLoaded!");
			res();
		});
	})
}

function fontsLoaded(fonts) {
	return new Promise(res => {
		const check = () => {
			let loaded = Array.from(document.fonts).map(x => x.family);
			loaded = loaded.filter((f, p) => loaded.indexOf(f) === p);
			if (fonts.every(f => loaded.includes(f))) {
				logger.log("All fonts are loaded!");
				res();
				return true;
			}

			setTimeout(check, 100);
		}
		
		check();
	})
}

function isTouchDevice() {
	return (("ontouchstart" in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0));
}

function savePageData(data_or_key, value) {
	if (!value) {
		localStorage.setItem("pageData", JSON.stringify(data_or_key));
		return data_or_key;
	}
	const pageData = getPageData() || {[data_or_key]: value};
	if (!pageData) {	
		localStorage.setItem("pageData", JSON.stringify(pageData));
		return pageData;
	}
	pageData[data_or_key] = value;
	localStorage.setItem("pageData", JSON.stringify(pageData));
	return pageData;
}

function getPageData(key) {
	try {
		if (key) return JSON.parse(localStorage.getItem("pageData"))[key];
		return JSON.parse(localStorage.getItem("pageData"));
	} catch (e) {
		return false;
	}
}

export { ready, fontsLoaded, isTouchDevice, savePageData, getPageData };