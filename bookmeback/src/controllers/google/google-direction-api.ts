import { RequestHandler } from "express";

export const getTravelTime: RequestHandler = async (req, res) => {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    res.status(400).json({ error: "Origin and destination are required" });
    return;
  }

  const apiKey = "AIzaSyDlBLYHFfHDRdJ9b7B02Kg-x5VXSV6iIVA";

  if (!apiKey) {
    res.status(500).json({ error: "Missing Google Maps API key" });
    return;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&departure_time=now&traffic_model=best_guess&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      res.status(500).json({ error: `Google Maps error: ${data.status}` });
      return;
    }

    const duration = data.routes[0].legs[0].duration_in_traffic.text;

    res.status(200).json({
      origin,
      destination,
      duration,
      raw: data.routes[0].legs[0],
    });
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch travel time" });
  }
};
