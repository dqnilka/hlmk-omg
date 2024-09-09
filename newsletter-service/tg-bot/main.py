from flask import Flask, request, jsonify
from telegram import Bot
import os

app = Flask(__name__)

TELEGRAM_TOKEN = ''
CHAT_ID = '465391024' 
bot = Bot(token=TELEGRAM_TOKEN)

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message', 'Тестовое сообщение!')
    
    try:
        bot.send_message(chat_id=CHAT_ID, text=message)
        return jsonify({'success': True, 'message': 'Сообщение отправлено!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
