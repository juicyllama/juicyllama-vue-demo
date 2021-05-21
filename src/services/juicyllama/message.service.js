import apiService from './_api.service'

class MessageService {

    async addMessage(chat_id, user_identifier, message, app_json = false) {

        let data = {
            user_identifier: user_identifier,
            message: message
        }

        if (app_json) {
            data.app_json = app_json
        }

        return await apiService.post(`/chat/${chat_id}`, data)
    }

    async updateMessage(chat_id, message_id, user_identifier = false, message = false, app_json = false) {

        let data = {}

        if (user_identifier) {
            data.user_identifier = user_identifier
        }

        if (message) {
            data.message = message
        }

        if (app_json) {
            data.app_json = app_json
        }

        return await apiService.put(`/chat/${chat_id}/${message_id}`, data)
    }

    async deleteMessage(chat_id, message_id) {
        await apiService.delete(`/chat/${chat_id}/message/${message_id}`)
    }
}

export default new MessageService()