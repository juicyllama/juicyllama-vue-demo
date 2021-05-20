import apiService from './_api.service'

class AwardService {

    async getAwards(user_identifier = false, badge_id = false, limit = false, offset = false, after = false, from = false, to = false) {
        let params = ``

        if(user_identifier) {params += `&user_identifier=${user_identifier}`}
        if(badge_id) {params += `&badge_id=${badge_id}`}
        if (limit) {params += `&limit=${limit}`}
        if (offset) {params += `&offset=${offset}`}
        if (after) {params += `&after=${after}`}
        if (from) {params += `&from=${from}`}
        if (to) {params += `&to=${to}`}

        return await apiService.get('/awards', params)
    }

    async countAwards(user_identifier = false, badge_id = false, after = false, from = false, to = false) {
        let params = ``

        if(user_identifier) {params += `&user_identifier=${user_identifier}`}
        if(badge_id) {params += `&badge_id=${badge_id}`}
        if (after) {params += `&after=${after}`}
        if (from) {params += `&from=${from}`}
        if (to) {params += `&to=${to}`}

        return await apiService.get('/awards/count', params)
    }

}

export default new AwardService()