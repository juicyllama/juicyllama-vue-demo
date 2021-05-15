<template>
      <vs-button
          :color="button.color"
          type="filled"
          :icon="button.icon"
          icon-pack="mdi"
          class="rounded-button ml-3 mb-3 "
          @click="buttonClicked"
            :disabled="button.disabled"> {{button.text}}
     </vs-button>
</template>
<script>
import {loadFbSdk, fbLogin, fbLogout, getLoginStatus} from '@/components/facebook/login/helpers.js'
export default {
    name: 'fbLogin',
    props: {
        scope: {
            type: String,
        },
        type: {
            type: String,
            required: true
        },
        reload: {
            type: Number,
        },
    },
    data() {
        return {
            button: {},
            facebook_details: {},
            getLoginStatus: {}
        }
    },
    methods: {
        buttonClicked() {
            switch (this.type) {
                case 'login':
                    this.login()
                    break
                case 'logout':
                    this.logout()
                    break
            }
        },
        logout() {
            fbLogout(this.getLoginStatus)
                .then(response => {
                        this.$emit('logout', response.authResponse)
                    }
                );
        },
        login() {
            fbLogin({scope: this.scope, return_scopes: true})
                .then(response => {
                    if (response.status === 'connected') {
                        let self = this
                        this.button = {
                            color: 'var(--success)',
                            text: 'Connected',
                            icon: 'mdi-facebook',
                            disabled: true
                        }

                        if (response.authResponse) {
                            self.$emit('login', {
                                userID: response.authResponse.userID ? response.authResponse.userID : false,
                                accessToken: response.authResponse.accessToken ? response.authResponse.accessToken : false,
                                expiresIn: response.authResponse.expiresIn ? response.authResponse.expiresIn : false,
                                data_access_expiration_time: response.authResponse.data_access_expiration_time ? response.authResponse.data_access_expiration_time : false,
                                grantedScopes: response.authResponse.grantedScopes ? response.authResponse.grantedScopes : false
                            })
                            self.$emit('loggedin', {})
                        }
                    }

                });
        },
        runner() {
            switch (this.type) {
                case 'login':
                    this.button = {
                        color: '#3b5998',
                        text: 'Login With Facebook',
                        icon: 'mdi-facebook',
                        disabled: false
                    }
                    break
                case 'logout':
                    this.button = {
                        color: 'var(--danger)',
                        text: 'Disconnect',
                        icon: 'mdi-facebook',
                        disabled: false
                    }
                    break
            }
        }
    },
    async created() {

        loadFbSdk()
            .then(() => {
                getLoginStatus()
                    .then(response => {
                        this.getLoginStatus = response
                    })
            })

            this.runner()
    },
    watch: {
        reload: function () {
            this.button = {
                color: '#3b5998',
                text: 'Login With Facebook',
                icon: 'mdi-facebook',
                disabled: false
            }
        },
    },
}
</script>
