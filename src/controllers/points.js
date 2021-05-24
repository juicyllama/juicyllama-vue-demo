import Model from '@/models/Points'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'POINTS'

export async function readPoints(user_identifier, use_cache = true) {

    let cache_settings = {
        expiry: moment().add(5, 'minutes'),
        key: `${CACHE_KEY}_${user_identifier}`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let result = await Model.getPoints(user_identifier)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result
}
