import openai
from jinja2 import Template
from utils.prompt_template import PROMPT_TEMPLATE
from utils.components_base import COMPONENTS_BASE

# Укажи свой ключ API здесь
openai.api_key = 'твой-ключ-API'

def get_gpt_response(prompt):
    try:
        # Отправляем запрос к модели
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # Используем модель gpt-4o
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=5000,  # Максимальное количество токенов в ответе
            temperature=0.7,   # "Креативность" модели
        )
        
        # Получаем текст ответа
        return response['choices'][0]['message']['content']
    
    except Exception as e:
        return f"Произошла ошибка: {e}"
    
# здесь какой-то инпут
def get_task():
    task = '''
    Сделай страницу с аватаром для имени Иван Иванов, полем для прикрепления файла, одиночным выбором “пол” с вариантами “мужской” и “женский”, синей кнопкой “сдать ответ” внизу.
    '''
    return task

def get_answer():
    task = get_task()
    template = Template(PROMPT_TEMPLATE)
    query = template.render(task=task, components_base=COMPONENTS_BASE)
    response = get_gpt_response(query)

    return response