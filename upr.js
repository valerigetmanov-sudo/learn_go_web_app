var rll = 0; // используется для обновления страницы
tekUpr = 0;  // текущее упражнение
var tslovo;  // текущее слово
var answerArray = [{ a: [] }, { a: [] }]; // массив ответов
var temp = [];
var ex = [];
var upr = [
[
//  упражнение 1
    { exver: "идти VS ехать", tnum : 1, ballgood: 16, balbad:10 ,intro: '#intro'  },              // заголовок упражнения и текущий номер и баллы
    { ex: "Сегодня Саша ________ в Петербург на поезде."                , ans: ["едет", "идёт"] },
    { ex: "Вечером мы ________ в кино. "                                , ans: ["идём", "едем"] },
    { ex: "Мария ________ на машине в аэропорт. "                       , ans: ["едет", "идёт"] },
    { ex: "Я ________ в университет на велосипеде. "                    , ans: ["еду", "иду"] },
    { ex: "Летом мы ________ на Байкал."                                , ans: ["едем", "идём"] },
    { ex: "Виктор ________ пешком в библиотеку."                        , ans: ["идёт", "едет"] },
    { ex: "Мои друзья ________ на поезде в Суздаль."                    , ans: ["едут", "идут"] },
    { ex: "Куда ты едешь? Я ________ в Пекин."                          , ans: ["еду", "иду"] },
    { ex: "Наша группа в субботу ________ на экскурсию в Новгород"      , ans: ["едет ", "идет"] },
    { ex: "Ли Ян ________ на вокзал на такси."                          , ans: ["едет", "идёт"] },
    { ex: "Ты ________ в общежитие на трамвае."                         , ans: ["едешь", "идёшь"] },
    { ex: "Завтра дети ________ в зоопарк."                             , ans: ["идут", "едут"] },
    { ex: "Друзья ________ на машине на дачу"                           , ans: ["едут ", "идут" ] },
    { ex: "Виктор сейчас ________ в столовую. "                         , ans: ["идет ", "едет"] },
    { ex: "Мария ________ в библиотеку на троллейбусе. "                , ans: ["едет ", "идёт"] },
    { ex: "Мы ________ в музей на выставку. "                           , ans: ["идём", "едем"] },
    { ex: "Куда ты идёшь? Я ________ домой."                            , ans: ["иду", "еду"] },
    { ex: "Ван Лин ________ на велосипеде в парк."                      , ans: ["едет", "идёт"] },
    { ex: "Иван и Мария________на работу на автобусе. "                 , ans: ["едут", "идут"] },
    { ex: "Я ________ в институт на метро."                             , ans: ["еду", "иду"] }
],
[
// упражнение 2
    { exver: "ходить VS идти", tnum: 1, ballgood: 12, balbad: 5, intro: '#intro2' },
    { ex: "Я ________ в университет каждый день."                   , ans: ["хожу", "иду"] },
    { ex: "Антон сейчас ________ в библиотеку"                      , ans: ["идёт", "ходит"] },
    { ex: "Ты любишь ________ пешком? "                             , ans: ["ходить", "идти"] },
    { ex: "Мария часто ________ в спортзал."                        , ans: ["ходит", "идёт"] },
    { ex: "Сегодня вечером мы ________ в театр."                    , ans: ["идём", "ходим"] },
    { ex: "Кто сегодня ________ на экскурсию?"                      , ans: ["идёт", "ходит"] },
    { ex: "Сегодня я иду в библиотеку утром, но я обычно ________ туда днём.", ans: ["хожу", "иду"] },
    { ex: "Когда я ________ на работу, я всегда покупаю газету."        , ans: ["иду", "хожу"] },
    { ex: "Ребенок еще не ________ ."                               , ans: ["ходит", "идёт"] },
    { ex: "Анна каждый день________в институт."                        , ans: ["ходит", "идёт"] },
    { ex: "Сегодня вечером мы ________ в кино."                    , ans: ["идём", "ходим"] },
    { ex: "Иван редко ________ в кафе."                                , ans: ["ходит ", " идёт "] },
    { ex: "Летом я часто ________ на экскурсии."                   , ans: ["хожу", "иду"] },
    { ex: "Сегодня днём Андрей ________ на стадион."               , ans: ["идёт", "ходит"] },
    { ex: "Мне нравится ________ пешком."                          , ans: ["ходить", "идти"] },
    { ex: "Мы часто ________ на экскурсии."                        , ans: ["ходим", "идём"] }
],
[  
// упражнение 3  
{ exver: "ходить VS идти / ехать VS ездить", tnum: 1, ballgood: 12, balbad: 5, intro: '#intro' },
{ ex: "Каждое лето  мы ________ на море."                           , ans: ["ездим ", "ходим ", "идём ", "едем"] },
{ ex: "Ты вчера ________ в банк?"                                   , ans: ["ходил ", "шёл ", "ездил ", "ехал"] },
{ ex: "Куда ты ________ cегодня вечером?"                           , ans: ["идёшь ", "ходишь ", "едешь ", "ездишь"] },
{ ex: "Каждое утро я ________ в университет на трамвае."            , ans: ["езжу ", "иду ", "еду ", "хожу"] },
{ ex: "Вчера, когда я ________ пешком в университет, я встретил Машу" , ans: ["шёл ", "ехал ", "ездил ", "ходил"] },
{ ex: "Смотри!  Наконец-то ________ наш троллейбус!"                , ans: ["идёт ", "едет ", "ездит ", "ходит"] },
{ ex: "Каждый день я ________ на работу на машине."                 , ans: ["езжу ", "еду ", "хожу ", "иду"] },
{ ex: "В воскресенье мне не надо ________ на работу."               , ans: ["ходить ", "ехать ", "идти ", "ездить"] },
{ ex: "Завтра наша группа ________ в Эрмитаж."                      , ans: ["идёт ", "едет ", "ездит ", "ходит"] },
{ ex: "Антон заболел. Поэтому вчера он не ________ в университет." , ans: ["ходил ", "шёл ", "ездил ", "ехал"] },
{ ex: "Каждое лето мы ________ в Крым."                            , ans: ["ездим ", "идём ", "едем ", "ходим"] },
{ ex: "Ван Ли  на каникулах ________ в Пекин."                     , ans: ["ездила ", "ходила ", "шла ", "ехала"] },
{ ex: "Все лето Иван ________ в спортзал."                         , ans: ["ходил ", "ездил ", "шёл ", "ехал"] },
{ ex: "В пятницу Мария ________ на вечеринку."                     , ans: ["идёт ", "ходит ", "едет ", "ездит"] },
{ ex: "Вчера Максим ________ на футбол."                           , ans: ["ходил ", "шёл ", "ездил ", "ехал"] },
{ ex: "По вечерам я ________ в спортзал."                          , ans: ["хожу ", "иду ", "еду ", "езжу"] }
],
[
  { exver: "Exam", tnum: 1, ballgood: 16, balbad: 10, intro: '#intro4' }
]
];

