import Logger from "./modules/Logger.js";
import { ready } from "./modules/Utils.js";
import { changeTheme } from "./modules/Theme.js";

const logger = new Logger("Main");
window.changeTheme = changeTheme;

const isLocalhost = ["127.0.0.1", "localhost"].includes(location.hostname);
logger.log("Localhost = "+isLocalhost);

const font = document.createElement("link");
font.rel = "stylesheet";
font.href = `/assets/css/fonts/${isLocalhost ? "localhost" : "olejka.ru"}.css`; 
document.head.append(font);


const footer = document.querySelector("footer"), ref = document.querySelector("#ref");
const lastPage = sessionStorage.getItem("lastPage");
ready(_ => {
    footer.innerHTML = `&copy;Oleg Logvinov ${new Date().getFullYear()}`;
    if (lastPage) ref.onclick = _=>{location.replace(lastPage)}
    else ref.remove();
});