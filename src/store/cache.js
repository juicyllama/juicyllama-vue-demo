class cacheStore {

    /**
     * Read from localStorage
     *
     * @param {String} key the key for the object
     * @returns {JSON}
     */

    getCacheStore(key) {
        const json = JSON.parse(localStorage.getItem(`_${key}`));
        return json ? json : false
    }

    /**
     * Write to localStorage
     * @param {JSON} value the data to cache
     * @param {String} key the key for the object
     */

    setCacheStore(key, value){
        localStorage[`_${key}`] = JSON.stringify(value)
    }

    /**
     * Delete localStorage item
     * @param {String} key the key for the object
     */

    delCacheStore(key){
        localStorage.removeItem(`_${key}`)
    }

    /**
     * Lists all localStorage items
     */

    listCacheStore(){

        let values = [],
            keys = Object.keys(localStorage),
            i = keys.length;

        while ( i-- ) {
            values.push( keys[i] );
        }

        return values;
    }
}

export default new cacheStore();
