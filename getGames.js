const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function getGames() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto("https://www.football.org.il/clubs/club/?club_id=7749", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".games-list-container table");

  const games = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".games-list-container table tbody tr"));
    return rows.map(row => {
      const cols = row.querySelectorAll("td");
      return {
        result: cols[0]?.innerText.trim(),
        time: cols[1]?.innerText.trim(),
        type: cols[2]?.innerText.trim(),
        teams: cols[3]?.innerText.trim(),
        round: cols[4]?.innerText.trim(),
        field: cols[5]?.innerText.trim(),
        date: cols[6]?.innerText.trim(),
      };
    });
  });

  await browser.close();
  return games;
}

module.exports = getGames;
