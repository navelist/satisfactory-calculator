<svelte:head>
	<title>Recipe</title>
	<meta name="description" content="List of recipes" />
</svelte:head>

<script>
	import RecipeTable from '../../components/RecipeTable.svelte';

    
    
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div>
    <RecipeTable recipes={data.recipes}/>
    
    <RecipeTable recipes={data.alternateRecipes}/>
</div>
