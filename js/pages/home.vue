<template>
    <div>
        <div v-if="user.email_confirmed_at === null" class="d-flex">
            <div class="mx-auto auth-box mt-5 shadow-lg bg-white rounded" >
                <div class="text-center mb-5">
                    <img src="images/junket-logo.png" alt="Junket" class="w-100">
                </div>
                <div class="text-center">
                    Please confirm your email address!
                </div>
            </div>
        </div>
        <div v-else class="wrapper shadow-lg">
            <!-- DASHBOARD --> 
            <div class="p-50 bg-white d-flex flex-column right-side">
                <div class="f-1">
                    <!-- LOGO -->            
                    <div class="text-center mb-5">
                        <img src="images/junket-logo.png" alt="Junket" class="w-100" />
                    </div>

                    <!-- Search bar -->
                    <div class="icon-input search-input mb-5 d-flex">
                        <span class="icon"><fa :icon="['fas', 'search']"/></span>
                        <input type="text" placeholder="Search Junkets" v-model="filter" />
                    </div>

                    <!-- Nav Buttons -->
                    <div class="p-2">
                        <b-btn variant="primary" class="w-100" @click.prevent="addModal()">
                            <fa :icon="['fas', 'plus']" />&nbsp;Add a Junket
                        </b-btn>
                    </div>
                    <div class="p-2">
                        <b-btn variant="primary" class="w-100" @click.prevent="planModal()">
                            <fa :icon="['fas', 'paper-plane']" />&nbsp;&nbsp;&nbsp;My Plan
                        </b-btn>
                    </div>
                    <div class="p-2">
                        <b-btn variant="secondary" class="w-100" :to="{'name' : 'profile'}" >
                            <fa :icon="['fas', 'cog']" />&nbsp;My Account
                        </b-btn>
                    </div>
                </div>

                <!-- Footer Icons -->
                <div class="mt-auto">
                    <div class="d-flex flex-row">
                        <a href="#" @click.prevent="logout">
                            <fa :icon="['fas', 'sign-out-alt']" />&nbsp;LOGOUT
                        </a>
                        <a v-if="isAdmin" href="/#/admin" class="ml-auto">
                            <fa :icon="['fas', 'lock']" />&nbsp;ADMIN
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="left-side">
                <!-- JUNKET LIST -->
                <div class="left-side__tours">
                    <div class="bg-gray compass-bg p-3">
                        <spinner v-model="loading"></spinner>
                        <div v-if="! loading && filteredTours.length == 0" class="no-results">No Junkets</div>
                        <div v-if="! loading">
                            <b-row  v-for="i in Math.ceil(tours.length / 3)" :key="i">
                                <b-col class="box-col" xl="4" v-for="item in filteredTours.slice((i - 1) * 3, i * 3)" :key="item.id">
                                    <tour-card :tour="item" :showAnalytics="user.plan_name !== 'starter'"/>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
                <div class="left-side__message">
                    <div class="left-side__message-bar">
                        <span class="left-side__message-bar__text">Messages</span>
                        <fa v-if="!collapsed" :icon="['fas', 'minus']" class="left-side__message-bar__icon-minus collapsible" @click.prevent="togglePopUp()"/>
                        <fa v-else :icon="['fas', 'angle-up']" class="left-side__message-bar__icon-up collapsible" @click.prevent="togglePopUp()"/>
                    </div>
                    <div class="left-side__message-content">
                        <h1 class="welcome-text">Welcome to Junket!</h1>
                        <div class="main-content">
                            <div class="content1">
                                <h1>How to create a Junket</h1>
                                <div class="video-container">
                                    <youtube video-id="5mGjnydvW9E"/>
                                </div>
                            </div>
                            <div class="content2">
                                <h1>How to create an Adventure</h1>
                                <div class="video-container">
                                    <youtube video-id="mUYYgdBnYfM"/>
                                </div>
                                <ul>
                                    <li>
                                        <p @click="goToAdventureGuide()">Read this guide on creating Adventures</p>
                                    </li>
                                </ul>
                            </div>
                            <div class="content3">
                                <h1>News & Updates</h1>
                                <ul>
                                    <li>
                                        <p @click="goToFAQ()">FAQ</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            <!-- ADD TOUR MODAL -->
            <b-modal title="Create a Junket" v-model="showAddModal">
                <tour-form ref="addForm" v-if="showAddModal" />

                <div slot="modal-footer" class="w-100">
                    <busy-button class="float-right" variant="primary" :busy="busy" @click="add">Create Junket</busy-button>
                    <b-btn variant="secondary" @click="showAddModal = false">Cancel</b-btn>
                </div>
            </b-modal>
            <!-- /end ADD TOUR MODAL -->


            <!-- ADD PLAN SELECTION MODAL -->
            <b-modal id="modal-lg" centered size="lg" no-close-on-esc no-close-on-backdrop v-model="showPlanSelectionModal">
                <div slot="modal-header" class="w-100 plan-modal">
                    <h5>Sign up a Junket Pricing Model</h5>
                </div>
                <div class="model-section">
                    <div class="model-item" :class="user.plan_name === 'starter'?'select':''">
                        <div class="plan-feature-list">
                            <!-- <img src="../../assets/images/starter-new.svg" class="mb-17" @click="goSubscribe('starter')" /> -->
                            <price-plan :plan="'starter'" />
                        </div>
                        <div class="selected-plan-txt" v-if="user.plan_name === 'starter'">This is your current plan</div>
                        <busy-button v-else class="float-right price-plan-btn" variant="primary" :busy="busy" @click="cancelSubscription(user.stripe_cust_id)">Select Plan</busy-button>
                    </div>
                    <div class="model-item" :class="user.plan_name === 'business'?'select':''">
                        
                        <div class="plan-feature-list">
                            <!-- <img src="../../assets/images/business-new.svg" class="mb-17 " @click="goSubscribe('business')" /> -->
                            <price-plan :plan="'business'" />
                        </div>
                        <div class="selected-plan-txt" v-if="user.plan_name === 'business'">This is your current plan</div>
                        <busy-button class="float-right price-plan-btn" v-else variant="primary" :busy="busy" @click="goSubscribe('business')">Select Plan</busy-button>
                    </div>
                    <div class="model-item" :class="user.plan_name === 'junketeer'?'select':''">
                        <div class="plan-feature-list">
                            <!-- <img src="../../assets/images/junketeer-new.svg" class="mb-17" @click="goSubscribe('junketeer')"/> -->
                            <price-plan :plan="'junketeer'" />
                        </div>
                        <div class="selected-plan-txt" v-if="user.plan_name === 'junketeer'">This is your current plan</div>
                        <busy-button class="float-right price-plan-btn" v-else variant="primary" :busy="busy" @click="goSubscribe('junketeer')">Select Plan</busy-button>
                    </div>
                </div>
                <div slot="modal-footer" class="w-100 text-center">
                    <b-btn variant="outline-secondary" @click="skipSelectModel" style="width: 120px;">Cancel</b-btn>
                </div>
            </b-modal>
            <!-- /end PLAN SELECTION MODAL -->
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { apiRequest } from "../utils/stripe-api";
import TourForm from '../components/TourForm';

