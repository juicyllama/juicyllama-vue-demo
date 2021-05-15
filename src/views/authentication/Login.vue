<template>
  <vs-row vs-justify="center" vs-align="center" class="full-height login-register-bg">
    <vs-col type="flex" vs-justify="center" vs-align="center" class="login-register-box" vs-lg="12" vs-xs="12">
    <vs-card class=" mb-0">
      <div slot="header">
        <h3 class="mb-1">Demo Community</h3>
        <p class="mb-0">Login via one of the below services:</p>
      </div>

        <div style="min-height: 100px">
            <fbLogin class="button" type="login" scope="email" @login="onLogin"></fbLogin>
        </div>

    </vs-card>
    </vs-col>
  </vs-row>   
  
</template>

<script>
import fbLogin from "@/components/facebook/login/fbLogin"
import storage from "@/store/storage.js"
export default {
    name: 'Login',
    components: {fbLogin},
    data: () => ({
    }),
    methods: {
        onLogin: async function(value){
            storage.set('fb', value)
            this.$router.push('/home');
            //todo push email to service to track who is using for marketing purposes.
        }
    },
    computed: {},
    created: async function() {
        let fb = storage.get('fb')

        if(fb.userID){
            this.$router.push('/home');
        }
    },
}
</script>
<style>
.login-register-bg{
  margin:0 auto;
  background:url(../../assets/images/background/auth-bg.jpg) no-repeat center center;
}
.login-register-box{
  max-width:400px;
}

</style>

