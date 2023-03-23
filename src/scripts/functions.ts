import _RECIPES from "../../data/recipes.json" assert {type:"json"};
import _ITEM_PAGES from "../../data/item_pages.json" assert {type:"json"};

// @ts-ignore
import { RawRecipe, type RecipeItem, type RecipesMap, type Recipe, type ItemsComplexityMap } from "./types.ts";

const ITEMS = Object.keys(_ITEM_PAGES);
export const PrimaryRecipesMap: RecipesMap = generateRecipeMapFromProduct(reducePrimaryRecipes());
export const PrimaryItemsCompleixty: ItemsComplexityMap = markComplexity(PrimaryRecipesMap);

function reducePrimaryRecipes(): RawRecipe[] {
    const primaryRecipes: RawRecipe[] = [];
    const duplicate = new Set<string>();
    for (const recipe of 
            _RECIPES.filter(recipe=>!recipe.isAlternate)
                    .filter(recipe=>!recipe.recipe.includes("Unpackage"))
    ) {
        if (!duplicate.has(recipe.recipe)) {
            primaryRecipes.push(recipe);
        }
        duplicate.add(recipe.recipe);
    }
    return primaryRecipes;
}

function generateRecipeMapFromProduct(rawRecipes: RawRecipe[]) {
    return rawRecipes.map((recipe: RawRecipe): Recipe => {
        return {
            product: recipe.products[0],
            byproduct: recipe.products.length>1 ? recipe.products[1] : null,
            ingredients: recipe.ingredients,
            // complexity: NaN,
        }
    }).reduce((a: RecipesMap, b:Recipe)=>{
        if (a[b.product.item]) { // more than one possible recipe for a main product
            // console.log("===Duplicate recipe : " + b.product.item);
            // console.log("existing");
            // console.log(JSON.stringify(a[b.product.item]));
            // console.log("overwriting");
            // console.log(JSON.stringify(b));
            // When duplicate, repect the first recipe. Why? that's usually the most efficient one.
        } else {
            a[b.product.item] = b;
        }
        return a;
    }, new Object() as RecipesMap);
}

function markComplexity(recipesMap: RecipesMap) {
    const itemsComplexity: ItemsComplexityMap = {};
    function recVisitMarkComplexity(item: string): number {
        if (itemsComplexity[item]) {
            return itemsComplexity[item];
        }
        if (!recipesMap[item]) { // There's no recipe for it - It's fundamental resource (e.g. ore)
            itemsComplexity[item] = 0;
            return 0;
        }

        itemsComplexity[item] = recipesMap[item].ingredients
            .map((ingredient:RecipeItem) =>  recVisitMarkComplexity(ingredient.item))
            .reduce((a:number,b:number)=>Math.max(a,b),0) + 1;
        return itemsComplexity[item];
    }

    for (const item of Object.keys(recipesMap)) {
        recVisitMarkComplexity(item);
    }
    return itemsComplexity;
}

export function run() {
    // reduceAlternateRecipes();
    console.log(PrimaryItemsCompleixty);
}