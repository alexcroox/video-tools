function FileSystem() {

    console.log('Init FileSystem');
    this.dropZone = $('.drop-zone');
}

FileSystem.prototype.setupInteractionHandlers = function() {

    var self = this;

    console.log('this', this);

    this.dropZone.on('dragenter dragover', function(e) {
        e.preventDefault();

        console.log('dragging');
        self.dropZone.addClass('drop-zone--dropping');
    });

    this.dropZone.on('dragleave', function(e) {

        console.log('leaving');
        self.dropZone.removeClass('drop-zone--dropping');
    });

    this.dropZone.on('drop', function(e) {

        e.preventDefault();

        self.dropZone.removeClass('drop-zone--dropping');

        // TODO: Multiple video drops?
        var videoPath = e.originalEvent.dataTransfer.files[0].path;
        console.log('Getting meta for', videoPath);

        video.getMeta(videoPath, function(error, meta) {

            if(error) {
                console.log('Not a video file?', error);
            } else {


            }
        });
    });
};


function Video() {

    this.introRes = {
        width: 1920,
        height: 1080
    };

    this.ffmpeg = require('fluent-ffmpeg');
    this.ffmpeg.setFfmpegPath('ffmpeg-builds/osx/ffmpeg');
    this.ffmpeg.setFfprobePath('ffmpeg-builds/osx/ffprobe');
    this.ffmpeg.setFlvtoolPath('ffmpeg-builds/osx/ffplay');
}

Video.prototype.setupInteractionHandlers = function() {


};

Video.prototype.getMeta = function(videoPath, cb) {

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
        .seekInput(2)
        .duration(4)
        .input(path.join(__dirname, '/videos/intro.mov'))
        .complexFilter([
            '[0:v]setpts=PTS-STARTPTS,scale=' + sourceMeta.width + 'x ' + sourceMeta.height + '[top];[1:v]setpts=PTS-STARTPTS,scale=' + this.introRest.width + 'x' + this.introRest.height + '[bottom];[top][bottom]overlay=x=(W-w)/2:eof_action=pass'
        ])
        .audioCodec('aac')
        .videoCodec('libx264')
        .output('C:/video/combined.mp4')
        .run();
}

//const remote = require('electron').remote;

window.$ = window.jQuery = require('jquery');

// Third party libs
var _ = require('underscore'),
    $ = require('jquery'),
    path = require('path');

// Our app specific modules
var fileSystem = new FileSystem(),
    video = new Video();

fileSystem.setupInteractionHandlers();
video.setupInteractionHandlers();

$('.header__exit').click(function(e) {
    e.preventDefault();

    var window = remote.getCurrentWindow();
    window.close();
});

$('.header__minimise').click(function(e) {
    e.preventDefault();

    var window = remote.getCurrentWindow();
    window.minimize();
});

