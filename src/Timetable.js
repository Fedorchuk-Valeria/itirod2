import {database, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue } from './firebaseInitializer.js'
import {getLessons, getUsers, getModules, getModuleById, getAges, setModule, removeModule} from './fibaseCRUD.js'

let dbref = ref(database)

      //_________________________________________________________________________________________
      let lessons = []
      let newLessons = []
      //_________________________________________________________________________________________
      
      UpdateLessons().then(lessons => {
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

      

