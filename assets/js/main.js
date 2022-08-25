import Logger from "./modules/Logger.js";
import { savePageData, ready } from "./modules/Utils.js";
import { changeTheme } from "./modules/Theme.js";
import { runCanvas } from "./modules/Background.js";

const logger = new Logger("Main");
window.changeTheme = changeTheme;

const isLocalhost = ["127.0.0.1", "localhost"].includes(location.hostname);
logger.log("Localhost = "+isLocalhost);

if (isLocalhost) document.title=`"${document.title}" Dev`;
sessionStorage.setItem("lastPage", location.pathname)

const font = document.createElement("link");
font.rel = "stylesheet";
font.href = `/assets/css/fonts/${isLocalhost ? "localhost" : "olejka.ru"}.css`; 
document.head.append(font);


const footer = document.querySelector("footer"), overlay = document.querySelector(".overlay");
ready(_ => {
    footer.innerHTML = `&copy;Oleg Logvinov ${new Date().getFullYear()}`;
    
	window.onload = _ => {
		if (overlay) {
			setTimeout(_ => {
				overlay.classList.add("final");
				setTimeout(_ => {
					document.body.classList.remove("freezed");
					overlay.remove();
				}, 350)
			}, 1000)
		}
    }

	if (location.pathname === "/") runCanvas();
});