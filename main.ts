const { app, BrowserWindow, screen } = require('electron');
import * as path from 'path';
import * as url from 'url';

let win: any;
let serve: any;
const args: any = process.argv.slice(1);
serve = args.some((val) => val === '--serve');

function createWindow(): void {
    const electronScreen: any = screen;
    const size: any = electronScreen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,

        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        }
    });

    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'dist/index.html'),
                protocol: 'file',
                slashes: true,
            }),
        );
    }

    win.on('closed', () => {
        win = null;
    });
}

try {

    app.on('ready', createWindow);

    app.on('window-all-closed', () => {

        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
} catch (e) { }