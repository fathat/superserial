import {app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as SerialPort from 'serialport';
import { PortMessages } from './src/app/constants';
import Readline = SerialPort.parsers.Readline;

// Initialize remote module
require('@electron/remote/main').initialize();


let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

let activeSerialPort: SerialPort | null = null;

ipcMain.on('listing', (event, ...args: any[]) => {
  SerialPort.list().then((portInfo: SerialPort.PortInfo[]) => {
    event.reply('listing', portInfo);
  });
});

ipcMain.on('port', (event, msg:PortMessages, ...args: any[]) => {

  switch(msg) {
    case 'open': {
      const [path, options]: [string, SerialPort.OpenOptions] = args as any;

      if(activeSerialPort) {
        if(activeSerialPort.isOpen) {
          activeSerialPort.close((err) => {
            if(err) {
              event.reply('port', 'error', err);
            } else {
              event.reply('port', 'close');
            }
          });
        }
        activeSerialPort = null;
      }

      console.log("opening port...", path, options);
      activeSerialPort = new SerialPort(path, options, (error) => {
        if(error) {
          event.reply('port', 'error', error);
        } else {
          event.reply('port', 'open');

          activeSerialPort.on('data', (data) => {
            //console.log('activeSerialPort - data', data);
            win.webContents.send('port-data', Array.from(data.values()));
          });

          const parser = new Readline({delimiter: '\r\n'});
          activeSerialPort.pipe(parser);
          parser.on('data', (buffer: Buffer) => {
            win.webContents.send('port-text-line', buffer.toString('utf-8'));
          });

          activeSerialPort.on('close', () => {
            console.log('activeSerialPort - close');
            win.webContents.send('port', 'close');
          });

          activeSerialPort.on('error', (err) => {
            console.log('activeSerialPort - error', err);
            win.webContents.send('port', 'error', err);
          });
        }
      });

      break;
    }
    case 'close':
      activeSerialPort.close(() => {
        win.webContents.send('port', 'close');
      });
      break;
    case 'send':
      console.error('not implemented');
      break;
  }

});



function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: (size.width * 0.125) | 0,
    y: (size.height * 0.125) | 0,
    width: (size.width * 0.75) | 0,
    height: (size.height * 0.75) | 0,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  win.setMenu(null);

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {


  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
