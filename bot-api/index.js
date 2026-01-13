import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;

app.post("/change", async (req, res) => {
  try {
    const { username, avatar_url } = req.body;

    const buffer = await fetch(avatar_url).then(r => r.arrayBuffer());
    const base64 = Buffer.from(buffer).toString("base64");

    const discord = await fetch("https://discord.com/api/v10/users/@me", {
      method: "PATCH",
      headers: {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        avatar: `data:image/png;base64,${base64}`
      })
    });

    const data = await discord.json();
    res.json(data);
  } catch {
    res.status(500).json({ erro: "Falha" });
  }
});

export default app;
