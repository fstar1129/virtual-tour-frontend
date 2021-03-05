<template>
    <div class="d-flex mb-3 align-items-baseline">
        <b-dropdown id="date-dropdown" :text="presetLabel(preset)" class="mr-3" size="sm">
            <b-dropdown-item v-for="item in presets" 
                :key="item.key"
                @click="switchPreset(item)">
                    {{ presetLabel(item) }}
            </b-dropdown-item>
        </b-dropdown>

        <div class="mr-2">
            <fa :icon="['far', 'calendar-alt']" class="mr-2" size="lg" />
        </div>

        <v-date-picker
            class="date-input f-1"
            mode='range'
            ref="dp"
            :navVisibility="navVisibility"
            @input="switchPreset({key: 'custom', label: 'Custom Date Range'})"
            :max-date="maxDate"
            v-model='date'>
        </v-date-picker>
        <div v-if="showTotalMetrics" class="total-metrics">
            <span>Total Downloads</span><br/>
            <span>{{totalDownloads}}</span>
        </div>
        <div v-if="showTotalMetrics" class="total-metrics">
            <span>Total Revenue</span><br/>
            <span>${{totalRevenue}}</span>
        </div>
    </div>
</template>

<script>
import 'v-calendar/lib/v-calendar.min.css';
import FormatStrings from '../mixins/FormatStrings';
import { mapGetters } from 'vuex';

export default {
    name: 'DatePicker',
    
    mixins: [ FormatStrings ],

    props: {
        'value': {
            type: Object,
            default: () => {
                return {
                    start: moment().subtract(6, 'days').toDate(),
                    end: moment().toDate(),
                }
            },
        }
    },
    props: ['showTotalMetrics', 'isReport'],

    computed: {
        ...mapGetters({
            tour: 'analytics/tour',
        }),

        maxDate() {
            return moment().toDate();
        }
    },

    data() {
        return {
            preset: 'today',
            date: new Date(),
            navVisibility: 'focus',
            presets: [
                { key: 'today', start: moment().toDate(), end: moment().toDate() },
                { key: 'yesterday', start: moment().subtract(1, 'days').toDate(), end: moment().subtract(1, 'days').toDate() },
                { key: 'this_week', label: 'This Week (Sun - Today)', start: moment().day(0).toDate(), end: moment().toDate() },
                { key: 'last_week', label: 'Last Week (Sun - Sat)', start: moment().day(-7).toDate(), end: moment().day(-1).toDate() },
                { key: 'last_7', label: 'Last 7 Days', start: moment().subtract(6, 'days').toDate(), end: moment().toDate() },
                { key: 'last_14', label: 'Last 14 Days', start: moment().subtract(13, 'days').toDate(), end: moment().toDate() },
                { key: 'this_month', start: moment().startOf('month').toDate(), end: moment().toDate() },
                { key: 'last_month', start: moment().subtract(1, 'months').startOf('month').toDate(), end: moment().subtract(1, 'months').endOf('month').toDate() },
                { key: 'all_time', start: new Date(2018, 0, 1), end: moment().toDate() },
            ],
            totalDownloads: 0,
            totalRevenue: 0
        }
    },

    methods: {
        presetLabel(preset) {
            if (preset.label) {
                return preset.label;
            }

            return this.stringFormat(preset.key);
        },

        switchPreset(preset) {
            this.preset = preset;
            if (preset.key == 'custom') {
                return;
            }

            this.date = {
                start: preset.start,
                end: preset.end,
            };
        },
    },

    mounted() {
        console.log(this.showTotalMetrics)
        this.switchPreset({ key: 'this_week', label: 'This Week (Sun - Today)', start: moment().day(0).toDate(), end: moment().toDate() });
        let start = moment(this.date.start).format('MM/DD/YYYY');
        let end = moment(this.date.end).format('MM/DD/YYYY');
        
        if (this.isReport === undefined || !this.isReport) {
            let url = `${this.config.urls.cms}analytics/${this.tour.id}/details/?start=${start}&end=${end}`;
            
            axios.get(url)
                .then( ({ data }) => {
                    var totalDownloads = 0;
                    var totalRevenue = 0;
                    console.log(data);
                    data.data.forEach((item) => {
                        totalDownloads += item.downloads;
                        totalRevenue += item.earning;
                    });
                    this.totalDownloads = totalDownloads;
                    this.totalRevenue = totalRevenue;
                })
                .catch(error => this.loading = false);
        }
    },

    created() {
        this.date = this.value;
    },

    watch: {
        value(newVal, oldVal) {
            if (newVal != oldVal) {
                this.date = this.value;
            }
        },

        date() {
            this.$emit('input', this.date);
            let start = moment(this.date.start).format('MM/DD/YYYY');
            let end = moment(this.date.end).format('MM/DD/YYYY');
            
            if (this.isReport === undefined || !this.isReport) {
                let url = `${this.config.urls.cms}analytics/${this.tour.id}/details/?start=${start}&end=${end}`;
                console.log(url);
                axios.get(url)
                    .then( ({ data }) => {
                        var totalDownloads = 0;
                        var totalRevenue = 0;
                        console.log(data);
                        data.data.forEach((item) => {
                            totalDownloads += item.downloads;
                            totalRevenue += item.earning;
                        });
                        this.totalDownloads = totalDownloads;
                        this.totalRevenue = Math.floor(totalRevenue);
                    })
                    .catch(error => this.loading = false);
            }
        },
    },
}
</script>

<style>
.date-input input:focus { outline: none }
.date-input input {
    cursor: pointer;
    min-width: 250px!important;
    border: 0px;
}
.total-metrics {
    color: red;
    text-align: center;
    margin-right: 50px;
}
</style>