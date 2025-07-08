const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/api/games', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://www.football.org.il/clubs/club/?club_id=7749', { waitUntil: 'networkidle2' });

    // Подождать пока таблица появится
    await page.waitForSelector('.club_games_table');

    // Извлечь данные
    const games = await page.evaluate(() => {
      const rows = document.querySelectorAll('.club_games_table .table_header_row + div');
      const data = [];
      rows.forEach(row => {
        const cols = Array.from(row.querySelectorAll('.table_col')).map(col => col.innerText.trim());
        if (cols.length >= 6) {
          data.push({
            date: cols[0],
            match: cols[1],
            round: cols[2],
            teams: cols[3],
            venue: cols[4],
            time: cols[5],
            result: cols[6] || ''
          });
        }
      });
      return data;
    });

    await browser.close();
    res.json({ updated: new Date(), games });

  } catch (error) {
    res.status(500).json({ error: 'Puppeteer failed to load or parse page.', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
