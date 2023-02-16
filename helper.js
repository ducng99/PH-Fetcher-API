import puppet from "puppeteer";
import SimpleMemcache from "./SimpleMemcache.js";

const browser = await puppet.launch({ headless: true });
const linksCache = new SimpleMemcache();

/**
 * @param {string} id file ID
 * @returns {Promise<null|{[key: string]: string}>}
 */
export async function getLinks(id) {
    if (linksCache.has(id)) {
        return linksCache.get(id);
    }

    const page = await browser.newPage();
    await page.goto(`${process.env.PH_HOST_URL}${id}`);

    let mediaURL = await page.evaluate(() => {
        if (typeof media_5 !== "undefined") {
            return media_5;
        }
        else if (typeof media_4 !== "undefined") {
            return media_4;
        }
        else if (typeof media_3 !== "undefined") {
            return media_3;
        }

        return null;
    });

    let mediaObjs = null;

    if (mediaURL) {
        await page.goto(mediaURL);

        mediaObjs = await page.evaluate(() => {
            try {
                return JSON.parse(document.querySelector("body").innerText);
            }
            catch {
                return null;
            }
        });
    }

    page.close();

    let links = {};

    if (mediaObjs) {
        mediaObjs.forEach(media => { links[media.quality] = media.videoUrl });
        linksCache.set(id, links, Date.now() + 5400000);
    }

    return links;
}