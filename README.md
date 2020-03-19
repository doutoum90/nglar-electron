# Mise en place projet angular avec Angular

## Mise en place du projet Angular

### 1. Installation de angular-cli

```bash
foo@bar:~$ ng version
// si ça ne marche pas
foo@bar:~$ npm i -g @angular/cli
```

### 2. Création du projet angular

```bash
foo@bar:~$ ng new projet-electron && cd projet-electron
```

### 3 manupilation electron

a -installation des dépendances

```bash
foo@bar:projet-electron~$ npm install -D electron electron-builder electron-reload npm-run-all npx wait-on webdriver-manager
foo@bar:projet-electron~$ npm install electron ngx-electron --save
```

b - création du fichier de dépendances `electron-builder.json` à la racine du projet

```bash
foo@bar:projet-electron~$ touch electron-builder.json
```

avec le contenu ci-dessous

```json
{
  "productName": "app-name",
  "directories": {
    "output": "release/"
  },
  "files": [
    "**/*",
    "!**/*.ts",
    "!*.code-workspace",
    "!LICENSE.md",
    "!package.json",
    "!package-lock.json",
    "!src/",
    "!e2e/",
    "!hooks/",
    "!angular.json",
    "!_config.yml",
    "!karma.conf.js",
    "!tsconfig.json",
    "!tslint.json"
  ],
  "win": {
    "icon": "dist/assets/icons",
    "target": ["portable"]
  },
  "mac": {
    "icon": "dist/assets/icons",
    "target": ["dmg"]
  },
  "linux": {
    "icon": "dist/assets/icons",
    "target": ["AppImage"]
  }
}
```

c- ajout de ces entrées dans `tsconfig.json`

```json
"include": [
    "main.ts",
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
```

d- création de `tsconfig-serve.json` à la racine

```bash
foo@bar:projet-electron~$ touch tsconfig-serve.json
```

avec ce contenu

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es5",
    "typeRoots": ["node_modules/@types"],
    "lib": ["es2017", "es2016", "es2015", "dom"]
  },
  "include": ["main.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

e- modifier le `outputPath` du build dans angular.json avec `dist`

f- modifier `app.module.ts` par quelque chose qui ressemble à ça

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
// imports
import { NgxElectronModule } from "ngx-electron";
import { WebviewDirective } from "./shared/directives/webview.directive";

@NgModule({
  declarations: [AppComponent, WebviewDirective],
  imports: [BrowserModule, NgxElectronModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

g- modifier `app-routing.module.ts` par quelque chose qui ressemble à ça

```typescript
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
const routes: Routes = [];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

h- le fichier `app.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { ElectronService } from "ngx-electron";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "nglar-electron";
  constructor(private readonly electronService: ElectronService) {}
  ngOnInit(): void {
    if (this.electronService.isElectronApp) {
      console.log("electron is working");
    } else {
      console.log("electron is not working");
    }
  }
}
```

i- ajouter le fichier `main.ts`
avec le contenu ci-dessous

```typescript
const { app, BrowserWindow, screen } = require("electron");
import * as path from "path";
import * as url from "url";

let win: any;
let serve: any;
const args: any = process.argv.slice(1);
serve = args.some(val => val === "--serve");

function createWindow(): void {
  const electronScreen: any = screen;
  const size: any = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,

    // Needed if you are using service workers
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  if (serve) {
    // tslint:disable-next-line:no-require-imports
    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL("http://localhost:4200");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }

  // Uncoment the following line if you want to open the DevTools by default
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // tslint:disable-next-line:no-null-keyword
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", createWindow);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
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
```

j-ajouter cette entrée dans `package.json`

```json
 "main": "main.js",
```

changer l'entrée scrpit par la valeur

```json
 "scripts": {
    "postinstall": "npx electron-builder install-app-deps",
    ".": "sh .angular-gui/.runner.sh",
    "ng": "ng",
    "start": "ng serve --proxy-config proxy.conf.json -o",
    "start:electron": "npm-run-all -p serve electron:serve",
    "compodoc": "compodoc -p src/tsconfig.app.json -s",
    "test": "ng test --browsers Chrome",
    "test:ci": "ng test --browsers ChromeHeadless --watch=false",
    "test:firefox": "ng test --browsers Firefox",
    "test:ci:firefox": "ng test --browsers FirefoxHeadless --watch=false",
    "test:firefox-dev": "ng test --browsers FirefoxDeveloper",
    "test:ci:firefox-dev": "ng test --browsers FirefoxDeveloperHeadless --watch=false",
    "test:electron": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "ngsw-config": "npx ngsw-config dist ngsw-config.json",
    "ngsw-copy": "cp node_modules/@angular/service-worker/ngsw-worker.js dist/",
    "serve": "ng serve",
    "serve:open": "npm run start",
    "serve:pwa": "npm run build:pwa && http-server dist -p 8080",
    "serve:prod": "ng serve --open --prod",
    "serve:prodcompose": "ng serve --open --configuration=prodcompose",
    "serve:node": "ng serve --open --configuration=node",
    "build": "ng build",
    "build:pwa": "ng build --configuration=pwa --prod --build-optimizer && npm run ngsw-config && npm run ngsw-copy",
    "build:prod": "ng build --prod --build-optimizer",
    "build:prodcompose": "ng build --configuration=prodcompose ",
    "build:electron": "npm run electron:serve-tsc && ng build --base-href ./",
    "build:electron:dev": "npm run build:electron -- -c dev",
    "build:electron:prod": "npm run build:electron -- -c production",
    "electron:start": "npm-run-all -p serve electron:serve",
    "electron:serve-tsc": "tsc -p tsconfig-serve.json",
    "electron:serve": "wait-on http-get://localhost:4200/ && npm run electron:serve-tsc && electron . --serve",
    "electron:local": "npm run build:electron:prod && electron .",
    "electron:linux": "npm run build:electron:prod && npx electron-builder build --linux",
    "electron:windows": "npm run build:electron:prod && npx electron-builder build --windows",
    "electron:mac": "npm run build:electron:prod && npx electron-builder build --mac"
  }
```
