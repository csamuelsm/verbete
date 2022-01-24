from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit
from uuid import uuid4
import pandas as pd
import math
import unicodedata
from flask_session import Session

app = Flask(__name__)
app.config['SECRET_KEY'] = uuid4().hex
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
socketio = SocketIO(app)

#global word
#global words
#session["word"] = None
#session["words"] = None

def get_mean_interval(words):
    mean = words['Freq'].mean()
    std = words['Freq'].std()
    mean_interval = [math.floor(mean), math.ceil(mean+std)]
    return mean_interval

def get_new_word(length, difficulty):
    filename = "words{}.csv".format(length)
    session["words"] = pd.read_csv(filename)
    mean_interval = get_mean_interval(session["words"])
    print(session["words"].Freq.min())
    print(mean_interval)
    print(session["words"].Freq.max())
    if difficulty == 1: # facil
        #print("fácil")
        word = session["words"][session["words"]['Freq'] > mean_interval[1]].sample().word.values[0]
        return word
    elif difficulty == 2: # medio
        #print("médio")
        word = session["words"][session["words"]['Freq'].between(mean_interval[0], mean_interval[1])].sample().word.values[0]
        return word
    else:
        #print("difícil")
        word = session["words"][session["words"]['Freq'] < mean_interval[0]].sample().word.values[0]
        return word
    #return words.sample().word.values[0]

@socketio.on('connect')
def connect():
    session['sid'] = request.sid

@socketio.on('new round')
def new_round(message):
    print(message['difficulty'])
    #word = get_new_word(message['length'], message['difficulty']).lower()
    session["word"] = get_new_word(message['length'], int(message['difficulty']))
    print(session["word"])

def normalize_string(word):
    w = unicodedata.normalize("NFD", word)
    w = w.encode("ascii", "ignore")
    w = w.decode("utf-8")
    return w

@socketio.on('enter')
def check_words(message):
    guess = normalize_string(message['word'].lower())
    print("{} -- {}".format(session["word"], guess))
    w = normalize_string(session["word"]).lower()
    word_list = session["words"].word.tolist()
    word_list = [normalize_string(p).lower() for p in word_list]
    if guess in word_list:
        if guess == w:
            with app.app_context():
                socketio.emit('win', room=session['sid'])
        else:
            status = []
            for i in range(len(guess)):
                if guess[i] not in w:
                    status.append('#333333')
                else: 
                    if guess[i] == w[i]:
                        status.append('#A1C45A')
                    else:
                        status.append('#F1C550')
            with app.app_context():
                socketio.emit('new status', {"status": status, "word":[char for char in guess]}, room=session['sid'])
            print(status)
    else:
        with app.app_context():
            socketio.emit('word dont exist', room=session['sid'])

@socketio.on('game over')
def game_over():
    print('game over')
    with app.app_context():
        socketio.emit('lose', {"word": session["word"]}, room=session['sid'])

@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == "__main__":
    socketio.run(app, host='192.168.0.5', debug=True)