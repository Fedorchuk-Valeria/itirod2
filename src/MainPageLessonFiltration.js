import {getLessons, getLastLesson, getUsers, getModules, getModuleById, getAges, setLesson} from './fibaseCRUD.js'

export function UpdateLessons () {
            return getLessons( data=> {
                    console.log(data)
                    const lessonContainer = document.getElementById("lessonContainer")
                    const currUserId = sessionStorage.getItem("currUserId")

                    if( currUserId !== undefined && currUserId !== null) {
                        
                        let lessons = Object.values(data)
//                         let lessons = Array.from(data)
                        let newLessons = []

                        lessons = lessons.filter(lesson => lesson !== null && lesson !== undefined)
                        .filter(lesson => lesson.userId === sessionStorage.getItem("currUserId"))
                        .sort((a, b) => new Date(a.startDate).getHours() > new Date(b.startDate).getHours()? 1 : -1)

                        for (let index = 0; index < lessons.length; index++) {
                            const lesson = lessons[index]
                            console.log(lesson)
                            // if (lesson === null || lesson === undefined) continue

                            if ((new Date(lesson.startDate)).getDate() === (new Date()).getDate()){
                                newLessons.push(lesson)
                                continue
                            } 
                            if( new Date().getDay() === new Date(lesson.startDate).getDay()) //проверка на день недели
                            {
                                if(lesson.lessonType !== "regular") continue

                                let weeksPassedCount = Math.round((new Date() - new Date(lesson.startDate))/86400000) / 7

                                getModules(data=> {
                                        const modules = data
                                        const module = (data.filter(a => a.name === lesson.startModule))[0];
                                        // let moduleIndex = modules.indexOf(module)
                                        let moduleIndex = -1
                                        data.forEach(function (m, i) {
                                            if (m.name === module.name) {
                                                moduleIndex = i
                                            }
                                        });
                                    
                                        for( let i = moduleIndex; i < modules.length; i++ ){
                                            try{
                                                modules[i].themes.forEach(theme => {
                                                    if (modules[i].themes.indexOf(theme) < modules[i].themes.indexOf(lesson.startTheme) && 
                                                        i === moduleIndex  ) {//начинать с темы урока
                                                        return
                                                    }
                                                    // console.log(theme)
                                                    if(weeksPassedCount === 0) {
                                                        newLessons.push({
                                                            ...lesson, 
                                                            startModule: modules[i].name,
                                                            startTheme: theme
                                                        })

                                                        throw new Error("Break the loop.")
                                                    }
                                                    weeksPassedCount -= 1
                                                    console.log(weeksPassedCount)
                                                })
                                            }
                                            catch(error){ 
                                                console.log(newLessons)
                                                break
                                            }
                                        }
                                    
                                }) 
                            }
                        }
                        

                        return newLessons
                
            }
            return 'opa'
        })
}
