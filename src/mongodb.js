const mongoose = require('mongoose')

function connectDB(uri) {
    return new Promise((resolve, reject) => {
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .then(() => {
            resolve(true)
        })
        .catch(error => {
            reject(error)
        })
    })
    
}

module.exports = connectDB