'use strict'

const HTMLParser  = require('node-html-parser');

class ParseLyrics{
    constructor() {}
    
    static toHtml(lyric) {
        const html = HTMLParser.parse(lyric);
        return html.toString();
    }

    static withoutFormat(lyric) {
        const regex = /[(\n|\t|\r|\v)]/g;
        return lyric.replace(regex, '');
    }

    static hiddenKeyword(lyric, hiddenWords) {
        let regWords = hiddenWords.reduce((acc, cv) => `${acc}|${cv}`);
        console.log(regWords);
        let regex = new RegExp(`(${regWords})\\b`, 'gi');
        return lyric.match(regex);
    }
    
    static hiddenKeywordToHtml(lyricHtml, hiddenWords) {
        let regWords = hiddenWords.reduce((acc, cv) => `${acc}|${cv}`);
        let regex = new RegExp(`(${regWords})\\b`, 'gi');
        lyricHtml = lyricHtml.replace(regex, ` <input type="text"> `)
        return lyricHtml.replace(/\n/g, `<br>`)
    }

    static hiddenKeywordFormat(lyric, hiddenWords) {
        let regWords = hiddenWords.reduce((acc, cv) => `${acc}|${cv}`);
        let regex = new RegExp(`(${regWords})\\b`, 'gi');
        return lyric.replace(regex, ' #hidden word# ')
    }
}

module.exports = ParseLyrics