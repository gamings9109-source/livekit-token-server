require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/getToken", async (req, res) => {
  const { room, identity } = req.body;

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
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
