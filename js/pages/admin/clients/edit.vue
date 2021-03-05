<template>
    <b-card :header="title"
        header-bg-variant="secondary"
    >
        <spinner v-model="loading"></spinner>

        <div v-if="! loading" class="d-flex flex-col">
            <div v-if="client.active" class="mb-1 ml-auto">
                <busy-button variant="light" size="sm" :busy="changingRole.user" @click="changeRole('user')" :disabled="busy">Demote Client to Member</busy-button>
                <busy-button variant="light" size="sm" :busy="changingRole.admin" @click="changeRole('admin')" :disabled="busy">Promote Client to Admin</busy-button>
                <busy-button variant="light" size="sm" :busy="disablingAccount" @click="disableAccount()" :disabled="busy">Disable Account</busy-button>
            </div>
            <div v-else class="mb-1 ml-auto">
                <busy-button variant="success" size="sm" :busy="disablingAccount" @click="enableAccount()" :disabled="busy">Re-activate Account</busy-button>
            </div>

            <client-form ref="clientForm" :client="client"></client-form>

            <div>
                <busy-button variant="secondary" :busy="saving" @click="update" :disabled="busy">Save Client</busy-button>
                <busy-button variant="light" :busy="deleting" @click="openChangePasswordModal" :disabled="busy">Change Password</busy-button>
                <busy-button variant="primary" :busy="deleting" @click="openChangePlanModal" :disabled="busy">Change Plan</busy-button>
                <busy-button variant="warning" :busy="reseting" @click="resetScores()">Reset Scores</busy-button>
                <busy-button variant="danger" :busy="deleting" @click="destroy()" :disabled="busy">Delete Client</busy-button>
            </div>
        </div>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirmDelete">
            Are you sure you want to delete {{ client.name }}?
        </confirm-modal>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirmChangeRole">
            Are you sure you want to change {{ client.name }}'s account type to {{ newRole | capitalize }}?
        </confirm-modal>

        <!-- Change Password Modal -->
        <change-password-modal ref="changePasswordModal" :user_id="client.id"></change-password-modal>
        
        <!-- Reset Scores Modal -->
        <confirm-modal ref="confirmResetScores">
            Are you sure you want to reset scores?
        </confirm-modal>

        <!-- Change Plan Modal -->
        <change-plan-modal ref="changePlanModal" :user_id="client.id" :active_plan="client.active_plan" :pricing_plans="client.pricing_plans" :tour_limit="client.tour_limit"></change-plan-modal>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import ClientForm from './form';

export default {
    middleware: ['auth', 'admin'],

    layout: 'admin',

    components: { ClientForm },

    data: () => ({
        busy: false,
        loading: true,
        saving: false,
        deleting: false,
        reseting: false,
        changingRole: { user: false, admin: false },
        newRole: '',
        disablingAccount: false,
    }),

    computed: {
        ...mapGetters({
            client: 'clients/current'
        }),

        title() {
            return "Edit Client: " + this.client.name;
        },
    },

    methods: {
        enableAccount() {
            this.disablingAccount = true;
            axios.patch(this.config.urls.admin + `reactivate/${this.client.id}`)
                .then( ({ data }) => {
                    this.$store.commit('clients/fetchClientSuccess', data.data);
                    this.disablingAccount = false;
                })
                .catch(e => {
                    this.disablingAccount = false;
                })
        },
        disableAccount() {
            this.disablingAccount = true;
            axios.patch(this.config.urls.admin + `deactivate/${this.client.id}`)
                .then( ({ data }) => {
                    this.$store.commit('clients/fetchClientSuccess', data.data);
                    this.disablingAccount = false;
                })
                .catch(e => {
                    this.disablingAccount = false;
                })
        },

        resetScores() {
            this.$refs.confirmResetScores.confirm(() => {
                this.reseting = true;
                axios.patch(this.config.urls.admin + `reset/${this.client.id}`)
                .then( ({ data }) => {
                    this.$store.commit('clients/fetchClientSuccess', data.data);
                    alerts.addMessage('success', 'Successfully reset.');
                    this.reseting = false;
                })
                .catch(e => {
                    this.reseting = false;
                })
            });
        },

        changeRole(role) {
            this.newRole = role;
            this.$refs.confirmChangeRole.confirm(() => {
                this.busy = true;
                this.changingRole[role] = true;
                axios.patch(this.config.urls.admin + `change-role/${this.client.id}`, { role })
                    .then( ({data}) => {
                        // redirect to new role page
                        alerts.addMessage('success', 'Users role has been changed.');
                        this.$router.push({ name: `admin.${role}.show`, params: { id: this.client.id } });
                    }).catch( e => {
                        this.changingRole[role] = false;
                        this.busy = false;
                    });
            });
        },
        
        update() {
            this.busy = true;
            this.saving = true;
            this.$refs.clientForm.submit()
                .then( ({data}) => {
                    this.$store.commit('clients/fetchClientSuccess', data.data);
                    this.saving = false;
                    this.busy = false;
                }).catch( e => {
                    this.saving = false;
                    this.busy = false;
                });
        },
        
        destroy() {
            this.$refs.confirmDelete.confirm(() => {
                this.busy = true;
                this.deleting = true;
                let f = new Form({});
                console.log(this.$refs.clientForm.url);
                f.delete(this.$refs.clientForm.url)
                    .then( ({ data }) => {
                        this.$router.push({ name: 'admin.clients' });
                    }).catch( e => {
                        this.deleting = false;
                        this.busy = false;
                    });
            });
        },

        openChangePasswordModal() {
            this.$refs.changePasswordModal.openModal();
        },

        openChangePlanModal() {
            this.$refs.changePlanModal.openModal();
        }
    },

    async mounted () {
        await this.$store.dispatch('clients/fetchClient', this.$route.params.id);
        if (! this.client.id) {
            this.$router.push({ name: 'admin.clients' });
        }
        this.loading = false;
    },
}
</script>
