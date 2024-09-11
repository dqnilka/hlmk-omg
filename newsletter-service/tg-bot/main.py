import telebot
from flask import Flask, request, jsonify
import threading
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS

TELEGRAM_TOKEN = ''
USER_ID = '465391024'

bot = telebot.TeleBot(TELEGRAM_TOKEN)
app = Flask(__name__)
CORS(app)

def save_image(image_data):
    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    image_path = "screenshot.png"
    image.save(image_path)
    return image_path

@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message', 'Тестовое сообщение!')
    image_data = data.get('image')
    initial_request = data.get('initialRequest', 'Нет запроса')

    try:
        formatted_message = (
            f"__Запрос на генерацию:__ {initial_request}\n"
            f"__Комментарий пользователя:__ {message}"
        )

        if image_data:
            image_path = save_image(image_data)
            with open(image_path, 'rb') as image_file:
                bot.send_photo(
                    USER_ID,
                    image_file,
                    caption=formatted_message,
                    parse_mode='Markdown'
                )
        else:
            bot.send_message(USER_ID, formatted_message, parse_mode='Markdown')

        return jsonify({'success': True, 'message': 'Сообщение, запрос и фотография отправлены!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def start_bot():
    bot.polling()

if __name__ == '__main__':
    bot_thread = threading.Thread(target=start_bot)
    bot_thread.start()

    app.run(host='0.0.0.0', port=5000)
