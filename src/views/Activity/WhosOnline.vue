<template>
 <vs-row v-if="superheros.length > 0">

    <vs-col
        type="flex"
        vs-lg="2"
        vs-xs="4"
        v-for="(superhero, index) in superheros"
        :key="index"
        vs-justify="center"
        vs-align="center"
    >
      <vs-card actionable class="cardx">
          <router-link :to="`/profile/${superhero.user_identifier}`">
              <vs-row vs-justify="center">
                    <img
                        :src="require(`@/assets/images/superheros/${getSuperhero(superhero.user_identifier).avatar}-superhero.svg`)"
                        width="70"
                        height="70"
                        v-if="superhero.app_json.avatar"
                    >
              </vs-row>
              <vs-row vs-justify="center" class="mt-2" v-if="superhero.user_identifier">
                <span>{{ superhero.user_identifier }}</span>
              </vs-row>
              <vs-row vs-justify="center" class="mt-2" v-if="superhero.updated_at">
                  <span><strong>{{ xAgo(superhero.updated_at) }}</strong></span>
              </vs-row>
          </router-link>
      </vs-card>
    </vs-col>

  </vs-row>
</template>

<script>
import Pusher from "pusher-js";
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {readActivities} from "@/controllers/activity";
import {xAgo} from "@/functions/utils/date";
import {sortArray} from "@/functions/utils/arrays";
import {getSuperHero} from "@/functions/superhero";

export default {
	name : 'WhosOnline',
    data:() => ({
        superhero: {},
        superheros: []
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.getOnline()
        this.subscribeActivity()
    },
    methods: {

        getOnline: async function() {
            let superheros = await readActivities(24, 0, false)
            this.superheros = await sortArray('updated_at', superheros, 'moment', true)
        },
        xAgo(date){
            return xAgo(date)
        },
        subscribeActivity: async function () {

            let pusher = new Pusher(process.env.VUE_APP_JUICYLLAMA_PUSHER_KEY, {cluster: 'eu'})
            let channel = process.env.VUE_APP_JUICYLLAMA_API_KEY
            let event = 'activity'

            pusher.subscribe(channel)
            pusher.bind(event, async data => {
                switch (data.action) {
                    case 'new_activity':
                        await this.mergeOnline(data.activity)
                        break
                }
            })
        },

        mergeOnline: async function(activity) {

            let matched = false
            let superheros = this.superheros

            for(const s in superheros){
                if(Number(activity.activity_id) === Number(superheros[s].activity_id)){
                    superheros[s] = activity
                    matched = true
                }
            }

            if(!matched){
                superheros.push(activity)
            }

            superheros = await sortArray('updated_at', superheros, 'moment', true)
            superheros.slice(0, 24)
            this.superheros = superheros
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },
    }
}
</script>