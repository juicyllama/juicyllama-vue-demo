<template>
 <section>

     <vs-row>

        <vs-col
            type="flex"
            vs-lg="3"
            vs-xs="12"
            vs-justify="center"
            vs-align="center"
        >
          <vs-card class="cardx">
                  <vs-row vs-justify="center">
                        <img
                            :src="showBadge(badge_id)"
                            width="70"
                            height="70"
                        >
                  </vs-row>
                  <vs-row vs-justify="center" class="mt-2">
                      <h5>{{badge.name}}</h5>
                  </vs-row>
                  <vs-row vs-justify="center" class="mt-2">
                      <span align="center" v-html="badge.app_json.description"></span>
                  </vs-row>
          </vs-card>
        </vs-col>

     </vs-row>

     <vs-row v-if="award_count > 0">
         <h3 class="pl-2 pb-2">
             Award Winners ({{award_count}})
         </h3>
     </vs-row>

     <vs-row v-if="award_count > 0">

             <vs-col
                 type="flex"
                 vs-lg="2"
                 vs-xs="4"
                 v-for="(award, index) in awards"
                 :key="index"
                 vs-justify="center"
                 vs-align="center"
             >
                 <vs-card actionable class="cardx">
                     <router-link :to="`/profile/${award.user_identifier}`">
                         <vs-row vs-justify="center">
                             <img
                                 :src="require(`@/assets/images/superheros/${getSuperhero(award.user_identifier).avatar}-superhero.svg`)"
                                 width="70"
                                 height="70"
                                 v-if="award.user_identifier"
                             >
                         </vs-row>
                     </router-link>

                     <vs-row vs-justify="center" class="mt-2" v-if="award.user_identifier">
                         <span>{{ award.user_identifier }}</span>
                     </vs-row>

                     <vs-row vs-justify="center" class="mt-2" v-if="award.created_at">
                         <span>{{ xAgo(award.created_at) }}</span>
                     </vs-row>

                 </vs-card>
             </vs-col>

     </vs-row>

</section>
</template>

<script>
import {auth, superhero} from "@/functions/auth"
import {online} from "@/functions/activity"
import {readBadge} from "@/controllers/badges"
import {readAwards, countAwards} from "@/controllers/award"
import {xAgo} from "@/functions/utils/date"
import {showBadgeImage} from "@/components/badge_image"
import {getSuperHero} from "@/functions/superhero"

export default {
	name : 'Badge',
    data:() => ({
        badge_id: 0,
        badge: false,
        awards: [],
        award_count: 0,
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name, {avatar: this.superhero.avatar})
        this.badge_id = this.$route.params.badge_id
        this.runner()
    },
    methods: {
        runner: async function () {
            await this.getBadge()
            await this.countAwards()
            await this.getAwards()
        },
        getBadge: async function() {
            this.badge = await readBadge(this.badge_id)
        },
        getAwards: async function() {
            this.awards = await readAwards(false, this.badge_id)
        },
        countAwards: async function() {
            let result = await countAwards(false, this.badge_id)
            this.award_count = result.count
        },
        showBadge: function(badge_id, hidden = false) {
            return showBadgeImage(Number(badge_id), hidden)
        },
        xAgo(date){
            return xAgo(date)
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },
    },
    watch: {
        $route(to) {
            this.badge_id = to.params.badge_id
            this.runner()
        },
    },
}
</script>
