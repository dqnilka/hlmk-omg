from flask import Flask, jsonify, request
from flask_restful import Api, Resource,reqparse
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources=r'/api/*')

api = Api()


class Main(Resource):
    @app.route("/", methods=["GET"])
    def get(self):
        response = jsonify(message="Simple server is running")

        # принимаем CORS
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    @app.route("/", methods=["POST"])
    @cross_origin()
    def post(self):
        if request.method == 'POST':
            print('ТЕСТ')

api.add_resource(Main, "/api/main")
api.init_app(app)


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='127.0.0.1')

