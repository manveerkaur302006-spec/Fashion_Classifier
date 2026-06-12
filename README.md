# CNN Fashion Classifier

A small full-stack image classification app for the Fashion-MNIST dataset.

The backend is a Flask API that loads a trained TensorFlow model from `backend/fashion_model.h5` and exposes a prediction endpoint. The frontend is a React + Vite app that lets you upload an image and shows the predicted class and confidence.

## Project Structure

- `backend/` - Flask API, training script, and saved model
- `frontend/` - React + Vite user interface

## Requirements

- Python 3.11+
- Node.js 18+
- pip

## Backend Setup

1. Create and activate a virtual environment.
2. Install the Python dependencies:

```bash
pip install -r backend/requirement.txt
```

3. Start the API:

```bash
cd backend
python app.py
```

The API runs on `http://localhost:8000`.

## Frontend Setup

1. Install the frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the Vite dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` and calls the backend at `http://localhost:8000/predict`.

## Train the Model

If you want to retrain the model, run:

```bash
cd backend
python train.py
```

This script downloads Fashion-MNIST, trains a CNN, and saves the model to `backend/fashion_model.h5`.

## API

### `GET /`

Returns a simple health message.

### `POST /predict`

Accepts a multipart form upload with an `image` field and returns the predicted class and confidence.

Example response:

```json
{
  "class": "Sneaker",
  "confidence": 0.9732
}
```

## Notes

- The frontend currently expects the backend to be running locally on port `8000`.
- The repository includes the trained model file so the app works without retraining.