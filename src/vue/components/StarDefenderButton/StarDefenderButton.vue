<template>   
    <div class="StarDefenderButton">
        <div class="StarDefenderButton__container" :style="containerStyle">
            <transition name="fade">
                <div class="StarDefenderButton__connectLine">
                <img src="/gui/images/star-defender/connect-line.svg" />
                <div class="StarDefenderButton__content">
                    <div class="StarDefenderButton__bg" >
                        <img src="/gui/images/star-defender/bg.svg" />
                        <div class="StarDefenderButton__name">
                            {{ name }}
                        </div>
                        <div class="StarDefenderButton__title --bold" @click="handleClick">
                            {{ title }}
                        </div>
                        <div class="StarDefenderButton__online exo2-font">
                            on line: 4000469
                        </div>
                    </div>
                </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { formatDuration } from '@/utils';
import { PropType } from 'vue';
import { StarScreenPosition } from '@/models';

export default {
    name: 'StarDefenderButton',
    props: {
        name: {
            type: String
        },
        title: {
            type:String
        },
        position: {
        type: Object as PropType<StarScreenPosition>
        }
    },
    computed: {
       containerStyle() {
            return {
                width: `${this.position.x}px`,
                height: `${this.position.y}px`
            }
       },
     
    },
    methods: {
        handleClick() {
            console.log('click=============')
            this.$emit('click')
        }
    }
   
}
</script>

<style scoped src="./StarDefenderButton.css"></style>
