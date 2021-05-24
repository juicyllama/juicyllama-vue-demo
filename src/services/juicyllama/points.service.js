import apiService from './_api.service'

class PointsService {

    async getPoints(user_identifier) {
        return await apiService.get(`/points/${user_identifier}`)
    }
}

export default new PointsService()
