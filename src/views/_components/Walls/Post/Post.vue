<template>

    <div class="d-md-flex align-items-center" v-if="post.post_id" style="margin: -15px 0px;">


        <!-- /////////////////////////////////////////////
                                         Profile Image
                    /////////////////////////////////////////////-->

            <div class="d-flex flex-row flex-100 comment-row mt-0 p-3">

                <div class="p-2">
                    <router-link :to="`/profile/${post.user_identifier}`">

                        <img
                            :src="require(`@/assets/images/superheros/${getSuperhero(post.user_identifier).avatar}-superhero.svg`)"
                             width="40"
                             class="rounded-circle"
                        />

                    </router-link>
                </div>

                <div class="comment-text flex pl-3">

                  <h6 class="font-medium feed-mt5" style="padding-bottom: 3px">
                      <router-link :to="`/profile/${post.user_identifier}`" class="header-color">
                          {{ post.user_identifier }}
                      </router-link>

                      <span v-if="type === 'child'"><br><span class="text-capitalize text-muted" style="font-weight: lighter; font-size: x-small"> {{xAgo(post.created_at)}}</span></span>

                      <span v-if="post.user_identifier === superhero.name">
                          <a class="pl-2 align-middle cursor-pointer" @click="editPost()"><i class="mdi mdi-pencil primary" ></i></a>
                          <a class="align-middle cursor-pointer" @click="deletePost(post.wall_id, post.post_id)"><i class="ti-trash primary" ></i></a>
                      </span>
                      <span v-else>
                           <a @click="likeComment(post.wall_id, post.post_id, post.post_likes)" class="pl-2 align-middle cursor-pointer"><i v-if="checkIn(post.post_likes)" class="mdi mdi-heart primary"></i><i v-else class="mdi mdi-heart-outline primary"></i></a>
                      </span>
                  </h6>


                  <div class="small">

                      <span v-if="type === 'parent'">
                          <a @click="loadPost(post.post_id)"><span class="text-capitalize primary cursor-pointer">{{xAgo(post.created_at)}}</span></a>
                      </span>
                      <span v-else-if="type === 'popup'">
                         <span class="text-capitalize">{{xAgo(post.created_at)}}</span>
                      </span>


                      <span v-if="type !== 'child'">
                          <span v-if="post.child_posts.length > 0" class="pl-2">

                              <span v-if="type === 'parent'">
                                <a @click="loadPost(post.post_id)">
                                    <span v-if="post.child_posts.length > 1" class="primary cursor-pointer">{{post.child_posts.length}} Comments</span>
                                    <span v-else-if="post.child_posts.length > 0" class="primary cursor-pointer">{{post.child_posts.length}} Comment</span>
                                </a>
                              </span>
                              <span v-else-if="type === 'popup'">
                                  <span v-if="post.child_posts.length > 1">{{post.child_posts.length}} Comments</span>
                                  <span v-else-if="post.child_posts.length > 0">{{post.child_posts.length}} Comment</span>
                              </span>

                          </span>
                          <span class="pl-2" v-else>0 Comments</span>
                      </span>

                      <a v-if="type === 'parent'" @click="toggleCommentBox()" class="pl-2 align-middle cursor-pointer"><i class="mdi mdi-reply primary" ></i></a>
                  </div>

                    <span v-if="editbox" class="mb-3 d-block mt-2" >

                        <div class="comment-footer" style="margin: 0px 0px -10px -67px;">
                            <div style="display: inline-block; width: 100%">
                                 <wiziwig placeholder="Edit Message" :content="post.message" :success="posted" :type="`POST_EDIT_${post.wall_id}_${post.post_id}`" submit="keyup" buttonLabel="EDIT" @submitted="wiziwigPost" v-if="post.wall_id && post.post_id"></wiziwig>
                            </div>
                        </div>

                    </span>

                    <!-- /////////////////////////////////////////////
                                           Message
                    /////////////////////////////////////////////-->

                    <span v-else class="mb-3 d-block mt-4">

                        <div class="comment-footer" style="margin: 0px 0px -10px -67px;">
                           <span v-html="post.message"></span>
                        </div>

                    </span>


                    <!-- /////////////////////////////////////////////
                        Post Likes
                    /////////////////////////////////////////////-->


                  <div class="comment-footer" style="margin: -10px 0px -20px -55px;">
                      <vs-td class="tag-item" v-if="post.post_likes.length > 0">
                          <div
                              class="popover-icon"
                              v-for="like in post.post_likes"
                              :like="like"
                              :key="like.like_id"
                          >

                              <router-link :to="profileURL(like.user.user_type, like.user_identifier) ">
                                  <vs-avatar v-if="type === 'child'"
                                      size="24px"
                                             :src="require(`@/assets/images/superheros/${getSuperhero(like.user_identifier).avatar}-superhero.svg`)"
                                      class="feed-like-avatar con-img vs-avatar--con-img rounded-circle vs-component vs-radius popover-item"
                                  ></vs-avatar>
                                  <vs-avatar v-else
                                             size="32px"
                                             :src="require(`@/assets/images/superheros/${getSuperhero(like.user_identifier).avatar}-superhero.svg`)"
                                             class="feed-like-avatar con-img vs-avatar--con-img rounded-circle vs-component vs-radius popover-item"
                                  ></vs-avatar>
                              </router-link>

                          </div>
                      </vs-td>
                  </div>
              </div>

            </div>

    </div>

</template>
<script>
import wiziwig from "@/views/_components/Wiziwig";
import moment from 'moment'
import {xAgo} from "@/functions/utils/date";
import {getSuperHero} from "@/functions/superhero";
import {createLike, deleteLike, deletePost, updatePost} from "@/controllers/wall"

export default {
    name: "Post",
    props:{
        post: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        superhero: {
            type: Object,
            required: true,
        },
    },
    components: {
        wiziwig
    },
    data: () => ({
        editbox: false,
        replybox: false,
        editSuccess: false,
        editFailed: false,
        posted: null,
        postValue: ''
    }),
    methods:{
        loadPost: function(post_id){
            this.$emit('popup', post_id)
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

        xAgo(date){
            return xAgo(date)
        },
        checkIn(array){
            if(array && array.length >= 0){
                let likeIndex = array.findIndex(o => o.user_identifier === this.superhero.name)
                return likeIndex !== -1;
            }
        },
        toggleCommentBox() {
            this.$emit('replybox', !this.replybox)
        },

        deletePost: async function() {

            await deletePost(
                this.topic.wall_id,
                this.topic.post_id
            )

            if(this.type === 'popup'){
                this.$emit('close', moment())
            }

        },

        editPost(){
            this.editbox = !this.editbox;
        },
        wiziwigPost: function (value) {
            this.postValue = value
            this.editEnter()
        },
        editEnter: async function () {

            let result = await updatePost(
                this.post.wall_id,
                this.post.post_id,
                this.postValue
            )

            if(result){
                this.editSuccess = true
                this.editbox = false
            }else{
                this.editFailed = true
            }
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },
    },
};
</script>
