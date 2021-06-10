'use strict'

const LyricsModel = require('./model')
const ParseLyrics = require('../../services/parserLyrics')

function index(req, res) {
    let page = req.query.page ? parseInt(req.query.page) : 0
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    LyricsModel.find({})
        .limit(limit)
        .skip(page*limit)
        .exec((err, lyrics) => {
            if (err) return res.status(500).send({message: 'error al resolver la solicitud', success:falses})
            
            res.status(200).send(lyrics);
        })
    return;
}

function searchLyrics(req, res, next) {
    if (req.query.search) {
        let typeSearch = req.query.search.startsWith('https://www.youtube.com') ? 'youtube' : 'name';
        console.log(req.query.search);
        switch (typeSearch) {
            case 'youtube':
                LyricsModel.find({youtube_url:req.query.search}).exec((err, lyric) => {
                    if (err) return res.status(500).send({message: 'error al resolver la solicitud'})
                    if (!lyric) return res.status(404).send({message: 'lyric not finded'})
                    res.status(200).send(lyric);
                })
                break;
            case 'name':
                let words = req.query.search.split(' ')
                let regexp = `${words.reduce((acc, cur)=>`${acc}|${cur}`)}`
                console.log(regexp);
                LyricsModel.find({video_name: {$regex: regexp, $options:'gi'}})
                    .exec((err, lyrics) => {
                        if (err) return res.status(500).send({message: 'error al resolver la solicitud'})
                        if (!lyrics) return res.status(404).send({message: 'lyric not finded'})
                        res.status(200).send(lyrics);
                    })
                break;
            default:
                res.status(404).send({message:'busqueda erronea'});
                break;
        }              
    } else {
        next()
    } 
}

function getLyricById(req, res, next) {
    let lyricId = req.params.id

    LyricsModel.findById(lyricId, (err, lyric) => {
        if (err) return res.status(500).send({message: 'Error al resolver la solicitud'})
        if (!lyric) return res.status(404).send({message: 'song not finded'})
        req.lyric = lyric
        next()
    })

}

function resLyricId(req, res) {
    res.status(200).send(req.lyric)
}

function qualifyLyrics(req, res) {
    const lyric = req.lyric
    const wordsToQualify = req.body.wordsAnswered
    if (!Array.isArray(wordsToQualify)) return res.status(500).send({message : 'The parameters no are compatible'})
    let rightWords = []
    let wrongWords = []
    lyric.hidden_keyword_lyric.forEach((word, i) => {
        if (word.toLowerCase().trim() === wordsToQualify[i].toLowerCase().trim()) {
            rightWords.push(wordsToQualify[i])
        } else {
            wrongWords.push(wordsToQualify[i])
        }
    });
    const score = {
        rightWords,
        wrongWords,
        score : `${rightWords.length}/${lyric.hidden_keyword_lyric.length}`,
        percentageScore : (rightWords.length/lyric.hidden_keyword_lyric.length)*100
    }
    res.status(200).send(score)
}

function newLyrics(req, res) {
    let lyric = req.body.lyric

    let Lyric = new LyricsModel()
    Lyric.video_name = req.body.videoName
    Lyric.youtube_url = req.body.youtubeURL
    Lyric.language = req.body.language
    Lyric.collaborator_id = req.body.collaboratorId
    Lyric.type = req.body.type
    Lyric.hidden_keyword = req.body.keywords
    Lyric.hidden_keyword_lyric = ParseLyrics.hiddenKeyword(lyric, Lyric.hidden_keyword)
    Lyric.lyric_original_format = lyric
    Lyric.lyric_html_format = ParseLyrics.toHtml(lyric)
    Lyric.lyric_without_format = ParseLyrics.withoutFormat(lyric)
    Lyric.lyric_hidden_keyword_html_format = ParseLyrics.hiddenKeywordToHtml(lyric, Lyric.hidden_keyword)
    Lyric.lyric_hidden_keyword_without_format = ParseLyrics.hiddenKeywordFormat(lyric, Lyric.hidden_keyword)
    Lyric.genius_lyrics_id = req.body.idGenius

    if (req.body.idGeniusLyrics) {
        lyric.idGeniusLyrics = req.body.idGeniusLyrics
    }

    Lyric.save((err, lyricStored) => {
        if (err) return res.status(500).send({message: `Error al guardar en la base de datos ${err}`})
        res.status(200).send({lyric: lyricStored})
    })
}

module.exports = { index, searchLyrics, getLyricById, resLyricId, qualifyLyrics, newLyrics}