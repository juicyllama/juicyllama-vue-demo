import storage from "@/store/storage";

export function auth(router) {
    let fb = storage.get('fb')
    if (!fb.userID) {
        router.push('/login');
    }
}

export function superhero(router) {
    let superhero = storage.get('superhero_name')

    if (!superhero) {
        router.push('/superhero');
    }
    return {
        name: storage.get('superhero_name'),
        avatar: storage.get('superhero_avatar'),
    }
}


