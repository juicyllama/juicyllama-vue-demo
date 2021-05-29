<template>
  <div>

      <Post :superhero="superhero" :post="thePost" type="popup" @close="closePopup()"></Post>
      <hr>

      <ReplyBox :superhero="superhero" :post="thePost"></ReplyBox>

      <template v-for="child in thePost.child_posts" >
              <Post :superhero="superhero"  :post="child" :key="child.post_id" type="child"></Post>
      </template>

  </div>
</template>
<script>
import Pusher from "pusher-js";
import Post from "@/views/_components/Walls/Post/Post";
import ReplyBox from "@/views/_components/Walls/Post/ReplyBox";
import moment from "moment";
import {readPost} from "@/controllers/wall";

export default {
    name: "PostPopup",
    props:{
        post: {
            type: Object,
            required: true,
        },
        superhero: {
            type: Object,
            required: true,
        },
    },
    components: {ReplyBox, Post},
    data: () => ({
        thePost: {},
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
        checkLikes(post_likes){
            if(post_likes && post_likes.length >= 0){
                let likeIndex = post_likes.findIndex(o => Number(o.user_identifier) === this.superhero.name)
                return likeIndex !== -1;
            }
        },
        closePopup(){
            this.$emit('close', moment())
        }
    },
    created: async function(){
        this.thePost = this.post
        this.subscribe()
    },
    watch: {
        post: async function () {
            this.thePost = this.post
            await this.checkLikes()
        }
    }


};
</script>
