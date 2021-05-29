<template>

  <div class="mt-15">

      <Post :superhero="superhero" :post="post" type="parent" @replybox="toggleCommentBox()" @popup="fullScreen(post.post_id)"></Post>

      <div class="d-flex flex-row flex-100 comment-row mt-0 p-1" v-if="replybox">

          <ReplyBox :superhero="superhero" :post="post"></ReplyBox>

      </div>

      <vs-popup class="holamundo" :title="`Post: #${popup_id}`" :active.sync="fullpost"  background-color="var(--primary)" style="z-index: 99999">
        <PostPopup v-if="popup_id > 0" :superhero="superhero" :post="post" @close="fullpost=false"></PostPopup>
      </vs-popup>

  </div>


</template>
<script>
import Pusher from "pusher-js";
import Post from "@/views/_components/Walls/Post/Post";
import PostPopup from "@/views/_components/Walls/Post/PostPopup";
import ReplyBox from "@/views/_components/Walls/Post/ReplyBox";
import {readPost} from "@/controllers/wall";

export default {
    name: "SinglePost",
    props:{
        post: {
            type: Object,
            required: true
        },
        superhero: {
            type: Object,
            required: true,
        },
    },
    components: {PostPopup, Post, ReplyBox},
    data: () => ({
        replybox: false,
        popup_id: 0,
        fullpost: false
    }),
    methods:{
        subscribe(){
            let pusher = new Pusher(process.env.VUE_APP_JUICYLLAMA_PUSHER_KEY, {cluster: 'eu'})
            let channel = process.env.VUE_APP_JUICYLLAMA_API_KEY
            let event = 'post_'+this.thePost.post_id

            pusher.subscribe(channel);
            pusher.bind(event, async () => {
                this.thePost = await readPost(
                    this.thePost.wall_id,
                    this.thePost.post_id,
                    false
                )
            });
        },
        toggleCommentBox() {
            this.replybox = !this.replybox;
        },
        fullScreen(post_id){
            this.popup_id = post_id
            this.fullpost = true
        },
        close(){
            this.fullpost = false
        },

    },
    created: async function(){
        this.thePost = this.post
        this.subscribe()
    },
    watch: {
        post: async function () {
            this.thePost = this.post
        }
    }

};
</script>
