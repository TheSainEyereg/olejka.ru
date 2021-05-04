//----------------------------------Sett----------------------------------\\
const info = {
    build: '080421',
    version: 1
}

const theme_default = 'dark';
const debug_default = '0'; //Not true or false because localStorage cannot store boolean values
const debug_time = true;
const language_default = 'en-US';
const volume_default =  0.5;
const vk_api_key = '4d58f9724d58f9724d58f972444d2dea3144d584d58f97212e299cd9421c7e39101d599'; //I dont really care about it (Its SERVICE key for getting my VK profile pic)
const vk_api_ver = 5.124;

//----------------------------------Core----------------------------------\\
let d = document;
let w = window;

let debug = {
    enabled: null,
    initializate() {
        this.enabled = localStorage.getItem('debug');
        if ((this.enabled != '0') && (this.enabled != '1')) {
            this.set(debug_default);
        } else {
            this.set(this.enabled);
        }
    },
    set(arg) {
        this.enabled = arg;
        localStorage.setItem('debug', this.enabled);
        debug.log('Set debug to ' + arg, '#00c800');
    },
    log(text, color, background) {
        if (this.enabled == '1') {
            if (!debug_time) {
                console.log('%c '+text+' ', 'color: '+color+'; background: '+background);
            } else {
                let date = new Date;
                console.log('['+date.getMinutes()+':'+date.getSeconds()+':'+date.getMilliseconds()+']:'+'%c '+text+' ', 'color: '+color+'; background: '+background);
            }
        }
    }
};

let theme = {
    current: null,
    user: window.matchMedia('(prefers-color-scheme: dark)'),
    ignore: ['/ss/'],
    initializate() {
        const usercheck = _ => {
            if (theme.user.matches) {
                this.set('dark')
            } else {
                this.set('light')
            }
        }
        this.current = localStorage.getItem('theme');
        if ((this.current != 'dark') && (this.current != 'light')) {
            usercheck()
        } else {
            this.set(this.current);
        }
        this.user.onchange = () => {usercheck()}
    },
    set(arg) {
        if (this.ignore.includes(w.location.pathname)) {
            debug.log('Cant set theme, this page in ignore list', 'red')
        } else {
            this.current = arg
            switch (arg) {
                case 'light':
                    $('body').css('--first-color', 'var(--light)');
                    $('body').css('--second-color', 'var(--dark)');
                    break;

                default:
                    $('body').css('--first-color', 'var(--dark)');
                    $('body').css('--second-color', 'var(--light)');
                    break;
            }
            localStorage.setItem('theme', this.current);
            debug.log('Set theme to ' + arg, '#00c800');
        }
    },
    change() {
        switch (this.current) {
            case 'light':
                this.set('dark');
                break;

            default:
                this.set('light');
                break;
        }
    }
};

let anim = {
    show(element, interval, timeout) {
        setTimeout(() => {
            let op = 0;
            debug.log('Showing up '+element[0].id, '#226dc9');
            let timer = setInterval(() => {
                if (op >= 1){
                    clearInterval(timer);
                    debug.log('Showing up for '+element[0].id+' complete', '#00c800');
                }
                element.css('opacity', op);
                op+=0.01;
            }, interval/100);
        }, timeout)
    },
    title: {
        timer(ticks, time, timeout) {
            setTimeout(() => {
                let tick = time/ticks;
                let cur = ticks
                debug.log('Title counter started for '+ticks+' ticks every '+tick+'ms', '#226dc9');
                let timer = setInterval(() => {
                    if (cur <= 0) {
                        clearInterval(timer);
                        debug.log('Title counter complete', '#00c800');
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
                let title = ''
                debug.log('Title animation started for \''+text+'\' every '+tick+'ms', '#226dc9');
                let timer = setInterval (() => { //still hate 'for (let v of text) {};'
                    if (cur >= text.length-1) {
                        clearInterval(timer);
                        debug.log('Title animation complete', '#00c800');
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
            debug.log('Got JSON from '+url+' ('+response.status+')')
            return got;
          } else {
            console.error('ERROR '+url+' '+ response.status);
          }
    },
    text: async (url) => {
        let response = await fetch(url);
        if (response.ok) {
            let got = await response.text();
            debug.log('Got text from '+url+' ('+response.status+')')
            return got;
          } else {
            console.error('ERROR '+url+' '+ response.status);
          }
    }
}

let data = {
    data: null,
    get(url, key) {
        debug.log('Sent JSON request \''+url+'\'');
        get.json(url).then((m) => {this.data = m; if (key!=undefined) {this.save(key)}})
    },
    save(key) {sessionStorage.setItem(key, JSON.stringify(this.data))},
    load(key) {this.data = JSON.parse(sessionStorage.getItem(key))},
    del(key) {sessionStorage.removeItem(key)},
    vk: {
        get(url, func) {
            this.send(url);
            if (func != undefined) {
                this.func = func;
            } else {this.func = () => {debug.log('No function for that request')}}
        },
        send(url) {
            debug.log('Sent VK request \''+url+'\'');
            $('head').append($('<script id=\'TEMP\' type=\'text/javascript\'></script>').attr('src', url+'&access_token='+vk_api_key+'&v='+vk_api_ver+'&callback=data.vk.catch'));
        },
        catch(ansv) {
            debug.log('Cached VK answer:\n'+JSON.stringify(ansv.response[0]));
            data.data = ansv.response[0];
            this.got=true;
            $('#TEMP').remove();
            this.func();
        }
    }
}

//----------------------------------Main----------------------------------\\
debug.initializate();
debug.log('Build '+info.build+'v'+info.version, '#fff','#000');

$(() => {
    debug.log('DOM loaded', '#fff','#000');
    theme.initializate();
    data.get('https://api.bigdatacloud.net/data/client-info', 'data')

    let script_check = async () => {
        let response = await fetch('page.js');
        return response.ok;
    }
    switch (w.location.pathname) {
        case '/':
            anim.title.anim("Welcome",2200, 0)
            anim.show($("#c1"), 900, 0);
            anim.show($("#c2"), 900, 250);
            anim.show($("#c3"), 900, 500);
            $("#theme")[0].addEventListener("click", () => {theme.change()});
            break;

        case '/p/':
            window.location.replace('/');
            break;

        default:
            if (script_check) {
                debug.log('Found page.js script for this page', '#fff','#000');
            } else {
                debug.log('Script for this page is not described', '#fff','#000');
            }
            break;
        }
})