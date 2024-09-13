PROMPT_TEMPLATE = """
Запрос: {{ task }}

У тебя есть набор соответствий сущностей - код для сущностей
{{ components_base }}

Выдели сущности из первого списка, представленные в запросе, после чего выполни запрос: {{ task }}. 

При сборке страницы добавляй <br></br> между элементами. Также при сборке страницы не надо добавлять в начале import "{ Avatar, Button }" from '@nlmk/ds-2.0'; export default App = () =>. И также при сборке страницы не надо добавлять в конце ).

После чего преобразуй страницу к формату json. Например, для сборки страницы "сделай страницу с аватаром для имени Иван Иванов, полем для прикрепления файла, одиночным выбором “пол” с вариантами “мужской” и “женский”, синей кнопкой “сдать ответ” внизу." результатом будет components = [
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
                "label": "Прикрепите файл"
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

В ответе верни только json файл
"""