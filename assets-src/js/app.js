window.$ = window.jQuery = require('jquery');

var _ = require('underscore'),
    path = require('path');
//childProcess.exec('ffmpeg', function(e,o,err){console.log("Error: " + e); console.log(o); console.log(err)});

var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('C:\/ffmpeg\/bin\/ffmpeg.exe');
ffmpeg.setFfprobePath('C:\/ffmpeg\/bin\/ffprobe.exe');
ffmpeg.setFlvtoolPath('C:\/ffmpeg\/bin\/ffplay.exe');

ffmpeg.ffprobe(path.join(__dirname, '/videos/video.mp4'), function(err, metadata) {
    if (err) {
        console.error(err);
    } else {
        // metadata should contain 'width', 'height' and 'display_aspect_ratio'
        console.log(metadata);

        var height = 0;
        var width = 0;
        var duration = metadata.format.duration;

        _.each(metadata.streams, function(s) {

            if(typeof s.height !== "undefined")
                height = s.height;

            if(typeof s.width !== "undefined")
                width = s.width;
        });

        console.log(width, height);

        //process(width, height);
    }
});

document.ondragover = document.ondrop = function(ev) {
    ev.preventDefault();

    $('body').addClass('dropping');
}

document.ondragleave = function(ev) {

    $('body').removeClass('dropping');
}

document.body.ondrop = function(ev) {
    console.log(ev.dataTransfer.files[0].path)
    ev.preventDefault()
}

function process(width, height) {

    ffmpeg()
        .input(path.join(__dirname, '/videos/video.mp4'))
        .input(path.join(__dirname, '/videos/intro.mov'))
        .on('progress', function(progress) {
            console.log(progress);
        })
        .on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message);
        })
        .complexFilter([
            '[0:v]setpts=PTS-STARTPTS,scale=' + width + 'x ' + height + '[top];[1:v]setpts=PTS-STARTPTS,scale=1920x1080[bottom];[top][bottom]overlay=x=(W-w)/2:eof_action=pass'
        ])
        .audioCodec('aac')
        .videoCodec('libx264')
        .output('C:/video/combined.mp4')
        .run();
};
