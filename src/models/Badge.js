import moment from 'moment'
import Service from "@/services/juicyllama/badge.service"

export default {

    Badge: function (data) {
        this.badge_id = Number(data.badge_id)
        this.app_id = Number(data.app_id)
        this.name = data.name
        this.app_json = data.app_json
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
        this.updated_at = moment(data.updated_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    getBadge: async function(badge_id){
        return new this.Badge(await Service.getbadge(badge_id))
    },

    getBadges: async function(limit, offset) {

        let results = await Service.getbadges(limit, offset)

        if (!results) {
            return false
        }

        for (let r = 0; r < results.length; r++) {
            results[r] = new this.Badge(results[r])
        }

        return results
    },

}