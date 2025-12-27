from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load trained model and scaler
model = joblib.load("pcos_model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict_pcos():
    data = request.json

    features = [
        data["age"],
        data["weight"],
        data["height"],
        data["bmi"],
        data["cycle"],
        data["hairLoss"],
        data["pimples"],
        data["fastFood"],
        data["skinDarkening"]
    ]

    features = np.array(features).reshape(1, -1)
    scaled_features = scaler.transform(features)
    prediction = model.predict(scaled_features)[0]

    return jsonify({
        "pcos": int(prediction),
        "result": "PCOS Detected" if prediction == 1 else "No PCOS Detected"
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)
