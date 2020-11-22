//----------------------------------Sett----------------------------------\\
const info = {
    build: "031120",
    version: 1
}

const dark = "#0a0a0a";
const light = "#fefefe";
const theme_default = "dark";
const debug_default = "0"; //Not true or false because localStorage cannot store boolean values
const language_default = "en-US";
const volume_default =  0.5;

//----------------------------------Core----------------------------------\\
let d = document;
let w = window;
let parser = new DOMParser


let debug = {
    enabled: null,
    initializate() {
        this.enabled = localStorage.getItem("debug");
        if ((this.enabled != "0") && (this.enabled != "1")) {
            this.set(debug_default);
        } else {
            this.set(this.enabled);
        }
    },
    set(arg) {
        this.enabled = arg;
        localStorage.setItem("debug", this.enabled);
        debug.log("Set debug to " + arg, "#00c800");
    },
    log(text, color, background) {
        if (this.enabled == "1") {
            console.log("%c "+text+" ", "color: "+color+"; background: "+background);
        }
    }
};

let theme = {
    current: null,
    ignore: ["/ss/"],
    initializate() {
        this.current = localStorage.getItem("theme");
        if ((this.current != "dark") && (this.current != "light")) {
            this.set(theme_default);
        } else {
            this.set(this.current);
        }
    },
    set(arg) {
        if (this.ignore.includes(w.location.pathname)) {
            debug.log("Cant set theme, this page in ignore list", "red")
        } else {
            this.current = arg
            switch (arg) {
                case "light":
                    d.documentElement.style.setProperty("--first-color", light);
                    d.documentElement.style.setProperty("--second-color", dark);
                    break;
            
                default:
                    d.documentElement.style.setProperty("--first-color", dark);
                    d.documentElement.style.setProperty("--second-color", light);
                    break;
            }
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

let anim = {
    show(element, interval, timeout) {
        setTimeout(() => {
            let op = 0;
            debug.log("Showing up "+element[0].id, "#226dc9");
            let timer = setInterval(() => {
                if (op >= 1){
                    clearInterval(timer);
                    debug.log("Showing up for "+element[0].id+" complete", "#00c800");
                }
                element.css("opacity", op);
                op+=0.01;
            }, interval/100);
        }, timeout)
    },
    title: {
        timer(ticks, time, timeout) {
            setTimeout(() => {
                let tick = time/ticks;
                let cur = ticks
                debug.log("Title counter started for "+ticks+" ticks every "+tick+"ms", "#226dc9");
                let timer = setInterval(() => {
                    if (cur <= 0) {
                        clearInterval(timer);
                        debug.log("Title counter complete", "#00c800");
                    }
                    d.title = cur;
                    cur--; 
                }, tick)
            },timeout)
        },
        anim(text, time, timeout) {
            setTimeout(() => {
                let tick = time/text.length;
                let cur = 0
                let title = ""
                debug.log("Title animation started for \""+text+"\" every "+tick+"ms", "#226dc9");
                let timer = setInterval (() => { //still hate "for (let v of text) {};"
                    if (cur >= text.length-1) {
                        clearInterval(timer);
                        debug.log("Title animation complete", "#00c800");
                    }
                    title = title + text[cur];
                    d.title = title;
                    cur++;
                }, tick)
            }, timeout)
        }
    }
}

let get = {
    json: async (url) => {
        let response = await fetch(url);
        if (response.ok) {
            let got = await response.json();
            return got;
          } else {
            console.error("ERROR "+url+" "+ response.status);
          }
    },
    text: async (url) => {
        let response = await fetch(url);
        if (response.ok) {
            let got = await response.text();
            return got;
          } else {
            console.error("ERROR "+url+" "+ response.status);
          }
    }
}


//----------------------------------Main----------------------------------\\
debug.initializate();
debug.log("Build "+info.build+"v"+info.version, "#fff","#000");

$(() => {
    debug.log("DOM loaded", "#fff","#000");
    theme.initializate();

    let script_check = async () => {
        let response = await fetch("page.js");
        return response.ok;
    }

    switch (w.location.pathname) {
        case "/":
            window.location.replace("/p/");
            break;

        case "/p/":
            anim.title.anim("Welcome",2200, 0)
            anim.show($("#c1"), 900, 0);
            anim.show($("#c2"), 900, 250);
            anim.show($("#c3"), 900, 500);
            $("#theme").click(() => {theme.change()});
            let img;
            debug.log("Point 1")
            get.text("https://www.sololearn.com/Profile/4746232").then((m) => {
                img = $(parser.parseFromString(m, "text/html")).find(".course img")
                for (let i = 0; i < 5; i++) {
                    $(".plangs").append($("<li></li>").html("<img src=\"/assets/icons/langs/"+img.eq(i).attr("alt")+".svg\" alt=\""+img.eq(i).attr("alt")+"\">"))
                }
            })
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
