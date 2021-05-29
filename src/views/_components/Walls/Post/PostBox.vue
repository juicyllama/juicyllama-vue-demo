<template>

<div style="display: inline-block; width: 100%">
    <div class="mb-15" v-if="error.length > 0 || success.length > 0">
        <ErrorBox :errors="error"></ErrorBox>
        <SuccessBox :success="success"></SuccessBox>
    </div>
    <wiziwig :placeholder="placeholder" :success="posted" type="NAVAR_POST" buttonLabel="POST" @submitted="wiziwigPost" v-if="placeholder"></wiziwig>

    <div v-if="facebook && facebook_data" class="d-flex" style="margin: -30px 10px">
        <span class="text-muted" style="font-size: smaller">
            Also post on Facebook to group <a href="https://www.facebook.com/groups/morenichelounge" target="_blank">MoreNiche Lounge</a>
        </span>
        <vs-checkbox class="pl-1" v-model="facebook_checkbox"></vs-checkbox>

    </div>
</div>
</template>

<script>
import wiziwig from "@/views/components/Wiziwig";
import users from "@/functions/users";
import login_info from "@/store/login_info";
import utilsGravatar from "@/utils/gravatar";
import groupsService from "@/services/facebook/groups.service";
import facebookUserService from "@/services/juicyllama/facebook.user.service"
import facebookPostService from "@/services/juicyllama/facebook.post.service"
import PostsService from "@/services/juicyllama/posts.service";
import TurndownService from "turndown"
import SuccessBox from "@/views/components/SuccessBox";
import ErrorBox from "@/views/components/ErrorBox";
import StringUtil from "@/utils/strings"
import moment from "moment"

export default {
    name: "Postbox",
    components: {wiziwig, ErrorBox, SuccessBox},
    props: {
        placeholder: {
            type: String,
            default: "Enter message here",
        },
        facebook: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        postValue: "",
        facebook_data: null,
        facebook_checkbox: null,
        error: '',
        success: '',
        posted: null
    }),
    methods: {
        wiziwigPost: function (value) {
            this.postValue = value
            this.postEnter()
        },
        postEnter: async function () {

            if(this.postValue.length > 20){
                let wall_id

                switch (users.endpoint()) {
                    case 'partners':
                        wall_id = process.env.VUE_APP_JUICYLLAMA_PARTNER_WALL_ID
                        break

                    case 'admins':
                        wall_id = process.env.VUE_APP_JUICYLLAMA_EXPERT_WALL_ID
                        break
                }

                let new_post_result = await PostsService.addPost(
                    this.$log,
                    wall_id,
                    login_info.getUserId(),
                    StringUtil.cleanString(this.postValue),
                    false,
                    {
                        gravatar: utilsGravatar.gravatarHash(login_info.getEmail()),
                        nickname: login_info.getNick(),
                        user_type: users.user_type()
                    }
                )

                if (new_post_result) {

                    this.success = 'Message successfully posted.'
                    this.error = ''
                    this.posted = moment()

                    //should we post on facebook?
                    if(this.facebook_checkbox && this.facebook_data && this.postValue.length < 63206){

                        const turndownService = new TurndownService();
                        const markdown = turndownService.turndown(this.postValue);

                        let facebook_post = await groupsService.groupPost(
                            this.$log, {
                                access_token: this.facebook_data.access_token,
                                message: markdown,
                                formatting: "MARKDOWN"
                            })

                        if(facebook_post && facebook_post.id){

                            let posts = await PostsService.getPosts(
                                this.$log, wall_id,
                                0,
                                1,
                                0,
                                false,
                                login_info.getUserId(),
                            )

                            await facebookPostService.putFacebookPost(this.$log, posts[0].post_id, facebook_post.id)
                        }
                    }

                } else {
                    this.error = 'Error posting message, please try again.'
                    this.success = ''
                }
            }else{
                this.error = 'Message too short, please write something longer.'
                this.success = ''
            }
        },
    },
    async created() {
        this.facebook_checkbox = this.facebook
        let facebook = await facebookUserService.getFacebookUser(this.$log, login_info.getUserId())
        if (facebook) {
            this.facebook_data = facebook
        }
    },
};
</script>