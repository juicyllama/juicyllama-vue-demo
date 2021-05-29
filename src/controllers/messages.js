import Model from '@/models/Chat'
import ModelMessages from '@/models/Message'
import Cache from "@/functions/cache"
import moment from "moment"

const CACHE_KEY = 'CHAT'

export async function readChat(chat_id, user_identifier = false, limit = false, offset = false, after = false, use_cache = true) {

    let cache_settings = {
        expiry: moment().add(5, 'minutes'),
        key: `${CACHE_KEY}_${chat_id}`,
    }

    if (use_cache) {
        let cached_data = await Cache.getCacheObject(cache_settings.key)
        if (cached_data) {
            return cached_data
        }
    }

    let results = await Model.getChat(chat_id, user_identifier, limit, offset, after)

    if (!results) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, results, cache_settings.expiry)
    }

    return results
}

export async function readChats(user_identifier  = false, users_include = false, users_exclude = false, status = false, limit = false, offset = false, after = false, use_cache = true) {

    let key = `${CACHE_KEY}S`

    if(user_identifier){ key += `_${user_identifier}` }
    if(users_include){ key += `_${users_include}` }
    if(users_exclude){ key += `_${users_exclude}` }
    if(status){ key += `_${status}` }

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

    let results = await Model.getChats(user_identifier, users_include, users_exclude, status, limit, offset, after)

    if (!results) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, results, cache_settings.expiry)
    }

    return results
}

export async function countChats(user_identifier  = false, users_include = false, users_exclude = false, status = false, after = false, use_cache = true) {

    let key = `${CACHE_KEY}S`

    if(user_identifier){ key += `_${user_identifier}` }
    if(users_include){ key += `_${users_include}` }
    if(users_exclude){ key += `_${users_exclude}` }
    if(status){ key += `_${status}` }

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

    let result = await Model.countChats(user_identifier, users_include, users_exclude, status, after)

    if (!result) {
        return false
    }

    if (use_cache) {
        await Cache.setCacheObject(cache_settings.key, result, cache_settings.expiry)
    }

    return result

}

export async function countMessages(chat_id, after = false) {
    return await Model.countMessages(chat_id, after)
}

export async function createChat(user_identifier_1, user_identifier_2, app_json = false, use_cache = true) {
    let result = await Model.addChat(user_identifier_1, user_identifier_2, app_json)

    if(!result) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}S`)
        await Cache.deleteCacheObject(`${CACHE_KEY}S_COUNT`)
    }

    await readChats(user_identifier_1)
    await countChats(user_identifier_1)
    return result
}

export async function createMessage(chat_id, user_identifier, message, app_json = false, use_cache = true) {
    let result = await ModelMessages.addMessage(chat_id, user_identifier, message, app_json)

    if(!result) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}_${chat_id}`)
    }

    await readChat(chat_id, user_identifier)
    return result
}

export async function updateChat(chat_id, user_identifier_1, user_identifier_2, app_json = false) {
    let result = await Model.updateChat(chat_id, user_identifier_1, user_identifier_2, app_json)

    if(!result) {
        return false
    }

    await Cache.deleteCacheObject(`${CACHE_KEY}_${chat_id}`)
    await Cache.deleteCacheObject(`${CACHE_KEY}S`)
    await Cache.deleteCacheObject(`${CACHE_KEY}S_COUNT`)
    await readChat(chat_id, user_identifier_1)
    await readChats(user_identifier_1)
    await countChats(user_identifier_1)
    return result
}

export async function updateMessage(chat_id, message_id, user_identifier, message, app_json = false, use_cache = true) {
    let result = await ModelMessages.addMessage(chat_id, message_id, user_identifier, message, app_json)

    if(!result) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}_${chat_id}`)
    }

    await readChat(chat_id, user_identifier)
    return result
}

export async function markAsRead(chat_id, user_identifier) {
    return await Model.markReadChat(chat_id, user_identifier)
}

export async function deleteChat(chat_id, user_identifier, use_cache = true) {

    let connection = await Model.removeChat(chat_id, user_identifier)

    if(!connection) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}_${chat_id}`)
        await Cache.deleteCacheObject(`${CACHE_KEY}S`)
        await Cache.deleteCacheObject(`${CACHE_KEY}S_COUNT`)
    }

    await readChats(user_identifier)
    await countChats(user_identifier)
    return connection
}

export async function deleteMessage(chat_id, message_id, use_cache = true) {
    let result = await ModelMessages.deleteMessage(chat_id, message_id)

    if(!result) {
        return false
    }

    if(use_cache){
        await Cache.deleteCacheObject(`${CACHE_KEY}_${chat_id}`)
    }

    await readChat(chat_id)
    return result
}
