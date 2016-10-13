function Video() {

    this.introRes = {
        width: 1920,
        height: 1080
    };

    var ffmpegPath = (process.platform === "darwin")? 'osx' : 'windows';
    var ffmpegExtension = (process.platform === "darwin")? '' : '.exe';
    console.log('appp',__dirname );

    this.ffmpeg = require('fluent-ffmpeg');
    this.ffmpeg.setFfmpegPath(__dirname + '/../ffmpeg-builds/' + ffmpegPath + '/ffmpeg' + ffmpegExtension);
    this.ffmpeg.setFfprobePath(__dirname + '/../ffmpeg-builds/' + ffmpegPath + '/ffprobe' + ffmpegExtension);
    this.ffmpeg.setFlvtoolPath(__dirname + '/../ffmpeg-builds/' + ffmpegPath + '/ffplay' + ffmpegExtension);

    this.videoProcessingContainer = $('.video-processing');
}

Video.prototype.setupInteractionHandlers = function() {


};

Video.prototype.ready = function() {

    video.videoProcessingContainer.addClass('video-processing--ready');
    fileSystem.dropZone.addClass('drop-zone--video-ready');
};

Video.prototype.getMeta = function(videoPath, cb) {

    var self = this;

    this.ffmpeg.ffprobe(videoPath, function(err, metadata) {

        if (err) {
            cb(err);
        } else {
            console.log(metadata);

            var height = 0;
            var width = 0;
            var duration = metadata.format.duration;

            // Not a video file?
            if(duration < 1)
                return cb('Not a video file');

            _.each(metadata.streams, function(s) {

                if(typeof s.height !== "undefined")
                    height = s.height;

                if(typeof s.width !== "undefined")
                    width = s.width;
            });

            console.log(width, height);

            if(width == 0)
                cb('Error getting dimensions');

            self.process({
                width: width,
                height: height
            });

            cb(false, {
                height: height,
                width: width,
                duration: duration
            });
        }
    });
}

// Overlay the intro video on the main video, centered
Video.prototype.process = function(sourceMeta) {

    this.ffmpeg()
        .on('start', function(command) {
            console.log('starting');
        })
        .on('progress', function(progress) {
            console.log(progress);
        })
        .on('error', function(err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message);
        })
        .on('end', function(stdout, stderr) {
            console.log('Transcoding succeeded !');
        })
        .input(path.join(__dirname, '/videos/video.mp4'))
        //.seekInput(2)
        //.duration(4)
        .input(path.join(__dirname, '/videos/intro.mov'))
        .complexFilter([
            '[0:v]setpts=PTS-STARTPTS,scale=' + sourceMeta.width + 'x ' + sourceMeta.height + '[top];[1:v]setpts=PTS-STARTPTS,scale=' + this.introRes.width + 'x' + this.introRes.height + '[bottom];[top][bottom]overlay=x=(W-w)/2:eof_action=pass'
        ])
        .audioCodec('aac')
        .videoCodec('libx264')
        .output('C:/video/combined.mp4')
        .run();
}
