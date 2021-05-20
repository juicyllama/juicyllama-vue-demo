import {updateActivity} from "@/controllers/activity";

export function online(user_identifier, app_json) {
    if(user_identifier){
        updateActivity(user_identifier, {app_json: app_json})
    }
}