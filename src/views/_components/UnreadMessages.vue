<template>
<div v-if="unread_chats.length > 0" class="d-flex mb-3">
    <vs-alert>
        <router-link :to="`/messages`">You have {{unread_chats.length}} unread message<span v-if="unread_chats.length > 1">s</span></router-link>
            <span v-for="(chat, index) in unread_chats" :key="index" class="ml-1">
                    <router-link :to="`/message/${chat.chat_id}`">
                        <img
                            :src="require(`@/assets/images/superheros/${getSuperhero(chat.latest_chatter).avatar}-superhero.svg`)"
                            :alt="chat.latest_chatter"
                            class="rounded-circle"
                            width="20"
                        />
                    </router-link>
                </span>
    </vs-alert>
</div>
</template>
<script>
import {superhero} from "@/functions/auth";
import {readChats} from "@/controllers/messages"
import {getSuperHero} from "@/functions/superhero";
import superheros from "@/assets/superheros.json"

export default {
    name: "UnreadMessages",
    components: {},
    data: () => ({
        superhero: false,
        superheros: [...superheros],
        unread_chats: []
    }),
    methods: {
        pollData: async function(){
            this.polling = setInterval(async () => {
                    await this.getUnread()
            }, 300000) // every 5 mins
        },

        getUnread: async function(){
            let status = 'UNREAD'

            this.$set(this, 'unread_chats', await readChats(
                this.superhero.name,
               false,
                false,
                status
            ))
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },

    },
    beforeDestroy () {
        clearInterval(this.polling)
    },
    created: function () {
        this.superhero = superhero(this.$router)
        this.pollData()
        this.getUnread()
    },
}
</script>
