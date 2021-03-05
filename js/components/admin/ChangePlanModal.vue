<template>
    <b-modal id="ChangePlanModal" :title="title" v-model="show">
        
                <b-form @submit.prevent="submit">
                    
                    <b-form-group class="mb-30">
                        <h6>
                            <fa class="fa-flip-horizontal" :icon="['fas', 'tag']" />
                            ACTIVE PLAN
                        </h6>
                        <b-form-select 
                            class="plan-modal-form"
                            v-model="form.pricing_plan_id"
                            :disabled="form.pricing_plan_id === (active_plan ? active_plan.id : 1)">
                            <option v-for="plan in pricing_plans" :key="plan.id" :value="plan.id">
                                {{capitalize(plan.plan_name)}} ${{plan.cost}}/month
                                {{plan.plan_name !== 'starter' ? '' : '(2020 Promo)'}} {{plan.billing_cycle === 'year' ? '(Billed Annually)' : ''}}
                            </option>
                        </b-form-select>
                        <input-help :form="form" field="plan_name" text=""></input-help>
                    </b-form-group>

                    <b-form-group class="mb-30">
                        <h6>
                            <fa class="fa-flip-horizontal" :icon="['fas', 'random']" />
                            CHANGE PLAN
                        </h6>
                        <b-btn class="upgrade-btn" variant="outline-secondary" @click.prevent="upgradePlan()">
                            <fa class="mr-10" :icon="['fas', 'chevron-up']" />UPGRADE
                        </b-btn>
                        <b-btn class="upgrade-btn" variant="outline-secondary" @click.prevent="downgradePlan()">
                            <fa class="mr-10" :icon="['fas', 'chevron-down']" />DOWNGRADE
                        </b-btn>
                    </b-form-group>

                    <b-form-group>
                        <h6>
                            NUMBER OF JUNKETS
                        </h6>
                        <b-form-input id="numberOfJunket"
                            class="plan-modal-form"
                            :disabled="form.pricing_plan_id === (active_plan ? active_plan.id : 1) && disableNumberOfJunket"
                            type="text"
                            v-model="form.tour_limit"
                            required
                            placeholder="Title">
                        </b-form-input>
                        <input-help :form="form" field="numberOfJunket" text=""></input-help>
                    </b-form-group>

                    <b-form-group class="mb-30">
                        <p>
                            Add an additional Junket at $29/month
                        </p>
                        <b-btn class="upgrade-btn" variant="outline-secondary" @click.prevent="addJunkets()">
                            <fa class="mr-10" :icon="['fas', 'chevron-up']" />UPGRADE
                        </b-btn>
                        <b-btn class="upgrade-btn" variant="outline-secondary" @click.prevent="subtractJunkets()">
                            <fa class="mr-10" :icon="['fas', 'chevron-down']" />DOWNGRADE
                        </b-btn>
                    </b-form-group>
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" id="unlimited" v-model="checkTOS">
                        <label class="custom-control-label" for="unlimited">I agree to Terms and Conditions</label>
                    </div>
                </b-form>
        
        <div slot="modal-footer">
            <b-btn variant="primary" @click.prevent="confirmChange()" :disabled="busy || !checkTOS">CONFIRM CHANGES</b-btn>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'ChangePlanModal',

    props: {
        title: {
            type: String,
            default: 'Change Plan',
        },
        user_id: {
            type: Number,
        },
        active_plan: {
            type: Object,
        },
        pricing_plans: {
            type: Array,
        },
        tour_limit: {
            type: Number,
        }
    },

    data: () => ({
        form: new Form({
            pricing_plan_id: 1,
            tour_limit: 1,
        }),
        busy: false,
        show: false,
        checkTOS: false,
        disableNumberOfJunket: true,
    }),

    methods: {
        confirmChange() {
            this.busy = true;
            this.form.patch(this.config.urls.admin + `change-plan/${this.user_id}`)
                .then( ({ data }) => {
                    this.busy = false;
                    this.show = false;
                })
                .catch( e => {
                    this.busy = false;
                });
        },

        openModal() {
            this.show = true;
        },

        capitalize(s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        },

        upgradePlan() {
            if (this.form.pricing_plan_id < this.pricing_plans.length) {
                this.form.pricing_plan_id ++;
                this.form.tour_limit = this.pricing_plans[this.form.pricing_plan_id - 1].tour_limit;
            }
            if (this.form.pricing_plan_id === this.active_plan.id) {
                this.form.tour_limit = this.tour_limit;
                this.disableNumberOfJunket = true;
            }
        },

        downgradePlan() {
            if (this.form.pricing_plan_id > 1) {
                this.form.pricing_plan_id --;
                this.form.tour_limit = this.pricing_plans[this.form.pricing_plan_id - 1].tour_limit;
            }
            if (this.form.pricing_plan_id === this.active_plan.id) {
                this.form.tour_limit = this.tour_limit;
                this.disableNumberOfJunket = true;
            }
        },

        addJunkets() {
            this.form.tour_limit ++;
            this.disableNumberOfJunket = false;
        },

        subtractJunkets() {
            if (this.form.tour_limit > this.pricing_plans[this.form.pricing_plan_id - 1].tour_limit) {
                this.form.tour_limit --;
                this.disableNumberOfJunket = false;
            }
        }
    },

    watch: {
      	active_plan: function(newVal, oldVal) {
          this.form.pricing_plan_id = newVal ? newVal.id : 1;
        },
        tour_limit: function(newVal, oldVal) {
          this.form.tour_limit = newVal;
        },
        'form.pricing_plan_id': function(newVal, oldVal) {
            this.form.tour_limit = this.pricing_plans[newVal - 1].tour_limit;
            if (newVal === this.active_plan.id) {
                this.form.tour_limit = this.tour_limit;
            }
        }
    }
}
</script>

<style scoped>
h6 {
    margin-bottom: 15px;
}
.mr-10 {
    margin-right: 10px;
}
.upgrade-btn {
    margin-right: 20px;
    padding-right: 30px;
    padding-left: 30px;
    font-weight: bold;
    background-color: #dddfe3;
    border: 0;
}
.upgrade-btn:hover {
    background-color: #3e4759;
}
.plan-modal-form {
    border-radius: 20px;
}
.mb-30 {
    margin-bottom: 30px;
}
</style>
