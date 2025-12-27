import React, { useState } from "react";
import axios from "axios";

const TryOnResult = () => {
  const [modelImg, setModelImg] = useState(null);
  const [clothImg, setClothImg] = useState(null);

  const [previewModel, setPreviewModel] = useState("");
  const [previewCloth, setPreviewCloth] = useState("");

  const [resultImg, setResultImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelImg || !clothImg) {
      setErrorMsg("Please upload both images");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("model", modelImg);
      formData.append("cloth", clothImg);

      const res = await axios.post(
        "http://localhost:5000/api/tryon/generate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResultImg(res.data.resultImage);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to generate try-on image. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Virtual Try-On Feature
      </h1>

      {errorMsg && (
        <p className="text-red-600 text-center mb-3">{errorMsg}</p>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Model Image */}
        <div>
          <label className="block font-medium mb-1">Upload Your Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setModelImg(e.target.files[0]);
              setPreviewModel(URL.createObjectURL(e.target.files[0]));
            }}
            className="border p-2 rounded w-full"
          />

          {previewModel && (
            <img
              src={previewModel}
              alt="model preview"
              className="w-40 mt-3 rounded shadow"
            />
          )}
        </div>

        {/* Clothing Image */}
        <div>
          <label className="block font-medium mb-1">Upload Clothing Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setClothImg(e.target.files[0]);
              setPreviewCloth(URL.createObjectURL(e.target.files[0]));
            }}
            className="border p-2 rounded w-full"
          />

          {previewCloth && (
            <img
              src={previewCloth}
              alt="cloth preview"
              className="w-40 mt-3 rounded shadow"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Generate Try-On Result"}
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Generating result...</p>
        </div>
      )}

      {/* RESULT */}
      {resultImg && !loading && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Your Try-On Result</h2>

          <img
            src={resultImg}
            alt="tryon result"
            className="w-80 mx-auto rounded-lg shadow-lg"
          />

          <a
            href={resultImg}
            download
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
};

export default TryOnResult;
