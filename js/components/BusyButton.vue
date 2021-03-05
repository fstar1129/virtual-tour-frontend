<template>
    <b-btn :variant="variant" :size="size" :disabled="busy" @click="onClick" v-b-tooltip.hover :title="hoverTitle">
        <fa v-if="busy" class="fa-spin" :icon="['fas', 'spinner']" />
        <span v-else>
            <slot></slot>
        </span>
    </b-btn>
</template>

<script>
export default {
    name: 'BusyButton',

    props: {
        variant: String,
        size: {
            type: String,
            default: 'md',
        },
        busy: Boolean,
        hoverTitle: String
    },

    methods: {
        onClick(e) {
            this.$emit('click', e);
        },
    }
}
</script>
