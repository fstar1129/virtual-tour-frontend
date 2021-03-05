<template>
    <b-card header="Clients"
        header-bg-variant="secondary"
    >
        <!-- Filters -->
        <b-row class="mb-3">
            <b-col md="6">
                <date-picker v-model="dateRange" :isReport="true" @input="fetchFinancialData()"></date-picker>
            </b-col>
            <b-col md="6">
                <b-form-input v-model="filter" placeholder="Search..." class="ml-auto" />
            </b-col>
        </b-row>

        <spinner v-model="loading"></spinner>

        <!-- Client Table -->
        <b-row v-if="!loading && totalRows">
            <b-col lg="12">
                <b-table
                    :items="items"
                    :fields="fields"
                    :filter="filter"
                    @filtered="onFiltered"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    :per-page="perPage"
                    striped
                    hover
                >
                    <template slot="created_at" slot-scope="{ item }">
                        {{ formatDateTimeFromUTC(item.created_at) }}
                    </template>
                    <template slot="tours_count" slot-scope="{ item }">
                        {{ item.tours_count }} / {{ item.tour_limit }}
                    </template>
                    <template slot="actions" slot-scope="{ item }">
                        <router-link
                                class="btn btn-sm btn-info"
                                :to="{ name: 'admin.client.show', params: { id: item.id } }"
                        >
                            <fa :icon="['far', 'edit']" />
                        </router-link>
                    </template>
                </b-table>

                <!-- Pagination -->
                <b-row>
                    <b-col md="6" >
                        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
                    </b-col>
                    <b-col md="6" class="text-right">
                        Showing {{ showing }} of {{ totalRows }} results
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <b-row v-if="!loading && !totalRows">
            <b-col class="text-center text-muted my-4">
                <h4>No Results</h4>
            </b-col>
        </b-row>

    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import FormatsDates from "../../../mixins/FormatsDates";

export default {
    middleware: ['auth', 'admin'],

    layout: 'admin',

    metaInfo() {
        return { title: 'Report' }
    },
    
    mixins: [ FormatsDates ],

    computed: {
        showing() {
            let start = 1;
            if (this.currentPage > 1) {
                start += this.perPage * (this.currentPage - 1);
            }

            let end = this.currentPage * this.perPage;
            if (end > this.totalRows) {
                end = this.totalRows;
            }
            
            return `${start} - ${end}`;
        }
    },

    data() {
        return {
            items: [],
            itemCount: 0,
            dateRange: {},
            loading: true,
            totalRows: 0,
            fields: {
                id: { sortable: true },
                name: { sortable: true },
                email: { sortable: true },
                tours_count: { sortable: true, label: 'Tours' },
                company_name: { sortable: true, label: 'Organization' },
                revenue: { sortable: true, formatter: val => '$' + val },
                earning: { sortable: true, formatter: val => '$' + val },
            },
            filter: null,
            sortBy: 'name',
            sortDesc: false,
            currentClient: {},
            perPage: 25,
            currentPage: 1,
        };
    },
    
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },

        fetchFinancialData() {
            this.loading = true;

            let start = moment(this.dateRange.start).format('MM/DD/YYYY');
            let end = moment(this.dateRange.end).format('MM/DD/YYYY');
            let url = `${this.config.urls.admin}financial-report?start_date=${start}&end_date=${end}`;
            axios.get(url)
                .then( ({ data }) => {
                    data.sort((a, b) => {
                        if (a.name > b.name) return 1;
                        if (a.name < b.name) return -1;
                        return 0;
                    })
                    this.items = data;
                    this.itemCount = data.length;
                    this.totalRows = this.itemCount;
                    this.loading = false;
                })
                .catch(error => this.loading = false);
            
        }
    },

    watch: {
        filter(val) {
            if (val === '') {
                this.totalRows = this.itemCount;
            }
        },
    },

    async mounted() {
        let start = moment(this.dateRange.start).format('MM/DD/YYYY');
        let end = moment(this.dateRange.end).format('MM/DD/YYYY');
        let url = `${this.config.urls.admin}financial-report?start_date=${start}&end_date=${end}`;
        axios.get(url)
            .then( ({ data }) => {
                this.items = data;
                this.itemCount = data.length;
                this.totalRows = this.itemCount;
                this.loading = false;
            })
            .catch(error => this.loading = false);
    },
}
</script>
