import telebot
from flask import Flask, request, jsonify
import threading
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
from flask_socketio import SocketIO, emit

TELEGRAM_TOKEN = '7304368665:AAHaDslyPe06nmsvihiK9AKbrRWIv6FAEDA'
USER_ID = '465391024'

bot = telebot.TeleBot(TELEGRAM_TOKEN)
app = Flask(__name__)
CORS(app)


socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

def save_image(image_data):
    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    image_path = "screenshot.png"
    image.save(image_path)
    return image_path

def create_rating_buttons():
    keyboard = InlineKeyboardMarkup()
    like_button = InlineKeyboardButton("Согласовать", callback_data="like")
    dislike_button = InlineKeyboardButton("Отказать", callback_data="dislike")
    keyboard.add(like_button, dislike_button)
    return keyboard

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
                sent_message = bot.send_photo(
                    USER_ID,
                    image_file,
                    caption=formatted_message,
                    reply_markup=create_rating_buttons(),
                    parse_mode='Markdown'
                )
        else:
            sent_message = bot.send_message(
                USER_ID,
                formatted_message,
                reply_markup=create_rating_buttons(),
                parse_mode='Markdown'
            )

       
        return jsonify({'success': True, 'message': 'Сообщение отправлено!', 'message_id': sent_message.message_id}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500



@bot.callback_query_handler(func=lambda call: call.data in ["like", "dislike"])
def handle_rating_callback(call):
    user_id = call.from_user.id
    rating = call.data
    message_id = call.message.message_id 

    print(f"WebSocket: Отправляем данные: message_id={message_id}, rating={rating}")

    result_message = "Данные переданны оператору." if rating == "like" else "Данные переданны оператору."
    bot.send_message(user_id, result_message)

    try:
        
        socketio.emit('rating_update', {
            'message_id': message_id,
            'rating': rating,
        })
    except Exception as e:
        print(f"Ошибка при отправке оценки через WebSocket: {e}")


@app.route('/update-rating', methods=['POST'])
def update_rating():
    data = request.json
    message_id = data.get('message_id')
    rating = data.get('rating')

   
    socketio.emit('rating_update', {
        'message_id': message_id,
        'rating': rating
    })

    return jsonify({'success': True, 'message': 'Рейтинг обновлен'}), 200

def start_bot():
    bot.polling()

if __name__ == '__main__':
  
    bot_thread = threading.Thread(target=start_bot)
    bot_thread.start()
    
    socketio.run(app, host='0.0.0.0', port=5000)
