import {database, dbref, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue } from './firebaseInitializer.js'

export function getUsers(thenCallback) {
    return get(child(dbref, "users")).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}

export function getLessons (thenCallback) {
    return get(child(dbref, "lessons/")).then( data => {
        if(data.exists()){
            thenCallback(data.val())
        }
    })
}

export function getLastLesson (thenCallback) {
    return get(query(ref(database, 'lessons/'), limitToLast(1))).then(data=> {
        if(data.exists()){
            thenCallback()
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
    return get(child(dbref, "modules/" + id)).then( data => {
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

export function setLesson(id, lesson) {
    return set(ref(database, "lessons/" + id), {
        age: lesson.age,
        startModule: lesson.startModule,
        startTheme: lesson.startTheme,
        startDate: lesson.startDate,
        lessonType: lesson.lessonType,
        userId: lesson.userId
    }).then(() => console.log("ok"))
    .catch(error => console.log(error))
}

export function setModule(id, module) {
    return set(ref(database, "modules/" + id), {
        name: module.name,
        themes: module.themes
    }).then(() => {console.log("ok"); UpdateModules()})
    .catch(error => console.log(error))
}

export function removeModule(id) {
    return remove(ref(database, "modules/" + id))
}

export function updateLesson(id, lesson, thenCallback) {
    return update(ref(database, "lessons/" + id), {
        startDate: lesson.startDate,
        startModule: lesson.startModule,
        startTheme: lesson.startTheme,
    }).then(() => {
        thenCallback()
    })
    .catch(error => console.log(error))
}
