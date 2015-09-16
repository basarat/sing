var fs = require('fs');
var ytdl = require('ytdl-core');
var url = 'https://www.youtube.com/watch?v=-CmadmM5cOk';
ytdl.getInfo(url, function (err, info) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    var title = info.title;
    ytdl(url, {
        filter: function (format) {
            return format.container == 'mp4' && format.resolution == '720p';
        }
    }).pipe(fs.createWriteStream(title + ".mp4"));
});
