import {database, dbref, app, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue} from './firebaseInitializer.js'

export function getUsers(thenCallback) {
    return get(child(dbref, "users")).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}

export function getLessons(thenCallback) {
    return get(child(dbref, "lessons/")).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}

export function getModules(thenCallback) {
    return get(child(dbref, "modules/")).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}

export function getModuleById(id, thenCallback) {
    get(child(dbref, "modules/" + id)).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}

export function getAges(thenCallback) {
    return get(child(dbref, "ages/")).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}
