// Imports
import {} from "./modules/Theme.js";
import { isTouchDevice } from "./modules/Utils.js";
import { startHandling } from "./modules/Cursor.js";
// Constants Variables
const footer = document.querySelector("footer"), ref = document.querySelector("#ref");
const lastPage = sessionStorage.getItem("lastPage");

footer.innerHTML = `© Oleg Logvinov ${new Date().getFullYear()}`;
lastPage ? ref.href = lastPage : ref.remove();
isTouchDevice() && startHandling();