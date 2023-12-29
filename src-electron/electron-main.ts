import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import os from 'os';
import { connect } from 'mqtt';
import { BoadcastMessageDto } from 'src/boadcast-message-dto';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;
let isQuiting = false;
function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.maximize();
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
    mainWindow.minimize(); // 啟動後直接縮小到系統列
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  mainWindow.on('close', function (event) {
    // 非開發環境，關閉視窗會縮小系統列。
    if (!process.env.DEBUGGING) {
      if (!isQuiting) {
        event.preventDefault();
        mainWindow?.hide();
      }
      return false;
    }
  });

  createTray();
  mainWindow.on('minimize', function (event: Electron.Event) {
    event.preventDefault();
    mainWindow?.hide();
    // tray = createTray();
  });

  mainWindow.on('restore', function () {
    mainWindow?.show();
    // tray?.destroy();
  });
}

function createTray(): Tray {
  const appIcon = new Tray(
    // path.join(__dirname, '../../src-electron/icons/icon.png')
    // path.resolve(__dirname, 'icons/icon.png')
    path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER) +
      '/secret-santa.png'
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '顯示訊息',
      click: function () {
        mainWindow?.show();
      },
    },
    {
      label: '結束程式',
      click: function () {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  appIcon.on('double-click', function () {
    mainWindow?.show();
  });
  appIcon.setToolTip('CKES無聲廣播');
  appIcon.setContextMenu(contextMenu);
  return appIcon;
}

Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

/*
mqtt
*/
const MQTT_BROKER = 'mqtt://140.128.179.9';
const MQTT_TOPJECT = '193604/SilentBoadcast';
const CLIENT_NAME = 'A401';

const mqttClient = connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('成功連線到 mqtt broker');
  mqttClient.publish(MQTT_TOPJECT, CLIENT_NAME + ' 連線成功！');
  // 訂閱所有 mqtt 主題
  mqttClient.subscribe(MQTT_TOPJECT + '/client');
});

mqttClient.on('message', (topic, message) => {
  // console.log(topic);
  console.log(message.toString());
  try {
    const data: BoadcastMessageDto = JSON.parse(message.toString());
    // 要傳送給這個 client 的訊息才需要處理
    if (
      data.target.indexOf('all') != -1 ||
      data.target.indexOf(CLIENT_NAME) != -1
    ) {
      mainWindow?.webContents.send('mqtt:boadcast-message', data);
      mainWindow?.focus();
      mainWindow?.maximize();
    }
  } catch (e) {
    console.log(e);
  }
});
