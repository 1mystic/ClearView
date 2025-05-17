import { useState, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const ImageClassifier = () => {
  const [imageURL, setImageURL] = useState(null);
  const [result, setResult] = useState(null);
  const imageRef = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageURL(url);
    setResult(null);
  };

  const classifyImage = async () => {
    const model = await mobilenet.load();
    const predictions = await model.classify(imageRef.current);
    setResult(predictions);
  };

  return (
    <div className="classifier-container">
      <h2>Pollution Image Classifier</h2>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageURL && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={imageURL}
            alt="Uploaded Preview"
            ref={imageRef}
            crossOrigin="anonymous"
            width={300}
            onLoad={classifyImage}
            style={{ borderRadius: "8px", border: "2px solid #ccc" }}
          />
        </div>
      )}

      {result && (
        <div className="results" style={{ marginTop: "1rem" }}>
          <h3>Predictions:</h3>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                <strong>{item.className}</strong>: {(item.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>

          {result.some(
            (r) =>
              r.className.toLowerCase().includes("smoke") ||
              r.className.toLowerCase().includes("waste") ||
              r.className.toLowerCase().includes("pollution")
          ) ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              ✅ This image likely shows pollution.
            </p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ❌ Image does not appear to show pollution.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