$(document).ready(function () {
 
    var mm = $('#mmenu')
   
    i = 0; j = 0;
    var g = 0;
    $.each(upr, function () {
        i++;
        tup = this; // console.log(tup);
         var tempex = [];
        $.each(tup, function () {
            if (this.ans != null) { temp[g] = this;  g++ };
        })
    });
     var impa = getRandomIntAr(0, 42);
     for (i = 0; i <= 100; i++) answerArray[i] = { a: [] };
    console.log(impa);
    i = 1;
   // $.each(impa, function () {  upr[3][i] = temp[this]; i++; })
   // console.log(upr[3]);
    
    //$.each(mm, function () {
    //    console.log(this);

    //});
    
});


function createMenu()
{
    $('#mms').html('');
    $('#mms').append("<ul id='menuz' data-role='listview'>");
    cnt = 1;
    str0 = "<li><span class='cnt'></span><span  onclick=$.mobile.changePage('#help') class='mmel'> Verbs of motion </span> </li>";
    $('#mms ul').append(str0);
    $.each(upr, function () {
        if (cnt < 10)
        str1 = "<li  onclick='getupr(" + cnt + ")'> <span class='cnt'>" + cnt + "</span><span class='mmel'> " + this[0].exver + " </span> </li>";
        else
        str1 = "<li  onclick='getupr(" + cnt + ")'> <span class='cnt10'>" + cnt + "</span><span class='mmel'> " + this[0].exver + " </span> </li>";

        $('#mms ul').append(str1); cnt++;
        
    });
    $('#mms').append("</ul>");
}

function repairmenu() {
    $('#menuz').addClass("ui-listview");
    var a = $('#menuz').children();
    $('#menuz').children().addClass("ui-li-static ui-body-inherit"); //ui-first-child
    $(a[0]).addClass("ui-li-static ui-body-inherit ui-first-child");
}

