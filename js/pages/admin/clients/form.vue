<template>   
    <div>
        <b-form @submit.prevent="submit">
            
            <b-form-group label="Name:" label-for="name">
                <b-form-input id="name"
                    :disabled="form.busy"
                    type="text"
                    v-model="form.name"
                    required
                    autofocus
                    placeholder="Name">
                </b-form-input>
                <input-help :form="form" field="name" text=""></input-help>
            </b-form-group>
            
            <b-form-group label="Organization Name:" label-for="company_name">
                <b-form-input id="company_name"
                    :disabled="form.busy"
                    type="text"
                    v-model="form.company_name"
                    required
                    placeholder="Organization Name">
                </b-form-input>
                <input-help :form="form" field="company_name" text=""></input-help>
            </b-form-group>
            
            <b-form-group label="Email:" label-for="email">
                <b-form-input id="email"
                    :disabled="form.busy"
                    type="email"
                    v-model="form.email"
                    required
                    placeholder="Email">
                </b-form-input>
                <input-help :form="form" field="email" text=""></input-help>
            </b-form-group>
            
            <b-form-group label="Zipcode:" label-for="zipcode">
                <b-form-input id="zipcode"
                    :disabled="form.busy"
                    type="text"
                    v-model="form.zipcode"
                    required
                    placeholder="Zipcode">
                </b-form-input>
                <input-help :form="form" field="zipcode" text=""></input-help>
            </b-form-group>
            
            <b-form-group label="Number of Junkets:" label-for="tour_count">
                {{ client.tours_count }}
            </b-form-group>

            <b-form-group class="mb-30" label="Junkets">
                <b-form-select 
                    v-model="junket_title">
                    <option value="0">Select a Junket to access</option>
                    <option v-for="junket in client.junkets" :key="junket.id" :value="junket.id">
                        {{junket.title}}
                    </option>
                </b-form-select>
                <input-help :form="form" field="plan_name" text=""></input-help>
            </b-form-group>
            
            <b-form-group label="Max Number of Junkets:" label-for="tour_limit">
                <b-form-input id="tour_limit"
                    :disabled="form.busy"
                    type="text"
                    v-model="form.tour_limit"
                    required>
                </b-form-input>
                <input-help :form="form" field="tour_limit" text=""></input-help>
            </b-form-group>
            
            <b-form-group v-if="! hasClient" label="Password:" label-for="password">
                <b-form-input id="password"
                    :disabled="form.busy"
                    type="password"
                    v-model="form.password"
                    required
                    autocomplete="new-password"
                    placeholder="Password">
                </b-form-input>
                <input-help :form="form" field="password" text=""></input-help>
            </b-form-group>
            
            <b-form-group label="Subscription Override:" label-for="subscribe_override">
                <b-form-checkbox v-model="form.subscribe_override"
                                unchecked-value="0">
                Force Subscription
                </b-form-checkbox>
                <input-help :form="form" field="subscribe_override" text="When checked, this will force the mobile app to treat this user as subscribed without requiring payment."></input-help>
            </b-form-group>
            
        </b-form>
    </div>
</template>

<script type='es6'>
    export default {
        name: 'ClientForm',

        props: {
            client: Object,
            autoReset: {
                type: Boolean,
                default: false,
            }
        },
        
        data() {
            return {
                'form': new Form({
                    name: '',
                    email: '',
                    zipcode: '',
                    password: '',
                    tour_limit: 0,
                    subscribe_override: 0,
                }),
                junket_title: 0
            }
        },

        watch: {
            'client': () => {
                console.log('client changed');
            },
            junket_title(newValue, oldValue) {
                if (newValue !== 0) {
                    window.open("https://cms.wejunket.com/#/tour/" + newValue, "_blank");
                }
            }
        },

        computed: {
            hasClient() {
                return this.client.id ? true : false;
            },

            url() {
                let url = this.config.urls.admin + 'clients';
                if (this.hasClient) {
                    url = url + `/${this.client.id}`;
                }
                return url;
            },
        },

        mounted() {
            if (this.client.id) {
                this.form = new Form(this.client);
            }
        },

        methods: {
            submit() {
                this.form.resetOnSuccess = !this.hasClient;

                let method = this.hasClient ? 'patch' : 'post';
                
                return this.form.submit(method, this.url);
            },

            reset() {
                this.form.reset();
            }
        }
    }
</script>
