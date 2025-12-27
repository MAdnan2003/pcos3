import axios from "axios";

export const virtualTryOn = async (userImageUrl, clothingImageUrl) => {
  const res = await axios.post("http://localhost:5000/api/tryon", {
    userImageUrl,
    clothingImageUrl
  });
  return res.data.resultUrl;
};
