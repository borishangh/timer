const audio = new Audio('alarm.wav');
const timer_text = document.querySelector('.timer-text');

const hrs_div = document.querySelector('.hrs');
const min_div = document.querySelector('.min');
const sec_div = document.querySelector('.sec');

var time_str = ''
var counting = false;


window.addEventListener('keydown', (e) => {
    handle_input(e.key);
})

function handle_input(key) {
    if (counting) return;

    if (key == 'Backspace')
        time_str = time_str.slice(0, -1);

    else if (/[0-9]/.test(key) && time_str.length < 6)
        time_str += key;

    var time = ~~time_str;
    var sec = time % 100;
    var min = ~~(time / 100) % 100;
    var hrs = ~~(time / 100_00) % 100;

    if (key == 'Enter') {
        var time_in = init_time(hrs, min, sec);
        show_timer(time_in.hrs, time_in.min, time_in.sec);
        countdown();
    } else {
        show_timer(hrs, min, sec);
    }
}

function show_timer(hrs, min, sec) {
    hrs_div.innerHTML = format(hrs || 0);
    min_div.innerHTML = format(min || 0);
    sec_div.innerHTML = format(sec || 0);
    paint_cells();
}

function paint_cells() {
    var digits = Math.ceil(Math.log10(~~time_str + 1));

    digits > 4 ?
        hrs_div.classList.add('fill') :
        hrs_div.classList.remove('fill');
    digits > 2 ?
        min_div.classList.add('fill') :
        min_div.classList.remove('fill');
    digits > 0 ?
        sec_div.classList.add('fill') :
        sec_div.classList.remove('fill');
}

function init_time(hrs, min, sec) {
    min += ~~(sec / 60);
    hrs += ~~(min / 60);
    sec %= 60;
    min %= 60;

    time_str = (hrs * 100_00 + min * 100 + sec).toString();

    return { hrs, min, sec };
}


function countdown() {
    var seconds = get_seconds();
    var now = new Date().getTime();
    var target = new Date(now + seconds * 1000);

    var int = setInterval(() => {
        var now = new Date();
        var remaining = (target - now) / 1000;
        counting = true;


        window.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                time_str = '';
                document.title = 'timer';
                show_timer();
                clearInterval(int);
                audio.pause();
                audio.currentTime = 0;

                counting = false;
                return;
            }
        })

        if (remaining <= 1) {
            clearInterval(int);
            document.title = 'timer';
            audio.play();

            counting = false;
            return;
        }

        var time_in = init_time(0, 0, ~~remaining);
        show_timer(time_in.hrs, time_in.min, time_in.sec);

        document.title = display_time();
    }, 250);
}

const get_seconds = () =>
    ~~hrs_div.innerHTML * 3600 +
    ~~min_div.innerHTML * 60 +
    ~~sec_div.innerHTML;

const display_time = () => {
    if (~~hrs_div.innerHTML > 0)
        return ~~hrs_div.innerHTML + ':'
            + min_div.innerHTML + ':'
            + sec_div.innerHTML;
    else if (~~min_div.innerHTML > 0)
        return ~~+min_div.innerHTML + ':'
            + sec_div.innerHTML;
    else if (~~sec_div.innerHTML > 0)
        return ~~sec_div.innerHTML;
}

const format = (num) => num > 9 ? num : '0' + num;