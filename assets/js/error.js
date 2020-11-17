//----------------------------------Sett----------------------------------\\
const dark = "#0a0a0a"
const light = "#fefefe"
const theme_default = "dark"

//----------------------------------Core----------------------------------\\
let theme = {
    current: null,
    initializate() {
        theme.current = localStorage.getItem("theme");
        if ((this.current != "dark") && (this.current != "light")) {
            this.set(theme_default);
        } else {
            this.set(this.current);
        }
    },
    set(arg) {
        this.current = arg
        switch (arg) {
            case "light":
                document.documentElement.style.setProperty("--first-color", light);
                document.documentElement.style.setProperty("--second-color", dark);
                break;
        
            default:
                document.documentElement.style.setProperty("--first-color", dark);
                document.documentElement.style.setProperty("--second-color", light);
                break;
        }
        localStorage.setItem("theme", this.current);
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

//----------------------------------Main----------------------------------\\
theme.initializate();

