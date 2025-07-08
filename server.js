import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Сервер работает');
});

app.get('/games', async (req, res) => {
  try {
    const executablePath = await chromium.executablePath || '/usr/bin/chromium-browser'; // fallback
    const browser = await puppeteer.launch({
      args: chromium.args || [],
      defaultViewport: chromium.defaultViewport || null,
      executablePath,
      headless: chromium.headless !== false,
    });

    const page = await browser.newPage();
    await page.goto('https://www.football.org.il/clubs/club/?club_id=7749', {
      waitUntil: 'networkidle2',
    });

    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (error) {
    console.error('Ошибка при получении игр:', error);
    res.status(500).send('Ошибка при получении игр: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
