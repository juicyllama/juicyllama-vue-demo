<template>
    <div class="chatapp">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
            <vs-card>
                <div class="left-part">
                    <vs-sidebar  :click-not-close="doNotClose" :hidden-background="doNotClose" v-model="chatSidebarActive">
                        <div class="pt-1 pl-3 pr-3 pb-3  border-bottom">
                            <vs-input icon-no-border icon="search" placeholder="Search contacts" v-model="search" class="w-100"/>
                        </div>
                        <!---
                        User List
                        --->
                        <div v-bar class="vs-scrollable">
                            <div>
                                <ul class="chat-userlist common-list" >
                                    <li v-for="(conversation, index) in chatGrid"
                                        :key="index"
                                        @click="(e) => openMessages(conversation, e)" >
                                        <router-link :to="`/profile/${conversation.user_identifier}`">
                                            <img
                                                :src="require(`@/assets/images/superheros/${getSuperhero(conversation.user_identifier).avatar}-superhero.svg`)"
                                                width="42"
                                                height="42"
                                            >
                                        </router-link>
                                        <div class="user-about ml-2">

                                            <h6>
                                                {{conversation.user.nickname}}
                                                <vs-icon icon-pack="ti ti-trash" color="danger" class="float-right" @click="deleteChat(conversation.chat_id)"></vs-icon>
                                                <vs-chip v-if="newMessage(conversation)" color="success" class="mr-1 float-right" style="border-radius: 10px; min-height: 16px; max-width: 35px;">New</vs-chip>
                                            </h6>

                                            <div v-if="conversation.latest_message" class="d-flex">
                                                <span v-if="fromMe(conversation.latest_chatter)">
                                                     <img
                                                         :src="require(`@/assets/images/superheros/${getSuperhero(superhero.name).avatar}-superhero.svg`)"
                                                         width="15"
                                                         height="15"
                                                     >
                                                </span>
                                                <span v-else>
                                            <router-link :to="`/profile/${conversation.user_identifier}`">
                                               <img
                                                   :src="require(`@/assets/images/superheros/${getSuperhero(superhero.user_identifier).avatar}-superhero.svg`)"
                                                   width="15"
                                                   height="15"
                                               >
                                            </router-link>
                                         </span>
                                                <span class="ml-1" >{{stripHTML(conversation.latest_message)}}</span>
                                            </div>


                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!---
                        User List
                        --->

                    </vs-sidebar>
                </div>
                <div class="right-part chat-container">

                    <template  v-if="conversation">

                        <!---
                User Navbar
                --->
                        <div class="hide-on-desktop">
                            <div class="chat-topbar d-flex p-3 align-items-center" >
                                <div class="cursor-pointer mr-2" @click.stop="toggleChatSidebar(true)">
                                    <vs-icon icon="menu"></vs-icon>
                                </div>

                                <router-link :to="`/profile/${conversation.user_identifier}`">
                                    <img
                                        :src="require(`@/assets/images/superheros/${getSuperhero(conversation.user_identifier).avatar}-superhero.svg`)"
                                        width="37"
                                        height="37"
                                    >
                                </router-link>
                                <div class="user-about ml-2"><h6>{{conversation.user_identifier}}</h6></div>

                            </div>
                        </div>

                        <div class="chat-topbar send-message pb-1 border-bottom">
                            <wiziwig placeholder="Type and hit enter" :success="posted" :type="`CHAT_${chat_id}`" submit="keyup" @submitted="wiziwigPost" theme="unboxed" v-if="chat_id"></wiziwig>
                        </div>

                        <!---
                        Chat Room
                        --->
                        <div v-bar class="vs-scrollable bg-light">
                            <div>
                                <div class="chat-room bg-light">
                                    <div class="d-flex align-items-center mb-3" v-for="message in conversation.messages" :key="message.message_id" :class="{fromMe: fromMe(message.user_identifier), 'messageItem': true}">
                                            <span class="thumb">

                                                <span  v-if="fromMe(message.user_identifier)">
                                                     <img
                                                         :src="require(`@/assets/images/superheros/${getSuperhero(message.user_identifier).avatar}-superhero.svg`)"
                                                         width="37"
                                                         height="37"
                                                     >
                                                </span>

                                                <span v-else>
                                                    <router-link :to="`/profile/${conversation.user_identifier}`">
                                                         <img
                                                             :src="require(`@/assets/images/superheros/${getSuperhero(conversation.user_identifier).avatar}-superhero.svg`)"
                                                             width="37"
                                                             height="37"
                                                         >
                                                    </router-link>
                                                 </span>

                                                </span>

                                        <div v-if="message_id === message.message_id" class="messageBody w-100">
                                            <wiziwig placeholder="Type and hit enter" :content="message.message" :type="`MESSAGE_${message.message_id}`" submit="keyup" @submitted="editedMessage" theme="boxed"></wiziwig>
                                        </div>
                                        <div v-else class="messageBody">
                                            <span v-if="superhero.name && message.user_identifier === superhero.name" v-html="message.message" @click="editMessage(message.message_id)"></span>
                                            <span v-else v-html="message.message"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="d-flex justify-content-center align-items-center h-100 bg-light"><h4 @click.stop="toggleChatSidebar(true)">Start conversation</h4></div>
                    </template>
                </div>

            </vs-card>
        </vs-col>

    </div>
