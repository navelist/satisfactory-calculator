<svelte:head>
	<title>TopDown</title>
	<meta name="description" content="Top Down Production Chain Graph" />
</svelte:head>

<script>

    
    /** @type {import('./$types').PageData} */
    export let data;

    let inputValue = "";
    /**
	 * @type {string []}
	 */
    let filteredItems = [];

    function submitValue() {
        // TODO
        console.log("Submittied input value : " + inputValue);
    }

    function filterItem() {
        if (inputValue) {
            filteredItems = data.items.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));
        } else {
            filteredItems = [];
        }
    }
    // @ts-ignore
    function onItemSelected(item) {
        inputValue = item;
        filteredItems = [];
    }
</script>

<div>
    <form autocomplete="off" on:submit|preventDefault={submitValue}>
        <div class="autocomplete">
            <input  id="final-product"
                    type="text"
                    placeholder="Search Item Names"
                    bind:value={inputValue}
                    on:input={filterItem}>
        </div>

        <input type="submit">
    </form>
    {#if filteredItems.length > 0}
    <ul id="autocomplete-items-list">
        {#each filteredItems as item}
            <li class="autocomplete-items" on:click={()=>onItemSelected(item)}>{item}</li>
        {/each}
    </ul>
    {/if}
    
</div>

<style>
    #autocomplete-items-list {
        position: relative;
        margin: 0;
        padding: 0;
        top: 0;
        width: 297px;
        border: 1px solid #ddd;
        background-color: #ddd;
    }

    li.autocomplete-items {
        list-style: none;
        border-bottom: 1px solid #d4d4d4;
        z-index: 99;
        /*position the autocomplete items to be the same width as the container:*/
        top: 100%;
        left: 0;
        right: 0;
            padding: 10px;
        cursor: pointer;
        background-color: #fff;
    }

    /* li.autocomplete-items:hover {
    background-color: #81921f;
        color: white;
    }

    li.autocomplete-items:active {
    background-color: DodgerBlue !important;
    color: #ffffff;
    }	
        
    .autocomplete-active {
    background-color: DodgerBlue !important;
    color: #ffffff;
    } */
</style>