// подготоавливаем тек упр
function getupr(num) {
    
    tekUpr = num - 1;
    var tu = upr[tekUpr];
    createUpr();
    if (tekUpr != 100)   // если не равно экзамен
        if (tu[0].intro == "serv") {
            $("#servintro").html(tu[0].introtxt);
            $("#headservintro").html(tu[0].exver);
            $.mobile.changePage("#introserv");
        }
        else
            $.mobile.changePage(tu[0].intro);
    else $.mobile.changePage('#uprpage');

    console.log("создать упражнение" + tekUpr);
}

function get2up() {
    $.mobile.changePage('#uprpage');
}

function getintro() {
    var tu = upr[tekUpr];
    if (tu[0].intro == "serv") {
        $.mobile.changePage("#introserv");
    }
    else  $.mobile.changePage( tu[0].intro);
}

// создаем упражнение под номером numberUpr
function createUpr() {
    console.log('create Upr ');
    $('.lbut').hide();
    var buts = $('.lbut');
    var tu = upr[tekUpr];
    var snum = tu[0].tnum;
    $('#headupr').text(tu[0].exver);
    $('#nmu').text(tu[0].exver);
    //console.log(snum);
    $('#textupr').text(tu[snum].ex);

    var ansv = sort(newar(tu[snum].ans));

    console.log(tu[snum].ans); console.log(ansv);
    for (i = 0; i < ansv.length; i++) {
        $(buts[i]).text(ansv[i]).show();
            // бар ответов упражнения
           createBar();
    }
}

function createBar() {
    var tu = upr[tekUpr];
    var snum = tu[0].tnum;
    var sz = mylength(tu) - 1;
    console.log('d - ' + snum);
    var countstr = snum + '/' + sz;

    $(".upr_cnt").css({ "font-size": "4vh" }).text(countstr);

    $('.bar_1').html(' '); $('.bar_2').html(' '); $('.bar_3').html(' ');

    for (l = 0; l < sz; l++) {
        var tt = answerArray[tekUpr].a[l + 1]; // было var  tt = answerArray[tekUpr].a[l+1];

        if (tt == null) color = 'gray';
        if (tt == 1) color = 'green';
        if (tt == 2) color = 'brown';
        if (l == snum - 1) color = '#457ab1';
       // console.log(' sz - ', sz);
        var lp2 =  sz / 3;
        var lp3 = 2 * sz / 3;
       // console.log('lp2 - ', lp2, 'lp3 - ', lp3);
        if (sz < 30) {
            if (l < (sz / 2)) 
                $('.bar_1').append("<div class='lr' style=' background-color:" + color + "'> </div>");
            else $('.bar_2').append("<div class='lr'  style=' background-color:" + color + "'> </div>");
        }
        else {
            if (l < (lp2))
                $('.bar_1').append("<div class='lr' style=' background-color:" + color + "'> </div>");
           
            if (l < lp3 & l >= lp2)
                $('.bar_2').append("<div class='lr'  style=' background-color:" + color + "'>  </div>");

            if (l >= lp3 )
                $('.bar_3').append("<div class='lr'  style=' background-color:" + color + "'>  </div>");
        }
    }

}

// проверка слова на нажатой кнопке и ее проверка с правильным словом
function butv(ok) {
    var world = $(ok).text()
    tslovo = world;
    var tu = upr[tekUpr];
    var snum = tu[0].tnum;
    var prworld = tu[snum].ans[0];

    if (world == prworld) {
        answerArray[tekUpr].a[snum] = 1;
        createAnswer(true);
        console.log(world + ' = ' + prworld);
           
    }
    else {
        answerArray[tekUpr].a[snum] = 2;
        createAnswer(false);
        console.log(world + ' != ' + prworld);
    }
}

    function rlp(s100) {
        if (rll == 0) { rll++; $.mobile.changePage(s100); } //location.reload(); }
    }

    // функция формирует страничку ответа при нажатии кнопки
    function createAnswer(bool) {
        var tu = upr[tekUpr];
        var te = tu[0].tnum;
        $('#coolhead').text(tu[0].exver);
        $.mobile.changePage('#cool');

        if (bool == true) {
            $("#answH").css({ "color": "#9bbb59" }).text(rndtxtcool());
            var sprstr = "<b style = 'color:#9bbb59;' >" + tu[te].ans[0] + "</b>";
            var str = tu[te].ex.replace('________', sprstr);
            $("#answPar").html(str).css({ 'background-color': '#e0ffec' });
            $("#answPar2").html(' ').css({ 'background-color': '#f9f9f9' });
            console.log('правильное слово', tu[te].ans[0]);
        }
        if (bool == false) {
            $("#answH").css({ "color": "brown" }).text("Неверно");
            var sprstr = "<b style = 'color:brown' >" + tslovo + "</b>"; // здесь ошибка
                        var str = tu[te].ex.replace('________', sprstr);
            $("#answPar").html(str).css({ 'background-color': '#ffe5e5' });

            var sprstr1 = "<b style = 'color:#9bbb59;' >" + tu[te].ans[0] + "</b>";
            var str1 = tu[te].ex.replace('________', sprstr1);
            $("#answPar2").html(str1).css({ 'background-color': '#e0ffec' });
            console.log('правильное слово', tu[te].ans[0]);
            console.log('tslovo', tslovo);
        }
    }

    function rndtxtcool() {
        var racool = ['Отлично!', 'Молодец!', 'Верно!'];
        return racool[rnd(0, 2)];
    }
    function rndtxtwrong() {
        var rawrong = [ 'Неверно'];
        
        return rawrong[rnd(0, 1)];
    }

