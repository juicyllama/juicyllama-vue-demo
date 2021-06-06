<template>

    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <vs-card class="cardx">
            <h4>
                Latest Topics
            </h4>

            <div>

                <vs-list v-if="posts.length > 0">
                    <router-link
                        v-for="(post, index) in posts"
                        :key="index"
                        :to="`/topic/${post.post_id}`"
                    >
                    <vs-list-item
                        icon-pack="mdi"
                        icon="mdi-comment-question-outline"
                        :title="post.app_json.title"
                    ></vs-list-item>
                    </router-link>

                </vs-list>

            </div>

        </vs-card>
    </vs-col>

</template>
<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import Pusher from "pusher-js";
import {readPosts} from "@/controllers/wall";

export default {
    name: "LatestTopics",
    components: {},
    data: () => ({
        superhero: {},
        superheros: [],
        posts: [],
        wall_id: process.env.VUE_APP_JUICYLLAMA_WALL_FORUM,
    }),
    created: function () {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.runner()
    },
    methods: {

        getPosts: async function (use_cache = true) {
            this.$set(this, 'posts', await readPosts(
                this.wall_id,
                0,
                5,
                0,
                false,
                false,
                use_cache
            ))
        },

        subscribeWall: async function () {
            let pusher = new Pusher(process.env.VUE_APP_JUICYLLAMA_PUSHER_KEY, {cluster: 'eu'})
            let channel = process.env.VUE_APP_JUICYLLAMA_API_KEY
            let event = "wall_" + this.wall_id

            pusher.subscribe(channel);
            pusher.bind(event, async () => {
                await this.getPosts(false)
            });
        },

        runner: async function(){
            await this.getPosts(false)
            await this.subscribeWall()
        },
    },

}
</script>
<style>

.vs-list--title {
    font-weight: unset;
}

</style>
