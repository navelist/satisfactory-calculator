<script lang="ts">
	import type { ProductionNode } from "../scripts/types";
    import { PrimaryItemsCompleixty } from "../scripts/functions"

    export let productionTree: ProductionNode;
    export let images;
    let perComplexityCountNodeArray: Array<Array<CountNode>> = [];
    


    $: if(productionTree) {
        let countNodeMap: CountNodeMap = {};
        recIterateAndCreateCountNodes(countNodeMap, productionTree)
        const maxComplexity = PrimaryItemsCompleixty[productionTree.product.item];
        perComplexityCountNodeArray = Array(maxComplexity + 1).fill("").map(a=>new Array());
        Object.values(countNodeMap).forEach(countNode=> {
            const item = countNode.item;
            const complexity = PrimaryItemsCompleixty[item];
            perComplexityCountNodeArray[maxComplexity - complexity].push(countNode);
        })
    }

    type CountNode = {
        item: string,
        count: number,
        amount: number
    }
    type CountNodeMap = {
        [item: string]: CountNode
    }

    function recIterateAndCreateCountNodes(countNodeMap: CountNodeMap, productionNode: ProductionNode) {
        [
            productionNode.product//, productionNode.byproduct // ignore byproduct for now
        ].forEach(product=> {
            if (product) {
                if (!countNodeMap[product.item]) {
                    countNodeMap[product.item] = {
                        item: product.item,
                        count: 0,
                        amount: 0
                    }
                }
                const countNode = countNodeMap[product.item];
                countNode.count += productionNode.count;
                countNode.amount += product.amountPerMinute;
            }
        })
        productionNode.ingredients.forEach(childNode=>recIterateAndCreateCountNodes(countNodeMap, childNode));
    }
</script>

<div class="top">
    <h2>
        Overall production summary
    </h2>
    <table>
        <tbody>
            {#each perComplexityCountNodeArray as countNodes, i}
            <tr>
                {#each countNodes as countNode, j}
                <td>
                    <div>
                        <img src={images[countNode.item]} alt="">
                    </div>
                    <div>
                        {countNode.item}
                    </div>
                    <div>
                        {countNode.count.toFixed(2)}
                    </div>
                    <div>
                        {countNode.amount.toFixed(2)} / min
                    </div>
                </td>
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>

</div>

<style>
    .top {
        overflow: auto;
    }
    h2 {
        font-size:larger;
    }
    img {
        height:30px;
        width:30px;
    }
    td {
        padding-top:10px;
        padding-bottom:10px;
        text-align: center;
        width:300px;
    }
</style>