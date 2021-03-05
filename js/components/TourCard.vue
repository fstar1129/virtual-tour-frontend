<template>
    <div class="tour-box">
        <a class="heading bg-fit" :href="'#/tour/'+tour.id" :style="backgroundImage" style="display: block">
            <div class="title">
                {{ tour.title }}<br />{{ location }}
            </div>
            <div class="category" :class="typeClass">
                <fa :icon="['fas', 'map-marker-alt']" />&nbsp;{{ this.tour.type }}
            </div>
            <div class="count">
                <fa :icon="['fas', 'map-marker-alt']" />&nbsp;{{ this.tour.stops_count }}
            </div>
        </a>
        <div class="footer d-flex p-1">
            <div v-if="showAnalytics">
                <router-link :to="{ name: 'analytics.overview', params: { id: this.tour.id } }" class="skinny">
                    <fa :icon="['fas', 'chart-bar']" />&nbsp;Analytics
                </router-link>
            </div>
            <div v-if="tour.published_at !== null" class="ml-auto">
                <a href="#" class="skinny" @click.prevent="openCopyLinkModal" v-b-tooltip.hover title="See Options"><fa :icon="['fas', 'link']" />&nbsp;LINKS</a>
            </div>
        </div>
        <copy-modal ref="confirm" :link="tourLink" :tourTitle="tourTitle" :tourCity="tourCity" :tourPremium="tourPremium">
        </copy-modal>
    </div>
</template>

<script>
export default {
    name: "TourCard",

    props: ['tour', 'showAnalytics'],

    data () {
        return {
            tourLink: this.tour.id,
            tourTitle: this.tour.title,
            tourCity: this.tour.location.city,
            tourPremium: this.tour.pricing_type
        }
    },
    computed: {
        typeClass() {
            return this.tour.type == 'adventure' ? 'bg-success' : 'bg-info';
        },

        location() {
            if (this.tour.city && this.tour.state) {
                return this.tour.city + ', ' + this.tour.state;
            }
            return '';
        },

        backgroundImage() {
            let url = this.imagePath(this.tour.main_image, 'sm');
            if (url) {
                return `background: url(${url})`;
            } else {
                return '';
            }
        },
    },

    methods: {
        editTour() {
            this.$router.push({ name: 'tour', params: { id: this.tour.id } });
        },
        
        openCopyLinkModal() {
            this.$refs.confirm.confirm();
        }
    },
}
</script>