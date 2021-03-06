<template>
    <b-card :header="title"
        header-bg-variant="secondary"
    >
        <spinner v-model="loading"></spinner>

        <div v-if="! loading" class="d-flex flex-col">
            <div v-if="user.active" class="mb-1 ml-auto">
                <busy-button variant="light" size="sm" :busy="changingRole.client" @click="changeRole('client')" :disabled="busy">Promote Member to Client</busy-button>
                <busy-button variant="light" size="sm" :busy="changingRole.admin" @click="changeRole('admin')" :disabled="busy">Promote Member to Admin</busy-button>
                <busy-button variant="light" size="sm" :busy="disablingAccount" @click="disableAccount()" :disabled="busy">Disable Account</busy-button>
            </div>
            <div v-else class="mb-1 ml-auto">
                <busy-button variant="success" size="sm" :busy="disablingAccount" @click="enableAccount()" :disabled="busy">Re-activate Account</busy-button>
            </div>

            <user-form ref="userForm" :user="user"></user-form>

            <div>
                <busy-button variant="secondary" :busy="saving" @click="update" :disabled="busy">Save Member</busy-button>
                <busy-button variant="danger" :busy="deleting" @click="destroy()" :disabled="busy">Delete Member</busy-button>
                <busy-button variant="light" :busy="deleting" @click="changePasswordModal = true" :disabled="busy">Change Password</busy-button>
                <busy-button variant="warning" :busy="reseting" @click="resetScores()">Reset Scores</busy-button>
            </div>
        </div>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirmDelete">
            Are you sure you want to delete {{ user.name }}?
        </confirm-modal>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirmChangeRole">
            Are you sure you want to change {{ user.name }}'s account type to {{ newRole | capitalize }}?
        </confirm-modal>

        <!-- Change Password Modal -->
        <change-password-modal v-model="changePasswordModal" :user_id="user.id"></change-password-modal>

        <!-- Reset Scores Modal -->
        <confirm-modal ref="confirmResetScores">
            Are you sure you want to reset scores?
        </confirm-modal>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import UserForm from './form';

export default {
    middleware: ['auth', 'admin'],

    layout: 'admin',

    components: { UserForm },

    data: () => ({
        busy: false,
        loading: true,
        saving: false,
        deleting: false,
        reseting: false,
        disablingAccount: false,
        changingRole: { client: false, admin: false },
        newRole: '',
        changePasswordModal: false,
    }),

    computed: {
        ...mapGetters({
            user: 'users/current'
        }),

        title() {
            return "Edit Member: " + this.user.name;
        },
    },

    methods: {
        enableAccount() {
            this.disablingAccount = true;
            axios.patch(this.config.urls.admin + `reactivate/${this.user.id}`)
                .then( ({ data }) => {
                    this.$store.commit('users/fetchUserSuccess', data.data);
                    this.disablingAccount = false;
                })
                .catch(e => {
                    this.disablingAccount = false;
                })
        },
        
        disableAccount() {
            this.disablingAccount = true;
            axios.patch(this.config.urls.admin + `deactivate/${this.user.id}`)
                .then( ({ data }) => {
                    this.$store.commit('users/fetchUserSuccess', data.data);
                    this.disablingAccount = false;
                })
                .catch(e => {
                    this.disablingAccount = false;
                })
        },

        changeRole(role) {
            this.newRole = role;
            this.$refs.confirmChangeRole.confirm(() => {
                this.busy = true;
                this.changingRole[role] = true;
                axios.patch(this.config.urls.admin + `change-role/${this.user.id}`, { role })
                    .then( ({data}) => {
                        // redirect to new role page
                        alerts.addMessage('success', 'Users role has been changed.');
                        this.$router.push({ name: `admin.${role}.show`, params: { id: this.user.id } });
                    }).catch( e => {
                        this.changingRole[role] = false;
                        this.busy = false;
                    });
            });
        },
        
        update() {
            this.saving = true;
            this.busy = true;
            this.$refs.userForm.submit()
                .then( ({data}) => {
                    this.$store.commit('users/fetchUserSuccess', data.data);
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
                f.delete(this.$refs.userForm.url)
                    .then( ({ data }) => {
                        this.$router.push({ name: 'admin.users' });
                    }).catch( e => {
                        this.deleting = false;
                        this.busy = false;
                    });
            });
        },

        resetScores() {
            this.$refs.confirmResetScores.confirm(() => {
                this.reseting = true;
                console.log(this.config.urls.admin);
                axios.patch(this.config.urls.admin + `reset/${this.user.id}`)
                .then( ({ data }) => {
                    this.$store.commit('users/fetchUserSuccess', data.data);
                    alerts.addMessage('success', 'Successfully reset.');
                    this.reseting = false;
                })
                .catch(e => {
                    this.reseting = false;
                })
            });
        }
    },

    async mounted () {
        await this.$store.dispatch('users/fetchUser', this.$route.params.id);

        if (! this.user.id) {
            this.$router.push({ name: 'admin.users' });
        }
        this.loading = false;
    },
}
</script>
