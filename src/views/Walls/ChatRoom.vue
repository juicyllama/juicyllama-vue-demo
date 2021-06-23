<template>
    <div class="chatroom">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
            <vs-card>

                <div class="chat-container">

                    <template>

                        <div class="chat-topbar send-message pb-1 border-bottom">
                            <wiziwig style="width: 95%" placeholder="Type and hit enter" :success="posted" submit="keyup" @submitted="wiziwigPost" theme="unboxed"></wiziwig>
                        </div>

                        <!---
                        Chat Room
                        --->
                        <div v-bar class="vs-scrollable">
                            <div>
                                <div class="chat-room mt-2">

                                    <div
                                        class="align-items-center mb-3 w-100"
                                         v-for="post in posts"
                                         :key="post.post_id"
                                         style="display: flex;">

                                        <div v-if="post.user_identifier !== superhero.name" class="align-items-center d-flex fromMe messageItem">

                                            <span class="thumb">
                                                 <router-link :to="`/profile/${post.user_identifier}`">
                                                  <img
                                                      :src="require(`@/assets/images/superheros/${getSuperhero(post.user_identifier).avatar}-superhero.svg`)"
                                                      width="37"
                                                      height="37"
                                                  >
                                                 </router-link>
                                            </span>

                                            <div class="messageBody" >
                                                <span v-html="post.message"></span>
                                            </div>
                                        </div>

                                        <div v-else class="messageItem w-100 mb-3 align-items-center">

                                            <span class="thumb" style="float: right">
                                                         <img
                                                             :src="require(`@/assets/images/superheros/${getSuperhero(post.user_identifier).avatar}-superhero.svg`)"
                                                             width="37"
                                                             height="37"
                                                         >
                                            </span>

                                            <div class="messageBody" style="float: right">
                                                <span v-html="post.message"></span>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>

            </vs-card>
        </vs-col>

    </div>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {stripHTML} from "@/functions/utils/strings"
import Pusher from "pusher-js";
import Wiziwig from "@/views/_components/Wiziwig";
import moment from "moment"
import {getSuperHero} from "@/functions/superhero";
import {createPost, readPosts} from "@/controllers/wall";
import {xAgo} from "@/functions/utils/date";

export default {
    name: 'Chat',
    components: {Wiziwig},
    data: () => ({
        superhero: false,
        wall_id: process.env.VUE_APP_JUICYLLAMA_WALL_CHATROOM,
        posts: [],
        message_limit: 99,
        message_offset: 0,
        add_post: false,
        posted: null,
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

        wiziwigPost: function (value) {
            this.new_post.message = value
            this.newPost()
        },

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

        getPosts: async function (use_cache = false) {
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

.fromMe .messageBody {
    margin-left: 20px;
    background-color: var(--light);
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    border-radius: 0px 30px 30px 30px;
}

.messageBody {
    margin-right: 20px;
    background-color: var(--primary);
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    border-radius: 30px 0px 30px 30px;
}

.messageBody p{
  padding: 0px 10px;
}

</style>
