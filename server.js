require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("LiveKit Token Server Running");
});

// Token API (GET)
app.get("/getToken", async (req, res) => {
  try {
    const room = req.query.room;
    const identity = req.query.identity;

    if (!room || !identity) {
      return res.status(400).json({
        error: "room and identity required"
      });
    }

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: identity
      }
    );

    token.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true
    });

    res.json({
      token: await token.toJwt()
    });

  } catch (e) {
    res.status(500).json({
      error: e.toString()
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
