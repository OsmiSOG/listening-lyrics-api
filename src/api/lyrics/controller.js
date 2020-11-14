'use strict'

const LyricsModel = require('./model')

function index(req, res) {
    let page = req.query.page ? parseInt(req.query.page) : 0
    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    // console.log(page, limit);
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
                LyricsModel.find({YoutubeURL:req.query.search}).exec((err, lyric) => {
                    if (err) return res.status(500).send({message: 'error al resolver la solicitud'})
                    if (!lyric) return res.status(404).send({message: 'lyric not finded'})
                    res.status(200).send(lyric);
                })
                break;
            case 'name':
                let words = req.query.search.split(' ')
                let regexp = `${words.reduce((acc, cur)=>`${acc}|${cur}`)}`
                console.log(regexp);
                LyricsModel.find({VideoName: {$regex: regexp, $options:'gi'}})
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
    lyric.hideWords.forEach((word, i) => {
        if (word.toLowerCase() === wordsToQualify[i].toLowerCase()) {
            rightWords.push(wordsToQualify[i])
        } else {
            wrongWords.push(wordsToQualify[i])
        }
    });
    const score = {
        rightWords,
        wrongWords,
        score : `${rightWords.length}/${lyric.hideWords.length}`,
        percentageScore : (rightWords.length/lyric.hideWords.length)*100
    }
    res.status(200).send(score)
}

function newLyrics(req, res) {
    // console.log('POST /api/product');
    // console.log(req.body);
    let lyric = new LyricsModel()
    lyric.VideoName = req.body.videoName
    lyric.YoutubeURL = req.body.youtubeURL
    lyric.collaborator.name = req.body.collaboratorName
    lyric.collaborator.id = req.body.collaboratorId
    lyric.type = req.body.type
    lyric.hideWords = req.body.hideWords
    lyric.splitLyricExcludingHiddenWords = req.body.splitLyric
    if (req.body.idGeniusLyrics) {
        lyric.idGeniusLyrics = req.body.idGeniusLyrics
    }

    lyric.save((err, lyricStored) => {
        if (err) return res.status(500).send({message: `Error al guardar en la base de datos ${err}`})
        res.status(200).send({lyric: lyricStored})
    })
}

module.exports = { index, searchLyrics, getLyricById, resLyricId, qualifyLyrics, newLyrics}