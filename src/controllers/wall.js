import ModelPost from '@/models/Post'
import ModelLike from '@/models/Like'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'WALL'

export async function createPost(wall_id, user_identifier, message, parent_post_id = false, app_json = false, use_cache = true) {

    let result = await ModelPost.newPost(wall_id, user_identifier, message, parent_post_id, app_json)

    if(!result) {
        return false
    }

    let cache_settings = {
        expiry: moment().add(1, 'minutes'),
        key:  `${CACHE_KEY}_${wall_id}_${result.post_id}`
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result
}

export async function readPost(wall_id, post_id, use_cache = true) {

    let cache_settings = {
        expiry: moment().add(1, 'minutes'),
        key:  `${CACHE_KEY}_${wall_id}_${post_id}`
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let result = await ModelPost.getPost(wall_id, post_id)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result
}

export async function readPosts(wall_id, parent_post_id = 0, limit = false, offset = false, after = false, users = false, use_cache = true) {

    let results = await ModelPost.getPosts(wall_id, parent_post_id, limit, offset, after, users)

    if (!results) {
        return false
    }

    if (use_cache) {

        for(const r in results){

            let cache_settings = {
                expiry: moment().add(1, 'minutes'),
                key:  `${CACHE_KEY}_${wall_id}_${results[r].post_id}`
            }

            await Cache.setCacheObject(cache_settings.key, results[r], cache_settings.expiry)
        }

    }

    return results
}

export async function updatePost(wall_id, post_id, message, use_cache = true) {
    let result = await ModelPost.editPost(wall_id, post_id, message)

    if(!result) {
        return false
    }

    if(use_cache){

        let cache_settings = {
            key:  `${CACHE_KEY}_${wall_id}_${post_id}`
        }

        await Cache.deleteCacheObject(cache_settings.key)
    }

    return result
}

export async function deletePost(wall_id, post_id, use_cache = true) {

    let result = await ModelPost.removePost(wall_id, post_id)

    if(!result) {
        return false
    }

    if(use_cache){
        let cache_settings = {
            key:  `${CACHE_KEY}_${wall_id}_${post_id}`
        }

        await Cache.deleteCacheObject(cache_settings.key)
    }

    return result
}



export async function createLike(wall_id, post_id, user_identifier, app_json = false, use_cache = true) {
    let result = await ModelLike.addLike(wall_id, post_id, user_identifier, app_json)

    if(!result) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}_${wall_id}_${post_id}`)
    }

    await readPost(wall_id, post_id, use_cache)
    return result
}

export async function deleteLike(wall_id, post_id, like_id, use_cache = true) {
    let result = await ModelLike.removeLike(wall_id, post_id, like_id)

    if(!result) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}_${wall_id}_${post_id}`)
    }

    await readPost(wall_id, post_id, use_cache)
    return result
}
