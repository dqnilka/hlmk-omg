import telebot
from telebot import types

API_KEY = 'YOUR_API_KEY'
bot = telebot.TeleBot(API_KEY)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = types.ReplyKeyboardMarkup(row_width=2)
    history_button = types.KeyboardButton('История')
    help_button = types.KeyboardButton('Помощь')
    markup.add(history_button, help_button)

    bot.send_message(
        message.chat.id,
        "Привет! Это Бот HLMK Corporate Page Generator.",
        reply_markup=markup
    )

@bot.message_handler(regexp="История")
def show_history(message):
    bot.send_message(message.chat.id, "Здесь будет ваша история.")

@bot.message_handler(regexp="Помощь")
def show_help(message):
    bot.send_message(message.chat.id, "Это раздел помощи. Чем могу помочь?")

bot.polling()
