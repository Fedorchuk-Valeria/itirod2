import {database, getDatabase, set, get, update, remove, push, ref, query, limitToLast, child, onValue } from './firebaseInitializer.js'
import {getLessons, getUsers, getModules, getModuleById, getAges, setModule, removeModule} from './fibaseCRUD.js'

        const moduleContainer = document.getElementById("moduleContainer")
        const moduleInput = document.getElementById("moduleInput")
        const addThemeButton = document.getElementById("addThemeButton")  
        const addModuleButton = document.getElementById("addModuleButton") 
        const themeContainer = document.getElementById("themeContainer")
        const themeInput = document.getElementById("themeInput")
        
        //_________________________________________________________________________________________
        
        let themes = []
        let modules = []

        //_________________________________________________________________________________________
        
        addThemeButton.addEventListener('click', e => {
            e.preventDefault()
            themes.push(themeInput.value)
            themeContainer.innerHTML += `<span> "${themeInput.value}"  </span>`
        })
        
        // -----------------
        
        addModuleButton.addEventListener('click', e => {
            e.preventDefault()
                
            setModule( 
                (parseInt(modules[modules.length-1].id, 10) + 1).toString() ,  
                {
                    name: moduleInput.value,
                    themes: themes
                }
            ).then(() => {console.log("ok"); UpdateModules()})
            .catch(error => console.log(error))
        })
        
        //_________________________________________________________________________________________

        
        function deleteModule (id) {
            removeModule( id.toString() )
        }

        //_________________________________________________________________________________________

        UpdateModules()
        
        function UpdateModules () {
            getModules( data => {
                    console.log(data)
                        
                    const modulesData = Array.from(data)
                    
                    let id = 0
                    modules = []
                    modulesData.forEach(module => {
                        if(module === null || module ===  undefined) {
                            id += 1
                            return
                        } 
                        modules.push({...module, id: id})
                        id += 1
                    })
                    
                    console.log(modules)
                                    

                    modules = modules.filter(module => module !== null && module !== undefined)
                    moduleContainer.innerHTML = ""
                    for (let i = 0; i < modules.length; i++){
                        let module = modules[i]
                        
                        let themesHTML = "";
                        if (module.themes !== undefined && module.themes !== null) {
                            module.themes.forEach(theme => {
                            let themeHTML =
                            `        <li class="space_between full_width">` +
                            `            <p>${theme}</p>` +
                            `            <button class="no_default_styles left-border"> Delete </button>` +
                            `        </li>` 

                            themesHTML += themeHTML
                        });
                        }
                        
                        moduleContainer.innerHTML += 
                        `<li class="centered_row gray_background_color indented full_width">` +
                        `    <p class="bigger_font_size">${module.name}</p>` +
                        `    <p>lessons:</p>` +
                        `    <ul class="centered_row top_border full_width">` +
                        themesHTML +
                        `    </ul>` +
                        `    <div class="centered_row top_border full_width">` +
                        `        <button class="no_default_styles deleteModule" id="${module.id}"> Delete module</button>` +
                        `    </div>` +
                        `</li>`
                    }
                
            }).then(()=> {
                let allDeleteModuleButtons = document.querySelectorAll(".deleteModule") 
                allDeleteModuleButtons.forEach(button=> {
                    button.addEventListener('click', () => {
                        const id = button.id
                        removeModule( id.toString() )
                        UpdateModules()
                    })
                })
            }) 
        }
      
