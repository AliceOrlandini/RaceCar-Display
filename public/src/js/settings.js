const content = document.getElementById('content')
var currentPage = 'Home'

const users = ['pippo', 'pluto', 'paperino', 'topolino']
var selectedUser = ''
const user_box = []
const DIM_USER_BOX = users.length + 1 // aggiungo 1 per il back button
user_box.length = DIM_USER_BOX

const files_types = ['acceleration', 'skidpad', 'endurance', 'autocross', 'trackdrive', 'test']
var selectedFileType = ''
const file_type_box = []
const DIM_FILE_TYPE_BOX = files_types.length + 1 // aggiungo 1 per il back button
file_type_box.length = DIM_FILE_TYPE_BOX

var settings_elements = null
const DIM_BOX = 5 // numero massimo di elementi visualizzabili a schermo
const box = []
box.length = DIM_BOX
var selection = false
let windowStart = 0 // indice del primo elemento attualmente selezionato
let windowEnd = 4   // indice dell'ultimo elemento attualmente selezionato
let currentEl = 0   // indice dell'elemento selezionato
let DIM_SETTINGS_ELEMENTS // questo verrà impostato quando si riceverà il file
let settings_buttons = []
settings_buttons.length = 2
numRotations = 0

const file_box = []
const DIM_FILE_BOX = 5 + 1 // aggiungo 1 per il back button
file_box.length = DIM_FILE_BOX
var selectedFile = ''

function clearPage() {
  while (content.firstChild) {
    content.removeChild(content.lastChild)
  }
}

function createUpdateSettingsPage(settings) {

  currentEl = 0
  currentPage = 'UpdateSettings'
  numRotations = 0
  settings_elements = settings.settings
  DIM_SETTINGS_ELEMENTS = settings_elements.length

  let title = document.createElement('h1')
  title.textContent = 'Seleziona il valore da modificare:'
  title.classList.add('text-white', 'text-4xl', 'mb-2', 'h-[10%]')

  content.appendChild(title)

  let box_container = document.createElement('div')
  box_container.classList.add('grid', 'grid-cols-1', 'h-[60%]', 'w-full', 'gap-1')

  content.appendChild(box_container)

  settings_elements.forEach((setting, i) => {
    if(i > (DIM_BOX - 1)) {
      return
    }

    box[i] = document.createElement('div')
    box[i].classList.add('w-full', 'flex', 'rounded-lg', 'p-5')
    if(i == 0) {
      box[i].classList.add('bg-orange-500')
    }

    let setting_name = document.createElement('h3')
    setting_name.textContent = setting.name
    setting_name.classList.add('text-white', 'text-3xl', 'my-auto')

    let setting_value = document.createElement('h3')
    setting_value.textContent = setting.value
    if(setting.id != 'acceleration_curve') {
      setting_value.textContent += '/' + setting.max
    }

    setting_value.classList.add('text-3xl', 'w-fit', 'text-center')
    setting_value.classList.add('text-white', 'ml-auto', 'my-auto', 'rounded-lg', 'p-3')

    box[i].appendChild(setting_name)
    box[i].appendChild(setting_value)

    box_container.appendChild(box[i])

  });

  let settings_buttons_div = document.createElement('div')
  settings_buttons_div.classList.add('w-full', 'grid', 'grid-cols-2', 'gap-4', 'h-[20%]')

  settings_buttons[0] = document.createElement('div')
  settings_buttons[0].classList.add('w-full', 'rounded-lg', 'p-5')
  const back_title = document.createElement('h1')
  back_title.classList.add('text-white', 'text-3xl', 'm-auto', 'text-center')
  back_title.textContent = 'Back'
  settings_buttons[0].appendChild(back_title)

  settings_buttons[1] = document.createElement('div')
  settings_buttons[1].classList.add('w-full', 'rounded-lg', 'p-5')
  const confirm_title = document.createElement('h1')
  confirm_title.classList.add('text-white', 'text-3xl', 'm-auto', 'text-center')
  confirm_title.textContent = 'Confirm'
  settings_buttons[1].appendChild(confirm_title)

  settings_buttons_div.appendChild(settings_buttons[0])
  settings_buttons_div.appendChild(settings_buttons[1])

  box_container.appendChild(settings_buttons_div)
}

