const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { coordinates, symptom } = req.body;
    const { lat, lng } = coordinates;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&keyword=${encodeURIComponent(
        symptom
      )}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    const hospitals = data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || "N/A",
      user_ratings_total: place.user_ratings_total || 0,
      isOpenNow: place.opening_hours?.open_now ? "Yes" : "No",
    }));

    res.json({ hospitals });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch hospitals", error: err.message });
  }
});

module.exports = router;
