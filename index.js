const { app, BrowserWindow } = require("electron");
const { initExpress } = require("./app");

initExpress(app);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.webContents.openDevTools({ mode: "detach" });
  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
