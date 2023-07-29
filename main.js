const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { Ros, Topic } = require('ros2nodejs')

var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;
var isFrontDev = process.env.APP_FRONT_DEV ? (process.env.APP_FRONT_DEV.trim() == "true") : false;

var ros = null 

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
  })
}

let mainWindow

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

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  // Ogni volta che si preme ctrl + X verrà cambiata pagina
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    mainWindow.webContents.send('loadSettingsPage', {});
  })

  if (!ret) {
    console.log('CTRL+X registration failed')
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
  })

  app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+X')
  
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })
})

ipcMain.on('get_files_info', (e, data) => {
  let dirPath = '/home/configurations/' + data.user + '/' + data.type 
  let files_info = []
  fs.readdir(dirPath, (error, files) => {
    if (error) { console.log(error); }
    files.forEach(file => {
      // aggiungo le informazioni al vettore
      const stats = fs.statSync(dirPath + '/' + file)
      files_info.push({ name: file, lastModified: stats.mtime})
    });

    e.reply('files_info', files_info)
  })
})

ipcMain.on('get_file_settings', (e, data) => {
  let filePath = '/home/configurations/' + data.user + '/' + data.type + '/' + data.file
  fs.readFile(filePath, 'utf8', (err, file_data) => {
    if (err) {
      console.error('Errore durante la lettura del file:', err)
      return
    }
    try {
      // trasformo il contenuto del file JSON in un oggetto
      const obj = JSON.parse(file_data)
  
      // invio la risposta
      e.reply('file_settings', obj)
    } catch (error) {
      console.error('Errore durante il parsing del JSON:', error)
    }
  }) 
})

ipcMain.on('new_settings', (e, new_settings) => {
  // leggo il file JSON
  let filePath = '/home/configurations/' + new_settings.user + '/' + new_settings.type + '/' + new_settings.file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('errore durante la lettura del file:', err);
      return;
    }

    try {
      // trasformo il contenuto del file JSON in un oggetto
      const obj = JSON.parse(data);
      
      // aggiorno i settaggi
      obj.settings = new_settings.settings

      // converto l'oggetto in una stringa JSON
      const jsonString = JSON.stringify(obj);

      // scrivo la stringa JSON nel file
      fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
          console.error('errore durante la scrittura del file:', err)
          return;
        }
        console.log('valori aggiornati nel file JSON')
        e.reply('settings_updated_successfully', data)
        // pubblico su ROS i nuovi settaggi
        if(!isFrontDev) {
          publishNewSettings(new_settings.settings).then(() => {
            console.log('settaggi pubblicati')
          })
        }
        
      });
    } catch (error) {
      console.error('Errore durante il parsing del JSON:', error)
    }
  })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const topics = [
  { id: 0, name: '/km_left', type: 'std_msgs/msg/Int32' },
  { id: 1, name: '/minutes_left', type: 'std_msgs/msg/Int32' },
  { id: 2, name: '/map', type: 'std_msgs/msg/Int8' },
  { id: 3, name: '/soc', type: 'std_msgs/msg/Int8' },
  { id: 4, name: '/traction', type: 'std_msgs/msg/Bool' },
  { id: 5, name: '/battery_temp', type: 'std_msgs/msg/Float32' },
  { id: 6, name: '/inverter_temp', type: 'std_msgs/msg/Float32' },
  { id: 7, name: '/engine_temp', type: 'std_msgs/msg/Float32' }
];

async function subscribeToTopics() {
  ros = new Ros('ws://localhost:9090');
  ros.open();

  await new Promise((resolve) => setTimeout(resolve, 10000));

  topics.forEach(element => {
    new Topic(ros, element.name, element.type).subscribe((msg) => {
      mainWindow.webContents.send('newMessage', { id: element.id, data: msg.data });
    })
  });
}

async function publishTopic(topic_name, type, data) {
  const topic = new Topic(ros, topic_name, type);
  topic.publish({ data: data });
}

async function publishNewSettings(settings) {
  settings.forEach(setting => {
    if(setting.id == 'acceleration_curve') {
      publishTopic('/' + setting.id, 'std_msgs/Int32', setting.selected_value)
    } else {
      publishTopic('/' + setting.id, 'std_msgs/Int32', setting.value)
    }
    
  });
}

if(!isFrontDev) {
  subscribeToTopics();
}



/*
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, () => {
    rclnodejs.shutdown();
  })
}) */