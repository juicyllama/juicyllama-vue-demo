import apiService from './_api.service'

class ChatService {

    async getChat(chat_id, user_identifier = false, limit = false, offset = false, after = false) {

        let params = ''
        if (user_identifier) {params += `&user_identifier=${user_identifier}`}
        if (limit) {params += `&limit=${limit}`}
        if (offset) {params += `&offset=${offset}`}
        if (after) {params += `&after=${after}`}

        return await apiService.get(`/chat/${chat_id}`, params)
    }

    async getChats(user_identifier  = false, users_include = false, users_exclude = false, status = false, limit = false, offset = false, after = false) {

        let params = ''
        if (user_identifier) {params += `&user_identifier=${user_identifier}`}
        if (users_include) {params += `&users_include=${users_include}`}
        if (users_exclude) {params += `&users_exclude=${users_exclude}`}
        if (status) {params += `&status[]=${status}`}
        if (limit) {params += `&limit=${limit}`}
        if (offset) {params += `&offset=${offset}`}
        if (after) {params += `&after=${after}`}

        return await apiService.get( `/chats`, params)
    }

    async countChats(user_identifier  = false, users_include = false, users_exclude = false, status = false, after = false) {

        let params = ''
        if (user_identifier) {params += `&user_identifier=${user_identifier}`}
        if (users_include) {params += `&users_include=${users_include}`}
        if (users_exclude) {params += `&users_exclude=${users_exclude}`}
        if (status) {params += `&status[]=${status}`}
        if (after) {params += `&after=${after}`}

        return await apiService.get(`/chats/count`, params)
    }

    async countMessages(chat_id, after = false) {

        let params = ''
        if (after) {params += `&after=${after}`}

        return await apiService.get(`/chats/${chat_id}/count`, params)
    }

    async addChat(user_identifier_1, user_identifier_2, app_json = false) {

        let data = {
            users: [user_identifier_1, user_identifier_2]
        }

        if (app_json) {
            data.app_json = app_json
        }

        return await apiService.post(`/chat`, data)
    }

    async updateChat(chat_id, user_identifier_1 = false, user_identifier_2 = false, app_json = false) {

        let data = {}

        if(user_identifier_1 && user_identifier_2){
            data.users = [user_identifier_1, user_identifier_2]
        }

        if (app_json) {
            data.app_json = app_json
        }

        return await apiService.put(`/chat/${chat_id}`, data)
    }

    async markReadChat(chat_id, user_identifier) {
        return await apiService.put(`/chat/${chat_id}/read/${user_identifier}`)
    }

    async deleteChat(chat_id, user_identifier) {
        return await apiService.delete(`/chat/${chat_id}/${user_identifier}`)
    }
}

export default new ChatService()