document.body.onkeydown = (e) => {
  if(e.keyCode == 40) { // giu
    if(currentPage == 'UpdateSettings') {
      if(!selection) {
        if(currentEl < windowEnd) {
          box[currentEl].classList.remove('bg-orange-500')
          currentEl++
          box[currentEl].classList.add('bg-orange-500')
        } else if((currentEl >= windowEnd) && (currentEl < DIM_SETTINGS_ELEMENTS - 1)) {
          currentEl++
          numRotations++
          arrayRotate(settings_elements, false)
          for(var i = 0; i < DIM_BOX; i++) {
            box[i].children[0].textContent = settings_elements[i].name
            box[i].children[1].textContent = settings_elements[i].value
            if(settings_elements[i].id != 'acceleration_curve') {
              box[i].children[1].textContent += '/' + settings_elements[i].max
            }
          }
        } else if((currentEl >= windowEnd) && (currentEl < DIM_SETTINGS_ELEMENTS + 1)) {
          currentEl++
          if(currentEl == 7) { // in questo caso devo selezionare back
            box[DIM_BOX - 1].classList.remove('bg-orange-500')
            settings_buttons[0].classList.add('bg-red-500')
          } else if(currentEl == 8) { // in questo caso devo selezionare confirm
            settings_buttons[0].classList.remove('bg-red-500')
            settings_buttons[1].classList.add('bg-green-500')
          }
        }
      } else {
        settings_elements.forEach(element => {
          if(element.numEl == currentEl) {
            if(element.value != element.min) {
              if(element.numEl == 0) {
                element.selected_value--
                if(element.selected_value < 0) {
                  element.selected_value = 0
                }
                element.value = element.acceptable_values[element.selected_value]
              } else {
                element.value--;
              }
              if(currentEl > DIM_BOX - 1) {
                box[DIM_BOX - 1].children[1].textContent = element.value
                if(element.id != 'acceleration_curve') {
                  box[DIM_BOX - 1].children[1].textContent += '/' + element.max
                }
              } else {
                box[currentEl].children[1].textContent = element.value
                if(element.id != 'acceleration_curve') {
                  box[currentEl].children[1].textContent += '/' + element.max
                }
              }
            }
          }
        })
      }
    } else if(currentPage == 'SelectUser') {
      if(currentEl < DIM_USER_BOX - 1) {
        user_box[currentEl].classList.remove('bg-orange-500')
        currentEl++
        user_box[currentEl].classList.add('bg-orange-500')
      }
    } else if(currentPage == 'SelectFileType') {
      if(currentEl < DIM_FILE_TYPE_BOX - 1) {
        file_type_box[currentEl].classList.remove('bg-orange-500')
        currentEl++
        file_type_box[currentEl].classList.add('bg-orange-500')
      }
    } else if(currentPage = 'SelectFile') {
      if(currentEl < DIM_FILE_BOX - 1) {
        file_box[currentEl].classList.remove('bg-orange-500')
        currentEl++
        file_box[currentEl].classList.add('bg-orange-500')
      }
    }
    
  } else if(e.keyCode == 38) { // su
    if(currentPage == 'UpdateSettings') {
      if(!selection) {
        if((currentEl == 7) || (currentEl == 8)) {
          if(currentEl == 7) { // in questo caso devo selezionare il box
            box[DIM_BOX - 1].classList.add('bg-orange-500')
            settings_buttons[0].classList.remove('bg-red-500')
          } else if(currentEl == 8) { // in questo caso devo selezionare back
            settings_buttons[1].classList.remove('bg-green-500')
            settings_buttons[0].classList.add('bg-red-500')
          }
          currentEl--
        } else if((currentEl > windowStart) && (currentEl <= windowEnd)) {
          box[currentEl].classList.remove('bg-orange-500')
          currentEl--
          box[currentEl].classList.add('bg-orange-500')
        } else if(currentEl > windowEnd) {
          currentEl--
          numRotations--
          arrayRotate(settings_elements, true)
          for(var i = 0; i < DIM_BOX; i++) {
            box[i].children[0].textContent = settings_elements[i].name
            box[i].children[1].textContent = settings_elements[i].value
            if(settings_elements[i].id != 'acceleration_curve') {
              box[i].children[1].textContent += '/' + settings_elements[i].max
            }
          }
        }
      } else {
        settings_elements.forEach(element => {
          if(element.numEl == currentEl) {
            if(element.value != element.max) {
              if(element.numEl == 0) {
                element.selected_value++
                if(element.selected_value > element.max) {
                  element.selected_value = element.max
                }
                element.value = element.acceptable_values[element.selected_value]
              } else {
                element.value++
              }
              if(currentEl > DIM_BOX - 1) {
                box[DIM_BOX - 1].children[1].textContent = element.value
                if(element.id != 'acceleration_curve') {
                  box[DIM_BOX - 1].children[1].textContent += '/' + element.max
                }
              } else {
                box[currentEl].children[1].textContent = element.value
                if(element.id != 'acceleration_curve') {
                  box[currentEl].children[1].textContent += '/' + element.max
                }
              }
            }
          }
        })
      }
    } else if(currentPage == 'SelectUser') {
      if(currentEl > 0) {
        user_box[currentEl].classList.remove('bg-orange-500')
        currentEl--
        user_box[currentEl].classList.add('bg-orange-500')
      }
    } else if(currentPage == 'SelectFileType') {
      if(currentEl > 0) {
        file_type_box[currentEl].classList.remove('bg-orange-500')
        currentEl--
        file_type_box[currentEl].classList.add('bg-orange-500')
      }
    } else if(currentPage == 'SelectFile') {
      if(currentEl > 0) {
        file_box[currentEl].classList.remove('bg-orange-500')
        currentEl--
        file_box[currentEl].classList.add('bg-orange-500')
      }
    }
    
  } else if(e.keyCode == 13) { // invio
    if(currentPage == 'UpdateSettings') {
      if(!selection) {
        if((currentEl == 7) || (currentEl == 8)) {
          if(currentEl == 7) {
            clearPage()
            getFilesInfo()
          } else if (currentEl == 8) {
            sendSettings()
          }
          return
        }
        selection = true
        if(currentEl > windowEnd) {
          box[DIM_BOX - 1].classList.remove('bg-orange-500')
          box[DIM_BOX - 1].children[1].classList.add('bg-orange-500')
        } else {
          box[currentEl].classList.remove('bg-orange-500')
          box[currentEl].children[1].classList.add('bg-orange-500')
        }
      } else {
        selection = false 
        if(currentEl > windowEnd) {
          box[DIM_BOX - 1].classList.add('bg-orange-500')
          box[DIM_BOX - 1].children[1].classList.remove('bg-orange-500')
        } else {
          box[currentEl].classList.add('bg-orange-500')
          box[currentEl].children[1].classList.remove('bg-orange-500')
        }
      }
    } else if(currentPage == 'SelectUser') {
      // in questo caso ha premuto back
      if(currentEl == (DIM_USER_BOX - 1)) {
        // per tornare alla home faccio prima a ricaricarla (meno sbatti)
        window.location.reload()
      } else {
        selectedUser = user_box[currentEl].children[0].textContent 
        clearPage()
        createSelectFileTypePage()
      }
    } else if(currentPage == 'SelectFileType') {
      // in questo caso ha premuto back
      if(currentEl == (DIM_FILE_TYPE_BOX - 1)) {
        clearPage()
        createSelectUserPage()
      } else {
        selectedFileType = file_type_box[currentEl].children[0].textContent 
        clearPage()
        getFilesInfo()
      }
    } else if(currentPage == 'SelectFile') {
      // in questo caso ha premuto back
      if(currentEl == (DIM_FILE_BOX - 1)) {
        clearPage()
        createSelectFileTypePage()
      } else {
        selectedFile = file_box[currentEl].children[0].children[0].textContent
        clearPage()
        getFileSettings()
      }
    }
  }
}

