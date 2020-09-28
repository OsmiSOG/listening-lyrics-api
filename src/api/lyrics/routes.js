'use strict'

const express = require('express')
const lyricsController = require('./controller')
const api = express.Router()

api.get('/', lyricsController.index)
api.get('/lyrics', lyricsController.searchLyrics, lyricsController.index)
// api.get('/lyrics/:search', lyricsController.searchLyrics)
api.get('/lyrics/:id', lyricsController.getLyricById)
api.post('/lyrics', lyricsController.newLyrics)

module.exports = api