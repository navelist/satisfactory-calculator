<script lang="ts">
    
	import type { ProductionNode } from "../scripts/types";
    import { getProductionTree, PrimaryItemsCompleixty } from "../scripts/functions"

    // Assume selectedItem is given as valid item name
    export let selectedItem = "";
    export let images;
    export let productionTree: ProductionNode; 
    
    type GridCell = (ProductionNode | string)
    type Grid = GridCell[][]

    let showGrid: Grid = [[]];
    let maxComplexity: number; // +1 from here is td count
    let maxLeafNodes: number; // tr count

    $: if(selectedItem) {
        productionTree = getProductionTree(selectedItem);
        maxComplexity = PrimaryItemsCompleixty[productionTree.product.item];
        maxLeafNodes = countLeafNode(productionTree);
        showGrid = Array(maxLeafNodes).fill(null).map(()=>Array(maxComplexity * 2 + 1).fill(""));
        fillGrid(productionTree);
        // console.log(JSON.stringify(showGrid));
        // console.log(JSON.stringify(productionTree));
    }

    function countLeafNode(node:ProductionNode): number {
        if (node.ingredients.length == 0) {
            return 1;
        }
        return node.ingredients.map(child=>countLeafNode(child)).reduce((a,b)=>a+b,0)
    }

    function fillGrid(node: ProductionNode, row = 0): number { // returns max row it used
        const product = node.product;
        const complexity = PrimaryItemsCompleixty[product.item];
        const col = (maxComplexity - complexity) * 2;
        showGrid[row][col] = node;

        if (node.ingredients.length == 0) {
            return row;
        }

        let lastUsedRow = row-1;
        for (const child of node.ingredients) {
            const childRow = lastUsedRow + 1;
            lastUsedRow = fillGrid(child, childRow);

            // add horizontal dash
            const childCol = (maxComplexity - PrimaryItemsCompleixty[child.product.item]) * 2;
            for (let _col = col+1; _col < childCol; _col++) {
                showGrid[childRow][_col]="─"; // Watch out. It's not a dash "-"
            }
        }

        // add vertical dash
        do {
            const _col = col+1;
            let firstRow = row;
            let lastRow = row

            // count how many(?) child branches exist
            for (let _row = row; _row <= lastUsedRow; _row++) {
                if (showGrid[_row][_col]==="─") {
                    lastRow = _row;
                }
            }

            if (firstRow == lastRow) { // only one child node exists
                break;
            }

            for (let _row = row; _row <= lastUsedRow; _row++) {
                if (!showGrid[_row][_col]) {
                    showGrid[_row][_col] = "│";
                } else {
                    if (_row == firstRow) {
                        showGrid[_row][_col] = "┌";
                    } else if (_row == lastRow) {
                        showGrid[_row][_col] = "└";
                        break;
                    } else {
                        showGrid[_row][_col] = "├";
                    }
                }
                
            }
        } while (false);
        
        return lastUsedRow;
    }
</script>

<div class="TopDownGraphDiv">
    <h2>
        Production Graph (Scrollable)
    </h2>
    <table>
        <tbody>
            {#each showGrid as row}
            <tr>
                {#each row as col}
                <td class="outer">
                    {#if typeof(col)==="string"}
                    {col}
                    {:else}
                    <table class="itemnode">
                        <tr>
                            <td rowspan=2>
                                <div>
                                    Count
                                </div>
                                <div>
                                    {col.count}
                                </div>
                            </td>
                            <td class="item">
                                <div>
                                    <img src={images[col.product.item]} alt="">
                                </div>
                                <div>
                                    {col.product.item}
                                </div>
                            </td>
                            <td class="amount">
                                {col.product.amountPerMinute.toFixed(2)} / min
                            </td>
                        </tr>
                        {#if col.byproduct}
                        <tr>
                            <td>
                                <div>
                                    <img src={images[col.byproduct.item]} alt="">
                                </div>
                                <div>
                                    {col.byproduct.item}
                                </div>
                            </td>
                            <td>
                                {col.byproduct.amountPerMinute.toFixed(2)} / min
                            </td>
                        </tr>
                        {/if}
                    </table>
                    {/if}
                </td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>    
</div>

<style>
    h2 {
        font-size: larger;
    }
    .TopDownGraphDiv {
        display:block;
        overflow:auto;
    }
    td {
        text-align:center
    }
    table.itemnode {
        background-color: darkgray;
    }
    
    td.outer {
        height:100px;
    }
    td.outer:nth-child(even) {
        width:300px;
    }

    .itemnode td{
        padding-left:10px;
        padding-right:10px;
    }
    .itemnode td.item {
        width: 100px;
        height: 100px
    }
    img {
        width:30px;
        height:30px;
    }
</style>