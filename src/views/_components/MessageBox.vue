<template>
    <vs-alert
        v-if="message.length > 0"
        :color="[type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary']"
        class="mt-2 mb-2"
    >
        <ul class="common-list">
            <li>{{ message }}</li>
        </ul>
    </vs-alert>
</template>

<script>

export default {
name: "MessageBox",
    props: {
        message: {
            type: String,
            required: true
        },
        type:{
            type: String, //options "success" "error"
            required: true
        }
    },
}

</script>
