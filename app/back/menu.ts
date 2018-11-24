import { app, Menu, BrowserWindow } from 'electron';

export default class MenuBuilderSolus {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const menu = MenuBuilderSolus.buildDefaultTemplate();
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  static buildDefaultTemplate() {
    return Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          {
            label: 'Exit',
            accelerator: 'Ctrl+W',
            click() {
              app.quit();
            }
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About'
          }
        ]
      }
    ]);
  }
}
