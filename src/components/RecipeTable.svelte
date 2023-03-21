<script>
// @ts-nocheck
    export let recipes;
    export let images;
    $: console.log(recipes);
</script>

<table>
    <tr>
        <th>Name</th>
        <th colspan=12>Inputs</th>
        <th colspan=12>Outputs</th>
    </tr>
    {#each recipes as recipe}
    <tr>
        <td>
            <div>
                {recipe.recipe}
            </div>
            
            {#if recipe.isAlternate}
            <div>
                !Alternate!
            </div>
            {/if}
        </td>

        {#each recipe.ingredients as input}
        <td colspan={12/recipe.ingredients.length} class="input">
            <div>
                <img src={images[input.item]} alt="">
            </div>
            <div>
                {input.item}
            </div>
            <div>
                {input.amountPerMinute} / min
            </div>
        </td>
        {/each}
        
        {#each recipe.products as output}
        <td colspan={12/recipe.products.length} class="output">
            <div>
                <img src={images[output.item]} alt="">
            </div>
            <div>
                {output.item}
            </div>
            <div>
                {output.amountPerMinute} / min
            </div>
        </td>
        {/each}
    </tr>
    {/each}
    
</table>

<style>
    .input {
        background-color:palegreen;
    }
    .output {
        background-color: coral;
        
    }
    th, td {
        padding-top: 20px;
        padding-bottom: 20px;
        text-align:center;
    }
    td div img {
       width:40px;
       height:40px; 
    }
</style>