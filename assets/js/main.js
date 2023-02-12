import Logger from "./modules/Logger.js";
import { isTouchDevice } from "./modules/Utils.js";
import { changeTheme } from "./modules/Theme.js";
import { runCanvas } from "./modules/Background.js";
import { startHandling } from "./modules/Cursor.js";


const logger = new Logger("Main");

const date = new Date()
sessionStorage.setItem("lastPage", location.pathname);

const font = document.createElement("link");
font.rel = "stylesheet";
font.href = "/assets/css/fonts/olejka.ru.css"; 
document.head.append(font);

const footer = document.querySelector("footer"),
	overlay = document.querySelector(".overlay");

footer.innerHTML = `&copy;Oleg Logvinov ${date.getFullYear()}`;

const removeOverlay = () => {
	if (overlay) {
		setTimeout(() => {
			document.body.classList.remove("onOverlay");
			overlay.classList.add("final");
			setTimeout(() => overlay.remove(), 350);
		}, 1000);
	}
}

window.onload = _ => {
	logger.log("Window loaded!");
	document.fonts.ready.then(() => {
		logger.log("All fonts are loaded!");
		if (!isTouchDevice()) startHandling();
		removeOverlay();
	})
}

runCanvas(date.getMonth() < 2 || date.getMonth() == 11);

window.changeTheme = changeTheme;