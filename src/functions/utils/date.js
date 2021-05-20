import moment from "moment-timezone";
import storage from "@/store/storage.js"

export function xAgo(from) {
        from = moment(from)
        let to = moment().tz(storage.get('timezone'))
        return from.from(to.format(process.env.VUE_APP_DATE_FORMAT))
}