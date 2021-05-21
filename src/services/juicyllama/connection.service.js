import apiService from './_api.service'

class ConnectionService {

    async getConnections(user_identifier, method, limit = 999, offset = 0) {

        let params = `&method=${method}&limit=${limit}&offset=${offset}`

        return await apiService.get(`/connections/${user_identifier}`, params)
    }

    async countConnections(user_identifier, method) {

        let params = `&method=${method}`

        return await apiService.get(`/connections/${user_identifier}/count`, params)
    }

    async checkConnection(user_identifier, connection_user_identifier, method) {
        return await apiService.get(`/connection/${user_identifier}/${connection_user_identifier}`, `&method=${method}`)
    }

    async addConnection(user_identifier, connection_user_identifier) {
        return await apiService.post(`/connection/${user_identifier}/${connection_user_identifier}`,)
    }

    async removeConnection(user_identifier, connection_user_identifier) {
        return await apiService.delete(`/connection/${user_identifier}/${connection_user_identifier}`,)
    }
}

export default new ConnectionService()