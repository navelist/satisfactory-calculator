export interface ItemPages {
    [id:string] : string
};

export interface RecipeItem {
    item: string,
    amountPerMinute : number
}

// export class RecipeItem {
//     constructor(td: any) {
        
//         this.item = td.children("div:first").children("div:first").children("div:last").text();
//         this.amountPerMinute = Number(td.children("div:nth-child(2)").text().split("/")[0].trim());
//     }
// }

export interface RawRecipe {
    recipe: string,
    ingredients: RecipeItem[],
    building: string,
    products: RecipeItem[],
    isAlternate: boolean
}

export class RawRecipe {
    constructor() {
        this.recipe = "";
        this.ingredients = new Array<RecipeItem>();
        this.building = "";
        this.products = new Array<RecipeItem>();
        this.isAlternate = false;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export interface RecipesMap {
    [item: string]: Recipe
}

export interface ItemsComplexityMap {
    [item: string]: number
}

export interface Recipe {
    product: RecipeItem,
    byproduct: RecipeItem | null,
    ingredients: RecipeItem[],
    // complexity: number,
}

// export interface Production {
//     product: RecipeItem,
//     byproduct: RecipeItem | null,
//     ingredients: RecipeItem[],
// }
