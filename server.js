import express from 'express';
 import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Сервер работает');
});

app.get('/games', async (req, res) => {
  try {
    const html = await getGames(); 
    res.send(html);
  } catch (error) {
    console.error("Ошибка при получении игр:", error);
    res.status(500).send("Ошибка при получении игр");
  }
});

    const page = await browser.newPage();
    await page.goto('https://www.football.org.il/clubs/club/?club_id=7749', {
      waitUntil: 'networkidle2',
    });

    const content = await page.content();

    await browser.close();
    res.send(content); // пока просто вернём HTML
  } catch (error) {
    console.error('Ошибка при получении игр:', error);
    res.status(500).send('Ошибка при получении игр: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
