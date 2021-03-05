<template>
    <div class="price-plan d-flex">
        <div class="mx-auto p-5 mt-5 shadow-lg bg-white rounded" style="min-width: 280px;">
            <div class="text-center mb-5 logo">
                <router-link :to="{name:'home'}"><img src="images/junket-logo.png" alt="Junket" class="w-100"></router-link>
            </div>

            <div class="">
                <div class="d-flex justify-content-center price-plan-section">
                    <div v-if="selectedPlan == 'business'" class="business-plan">  
                        <div class="mb-5 w-100">
                            <h2 class="plan-title">Business Plan</h2>
                            <h2 class="pt-3 plan-subtitle">Yearly Billing</h2>
                            <h3 class="plan-price-text">$1188/year ($99/mo)</h3>
                            <b-btn class="plan-price-btn w-100" @click="subscribeToProductPlan('plan_H9EWZvVTC8wnNr', 'business')">Sign Up the Yearly Plan</b-btn>
                        </div>

                        <div>
                            <h2 class="plan-subtitle">Monthly Billing</h2>
                            <h3 class="plan-price-text">$120/mo</h3>
                            <b-btn class="plan-price-btn w-100" @click="subscribeToProductPlan('plan_H9EWueWlNwGU8I', 'business')">Sign Up the Monthly Plan</b-btn>
                        </div>
                    </div>
                    
                    
                    <!-- <div class="divider">

                    </div> -->


                    <div v-if="selectedPlan == 'junketeer'" class="junketeer-plan">
                        <div class="mb-5 w-100">
                            <h2 class="plan-title">Junketeer Plan</h2>
                            <h2 class="pt-3 plan-subtitle">Yearly Billing</h2>
                            <h3 class="plan-price-text">$1428/year ($119/mo)</h3>
                            <b-btn class="plan-price-btn w-100" @click="subscribeToProductPlan('plan_H9EWPOJfOizUar', 'junketeer')">Sign Up the Yearly Plan</b-btn>
                        </div>

                        <div>
                            <h2 class="plan-subtitle">Monthly Billing</h2>
                            <h3 class="plan-price-text">$175/mo</h3>
                            <b-btn class="plan-price-btn w-100" @click="subscribeToProductPlan('plan_H9EWdFokAabVix', 'junketeer')">Sign Up the Monthly Plan</b-btn>
                        </div>
                    </div>
                </div>

                <b-btn class="w-100 plan-back-btn" :to="{ name: 'home' }" style="max-width: 300px; margin: auto;">
                    <fa :icon="['fas', 'arrow-left']"></fa>&nbsp;&nbsp;Back to Dashboard
                </b-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import { apiRequest } from "../utils/stripe-api";

    export default {
        metaInfo() {
            return { title: 'Subscribe' }
        },

        data: () => ({
            selectedPlan: null,
            subscribed: false,
        }),

        computed: {
            ...mapGetters({
                user: 'auth/user',
                isAdmin: 'auth/isAdmin',
                tours: 'tours/list',
            }),
        },

        async mounted() {
            this.selectedPlan = this.$route.params.plan;
            console.log(this.user)
        },

        methods: {
            async putUserSubscription (stripeCustId, planId, planName) {
                const token = this.$store.getters["auth/token"];
                const response =
                    await axios.put(`https://api.wejunket.com/cms/profile/subscribe?stripe_cust_id=${stripeCustId}&plan_id=${planId}&plan_name=${planName}`,
                        {
                            headers: {
                                Authorization: "Bearer" + token,
                            },
                        }).then(({data}) => {
                            console.log(data)
                        });

                return response
            },

            async subscribeToProductPlan (
                productPlan,
                planName
            ) {
                const bodyParams = {
                    productPlan,
                    site: false
                };
                const stripe = new Stripe("pk_live_uxd6HeUw9seFvb8OiZadfpFg00LxB4Q0vK");
                const response = await apiRequest(
                    "https://ilqyq22pv5.execute-api.us-east-1.amazonaws.com/dev/create-customer",
                    "POST",
                    bodyParams
                ).then(res => {
                    const put = this.putUserSubscription(res.customer, productPlan, planName);
                    stripe.redirectToCheckout({
                        sessionId: res.id
                    })
                }).catch(e => {
                    console.log(e.message);
                })
            }
        },
    }
</script>

<style scoped>

    .price-plan>div{
            padding: 50px 140px!important;
        }

    .price-plan .logo{
        max-width: 350px;
        margin: auto;
    }

    .price-plan-section{
        flex-wrap: wrap;
    }

    .price-plan .business-plan, .junketeer-plan{
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .plan-title{
        font-size: 2.5rem;
        color: #70c397;
    }

    .plan-subtitle{
        font-size: 1.5rem;
    }

    .plan-price-text{
        font-size: 14px;
        font-weight: 500;
    }

    .plan-back-btn{
        margin-top: 100px!important;
        background-color: #ea3844!important;
    }

    .plan-back-btn:hover{
        background-color: #a72d36!important;
    }

    .divider{
        background-color: #2f3541;
        width: 1px;
        height: 100;
        margin: 80px;
    }


    @media (max-width: 600px) {

        .price-plan .logo{
            max-width: 200px;
            margin: auto;
        }

        .price-plan>div{
            padding: 50px 20px!important;
        }

        .plan-title{
            font-size: 2rem;
            color: #70c397;
        }

        .plan-subtitle{
            font-size: 1.2rem;
        }

        .plan-price-text{
            font-size: 14px;
            font-weight: 500;
        }

        .plan-price-btn{
            font-size: 14px!important;
        }

        .plan-back-btn{
            font-size: 13px;
        }

        .divider{
             width: 100%;
            height: 2px;
        }
    }


</style>

