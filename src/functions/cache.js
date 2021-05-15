import cahceStore from '@/store/cache'
import moment from 'moment'

/**
 * Read from Cache
 *
 * @param {String} key the key for the object
 * @returns {JSON}
 */

export default {

    getCacheObject: async function(key){

        let value = await cahceStore.getCacheStore(`${key}`)

        if(!value || !value.expiry || !value.data){
            return false
        }

        if(moment(value.expiry) < moment()){
            return false
        }

        return value.data
    },

    /**
     * Write to Cache
     *
     * @param {String} key the name of the chase key
     * @param {JSON} value the data to cache
     * @param {moment} expiry the moment the object expires
     * @returns {boolean}
     */

    setCacheObject: async function(key, value, expiry){

        let json = {
            expiry: moment(expiry),
            data: value
        }

        try{

        await cahceStore.setCacheStore(key, json)
        return true

        }catch (e) {
            return false
        }
    },

    /**
     * Delete cache object
     *
     * @param {String} key the name of the chase key
     * @returns {boolean}
     */

    deleteCacheObject: async function(key){

        try{
            await cahceStore.delCacheStore(key)
            return true

        }catch (e) {
            return false
        }

    },
}