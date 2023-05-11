import {database, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue } from './firebaseInitializer.js'
import {getLessons, getUsers, getModules, getModuleById, getAges, setModule, removeModule} from './fibaseCRUD.js'

      let dbref = ref(database)

      const dateInput = document.getElementById("dateInput")
      const themeSelect = document.getElementById("themeSelect")
      const moduleSelect = document.getElementById("moduleSelect")
      const UpdateButton = document.getElementById("UpdateButton")
      
      //_________________________________________________________________________________________

      let currLesson = JSON.parse(sessionStorage.getItem('currLesson'))
      console.log(currLesson)

      console.log(currLesson.startDate.substr(0, 19))
      dateInput.value = currLesson.startDate.substr(0, 19)

      getAges( data=> {
          const age = (data.filter(a => a.name === currLesson.age))[0];
          console.log(age)
          moduleSelect.innerHTML = ""
          age.moduleIds.forEach(id => get(child(dbref, "modules/" + id)).then(d=> {
            if(d.exists()){

              moduleSelect.innerHTML += "<option id=" + d.name + ">" + d.name + "</option>"

              if( d.name === currLesson.startModule) {

                moduleSelect.value = currLesson.startModule;

                themeSelect.innerHTML = ""
                console.log(d.themes)

                d.themes.forEach( theme => 
                  themeSelect.innerHTML += "<option>" + theme + "</option>"
                )
                themeSelect.value = currLesson.startTheme
              }

            }
          }))
        
      })

      //_________________________________________________________________________________________


      moduleSelect.addEventListener('change', () => {
        getModules(data=> {
            const module = (data.filter(a => a.name === moduleSelect.value))[0];
            themeSelect.innerHTML = ""
            module.themes.forEach(theme => themeSelect.innerHTML += "<option>" + theme + "</option>")

            const themeDiv = document.getElementById("themeDiv")
            themeDiv.classList.remove("hidden")
          
        })
      })
      

      const moduleContainer = document.getElementById("moduleContainer")

      UpdateButton.addEventListener('click', e => {
        e.preventDefault()
        update(ref(database, "lessons/" + currLesson.id.toString()), {
          startDate: dateInput.value,
          startModule: moduleSelect.value,
          startTheme: themeSelect.value
        }).then(() => {
          console.log("ok");               
          window.location.href = './Timetable.html'; })
        .catch(error => console.log(error))
      })
