<template>
    <div class="chatapp">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
            <vs-card>

                <!----------------
                    LEFT PANEL
                ----------------->

                <div class="left-part">
                    <vs-sidebar  :click-not-close="doNotClose" :hidden-background="doNotClose" v-model="chatSidebarActive">

                        <div v-bar class="vs-scrollable">
                            <div>
                                <ul class="chat-userlist common-list" >
                                    <li v-for="(chat, index) in chats"
                                        :key="index"
                                        :class="{'chat-userlist-selected': chat.chat_id === chat_id}"
                                        @click="(e) => openMessages(chat, e)" >

                                            <img
                                                :src="require(`@/assets/images/superheros/${getSuperhero(otherChatter(chat)).avatar}-superhero.svg`)"
                                                width="42"
                                                height="42"
                                            >
                                    </li>
                                </ul>
                            </div>
                        </div>


                    </vs-sidebar>
                </div>


                <!----------------
                   MAIN PANEL
               ----------------->

                <div class="right-part chat-container">

                    <template  v-if="conversation">


                        <div class="chat-topbar send-message pb-1 border-bottom">
                            <wiziwig style="width: 95%" placeholder="Type and hit enter" :success="posted" :type="`CHAT_${chat_id}`" submit="keyup" @submitted="wiziwigPost" theme="unboxed" v-if="chat_id"></wiziwig>
                            <span  @click="removeChat(chat_id)"><vs-icon icon-pack="ti ti-trash" color="danger" style="padding-top: 10px;" class="float-right cursor-pointer"></vs-icon></span>
                        </div>

                        <!---
                        Chat Room
                        --->
                        <div v-bar class="vs-scrollable">
                            <div>
                                <div class="chat-room mt-2">
                                    <div class="align-items-center mb-3 w-100" v-for="message in conversation.messages" :key="message.message_id" style="display: flex;">

                                        <div v-if="message.user_identifier !== superhero.name" class="align-items-center d-flex fromMe messageItem">

                                            <span class="thumb">
                                                 <router-link :to="`/profile/${message.user_identifier}`">
                                                  <img
                                                      :src="require(`@/assets/images/superheros/${getSuperhero(message.user_identifier).avatar}-superhero.svg`)"
                                                      width="37"
                                                      height="37"
                                                  >
                                                 </router-link>
                                            </span>

                                            <div v-if="message_id === message.message_id" class="messageBody w-100">
                                                <wiziwig placeholder="Type and hit enter" :content="message.message" :type="`MESSAGE_${message.message_id}`" submit="keyup" @submitted="editedMessage" theme="boxed"></wiziwig>
                                            </div>
                                            <div v-else class="messageBody">
                                                <span v-if="superhero.name && message.user_identifier === superhero.name" v-html="message.message" @click="editMessage(message.message_id)"></span>
                                                <span v-else v-html="message.message"></span>
                                            </div>
                                        </div>

                                        <div v-else class="messageItem w-100 mb-3 align-items-center">

                                            <span class="thumb" style="float: right">
                                                         <img
                                                             :src="require(`@/assets/images/superheros/${getSuperhero(message.user_identifier).avatar}-superhero.svg`)"
                                                             width="37"
                                                             height="37"
                                                         >
                                            </span>

                                            <div class="messageBody" style="float: right">
                                                <span v-if="superhero.name && message.user_identifier === superhero.name" v-html="message.message" @click="editMessage(message.message_id)"></span>
                                                <span v-else v-html="message.message"></span>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>


                    <!----------------
                         NO CHAT
                    ----------------->

                    <template v-else>
                        <div class="justify-content-center align-items-center h-100">

                            <div class="flex">
                                <h4 @click.stop="toggleChatSidebar(true)" class="mb-2">
                                    Start conversation
                                </h4>
                            </div>

                                <div class="justify-content-center align-items-center">
                                    <span
                                    class="popover-icon"
                                    v-for="(superhero, index) in superheros"
                                    :activity="superhero"
                                    :key="index"
                                    >
                                        <img
                                            :src="require(`@/assets/images/superheros/${getSuperhero(superhero.name).avatar}-superhero.svg`)"
                                            width="32"
                                            height="32"
                                            @click="newChat(superhero.name)"
                                            class="cursor-pointer mb-1 mr-1"
                                        >
                                    </span>

                                </div>


                        </div>
                    </template>
                </div>

            </vs-card>
        </vs-col>

    </div>
</template>

<script>
import Vue from 'vue';
import {online} from "@/functions/activity";
import {updateMessage, createChat, readChat, readChats, markAsRead, createMessage, deleteChat} from "@/controllers/messages"
import {stripHTML} from "@/functions/utils/strings"
import Pusher from "pusher-js";
import Wiziwig from "@/views/_components/Wiziwig";
import moment from "moment"
import {auth, superhero} from "@/functions/auth";
import {getSuperHero} from "@/functions/superhero";
import superheros from "@/assets/superheros.json"

