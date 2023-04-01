
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import ITEM_PAGES from "../../../data/item_pages.json";
import IMAGES from "../../../data/images.json";
// import { Recipe } from "../../scripts/types";


/** @type {import('./$types').PageLoad} */
export function load() {
    return {
        items : Object.keys(ITEM_PAGES),
        images: IMAGES,
        // recipesA : TestingRecipesA,
        // recipesB : TestingRecipesB 
    }
}