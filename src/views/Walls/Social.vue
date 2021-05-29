<template>
    <section>

        <div style="float: right; margin-top: -60px">
            <vs-tooltip color="primary" text="New Post" position="top">
                <vs-button
                    @click="add_post = !add_post"
                    radius
                    color="primary"
                    type="filled"
                    icon="add"
                    style="height: 45px !important; width: 45px !important"
                > </vs-button>
            </vs-tooltip>
        </div>

        <div v-if="add_post" class="flex mb-4">

            <MessageBox :type="alert.type" :message="alert.message"></MessageBox>

            <img
                :src="require(`@/assets/images/superheros/${superhero.avatar}-superhero.svg`)"
                width="30"
                height="30"
                class="mr-2"
                style="margin-top: -33px;"
            >

            <wiziwig
                class="mt-2 mb-2"
                placeholder="What's on your mind?"
                :success="posted"
                :content="new_post.message"
                :type="`NEW_POST_${superhero.name}`"
                submit="keyup"
                @submitted="processNewPost"
                theme="boxed"
                editorTheme="bubble"
                style="display: inline-block; width: 80%"
            ></wiziwig>




        </div>

        <div class="social" v-if="posts.length > 0">

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
                <SinglePost :post="post" :superhero="superhero" @error="error"></SinglePost>
            </vs-card>

        </vs-col>

    </div>
        <div v-else>No posts found.</div>
    </section>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {createPost, readPosts} from "@/controllers/wall"
import Pusher from "pusher-js";
import moment from "moment";
import Wiziwig from "@/views/_components/Wiziwig";
import {getSuperHero} from "@/functions/superhero";
import MessageBox from "@/views/_components/MessageBox";
import {stripHTML} from "@/functions/utils/strings";
import {xAgo} from "@/functions/utils/date";
import SinglePost from "@/views/_components/Walls/Post/SinglePost";

export default {
    name: 'Forum',
    components: {SinglePost, MessageBox, Wiziwig},
    data: () => ({
        superhero: false,
        wall_id: process.env.VUE_APP_JUICYLLAMA_WALL_SOCIAL,
        posts: [],
        message_limit: 10,
        message_offset: 0,
        add_post: false,
        posted: false,
        new_post: {
            message: ''
        },
        update_post: {
            message: ''
        },
        alert: {
            type: '',
            message: ''
        },
    }),
    methods: {

        newPost: async function () {
            let post = await createPost(
                this.wall_id,
                this.superhero.name,
                this.new_post.message,
                0,
            )
            if(post.post_id) {
                this.posted = moment()
                await this.getPosts(false)
            }
        },

        getPosts: async function (use_cache = true) {
            this.$set(this, 'posts', await readPosts(
                this.wall_id,
                0,
                this.message_limit,
                this.message_offset,
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

        processNewPost: function (value) {
            this.new_post.message = value
            this.newPost()
        },

        runner: async function(){
            await this.getPosts(false)
            await this.subscribeWall()
        },

        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },

        stripHTML: function(value){
            return stripHTML(value)
        },
        xAgo(date){
            return xAgo(date)
        },

    },
    created: async function () {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)

        await this.runner()
    },

}
</script>
<style>

.ql-toolbar {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.ql-container {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

</style>
