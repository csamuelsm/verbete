function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function create_grid(chances, length) {
    html_code = ""
    for (i=0; i<chances; i++) {
        if (i == 0) {
            html_code = html_code + "<div class='chance curr_chance'>"
        } else {
            html_code = html_code + "<div class='chance not_curr_chance'>"
        }
        for (j=0; j<length; j++) {
            html_code = html_code + "<div class='entry not_filled' id=" + i.toString() + j.toString() + "></div>"
        }
        html_code = html_code + "</div>"
    }
    $('.content').append(html_code)
}

function create_keyboard() {
    $('.content').append("<div class='keyboard'><div class='top_letters'></div><div class='mid_letters'></div><div class='bottom_letters'></div></div>")

    top_letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
    mid_letters = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç']
    bottom_letters = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '↵', '⌫']

    for (i = 0; i < top_letters.length; i++) {
        $('.top_letters').append("<div class='entry' value=" + top_letters[i] + "><h3>" + top_letters[i] + "</h3></div>")
    }

    for (i = 0; i < mid_letters.length; i++) {
        $('.mid_letters').append("<div class='entry' value=" + mid_letters[i] + "><h3>" + mid_letters[i] + "</h3></div>")
    }

    for (i = 0; i < bottom_letters.length; i++) {
        if (bottom_letters[i] == '↵') {
            $('.bottom_letters').append("<div class='entry enter' value=" + bottom_letters[i] + "><h3>" + bottom_letters[i] + "</h3></div>")
        } else if (bottom_letters[i] == '⌫') {
            $('.bottom_letters').append("<div class='entry backspace' value=" + bottom_letters[i] + "><h3>" + bottom_letters[i] + "</h3></div>")
        } else {
            $('.bottom_letters').append("<div class='entry' value=" + bottom_letters[i] + "><h3>" + bottom_letters[i] + "</h3></div>")
        }
    }
}

function typing(l, socket) {
    letter = l
    if (letter != "↵" && letter != "⌫") {
        curr_field = $('.curr_chance .not_filled').first()
        curr_field.empty()
        curr_field.append("<h2>" + letter + "</h2>")
        curr_field.attr("value", letter)
        curr_field.removeClass('not_filled')
        curr_field.addClass('filled')
    } else if (letter == "↵")  {
        console.log('enter')
        if ($('.curr_chance .not_filled')[0]) {
            $('.curr_chance').effect("shake", {times:2}, 500)
        }
        else {
            values = []
            $('.curr_chance').children('.entry').each(function(){
                //console.log(this)
                values.push($(this).attr("value"))
            })
            word = values.join('')

            socket.emit("enter", {"word": word})
        }
    } else {
        console.log('backspace')
        // backspace
        last_field = $('.curr_chance .filled').last()
        last_field.empty()
        last_field.removeClass('filled')
        last_field.addClass('not_filled')
    }
}

