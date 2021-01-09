const Datastore = require('nedb')

const dataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")

class Storage { 
    constructor() {
        this.tasks = new Datastore({filename: `${dataPath}\\tasks\\tasks.db`, autoload: true})
    }
}

const storage = new Storage()

function getStorage() {
    return storage
}

module.exports = {
    getStorage
}