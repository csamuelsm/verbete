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

    const socket = io.connect();

    /*socket.on('connect', function(){
        const sessionID = socket.socket.sessionID
    })*/

    // modals
    $('.instructions .close_modal').click(function(){
        $('.instructions').hide()
    })

    $('.game_data .close_modal').click(function(){
        $('.instructions').hide()
    })

    $('.inst').click(function(){
        $('.instructions').show()
    })

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
            key = $('.keyboard .entry[value=' + guess[i].toUpperCase() + ']')
            key.animate({'background-color': colors[i]}, 500)
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
        curr_chance.children('.entry').each(function(){
            $(this).animate({'background-color': '#A1C45A', 'border-color': '#A1C45A'}, 500)
        })

        $('.curr_chance').effect("shake", {times:4}, 500)
        $('.win').append('<br/><br/><a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="' + data["text"] +'" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>')
        $('.win').prepend("<h1> <i data-feather='clock'></i> " + data["time"] + " min.</h1>")
        feather.replace()
        $('.result').show()
        $('.win').show(500)

        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti()
    })

    // word don't exist
    socket.on('word dont exist', (data) => {
        $('.curr_chance').effect("shake", {times:2}, 500)
    })

    // lost game
    socket.on('lose', (data) => {
        $('.lose').append('<br/><br/><a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="' + data["text"] +'" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>')
        $('.lose').prepend("<h1> <i data-feather='clock'></i> " + data["time"] + " min.</h1>")
        feather.replace()
        $('.result').show()
        $('.lose').show(500)
        $('.lose .word').append(data['word'])
    })

})