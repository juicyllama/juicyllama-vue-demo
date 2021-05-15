export default {

    /**
     * Read from localStorage
     *
     * @param {String} key the key for the object
     * @returns {JSON}
     */

    get(key) {
        const json = JSON.parse(localStorage.getItem(`_${key}`));
        return json ? json : false
    },

    /**
     * Write to localStorage
     * @param {JSON} value the data to cache
     * @param {String} key the key for the object
     */

    set(key, value){
        localStorage[`_${key}`] = JSON.stringify(value)
    },

    /**
     * Delete localStorage item
     * @param {String} key the key for the object
     */

    del(key){
        localStorage.removeItem(`_${key}`)
    }
}
