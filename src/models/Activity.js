import moment from 'moment'
import Service from "@/services/juicyllama/activity.service"

export default {

    Activity: function (data) {
        this.activity_id = Number(data.activity_id)
        this.app_id = Number(data.app_id)
        this.user_identifier = data.user_identifier
        this.app_json = data.app_json
        this.streak = Number(data.streak)
        this.updated_at = moment(data.updated_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    getActivity: async function(user_identifier){
        return new this.Activity(await Service.getActivity(user_identifier))
    },

    getActivities: async function(limit, offset) {

        let results = await Service.getActivities(limit, offset)

        if (!results) {
            return false
        }

        for (let r = 0; r < results.length; r++) {
            results[r] = new this.Activity(results[r])
        }

        return results
    },

    countActivities: async function () {
        return await Service.countActivities()
    },

    putActivity: async function (user_identifier, data) {
       return await Service.putActivity(user_identifier, data)
    },

}