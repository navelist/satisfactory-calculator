
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import RECIPES from "../../../data/recipes.json";
import IMAGES from "../../../data/images.json";
import { Recipe } from "../../scripts/types";


/** @type {import('./$types').PageLoad} */
export function load() {
    return {
        recipes : RECIPES.filter((recipe: Recipe) => !recipe.isAlternate),
        alternateRecipes : RECIPES.filter((recipe: Recipe) => recipe.isAlternate),
        images: IMAGES
    }
}