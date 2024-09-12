import openai
from jinja2 import Template
from utils.prompt_template import PROMPT_TEMPLATE
from utils.components_base import COMPONENTS_BASE

# Укажи свой ключ API здесь
openai.api_key = 'твой-ключ-API'

def get_gpt_response(task):
    try:
        # Отправляем запрос к модели
        response = openai.completions.create(
            model="gpt-4",  # Используем модель GPT-4 или другую
            prompt=task,
            max_tokens=5000,  # Максимальное количество токенов в ответе
            temperature=0.7   # Степень креативности ответов
        )
        
        # Получаем текст ответа
        return response.choices[0].text.strip()
    
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