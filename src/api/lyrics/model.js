const mongoose = require('mongoose')

const schema = mongoose.Schema

const LyricsSchema = new schema({
    VideoName: String,
    YoutubeURL: String,
    collaborator: {
        name: String,
        id: String
    },
    type: ['song', 'tutorial', 'documental', 'informative', 'social', 'other'],
    hideWords: [String],
    splitLetterWithoutHiddenWords: [String],
    idGeniusLyrics: String
})

module.exports = mongoose.model('lyrics', LyricsSchema)