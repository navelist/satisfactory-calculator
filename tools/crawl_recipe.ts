// Messy hack to avoid error...
export {}

import axios from 'axios';
import { load } from 'cheerio';
import { writeFile } from 'fs'

/** Has no recipes
 * https://satisfactory.fandom.com/wiki/Power_Slug
 * 
 * Many input, many output
 * https://satisfactory.fandom.com/wiki/Encased_Uranium_Cell
 */

const URL_WIKI = "https://satisfactory.fandom.com";
const URL_WIKI_ITEM_CATEGORIES = "https://satisfactory.fandom.com/wiki/Category:Items"

const R_MANY_I_MANY_O = "https://satisfactory.fandom.com/wiki/Encased_Uranium_Cell";
const R_NO = "https://satisfactory.fandom.com/wiki/Power_Slug";
const R_ALT = "https://satisfactory.fandom.com/wiki/Iron_Ingot";

interface ItemPages {
    [id:string] : string
}

async function getItemPages(): Promise<ItemPages> {
    const html = await axios.get(URL_WIKI_ITEM_CATEGORIES);
    const cheerio = load(html.data);
    
    const itemCategories = cheerio("div#mw-pages div.mw-content-ltr div.mw-category a");
    const itemToPage = itemCategories.toArray()
        .map((element) => [element.attribs['title'], URL_WIKI + element.attribs['href']])
        
    
    const missingItems: string[] = [
        "Water",
        "Sulfuric Acid",
        "Alumina Solution",
        "Nitrogen Gas",
        "Fuel",
        "Heavy Oil Residue",
        "Liquid Biofuel",
        "Nitric Acid", 
        "The HUB"
    ];
    const missingItemsToPage = missingItems.map(
        // @ts-ignore
        item => [item, URL_WIKI + "/" + item.replaceAll(" ", "_")]
    )
    
    return itemToPage.concat(missingItemsToPage).reduce((a,b) => Object.assign(a, { [b[0]] : b[1] }), {});;
}

interface RecipeItem {
    item: string,
    amountPerMinute : number
}

class RecipeItem {
    constructor(td: any) {
        
        this.item = td.children("div:first").children("div:first").children("div:last").text();
        this.amountPerMinute = Number(td.children("div:nth-child(2)").text().split("/")[0].trim());
    }
}

interface Recipe {
    recipe: string,
    ingredients: RecipeItem[],
    building: string,
    products: RecipeItem[],
    // prerequisites: String,
    isAlternate: boolean
}

class Recipe {
    constructor() {
        this.recipe = "";
        this.ingredients = new Array<RecipeItem>();
        this.building = "";
        this.products = new Array<RecipeItem>();
        this.isAlternate = false;
        // this.prerequisites = "";
    }

    toString() {
        return JSON.stringify(this);
    }
}

/**
 * It's quite complicated due to complex tr td structures...
 */
async function getItemRecipes(url: string): Promise<Array<Recipe> | null> {
    const html = await axios.get(url);
    const cheerio = load(html.data);

    if (!cheerio("div.mw-parser-output").children('h3:first').text().includes("Crafting")) {
        return null;
    }

    const trs = cheerio("div.mw-parser-output table.wikitable:first tr:first");
    const tdSizes: Array<number> = [];
    for (let th = trs.children().first(); th.text(); th = th.next()) {
        const colspan = th.attr('colspan');

        if (colspan) {
            tdSizes.push(Number(colspan));
        } else {
            tdSizes.push(0);
        }
    }
   
    const data: Array<Recipe> = [];
    let lastRow = new Recipe();

    for (let tr = trs.next(); tr.text(); tr = tr.next()) {
        const isFirstRow = (tr.attr('class') === 'firstRow');
        
        if (isFirstRow) {
            lastRow = new Recipe();
            data.push(lastRow);

            const curTdSizes = [...tdSizes];
            
            let td = tr.children('td:first');
            lastRow.recipe = td.text().replace("Alternate", "");
            lastRow.isAlternate = (td.children().length > 0);
            

            do {
                td = td.next();
                if(td.children().length > 0) {
                    lastRow.ingredients.push(new RecipeItem(td))
                }
                
                
                if (curTdSizes[1] > 0) {
                    curTdSizes[1] -= Number(td.attr('colspan'));
                }
            } while (curTdSizes[1] > 0)
            
            td = td.next();
            lastRow.building = td.children('span').children('a').text();
            
            do {
                td = td.next();
                if(td.children().length > 0) {
                    lastRow.products.push(new RecipeItem(td))
                }
                
                if (curTdSizes[3] > 0) {
                    curTdSizes[3] -= Number(td.attr('colspan'));
                }
            } while (curTdSizes[3] > 0)

            td = td.next();
        } else {
            const curTdSizes = [...tdSizes];
            let td = tr.children('td:first');
            for (let i = 0; i<curTdSizes.length; i++) {
                while (curTdSizes[i]>0) {
                    if (i==1 && td.children().length > 0) {
                        lastRow.ingredients.push(new RecipeItem(td));
                    }
                    if (i==3 && td.children().length > 0) {
                        lastRow.products.push(new RecipeItem(td));
                    }
                    curTdSizes[i] -= Number(td.attr('colspan'));
                    td = td.next();
                }
            }
        }
    }
    
    return data;
}


async function getItemImages(item: string, url: string) {
    const html = await axios.get(url);
    const cheerio = load(html.data);
    let imageUrl = cheerio("figure.pi-item:first").children("a:first").attr("href");
    try {
        // @ts-ignore
        imageUrl = imageUrl.match("[\\w-/.:]+.(png|gif)")[0]
    } catch (error) {
        console.error("error while reading " + url + imageUrl);
        console.error(error);
    }
    return {
        [item]: imageUrl
    }
}

async function parseSatisfactoryWiki() {
    const itemPages = await getItemPages();
    writeFile("./data/item_pages.json", JSON.stringify(itemPages), (err)=> {
        console.error(err);
    });


    Promise.all(Object.entries(itemPages).map(async entry => getItemRecipes(entry[1]))).then(
        recipes => {
            const items = recipes
                .filter(recipe=>recipe!=null)
                .reduce((a,b)=> b != null ? (a==null ? [] : a).concat(b) : a, new Array<Recipe>())
                ?.filter(recipe => recipe.building !== "Equipment Workshop");

            writeFile("./data/recipes.json", JSON.stringify(items), (err)=> {
                console.error(err);
            });
        }
    )

    Promise.all(
        Object.entries(itemPages).map(entry => getItemImages(entry[0], entry[1]))
    ).then(
        itemImages => {
            const images = itemImages.reduce((a,b)=> Object.assign(a, b), new Object());
            writeFile("./data/images.json", JSON.stringify(images), (err)=> {
                console.error(err);
            });
        }
    );
}

parseSatisfactoryWiki();

