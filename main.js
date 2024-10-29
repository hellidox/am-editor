const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const screen = require('electron').screen;

let mainWindow, w, h;
function createWindow() {
  w = Math.max(screen.getPrimaryDisplay().workAreaSize.width * 0.3, 1000);
  h = screen.getPrimaryDisplay().workAreaSize.height * 0.95;
  mainWindow = new BrowserWindow({
    width: w,
    height: h,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },

  });


  mainWindow.loadFile('index.html');
  mainWindow.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      mainWindow.toggleDevTools();
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


const settingsFilePath = path.join(process.env.USERPROFILE, 'AppData', 'LocalLow', 'srylain Inc_', 'Clone Hero', 'IVsettings.txt');


ipcMain.on('save-file', (event, fileContent) => {
  fs.writeFile(settingsFilePath, fileContent, (err) => {
    if (err) {
      console.error('File save error:', err);
    }
    event.reply('file-saved', settingsFilePath);
  });
});

ipcMain.on('read-file', (event) => {
  fs.readFile(settingsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('File read error:', err);
      event.reply('file-read-error', 'Failed to read the file');
      return;
    }
    event.reply('file-read-success', data);
  });
});
