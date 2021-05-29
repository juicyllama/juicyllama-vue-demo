<template>
<div>
    <div style="margin-top: 10px">
        <img
            :src="require(`@/assets/images/superheros/${getSuperhero(superhero.name).avatar}-superhero.svg`)"
            width="30"
            class="rounded-circle"
        />
    </div>

    <div class="comment-text flex">
        <div class="p-2 m-1">
            <div style="display: inline-block; width: 100%">
                <wiziwig placeholder="Enter reply and hit enter" :success="posted" :type="`POST_REPLY_${post.wall_id}_${post.post_id}`" buttonLabel="REPLY" submit="keyup" @submitted="wiziwigPost"></wiziwig>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import wiziwig from "@/views/_components/Wiziwig";
import moment from "moment"
import {createPost} from "@/controllers/wall";
import {getSuperHero} from "@/functions/superhero";

export default {
    name: "ReplyBox",
    props: {
        post: {
            type: Object,
            required: true,
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
        postValue: "",
        posted: null,
    }),
    methods: {
        wiziwigPost: function (value) {
            this.postValue = value
            this.postEnter()
        },

        postEnter: async function () {

            let result = await createPost(
                this.post.wall_id,
                this.superhero.name,
                this.postValue,
                this.post.post_id,
            )

            if (result) {
                this.posted = moment()
            }
        },

        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },

    },
};
</script>
