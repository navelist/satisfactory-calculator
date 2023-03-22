<svelte:head>
	<title>TopDown</title>
	<meta name="description" content="Top Down Production Chain Graph" />
</svelte:head>

<script lang="ts">
	import { onMount } from "svelte";
	import ItemInput from "../../components/ItemInput.svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    let selectedItem = "";
    function onItemSelected(){
        if (selectedItem && data.items.includes(selectedItem)) {
            console.log("Valid Item selected : " + selectedItem);
        }
    }
    onMount(onItemSelected);
</script>

<ItemInput bind:inputValue={selectedItem} on:submit={onItemSelected}/>
