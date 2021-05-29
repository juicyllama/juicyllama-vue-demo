<template>
    <section>

        <vs-col
            style="display: flex;"
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-xs="12"
        >

            <vs-card style="border: none; background: none;">

                <Topic
                    :topic="topic"
                    :title="topic.app_json && topic.app_json.title ? topic.app_json.title : ''"
                    :superhero="superhero"
                ></Topic>

            </vs-card>
        </vs-col>




            <hr>



        <div
            class="mb-2"
            style="float: right;">
            <vs-tooltip color="primary" text="Add Reply" position="top">
                <vs-button
                    @click="add_reply = !add_reply"
                    color="primary"
                    type="filled"
                >Add Reply </vs-button>
            </vs-tooltip>
        </div>

        <div v-if="add_reply" class="flex mb-4">
            <MessageBox
                :type="alert.type"
                :message="alert.message"
            ></MessageBox>

            <wiziwig
                class="mt-2 mb-2"
                placeholder="Topic Message"
                :success="posted"
                :content="new_reply.message"
                :type="`NEW_TOPIC_${superhero.name}`"
                submit="sync"
                @submitted="processTopicReplyMessage"
                theme="unboxed-white-r10"
                editorTheme="snow"
            ></wiziwig>

            <img
                :src="require(`@/assets/images/superheros/${superhero.avatar}-superhero.svg`)"
                width="30"
                height="30"
            >
            <vs-button
                class="ml-2"
                color="primary"
                type="filled"
                @click="createReply"
            >
                Post Reply
            </vs-button>

        </div>

        <div class="forum" v-if="topic.child_posts && topic.child_posts.length > 0">

        <vs-col
            style="display: flex;"
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-xs="12"
            v-for="(post, p) in topic.child_posts"
            :key="p"
        >

            <vs-card>

                <Topic
                    :topic="post"
                    :superhero="superhero"
                ></Topic>

            </vs-card>
        </vs-col>

    </div>
        <div v-else>Be the first to reply.</div>
    </section>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {createPost, readPost, deletePost} from "@/controllers/wall"
import Pusher from "pusher-js";
import moment from "moment";
import Wiziwig from "@/views/_components/Wiziwig";
import {getSuperHero} from "@/functions/superhero";
import MessageBox from "@/views/_components/MessageBox";
import Topic from "@/views/_components/Walls/Forum/Topic";
import {stripHTML} from "@/functions/utils/strings";
import {xAgo} from "@/functions/utils/date";

export default {
    name: 'ForumTopic',
    components: {MessageBox, Wiziwig, Topic},
    data: () => ({
        superhero: false,
        wall_id: process.env.VUE_APP_JUICYLLAMA_WALL_FORUM,
        topic_id: false,
        topic: {},
        message_limit: 10,
        message_offset: 0,
        add_reply: false,
        posted: false,
        new_reply: {
            message: ''
        },
        update_topic: {
            title: '',
            message: ''
        },
        alert: {
            type: '',
            message: ''
        },
    }),
    methods: {

        createReply: function(){
            //validate

            if(!this.new_reply.message || this.new_reply.message.length <= 30){
                this.alert.type = 'error'
                this.alert.message = 'Your message must be greater than 30 chars'
            }

            if(
                this.new_reply.message &&
                this.new_reply.message.length > 30)
            {

                this.alert.type = ''
                this.alert.message = ''
                this.newPost()

            }
        },

        newPost: async function () {
            let post = await createPost(
                this.wall_id,
                this.superhero.name,
                this.new_reply.message,
                this.topic_id
            )
            if(post.post_id) {
                this.posted = moment()
                this.add_reply = false
            }
        },

        getTopic: async function (use_cache = true) {
            this.$set(this, 'topic', await readPost(
                this.wall_id,
                this.topic_id,
                use_cache
            ))
        },

        removePost: async function(post_id) {
            let response = await deletePost(this.wall_id, post_id)
            if(!response){
                this.alert.type = 'danger'
                this.alert.message = 'Issue deleting post, please try again or contact support.'
            }
        },

        subscribeTopic: async function () {
            let pusher = new Pusher(process.env.VUE_APP_JUICYLLAMA_PUSHER_KEY, {cluster: 'eu'})
            let channel = process.env.VUE_APP_JUICYLLAMA_API_KEY
            let event = "post_" + this.topic_id

            pusher.subscribe(channel);
            pusher.bind(event, async () => {
                await this.getTopic(false)
            });
        },

        runner: async function(){
            await this.getTopic()
            await this.subscribeTopic()
        },

        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },

        stripHTML: function(value){
            return stripHTML(value)
        },

        processTopicReplyMessage: function (value) {
            this.new_reply.message = value
        },

        xAgo(date){
            return xAgo(date)
        },

    },
    created: async function () {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)
        this.topic_id = this.$route.params.topic_id
        await this.runner()
    },
    watch: {
        $route(to) {
            this.topic_id = to.params.topic_id
            this.runner()
        },
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
