const functions = require("firebase-functions");

exports.catchShortcutSOS = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const { message, lat, lng } = req.body;

  if (!message || typeof lat !== "number" || typeof lng !== "number") {
    res
      .status(400)

      .send(
        "Invalid request body. Expected { message: string, lat: number, lng: number }",
      );
    return;
  }

  console.log("SOS received:", { message, lat, lng });

  res.status(200).json({
    status: "SOS handled successfully",
    data: { message, lat, lng },
  });
});
