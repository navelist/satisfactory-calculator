
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import RECIPES from "../../../data/recipes.json";
import IMAGES from "../../../data/images.json";
import { RawRecipe } from "../../scripts/types";


/** @type {import('./$types').PageLoad} */
export function load() {
    return {
        recipes : RECIPES.filter((recipe: RawRecipe) => !recipe.isAlternate),
        alternateRecipes : RECIPES.filter((recipe: RawRecipe) => recipe.isAlternate),
        images: IMAGES
    }
}