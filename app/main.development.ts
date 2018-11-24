import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
import { ToMain, ToRenderer } from './types/ipcMessages';
import * as path from 'path';
import * as os from 'os';

let menu;
let template;
let mainWindow: BrowserWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const installExtensions = () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer');

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload)));
  }

  return Promise.resolve([]);
};

app.on('ready', () => {
  installExtensions()
  .then(() => {

    const osType = os.type();
    let osWindowParams = {};
    let osTypeToRenderer: string;
    if (osType.includes('Windows')) {
      osWindowParams = {
        frame: false
      };
      osTypeToRenderer = 'Windows';
    }
    if (osType.includes('Darwin')) {
      osWindowParams = {
        titleBarStyle: 'hiddenInset',
      };
      osTypeToRenderer = 'Darwin';
    }

    const finalBrowserWindowParams = Object.assign({
      show: false,
      width: 1024,
      height: 728,
      minWidth: 600,
      minHeight: 400,
      backgroundColor: '#394b59',
      icon: path.join(__dirname, 'resources', 'icon.png')
    }, osWindowParams);

    mainWindow = new BrowserWindow(finalBrowserWindowParams);

    mainWindow.loadURL(`file://${__dirname}/app.html`);

    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send(ToRenderer.OS_TYPE, osTypeToRenderer);
    });

    mainWindow.on('closed', () => {
    // mainWindow = null;
    });

    ipcMain.on(ToMain.MINIMIZE, () => {
      mainWindow.minimize();
    });

    ipcMain.on(ToMain.MAXIMIZE, () => {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    });

    ipcMain.on(ToMain.CLOSE, () => {
      mainWindow.close();
    });

    // Window Calls

    ipcMain.on(ToMain.MIC_IDK, () => {
      // Logic here
      mainWindow.webContents.send(ToRenderer.MIC_IDK_RESULT, '42');
    });

    ipcMain.on(ToMain.MIC_IDK_2, () => {
      // Logic here
      mainWindow.webContents.send(ToRenderer.MIC_IDK_2_RESULT, 'Au moins 1000');
    });

      // End of setup

    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
      mainWindow.webContents.on('context-menu', (e, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([{
          label: 'Inspect element',
          click() {
            mainWindow.webContents.inspectElement(x, y);
          }
        }]).popup(mainWindow);
      });
    }

    template = [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.webContents.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('http://electron.atom.io');
        }
      }, {
        label: 'Documentation',
        click() {
          shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme');
        }
      }, {
        label: 'Community Discussions',
        click() {
          shell.openExternal('https://discuss.atom.io/c/electron');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/atom/electron/issues');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  });
});
