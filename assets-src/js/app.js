console.log('workss');

//childProcess.exec('ffmpeg', function(e,o,err){console.log("Error: " + e); console.log(o); console.log(err)});

var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('C:\/ffmpeg\/bin\/ffmpeg.exe');
ffmpeg.setFfprobePath('C:\/ffmpeg\/bin\/ffprobe.exe');
ffmpeg.setFlvtoolPath('C:\/ffmpeg\/bin\/ffplay.exe');
var command = ffmpeg('C:/video/video.mp4')
    .input('C:/video/video.mp4')
    .input('C:/video/intro.avi')
    .on('progress', function(progress) {
        console.log(progress);
    })
    .on('error', function(err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
    })
    .complexFilter([
        '[0:v]setpts=PTS-STARTPTS,scale=2550x1080[top];[1:v]setpts=PTS-STARTPTS,scale=1920x1080[bottom];[top][bottom]overlay=x=(W-w)/2:eof_action=pass'
    ])
    .audioCodec('aac')
    .videoCodec('libx264')
    .output('C:/video/combined.mp4')
    .run();
