from flask import Flask, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin

app = Flask(__name__)
# CORS(app)
# cors = CORS(app, resource={
#     r"/*": {
#         "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
#     }
# })

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
    def post_example(self):
        """POST in server"""
        return jsonify(message="POST request returned")


api.add_resource(Main, "/api/main")
api.init_app(app)


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='127.0.0.1')

