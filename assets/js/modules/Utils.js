import Logger from "./Logger.js";
const logger = new Logger("Utils");

function ready(callback) {
	if (document.readyState != "loading") {
		logger.log("Document is already ready!");
		callback();
	} else document.addEventListener("DOMContentLoaded", () => {
		logger.log("DOMContentLoaded!");
		callback();
	});
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

export { ready, savePageData, getPageData };