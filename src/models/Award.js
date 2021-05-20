import moment from 'moment'
import Service from "@/services/juicyllama/award.service"

export default {

    Award: function (data) {
        this.award_id = Number(data.award_id)
        this.app_id = Number(data.app_id)
        this.badge_id = Number(data.badge_id)
        this.badge = data.badge
        this.user_identifier = data.user_identifier
        this.app_json = data.app_json
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    getAwards: async function(user_identifier, badge_id, limit, offset) {

        let results = await Service.getAwards(user_identifier, badge_id, limit, offset)

        if (!results) {
            return false
        }

        for (let r = 0; r < results.length; r++) {
            results[r] = new this.Award(results[r])
        }

        return results
    },

    countAwards: async function (user_identifier, badge_id) {
        return await Service.countAwards(user_identifier, badge_id)
    },

}