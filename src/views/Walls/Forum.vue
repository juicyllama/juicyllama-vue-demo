<template>
    <section>

        <div style="float: right; margin-top: -60px">
            <vs-tooltip color="primary" text="Add Topic" position="top">
                <vs-button
                    @click="add_topic = !add_topic"
                    radius
                    color="primary"
                    type="filled"
                    icon="add"
                    style="height: 45px !important; width: 45px !important"
                > </vs-button>
            </vs-tooltip>
        </div>

        <div v-if="add_topic" class="flex mb-4">

            <MessageBox :type="alert.type" :message="alert.message"></MessageBox>

            <vs-input class="w-100"
                      placeholder="Topic Title"
                      v-model="new_topic.title"
            />

            <wiziwig class="mt-2 mb-2" placeholder="Topic Message" :success="posted" :content="new_topic.message" :type="`NEW_TOPIC_${superhero.name}`" submit="sync" @submitted="processNewTopicMessage" theme="unboxed-white-r10" editorTheme="snow"></wiziwig>
            <img
                :src="require(`@/assets/images/superheros/${superhero.avatar}-superhero.svg`)"
                width="30"
                height="30"
            >
            <vs-button
                class="ml-2"
                color="primary"
                type="filled"
                @click="createTopic"
            >
                Add Topic
            </vs-button>


        </div>

        <div class="forum" v-if="posts.length > 0">

        <vs-col
            style="display: flex;"
            vs-justify="center"
            vs-align="center"
            vs-lg="12"
            vs-xs="12"
            v-for="(post, p) in posts"
            :key="p"
        >

            <vs-card>

                <TopicPreview :topic="post" :superhero="superhero"></TopicPreview>

            </vs-card>
        </vs-col>

    </div>
        <div v-else>No forum topics found.</div>
    </section>
</template>

<script>
import {auth, superhero} from "@/functions/auth";
import {online} from "@/functions/activity";
import {countPosts, createPost, readPosts} from "@/controllers/wall"
import {postAward} from "@/controllers/award"
import Pusher from "pusher-js";
import moment from "moment";
import Wiziwig from "@/views/_components/Wiziwig";
import {getSuperHero} from "@/functions/superhero";
import MessageBox from "@/views/_components/MessageBox";
import {stripHTML} from "@/functions/utils/strings";
import {xAgo} from "@/functions/utils/date";
import TopicPreview from "@/views/_components/Walls/Forum/TopicPreview";

export default {
    name: 'Forum',
    components: {TopicPreview, MessageBox, Wiziwig},
    data: () => ({
        superhero: false,
        wall_id: process.env.VUE_APP_JUICYLLAMA_WALL_FORUM,
        posts: [],
        message_limit: 10,
        message_offset: 0,
        preview: 100,
        add_topic: false,
        posted: null,
        new_topic: {
            title: '',
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

        createTopic: function(){
            //validate

            if(!this.new_topic.title || this.new_topic.title.length <= 10){
                this.alert.type = 'error'
                this.alert.message = 'Your topic title must be greater than 10 chars'
            }

            if(!this.new_topic.message || this.new_topic.message.length <= 50){
                this.alert.type = 'error'
                this.alert.message = 'Your message must be greater than 50 chars'
            }

            if(
                this.new_topic.title &&
                this.new_topic.title.length > 10 &&
                this.new_topic.message &&
                this.new_topic.message.length > 50)
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
                this.new_topic.message,
                0,
                {
                    title: this.new_topic.title
                }
            )

            if(post.post_id) {
                this.posted = moment()

                //count user topics if first one, assign badge
                let count = await countPosts(this.wall_id, 0, this.superhero.name, false)

                switch (count){

                    case Number(1):
                        await postAward(this.superhero.name, process.env.VUE_APP_JUICYLLAMA_BADGE_FIRST_TOPIC)
                        break

                    case Number(10):
                        await postAward(this.superhero.name, process.env.VUE_APP_JUICYLLAMA_BADGE_TOP_CONTRIBUTOR)
                        break
                }

                this.$router.push('/topic/' + Number(post.post_id))
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

        runner: async function(){
            await this.getPosts(false)
            await this.subscribeWall()
        },

        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },

        processNewTopicMessage: function (value) {
            this.new_topic.message = value
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
