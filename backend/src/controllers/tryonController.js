import TryOnService from "../services/tryonService.js";

export const virtualTryOn = async (req, res) => {
  try {
    const { userImageUrl, clothingImageUrl } = req.body;

    const resultUrl = await TryOnService.virtualTryOn(
      userImageUrl,
      clothingImageUrl
    );

    res.json({ success: true, resultUrl });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
