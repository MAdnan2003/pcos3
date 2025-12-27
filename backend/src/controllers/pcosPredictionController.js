import axios from "axios";

export const predictPCOS = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/predict",
      req.body
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "PCOS prediction failed",
      error: error.message
    });
  }
};
