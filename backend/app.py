from flask import Flask, request, jsonify
from flask_cors import CORS

from tensorflow.keras.models import load_model

from PIL import Image

import numpy as np

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "https://fashion-classifier-neon.vercel.app"
        ]
    }
})

model = load_model("fashion_model.h5")

classes = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot"
]

@app.route("/")
def home():
    return {"message": "Fashion Classifier API"}

@app.route("/predict", methods=["POST"])
# def predict():
@app.route("/predict", methods=["POST"])
def predict():
    # return jsonify({
    #     "class": "test",
    #     "confidence": 1.0
    # })

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    img = Image.open(file)

    img = img.convert("L")

    img = img.resize((28,28))

    img = np.array(img)

    img = img / 255.0

    img = img.reshape(1,28,28)

    print("Starting prediction...")

    prediction = model.predict(img)

    print("Prediction complete")

    index = np.argmax(prediction)

    confidence = float(np.max(prediction))

    return jsonify({
        "class": classes[index],
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=8000,
        debug=True
    )