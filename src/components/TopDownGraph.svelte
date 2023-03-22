<script lang="ts">

    // Assume selectedItem is given as valid item name
    export let selectedItem: string = "";
    $: if (selectedItem) {
        console.log(selectedItem);
    }
</script>

