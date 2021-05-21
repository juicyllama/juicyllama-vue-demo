import moment from 'moment'
import Service from "@/services/juicyllama/message.service"

export default {

    Message: function (data) {
        this.message_id = Number(data.message_id)
        this.chat_id = Number(data.chat_id)
        this.user_identifier = data.user_identifier
        this.app_json = data.app_json
        this.message = data.message
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
        this.updated_at = moment(data.updated_at).format(process.env.VUE_APP_DATE_FORMAT)
        if(data.deleted_at){
            this.deleted_at = moment(data.deleted_at).format(process.env.VUE_APP_DATE_FORMAT)
        }else{
            this.deleted_at = false
        }
    },

    addMessage: async function (chat_id, user_identifier, message, app_json = false) {
        return new this.Message(await Service.addMessage(chat_id, user_identifier, message, app_json))
    },

    updateMessage: async function (chat_id, message_id, user_identifier, message, app_json = false) {
        return await Service.updateMessage(chat_id, message_id, user_identifier, message, app_json)
    },

    deleteMessage: async function (chat_id, message_id) {
        return await Service.deleteMessage(chat_id, message_id)
    },

}