import {updateActivity} from "@/controllers/activity";

export function online(logger, user_identifier) {
    updateActivity(logger, user_identifier)
}