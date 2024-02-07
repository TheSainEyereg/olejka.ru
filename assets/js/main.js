import Logger from "./modules/Logger.js";
import { fontsLoaded, isTouchDevice } from "./modules/Utils.js";
import { changeTheme } from "./modules/Theme.js";
import { runCanvas } from "./modules/Background.js";
import { startHandling } from "./modules/Cursor.js";


const fonts = ["VK Sans Display", "Ubuntu", "my-icons"];


const logger = new Logger("Main");
const date = new Date()

sessionStorage.setItem("lastPage", location.pathname);

const
	footer = document.querySelector("footer"),
	overlay = document.querySelector(".overlay"),
	links = document.querySelector(".links"),
	canvas = document.querySelector("#dots");

footer.innerHTML = `&copy;Oleg Logvinov ${ date.getFullYear() }`;

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
	
	const ready = fontsLoaded(fonts);
	const social = fetch("https://api.olejka.ru/v3/social").then(res => res.json());

	ready.then(async () => {
		if (links) links.innerHTML = (await social).map(x => `<a class="ccircle" href="${x.url}" target="_blank"><i class="oi-${x.id}"></i></a>`).join(" ");

		removeOverlay();
		if (!isTouchDevice()) startHandling();
	})
}

if (canvas) runCanvas(canvas, date.getMonth() < 2 || date.getMonth() == 11);

window.changeTheme = changeTheme;