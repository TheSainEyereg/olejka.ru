import Logger from "./modules/Logger.js";
import { fontsLoaded, isTouchDevice } from "./modules/Utils.js";
import { changeTheme } from "./modules/Theme.js";
import { runCanvas } from "./modules/Background.js";
import { startHandling } from "./modules/Cursor.js";


const fonts = ["VK Sans Display", "Ubuntu", "Font Awesome 6 Brands", "Font Awesome 6 Free"];


const logger = new Logger("Main");
const date = new Date()

sessionStorage.setItem("lastPage", location.pathname);

const footer = document.querySelector("footer"),
	overlay = document.querySelector(".overlay");

footer.innerHTML = `&copy;Oleg Logvinov ${date.getFullYear()}`;

const removeOverlay = () => {
	if (overlay) {
		setTimeout(() => {
			overlay.classList.add("final");
			setTimeout(() => overlay.remove(), 350);
		}, 1000);
	}
}

window.onload = _ => {
	logger.log("Window loaded!");
	document.body.classList.remove("onLoading");
	overlay.classList.add("animate");
	fontsLoaded(fonts).then(() => {
		removeOverlay();
		if (!isTouchDevice()) startHandling();
	})
}

const canvas = document.querySelector("#dots");
if (canvas) runCanvas(canvas, date.getMonth() < 2 || date.getMonth() == 11);


window.changeTheme = changeTheme;