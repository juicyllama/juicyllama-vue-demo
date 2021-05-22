import moment from "moment"


/**
 * Return a filtered array based on filter key->value
 *
 * @param {array} array e.g. [{name="tom"},{name="jerry"}]
 * @param {json} [excludes] e.g. {name="tom"} would return all items in the array without name tom.
 * @returns {array}
 */

export async function filterArrayObjectsOut(array, excludes) {

        return array.filter(function (object) {
                for (let key in excludes) {
                        if (excludes.hasOwnProperty(key)) {
                                if(object[key] === excludes[key]){
                                        return false
                                }
                        }
                }
        })
}

export async function sortArray(key, array, type = false, reverse = false) {
        return await array.sort(function (a, b) {
                let x, y

                if (type) {

                        switch (type) {
                                case 'moment':
                                        x = moment(a[key]).unix();
                                        y = moment(b[key]).unix();
                        }
                }
                else
                {
                        x = a[key];
                        y = b[key];
                }

                if (reverse) {
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                } else {
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
        })
}