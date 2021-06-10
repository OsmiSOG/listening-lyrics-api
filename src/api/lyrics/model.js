'use strict'

const mongoose = require('mongoose')

const schema = mongoose.Schema

const LyricsSchema = new schema({
    video_name: String,
    youtube_url: String,
    language: {type: String, index: true},
    collaborator_id: String,
    type: ['song', 'tutorial', 'documental', 'informative', 'social', 'other'],
    hidden_keyword : [String],
    hidden_keyword_lyric: [String],
    lyric_original_format: String,
    lyric_html_format: String,
    lyric_without_format: String,
    lyric_hidden_keyword_html_format: String,
    lyric_hidden_keyword_without_format: String,
    genius_lyrics_id: String 
})

module.exports = mongoose.model('lyrics', LyricsSchema)