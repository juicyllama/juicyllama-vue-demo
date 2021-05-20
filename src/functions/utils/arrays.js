import moment from "moment"

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