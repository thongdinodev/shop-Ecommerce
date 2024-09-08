const mongoose = require('mongoose')

class ConnectDatabaseSingleton {
    static #instance;

    constructor() {
        mongoose.connect(process.env.MONGODB_URL).then(() => {
            console.log('Success to connect with mongoDB');
        })
        .catch((err) => {
            console.log(err);
        });
    }

    static getInstance() {        

        if (this.#instance == null) {    
            this.#instance = new ConnectDatabaseSingleton()
        }

        return this.#instance
    }
}

module.exports = ConnectDatabaseSingleton