//----------------------------------Sett----------------------------------\\
const info = {
    build: "220621",
    version: 2
}

const theme_auto = true;
const debug_default = false;
const debug_time = true;
//----------------------------------Core----------------------------------\\
const el = document.querySelector.bind(document);
function ready(callback) {
    document.addEventListener("DOMContentLoaded", _=> {
        debug.log("DOM loaded", "#fff","#000");
        if (typeof callback != "undefined") callback();
        theme.initializate();
    });
}

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
    ignore: ["/ss/"],
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
        debug.log("Set auto theme to " + this.auto, "#00c800");
    },
    set(arg) {
        if (this.ignore.includes(window.location.pathname)) {
            debug.log("Cant set theme, this page in ignore list", "red");
        } else {
            document.body.classList.remove(this.current);
            this.current = arg;
            document.body.classList.add(this.current);
            document.querySelector(`meta[name="theme-color"]`).setAttribute("content",  getComputedStyle(document.body).getPropertyValue(`--${this.current}-first`));
            localStorage.setItem("theme", this.current);
            debug.log("Set theme to " + arg, "#00c800");
        }
    },
    change() {
        switch (this.current) {
            case "light":
                this.set("dark");
                break;

            default:
                this.set("light");
                break;
        }
    }
};

const anim = {
    text: {
        anim(id, text, time) {
            const tick = time/text.length;
            const element = document.getElementById(id);
            const chars = "@#$%&/\\|;";
            let string ="";
            let i = 0;
            function render() {
                if (i < text.length) {
                    string+=text[i];
                    element.innerHTML = string+chars[Math.floor(Math.random()*chars.length)];
                    if (i==text.length-1) element.innerHTML = string;
                    i++;
                } else return
                setTimeout(render, tick);
            }
            render();
        }
    },
    title: {
        timer(ticks, time, timeout) {
            setTimeout(() => {
                const tick = time/ticks;
                let cur = ticks;
                debug.log(`Title counter started for ${tick} ticks every ${tick}ms`, "#226dc9");
                let timer = setInterval(() => {
                    if (cur <= 0) {
                        clearInterval(timer);
                        debug.log("Title counter complete", "#00c800");
                    }
                    document.title = cur;
                    cur--
                }, tick);
            },timeout);
        },
        anim(text, time, timeout) {
            setTimeout(() => {
                const tick = time/text.length;
                let cur = 0
                let title = ""
                debug.log(`Title animation started for "${text}" every ${tick}ms`, "#226dc9");
                let timer = setInterval (() => { //still hate "for (let v of text) {};"
                    if (cur >= text.length-1) {
                        clearInterval(timer);
                        debug.log("Title animation complete", "#00c800");
                    }
                    title = title + text[cur];
                    document.title = title;
                    cur++;
                }, tick)
            }, timeout)
        }
    }
}

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

//----------------------------------Main----------------------------------\\
debug.initializate();
debug.log(`Base build ${info.build}v${info.version}`, "#fff","#000");

ready(() => {
    data.get("https://api.bigdatacloud.net/data/client-info", undefined, "data")

    async function script_check() {
        let response = await fetch("page.js");
        return response.ok;
    }
    switch (window.location.pathname) {
        case "/":
            anim.title.anim("¯\\_(ツ)_/¯",2000, 0)
            break;

        case "/p/":
            window.location.replace("/");
            break;

        default:
            if (script_check) {
                debug.log("Found page.js script for this page", "#fff","#000");
            } else {
                debug.log("Script for this page is not described", "#fff","#000");
            }
            break;
        }
})