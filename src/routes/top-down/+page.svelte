<svelte:head>
	<title>TopDown</title>
	<meta name="description" content="Top Down Production Chain Graph" />
</svelte:head>

<script lang="ts">
	import BottomUpGraph from "../../components/BottomUpGraph.svelte";
import ItemInput from "../../components/ItemInput.svelte";
	import TopDownGraph from "../../components/TopDownGraph.svelte";
	import type { ProductionNode } from "../../scripts/types";

    /** @type {import('./$types').PageData} */
    export let data;
    let productionTree: ProductionNode;
    let selectedItem = "";
    let selectedItemToShow = "";
    function onItemSelected(){
        if (selectedItem && data.items.includes(selectedItem)) {
            selectedItemToShow = selectedItem;
        }
    }
</script>

<ItemInput bind:inputValue={selectedItem} on:submit={onItemSelected}/>

<TopDownGraph bind:selectedItem={selectedItemToShow} bind:productionTree={productionTree} bind:images={data.images}/>
<BottomUpGraph bind:productionTree={productionTree} bind:images={data.images}/>