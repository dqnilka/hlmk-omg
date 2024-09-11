from flask import Flask, jsonify, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
import time

app = Flask(__name__)
CORS(app, resources=r'/api/*')

api = Api()


class Main(Resource):
    def __init__(self):
        self.answer_front_str = None
        self.text_llm = None

    @app.route("/", methods=["GET"])
    def get(self):
        response = jsonify(message='llm_text')

        # принимаем CORS
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    @app.route("/", methods=["POST"])
    def post(self):
        if request.method == 'POST':
            self.answer_front_str = request.data.decode('UTF-8')

            self.process_frontend()

    def process_frontend(self):
        self.text_llm = self.answer_front_str.split(':')[1][1:][:-2]
        print(self.text_llm)


api.add_resource(Main, "/api/main")
api.init_app(app)


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='127.0.0.1')

