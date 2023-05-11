import {getLessons, getLastLesson, getUsers, getModules, getModuleById, getAges, setLesson} from './fibaseCRUD.js'

function UpdateLessons () {
        return getLessons( async data => {
              
            const lessonContainer = document.getElementById("lessonContainer")
            const currUserId = sessionStorage.getItem("currUserId")

            if( currUserId !== undefined && currUserId !== null) {
                        
              const lessonsData = Object.values(data)
              let id = 0
              lessons = []
              console.log(data)

              lessonsData.forEach(lesson => {
                  if(lesson === null || lesson ===  undefined) {
                      id += 1
                      return
                  } 
                  lessons.push({...lesson, id: id})
                  id += 1
                })

                console.log(lessons)
                
                newLessons = []
                
                lessons = lessons.filter(lesson => lesson !== null && lesson !== undefined)
                  .filter(lesson => lesson.userId === sessionStorage.getItem("currUserId"))
              // .sort((a, b) => new Date(a.startDate) > new Date(b.startDate)? 1 : -1)

              for (let index = 0; index < lessons.length; index++) {
                  const lesson = lessons[index]

                  // if ((new Date(lesson.startDate)).getDate() === (new Date()).getDate()){
                      //   newLessons.push(lesson)
                //   continue
                // } 
                
                let monday = new Date()
                monday.setDate(new Date().getDate() - new Date().getDay() + 1)
                let sunday = new Date()
                sunday.setDate(monday.getDate() + 6)
                const lessonStartDate = new Date(lesson.startDate)
                
                if(lesson.lessonType !== "regular" && 
                !(monday < lessonStartDate && lessonStartDate < sunday) // дата не в этой неделе
                ) {
                  continue 
                }
                if(monday < lessonStartDate && lessonStartDate < sunday) { // дата в этой неделе
                    newLessons.push(lesson)
                    continue
                }
                if(new Date(lesson.startDate) > sunday) continue // еще будет 

                let sameDayOfWeek = new Date()
                sameDayOfWeek.setDate(monday.getDate() + new Date(lesson.startDate).getDay() -1)
                
                let weeksPassedCount = Math.round((sameDayOfWeek - lessonStartDate)/86400000) / 7 // сравнивать не с сегодня
                
                await getModules( data=> {
                    const modules = data
                    const module = (data.filter(a => a.name === lesson.startModule))[0];

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
                            i === moduleIndex  ) { //начинать с темы урока
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
                            
                        })
                    }
                      catch(error){ 
                        break
                      }
                    }
                  
                })
              }
                        
              return (newLessons)
              
              
        })
    })
}
