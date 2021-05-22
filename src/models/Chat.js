import moment from 'moment'
import Service from "@/services/juicyllama/chat.service"

export default {

    Chat: function (data) {
        this.chat_id = Number(data.chat_id)
        this.app_id = Number(data.app_id)
        this.users = data.users
        this.status = data.status
        this.latest_chatter = data.latest_chatter
        this.latest_message = data.latest_message
        this.app_json = data.app_json
        this.messages = data.messages
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
        this.updated_at = moment(data.updated_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    getChat: async function(chat_id, user_identifier = false, limit = false, offset = false, after = false) {
        return new this.Chat(await Service.getChat(chat_id, user_identifier, limit, offset, after))
    },

    getChats: async function(user_identifier  = false, users_include = false, users_exclude = false, status = false, limit = false, offset = false, after = false) {

        let results = await Service.getChats(user_identifier, users_include, users_exclude, status, limit, offset, after)

        if (!results) {
            return false
        }

        for (let r = 0; r < results.length; r++) {
            results[r] = new this.Chat(results[r])
        }

        return results
    },

    countChats: async function (user_identifier  = false, users_include = false, users_exclude = false, status = false, after = false) {
        return await Service.countChats(user_identifier, users_include, users_exclude, status, after)
    },

    countMessages: async function (chat_id, after = false) {
        return await Service.countMessages(chat_id, after)
    },

    addChat: async function (user_identifier_1, user_identifier_2, app_json = false) {
        return new this.Chat(await Service.addChat(user_identifier_1, user_identifier_2, app_json))
    },

    updateChat: async function (chat_id, user_identifier_1 = false, user_identifier_2 = false, app_json = false) {
        return await Service.updateChat(chat_id, user_identifier_1, user_identifier_2, app_json)
    },

    markReadChat: async function (chat_id, user_identifier) {
        return await Service.markReadChat(chat_id, user_identifier)
    },

    removeChat: async function (chat_id, user_identifier) {
        return await Service.deleteChat(chat_id, user_identifier)
    },

}