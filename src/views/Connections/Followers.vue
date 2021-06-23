<template>
    <section>
        <vs-row v-if="!loading">

     <vs-col class="mb-4" type="flex" vs-lg="12" vs-xs="12">

     See below the superheros who are following you:

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
              <router-link :to="`/profile/${superhero.name}`">
                <img
                    :src="require(`@/assets/images/superheros/${superhero.avatar}-superhero.svg`)"
                    width="70"
                    height="70"
                >
              </router-link>
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
import {readConnections} from "@/controllers/connections";

export default {
	name : 'Following',
    data:() => ({
        superhero: {},
        superheros: [...superheros],
        followers: false,
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
          await this.getFollowers()
            this.loading = false
        },

        getFollowers: async function () {
            this.followers = await readConnections(this.superhero.name, 'inbound', 999, 0, false)

            if(this.followers) {
                for (const s in this.superheros) {

                    this.superheros[s].following = false

                    for (const f in this.followers) {
                        if (this.followers[f].user_identifier === this.superheros[s].name) {
                            this.superheros[s].following = true
                        }
                    }
                }
            }
        }
    }
}
</script>
