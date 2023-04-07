import _RECIPES from "../../data/recipes.json" assert {type:"json"};
import _ITEM_PAGES from "../../data/item_pages.json" assert {type:"json"};

// @ts-ignore
import { RawRecipe, type RecipeItem, type RecipesMap, type Recipe, type ItemsComplexityMap } from "./types.ts";
import type { ProductionNode } from "./types";

const ITEMS = Object.keys(_ITEM_PAGES);
export const ProductionRecipes: RawRecipe[] = filterNonProductionRecipes(Object.values(_RECIPES))
export const PrimaryRecipesArray: RawRecipe[] = reducePrimaryRecipes(ProductionRecipes);
export const PrimaryRecipesMap: RecipesMap = generateRecipeMapFromProduct(PrimaryRecipesArray);
export const AlternateRecipesArray: RawRecipe[] = reduceAlternateRecipes(ProductionRecipes);
export const AlternateRecipesMap: RecipesMap = generateRecipeMapFromProduct(AlternateRecipesArray);
export const PrimaryItemsCompleixty: ItemsComplexityMap = markComplexity(PrimaryRecipesMap);

/**
 * -- Exclude lists--
 * Alien DNA Capsule
 * **Protein
 * Beacon
 * Biomass
 * Color Cartridge
 * The HUB
 * **Nobelisk
 * Power Shard
 * Rebar
 * Ammo
 * 
 * + additional excludes
 * **Unpackage**
 */

function filterNonProductionRecipes(recipes: RawRecipe[]): RawRecipe[] {
    const exclude_list = [
        "Alien DNA Capsule",
        "Protein",
        "Beacon",
        "Biomass",
        "Color Cartridge",
        "The HUB",
        "Nobelisk",
        "Power Shard",
        "Rebar",
        "Ammo",
        "Unpackage"
    ]
    function containsExcludeList(name: string): boolean {
        return exclude_list.map(exc=>name.includes(exc)).reduce((a,b)=>a||b, false)
    }
    
    return recipes.filter(recipe => !containsExcludeList(recipe.recipe))
}

function reducePrimaryRecipes(recipes: RawRecipe[]): RawRecipe[] {
    return recipes.filter(recipe=>!recipe.isAlternate).filter(recipe=>!recipe.recipe.includes("Unpackage"));
}

function reduceAlternateRecipes(recipes: RawRecipe[]): RawRecipe[] {
    return recipes.filter(recipe=>recipe.isAlternate);
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

export function getProductionTree(item: string, amount = 0): ProductionNode {
    if (!PrimaryRecipesMap[item]) { // Leaf node - Basic resource (e.g. ore)
        const count = roundUpTo2nd(amount / 60);
        return {
            product: {item: item, amountPerMinute: count * 60},
            count: count, // I'm going to et 60 as basic production unit
            byproduct: null,
            ingredients: []
        }
    }
    const recipe = PrimaryRecipesMap[item];
    if (!amount) {
        amount = recipe.product.amountPerMinute;
    }
    const count = roundUpTo2nd(amount / recipe.product.amountPerMinute);
    amount = count * recipe.product.amountPerMinute; // Re-calculate after decimal round up
    const byproduct = (!recipe.byproduct ? null : {item:recipe.byproduct.item, amountPerMinute:recipe.byproduct.amountPerMinute * count});
    const ingredients = recipe.ingredients.map((childRecipe: RecipeItem)=>
        getProductionTree(childRecipe.item, childRecipe.amountPerMinute * count)
    )
    return {
        product: {
            item: item, 
            amountPerMinute: amount
        },
        count,
        byproduct,
        ingredients
    }
}

function roundUpTo2nd(number: number): number {
    if (number % 1==0) {
        return number;
    }
    return Math.ceil(number * 100)/100;
}
export function run() {
    // reduceAlternateRecipes();
    console.log(getProductionTree("Reinforced Iron Plate"));
}