
<script>
    import { createEventDispatcher } from 'svelte';
    import ITEM_PAGES from '../../data/item_pages.json';
    
    const items = Object.keys(ITEM_PAGES);
    const dispatch = createEventDispatcher();
    export let inputValue = "";

    
    /**
	 * @type {string []}
	 */
    let filteredItems = [];

    function submitValue() {
        dispatch('submit');
    }

    function filterItem() {
        if (inputValue) {
            filteredItems = items.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));
        } else {
            filteredItems = [];
        }
    }
    // @ts-ignore
    function onItemSelected(item) {
        inputValue = item;
        filteredItems = [];
        submitValue();
    }
</script>

<div>
    <form autocomplete="off" on:submit|preventDefault={submitValue}>
        <div class="autocomplete">
            <input  id="final-product"
                    type="text"
                    placeholder="Write item names here"
                    bind:value={inputValue}
                    on:input={filterItem}>
        </div>

        <input type="submit" hidden />
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

    li.autocomplete-items:hover {
    background-color: #81921f;
        color: white;
    }

    li.autocomplete-items:active {
    background-color: DodgerBlue !important;
    color: #ffffff;
    }	
</style>