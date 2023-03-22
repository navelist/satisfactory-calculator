<svelte:head>
	<title>TopDown</title>
	<meta name="description" content="Top Down Production Chain Graph" />
</svelte:head>

<script lang="ts">
	import ItemInput from "../../components/ItemInput.svelte";
	import TopDownGraph from "../../components/TopDownGraph.svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    let selectedItem = "";
    let selectedItemToShow = "";
    function onItemSelected(){
        if (selectedItem && data.items.includes(selectedItem)) {
            selectedItemToShow = selectedItem;
        }
    }
</script>

<ItemInput bind:inputValue={selectedItem} on:submit={onItemSelected}/>
<TopDownGraph bind:selectedItem={selectedItemToShow}/>