</template>

<script>
import Vue from 'vue';
import ChatController from "@/controllers/chat"
import login_info from "@/store/login_info"
import ArrayUtils from "@/utils/arrays"
import StringUtils from "@/utils/strings"
import Pusher from "pusher-js";
import FollowingFunction from "@/functions/following";
import Wiziwig from "@/views/components/Wiziwig";
import moment from "moment"
import {auth, superhero} from "@/functions/auth";
import {getSuperHero} from "@/functions/superhero";

export default {
    name: 'Chat',
    components: {Wiziwig},
    data: () => ({
        superhero: false,
        chat_id: null,
        chatSidebarActive: true,
        doNotClose: true,
        handleSearchInput: "",
        chats: [],
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
        editedMessage: async function (value) {

            let message = await ChatController.updateMessage(this.$log, this.chat_id, this.message_id, login_info.getUserId(), value)

            if(message) {

                for(const m in this.conversation.messages){
                    if(Number(this.conversation.messages[m].message_id) === Number(this.message_id)){
                        this.conversation.messages[m].message = value
                    }
                }

                this.message_id = null
            }
        },
        getChat: async function (chat_id) {

            this.$set(this, 'conversation', await ChatController.readChat(
                this.$log,
                Number(chat_id),
                login_info.getUserId(),
                this.message_limit,
                this.message_offset,
                false
            ))

        },
        getChats: async function () {

            let users_include = false
            let users_exclude = false

            let chats = await ChatController.readChats(this.superhero.name)


            this.$set(this, 'chats', chats.filter(
                function (chat){
                    if(chat.latest_message || chat.latest_chatter == superhero.name ){
                        return chat
                    }
                })
            )
        },
        openMessages: async function(conversation) {
            this.$router.push(this.$route.meta.path+Number(conversation.chat_id))
            this.chat_id = conversation.chat_id
            await this.getChat(conversation.chat_id)

            if (this.windowWidth < 1170) {
                this.toggleChatSidebar();
            }

            if(!this.deleted.includes(conversation.chat_id)){
                localStorage.setItem('unreadChatCount', (Number(localStorage.unreadChatCount) - 1));
                await ChatController.markAsRead(this.$log, conversation.chat_id, login_info.getUserId())
            }
        },
        addMessage: async function() {
            if (this.chat_id) {

                let message = await ChatController.createMessage(this.$log, this.chat_id, login_info.getUserId(), this.message)

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
                    await ChatController.markAsRead(this.$log, this.chat_id, login_info.getUserId())
                }

            }
        },
        editMessage: async function(message_id){
            this.message_id = message_id
        },
        deleteChat: async function(chat_id) {

            let response = await ChatController.deleteChat(this.$log, chat_id, login_info.getUserId())

            if (response) {
                this.deleted.push(chat_id)
                this.post_id = null
                this.conversation = null
                this.chats = ArrayUtils.filterArrayObjectsOut(this.chats,{chat_id: chat_id})
                this.$router.push(this.$route.meta)
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
        fromMe: function(user_identifier) {
            return Number(user_identifier) === Number(login_info.getUserId());
        },
        newMessage: function(conversation) {

            if(Number(conversation.users[0]) === Number(login_info.getUserId()) && conversation.status[0] === 'UNREAD'){
                return true
            }else if(Number(conversation.users[1]) === Number(login_info.getUserId()) && conversation.status[1] === 'UNREAD'){
                return true
            }else{
                return false
            }

        },
        getFollowing: async function(){
            let following = await FollowingFunction.getFollowing(this.$log)
            return following ? following : []
        },
        subscribeChat: async function () {
            let pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY_COMMUNITY, {
                cluster: "eu",
            });
            let channel = process.env.VUE_APP_JUICYLLAMA_APP_API_KEY;

            //subscribe this groups events
            let event = "chat_" + login_info.getUserId()

            pusher.subscribe(channel);
            pusher.bind(event, async (data) => {
                this.$log.pusher(
                    channel,
                    event,
                    `[${data.action}] -> ${JSON.stringify(data)}`
                );

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

            this.$log.pusher(channel, event, "Subscribed");
        },
        stripHTML: function(value){
            return StringUtils.stripHTML(value)
        },
        runner: async function(){
            await this.getChats()
            this.subscribeChat()
        },
        getSuperhero(user_identifier){
            return getSuperHero(user_identifier)
        },
    },
    mounted: async function () {
        if(this.chat_id){
            await this.getChat(this.chat_id)
        }
    },
    created: async function () {
        auth(this.$router)
        this.superhero = superhero(this.$router)
        online(this.superhero.name)

        this.chat_id = Number(this.$route.params.chat_id)

        this.$nextTick(() => {
            window.addEventListener('resize', this.handleWindowResize);
        })
        this.setSidebarWidth();

        this.runner()
    },

    watch:{
        $route: async function (to){
            this.chat_id = Number(to.params.chat_id)
            this.conversation = false
            this.runner()
        }
    },

    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleWindowResize)
    },

    computed: {
        chatGrid() {
            return this.chats.filter(
                chats =>
                    ( chats.user_identifier
                        .toLowerCase()
                        .includes(this.search.toLowerCase())
                    )
            );
        }
    },

}
</script>
