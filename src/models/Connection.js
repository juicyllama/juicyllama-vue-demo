import moment from 'moment'
import Service from "@/services/juicyllama/connection.service"

export default {

    Connection: function (data) {
        this.connection_id = Number(data.connection_id)
        this.app_id = Number(data.app_id)
        this.user_identifier = data.user_identifier
        this.connection_user_identifier = data.connection_user_identifier
        this.app_json = data.app_json
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    getConnections: async function(user_identifier, method, limit, offset) {

        let results = await Service.getConnections(user_identifier, method, limit, offset)

        if (!results) {
            return false
        }

        for (let r = 0; r < results.length; r++) {
            results[r] = new this.Connection(results[r])
        }

        return results
    },

    countConnections: async function (user_identifier, method) {
        return await Service.countConnections(user_identifier, method)
    },

    checkConnection: async function (user_identifier, connection_user_identifier, method) {
        return await Service.checkConnection(user_identifier, connection_user_identifier, method)
    },

    addConnection: async function (user_identifier, connection_user_identifier) {
        return new this.Connection(await Service.addConnection(user_identifier, connection_user_identifier))
    },

    removeConnection: async function (user_identifier, connection_user_identifier) {
        return await Service.removeConnection(user_identifier, connection_user_identifier)
    },
}