<template>
    <div class="content">
        <date-picker v-model="dateRange" @input="fetch()"></date-picker>

        <div class="mt-4 mb-4">
            <b-button class="d-inline" size="sm" :class="{'grey-btn': mode != 'downloads'}" @click="mode = 'downloads'" style="width:200px;height:50px;padding-top:4px">Total<br/>Downloads</b-button>
            <b-button class="d-inline" size="sm" :class="{'grey-btn': mode != 'revenue_display'}" @click="mode = 'revenue_display'" style="width:200px;height:50px;padding-top:4px">Revenue<br/>generated</b-button>
            <b-button class="d-inline" size="sm" :class="{'grey-btn': mode != 'time_spent'}" @click="mode = 'time_spent'" style="width:200px;height:50px;padding-top:4px">Total Time</b-button>
        </div>
        <div class="mt-4 mb-4" style="display:flex;">
            <div class="p-info" :class="{'invisible': mode != 'downloads'}">{{totalDownloads}}</div>
            <div class="p-info" :class="{'invisible': mode != 'revenue_display'}">${{totalRevenue}}</div>
            <div class="p-info" :class="{'invisible': mode != 'time_spent'}">
                <p>{{totalDays}}<span class='sm-font'>days </span>{{totalHours}}<span class='sm-font'>hrs </span>{{totalMins}}<span class='sm-font'>min</span></p>
            </div>
        </div>

        <spinner v-model="loading" class="mt-5" />

        <div v-if="! loading" class="chart-container">
            <line-chart style="height: 50vh; min-height: 100px" :chart-data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script>
import FormatsNumbers from '../../mixins/FormatsNumbers';
import FormatStrings from '../../mixins/FormatStrings';
import { mapGetters } from 'vuex';

export default {
    middleware: ['auth'],

    layout: 'analytics',

    mixins: [ FormatsNumbers, FormatStrings ],
    
    metaInfo() {
        return { title: 'Analytics Details' }
    },
        
    data() {
        return {
            loading: true,
            dateRange: {},
            mode: 'downloads',
            items: [],
            chartColor: '#79acd1',
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false, 
            },
            totalDownloads: 0,
            totalDays: 0,
            totalHours: 0,
            totalMins: 0,
            totalRevenue: 0,
        };
    },
    
    computed: {
        ...mapGetters({
            user: 'auth/user',
            tour: 'analytics/tour',
        }),

        dataPoints() {
            return this.items.map(item => {
                switch (this.mode) {
                    case 'time_spent':
                        return item.time;
                    case 'actions':
                        return item.actions;
                    case 'revenue_display':
                        return item.revenues;
                    default:
                        return item.downloads;
                }
            });
        },

        labels() {
            return this.items.map(item => {
                return moment(item.yyyymmdd, 'YYYYMMDD').format('MM/DD/YY');
            });
        },

        chartData() {
            return {
                labels: this.labels,
                datasets: [
                    {
                        label: this.stringFormat(this.mode),
                        borderColor: this.chartColor,
                        backgroundColor: this.chartColor,
                        data: this.dataPoints,
                    },
                ],
            };
        },
    },

    methods: {
        fetch() {
            this.loading = true;

            let start = moment(this.dateRange.start).format('MM/DD/YYYY');
            let end = moment(this.dateRange.end).format('MM/DD/YYYY');
            
            let url = `${this.config.urls.cms}analytics/${this.tour.id}/details/?start=${start}&end=${end}`;
            axios.get(url)
                .then( ({ data }) => {
                    if (data.data.length == 1) {
                        // if a single day is selected, display that data twice so 
                        // the line takes up the whole chart.
                        this.items = [data.data[0], data.data[0]];
                    } else {
                        this.items = data.data;
                    }
                    this.loading = false
                    var totalDownloads = 0;
                    var totalMins = 0;
                    var totalRevenue = 0;
                    data.data.forEach((item) => {
                        totalDownloads += item.downloads;
                        totalMins += item.time;
                        totalRevenue += item.revenues;
                    });
                    this.totalDownloads = totalDownloads;
                    this.totalDays = parseInt(totalMins / 24 / 60);
                    this.totalHours = parseInt(totalMins / 60 % 24);
                    this.totalMins = totalMins % 60;
                    this.totalRevenue = totalRevenue;
                })
                .catch(error => this.loading = false);
        }
    },

    watch: {
        mode(to, from) {
            if (to === from) {
                return;
            }

            console.log('mode changed');
        },
    }
}
</script>
<style>
.grey-btn {
    color: #3e4759;
    background-color: #ebecee;
}
.p-info {
    width: 200px;
    padding: 4px 8px;
    text-align: center;
    border: 1px solid #3e4759;
    margin-right: 5px;
    font-size: 24px;
}
.p-info p {
    margin-bottom: 0;
}
.sm-font {
    font-size: 12px;
}
.invisible {
    visibility: hidden;
}
</style>