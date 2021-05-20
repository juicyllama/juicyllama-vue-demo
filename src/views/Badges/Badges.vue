<template>
 <vs-row v-if="badges.length > 0">

    <vs-col
        type="flex"
        vs-lg="2"
        vs-xs="4"
        v-for="(badge, index) in badges"
        :key="index"
        vs-justify="center"
        vs-align="center"
    >
      <vs-card actionable class="cardx">
              <vs-row vs-justify="center">
                  <router-link :to="`/badge/${badge.badge_id}`">
                    <img
                        :src="showBadge(badge.badge_id, !badge.awarded)"
                        width="70"
                        height="70"
                    >
                  </router-link>
              </vs-row>
              <vs-row vs-justify="center" class="mt-2">
                  <router-link :to="`/badge/${badge.badge_id}`">
                      {{badge.name}}
                  </router-link>
              </vs-row>
              <vs-row vs-justify="center" class="mt-2">
                  <span v-if="badge.award && badge.award.created_at">{{ xAgo(badge.award.created_at)}}</span>
                  <span v-else>-</span>
              </vs-row>
      </vs-card>
    </vs-col>

  </vs-row>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {readBadges} from "@/controllers/badges";
import {readAwards} from "@/controllers/award";
import {xAgo} from "@/functions/utils/date";
import {showBadgeImage} from "@/components/badge_image";

export default {
	name : 'Badges',
    data:() => ({
        badges: [],
        awards: [],
        sorted_badges: []
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name, {avatar: this.superhero.avatar})
        this.runner()
    },
    methods: {
        runner: async function () {
            await this.getBadges()
            await this.getAwards()
            await this.mapAwards()
        },
        getBadges: async function() {
            this.badges = await readBadges(99, 0)
        },
        getAwards: async function() {
            this.awards = await readAwards(this.superhero.name, false)
        },
        showBadge: function(badge_id, hidden = false) {
            return showBadgeImage(Number(badge_id), hidden)
        },
        mapAwards: async function() {

            for(let b=0; b<this.badges.length; b++){
                this.badges[b].awarded = false

                for(let a=0; a<this.awards.length; a++) {
                    if(this.badges[b].badge_id === this.awards[a].badge_id){
                        this.badges[b].awarded = true
                        this.badges[b].award = this.awards[a]
                    }
                }
            }

            let sort = this.badges
            sort.sort((a,b) => a.app_json.points - b.app_json.points);
            this.sorted_badges = sort
        },
        xAgo(date){
            return xAgo(date)
        },
    }
}
</script>
