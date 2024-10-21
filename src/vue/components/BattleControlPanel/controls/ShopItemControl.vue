<template>
    <div class="ShopItemControl__row">
        <div v-for="(item, index) in displayItems" :key="index" class="ShopItemControl__item" @click="handleClick(item.order)">
            <div v-if="item.name != ''">
                <BaseControl 
                :name="item.name" 
                :disabled="item.disabled"
                :active="!item.disabled"
                />
            </div>
            <div v-else>
                <BaseControl 
                    :disabled="item.disabled"
                    :active="!item.disabled"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';
import { PropType, computed } from 'vue';
import { ShopItemData } from '~/game/battle/Types';

export default {
    name: 'shopItemControl',
    components: {
        BaseControl
    },
    props: {
        items: {
            type: Array as PropType<ShopItemData[]>,
            default: () => [],
        },
        inventoryList: {
            type: Array as PropType<number[]>,
            default: () => [],
        },
    },
    setup(props) {
        const itemName = ['tower', 'star', 'ship', 'linkor'];

        const displayItems = computed(() => {
            const result = [
                { order: null, name: '', disabled: true },
                { order: null, name: '', disabled: true },
            ];

            props.inventoryList.forEach((id, index) => {
                console.log(id, index, 'id, index');
                if (index < 2) {
                    if(id == null) {
                        result[index] = { order: id, name: '', disabled: true };
                    } else {
                        result[index] = {order: id, name: itemName[id], disabled: false };
                    }
                }
            });

            return result;
        });       

        return {
            displayItems,
           
        };
    },
    methods: {
        handleClick(itemId: number) {
            if(itemId == null) {
                return;
            }
            else {
                this.$client.onBattleInventoryItemActivate(itemId);
            }
        }
    }
}
</script>

<style>
.ShopItemControl__row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    pointer-events: all;
    gap: 5px;
}
</style>
