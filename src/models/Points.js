import moment from 'moment'
import Service from "@/services/juicyllama/points.service"

export default {

    Points: function (data) {
        this.points_id = Number(data.points_id)
        this.app_id = Number(data.app_id)
        this.user_identifier = data.user_identifier
        this.app_json = data.app_json
        this.points = Number(data.points)
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
        this.updated_at = moment(data.updated_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    getPoints: async function(user_identifier) {
        return new this.Points(await Service.getPoints(user_identifier))
    },

}
