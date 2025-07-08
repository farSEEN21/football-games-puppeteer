const puppeteer = require('puppeteer');

async function getGames() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
  });

  const page = await browser.newPage();

  // 👉 Добавь настоящие заголовки
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
  });

  await page.goto('https://www.football.org.il/clubs/club/?club_id=7749', {
    waitUntil: 'networkidle2',
  });

  const content = await page.content();
  await browser.close();

  return content; // или парси дальше
}

module.exports = async function getGames() {
  return "<h1>Парсер временно не доступен — IP заблокирован Cloudflare</h1>";
};
