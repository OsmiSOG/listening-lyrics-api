'use strict'

const express = require('express')
const lyricsController = require('./controller')
const api = express.Router()

api.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to lyrics api'})
})
api.get('/lyrics', lyricsController.getLyrics)
api.get('/lyrics/:id', lyricsController.getLyricById)
api.post('/lyrics', lyricsController.newLyrics)

module.exports = api