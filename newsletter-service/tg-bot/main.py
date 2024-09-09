import telebot
from flask import Flask, request, jsonify

TELEGRAM_TOKEN = ''
USER_ID = '465391024'

bot = telebot.TeleBot(TELEGRAM_TOKEN)

app = Flask(__name__)

@bot.message_handler(commands=['/start'])
def send_welcome(message):
    bot.reply_to(message, "Привет! Я бот, который дублирует твои сообщения.")

@bot.message_handler(func=lambda message: True)
def echo_message(message):
    bot.reply_to(message, message.text)

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message', 'Тестовое сообщение!')
    
    try:
        bot.send_message(USER_ID, text=message)
        return jsonify({'success': True, 'message': 'Сообщение отправлено!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    bot.polling()
