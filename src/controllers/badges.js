import Model from '@/models/Badge'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'BADGE'

export async function readBadge(badge_id, use_cache = true) {

    let cache_settings = {
        expiry: moment().add(1, 'month'),
        key: `${CACHE_KEY}_${badge_id}`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let result = await Model.getBadge(badge_id)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result
}

export async function readBadges(limit, offset, use_cache = true) {

    let cache_settings = {
        expiry: moment().add(1, 'month'),
        key: `${CACHE_KEY}S`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let results = await Model.getBadges(limit, offset)

    if (!results) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, results, cache_settings.expiry)
    }

    return results
}
