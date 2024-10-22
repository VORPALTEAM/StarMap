<template>
    <div class="ShopItemControl__row">
        <div v-for="(item, index) in displayItems" :key="index" class="ShopItemControl__item">
            <div 
            v-if="item.name != ''" 
            :class="['ShopItemControl__item-name', { '--index': index === 1 }]"
            @click="handleClick(item.order)"
            >
                <BaseControl 
                :name="item.name" 
                :disabled="item.disabled"
                :active="!item.disabled"
                :is-inventory="true"
                />
            </div>
            <div v-else :class="['ShopItemControl__item-name', { '--index': index === 1 }]">
                <BaseControl 
                :disabled="item.disabled"
                :active="!item.disabled"
                :is-inventory="true"
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
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    pointer-events: all;
    gap: 5px;
}

.ShopItemControl__item {
    width: 32px;
    height: 36px;
}

.ShopItemControl__item-name {
    position: absolute;
    bottom: 36px;
    left: -13px;
    width: 58px;
}

.--index {
    bottom: -12px;
}
</style>
