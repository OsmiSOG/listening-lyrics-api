'use strict'

const express = require('express')
const connectDB = require('./mongodb')
const apiLyrics = require('./api/lyrics/routes')

function initServer(config) {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use('/api', apiLyrics)
    connectDB(config.mongodb).then(() => {
        app.listen(config.server.port, () => {
            console.log(`server listen at http://localhost:${config.server.port}`);
        })
    }).catch(error => {
        console.log('error connect db');
    })

}

module.exports = initServer
