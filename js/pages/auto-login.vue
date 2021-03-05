<template>
    <div class="d-flex">
        <div class="mx-auto auth-box mt-5 shadow-lg bg-white rounded" >
            <div class="text-center mb-5">
                <img src="images/junket-logo.png" alt="Junket" class="w-100">
            </div>

            <div>
              Login...
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },

    metaInfo () {
        return { title: "Login" }
    },

    methods: {
      async loadDashboard() {
            // Fetch the user.
            await this.$store.dispatch('auth/fetchUser')

            // Redirect home.
            this.$router.push({ name: 'home' })
      },
    },

    
    async mounted() {
      if(this.$route.params.token){

        this.$store.commit('auth/saveToken', {
            token: this.$route.params.token,
            remember: false
        })

        this.loadDashboard();
      }else{
        this.$router.push({ name: 'login' })
      }
    },
}
</script>
