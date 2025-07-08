const express = require('express');
const getGames = require('./getGames');
const app = express();
const port = process.env.PORT || 3000;
import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Сервер работает');
});

app.get('/games', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://www.football.org.il/clubs/club/?club_id=7749');

    const content = await page.content();

    await browser.close();
    res.send(content); // временно отправляем весь HTML, потом заменим на парсинг
  } catch (error) {
    console.error('Ошибка при получении игр:', error);
    res.status(500).send('Ошибка при получении игр: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

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