function createFileSelectionPage(files_info) {
  currentEl = 0
  currentPage = 'SelectFile'

  let title = document.createElement('h1')
  title.textContent = "Seleziona il file da modificare:"
  title.classList.add('text-white', 'text-5xl', 'mb-4', 'h-[10%]')

  content.appendChild(title)

  let box_container = document.createElement('div')
  box_container.classList.add('grid', 'grid-cols-1', 'h-[75%]', 'w-full', 'gap-1')

  content.appendChild(box_container)

  files_info.forEach((file, i) => {
    file_box[i] = document.createElement('div')
    file_box[i].classList.add('w-full', 'flex', 'rounded-lg', 'p-5')
    if(i == 0) {
      file_box[i].classList.add('bg-orange-500')
    }

    let info_div = document.createElement('div')
    info_div.classList.add('w-full', 'flex')

    const file_name = document.createElement('h1')
    file_name.classList.add('text-white', 'text-3xl', 'my-auto')
    file_name.textContent = file.name

    const file_date = document.createElement('h1')
    file_date.classList.add('text-white', 'text-3xl', 'my-auto', 'ml-auto')
    file_date.textContent = file.lastModified.toLocaleString("it-IT")
    
    info_div.appendChild(file_name)
    info_div.appendChild(file_date)

    file_box[i].appendChild(info_div)

    box_container.appendChild(file_box[i])
  });

  file_box[DIM_FILE_BOX - 1] = document.createElement('div')
  file_box[DIM_FILE_BOX - 1].classList.add('w-full', 'flex', 'rounded-lg', 'p-5', 'h-[15%]')
  const back_title = document.createElement('h1')
  back_title.classList.add('text-white', 'text-3xl', 'm-auto')
  back_title.textContent = 'Back'
  file_box[DIM_FILE_BOX - 1].appendChild(back_title)

  content.appendChild(file_box[DIM_FILE_BOX - 1]) 
}

