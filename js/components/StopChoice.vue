<template>
    <div class="decision-point">
        <div class="icon-input question-input d-flex mb-2">
            <span class="icon text-uppercase" v-text="letter"></span>
            <input type="text" placeholder="Answer" @input="updateAnswer()" v-model="answer" maxlength="60"/>
            <span class="icon-right" @click="$emit('delete')"><fa :icon="['fas', 'times']"/></span>
        </div>
        <p :class="isMaxDescription ? 'character-count c-red' : 'character-count'">{{ charactersLeft }}</p>
        <next-stop-dropdown :busy="busy" v-model="next_stop_id" @input="updateNextStop()" @changeRoute="updateRoutes" />
        
        <hr>
    </div>
</template>

<script>
export default {
    name: 'StopChoice',
    
    props: {
        busy: { type: Boolean, default: false },
        value: { type: Object, default: {} },
    },

    computed: {
        letter() {
            let alpha = 'abcdefghijklmnopqrstuvwxyz';
            return alpha[this.value.order - 1] + '.';
        },

        charactersLeft: function () {
            let char = this.answer ? this.answer.length : 0;
            const limit = this.maxDescriptionCharacters
            if (char >= limit) {
                this.isMaxDescription = true;
            } else {
                this.isMaxDescription = false;
            }
            return char + ' / ' + limit;
        }
    },

    data: () => ({
        answer: '',
        next_stop_id: '',
        maxDescriptionCharacters: 60,
        isMaxDescription: false,
    }),

    methods: {
        updateRoutes(routes) {
            this.$emit('changeRoute', routes);
        },

        updateAnswer() {
            this.$emit('input', {
                ...this.value,
                answer: this.answer,
            });
        },

        updateNextStop() {
            this.$emit('input', {
                ...this.value,
                next_stop_id: this.next_stop_id,
            });
        },
    },

    watch: {
        value(newVal, oldVal) {
            this.answer = newVal.answer;
            this.next_stop_id = newVal.next_stop_id;
        },
    },

    mounted() {
        this.answer = this.value.answer;
        this.next_stop_id = this.value.next_stop_id;
    },
}
</script>

<style>
.tab-content .decision-point:last-of-type hr {
    display: none !important;
}
</style>