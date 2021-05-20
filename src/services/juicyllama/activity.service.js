import apiService from './_api.service'
import storage from "@/store/storage.js"
import moment from 'moment-timezone'

class ActivityService {

    async getActivity(user_identifier) {
        return await apiService.get(`/activity/${user_identifier}`)
    }

    async getActivities(limit, offset) {
        return await apiService.get( `/activities`, `&from=${moment().subtract(24, "hours").tz(storage.get('timezone')).format(process.env.VUE_APP_DATE_FORMAT)}&limit=${limit}&offset=${offset}`)
    }

    async countActivities() {
        return await apiService.get(`/activities/count`, `&from=${moment().subtract(24, "hours").tz(storage.get('timezone')).format(process.env.VUE_APP_DATE_FORMAT)}`)
    }

    putActivity(user_identifier, data) {
        apiService.put( `/activity/${user_identifier}`, data)
    }
}

export default new ActivityService()