import Model from '@/models/Activity'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'ACTIVITY'

export async function readActivity(user_identifier, use_cache = true) {

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

        let result = await Model.getActivity(user_identifier)

        if (!result) {
            return false
        }

        if (use_cache) {
            await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
        }

        return result
    }

export async function readActivities(limit, offset, use_cache = true) {

        let cache_settings = {
            expiry: moment().add(5, 'minutes'),
            key: `${CACHE_KEY}_ALL`,
        }

        if (use_cache) {
            let cached_data = await Cache.getCacheObject(cache_settings.key)
            if (cached_data) {
                return cached_data
            }
        }

        let results = await Model.getActivities(limit, offset)

        if (!results) {
            return false
        }

        if (use_cache) {
            await Cache.setCacheObject(cache_settings.key, results, cache_settings.expiry)
        }

        return results
    }

export async function updateActivity(user_identifier, data) {

        let result = await Model.putActivity(user_identifier, data)

        if(!result) {
            return false
        }

        return result
    }

export async function countActivities(use_cache = true) {

        let cache_settings = {
            expiry: moment().add(5, 'minutes'),
            key: `${CACHE_KEY}_COUNT`,
        }

        if (use_cache) {
            let cached_data = await Cache.getCacheObject(cache_settings.key)
            if (cached_data) {
                return cached_data
            }
        }

        let result = await Model.countActivities()

        if (!result) {
            return false
        }

        if (use_cache) {
            await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
        }

        return result

}


