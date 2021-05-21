import Model from '@/models/Connection'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'CONNECTIONS'

export async function readConnections(user_identifier, method = 'outbound', limit = 999, offset = 0, use_cache = true) {

    let cache_settings = {
        expiry: moment().add(30, 'minutes'),
        key: `${CACHE_KEY}_${user_identifier}_${method}_ALL`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let results = await Model.getConnections(user_identifier, method, limit, offset)

    if (!results) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, results, cache_settings.expiry)
    }

    return results
}

export async function countConnections(user_identifier, method = 'outbound', use_cache = true) {

    let cache_settings = {
        expiry: moment().add(30, 'minutes'),
        key: `${CACHE_KEY}_${user_identifier}_${method}_COUNT`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let result = await Model.countConnections(user_identifier, method)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result

}

export async function checkConnection(user_identifier, connection_user_identifier, method = 'outbound') {
    return await Model.checkConnection(user_identifier, connection_user_identifier, method)
}

export async function createConnection(user_identifier, connection_user_identifier) {
    let connection = await Model.addConnection(user_identifier, connection_user_identifier)

    if(!connection) {
        return false
    }

    await Cache.deleteCacheObject(`${CACHE_KEY}_${user_identifier}_outbound_ALL`)
    await Cache.deleteCacheObject(`${CACHE_KEY}_${user_identifier}_outbound_COUNT`)
    await readConnections(user_identifier)
    await countConnections(user_identifier)
    return connection
}

export async function deleteConnection(user_identifier, connection_user_identifier) {
    let connection = await Model.removeConnection(user_identifier, connection_user_identifier)

    if(!connection) {
        return false
    }

    await Cache.deleteCacheObject(`${CACHE_KEY}_${user_identifier}_outbound_ALL`)
    await Cache.deleteCacheObject(`${CACHE_KEY}_${user_identifier}_outbound_COUNT`)
    await readConnections(user_identifier)
    await countConnections(user_identifier)
    return connection
}


