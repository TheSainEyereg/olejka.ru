//----------------------------------Sett----------------------------------\\
const info = {
    build: "020721",
    version: 1
}

const debug_default = false;
const debug_time = true;
const theme_auto = true;

//----------------------------------Core----------------------------------\\
const el = document.querySelector.bind(document);
const debug = {
    enabled: null,
    initializate() {
        this.enabled = localStorage.getItem("debug") === "true";
        if (localStorage.getItem("debug")) {
            this.set(this.enabled);
        } else {
            this.set(debug_default);
        }
    },
    set(arg) { //true or false
        this.enabled = arg;
        localStorage.setItem("debug", this.enabled);
        debug.log(`Set debug to ${this.enabled}`, "#00c800");
    },
    log(text, color, background) {
        if (this.enabled) {
            let out = "";
            if (debug_time) {
                let date = new Date;
                out += `[${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}]:`;
            }
            out += `%c ${text} `;
            console.log(out, `color: ${color}; background: ${background}`);
        }
    }
};

const theme = {
    current: null,
    auto: true,
    user: window.matchMedia("(prefers-color-scheme: dark)"),
    ignore: ["ss"],
    initializate() {
        this.auto = localStorage.getItem("theme_auto") === "true";
        if (localStorage.getItem("theme_auto")) {
            this.autoset(this.auto);
        } else {
            this.autoset(theme_auto);
        }
        const usercheck = _ => {
            if (theme.user.matches) {
                this.set("dark");
            } else {
                this.set("light");
            }
        }
        this.current = localStorage.getItem("theme");
        if ((this.current != "dark") && (this.current != "light")) {
            usercheck();
        } else {
            if (this.auto) usercheck(); else this.set(this.current);
        }
        this.user.onchange = _ => {if (this.auto) usercheck()};
    },
    autoset(arg) { //true or false
        this.auto = arg;
        localStorage.setItem("theme_auto", this.auto);
        debug.log(`Set auto theme to ${this.auto}`, "#00c800");
    },
    set(arg) {
        if (this.ignore.includes(window.location.pathname)) {
            debug.log("Cant set theme, this page in ignore list", "red");
        } else {
            document.body.classList.remove(this.current);
            this.current = arg;
            document.body.classList.add(this.current);
            localStorage.setItem("theme", this.current);
            document.querySelector(`meta[name="theme-color"]`).setAttribute("content",  getComputedStyle(document.body).getPropertyValue(`--${this.current}-first`));
            debug.log(`Set theme to ${arg}`, "#00c800");
        }
    },
    change() {this.current == "light" ? this.set("dark") : this.set("light");}
};

const get = {
    json: async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            const got = await response.json();
            debug.log(`Got JSON from ${url} (${response.status})`);
            return got;
          } else {
            console.error(`JSON ERROR ${url} (${response.status})`);
          }
    },
    text: async (url) => {
        const response = await fetch(url);
        if (response.ok) {
            const got = await response.text();
            debug.log(`Got text from ${url} (${response.status})`);
            return got;
          } else {
            console.error(`Text ERROR ${url} (${response.status})`);
          }
    }
}

const data = {
    data: null,
    get(url, callback, key) {
        debug.log(`Sent JSON request "${url}"`);
        get.json(url).then((m) => {
            if (typeof callback != "undefined") callback(m);
            this.data = m;
            if (key!=undefined) {this.save(key)};
        })
    },
    save(key) {sessionStorage.setItem(key, JSON.stringify(this.data))},
    load(key) {this.data = JSON.parse(sessionStorage.getItem(key))},
    del(key) {sessionStorage.removeItem(key)},
    vk: {
        get(url, callback) {
            this.send(url);
            if (typeof callback != undefined) {
                this.callback = callback;
            } else {this.callback = () => {debug.log("No function for that request")}};
        },
        send(url) {
            const script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", `${url}&access_token=${vk_api_key}&v=${vk_api_ver}&callback=data.vk.catch`);
            script.id = "TEMP";
            document.head.append(script);
            debug.log(`Sent VK request "${url}"`);
        },
        catch(ansv) {
            debug.log(`Cached VK answer:\n${JSON.stringify(ansv.response[0])}`);
            data.data = ansv.response[0];
            document.getElementById("TEMP").remove();
            if (typeof this.callback != "undefined") this.callback();
        }
    }
}
function ready(callback) {
    document.addEventListener("DOMContentLoaded", _=> {
        debug.log("DOM loaded", "#fff","#000");
        theme.initializate();
        if (typeof callback != "undefined") callback();
    });
}


//----------------------------------Main----------------------------------\\
debug.initializate();
debug.log(`Build ${info.build}v${info.version}`, "#fff","#000");
ready();