import apiService from './_api.service'

class WallService {

    async getPost(wall_id, post_id) {
        return await apiService.get( `/wall/${wall_id}/post/${post_id}`)
    }

    async getPosts(wall_id, parent_post_id = 0, limit = false, offset = false, after = false, users = false) {

        let params = `&parent_post_id=${parent_post_id}`

        if (limit) {params += `&limit=${limit}`}
        if (offset) {params += `&offset=${offset}`}
        if (after) {params += `&after=${after}`}
        if (users && users.constructor === Array) {
            params += `&users=${users}`
        }

        return await apiService.get( `/wall/${wall_id}/posts`, params)
    }

    async countPosts(wall_id, parent_post_id = 0, users) {

        let params = `&parent_post_id=${parent_post_id}`
        params += `&users=${users}`

        return await apiService.get( `/wall/${wall_id}/posts/count`, params)
    }

    async addPost(wall_id, user_identifier, message, parent_post_id = false, app_json = false) {

        let data = {
            user_identifier: user_identifier,
            message: message
        }

        if (parent_post_id) {
            data.parent_post_id = parent_post_id
        }
        if (app_json) {
            data.app_json = app_json
        }

        return await apiService.post( `/wall/${wall_id}/post`, data)
    }

    async updatePost(wall_id, post_id, message) {

        let data = {
            message: message
        }

        return await apiService.put(`/wall/${wall_id}/post/${post_id}`, data)
    }

    async deletePost(wall_id, post_id) {
        await apiService.delete(`/wall/${wall_id}/post/${post_id}`)
    }

    async likePost(wall_id, post_id, user_identifier, app_json) {

        let data = {
            user_identifier: user_identifier,
            app_json: app_json
        }

        return await apiService.post(`/wall/${wall_id}/post/${post_id}/like`, data)

    }

    async unlikePost(wall_id, post_id, like_id) {
        await apiService.delete(`/wall/${wall_id}/post/${post_id}/like/${like_id}`)
    }

}

export default new WallService()
