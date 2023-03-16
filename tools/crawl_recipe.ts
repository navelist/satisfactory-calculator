// Messy hack to avoid error...
export {}

import axios from 'axios';
import { load } from 'cheerio';

/** Has no recipes
 * https://satisfactory.fandom.com/wiki/Power_Slug
 * 
 * Many input, many output
 * https://satisfactory.fandom.com/wiki/Encased_Uranium_Cell
 */

const URL_WIKI = "https://satisfactory.fandom.com";
const URL_WIKI_ITEM_CATEGORIES = "https://satisfactory.fandom.com/wiki/Category:Items"

const MIMO = "https://satisfactory.fandom.com/wiki/Encased_Uranium_Cell";

async function getItemPages() {
    const html = await axios.get(URL_WIKI_ITEM_CATEGORIES);
    const cheerio = load(html.data);
    
    const itemCategories = cheerio("div#mw-pages div.mw-content-ltr div.mw-category a");
    const itemToPage = itemCategories.toArray()
        .map((element) => [element.attribs['title'], URL_WIKI + element.attribs['href']])
        .reduce((a,b) => Object.assign(a, { [b[0]] : b[1] }), {})
    
    return itemToPage;
}

async function getItemRecipes(url: string) {
    const html = await axios.get(url);
    const cheerio = load(html.data);
}

async function parseSatisfactoryWiki() {
    // const itemPages = getItemPages();
    getItemRecipes(MIMO);
}

parseSatisfactoryWiki();

