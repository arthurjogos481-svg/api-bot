import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { username, avatar_url } = req.body;

    if (!username || !avatar_url) {
      return res.status(400).json({ error: "Faltam dados" });
    }

    const buffer = await fetch(avatar_url).then(r => r.arrayBuffer());
    const base64 = Buffer.from(buffer).toString("base64");

    const discord = await fetch("https://discord.com/api/v10/users/@me", {
      method: "PATCH",
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        avatar: `data:image/png;base64,${base64}`
      })
    });

    const data = await discord.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Erro ao mudar nome/avatar" });
  }
      }
