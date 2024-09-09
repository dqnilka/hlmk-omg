import telebot
from flask import Flask, request, jsonify
import threading

TELEGRAM_TOKEN = '7304368665:AAHaDslyPe06nmsvihiK9AKbrRWIv6FAEDA'
USER_ID = '465391024'

bot = telebot.TeleBot(TELEGRAM_TOKEN)
app = Flask(__name__)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Привет! Я бот, который дублирует твои сообщения.")

@bot.message_handler(func=lambda message: True)
def echo_message(message):
    bot.reply_to(message, message.text)

@app.route('/send-message', methods=['POST'])
def send_message():
    bot.send_message(USER_ID, text="test")

def start_bot():
    bot.polling()

if __name__ == '__main__':
    bot_thread = threading.Thread(target=start_bot)
    bot_thread.start()
    
    app.run(host='0.0.0.0', port=5000)
