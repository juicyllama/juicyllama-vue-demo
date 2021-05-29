<template>
    <section>

        <!--------------
        LEFT PANEL
        ---------------->

        <vs-col
            style="display: grid;"
            vs-justify="center"
            vs-align="center"
            vs-lg="2"
            vs-xs="4"
        >

            <vs-row vs-justify="center" class="mb-2">

                <div class="flex align-items-center text-center ">

                    <router-link :to="`/profile/${topic.user_identifier}`">
                        <img
                            :src="require(`@/assets/images/superheros/${getSuperhero(topic.user_identifier).avatar}-superhero.svg`)"
                            width="40"
                            height="40"
                        >
                    </router-link>

                    <div class="mt-1">
                <router-link :to="`/profile/${topic.user_identifier}`">
                    {{topic.user_identifier}}
                </router-link>
                    </div>

                    <div class="mt-1 small">
                {{xAgo(topic.created_at)}}
                    </div>
                </div>
            </vs-row>


        </vs-col>

        <!--------------
       MAIN PANEL
       ---------------->

        <vs-col
            style="display: flex;"
            vs-lg="10"
            vs-xs="8"
        >

            <vs-row class="mb-2" style="display: contents">

                <div class="w-100">

                    <div style="float:right;" v-if="topic.user_identifier !== superhero.name">
                        <a

                            @click="likeComment(topic.wall_id, topic.post_id, topic.post_likes)"
                            class="pl-2 align-middle cursor-pointer">
                            <i v-if="checkIn(topic.post_likes)"
                               class="mdi mdi-heart" style="font-size: larger">

                            </i>
                            <i v-else class="mdi mdi-heart-outline" style="font-size: larger"></i>
                        </a>
                    </div>
                    <div style="float:right;" v-if="topic.user_identifier === superhero.name">
                        <a
                            @click="editting = !editting"
                            class="pl-2 align-middle cursor-pointer">
                            <i class="mdi mdi-pencil" style="font-size: larger">

                            </i>
                        </a>
                        <a
                            @click="deleteComment()"
                            class="pl-2 align-middle cursor-pointer">
                            <i class="ti ti-trash" style="font-size: larger">

                            </i>
                        </a>

                    </div>

                    <h3 v-if="title" class="mb-2">{{title}}</h3>

                    <div v-if="!editting">
                        <p v-if="topic.message" class="mt-2"><span v-html="topic.message"></span></p>
                    </div>
                    <div v-else>
                        <wiziwig
                            class="mt-2 mb-2"
                            placeholder="Topic Message"
                            :content="topic.message"
                            :type="`EDIT_TOPIC_${topic.post_id}_${superhero.name}`"
                            submit="keyup"
                            @submitted="processTopicEditMessage"
                            theme="boxed"
                            editorTheme="bubble"
                            style="width: 80%"
                        ></wiziwig>
                    </div>

                    <router-link
                        v-for="(like, l) in topic.post_likes"
                        :key="l"
                        :to="`/profile/${like.user_identifier}`">
                        <img
                            class="mb-3 mr-1"
                            :src="require(`@/assets/images/superheros/${getSuperhero(like.user_identifier).avatar}-superhero.svg`)"
                            width="20"
                            height="20"
                        >
                    </router-link>

                </div>
            </vs-row>


        </vs-col>


    </section>
</template>

<script>
import {xAgo} from "@/functions/utils/date";
import {getSuperHero} from "@/functions/superhero";
import {createLike, deleteLike, deletePost, updatePost} from "@/controllers/wall"
import Wiziwig from "@/views/_components/Wiziwig";


export default {
    name: "Topic",
    components: {Wiziwig},
    props: {
        topic: {
            type: Object,
            required: true,
        },
        title: {
            type: String
        },
        superhero: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        editting: false,
    }),
    methods:{
        deleteComment: async function() {

                await deletePost(
                    this.topic.wall_id,
                    this.topic.post_id
                )

            if(this.topic.parent_post_id === 0){
                this.$router.push('/forum')
            }

        },
        likeComment: async function(wall_id, post_id, post_likes) {

            let likeIndex = post_likes.findIndex(o => o.user_identifier === this.superhero.name)

            if(likeIndex === -1){

                await createLike(
                    wall_id,
                    post_id,
                    this.superhero.name
                )
            }else{

                await deleteLike(
                    wall_id,
                    post_id,
                    post_likes[likeIndex].like_id
                )
            }
        },
        processTopicEditMessage: async function (value) {
            this.topic.message = value
            this.editting = false
            await updatePost(
                this.topic.wall_id,
                this.topic.post_id,
                value
            )
        },
        checkIn(array){
            if(array && array.length >= 0){
                let likeIndex = array.findIndex(o => o.user_identifier === this.superhero.name)
                return likeIndex !== -1;
            }
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },
        xAgo(date){
            return xAgo(date)
        },

    }

}
</script>

<style scoped>

</style>
