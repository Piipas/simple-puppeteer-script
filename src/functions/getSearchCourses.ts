import puppeteer from "puppeteer";
import fs from "fs/promises";
import path, { join } from "path";

/**
 * Get all courses based on the given keyboard and write them down on a text file.
 * @param keyword
 */
export const getSearchCourses = async (keyword: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://free4arab.net");

  await page.setViewport({ width: 1080, height: 1024 });

  await page
    .locator(
      "#main-home-content > div > div.vc_row.wpb_row.vc_row-fluid.thim-bg-overlay.thim-search-light-style.vc_custom_1706061976734.vc_row-has-fill.vc_row-no-padding > div > div > div > div.vc_row.wpb_row.vc_inner.vc_row-fluid > div > div > div > div > div.courses-searching > form > input.thim-s.form-control.courses-search-input"
    )
    .fill(keyword);

  await page.click(
    "#main-home-content > div > div.vc_row.wpb_row.vc_row-fluid.thim-bg-overlay.thim-search-light-style.vc_custom_1706061976734.vc_row-has-fill.vc_row-no-padding > div > div > div > div.vc_row.wpb_row.vc_inner.vc_row-fluid > div > div > div > div > div.courses-searching > form > button"
  );
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const paginationLinks = await page.$$eval(
    "#thim-course-archive > nav > ul > li",
    (elements) =>
      elements
        .filter((element) => {
          const anchor = element.querySelector("a");
          return (
            !anchor?.classList.contains("prev") &&
            !anchor?.classList.contains("next")
          );
        })
        .map((element) =>
          element?.querySelector("a, span")?.getAttribute("href")
        )
  );

  let courses: string[] = [];

  for (const paginationLink of paginationLinks) {
    if (paginationLink) await page.goto(paginationLink);

    const pageCourses = await page.$$eval(
      "#thim-course-archive > ul > li",
      (elements) =>
        elements.map((el) => {
          const courseTitle = el.querySelector("h2")?.innerText;
          const courseAuthor = el.querySelector(
            ".author-contain > .value > a"
          )?.innerHTML;
          return `${courseTitle} by ${courseAuthor}`;
        })
    );

    courses.push(...pageCourses);
  }

  const finalCourses = courses.join("\n");

  await fs.writeFile(
    join(__dirname + `/../${keyword}_courses.txt`),
    finalCourses
  );

  await page.close();

  process.exit(0);
};
