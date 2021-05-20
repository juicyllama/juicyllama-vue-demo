<template>
 <vs-row vs-justify="center">

    <WhosOnlineComponent></WhosOnlineComponent>

    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
      <vs-card actionable class="cardx">
        <div slot="header">
          <h4>
            Hello world !
          </h4>
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </div>
      </vs-card>

    </vs-col>

  </vs-row>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import WhosOnlineComponent from "@/views/Components/WhosOnline";

export default {
	name : 'Home',
    components: {WhosOnlineComponent},
    data:() => ({
        superhero: {}
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name, {avatar: this.superhero.avatar})
    }
}
</script>