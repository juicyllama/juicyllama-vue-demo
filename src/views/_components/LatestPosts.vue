<template>

    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">

        <vs-col
            style="display: flex;"
            vs-justify="center"
            vs-align="center"
            vs-lg="4"
            vs-xs="12"
            v-for="(post, p) in posts"
            :key="p"
        >

            <vs-card class="card-no-padding">
                <SinglePost :post="post" :superhero="superhero"></SinglePost>
            </vs-card>

        </vs-col>

    </vs-col>

</template>
<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import Pusher from "pusher-js";
import {readPosts} from "@/controllers/wall";
import SinglePost from "@/views/_components/Walls/Post/SinglePost";

export default {
    name: "LatestPosts",
    components: {SinglePost},
    props: {
        users: {
            type: Array,
        },
    },
    data: () => ({
        superhero: {},
        superheros: [],
        posts: [],
        wall_id: process.env.VUE_APP_JUICYLLAMA_WALL_SOCIAL,
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
                3,
                0,
                false,
                this.users ? this.users : false,
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