// переход на след упражнение
    function nextUprS() {
        
        tu = upr[tekUpr];
        tn = tu[0].tnum;
        bl1 = tu[0].ballgood;
        bl2 = tu[0].ballbad;
        size = mylength(tu) - 1;
        $(".lbut").css({ "line-height": "40px" });

        if (tn < size) { upr[tekUpr][0].tnum++; console.log(tn); $.mobile.changePage('#uprpage'); createUpr(); }
        else {
            console.log('конец упражнения');
            var gl = 0; // подсчет количества положительных оценок
            $.each(answerArray[tekUpr].a, function () {
                if (this == 1) gl++;
            });
            $('.goalcnt').text(gl + '/' + size);
            if (gl >= bl1) {$.mobile.changePage('#goalgood'); obnull();}
            else if (gl >= 5) $.mobile.changePage('#goalbad');
            else { $.mobile.changePage('#goalverybad'); obnull();}
        }
}
function repeatUpr()
{
    tu = upr[tekUpr];
    answerArray[tekUpr] = { a: [] };
    tu[0].tnum = 1;
    $.mobile.changePage('#uprpage'); createUpr();
}

function obnull() {
    tu = upr[tekUpr];
    answerArray[tekUpr] = { a: [] };
    tu[0].tnum = 1;
}

// формирует екзамен из серверных данных и вставляет его в главный массив упражнений
// ex массив содержит данные из 
function examinsert() {
    var tl = [];
    if (ex.length > 0) 
        for (ii = 0; ii < ex.length; ii++) {
            var t = { exver: "Exam", tnum: 1, ballgood: 24, balbad: 15, intro: '#intro4' }
            var ta = [];
            var tb = [];

            if (ii == 0)  zzindex = 0;  // сдвиг номеров экзамена
            else zzindex = 1;

            var u1c = parseInt(ex[ii].u1) - 1 + ii;  //+ zzindex;;  // екзаменуемый номер 1-го упр
            var u2c = parseInt(ex[ii].u2) - 1 + ii; //+ zzindex;;  // екзаменуемый номер 2-го упр
            var u3c = parseInt(ex[ii].u3) - 1 + ii;  // екзаменуемый номер 3-го упр
            var upos = parseInt(ex[ii].uprnum) + ii;  // после какого упражнения стоит

           // console.log('i - ' + ii, mylength(upr[u1c]), mylength(upr[u2c]), mylength(upr[u3c]));
            console.log('j - ' + upos, u1c, u2c, u3c);

            for (j = 1; j < mylength(upr[u1c]) ; j++)
            {
                ta.push(upr[u1c][j]);
            }

            for (j = 1; j < mylength(upr[u2c]) ; j++) {
                ta.push(upr[u2c][j]);
            }

            for (j = 1; j < mylength(upr[u3c]) ; j++) {
                ta.push(upr[u3c][j]);
            }

            var randar = getRandomIntAr(0, ta.length-1);
           // console.log(randar);
            for (j = 1; j < randar.length ; j++) {
                   
                tb.push(ta[randar[j]]);
            }

            tb[0] = t;
            b = parseInt(upos) + zzindex;
            console.log(b);
            upr.splice(upos , 0, tb);

            tl.push(tb);
        }
    return tl;
}


// функции общего назначения

// создает рандомный массив с уникальными значениями в промежутке  min , max
function getRandomIntAr(min, max) {
    var tempar = [];
    var t = 0; i = 1;
    tempar[0] = rnd(min, max);

    while (i < 32) {  // кво упражнений
        t = rnd(min, max);
        // console.log(t);
        if (!inArray(t, tempar)) { tempar[i] = t; i++; }
    }
    return tempar;
}

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function inArray(t, array) {
    //  console.log(' inArray (',t,') : - ', array );
    for (i = 0; i < array.length; i++) {

        if (t == array[i]) {
            //       console.log('inArray log : сопадение есть ');
            return true;
        }
    }
    // console.log('inArray log : совпадение не найдено ');
    return false;
}


