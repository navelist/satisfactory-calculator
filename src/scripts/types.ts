export interface ItemPages {
    [id:string] : string
};

export interface RecipeItem {
    item: string,
    amountPerMinute : number
}

export class RecipeItem {
    constructor(td: any) {
        
        this.item = td.children("div:first").children("div:first").children("div:last").text();
        this.amountPerMinute = Number(td.children("div:nth-child(2)").text().split("/")[0].trim());
    }
}

export interface Recipe {
    recipe: string,
    ingredients: RecipeItem[],
    building: string,
    products: RecipeItem[],
    // prerequisites: String,
    isAlternate: boolean
}

export class Recipe {
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