function createSelectFileTypePage() {
  currentEl = 0
  currentPage = 'SelectFileType'

  let title = document.createElement('h1')
  title.textContent = "Seleziona la prova:"
  title.classList.add('text-white', 'text-5xl', 'mb-4', 'h-[10%]')

  content.appendChild(title)

  let box_container = document.createElement('div')
  box_container.classList.add('grid', 'grid-cols-3', 'h-[75%]', 'w-full', 'gap-2', 'mb-4')

  content.appendChild(box_container)

  files_types.forEach((file, i)=> {
    file_type_box[i] = document.createElement('div')
    file_type_box[i].classList.add('w-full', 'flex', 'rounded-lg', 'p-5')
    if(i == 0) {
      file_type_box[i].classList.add('bg-orange-500')
    }

    const file_title = document.createElement('h1')
    file_title.classList.add('text-white', 'text-3xl', 'm-auto')
    file_title.textContent = file
    file_type_box[i].appendChild(file_title)

    box_container.appendChild(file_type_box[i])
  });

  file_type_box[DIM_FILE_TYPE_BOX - 1] = document.createElement('div')
  file_type_box[DIM_FILE_TYPE_BOX - 1].classList.add('w-full', 'flex', 'rounded-lg', 'p-5', 'h-[15%]')
  const back_title = document.createElement('h1')
  back_title.classList.add('text-white', 'text-3xl', 'm-auto')
  back_title.textContent = 'Back'
  file_type_box[DIM_FILE_TYPE_BOX - 1].appendChild(back_title)

  content.appendChild(file_type_box[DIM_FILE_TYPE_BOX - 1])
}

function createSelectUserPage() {

  currentEl = 0
  currentPage = 'SelectUser'

  let title = document.createElement('h1')
  title.textContent = "Seleziona l'utente:"
  title.classList.add('text-white', 'text-5xl', 'mb-4', 'h-[10%]')

  content.appendChild(title)

  let box_container = document.createElement('div')
  box_container.classList.add('grid', 'grid-cols-2', 'h-[75%]', 'w-full', 'gap-2', 'mb-4')

  content.appendChild(box_container)

  users.forEach((user, i)=> {
    user_box[i] = document.createElement('div')
    user_box[i].classList.add('w-full', 'flex', 'rounded-lg', 'p-5')
    if(i == 0) {
      user_box[i].classList.add('bg-orange-500')
    }

    const user_title = document.createElement('h1')
    user_title.classList.add('text-white', 'text-3xl', 'm-auto')
    user_title.textContent = user
    user_box[i].appendChild(user_title)

    box_container.appendChild(user_box[i])
  });

  user_box[DIM_USER_BOX - 1] = document.createElement('div')
  user_box[DIM_USER_BOX - 1].classList.add('w-full', 'flex', 'rounded-lg', 'p-5', 'h-[15%]')
  const back_title = document.createElement('h1')
  back_title.classList.add('text-white', 'text-3xl', 'm-auto')
  back_title.textContent = 'Back'
  user_box[DIM_USER_BOX - 1].appendChild(back_title)

  content.appendChild(user_box[DIM_USER_BOX - 1]) 

}

// funzione di utilità per shiftare le label 
function arrayRotate(arr, reverse) {
  if (reverse) arr.unshift(arr.pop());
  else arr.push(arr.shift());
  return arr;
}

function getFilesInfo() {
  ipcRenderer.send('get_files_info', { user: selectedUser, type: selectedFileType })

  ipcRenderer.once('files_info', (e, files) => {
    createFileSelectionPage(files)
  }) 
}

function getFileSettings() {
  ipcRenderer.send('get_file_settings', { user: selectedUser, type: selectedFileType, file: selectedFile })

  ipcRenderer.once('file_settings', (e, settings) => {
    createUpdateSettingsPage(settings)
  }) 
}

function sendSettings() {
  showLoadingAlert('Sending...')
  // se il vettore era ruotato lo rimetto apposto
  while(numRotations > 0) {
    numRotations--
    arrayRotate(settings_elements, true)
  }
  ipcRenderer.send('new_settings', { user: selectedUser, type: selectedFileType, file: selectedFile, settings: settings_elements });

  ipcRenderer.once('settings_updated_successfully', (e, data) => {
    showSuccessAlert('Invio completato con successo')
    clearPage()
    createSelectUserPage()
  }) 
}