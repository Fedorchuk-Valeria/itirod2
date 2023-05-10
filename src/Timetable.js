import {database, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue } from './firebaseInitializer.js'
import {getLessons, getUsers, getModules, getModuleById, getAges, setModule, removeModule} from './fibaseCRUD.js'

let dbref = ref(database)

      //_________________________________________________________________________________________
      let lessons = []
      let newLessons = []
      //_________________________________________________________________________________________
      
      UpdateLessons()

      function UpdateLessons () {
        getLessons( async data => {
              
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
                        
              console.log(newLessons)
              
              const getLessonHTML = (lesson) => 
              `<li class="space-between indented">` +
              `  <div class="space-evenly">` +
              `    <p>${lesson.age}</p>` +
              `    <p>${lesson.lessonType}</p>` +
              `    <p>${lesson.startModule}</p>` +
              `    <p>${lesson.startTheme}</p>` +
              `  </div>` +
              
              `  <div class="row">` +
              `    <button class="no_styles_button peach_background_color editLessonButton" id="${lesson.id}">Edit</button>` +
              `    <button class="no_styles_button peach_background_color deleteLessonButton" id="${lesson.id}">Delete</button>` +
              `  </div>` +
              `</li>`
              
              // console.log(mondayLessons)
              // console.log(mondayLessons.innerHTML)
              
              const mondayLessons = document.getElementById("mondayLessons")
              const tuesdayLessons = document.getElementById("tuesdayLessons")
              const wednesdayLessons = document.getElementById("wednesdayLessons")
              const thursdayLessons = document.getElementById("thursdayLessons")
              const fridayLessons = document.getElementById("fridayLessons")
              const saturdayLessons = document.getElementById("saturdayLessons")
              const sundayLessons = document.getElementById("sundayLessons")
              
              newLessons.forEach(lesson => {
                  const lessonStartDate = new Date(lesson.startDate)

                  if(lessonStartDate.getDay() === 0){ // sunday
                    sundayLessons.innerHTML += getLessonHTML(lesson)
                }
                else if(lessonStartDate.getDay() === 1){ // monday
                    mondayLessons.innerHTML += getLessonHTML(lesson)
                }
                else if(lessonStartDate.getDay() === 2){ // tuesday
                  tuesdayLessons.innerHTML += getLessonHTML(lesson)
                }
                else if(lessonStartDate.getDay() === 3){ // wednes
                    wednesdayLessons.innerHTML += getLessonHTML(lesson)
                }
                else if(lessonStartDate.getDay() === 4){ // thursday
                    thursdayLessons.innerHTML += getLessonHTML(lesson)
                }
                else if(lessonStartDate.getDay() === 5){ // friday
                  fridayLessons.innerHTML += getLessonHTML(lesson)
                }
                else if(lessonStartDate.getDay() === 6){ // saturday
                  saturdayLessons.innerHTML += getLessonHTML(lesson)
                }
              })
            }
          
        }).then(()=> {
          let deleteLessonButtons = document.querySelectorAll(".deleteLessonButton");

          deleteLessonButtons.forEach(button=> {
            button.addEventListener('click', e => {
              e.preventDefault()
              const id = button.id
              remove(ref(database, "lessons/" + id.toString()))
              sundayLessons.innerHTML = " "
              mondayLessons.innerHTML = " "
              tuesdayLessons.innerHTML = " "
              wednesdayLessons.innerHTML = " "
              thursdayLessons.innerHTML = " "
              fridayLessons.innerHTML = " "
              saturdayLessons.innerHTML = " "
              UpdateLessons()
            })
          })
          
          let editLessonButtons = document.querySelectorAll(".editLessonButton");

          editLessonButtons.forEach(button=> {
              button.addEventListener('click', e => {
                  e.preventDefault()
                  const id = button.id
                  
                  sessionStorage.setItem('currLesson', id)
                  let currlesson = newLessons.filter(l => l.id.toString() === id.toString())[0]
                  console.log(currlesson)
                  
                  sessionStorage.setItem('currLesson', JSON.stringify(currlesson))
                  
              window.location.href = './UpdateLesson.html';
              
            })
        })
    }
    )
}

