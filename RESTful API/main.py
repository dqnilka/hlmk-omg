from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/main", methods=["POST"])
def get_component_data():
    data = request.get_json()
    input_value = data.get('inputValue', '')
    print(input_value)

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


if __name__ == "__main__":
    app.run(debug=True, port=5001, host='127.0.0.1')
