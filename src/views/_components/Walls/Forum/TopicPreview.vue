<template>
    <section>

        <!----------------
        MAIN SECTION
        ------------------>

        <vs-col
            class="pl-2"
            style="display: block; min-height: 120px"
                vs-justify="center"
                vs-align="center"
                vs-lg="10"
                vs-xs="12"
        >

            <vs-row>

                <router-link style="float:left;" :to="`/topic/${topic.post_id}`"><h3 v-if="topic.app_json.title">{{topic.app_json.title}}</h3></router-link>

                <div v-if="topic.user_identifier === superhero.name">
                    <a
                        @click="removePost"
                        class="pl-2 align-middle cursor-pointer">
                        <i class="ti ti-trash" style="font-size: larger; margin-top: -7px"></i>
                    </a>
                </div>

            </vs-row>

            <vs-row>

            <p v-if="topic.message" class=" mt-2">{{stripHTML(topic.message).substring(0, preview)}}</p>

            </vs-row>

            <vs-row>

            <span class="thumb mb-2">

                        <router-link :to="`/profile/${topic.user_identifier}`">
                            <img
                                :src="require(`@/assets/images/superheros/${getSuperhero(topic.user_identifier).avatar}-superhero.svg`)"
                                width="20"
                                height="20"
                            >
                            {{topic.user_identifier}} </router-link><span class="text-muted"> - {{xAgo(topic.created_at)}}</span>

                    </span>
            </vs-row>
        </vs-col>

        <!----------------
       RIGHT SECTION
       ------------------>

        <vs-col
            style="display: block;"
            class="hide-on-mobile pr-2"
            vs-justify="right"
            vs-align="right"
            vs-lg="2"
        >


                <vs-row style="float: right">
                    <span class="text-muted">
                        Replies
                        <h1><span style="float: right; text-decoration: underline; text-decoration-color: var(--primary); text-decoration-thickness: 4px; font-weight: bold; color: black ">{{topic.child_posts.length}}</span></h1>
                    </span>
                </vs-row>
                <vs-row style="float: right">
                <span v-if="repliers.length >0" class="mt-2">
                    <router-link
                        :to="`/profile/${topic.user_identifier}`"
                        v-for="(replier, r) in repliers"
                        :key="r"
                    >
                            <img
                                :src="require(`@/assets/images/superheros/${getSuperhero(replier).avatar}-superhero.svg`)"
                                width="20"
                                height="20"
                            >

                    </router-link>

                </span>
                </vs-row>

        </vs-col>
    </section>
</template>

<script>
import {deletePost} from "@/controllers/wall";
import {getSuperHero} from "@/functions/superhero";
import {stripHTML} from "@/functions/utils/strings";
import {xAgo} from "@/functions/utils/date";
import {onlyUnique} from "@/functions/utils/arrays";

export default {
    name: "TopicPreview",
    props: {
        topic: {
            type: Object,
            required: true,
        },
        superhero: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        repliers: [],
        preview: 150
    }),
    methods:{
        removePost: async function() {
            let response = await deletePost(this.topic.wall_id, this.topic.post_id)
            if(!response){
                this.$emit('error', 'Issue deleting post, please try again or contact support.')
            }
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
        let unique = []
        for (const cp in this.topic.child_posts) {
            unique.push(this.topic.child_posts[cp].user_identifier)
        }
        this.repliers = unique.filter(onlyUnique)
    }
}
</script>

<style scoped>

</style>
