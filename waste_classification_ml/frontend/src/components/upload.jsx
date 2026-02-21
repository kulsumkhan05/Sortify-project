import React, { useState, useContext } from "react";
import wasteDatabase from "./wasteInfo.json";
import WasteInfoModal from "./WasteInfoModal";
import "./upload.css";
import { PointsContext } from "../contexts/PointsContext";

const Upload = () => {
  const [images, setImages] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [selectedWasteType, setSelectedWasteType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setPoints, addPoints } = useContext(PointsContext);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const selectedCount = images.length + files.length;

    if (selectedCount > 3) {
      setError("✋ Maximum 3 images allowed!");
      return;
    }

    setError("");
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const classifyImages = async () => {
    if (!images || images.length === 0) {
      setError("⚠️ Please select at least one image");
      return;
    }

    setLoading(true);
    setError("");
    const results = [];

    try {
      console.log("🚀 Starting classification for", images.length, "image(s)");

      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        const file = imageData?.file;

        if (!file) {
          throw new Error(`Image ${i + 1}: File object missing`);
        }

        console.log(`📤 [${i + 1}/${images.length}] Uploading:`, file.name, `(${file.size} bytes)`);

        // Create FormData
        const form = new FormData();
        form.append("file", file);

        // Send to backend
        console.log("📡 Sending to backend...");
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: form,
          // DO NOT set Content-Type header - browser will set it with boundary
        });

        console.log(`📥 Response status:`, response.status);
        const data = await response.json();
        console.log(`📊 Response data:`, data);

        if (!response.ok) {
          throw new Error(data?.error || `Backend error: ${response.status}`);
        }

        if (!data.category) {
          throw new Error("Invalid response: no category in response");
        }

        // Update global points state if backend returned updated total
        if (typeof data.new_points !== "undefined") {
          try {
            setPoints(Number(data.new_points));
          } catch (e) {
            console.warn("Failed to set points from response", e);
          }
        } else if (typeof data.new_points === "undefined" && typeof data.points_awarded !== "number") {
          // no new_points provided; if backend returned per-item award as new_points_field, try to add
          if (typeof data.new_points === "number") addPoints(data.new_points);
        }

        results.push({ id: imageData.id, ...data });
      }

      console.log("✅ All images classified!");
      setClassifications(results);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImages([]);
    setClassifications([]);
    setError("");
  };

  return (
    <div className="upload-container">
      {/* Floating Symbols */}
      <div className="floating-symbols">
        <div className="floating-symbol" style={{ animationDelay: '0s' }}>♻️</div>
        <div className="floating-symbol" style={{ animationDelay: '2s' }}>🌍</div>
        <div className="floating-symbol" style={{ animationDelay: '4s' }}>🌱</div>
        <div className="floating-symbol" style={{ animationDelay: '1s' }}>♻️</div>
        <div className="floating-symbol" style={{ animationDelay: '3s' }}>🌿</div>
        <div className="floating-symbol" style={{ animationDelay: '5s' }}>♻️</div>
        <div className="floating-symbol" style={{ animationDelay: '2.5s' }}>🍃</div>
        <div className="floating-symbol" style={{ animationDelay: '0.5s' }}>🌍</div>
      </div>

      <div className="upload-header">
        <h2>🗑️ Upload & Classify</h2>
        <p>Smart Waste Sorting</p>
      </div>

      <div className="upload-content">
        {/* Upload Section */}
        {classifications.length === 0 && (
          <div className="upload-section">
            <div className="upload-prompt">
              <h3>What are you throwing away?</h3>
              <p>Upload up to 3 photos to classify items.</p>
            </div>

            <div className="image-preview-grid">
              {images.map((image) => (
                <div key={image.id} className="image-preview-item">
                  <img src={image.preview} alt="preview" />
                  <button
                    className="remove-btn"
                    onClick={() => removeImage(image.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <label className="upload-box">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={loading}
                  />
                  <div className="upload-icon">
                    <span>{images.length === 0 ? "📸" : "➕"}</span>
                    <p>
                      {images.length === 0
                        ? "Upload Images"
                        : `Add More (${3 - images.length} left)`}
                    </p>
                  </div>
                </label>
              )}
            </div>

            {images.length > 0 && (
              <div className="upload-actions">
                <button
                  className="classify-btn primary"
                  onClick={classifyImages}
                  disabled={loading}
                >
                  {loading ? "⏳ Classifying..." : "🔍 Classify Waste"}
                </button>
                <button
                  className="classify-btn secondary"
                  onClick={() => setImages([])}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {classifications.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h3>✅ Classification Results</h3>
              <button className="reset-btn" onClick={clearAll}>
                Classify More
              </button>
            </div>

            <div className="classification-grid">
              {classifications.map((result, idx) => {
                const waste = wasteDatabase[result.category];
                return (
                  <div key={result.id || idx} className="classification-card">
                    <img
                      src={images[idx]?.preview}
                      alt="classified"
                      className="result-image"
                    />

                    <div className="classification-info">
                      <div className="waste-header">
                        <span className="waste-icon">{waste?.icon || "🗑️"}</span>
                        <h4>{waste?.name || result.category}</h4>
                        <button
                          className="info-icon"
                          onClick={() => setSelectedWasteType(result.category)}
                          title="View waste information"
                        >
                          ℹ️
                        </button>
                      </div>

                      <div className="confidence-badge">
                        <span className="confidence-label">Confidence</span>
                        <span className="confidence-value">{result.confidence}%</span>
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {result.suggestions && result.suggestions.length > 0 && (
                        <div className="suggestions">
                          <p className="suggestion-label">Other possibilities:</p>
                          {result.suggestions.map((suggestion, i) => (
                            <div key={i} className="suggestion-item">
                              <span>{suggestion.category}</span>
                              <span className="suggestion-confidence">
                                {suggestion.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.new_points && (
                        <div className="points-earned">
                          <span className="points-icon">⚡</span>
                          <span>+{result.new_points} Points</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {error && <div className="error-message">❌ {error}</div>}
      </div>

      {/* Waste Info Modal */}
      {selectedWasteType && (
        <WasteInfoModal
          wasteType={selectedWasteType}
          onClose={() => setSelectedWasteType(null)}
        />
      )}
    </div>
  );
};

export default Upload;
