import {} from "./modules/Theme.js";
import { isTouchDevice } from "./modules/Utils.js";
import { startHandling } from "./modules/Cursor.js";


const footer = document.querySelector("footer"), ref = document.querySelector("#ref");
const lastPage = sessionStorage.getItem("lastPage");

footer.innerHTML = `&copy;Oleg Logvinov ${new Date().getFullYear()}`;
if (lastPage) ref.href = lastPage;
else ref.remove();


if (!isTouchDevice()) startHandling();