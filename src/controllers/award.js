import Model from '@/models/Award'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'AWARDS'

export async function readAwards(user_identifier, badge_id, use_cache = true) {

    let key = CACHE_KEY

    if(user_identifier){
        key += `_${user_identifier}`
    }
    if(badge_id){
        key += `_${badge_id}`
    }

    let cache_settings = {
        expiry: moment().add(5, 'minutes'),
        key: key,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let result = await Model.getAwards(user_identifier, badge_id)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result
}


export async function countAwards(user_identifier, badge_id, use_cache = true) {

    let key = CACHE_KEY

    if(user_identifier){
        key += `_${user_identifier}`
    }
    if(badge_id){
        key += `_${badge_id}`
    }

    let cache_settings = {
        expiry: moment().add(5, 'minutes'),
        key: `${key}_COUNT`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let result = await Model.countAwards(user_identifier, badge_id)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result

}