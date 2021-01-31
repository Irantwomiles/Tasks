const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path");
const isDev = require("electron-is-dev");
const { getStorage } = require('./storage');

let db = getStorage();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ 
        width: 400, 
        height: 700,
        icon: "",
        webPreferences: {
            nodeIntegration: true
        },
        show: true,
        resizable: false
    });
     

    mainWindow.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
    app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
    createWindow();
    }
});

/**
 * Event Listeners
 */

ipcMain.on('addTask', (event, data) => {

    let parse = Date.parse(data.date);
    let date = new Date(parse);
    let dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

    db.tasks.insert({ name: data.name, completed: false, date: dateString }, (error) => {

        if(error) return event.returnValue = null;

        return event.returnValue = "Successfully added task!"

    })

})

ipcMain.on('getTasks', (event, data) => {

    let date = new Date(data.date);
    let dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();


    db.tasks.find({date: dateString}, (error, docs) => {

        if(error) return event.returnValue = [];

        return event.returnValue = docs;

    })

})

ipcMain.on('updateTask', (event, task) => {

    db.tasks.update( {_id: task._id}, { $set: {completed: !task.completed} }, (error, numReplaced) => {
        if (error) {
            db.tasks.find({date: task.date}, (error, docs) => {

                if(error) return event.returnValue = [];
        
                return event.returnValue = docs;
            })

            return;
        }

        db.tasks.find({date: task.date}, (error, docs) => {

            if(error) return event.returnValue = [];
    
            return event.returnValue = docs;
        })
        
    })
})