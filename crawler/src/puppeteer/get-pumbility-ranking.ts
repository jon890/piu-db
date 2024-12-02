import { getBrowser, getPageWithNotImage } from "./ready-browser";

export default async function getPumbilityRanking() {
  const browser = await getBrowser();
  const page = await getPageWithNotImage(browser);
  await page.goto("https://www.piugame.com/leaderboard/pumbility_ranking.php");

  const pumbilityRankingList = await page.$$eval(
    "ul.pumbilitySt li",
    (liList) => {
      return liList.map((el) => {
        const profileName = el.querySelector(
          "div.profile_name.en.pl0"
        )?.textContent;
        const hashtag = el.querySelector(
          "div.profile_name.en.st1"
        )?.textContent;
        const score = el.querySelector("div.score > i.tt.en")?.textContent;
        const date = el.querySelector("div.date > i.tt")?.textContent;

        return { profileName, hashtag, score, date };
      });
    }
  );

  return pumbilityRankingList;
}