export default {
    name: 'Chat',
    components: {Wiziwig},
    data: () => ({
        superhero: false,
        superheros: [...superheros],
        chat_id: null,
        chats: [],
        chatSidebarActive: true,
        doNotClose: true,
        handleSearchInput: "",
        chatUserActive: true,
        conversation: false,
        sendMessage: " ",
        windowWidth: window.innerWidth,
        following: false,
        search: "",
        deleted: [],
        message_limit: 99,
        message_offset: 0,
        posted: null,
        message: "",
        message_id: null,
    }),
    methods: {
        wiziwigPost: function (value) {
            this.message = value
            this.addMessage()
        },

        newChat: async function (user_identifer_2) {
            let chat = await createChat(this.superhero.name, user_identifer_2)
            if(chat.chat_id) {
                this.$router.push('/messages/' + Number(chat.chat_id))
            }
        },
        getChat: async function (chat_id) {

            this.$set(this, 'conversation', await readChat(
                Number(chat_id),
                this.superhero.name,
                this.message_limit,
                this.message_offset,
                false,
                false
            ))

        },
        getChats: async function () {
            this.$set(this, 'chats', await readChats(this.superhero.name))
        },

        removeChat: async function(chat_id) {
            let response = await deleteChat(chat_id, this.superhero.name)
            if (response) {
                this.chat_id = false
                this.conversation = false
                this.$router.push('/messages')
            }
        },

        openMessages: async function(chat) {
            this.$router.push('/messages/'+Number(chat.chat_id))
        },
        addMessage: async function() {
            if (this.chat_id) {

                let message = await createMessage(this.chat_id, this.superhero.name, this.message)

                if(message){
                    Vue.set(this, 'conversation', Object.assign({}, this.conversation, {
                        messages: [
                            message,
                            ...this.conversation.messages || []
                        ],
                    }));

                    //update correct latest_message locally
                    for(const c in this.chats){
                        if(this.chats[c].chat_id === this.chat_id){
                            this.chats[c].latest_message =  this.message
                        }
                    }

                    this.posted = moment()
                    localStorage.setItem('unreadChatCount', (Number(localStorage.unreadChatCount) - 1));
                    await markAsRead(this.chat_id, this.superhero.name)
                }

            }
        },
        newMessage: function(conversation) {

            if(conversation.users[0] === this.superhero.name && conversation.status[0] === 'UNREAD'){
                return true
            }else if(conversation.users[1] === this.superhero.name && conversation.status[1] === 'UNREAD'){
                return true
            }else{
                return false
            }

        },
        editMessage: async function(message_id){
            this.message_id = message_id
        },
        editedMessage: async function (value) {

            let message = await updateMessage(this.chat_id, this.message_id, this.superhero.name, value)

            if(message) {

                for(const m in this.conversation.messages){
                    if(Number(this.conversation.messages[m].message_id) === Number(this.message_id)){
                        this.conversation.messages[m].message = value
                    }
                }

                this.message_id = null
            }
        },

        handleWindowResize(event) {
            this.windowWidth = event.currentTarget.innerWidth;
            this.setSidebarWidth();
        },
        setSidebarWidth() {
            if (this.windowWidth < 1170) {
                this.chatSidebarActive = this.doNotClose = false;
            } else {
                this.chatSidebarActive = this.doNotClose = true;
            }
        },
        toggleChatSidebar(value = false) {
            if (!value && this.clickNotClose) return
            this.chatSidebarActive = value;
        },

        otherChatter: function(chat){
            if(chat.users[0] === this.superhero.name){
                return chat.users[1]
            }
            if(chat.users[1] === this.superhero.name){
                return chat.users[0]
            }
        },
        subscribeChat: async function () {
            let pusher = new Pusher(process.env.VUE_APP_JUICYLLAMA_PUSHER_KEY, {cluster: 'eu'})
            let channel = process.env.VUE_APP_JUICYLLAMA_API_KEY
            let event = "chat_" + this.superhero.name

            pusher.subscribe(channel);
            pusher.bind(event, async (data) => {

                switch(data.action){
                    case 'new_message':
                    case 'update_message':
                    case 'delete_message':
                        if(Number(data.message.chat_id) === Number(this.chat_id)){
                            await this.getChat(this.chat_id)
                        }else{
                            await this.getChats()
                        }

                        break
                    case 'new_chat':
                    case 'update_chat':
                    case 'delete_chat':
                        await this.getChats()
                        break
                }
            });
        },
        stripHTML: function(value){
            return stripHTML(value)
        },

        runner: async function(){
            await this.getChats()
            this.subscribeChat()
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },
    },
    created: async function () {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)

        this.chat_id = Number(this.$route.params.chat_id)

        if(this.chat_id){
            await this.getChat(this.chat_id)
        }

        this.$nextTick(() => {
            window.addEventListener('resize', this.handleWindowResize);
        })
        this.setSidebarWidth();

        this.runner()
    },

    watch:{
        $route: async function (to){
            if(to.params.chat_id){
                this.chat_id = Number(to.params.chat_id)
                await this.getChat(this.chat_id)
            }
            this.runner()
        }
    },

    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleWindowResize)
    },

}
</script>
<style>
.chatapp .vs-sidebar {
    max-width: 60px;
    background-color: #f0f5f9;
    border-right: none;
}

.chat-userlist-selected {
background-color: white;
}

@media only screen and (min-width: 801px) {
    .chatapp .right-part {
        margin-left: 60px;
    }

}

.fromMe .messageBody {
    margin-left: 20px;
    background-color: var(--light);
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    border-radius: 0px 30px 30px 30px;
}

.messageBody {
    margin-right: 20px;
    background-color: var(--primary);
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    border-radius: 30px 0px 30px 30px;
}

</style>