function FileSystem() {

    console.log('Init FileSystem');
    this.dropZone = $('.drop-zone');
    this.rawPath = remote.app.getPath('videos');
    this.processedPath = remote.app.getPath('documents');
}

FileSystem.prototype.setupInteractionHandlers = function() {

    var self = this;

    console.log('this', this);

    $('.filesystem-open').on('click', function(e) {

        e.preventDefault();

        var folderPath = '';

        switch($(this).attr('data-path')) {
            case "raw":
                folderPath = self.rawPath;
                break;

            case "processed":
                folderPath = self.processedPath;
                break;
        }

        remote.shell.showItemInFolder(folderPath + '/blank');
    });

    $('.trigger-file-input').click(function(e) {
        e.preventDefault();

        $(this).parent().find('.file').click();
    });

    $('.drop-zone').on('click', function(e) {

        e.preventDefault();

        remote.dialog.showOpenDialog({
            title: 'Find your video file',
            defaultPath: self.rawPath,
            filters: [
                { name: 'Arma Vids', extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv'] }
            ]
        });
    });

    this.dropZone.on('dragenter dragover', function(e) {
        e.preventDefault();

        console.log('dragging');
        self.dropZone.removeClass('drop-zone--error');
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
                self.dropZone.addClass('drop-zone--error');
            } else {

                video.ready();
            }
        });
    });
};


function Page() {

    console.log('Init Page');
    this.dropZone = $('.drop-zone');
    this.rawPath = remote.app.getPath('videos');
    this.processedPath = remote.app.getPath('documents');
}

Page.prototype.setupInteractionHandlers = function() {

    $('.page-switch').click(function(e) {

        e.preventDefault();

        page.switch($(this).attr('data-page-target'));
    });

    $('.toggle-settings').click(function(e) {

        e.preventDefault();

        if($('#settings').hasClass('page--active')) {
            $('.footer__settings').removeClass('footer__settings--active');
            page.switch('main');
        } else {
            $('.footer__settings').addClass('footer__settings--active');
            page.switch('settings');
        }
    });
};

Page.prototype.switch = function(pageId) {

    $('.page--active').removeClass('page--active');
    $('#' + pageId).addClass('page--active');

    $('.header__title').text($('.page--active').attr('data-title'));

    $('.scroll').animate({ scrollTop: 0 }, 100);
};

function Preferences() {

}

Preferences.prototype.setupInteractionHandlers = function() {

    $('.page-switch').click(function(e) {

        e.preventDefault();

    });
};

Preferences.prototype.init = function() {

    console.log(config.all());

    if(config.has('pref-show-source-folder'))
        $('#pref-show-source-folder').prop('checked', config.get('pref-show-source-folder'));
    else
        $('#pref-show-source-folder').prop('checked', true);
};

function Video() {

    this.introRes = {
        width: 1920,
        height: 1080
    };

    var ffmpegPath = (process.platform === "darwin")? 'osx' : 'windows';

    this.ffmpeg = require('fluent-ffmpeg');
    this.ffmpeg.setFfmpegPath('ffmpeg-builds/' + ffmpegPath + '/ffmpeg');
    this.ffmpeg.setFfprobePath('ffmpeg-builds/' + ffmpegPath + '/ffprobe');
    this.ffmpeg.setFlvtoolPath('ffmpeg-builds/' + ffmpegPath + '/ffplay');

    this.videoProcessingContainer = $('.video-processing');
}

Video.prototype.setupInteractionHandlers = function() {


};

Video.prototype.ready = function() {

    video.videoProcessingContainer.addClass('video-processing--ready');
    fileSystem.dropZone.addClass('drop-zone--video-ready');
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

const remote = require('electron').remote;
const {dialog} = require('electron').remote;
const config = require('electron-json-config');

window.$ = window.jQuery = require('jquery');

// Third party libs
var _ = require('underscore'),
    $ = require('jquery'),
    path = require('path');

// Our app specific modules
var fileSystem = new FileSystem(),
    video = new Video(),
    page = new Page(),
    preferences = new Preferences();

fileSystem.setupInteractionHandlers();
video.setupInteractionHandlers();
page.setupInteractionHandlers();
preferences.setupInteractionHandlers();
preferences.init();

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
