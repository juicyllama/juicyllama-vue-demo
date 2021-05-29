import moment from 'moment'
import Service from "@/services/juicyllama/wall.service"

export default {

    Like: function (data) {
        this.like_id = Number(data.like_id)
        this.post_id = Number(data.post_id)
        this.user_identifier = data.user_identifier
        this.app_json = data.app_json
        this.created_at = moment(data.created_at).format(process.env.VUE_APP_DATE_FORMAT)
    },

    addLike: async function(wall_id, post_id, user_identifier, app_json = false){
        return new this.Like(await Service.likePost(wall_id, post_id, user_identifier, app_json))
    },

    removeLike: async function (wall_id, post_id, like_id) {
        return await Service.unlikePost(wall_id, post_id, like_id)
    },

}