// размешивает массив из n элементов
function sort(array) {
    n = array.length;
    for (i = 0 ; i < n ; i++) {
        t = rnd(0, n - 1);
        b = array[i]; array[i] = array[t]; array[t] = b;
    }
    return array;
}
// размешивает массив из n элементов m раз
function sortn(array,nraz) {
    n = array.length;
    for (mi = 0; mi < nraz; mi++)
    for (i = 0 ; i < n ; i++) {
        t = rnd(0, n - 1);
        b = array[i]; array[i] = array[t]; array[t] = b;
    }
    return array;
}
// создает копию массива array и возвращает  ее
function newar(array) {
    var na = new Array(array.length)
    n = array.length;
    for (i = 0 ; i < n ; i++) {
        na[i] = array[i];
    }
    return na;
}


function getserve() {
    // получить внутренние данные сначала
    $.ajax({
        url: "scripts/upr2.js",
        dataType: "text",
        async: true,
        success: function (msg) {
             getf1(msg);
            var servArr = $.parseJSON(msg); max = 0;
            
            i = 0;
            for (i = 0; i < servArr.length; i++)
                upr[i] = servArr[i];
            
            getf2(exallin);
            console.log("Внутренние серверные данные",servArr);
        }
    });

      

    
    console.log("Получить серверные данные");
        $.post("http://cm24646.tmweb.ru/serv.php", { flag: "getallupr" }, getf1);
        $.post("http://cm24646.tmweb.ru/serv.php", { flag: "getallex" }, getf2);
        $.get("http://vik.vr37.ru/getcommon",  getf3);
    return 1;
}

function getf1(data) {
    var servArr = $.parseJSON(data); max = 0;
    upr = null;
    i = 0;
    upr = servArr;
   // console.log(upr)
}
function getf2(data) {
    var servArr = $.parseJSON(data); max = 0;
    // upr = servArr;
    ex = servArr;
}
function getf3(data) {
    var com = $.parseJSON(data);
    // help (verbs of motion)
    if (com[0].enable == '1') $('#helppages').html(com[0].txt);

    //exam intro
    if (com[1].enable == '1') $('#exampages').html(com[1].txt);

    // about 
    if (com[2].enable == '1') $('#aboutpages').html(com[2].txt);

    // console.log(com[1].txt);
}

function mylength(array) {
    var count = 0;
    $.each(array, function () {
        count++;
    });
    return count;
}

// фидбек
function feedbutton() {
    var m1 = $(feedback_mail).val();
    var m2 = $(feedback_txt).val();
    // console.log(m1,m2);
    $.get("http://vik.vr37.ru/sendmessage", { mail: m1, txt: m2 }, answ);
    $(messgood).text('Сообщение отправлено!');
}
function answ(data) {
    console.log(data);
}


// функция проверки экзамена
function log() {
    ex1 = upr[3];
    ex2 = upr[7];
    ex3 = upr[11];
    ex4 = upr[15];
    // экзамен 1 
    console.log("Экзамен - 3");
    for (z = 1; z < ex1.length; z++) {
        i = 0; 
        $.each(upr, function () {
            tup = this; j = 0;
            $.each(tup, function () {
                if (ex1[z].ex == this.ex && i != 3)
                {
                    console.log('i - ' + i, ' : j - ' + j, ' : z - ' + z);
                    // console.log(ex1[z].ex , this.ex);
                }
                j++;
              
            }); i++;
        });
    }
    console.log("Экзамен - 7");
    for (z = 1; z < ex2.length; z++) {
        i = 0;
        $.each(upr, function () {
            tup = this; j = 0;
            $.each(tup, function () {
                if (ex2[z].ex == this.ex && i != 7) console.log('i - ' + i, ' : j - ' + j, ' : z - ' + z);
                j++;
            }); i++;
        })
    }

    //console.log("Экзамен - 11");
    //for (z = 1; z < ex2.length; z++) {
    //    i = 0;
    //    $.each(upr, function () {
    //        tup = this; j = 0;
    //        $.each(tup, function () {
    //            if (ex3[z].ex == this.ex && i != 11) console.log('i - ' + i, ' : j - ' + j, ' : z - ' + z);
    //            j++;
    //        }); i++;
    //    })
    //}

    console.log("конец логирования");

}