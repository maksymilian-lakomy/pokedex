<template>
    <div class="pokemon-card__portrait" ref="wrapper">
        <slot />
        <img
            ref="placeholder"
            :style="{'max-width': maxSize, 'max-height': maxSize}"
            class="pokemon-card__portrait__img pokemon-card__portrait__img--placeholder"
            src="@/assets/pokemon-placeholder.png"
            @load="setColumnSize()"
            v-show="!loaded"
        />
        <span
            class="pokemon-card__portrait__img--placeholder__message"
            v-if="!pokemonData.sprites.frontDefault"
        >No image</span>
        <img
            ref="portrait"
            class="pokemon-card__portrait__img"
            :style="{'max-width': maxSize, 'max-height': maxSize}"
            :class="{'pokemon-card__portrait__img--filter': this.filterPortrait, ...customClasses}"
            :src="pokemonData.sprites.frontDefault"
            @load="onLoaded($event)"
            v-show="loaded"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import PokemonData from '@/classes/PokemonData';

@Component
export default class PokemonPortrait extends Vue {
    @Prop({ required: true, type: Object })
    pokemonData!: PokemonData;

    @Watch('pokemonData')
    onPokemonDataChange(current: PokemonData, previous: PokemonData) {
        if (current.sprites.frontDefault === previous.sprites.frontDefault)
            return;
        this.loaded = false;
    }

    @Prop({ required: true, type: String })
    generation!: string;

    @Prop({
        required: false,
        type: Object,
        default: function() {
            return {};
        }
    })
    customClasses!: Record<string, boolean>;

    mounted() {
        addEventListener('resize', this.setColumnSize);
    }

    destroyed() {
        removeEventListener('resize', this.setColumnSize);
    }

    maxSize = '16px';

    setColumnSize() {
        let portrait = this.$refs.portrait as HTMLImageElement;
        if (portrait.src.length === 0)
            portrait = this.$refs.placeholder as HTMLImageElement;
        const wrapper = this.$refs.wrapper as HTMLElement;
        const multiply = Math.floor(
            wrapper.offsetWidth / portrait.naturalWidth
        );
        const size = portrait.naturalWidth * multiply + 'px';
        this.maxSize = size;
        wrapper.style.height = wrapper.offsetWidth + 'px';
    }

    loaded = false;

    onLoaded(event: Event) {
        this.loaded = true;
        this.setColumnSize();
    }

    get filterPortrait() {
        return (
            ['generation-vii', 'generation-viii'].indexOf(this.generation) !==
            -1
        );
    }
}
</script>

<style lang="sass">
.pokemon-card__portrait
    position: relative
    max-width: 100%
    max-height: 100%
    background-color: #E9E9E9
    border-radius: 1em
    overflow: hidden
    display: flex
    justify-content: center
    align-items: center

    &__img
        transition-duration: .25s
        width: 100%
        height: 100%
        image-rendering: pixelated
    &__img--placeholder
        opacity: 0.1
        position: relative
        &__message
            position: absolute
            width: 100%
            text-align: center
            left: 0
            color: #707070
            font-weight: bold
            top: 50%
            font-size: 2em
            transform: translateY(-50%)
    &__img--filter
        image-rendering: auto !important
</style>