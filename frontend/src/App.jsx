import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(false);

  const theme = dark
    ? { bg: "#1a1a1a", card: "#262626", border: "#3a3a3a", text: "#f0f0f0", muted: "#999", inputBg: "#1f1f1f", btnBg: "#262626", disabledBg: "#1f1f1f" }
    : { bg: "#f5f5f0", card: "#fff", border: "#e5e5e0", text: "#1a1a1a", muted: "#888", inputBg: "#fafaf7", btnBg: "#fff", disabledBg: "#f0f0ea" };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setError(null);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Could not reach prediction server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: theme.bg, fontFamily: "sans-serif", transition: "background 0.3s", position: "relative" }}>
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px 14px",
          borderRadius: 8,
          border: `1px solid ${theme.border}`,
          background: theme.btnBg,
          color: theme.text,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <div style={{ maxWidth: 420, width: "100%", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "1.5rem", textAlign: "center", color: theme.text, transition: "background 0.3s, border 0.3s" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 500 }}>Fashion classifier</h1>
        <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 1.5rem" }}>
          Upload an image to predict its category
        </p>

        <label
          htmlFor="file-input"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            border: `1.5px dashed ${theme.border}`,
            borderRadius: 8,
            padding: "2rem 1rem",
            cursor: "pointer",
            background: theme.inputBg,
          }}
        >
          <span style={{ fontSize: 24 }}>📤</span>
          <span style={{ fontSize: 14, color: theme.muted }}>
            {file ? file.name : "Click to choose an image"}
          </span>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </label>

        {preview && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={preview}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, border: `1px solid ${theme.border}` }}
            />
          </div>
        )}

        <button
          onClick={uploadImage}
          disabled={!file || loading}
          style={{
            width: "100%",
            marginTop: "1rem",
            fontWeight: 500,
            padding: "10px",
            borderRadius: 8,
            border: `1px solid ${theme.border}`,
            background: !file || loading ? theme.disabledBg : theme.btnBg,
            color: theme.text,
            cursor: !file || loading ? "default" : "pointer",
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {result && (
          <div style={{ marginTop: "1.5rem", background: theme.inputBg, borderRadius: 8, padding: "1rem", textAlign: "left" }}>
            <p style={{ fontSize: 13, color: theme.muted, margin: "0 0 4px" }}>Prediction</p>
            <p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 12px" }}>{result.class}</p>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.muted, marginBottom: 4 }}>
              <span>Confidence</span>
              <span>{(result.confidence * 100).toFixed(2)}%</span>
            </div>
            <div style={{ height: 6, background: dark ? "#3a3a3a" : "#eee", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${(result.confidence * 100).toFixed(2)}%`,
                  background: "#378ADD",
                  transition: "width 0.4s",
                }}
              />
            </div>
          </div>
        )}

        {error && <p style={{ color: "#e24b4a", fontSize: 13, marginTop: "1rem" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;