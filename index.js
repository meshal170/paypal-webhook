const express = require("express");
const bodyParser = require("body-parser");
const QuickDB = require("quick.db");

const app = express();
app.use(bodyParser.json());

const db = new QuickDB.QuickDB();

app.post("/paypal/webhook", async (req, res) => {
  const event = req.body;

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const desc = event.resource.description || "";
    const match = desc.match(/DiscordID:(\d+)/);

    if (match) {
      const discordId = match[1];
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      await db.set(`sub_${discordId}`, expiresAt);
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook running"));