export default {
    middleware: 'auth',

    metaInfo() {
        return { title: 'Home' }
    },
    
    components: {
        'tour-form': TourForm,
    },

    async mounted() {
        this.$store.commit('tours/setUrl', this.config.urls.cms);
        this.$store.commit('tours/clearCurrentTour');
        await this.$store.dispatch('tours/fetchTours');
        this.loading = false;
    },

    data: () => ({
        loading: true,
        filter: '',
        showAddModal: false,
        busy: false,
        collapsed: false,
        fitParent: true,
        subscribed: false,
        showPlanPopup: false
    }),

    computed: {
        ...mapGetters({
            user: 'auth/user',
            isAdmin: 'auth/isAdmin',
            tours: 'tours/list',
        }),

        filteredTours() {
            if (this.filter == '') return this.tours;

            return this.tours.filter(x => 
                x.title.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
                || (x.zipcode && x.zipcode.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0)
            );
        },

        showPlanSelectionModal: {
            get: function() {
                return this.user.show_popup || this.showPlanPopup === true;
            },
            set: function() {
            }
        }
    },

    methods: {
        async logout () {
            this.$store.commit('auth/logout');
            window.location = '/';
        },

        add() {
            this.busy = true;
            this.$refs.addForm.submit()
                .then( ({ data }) => {
                    this.$router.push({ name: 'tour', params: { id: data.data.id } });
                    this.busy = false;
                })
                .catch(e => {
                    console.log(e);
                    this.busy = false;
                });
        },

        addModal() {
            this.$store.commit('tours/setEmptyTour');
            this.showAddModal = true;
        },

        planModal(){
            this.showPlanPopup = true;
        },

        togglePopUp() {
            var content = document.getElementsByClassName("left-side__message-content")[0];
            var tourContent = document.getElementsByClassName("left-side__tours")[0];
            this.collapsed = !this.collapsed;
            if (content.style.display !== "none") {
                content.style.display = "none";
                tourContent.style.maxHeight = "calc(100vh - 40px)";
                tourContent.style.height = "calc(100vh - 40px)";
            } else {
                content.style.display = "block";
                tourContent.style.maxHeight = "calc(100vh - 500px)";
                tourContent.style.height = "calc(100vh - 500px)";
            }
        },

        goToAdventureGuide() {
            window.open("https://wejunket.com/junket-adventure-intro");
        },

        goToFAQ() {
            window.open("https://wejunket.com/faq");
        },

        async skipSelectModel() {
            this.$store.commit('profile/setUrl', this.config.urls.cms);
            await this.$store.dispatch('profile/disablePopup');
            await this.$store.dispatch('auth/fetchUser')
            this.showPlanPopup = false;
        },

        async goSubscribe(selectedPlan) {
            if(selectedPlan === this.user.plan_name){
                return;
            }
            this.$store.commit('profile/setUrl', this.config.urls.cms);
            await this.$store.dispatch('profile/disablePopup');
            // await this.$store.dispatch('auth/fetchUser');
            this.$router.push({ name: 'subscribe', params: {plan: selectedPlan }});
        },

        async cancelSubscription(customerId) {
            const bodyParams = {
                customerId,
            };
            const response = await apiRequest(
                "https://ilqyq22pv5.execute-api.us-east-1.amazonaws.com/dev/cancel-subscription",
                "POST",
                bodyParams
            ).catch(e => {
                console.log(e.message);
            });
            await axios({
                method: 'put',
                url: `https://api.wejunket.com/cms/profile/charge?stripe_cust_id=${customerId}&succeeded=false`,
                headers: {
                    "X-Authorization": "c4Ow5PV1pOBYUsMVo5naF3KZI8hgTV12GYQjYZlMxBcYC3vmUKlRP9bEOTiQLPaL",
                }
            }).then(res => {}).catch(err => {
                console.log(err)
            })
            const token = this.$store.getters["auth/token"];
            await axios.put(`https://api.wejunket.com/cms/profile/subscribe?stripe_cust_id=${customerId}&plan_id=cancelled`, {
                headers: {
                    Authorization: "Bearer" + token,
                },
            }).then(({data}) => {
                window.location.reload();
            }).catch(err => {
                console.log(err)
            });
            this.subscribed = false;
            return response;
        },
    },

    beforeMount() {
        this.user = this.$store.getters["auth/user"]
        if(this.user.stripe_cust_id && this.user.succeeded === 1 && this.user.plan_id != 'cancelled') {
            this.subscribed = true
        }
    },
}
</script>

<style>
.tour-list {
    flex: 1; 
    overflow: auto;
    justify-content: space-between;
    min-width: 610px;
    height: 100%;
}
.model-section {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.plan-modal{
    display: flex;
    justify-content: space-between;
}

.withdraw-plan{
    font-size: 12px!important;
}

.model-item {
    flex: 0 1 31%;
    align-items: center;
    display: flex;
    flex-direction: column;
}
.current-plan {
    margin-top: 20px;
    font-weight: 700;
}
.mb-17 {
    margin-bottom: 17px;
}
.mb-20 {
    margin-bottom: 20px;
}
.model-item div {
    margin-top: 10px;
    font-weight: 700;
}


.recommended-plan{
    
    position: absolute;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    background-color: #ea3844;
    padding: 2px 8px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    z-index: 10;
}
.plan-feature-list{
    width:100%;
    height: auto;
    margin-top: 0px!important;
}
.plan-feature-list:hover{
    transform: scale(1.03);
    transition: all 0.3s;
    box-shadow: 0px 0px 8px rgb(163, 161, 161);
    /* -webkit-animation: scale 15s ease-out; */
}

.price-plan-btn{
    margin-top: 20px;
}

.selected-plan-txt{
    margin-top: 25px!important;
}

</style>