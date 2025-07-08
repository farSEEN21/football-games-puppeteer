const express = require('express');
const getGames = require('./getGames');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Сервер работает. Для расписания перейдите на /games");
});

app.get("/games", async (req, res) => {
  try {
    const games = await getGames();
    res.json(games);
  } catch (error) {
    console.error("Ошибка при получении игр:", error);
    res.status(500).json({ error: "Не удалось получить расписание игр" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
