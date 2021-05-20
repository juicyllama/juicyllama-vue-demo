export function showBadgeImage(badge_id, hidden) {

        let number = 0

        switch (badge_id) {

            case 101:
                number = '1'
                break
            case 102:
                number = '2'
                break
            case 103:
                number = '3'
                break
        }

        if(hidden){
            return require(`@/assets/images/badges/hidden_${number}.png`)
        }else{
            return require(`@/assets/images/badges/${number}.png`)
        }
}
