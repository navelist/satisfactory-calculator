<svelte:head>
	<title>Recipe</title>
	<meta name="description" content="List of recipes" />
</svelte:head>

<script lang="ts">
	import RecipeTable from '../components/RecipeTable.svelte';
    import IMAGES from "../../data/images.json";
    import { PrimaryRecipesArray, AlternateRecipesArray } from "../scripts/functions"
</script>

<div>
    <RecipeTable recipes={PrimaryRecipesArray} images={IMAGES}/>
    
    <RecipeTable recipes={AlternateRecipesArray} images={IMAGES}/>
</div>
