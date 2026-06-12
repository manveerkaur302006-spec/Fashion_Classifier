import tensorflow as tf
from tensorflow.keras import datasets, layers, models

# Load Dataset
fashion_mnist = datasets.fashion_mnist

(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()

# Normalize
train_images = train_images / 255.0
test_images = test_images / 255.0

# CNN Model
model = models.Sequential([
    layers.Reshape((28, 28, 1), input_shape=(28, 28)),

    layers.Conv2D(32, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Flatten(),

    layers.Dense(128, activation='relu'),

    layers.Dense(10, activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    train_images,
    train_labels,
    epochs=10,
    validation_data=(test_images, test_labels)
)

# Save
model.save("fashion_model.h5")

print("Model Saved")