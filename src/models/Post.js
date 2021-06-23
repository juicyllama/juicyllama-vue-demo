import moment from 'moment'
import Service from "@/services/juicyllama/wall.service"

export default {

    Post: function (data) {
        this.post_id = Number(data.post_id)
        this.wall_id = Number(data.wall_id)
        this.user_identifier = data.user_identifier
        this.app_json = data.app_json
        this.message = data.message
        this.parent_post_id = Number(data.parent_post_id)
        this.child_posts = data.child_posts
        this.post_likes = data.post_likes
        this.post_complaints = data.post_complaints
        this.source = data.source
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
        this.updated_at = moment(data.updated_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    newPost: async function(wall_id, user_identifier, message, parent_post_id = false, app_json = false){
        return new this.Post(await Service.addPost(wall_id, user_identifier, message, parent_post_id, app_json))
    },

    getPost: async function(wall_id, post_id){
        return new this.Post(await Service.getPost(wall_id, post_id))
    },

    getPosts: async function(wall_id, parent_post_id = 0, limit = false, offset = false, after = false, users = false) {

        let results = await Service.getPosts(wall_id, parent_post_id, limit, offset, after, users)

        if (!results) {
            return false
        }

        for (let r = 0; r < results.length; r++) {
            results[r] = new this.Post(results[r])
        }

        return results
    },

    countPosts: async function(wall_id, parent_post_id = 0,  users) {

        let result = await Service.countPosts(wall_id, parent_post_id, users)

        if (!result) {
            return false
        }

        return result.count
    },

    editPost: async function (wall_id, post_id, message) {

        let result = await Service.updatePost(wall_id, post_id, message)

        if(!result) {
            return false
        }

        return this.getPost(wall_id, post_id)
    },

    removePost: async function (wall_id, post_id) {
        return await Service.deletePost(wall_id, post_id)
    },

}
