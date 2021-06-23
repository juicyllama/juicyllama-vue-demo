<template>
    <section>
        <vs-row v-if="!loading">

     <vs-col class="mb-4" type="flex" vs-lg="12" vs-xs="12">

     Click on the superheros you wish to follow:

     </vs-col>

    <vs-col
        type="flex"
        vs-lg="2"
        vs-xs="4"
        v-for="(superhero, index) in superheros"
        :key="index"
        vs-justify="center"
        vs-align="center"
    >
      <vs-card actionable class="cardx" :style="`${superhero.following ? ' background: var(--primary);' : ''}`">

          <vs-row vs-justify="center">
                <img
                    :src="require(`@/assets/images/superheros/${superhero.avatar}-superhero.svg`)"
                    width="70"
                    height="70"
                    @click="followSuperhero(index)"
                >
          </vs-row>

              <vs-row vs-justify="center" class="mt-2">
          <span>{{ superhero.name }}</span>
          </vs-row>
        
      </vs-card>
    </vs-col>

  </vs-row>

        <vs-row v-else></vs-row>
    </section>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import superheros from "@/assets/superheros.json"
import {online} from "@/functions/activity";
import {readConnections, createConnection, deleteConnection} from "@/controllers/connections";

export default {
	name : 'Following',
    data:() => ({
        superhero: {},
        superheros: [...superheros],
        following: false,
        loading: true
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.runner()
    },
    methods: {
        runner: async function () {
            this.loading = true
          await this.getFollowing()
            this.loading = false
        },

        getFollowing: async function () {
            this.following = await readConnections(this.superhero.name, 'outbound', 999, 0, false)

            if(this.following) {
                for (const s in this.superheros) {

                    this.superheros[s].following = false

                    for (const f in this.following) {
                        if (this.following[f].connection_user_identifier === this.superheros[s].name) {
                            this.superheros[s].following = true
                        }
                    }
                }
            }
        },

        followSuperhero: async function (index) {
            let result
            if(this.superheros[index].following){
                result = await deleteConnection(this.superhero.name, this.superheros[index].name)
            }else{
                result = await createConnection(this.superhero.name, this.superheros[index].name)
            }

            if(result){
                await this.runner()
            }
        },
    }
}
</script>
