<template>

    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <vs-card class="cardx">
            <h4>
                Who's Online
            </h4>
            <p class="text-muted mt-1">There are <span style="text-decoration: underline; text-decoration-color: var(--primary); text-decoration-thickness: 2px; font-weight: bold; color: black ">{{count}}
                <span v-if="count === 1">Superhero</span>
                <span v-else>Superheros</span></span> online now.</p>


            <div>
                <vs-td class="tag-item" v-if="superheros.length > 0">
                    <span
                        class="popover-icon"
                        v-for="superhero in superheros.slice(0,show)"
                        :activity="superhero"
                        :key="superhero.activity_id"
                    >
                        <router-link to="/online" v-if="superhero.app_json.avatar">
                        <img
                            :src="require(`@/assets/images/superheros/${superhero.app_json.avatar}-superhero.svg`)"
                            width="32"
                            height="32"
                        >
                            </router-link>

                    </span>
                    <span class="popover-icon">
                         <router-link to="/online">
                        <vs-avatar
                            v-if="count > show"
                            style="font-size: large; margin: 0px -10px;"
                            size="32px"
                            color="primary"
                            :text="`+${count-show}`"
                            class="feed-like-avatar rounded-circle vs-component vs-radius popover-item"
                        ></vs-avatar>
                         </router-link>
                    </span>

                </vs-td>
            </div>

        </vs-card>
    </vs-col>

</template>
<script>
import {readActivities, countActivities} from "@/controllers/activity";
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {sortArray} from "@/functions/utils/arrays";
import Pusher from "pusher-js";

export default {
    name: "WhosOnlineComponent",
    components: {},
    data: () => ({
        superhero: {},
        superheros: [],
        count: 0,
        show: 40
    }),
    created: function () {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.countOnline()
        this.getOnline()
        this.subscribeActivity()

        let startingWindowSize = window.innerWidth;
        this.show = (startingWindowSize / 30).toFixed(0)

        this.$nextTick(() => {
            window.addEventListener('resize', this.handleWindowResize);
        })
    },
    methods: {
        countOnline: async function() {
            let activities = await countActivities(false)
            this.$set(this, 'count', activities.count)
        },
        getOnline: async function() {
            let superheros = await readActivities(9999, 0, false)
            this.superheros = await sortArray('updated_at', superheros, 'moment', true)
        },
        subscribeActivity: async function () {
            let pusher = new Pusher(process.env.VUE_APP_JUICYLLAMA_PUSHER_KEY, {cluster: 'eu'})
            let channel = process.env.VUE_APP_JUICYLLAMA_API_KEY
            let event = 'activity'

            pusher.subscribe(channel)
            pusher.bind(event, async data => {
                switch (data.action) {
                    case 'new_activity':
                        await this.countOnline()
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

            this.superheros = await sortArray('updated_at', superheros, 'moment', true)
        },
        handleWindowResize(event) {
            let windowWidth = event.currentTarget.innerWidth;
            this.show = (windowWidth / 30).toFixed(0)
        },
    },

}
</script>