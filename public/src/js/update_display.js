const { ipcRenderer } = require('electron')

const battery_chart = new Chart(document.querySelector("#battery_chart"), radial_chart_options);
const inverter_chart = new Chart(document.querySelector("#inverter_chart"), radial_chart_options);
const engine_chart = new Chart(document.querySelector("#engine_chart"), radial_chart_options);

// creo un vettore di 8 elementi che 
// contterrà i riferimenti alle label o ai grafici
const interface_elements = [
  document.getElementById('KM_left_label'),
  document.getElementById('minutes_left_label'),
  document.getElementById('map_label'),
  document.getElementById('soc_label'),
  document.getElementById('traction_circle'),
  { chart: battery_chart, label: document.getElementById('battery_label') },
  { chart: inverter_chart, label: document.getElementById('inverter_label') },
  { chart: engine_chart, label: document.getElementById('engine_label') },
];

// ogni volta che arriva un messaggio aggiorno il display
ipcRenderer.on('newMessage', (e, msg) => {
  if(msg.id < 4) { // in questo caso devo solo aggiornare la label
    interface_elements[msg.id].textContent = msg.data
  } else if(msg.id == 4) { // in questo caso devo aggiornare il cerchio del traction
    let color
    // ipotizzo sia un booleano
    if(msg.data == false) { color = '#181818' } 
    else { color = '#FA1100' }
    // aggriono il colore
    interface_elements[msg.id].setAttribute('fill', color)
  } else { // in questo caso devo aggiornare il grafico
    let new_data = Math.floor(msg.data)
    let chart_color

    // a seconda del nuovo dato coloro il grafico in modo diverso
    if(new_data > 80) {
      chart_color = "#FA1100" // rosso
    } else if((new_data < 80) && (new_data > 40)) {
      chart_color = "#FFEE00" // giallo
    } else {
      chart_color = "#14FF00" // verde
    }

    // aggiorno la label 
    interface_elements[msg.id].label.textContent = new_data

    // se il dato ricevuto è maggiore di 100 lo tronco perchè il grafico ha 
    // come valore massimo 100%
    if(new_data > 100) { new_data = 100 }
    
    // aggiorno il grafico 
    interface_elements[msg.id].chart.data.datasets[0].data = [new_data, (100 - new_data)]
    interface_elements[msg.id].chart.data.datasets[0].backgroundColor = [chart_color, '#000000']
    interface_elements[msg.id].chart.data.datasets[0].borderColor = [chart_color, '#000000']
    interface_elements[msg.id].chart.update()
  }
})

ipcRenderer.on('loadSettingsPage', (e, msg) => {
  clearPage()
  createSelectUserPage()
})