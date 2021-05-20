import apiService from './_api.service'

class BadgeService {

    async getbadge(badge_id) {
        return await apiService.get(`/badge/${badge_id}`)
    }

    async getbadges(limit = 999, offset = 0, after = false, from = false, to = false) {
        let params = ``

        if (limit) {params += `&limit=${limit}`}
        if (offset) {params += `&offset=${offset}`}
        if (after) {params += `&after=${after}`}
        if (from) {params += `&from=${from}`}
        if (to) {params += `&to=${to}`}

        return await apiService.get('/badges', params)
    }

}

export default new BadgeService()