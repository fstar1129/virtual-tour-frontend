<template>
    <g-signin-button
        :params="googleSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError">
        <img src="../../assets/images/google_icon.png" />Sign in with Google
    </g-signin-button>
</template>

<script>
    export default {
        name: 'GoogleLogin',

        data () {
            return {
                googleSignInParams: {
                    client_id: process.env.NODE_ENV == 'development' ? process.env.MIX_DEV_GOOGLE_CLIENT_ID : process.env.MIX_PROD_GOOGLE_CLIENT_ID,
                    scope: 'profile email',
                    prompt: 'consent',
                }
            }
        },

        methods: {
            onSignInSuccess (data) {
                var userInfo = data.getBasicProfile();
                var response = data.getAuthResponse();
                var info = {};
                info.name = userInfo.getName();
                info.id = userInfo.getId();
                info.email = userInfo.getEmail();
                info.token = response.access_token;
                this.$emit('success', info);
            },
            onSignInError (error) {
                this.$emit('error', response);
            },
        },
    }
</script>

<style scoped>
    .g-signin-button {
        text-align: center;
        text-transform: uppercase;
        border: 2px solid #ced4da;
        border-radius: 4px;
        padding: 7px;
        justify-content: center;
        align-items: center;
        display: flex;
        font-weight: 600;
        cursor: pointer;
    }
    img {
        width: 24px;
        margin-right: 5px;
    }
</style>