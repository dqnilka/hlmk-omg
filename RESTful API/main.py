from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import openai
from jinja2 import Template

from utils.prompt_template import PROMPT_TEMPLATE
from utils.components_base import COMPONENTS_BASE


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Укажи свой ключ API здесь
openai.api_key = os.environ.get('OPEN_AI_TOKEN')


@app.route("/api/main", methods=["POST"])
def get_component_data():
    data = request.get_json()
    input_value = data.get('inputValue', '')
    components = [get_answer(input_value)]
    print(components)

    components = [
        {
            "type": "Avatar",
            "props": {
                "userName": "Иван",
                "userSurname": "Иванов"
            }
        },
        {
            "type": "File",
            "props": {
                "label": "Прикрепите файл2"
            }
        },
        {
            "type": "Select",
            "props": {
                "options": [
                    {"value": "male", "label": "Мужской"},
                    {"value": "female", "label": "Женский"}
                ],
                "label": "Пол"
            }
        },
        {
            "type": "Button",
            "props": {
                "children": "Сдать ответ",
                "style": {"backgroundColor": "blue", "color": "white"}
            }
        }
    ]

    return jsonify({'components': components})


def get_gpt_response(task):
    try:
        # Отправляем запрос к модели
        response = openai.completions.create(
            model="gpt-4",  # Используем модель GPT-4 или другую
            prompt=task,
            max_tokens=5000,  # Максимальное количество токенов в ответе
            temperature=0.7  # Степень креативности ответов
        )

        # Получаем текст ответа
        return response.choices[0].text.strip()

    except Exception as e:
        return f"Произошла ошибка: {e}"


# здесь какой-то инпут
def get_task(answer_front):
    text = Template('''
    {{answer_front}}
    ''')
    task = text.render(answer_front=answer_front)
    print(task)
    return task


def get_answer(answer_front):
    # Укажи свой ключ API здесь
    task = get_task(answer_front)
    template = Template(PROMPT_TEMPLATE)
    query = template.render(task=task, components_base=COMPONENTS_BASE)
    response = get_gpt_response(query)

    return response


if __name__ == "__main__":
    app.run(debug=True, port=5001, host='127.0.0.1')
