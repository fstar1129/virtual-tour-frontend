<template>
    <div class="d-flex">
        <div class="mx-auto p-5 mt-5 shadow-lg bg-white rounded" style="min-width: 360px; width: 80%; max-width: 500px;">
            <div class="text-center mb-5">
                <router-link :to="{name:'home'}"><img src="images/junket-logo.png" alt="Junket" class="w-100"></router-link>
            </div>

            <div>
                <h2>Thank You For Subscribing!</h2>
                <b-btn variant="secondary" class="mt-3 w-100" :to="{ name: 'home' }">
                    <fa :icon="['fas', 'arrow-left']"></fa>&nbsp;&nbsp;Back to Dashboard
                </b-btn>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        metaInfo() {
            return { title: 'Success' }
        },

        name: "success",
    }
</script>

<style scoped>

</style>
