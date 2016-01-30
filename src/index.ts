#!/usr/bin/env node
import fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
if (process.platform == 'win32') {
    ffmpeg.setFfmpegPath(`${__dirname}/../bin/${process.platform}/ffmpeg`);
}

/**
 * https://github.com/fent/node-ytdl-core/blob/0131b01b3cd629e6261d304b632dab7f2854fa10/lib/formats.js
 * http://en.wikipedia.org/wiki/YouTube#Quality_and_formats
 *
 * Note: 720p mp4 has a bit rate of 192 ;)
 */
interface YouTubeFormat {
    container: string; // flv mp4 3gp webm
    resolution: string; // 240p 360p 480p 720p 1080p 1440p
    encoding: string; // many....
    profile?: string; // null, 'main'
    bitrate?: string;
    audioEncoding: string;
    audioBitrate: number;
}

let url = process.argv[2] || 'https://www.youtube.com/watch?v=-CmadmM5cOk';

// get title
ytdl.getInfo(url, (err, info) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    let title = info.title;
    title = title.replace(/"|'|\:|\?|\||\\|\//g,'');
    console.log(`Downloading/Converting: ${title}`);

    // now download:
    let stream = ytdl(url, {
        // filter: (format: YouTubeFormat) => {
        //     return format.container == 'mp4' && format.resolution == '720p'
        // }
    });

    // save mp4
    stream.pipe(fs.createWriteStream(`${title}.mp4`));

    // convert mp3
    let proc = new ffmpeg({ source: stream });
    proc.saveToFile(`${title}.mp3`);
})
//
// ytdl(, {
//     filter: (format:YouTubeFormat) => {
//         console.log(format);
//         return format.container == 'mp4' && format.resolution == '720p'
//     }
// })
//     .pipe(fs.createWriteStream('video.mp4'));
