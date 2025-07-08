const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const app = express();

app.get('/api/games', async (req, res) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto('https://www.football.org.il/clubs/club/?club_id=7749', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Дождаться таблицу игр
    await page.waitForSelector('.club_games_table', { timeout: 15000 });

    const games = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.club_games_table .table_header_row + div'));
      return rows.map(row => {
        const cols = Array.from(row.querySelectorAll('.table_col')).map(td => td.innerText.trim());
        return {
          date: cols[0] || '',
          matchFrame: cols[1] || '',
          round: cols[2] || '',
          teams: cols[3] || '',
          description: cols[4] || '',
          time: cols[5] || '',
          result: cols[6] || ''
        };
      });
    });

    await browser.close();
    res.json({ updated: new Date(), games });

  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ error: 'Failed to parse page', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));