
import {database, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue } from './firebaseInitializer.js'
import {getLessons, getLastLesson, getUsers, getModules, getModuleById, getAges, setLesson} from './fibaseCRUD.js'
import {UpdateLessons} from './MainPageLessonFiltration.js'

        let dbref = ref(database)
        
        const dateInput = document.getElementById("dateInput")
        const typeSelect = document.getElementById("typeSelect")
        const moduleSelect = document.getElementById("moduleSelect")
        const themeSelect = document.getElementById("themeSelect")
        const ageSelect = document.getElementById("ageSelect")
       
        ageSelect.addEventListener('change', () => {
           getAges(data=> {
                    const age = (data.filter(a => a.name === ageSelect.value))[0];
                    moduleSelect.innerHTML = ""
                    age.moduleIds.forEach(id => getModuleById(id, d => {
                        moduleSelect.innerHTML += "<option>" + d.name + "</option>"
                    }))

                    const moduleDiv = document.getElementById("moduleDiv")
                    moduleDiv.classList.remove("hidden")
                
            })
        })

        // ------------------

        moduleSelect.addEventListener('change', () => {
            getModules(data=> {
                    const module = (data.filter(a => a.name === moduleSelect.value))[0];
                    themeSelect.innerHTML = ""
                    module.themes.forEach(theme => themeSelect.innerHTML += "<option>" + theme + "</option>")

                    const themeDiv = document.getElementById("themeDiv")
                    themeDiv.classList.remove("hidden")
                
            })
        })

        // ------------------

        const addLessonButton =  document.getElementById("addLessonButton")

        addLessonButton.addEventListener('click', e => {
            e.preventDefault()
            const error = document.getElementById("error"); 
            // console.log(sessionStorage.getItem("currUserId"))
            if(sessionStorage.getItem("currUserId") === undefined || sessionStorage.getItem("currUserId") === null){
                error.innerText = "not authentiated "
                return;
            }

            let lastLessonIndex = 0
            let lessons
            getLessons(data=> {
                    lessons = Object.values(data)
//                     lessons = Array.from(data)
                    lastLessonIndex = lessons.length
            })
            .then(()=>{
                let lastLessonId = 0;
                    
                getLastLesson(data=> {
                    lastLessonId = Object.keys(data)[0]
                    console.log(lastLessonId)
                })
//                 get(query(ref(database, 'lessons/'), limitToLast(1))).then(data=> {
//                     if(data.exists()){
//                         lastLessonId = Object.keys(data)[0]
//                         console.log(lastLessonId)
//                     }
//                 })
                .then(()=>{
                    console.log("lessons/" + lastLessonIndex.toString())
                        
                    setLesson(
                        (parseInt(lastLessonId, 10) + 1).toString() ,
                        {
                            age: ageSelect.value,
                            startModule: moduleSelect.value,
                            startTheme: themeSelect.value,
                            startDate: dateInput.value,
                            lessonType: typeSelect.value,
                            userId: sessionStorage.getItem("currUserId")
                        })

//                     set(ref(database, "lessons/" + (parseInt(lastLessonId, 10) + 1).toString()), {
//                         age: ageSelect.value,
//                         startModule: moduleSelect.value,
//                         startTheme: themeSelect.value,
//                         startDate: dateInput.value,
//                         lessonType: typeSelect.value,
//                         userId: sessionStorage.getItem("currUserId")
//                     }).then(() => console.log("ok"))
//                     .catch(error => console.log(error))

                    reload()
                })

            })            
        })

        //_________________________________________________________________________________________

        reload()

        function reload() {
                console.log(UpdateLessons())
                UpdateLessons().then(lessons => {
                        lessonContainer.innerHTML = ""
                        lessons.map(l => lessonContainer.innerHTML +=
                        `<li class="centered_row gray_background_color full_width indented">` +
                        `    <p>${new Date(l.startDate).getHours()} : ${new Date(l.startDate).getMinutes()}</p>` +
                        `    <div class="lesson space_between">` +
                        `        <p class="indented">${l.age}</p>` +
                        `        <p class="indented">${l.lessonType}</p>` +
                        `        <p class="indented">${l.startModule}</p>` +
                        `        <p class="indented">${l.startTheme}</p>` +
                        `    </div>` +
                        `</li>`
                        )
                })      
        
        }
                        
                    


        
