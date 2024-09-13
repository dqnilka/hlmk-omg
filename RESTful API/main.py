from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import openai
from jinja2 import Template
import json

from utils.prompt_template import PROMPT_TEMPLATE
from utils.components_base import COMPONENTS_BASE


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Укажи свой ключ API здесь
openai.api_key = ''


@app.route("/api/main", methods=["POST"])
def get_component_data():
    data = request.get_json()
    input_value = data.get('inputValue', '')
    component = get_answer(input_value)

    component = component.strip('` \n')

    if component.startswith('json'):
        component = component[4:]

    components = []

    data = json.loads(component)

    for _ in data["components"]:
        components.append(_)

    return jsonify({'components': components})


def get_gpt_response(task):
    try:
        # Отправляем запрос к модели
        response = openai.chat.completions.create(
            model="gpt-4o",  # Используем модель GPT-4 или другую
            messages=[{"role": "user", "content": task}],
            max_tokens=1000,  # Максимальное количество токенов в ответе
            temperature=0.7  # Степень креативности ответов
        )

        # Получаем текст ответа
        return response.choices[0].message.content

    except Exception as e:
        return f"Произошла ошибка: {e}"

# здесь какой-то инпут
def get_task(answer_front):
    text = Template('''
    {{answer_front}}
    ''')
    task = text.render(answer_front=answer_front)
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
