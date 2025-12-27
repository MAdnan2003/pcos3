import React, { useState } from "react";
import { virtualTryOn } from "../services/tryonApi";

export default function TryOnPage() {
  const [userImage, setUserImage] = useState("");
  const [clothingImage, setClothingImage] = useState("");
  const [result, setResult] = useState("");

  const handleTryOn = async () => {
    const url = await virtualTryOn(userImage, clothingImage);
    setResult(url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Virtual Try-On</h2>
      <div>
        <input
          type="text"
          placeholder="User Image URL"
          value={userImage}
          onChange={(e) => setUserImage(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Clothing Image URL"
          value={clothingImage}
          onChange={(e) => setClothingImage(e.target.value)}
        />
      </div>
      <button onClick={handleTryOn}>Try On</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result:</h3>
          <img src={result} alt="Try-On Result" width={300} />
        </div>
      )}
    </div>
  );
}
