#!/usr/bin/env node
"use strict";
var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
if (process.platform == 'win32') {
    ffmpeg.setFfmpegPath(__dirname + "/../bin/" + process.platform + "/ffmpeg");
}
var url = process.argv[2] || 'https://www.youtube.com/watch?v=-CmadmM5cOk';
ytdl.getInfo(url, function (err, info) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    var title = info.title;
    title = title.replace(/"|'|\:|\?|\||\\|\//g, '');
    console.log("Downloading/Converting: " + title);
    var stream = ytdl(url, {});
    stream.pipe(fs.createWriteStream(title + ".mp4"));
    var proc = new ffmpeg({ source: stream });
    proc.saveToFile(title + ".mp3");
});
