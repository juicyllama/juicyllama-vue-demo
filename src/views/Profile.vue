<template>
 <vs-row>

     <vs-col
         type="flex"
         vs-lg="2"
         vs-xs="12"
         vs-justify="center"
         vs-align="center"
     >
         <vs-card class="cardx">
             <vs-row vs-justify="center">
                 <img
                     :src="require(`@/assets/images/superheros/${user_avatar}-superhero.svg`)"
                     width="70"
                     height="70"
                     v-if="user_avatar"
                 >
             </vs-row>

             <vs-row vs-justify="center" class="mt-2" v-if="user_name">
                 <span>{{ user_name }}</span>
             </vs-row>

             <vs-row vs-justify="center" class="mt-2" v-if="points.points">
                 <span><span style="text-decoration: underline; text-decoration-color: var(--primary); text-decoration-thickness: 2px; font-weight: bold; color: black ">{{ points.points }}</span> Point<span v-if="points.points > 1">s</span></span>
             </vs-row>

             <vs-row vs-justify="center" class="mt-1" v-if="awards.length > 0">
                 <router-link
                     v-for="(award, index) in awards"
                     :key="index"
                     :to="`/badge/${award.badge_id}`"
                 >
                     <img
                         :src="showBadge(award.badge_id)"
                         width="40"
                         height="40"
                     >
                 </router-link>

             </vs-row>

         </vs-card>

     </vs-col>

     <vs-col
         type="flex"
         vs-lg="4"
         vs-xs="12"
         vs-justify="center"
         vs-align="center"
     >
         <vs-card class="cardx">
             <vs-row>
                 <span v-if="activity">Last seen online: <span style="text-decoration: underline; text-decoration-color: var(--primary); text-decoration-thickness: 2px; font-weight: bold; color: black ">{{ xAgo(activity.updated_at) }}</span></span><span v-else> Never seen online before</span>
             </vs-row>
             <vs-row>
                 <span>
                     Login Streak: <span v-if="activity" style="text-decoration: underline; text-decoration-color: var(--primary); text-decoration-thickness: 2px; font-weight: bold; color: black ">{{ (activity.streak+1) }} <span v-if="(activity.streak+1) === 1"> Day</span><span v-else> Days</span></span><span v-else>0 Days</span>
                 </span>
             </vs-row>

         </vs-card>

     </vs-col>

     <!---------------------------
     Following
     ----------------------------->
        <vs-col
         type="flex"
         vs-lg="3"
         vs-xs="12"
         vs-justify="center"
         vs-align="center"
         v-if="following"
     >
         <vs-card class="cardx">
             <vs-row>
                 <h5>Following</h5>
             </vs-row>

             <vs-row class="mt-2">

                 <router-link :to="`/profile/${follow.connection_user_identifier}`"
                              v-for="(follow, index) in following"
                              :key="index">
                     <img
                         :src="require(`@/assets/images/superheros/${getSuperhero(follow.connection_user_identifier).avatar}-superhero.svg`)"
                         width="32"
                         height="32"
                         class="mr-1 mb-1"
                     >
                 </router-link>

             </vs-row>

         </vs-card>

     </vs-col>

     <!---------------------------
     Followers
     ----------------------------->
        <vs-col
         type="flex"
         vs-lg="3"
         vs-xs="12"
         vs-justify="center"
         vs-align="center"
         v-if="followers"
     >
         <vs-card class="cardx">
             <vs-row>
                 <h5>Followers</h5>
             </vs-row>

             <vs-row class="mt-2">

                 <router-link :to="`/profile/${follow.user_identifier}`"
                              v-for="(follow, index) in followers"
                              :key="index">
                     <img
                         :src="require(`@/assets/images/superheros/${getSuperhero(follow.user_identifier).avatar}-superhero.svg`)"
                         width="32"
                         height="32"
                         class="mr-1 mb-1"
                     >
                 </router-link>

             </vs-row>

         </vs-card>

     </vs-col>

  </vs-row>
</template>

<script>
import superheros from "@/assets/superheros.json"
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {getSuperHero} from "@/functions/superhero";
import {xAgo} from "@/functions/utils/date";
import {showBadgeImage} from "@/components/badge_image";
import {readActivity} from "@/controllers/activity";
import {readAwards} from "@/controllers/award";
import {readConnections} from "@/controllers/connections";
import {readPoints} from "@/controllers/points";

export default {
    name: 'Profile',
    components: {},
    data: () => ({
        superhero: {},
        user: false,
        user_avatar: false,
        user_name: false,
        activity: false,
        awards: false,
        following: false,
        followers: false,
        points: false
    }),
    created() {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.user = this.$route.params.user
        this.runner()
    },
    methods: {
        runner: async function () {
            for (const s in superheros) {
                if (superheros[s].name === this.user) {
                    this.user_avatar = superheros[s].avatar
                    this.user_name = superheros[s].name
                }
            }

            if (this.user_name) {
                await this.getOnline()
                await this.getAwards()
                await this.getFollowing()
                await this.getFollowers()
                await this.getPoints()
            }
        },
        getOnline: async function () {
            this.activity = await readActivity(this.user_name)
        },
        getAwards: async function () {
            this.awards = await readAwards(this.user_name, false)
        },
        getFollowing: async function () {
            this.following = await readConnections(this.user_name, 'outbound')
        },
        getFollowers: async function () {
            this.followers = await readConnections(this.user_name, 'inbound')
        },
        getPoints: async function () {
            this.points = await readPoints(this.user_name)
        },
        showBadge: function (badge_id, hidden = false) {
            return showBadgeImage(Number(badge_id), hidden)
        },
        xAgo(date) {
            return xAgo(date)
        },
        getSuperhero(user_identifier) {
            return getSuperHero(user_identifier)
        },
    },
    watch: {
        $route(to) {
            this.user = to.params.user
            this.runner()
        },
    },
}
</script>
