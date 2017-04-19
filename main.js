const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const path = require("path");
const url = require("url");
const jsonServer = require("json-server");
const fs = require("fs");

const APIServer = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

let win;

const refreshFile = function() {
    fs.readFile("./db.json", function(err, data) {
        win.webContents.send("fileModified", data.toString());
    });
}

APIServer.use(middlewares);
APIServer.use(jsonServer.bodyParser);
APIServer.use(router);

APIServer.listen(3000, () => console.log('listening in 3000'));

app.on("ready", function() {
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
    }));

    ipcMain.on("ready", refreshFile);
    fs.watchFile("./db.json", refreshFile);

    win.on("closed", () => win = null);
})