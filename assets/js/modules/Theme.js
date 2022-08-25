import Logger from "./Logger.js";
import { getPageData, savePageData } from "./Utils.js";
const logger = new Logger("Theme");

const ignrePaths = ["ss"];

const preferDark = window.matchMedia("(prefers-color-scheme: dark)");

let autoDark = getPageData("autoDark");
let theme = getPageData("theme");

function setAutoDark(bool_like) {
	autoDark = !!bool_like;
	savePageData("autoDark", autoDark);
	logger.log(`${autoDark ? "Enabled" : "Disabled"} automatic detection!`);
}

function setTheme(newTheme) {
	if (ignrePaths.includes(location.pathname)) return logger.warn("Can't change theme on this page!");

	document.body.classList.remove(theme);

	theme = newTheme;
	document.body.classList.add(theme);
	document.querySelector(`meta[name="theme-color"]`).setAttribute("content",  getComputedStyle(document.body).getPropertyValue(`--${theme}-first`));

	savePageData("theme", theme);
	logger.log(`Theme changed to ${theme}!`);
}

const getTheme = _ => theme;

const setThemeAsUser = _ => setTheme(preferDark.matches ? "dark" : "light");
const changeTheme = _ => setTheme(theme !== "dark" ? "dark" : "light")


if (typeof autoDark === "undefined") setAutoDark(true);
preferDark.onchange = _ => autoDark && setThemeAsUser();

if (["dark", "light"].includes(theme)) {
	autoDark ? setThemeAsUser() : setTheme(theme);
} else {
	setThemeAsUser();
}

export {setAutoDark, setTheme, getTheme, changeTheme};