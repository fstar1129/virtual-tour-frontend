<template>
    <b-card :header="title"
        header-bg-variant="secondary"
    >
        <spinner v-model="loading"></spinner>

        <div v-if="! loading" class="d-flex flex-col">
            <div v-if="admin.active" class="mb-1 ml-auto">
                <busy-button variant="light" size="sm" :busy="changingRole.user" @click="changeRole('user')" :disabled="busy">Demote Admin to Member</busy-button>
                <busy-button variant="light" size="sm" :busy="changingRole.client" @click="changeRole('client')" :disabled="busy">Demote Admin to Client</busy-button>
                <busy-button variant="light" size="sm" :busy="disablingAccount" @click="disableAccount()" :disabled="busy">Disable Account</busy-button>
            </div>
            <div v-else class="mb-1 ml-auto">
                <busy-button variant="success" size="sm" :busy="disablingAccount" @click="enableAccount()" :disabled="busy">Re-activate Account</busy-button>
            </div>

            <admin-form ref="adminForm" :admin="admin"></admin-form>

            <div>
                <busy-button variant="secondary" :busy="saving" @click="update" :disabled="busy">Save Admin</busy-button>
                <busy-button variant="danger" :busy="deleting" @click="destroy()" :disabled="busy">Delete Admin</busy-button>
                <busy-button variant="light" :busy="deleting" @click="changePasswordModal = true" :disabled="busy">Change Password</busy-button>
                <busy-button variant="warning" :busy="reseting" @click="resetScores()">Reset Scores</busy-button>
            </div>
        </div>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirmDelete">
            Are you sure you want to delete {{ admin.name }}?
        </confirm-modal>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirmChangeRole">
            Are you sure you want to change {{ admin.name }}'s account type to {{ newRole | capitalize }}?
        </confirm-modal>

        <!-- Reset Scores Modal -->
        <confirm-modal ref="confirmResetScores">
            Are you sure you want to reset scores?
        </confirm-modal>

        <!-- Change Password Modal -->
        <change-password-modal v-model="changePasswordModal" :user_id="admin.id"></change-password-modal>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminForm from './form';

export default {
    middleware: ['auth', 'admin'],

    layout: 'admin',

    components: { AdminForm },

    data: () => ({
        busy: false,
        loading: true,
        saving: false,
        reseting: false,
        deleting: false,
        changingRole: { user: false, client: false },
        newRole: '',
        changePasswordModal: false,
        disablingAccount: false,
    }),

    computed: {
        ...mapGetters({
            admin: 'admins/current'
        }),

        title() {
            return "Edit Admin: " + this.admin.name;
        },
    },

    methods: {
        enableAccount() {
            this.disablingAccount = true;
            axios.patch(this.config.urls.admin + `reactivate/${this.admin.id}`)
                .then( ({ data }) => {
                    this.$store.commit('admins/fetchAdminSuccess', data.data);
                    this.disablingAccount = false;
                })
                .catch(e => {
                    this.disablingAccount = false;
                })
        },
        
        disableAccount() {
            this.disablingAccount = true;
            axios.patch(this.config.urls.admin + `deactivate/${this.admin.id}`)
                .then( ({ data }) => {
                    this.$store.commit('admins/fetchAdminSuccess', data.data);
                    this.disablingAccount = false;
                })
                .catch(e => {
                    this.disablingAccount = false;
                })
        },

        resetScores() {
            this.$refs.confirmResetScores.confirm(() => {
                this.reseting = true;
                axios.patch(this.config.urls.admin + `reset/${this.admin.id}`)
                .then( ({ data }) => {
                    this.$store.commit('admins/fetchAdminSuccess', data.data);
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
                axios.patch(this.config.urls.admin + `change-role/${this.admin.id}`, { role })
                    .then( ({data}) => {
                        // redirect to new role page
                        alerts.addMessage('success', 'Users role has been changed.');
                        this.$router.push({ name: `admin.${role}.show`, params: { id: this.admin.id } });
                    }).catch( e => {
                        alerts.addMessage('error', e.response.data.message);
                    }).finally(() => {
                        this.changingRole[role] = false;
                        this.busy = false;
                    });
            });
        },
        
        update() {
            this.saving = true;
            this.$refs.adminForm.submit()
                .then( ({data}) => {
                    this.$store.commit('admins/fetchAdminSuccess', data.data);
                    this.saving = false;
                    this.busy = false;
                }).catch( e => {
                    this.saving = false;
                    this.busy = false;
                });
        },
        
        destroy() {
            this.$refs.confirmDelete.confirm(() => {
                this.deleting = true;
                let f = new Form({});
                f.delete(this.$refs.adminForm.url)
                    .then( ({ data }) => {
                        this.$router.push({ name: 'admin.admins' });
                    }).catch( e => {
                        this.deleting = false;
                        this.busy = false;
                    });
            });
        },
    },

    async mounted () {
        await this.$store.dispatch('admins/fetchAdmin', this.$route.params.id);
        if (! this.admin.id) {
            this.$router.push({ name: 'admin.admins' });
        }
        this.loading = false;
    },
}
</script>
