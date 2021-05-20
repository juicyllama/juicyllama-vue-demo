import superheros from "@/assets/superheros.json";

export function getSuperHero(user_identifier) {
    if(user_identifier){

        for(const s in superheros){
            if(superheros[s].name === user_identifier){
                return superheros[s]
            }
        }

        return false

    }else{
        return false
    }
}