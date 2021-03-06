<template>
    <div class="content">
        <date-picker v-model="dateRange" @input="fetch()" :showTotalMetrics="true"></date-picker>
        <div class="table-responsive">
            <spinner v-model="loading" class="mt-5" />
            <b-table striped hover show-empty
                v-if="! loading" 
                :items="items"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
            >
            </b-table>
        </div>
    </div>
</template>

<script>
import FormatsNumbers from '../../mixins/FormatsNumbers';
import { mapGetters } from 'vuex';

export default {
    middleware: ['auth'],

    layout: 'analytics',

    mixins: [ FormatsNumbers ],
    
    metaInfo() {
        return { title: 'Analytics Overview' }
    },

    data() {
        return {
            dateRange: {},
            loading: false,
            sortBy: 'order',
            sortDesc: false,
            items: [],
            fields: [
                {
                    key: 'order',
                    label: 'Stop No.',
                    sortable: true,
                },
                {
                    key: 'title',
                    label: 'Stop Title',
                    sortable: true,
                },
                {
                    key: 'time',
                    label: 'Time Spent',
                    sortable: true,
                    formatter: (value) => { return this.minuteFormat(value) },
                },
                {
                    key: 'visits',
                    label: 'Visitors',
                    sortable: true,
                    formatter: (val) => this.numberCommasFormat(val),
                },
            ],
        }
    },

    computed: mapGetters({
        user: 'auth/user',
        tour: 'analytics/tour',
    }),

    methods: {
        fetch() {
            this.loading = true;

            let start = moment(this.dateRange.start).format('MM/DD/YYYY');
            let end = moment(this.dateRange.end).format('MM/DD/YYYY');
            
            let url = `${this.config.urls.cms}analytics/${this.tour.id}/overview/?start=${start}&end=${end}`;
            axios.get(url)
                .then( ({ data }) => {
                    this.items = data.stops;
                    this.loading = false
                })
                .catch(error => this.loading = false);
        }
    },

    mounted() {
    },
}
</script>