$(document).ready(function(){

    //cookies
    if (getCookie("games") == "") {
        setCookie("games", "0", 365)
    }
    if (getCookie("victories") == "") {
        setCookie("victories", "0", 365)
    }
    if (getCookie("defeats") == "") {
        setCookie("defeats", "0", 365)
    }
    if (getCookie("streak") == "") {
        setCookie("streak", "0", 365)
    }
    if (getCookie("biggest_streak")== "") {
        setCookie("biggest_streak", "0", 365)
    }

    //const socket = io('https://verbete.herokuapp.com/');
    const socket = io();

    /*socket.on('connect', function(){
        const sessionID = socket.socket.sessionID
    })*/

    // modals
    $('.instructions .close_modal').click(function(){
        $('.instructions').hide()
    })

    $('.display_data .close_modal').click(function(){
        $('.display_data').hide()
    })

    $('.inst').click(function(){
        $('.instructions').show()
    })

    $('.data').click(function(){

        games = getCookie("games")
        victories = getCookie("victories")
        defeats = getCookie("defeats")
        streak = getCookie("streak")
        biggest_streak = getCookie("biggest_streak")

        $('.display_data .games').empty()
        $('.display_data .victories').empty()
        $('.display_data .streak').empty()
        $('.display_data .biggest_streak').empty()

        $('.display_data .games').append("<h2><i data-feather='hash'></i> " + String(parseInt(games)) + "</h2><p>jogos</p>")
        if (parseInt(games) == 0) {
            porc_vitorias = 0
        } else {
            porc_vitorias = ((parseFloat(victories))/(parseFloat(games)))*100
        }
        $('.display_data .victories').append("<h2><i data-feather='award'></i> " + String(porc_vitorias.toFixed(2)) + "%</h2><p>vitórias</p>")
        $('.display_data .streak').append("<h2><i data-feather='trending-up'></i> " + String(parseInt(streak)) + "</h2><p>ofensiva</p>")
        $('.display_data .biggest_streak').append("<h2><i data-feather='star'></i> " + String(biggest_streak) + "</h2><p>recorde</p>")

        feather.replace()
        
        //$('.display_data .games').append("<h2><i data-feather='hash'></i> " + data["games"] + "</h2><p>jogos</p>")
        //$('.display_data .victories').append("<h2><i data-feather='award'></i> " + data["porc_vitorias"] + "%</h2><p>vitórias</p>")
        //$('.display_data .streak').append("<h2><i data-feather='trending-up'></i> " + data["ofensiva"] + "</h2><p>ofensiva</p>")
        //$('.display_data .biggest_streak').append("<h2><i data-feather='star'></i> " + data["biggest_streak"] + "</h2><p>recorde</p>")
        
        $('.display_data').show()
    })

    /*socket.on('send data', (data) => {
        $('.display_data .games').append("<h2><i data-feather='hash'></i> " + data["games"] + "</h2><p>jogos</p>")
        $('.display_data .victories').append("<h2><i data-feather='award'></i> " + data["porc_vitorias"] + "%</h2><p>vitórias</p>")
        $('.display_data .streak').append("<h2><i data-feather='trending-up'></i> " + data["ofensiva"] + "</h2><p>ofensiva</p>")
        $('.display_data .biggest_streak').append("<h2><i data-feather='star'></i> " + data["biggest_streak"] + "</h2><p>recorde</p>")
        $('.display_data').show()
    })*/

    // Selects from wizard

    $('.wizard #length .entry').click(function(){
        curr_selected = $('.wizard #length .selected')
        curr_selected.removeClass('selected')
        curr_selected.addClass('select')
        $(this).removeClass('select')
        $(this).addClass('selected')
    })

    $('.wizard #chances .entry').click(function(){
        curr_selected = $('.wizard #chances .selected')
        curr_selected.removeClass('selected')
        curr_selected.addClass('select')
        $(this).removeClass('select')
        $(this).addClass('selected')
    })

    $('.wizard #difficulty .entry').click(function(){
        curr_selected = $('.wizard #difficulty .selected')
        curr_selected.removeClass('selected')
        curr_selected.addClass('select')
        $(this).removeClass('select')
        $(this).addClass('selected')
    })

    //typing
    $('.content').on('click', '.keyboard .entry', function(){
        typing($(this).attr("value"), socket)
    })

    $(document).keypress(function(e) {
        if (e.which !== 0) {
            letras = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
            if (e.which == 13) {
                typing("↵", socket)
            } else {
                letra = String.fromCharCode(e.which).toLowerCase();
                norm = letra.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                console.log(norm)
                if (letras.indexOf(norm) != -1) {
                    typing(letra, socket)
                }
            }
        }
    });

    //backspace
    document.addEventListener('keydown', (event) => {
        const keyName = event.key
        if (keyName == "Backspace") {
            typing("⌫", socket)
        }
    })

    // play button
    $('.play').click(function(){
        length = $('.wizard #length .selected').attr("value")
        chances = $('.wizard #chances .selected').attr("value")
        difficulty = $('.wizard #difficulty .selected').attr("value")

        socket.emit("new round", {"length": length, "difficulty": difficulty})

        $('.wizard').remove()
        create_grid(chances, length)
        create_keyboard()

    })

    // refresh button
    $('.refresh').click(function(){
        document.location.reload()
    })

    // next round
    socket.on('new status', (data) => {
        colors = data['status']
        guess = data['word']
        special =  data['special']
        console.log(special)
        i = 0
        curr_chance = $('.curr_chance')
        curr_chance.children('.entry').each(function(){
            if (i in special) {
                $(this).empty()
                $(this).append("<h2>" + special[i] + "</h2>")
            }
            $(this).animate({'background-color': colors[i], 'border-color': colors[i]}, 500)
            //$(this).css()
            /*if (colors[i] == '#333333') {
                key = $('.keyboard .entry[value=' + guess[i].toUpperCase() + ']')
                //console.log(guess[i])
                //console.log(key)
                key.animate({'background-color': colors[i]}, 500)
            }*/
            if ($(this).css("background-color") != 'rgb(0, 158, 115)') {
                if (i in special && special[i] == 'ç') {
                    key = $('.keyboard .entry[value=' + special[i].toUpperCase() + ']')
                    key.animate({'background-color': colors[i]}, 500)
                } else {
                    if (guess[i] == 'ç') {
                        key = $('.keyboard .entry[value=' + guess[i].toUpperCase() + ']')
                        key.animate({'background-color': colors[i]}, 500)
                    } else {
                        key = $('.keyboard .entry[value=' + guess[i].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase() + ']')
                        key.animate({'background-color': colors[i]}, 500)
                    }
                    
                }
            }
            
            i++
        })
        curr_chance.removeClass('curr_chance')
        curr_chance.addClass('wasted_chance')

        if ($('.not_curr_chance')[0]) {
            console.log('not game over')
            next_chance = $('.not_curr_chance').first()
            next_chance.removeClass('not_curr_chance')
            next_chance.addClass('curr_chance')
        } else {
            console.log('game over')
            socket.emit('game over')
        }
    })

    // win
    socket.on('win', (data) => {
        curr_chance = $('.curr_chance')
        i = 0
        special = data["special"]
        curr_chance.children('.entry').each(function(){
            if (i in special) {
                $(this).empty()
                $(this).append("<h2>" + special[i] + "</h2>")
            }
            $(this).animate({'background-color': 'rgb(0, 158, 115)', 'border-color': 'rgb(0, 158, 115)'}, 500)
            i++
        })

        games = getCookie("games")
        victories = getCookie("victories")
        defeats = getCookie("defeats")
        streak = getCookie("streak")
        biggest_streak = getCookie("biggest_streak")

        setCookie("games", String(parseInt(games)+1), 365)
        $('.win .dados .games').append("<h2><i data-feather='hash'></i> " + String(parseInt(games)+1) + "</h2><p>jogos</p>")
        setCookie("victories", String(parseInt(victories)+1), 365)
        if (parseInt(defeats) == 0) {
            $('.win .dados .victories').append("<h2><i data-feather='award'></i> " + "100" + "%</h2><p>vitórias</p>")
        } else {
            porc_vitorias = ((parseFloat(victories)+1)/(parseFloat(games)+1))*100
            $('.win .dados .victories').append("<h2><i data-feather='award'></i> " + String(porc_vitorias.toFixed(2)) + "%</h2><p>vitórias</p>")
        }
        setCookie("streak", String(parseInt(streak)+1), 365)
        $('.win .dados .streak').append("<h2><i data-feather='trending-up'></i> " + String(parseInt(streak)+1) + "</h2><p>ofensiva</p>")
        if (parseInt(streak)+1 > parseInt(biggest_streak)) {
            setCookie("biggest_streak", String(parseInt(streak)+1), 365)
            $('.win .dados .biggest_streak').append("<h2><i data-feather='star'></i> " + String(parseInt(streak)+1) + "</h2><p>recorde</p>")
        } else {
            $('.win .dados .biggest_streak').append("<h2><i data-feather='star'></i> " + String(biggest_streak) + "</h2><p>recorde</p>")
        }
        
        $('.curr_chance').effect("shake", {times:4}, 500)
        $('.win').append('<br/><br/><a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="' + data["text"] +'" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>')
        $('.win .time').prepend("<i data-feather='clock'></i> " + data["time"] + " min.")
        feather.replace()
        $('.result').show()
        $('.win .word').append(data['word'])
        $('.win').show(500)

        const jsConfetti = new JSConfetti()
        // confetti setup
        jsConfetti.addConfetti({
            emojis: ['🌈', '💥', '✨'],
        })
        //jsConfetti.addConfetti()
    })

    // word don't exist
    socket.on('word dont exist', (data) => {
        $('.curr_chance').effect("shake", {times:2}, 500)
    })

    // lost game
    socket.on('lose', (data) => {

        games = getCookie("games")
        victories = getCookie("victories")
        defeats = getCookie("defeats")
        streak = getCookie("streak")
        biggest_streak = getCookie("biggest_streak")

        setCookie("games", String(parseInt(games)+1), 365)
        $('.lose .dados .games').append("<h2><i data-feather='hash'></i> " + String(parseInt(games)+1) + "</h2><p>jogos</p>")
        porc_vitorias = ((parseFloat(victories))/(parseFloat(games)+1))*100
        setCookie("defeats", String(parseInt(defeats)+1), 365)
        $('.lose .dados .victories').append("<h2><i data-feather='award'></i> " + String(porc_vitorias.toFixed(2)) + "%</h2><p>vitórias</p>")
        setCookie("streak", "0", 365)
        streak = 0
        $('.lose .dados .streak').append("<h2><i data-feather='trending-up'></i> " + String(parseInt(streak)) + "</h2><p>ofensiva</p>")
        $('.lose .dados .biggest_streak').append("<h2><i data-feather='star'></i> " + String(biggest_streak) + "</h2><p>recorde</p>")

        $('.lose').append('<br/><br/><a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="' + data["text"] +'" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>')
        $('.lose time').prepend("<h1> <i data-feather='clock'></i> " + data["time"] + " min.</h1>")
        //$('.lose .dados .games').append("<h2><i data-feather='hash'></i> " + data["games"] + "</h2><p>jogos</p>")
        //$('.lose .dados .victories').append("<h2><i data-feather='award'></i> " + data["porc_vitorias"] + "%</h2><p>vitórias</p>")
        //$('.lose .dados .streak').append("<h2><i data-feather='trending-up'></i> " + data["ofensiva"] + "</h2><p>ofensiva</p>")
        //$('.lose .dados .biggest_streak').append("<h2><i data-feather='star'></i> " + data["biggest_streak"] + "</h2><p>recorde</p>")
        feather.replace()
        $('.result').show()
        $('.lose').show(500)
        $('.lose .word').append(data['word'])
    })

})