const { app, BrowserWindow, ipcMain } = require('electron')

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
})


let mainWindow
let timer

const createWindow = () => {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "Car Display",
    resizable: false,
    customFileProtocol: './',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('public/src/html/index.html')

  mainWindow.on('closed', () => {
    clearInterval(timer);
  });

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  simulateData()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * This function is called when the main window is ready to receive messages
 * and it is used to simulate data coming from the car
 */
async function simulateData() {
  let random_value = 0;
  timer = setInterval(() => {
    for(let i = 0; i < 8; i++) {
      if(i == 4) {
        random_value = Math.random() >= 0.5
      } else {
        random_value = Math.floor(Math.random() * 100)
      }
      mainWindow.webContents.send('newMessage', { id: i, data: random_value })
    }
  }, 1000)
}

// this are the topics that the car is going to publish 
const topics = [
  { id: 0, name: '/km_left' },
  { id: 1, name: '/minutes_left' },
  { id: 2, name: '/map' },
  { id: 3, name: '/soc' },
  { id: 4, name: '/traction'},
  { id: 5, name: '/battery_temp' },
  { id: 6, name: '/inverter_temp' },
  { id: 7, name: '/engine_temp' }
];